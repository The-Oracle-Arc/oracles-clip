import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { newId } from "@/lib/ids";
import { evaluateCompliance } from "@/lib/engine/compliance";
import { sql as getDb } from "./helpers";
import { ensureCallerProfile } from "./profile";
import { enqueueStages } from "./factory";

export const setDemoMode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { enabled: boolean }) => input)
  .handler(async ({ context, data }) => {
    const db = await getDb();
    await ensureCallerProfile(context.userId);
    await db`update profiles set demo_mode = ${data.enabled}, updated_at = now() where user_id = ${context.userId}`;
    if (data.enabled) await seedDemo(context.userId);
    return { ok: true as const, demoMode: data.enabled };
  });

async function seedDemo(userId: string) {
  const db = await getDb();
  const existing = await db`select id from series where user_id = ${userId} and is_demo = true limit 1`;
  if (existing[0]) return;

  const sourceId = newId("src");
  await db`insert into content_sources (
    id, user_id, kind, title, duration_seconds, rights_status, ownership_confirmed, notes, is_demo
  ) values (
    ${sourceId}, ${userId}, ${"upload"}, ${"Harbor diary — original footage"}, ${1860}, ${"owned"}, ${true},
    ${"Demo source. Not a real file."}, ${true}
  )`;

  const seriesId = newId("ser");
  await db`insert into series (id, user_id, source_id, name, description, genre, rights_status, status, is_demo)
    values (${seriesId}, ${userId}, ${sourceId}, ${"Harbor Lights"}, ${"A quiet original travel diary. Demo only."}, ${"documentary"}, ${"owned"}, ${"live"}, ${true})`;

  const episodes = [
    { n: 1, title: "Harbor Lights — Episode 01: The beginning", hook: "Morning on the water before the town wakes.", start: 0, end: 54, views: 18420, est: 1240, conf: 0 },
    { n: 2, title: "Harbor Lights — Episode 02: What changes", hook: "The weather turns and the walk gets quieter.", start: 54, end: 118, views: 22110, est: 1680, conf: 0 },
    { n: 3, title: "Harbor Lights — Episode 03: The middle", hook: "A conversation on the pier that the camera almost missed.", start: 118, end: 176, views: 30940, est: 2140, conf: 0 },
  ];

  for (const ep of episodes) {
    const clipId = newId("clp");
    await db`insert into clips (
      id, user_id, source_id, series_id, episode_number, title, hook, format, status,
      start_seconds, end_seconds, duration_seconds, is_demo
    ) values (
      ${clipId}, ${userId}, ${sourceId}, ${seriesId}, ${ep.n}, ${ep.title}, ${ep.hook}, ${"episode"}, ${"live"},
      ${ep.start}, ${ep.end}, ${ep.end - ep.start}, ${true}
    )`;
    const decision = evaluateCompliance({
      rightsStatus: "owned",
      ownershipConfirmed: true,
      format: "episode",
      aiAssistedCaptions: true,
      aiGeneratedVisuals: false,
      aiGeneratedVoice: false,
      commercialIntent: false,
      transformative: {
        commentary: true,
        analysis: false,
        narration: true,
        substantialEditing: true,
        reaction: false,
        education: false,
        context: true,
      },
      repetitionRisk: "LOW",
      durationSeconds: ep.end - ep.start,
      title: ep.title,
    });
    await db`insert into compliance_decisions (
      id, clip_id, user_id, publishable, ai_disclosure, commercial_disclosure, copyright_risk,
      monetization, account_risk, content_repetition_risk, rights_status, rationale, policy_version, is_demo
    ) values (
      ${newId("cmp")}, ${clipId}, ${userId}, ${decision.publishable}, ${decision.aiDisclosure},
      ${decision.commercialDisclosure}, ${decision.copyrightRisk}, ${decision.monetization},
      ${decision.accountRisk}, ${decision.contentRepetitionRisk}, ${decision.rightsStatus},
      ${decision.rationale.join("\n")}, ${decision.policyVersion}, ${true}
    )`;
    await db`insert into publications (id, clip_id, user_id, platform, status, is_demo)
      values (${newId("pub")}, ${clipId}, ${userId}, ${"youtube"}, ${"published"}, ${true})`;
    await db`insert into analytics_snapshots (
      id, user_id, clip_id, series_id, platform, views, qualified_views, watch_time_seconds, engagements, likes, shares, followers_gained, is_demo
    ) values (
      ${newId("anl")}, ${userId}, ${clipId}, ${seriesId}, ${"youtube"}, ${ep.views}, ${Math.round(ep.views * 0.62)}, ${ep.views * 28}, ${Math.round(ep.views * 0.07)}, ${Math.round(ep.views * 0.05)}, ${Math.round(ep.views * 0.01)}, ${ep.n * 12}, ${true}
    )`;
    await db`insert into earnings_ledger (
      id, user_id, clip_id, series_id, platform, revenue_source, kind, status, amount_cents, note, is_demo
    ) values (
      ${newId("led")}, ${userId}, ${clipId}, ${seriesId}, ${"youtube"}, ${"platform"}, ${"estimated"}, ${"pending"}, ${ep.est}, ${"Demo estimate — not withdrawable."}, ${true}
    )`;
  }

  await db`insert into platform_accounts (id, user_id, platform, status, handle, is_demo)
    values (${newId("plt")}, ${userId}, ${"youtube"}, ${"connected"}, ${"@harborlights-demo"}, ${true})
    on conflict (user_id, platform, is_demo) do update set status = excluded.status, handle = excluded.handle`;

  await db`insert into revenue_opportunities (
    id, user_id, series_id, title, recommendation, platform, format, estimated_band, confidence, reason, is_demo
  ) values (
    ${newId("opp")}, ${userId}, ${seriesId}, ${"Continue Harbor Lights"},
    ${"Finish two more episodes with real continuity, then publish only where the demo audience already is."},
    ${"youtube"}, ${"episode"}, ${"MEDIUM"}, ${0.62},
    ${"Demo recommendation based on sample retention in this series — not production data."}, ${true}
  )`;

  await enqueueStages({
    userId,
    sourceId,
    seriesId,
    stages: ["analyze", "learn"],
    type: "demo.loop",
    isDemo: true,
  });
}
