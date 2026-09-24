import { getSql, type Sql } from "@/lib/db";
import { newId } from "@/lib/ids";
import { handleFromName } from "@/lib/format";
import { PLATFORMS } from "@/lib/engine/types";

export type AnyRow = { [key: string]: string | number | boolean | null };

export async function sql(): Promise<Sql> {
  return getSql();
}

export async function audit(
  db: Sql,
  input: {
    userId?: string | null;
    actorId?: string | null;
    action: string;
    entityType?: string;
    entityId?: string;
    detail?: string;
  },
) {
  await db`insert into audit_events (id, user_id, actor_id, action, entity_type, entity_id, detail)
    values (${newId("aud")}, ${input.userId ?? null}, ${input.actorId ?? null}, ${input.action}, ${input.entityType ?? null}, ${input.entityId ?? null}, ${input.detail ?? null})`;
}

export async function notify(
  db: Sql,
  input: { userId: string; title: string; body: string; kind: string; href?: string; isDemo?: boolean },
) {
  await db`insert into notifications (id, user_id, title, body, kind, href, is_demo)
    values (${newId("ntf")}, ${input.userId}, ${input.title}, ${input.body}, ${input.kind}, ${input.href ?? null}, ${input.isDemo ?? false})`;
}

export async function uniqueHandle(db: Sql, base: string): Promise<string> {
  const clean = handleFromName(base);
  for (let i = 0; i < 12; i += 1) {
    const candidate = i === 0 ? clean : `${clean}${i + 1}`;
    const rows = await db`select user_id from profiles where handle = ${candidate} limit 1`;
    if (rows.length === 0) return candidate;
  }
  return `${clean}${crypto.randomUUID().slice(0, 6)}`;
}

export type ProfileRow = {
  user_id: string;
  display_name: string;
  handle: string | null;
  bio: string | null;
  timezone: string | null;
  role: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  demo_mode: boolean;
  email_verified: boolean;
  payouts_acknowledged: boolean;
  created_at: string;
  updated_at: string;
};

export async function ensureProfile(
  db: Sql,
  userId: string,
  displayName: string | null,
  email: string | null,
): Promise<ProfileRow> {
  const existing = await db<ProfileRow>`select * from profiles where user_id = ${userId} limit 1`;
  if (existing[0]) return existing[0];

  const name = (displayName || email || "Creator").split("@")[0] || "Creator";
  const handle = await uniqueHandle(db, name);
  await db`insert into profiles (user_id, display_name, handle)
    values (${userId}, ${name}, ${handle})`;

  for (const platform of PLATFORMS) {
    await db`insert into platform_accounts (id, user_id, platform, status, is_demo)
      values (${newId("plt")}, ${userId}, ${platform}, ${"not_connected"}, ${false})
      on conflict (user_id, platform, is_demo) do nothing`;
  }

  await seedPolicies(db);
  await notify(db, {
    userId,
    title: "Welcome to Oracle's Clip",
    body: "Your account is ready. Create from work you own — estimated money is never treated as a payout.",
    kind: "system",
    href: "/home",
  });
  await audit(db, { userId, actorId: userId, action: "account.created", entityType: "profile", entityId: userId });

  const created = await db<ProfileRow>`select * from profiles where user_id = ${userId} limit 1`;
  return created[0]!;
}

export async function seedPolicies(db: Sql) {
  const count = await db<{ n: number }>`select count(*)::int as n from policies`;
  if ((count[0]?.n ?? 0) > 0) return;
  const rows: Array<[string, string, string, string]> = [
    ["youtube", "ai_disclosure", "2026.1", "YouTube requires disclosure of realistic synthetic or altered content where applicable."],
    ["youtube", "reused_content", "2026.1", "Reused content can limit monetization. Original, transformative work is evaluated separately from publishability."],
    ["tiktok", "aigc_label", "2026.1", "TikTok uses AIGC labels for AI-generated content. Caption assistance is not treated as automatic AIGC."],
    ["tiktok", "rate_limits", "2026.1", "Publishing APIs are quota-limited. Failed uploads remain queued rather than silently dropped."],
    ["instagram", "ai_info_label", "2026.1", "Meta AI labels apply to photorealistic generated or altered media."],
    ["x", "automation", "2026.1", "Automated posting must respect platform automation and spam rules."],
    ["all", "copyright", "2026.1", "Detected risk is not legal advice. Owned, licensed, public-domain, and authorized sources only."],
  ];
  for (const [platform, topic, version, summary] of rows) {
    await db`insert into policies (id, platform, topic, version, summary)
      values (${newId("pol")}, ${platform}, ${topic}, ${version}, ${summary})`;
  }
}

export async function event(
  db: Sql,
  input: {
    jobId?: string | null;
    userId?: string | null;
    clipId?: string | null;
    kind: string;
    message: string;
    payload?: unknown;
    isDemo?: boolean;
  },
) {
  await db`insert into engine_events (id, job_id, user_id, clip_id, kind, message, payload_json, is_demo)
    values (${newId("evt")}, ${input.jobId ?? null}, ${input.userId ?? null}, ${input.clipId ?? null}, ${input.kind}, ${input.message}, ${input.payload ? JSON.stringify(input.payload) : null}, ${input.isDemo ?? false})`;
}
