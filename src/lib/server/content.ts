import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { newId } from "@/lib/ids";
import { segmentEpisodes } from "@/lib/engine/clip-detect";
import { evaluateCompliance } from "@/lib/engine/compliance";
import { assessRepetition } from "@/lib/engine/repetition";
import { normalizeRightsStatus, rightsAllowsProcessing } from "@/lib/engine/rights";
import type { ClipFormat, FactoryStage, RightsStatus, TransformativeSignals } from "@/lib/engine/types";
import { audit, event, notify, sql as getDb, type AnyRow } from "./helpers";
import { ensureCallerProfile } from "./profile";
import { enqueueStages } from "./factory";

const DEFAULT_TRANSFORM: TransformativeSignals = {
  commentary: false,
  analysis: false,
  narration: false,
  substantialEditing: true,
  reaction: false,
  education: false,
  context: false,
};

async function fetchOEmbed(url: string): Promise<{ title?: string; thumbnail?: string } | null> {
  const endpoints = [
    `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  ];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) continue;
      const data = (await res.json()) as { title?: string; thumbnail_url?: string };
      return { title: data.title, thumbnail: data.thumbnail_url };
    } catch {
      /* try next */
    }
  }
  return null;
}

export const ingestSource = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      kind: "upload" | "url" | "library";
      title?: string;
      originalFilename?: string;
      mimeType?: string;
      durationSeconds?: number;
      width?: number;
      height?: number;
      fileSizeBytes?: number;
      sourceUrl?: string;
      thumbnailDataUrl?: string;
      rightsStatus: RightsStatus;
      ownershipConfirmed: boolean;
      notes?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    if (!data.ownershipConfirmed) {
      return { ok: false as const, error: "Confirm that you own this content or have permission to use it." };
    }
    const rights = normalizeRightsStatus(data.rightsStatus);
    if (!rightsAllowsProcessing(rights, data.ownershipConfirmed)) {
      return { ok: false as const, error: "This source cannot be processed with the current rights status." };
    }
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    let title = data.title?.trim() || data.originalFilename || "Untitled source";
    let thumbnail = data.thumbnailDataUrl ?? null;
    if (data.kind === "url" && data.sourceUrl) {
      const embed = await fetchOEmbed(data.sourceUrl);
      if (embed?.title && !data.title) title = embed.title;
      if (embed?.thumbnail && !thumbnail) thumbnail = embed.thumbnail;
    }
    if (thumbnail && thumbnail.length > 180_000) thumbnail = null;

    const id = newId("src");
    await db<AnyRow>`insert into content_sources (
      id, user_id, kind, title, original_filename, mime_type, duration_seconds, width, height,
      file_size_bytes, source_url, thumbnail_data_url, rights_status, ownership_confirmed, notes, is_demo
    ) values (
      ${id}, ${context.userId}, ${data.kind}, ${title}, ${data.originalFilename ?? null}, ${data.mimeType ?? null},
      ${data.durationSeconds ?? null}, ${data.width ?? null}, ${data.height ?? null}, ${data.fileSizeBytes ?? null},
      ${data.sourceUrl ?? null}, ${thumbnail}, ${rights}, ${true}, ${data.notes ?? null}, ${false}
    )`;
    await enqueueStages({
      userId: context.userId,
      sourceId: id,
      stages: ["ingest", "understand", "clip"],
      type: "source.analyze",
      isDemo: false,
    });
    await audit(db, {
      userId: context.userId,
      actorId: context.userId,
      action: "source.ingested",
      entityType: "source",
      entityId: id,
      detail: rights,
    });
    await notify(db, {
      userId: context.userId,
      title: "Source accepted",
      body: `${title} is on the line. The factory is finding moments now.`,
      kind: "factory",
      href: "/create",
    });
    return { ok: true as const, sourceId: id, demoMode: profile.demo_mode };
  });

export const listSources = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    return db<AnyRow>`
      select id, kind, title, duration_seconds, rights_status, thumbnail_data_url, created_at
      from content_sources
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc
      limit 50`;
  });

export const getSourceAnalysis = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((sourceId: unknown) => String(sourceId))
  .handler(async ({ context, data: sourceId }) => {
    const db = await getDb();
    const sources = await db<AnyRow>`
      select * from content_sources where id = ${sourceId} and user_id = ${context.userId} limit 1`;
    const source = sources[0];
    if (!source) return { ok: false as const, error: "Source not found." };
    const jobs = await db<AnyRow>`
      select id, stage, status, progress, detail from engine_jobs
      where source_id = ${sourceId} and user_id = ${context.userId}
      order by created_at asc`;
    const candidates = await db<AnyRow>`
      select * from clip_candidates where source_id = ${sourceId} and user_id = ${context.userId}
      order by start_seconds asc`;
    const pending = jobs.filter((j) => j.status === "queued" || j.status === "running");
    if (jobs.length === 0) {
      await enqueueStages({
        userId: context.userId,
        sourceId,
        stages: ["ingest", "understand", "clip"],
        type: "source.analyze",
        isDemo: false,
      });
    }
    return {
      ok: true as const,
      source,
      jobs,
      candidates,
      ready: pending.length === 0 && candidates.length > 0,
    };
  });

type CreateClipsInput = {
  sourceId: string;
  candidateIds: string[];
  format: ClipFormat;
  aspectRatio?: string;
  captionStyle?: string;
  brandingEnabled?: boolean;
  aiAssistedCaptions?: boolean;
  aiGeneratedVisuals?: boolean;
  aiGeneratedVoice?: boolean;
  commercialIntent?: boolean;
  transformative?: Partial<TransformativeSignals>;
  edits?: Record<string, { title?: string; description?: string; hook?: string; hashtags?: string; start?: number; end?: number }>;
};

export const createClipsFromCandidates = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: CreateClipsInput) => input)
  .handler(async ({ context, data }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const sources = await db<AnyRow>`
      select * from content_sources where id = ${data.sourceId} and user_id = ${context.userId} limit 1`;
    const source = sources[0] as
      | {
          id: string;
          title: string | null;
          rights_status: string;
          ownership_confirmed: boolean;
          thumbnail_data_url: string | null;
        }
      | undefined;
    if (!source) return { ok: false as const, error: "Source not found." };
    if (data.candidateIds.length === 0) return { ok: false as const, error: "Select at least one moment." };

    const prior = await db<{ title: string; hook: string | null; description: string | null }>`
      select title, hook, description from clips where user_id = ${context.userId} and is_demo = false
      order by created_at desc limit 40`;

    const created: string[] = [];
    for (const candidateId of data.candidateIds) {
      const cands = await db<AnyRow>`
        select * from clip_candidates where id = ${candidateId} and user_id = ${context.userId} and source_id = ${data.sourceId} limit 1`;
      const cand = cands[0] as
        | {
            id: string;
            start_seconds: number;
            end_seconds: number;
            title_suggestion: string | null;
            hook: string | null;
            confidence: number | null;
          }
        | undefined;
      if (!cand) continue;
      const edit = data.edits?.[candidateId] ?? {};
      const title = (edit.title || cand.title_suggestion || source.title || "Untitled clip").trim();
      const hook = (edit.hook || cand.hook || "").trim();
      const description = (edit.description || "").trim();
      const start = edit.start ?? Number(cand.start_seconds);
      const end = edit.end ?? Number(cand.end_seconds);
      const repetition = assessRepetition({
        title,
        hook,
        description,
        previous: prior.map((p) => ({ title: p.title, hook: p.hook || "", description: p.description || "" })),
      });
      const id = newId("clp");
      await db<AnyRow>`insert into clips (
        id, user_id, source_id, title, description, hook, hashtags, format, aspect_ratio, status,
        start_seconds, end_seconds, duration_seconds, thumbnail_data_url, caption_style, branding_enabled,
        confidence, is_demo
      ) values (
        ${id}, ${context.userId}, ${source.id}, ${title}, ${description}, ${hook}, ${edit.hashtags ?? null},
        ${data.format}, ${data.aspectRatio ?? "9:16"}, ${"processing"},
        ${start}, ${end}, ${Math.max(0, end - start)}, ${source.thumbnail_data_url},
        ${data.captionStyle ?? "clean"}, ${Boolean(data.brandingEnabled)}, ${cand.confidence}, ${false}
      )`;
      await db<AnyRow>`update clip_candidates set selected = true where id = ${cand.id}`;
      const decision = evaluateCompliance({
        rightsStatus: normalizeRightsStatus(source.rights_status),
        ownershipConfirmed: Boolean(source.ownership_confirmed),
        format: data.format,
        aiAssistedCaptions: Boolean(data.aiAssistedCaptions),
        aiGeneratedVisuals: Boolean(data.aiGeneratedVisuals),
        aiGeneratedVoice: Boolean(data.aiGeneratedVoice),
        commercialIntent: Boolean(data.commercialIntent),
        transformative: { ...DEFAULT_TRANSFORM, ...data.transformative },
        repetitionRisk: repetition.risk,
        durationSeconds: Math.max(0, end - start),
        title,
      });
      await db<AnyRow>`insert into compliance_decisions (
        id, clip_id, user_id, publishable, ai_disclosure, commercial_disclosure, copyright_risk,
        monetization, account_risk, content_repetition_risk, rights_status, rationale, policy_version, is_demo
      ) values (
        ${newId("cmp")}, ${id}, ${context.userId}, ${decision.publishable}, ${decision.aiDisclosure},
        ${decision.commercialDisclosure}, ${decision.copyrightRisk}, ${decision.monetization},
        ${decision.accountRisk}, ${decision.contentRepetitionRisk}, ${decision.rightsStatus},
        ${decision.rationale.join("\n")}, ${decision.policyVersion}, ${false}
      )`;
      const stages: FactoryStage[] = ["edit", "ai", "render", "quality", "rights", "policy", "monetization", "package"];
      await enqueueStages({
        userId: context.userId,
        clipId: id,
        sourceId: source.id,
        stages,
        type: "clip.package",
        isDemo: false,
      });
      const nextStatus =
        decision.publishable === "no" ? "blocked" : decision.publishable === "review" ? "review" : "ready";
      await db<AnyRow>`update clips set status = ${nextStatus}, updated_at = now() where id = ${id}`;
      created.push(id);
      prior.unshift({ title, hook, description });
    }

    if (created.length === 0) return { ok: false as const, error: "No clips could be created." };
    await notify(db, {
      userId: context.userId,
      title: created.length === 1 ? "Clip packaged" : `${created.length} clips packaged`,
      body: "Open Content to review compliance, then publish only what you are willing to stand behind.",
      kind: "content",
      href: "/content",
    });
    return { ok: true as const, clipIds: created, demoMode: profile.demo_mode };
  });

export const createSeriesFromSource = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      sourceId: string;
      name: string;
      description?: string;
      genre?: string;
      format?: ClipFormat;
      targetSeconds?: number;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const db = await getDb();
    await ensureCallerProfile(context.userId);
    const sources = await db<AnyRow>`
      select * from content_sources where id = ${data.sourceId} and user_id = ${context.userId} limit 1`;
    const source = sources[0] as
      | {
          id: string;
          title: string | null;
          duration_seconds: number | null;
          rights_status: string;
          ownership_confirmed: boolean;
          thumbnail_data_url: string | null;
        }
      | undefined;
    if (!source) return { ok: false as const, error: "Source not found." };
    const name = data.name.trim();
    if (!name) return { ok: false as const, error: "Name the series." };
    const episodes = segmentEpisodes({
      durationSeconds: Number(source.duration_seconds || 0),
      seriesName: name,
      targetSeconds: data.targetSeconds,
    });
    const seriesId = newId("ser");
    await db<AnyRow>`insert into series (id, user_id, source_id, name, description, genre, rights_status, status, is_demo)
      values (${seriesId}, ${context.userId}, ${source.id}, ${name}, ${data.description ?? null}, ${data.genre ?? null}, ${source.rights_status}, ${"ready"}, ${false})`;
    const clipIds: string[] = [];
    for (const ep of episodes) {
      const id = newId("clp");
      clipIds.push(id);
      await db<AnyRow>`insert into clips (
        id, user_id, source_id, series_id, episode_number, title, hook, format, status,
        start_seconds, end_seconds, duration_seconds, thumbnail_data_url, is_demo
      ) values (
        ${id}, ${context.userId}, ${source.id}, ${seriesId}, ${ep.episodeNumber}, ${ep.title}, ${ep.hook},
        ${data.format ?? "episode"}, ${"ready"}, ${ep.startSeconds}, ${ep.endSeconds},
        ${ep.endSeconds - ep.startSeconds}, ${source.thumbnail_data_url}, ${false}
      )`;
      const decision = evaluateCompliance({
        rightsStatus: normalizeRightsStatus(source.rights_status),
        ownershipConfirmed: Boolean(source.ownership_confirmed),
        format: data.format ?? "episode",
        aiAssistedCaptions: false,
        aiGeneratedVisuals: false,
        aiGeneratedVoice: false,
        commercialIntent: false,
        transformative: { ...DEFAULT_TRANSFORM, commentary: true, context: true },
        repetitionRisk: "LOW",
        durationSeconds: ep.endSeconds - ep.startSeconds,
        title: ep.title,
      });
      await db<AnyRow>`insert into compliance_decisions (
        id, clip_id, user_id, publishable, ai_disclosure, commercial_disclosure, copyright_risk,
        monetization, account_risk, content_repetition_risk, rights_status, rationale, policy_version, is_demo
      ) values (
        ${newId("cmp")}, ${id}, ${context.userId}, ${decision.publishable}, ${decision.aiDisclosure},
        ${decision.commercialDisclosure}, ${decision.copyrightRisk}, ${decision.monetization},
        ${decision.accountRisk}, ${decision.contentRepetitionRisk}, ${decision.rightsStatus},
        ${decision.rationale.join("\n")}, ${decision.policyVersion}, ${false}
      )`;
    }
    await enqueueStages({
      userId: context.userId,
      sourceId: source.id,
      seriesId,
      stages: ["understand", "clip", "package"],
      type: "series.build",
      isDemo: false,
    });
    await event(db, {
      userId: context.userId,
      kind: "series",
      message: `Series “${name}” created with ${episodes.length} episode${episodes.length === 1 ? "" : "s"}`,
    });
    return { ok: true as const, seriesId, clipIds, episodeCount: episodes.length };
  });

export const listContent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { query?: string; status?: string } | undefined) => input ?? {})
  .handler(async ({ context, data }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const status = data.status && data.status !== "all" ? data.status : null;
    const q = data.query?.trim() ? `%${data.query.trim().toLowerCase()}%` : null;
    const rows = await db<AnyRow>`
      select c.*, s.name as series_name,
        (select p.platform from publications p where p.clip_id = c.id order by p.created_at desc limit 1) as last_platform,
        (select p.status from publications p where p.clip_id = c.id order by p.created_at desc limit 1) as last_publish_status,
        (select d.copyright_risk from compliance_decisions d where d.clip_id = c.id order by d.created_at desc limit 1) as copyright_risk,
        (select d.monetization from compliance_decisions d where d.clip_id = c.id order by d.created_at desc limit 1) as monetization,
        (select d.publishable from compliance_decisions d where d.clip_id = c.id order by d.created_at desc limit 1) as publishable,
        coalesce((select sum(a.views)::int from analytics_snapshots a where a.clip_id = c.id), 0) as views,
        coalesce((select sum(e.amount_cents)::int from earnings_ledger e where e.clip_id = c.id and e.kind = 'confirmed'), 0) as confirmed_cents,
        coalesce((select sum(e.amount_cents)::int from earnings_ledger e where e.clip_id = c.id and e.kind = 'estimated'), 0) as estimated_cents
      from clips c
      left join series s on s.id = c.series_id
      where c.user_id = ${context.userId}
        and c.is_demo = ${profile.demo_mode}
        and (${status}::text is null or c.status = ${status})
        and (${q}::text is null or lower(c.title) like ${q})
      order by c.created_at desc
      limit 80`;
    return { demoMode: profile.demo_mode, clips: rows };
  });

export const getClip = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => String(id))
  .handler(async ({ context, data: id }) => {
    const db = await getDb();
    const clips = await db<AnyRow>`select * from clips where id = ${id} and user_id = ${context.userId} limit 1`;
    const clip = clips[0];
    if (!clip) return { ok: false as const, error: "Clip not found." };
    const compliance = await db<AnyRow>`select * from compliance_decisions where clip_id = ${id} order by created_at desc limit 1`;
    const publications = await db<AnyRow>`select * from publications where clip_id = ${id} order by created_at desc`;
    const jobs = await db<AnyRow>`select * from engine_jobs where clip_id = ${id} order by created_at asc`;
    const events = await db<AnyRow>`select * from engine_events where clip_id = ${id} order by created_at desc limit 30`;
    const analytics = await db<AnyRow>`select * from analytics_snapshots where clip_id = ${id} order by collected_at desc`;
    const ledger = await db<AnyRow>`select * from earnings_ledger where clip_id = ${id} order by created_at desc`;
    const series = clip.series_id
      ? (await db<AnyRow>`select * from series where id = ${String(clip.series_id)} and user_id = ${context.userId} limit 1`)[0] ?? null
      : null;
    return {
      ok: true as const,
      clip,
      series,
      compliance: compliance[0] ?? null,
      publications,
      jobs,
      events,
      analytics,
      ledger,
    };
  });

export const updateClip = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: string;
      title?: string;
      description?: string;
      hook?: string;
      hashtags?: string;
      startSeconds?: number;
      endSeconds?: number;
      format?: ClipFormat;
      aspectRatio?: string;
      captionStyle?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const db = await getDb();
    const clips = await db<AnyRow>`select * from clips where id = ${data.id} and user_id = ${context.userId} limit 1`;
    if (!clips[0]) return { ok: false as const, error: "Clip not found." };
    const start = data.startSeconds ?? Number(clips[0].start_seconds);
    const end = data.endSeconds ?? Number(clips[0].end_seconds);
    await db<AnyRow>`update clips set
      title = coalesce(${data.title ?? null}, title),
      description = coalesce(${data.description ?? null}, description),
      hook = coalesce(${data.hook ?? null}, hook),
      hashtags = coalesce(${data.hashtags ?? null}, hashtags),
      format = coalesce(${data.format ?? null}, format),
      aspect_ratio = coalesce(${data.aspectRatio ?? null}, aspect_ratio),
      caption_style = coalesce(${data.captionStyle ?? null}, caption_style),
      start_seconds = ${start},
      end_seconds = ${end},
      duration_seconds = ${Math.max(0, end - start)},
      updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}`;
    await db<AnyRow>`insert into clip_versions (id, clip_id, user_id, version_number, spec_json)
      values (${newId("ver")}, ${data.id}, ${context.userId},
        (select coalesce(max(version_number), 0) + 1 from clip_versions where clip_id = ${data.id}),
        ${JSON.stringify(data)})`;
    return { ok: true as const };
  });

export const listSeries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    return db<AnyRow>`
      select s.*,
        (select count(*)::int from clips c where c.series_id = s.id) as episode_count,
        coalesce((select sum(a.views)::int from analytics_snapshots a where a.series_id = s.id), 0) as views,
        coalesce((select sum(e.amount_cents)::int from earnings_ledger e where e.series_id = s.id and e.kind = 'confirmed'), 0) as confirmed_cents
      from series s
      where s.user_id = ${context.userId} and s.is_demo = ${profile.demo_mode}
      order by s.created_at desc`;
  });

export const getSeries = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => String(id))
  .handler(async ({ context, data: id }) => {
    const db = await getDb();
    const rows = await db<AnyRow>`select * from series where id = ${id} and user_id = ${context.userId} limit 1`;
    if (!rows[0]) return { ok: false as const, error: "Series not found." };
    const episodes = await db<AnyRow>`select * from clips where series_id = ${id} and user_id = ${context.userId} order by episode_number asc`;
    return { ok: true as const, series: rows[0], episodes };
  });
