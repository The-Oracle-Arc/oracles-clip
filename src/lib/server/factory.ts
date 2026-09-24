import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { newId } from "@/lib/ids";
import { detectMoments } from "@/lib/engine/clip-detect";
import { FACTORY_STAGES, STAGE_LABELS, type FactoryStage } from "@/lib/engine/types";
import { event, sql as getDb, type ProfileRow } from "./helpers";
import { ensureCallerProfile } from "./profile";

type JobRow = {
  id: string;
  user_id: string | null;
  clip_id: string | null;
  source_id: string | null;
  series_id: string | null;
  type: string;
  stage: string;
  status: string;
  progress: number;
  detail: string | null;
  error: string | null;
  retry_count: number;
  worker_id: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  finished_at: string | null;
};

export async function enqueueStages(input: {
  userId: string;
  stages: FactoryStage[];
  sourceId?: string | null;
  clipId?: string | null;
  seriesId?: string | null;
  type?: string;
  isDemo?: boolean;
}) {
  const db = await getDb();
  const isDemo = input.isDemo ?? false;
  const ids: string[] = [];
  for (const stage of input.stages) {
    const id = newId("job");
    ids.push(id);
    await db`insert into engine_jobs (
      id, user_id, clip_id, source_id, series_id, type, stage, status, progress, detail, is_demo
    ) values (
      ${id}, ${input.userId}, ${input.clipId ?? null}, ${input.sourceId ?? null}, ${input.seriesId ?? null},
      ${input.type ?? stage}, ${stage}, ${"queued"}, ${0}, ${STAGE_LABELS[stage]}, ${isDemo}
    )`;
    await event(db, {
      jobId: id,
      userId: input.userId,
      clipId: input.clipId,
      kind: "queued",
      message: `${STAGE_LABELS[stage]} queued`,
      isDemo,
    });
  }
  return ids;
}

async function finishUnderstand(job: JobRow) {
  const db = await getDb();
  if (!job.source_id) return;
  const sources = await db<{ id: string; title: string | null; duration_seconds: number | null }>`
    select id, title, duration_seconds from content_sources where id = ${job.source_id} limit 1`;
  const source = sources[0];
  if (!source) return;
  const moments = detectMoments({
    durationSeconds: Number(source.duration_seconds || 0),
    title: source.title,
  });
  await db`delete from clip_candidates where source_id = ${source.id}`;
  for (const m of moments) {
    await db`insert into clip_candidates (
      id, source_id, user_id, start_seconds, end_seconds, title_suggestion, hook, moment_kind, confidence, platform_fit_json, is_demo
    ) values (
      ${newId("cand")}, ${source.id}, ${job.user_id}, ${m.startSeconds}, ${m.endSeconds},
      ${m.titleSuggestion}, ${m.hook}, ${m.momentKind}, ${m.confidence}, ${JSON.stringify(m.platformFit)}, ${job.is_demo}
    )`;
  }
  await event(db, {
    jobId: job.id,
    userId: job.user_id,
    kind: "moments",
    message: `Found ${moments.length} candidate moment${moments.length === 1 ? "" : "s"}`,
    isDemo: job.is_demo,
  });
}

export async function tickUserJobs(userId: string, isDemo: boolean) {
  const db = await getDb();
  const running = await db<JobRow>`
    select * from engine_jobs
    where user_id = ${userId} and is_demo = ${isDemo} and status = 'running'
    order by updated_at asc
    limit 1`;
  const job = running[0];
  if (job) {
    const next = Math.min(100, Number(job.progress) + 38);
    if (next >= 100) {
      if (job.stage === "understand" || job.stage === "clip") {
        await finishUnderstand(job);
      }
      await db`update engine_jobs
        set status = 'succeeded', progress = 100, updated_at = now(), finished_at = now(), worker_id = ${"line-a"}
        where id = ${job.id} and status = 'running'`;
      await event(db, {
        jobId: job.id,
        userId,
        clipId: job.clip_id,
        kind: "succeeded",
        message: `${STAGE_LABELS[job.stage as FactoryStage] ?? job.stage} finished`,
        isDemo,
      });
    } else {
      await db`update engine_jobs
        set progress = ${next}, worker_id = ${"line-a"}, updated_at = now()
        where id = ${job.id} and status = 'running'`;
    }
    return { advanced: true };
  }

  const queued = await db<JobRow>`
    select * from engine_jobs
    where user_id = ${userId} and is_demo = ${isDemo} and status = 'queued'
    order by created_at asc
    limit 1`;
  if (queued[0]) {
    await db`update engine_jobs
      set status = 'running', progress = 14, worker_id = ${"line-a"}, updated_at = now()
      where id = ${queued[0].id} and status = 'queued'`;
    await event(db, {
      jobId: queued[0].id,
      userId,
      kind: "running",
      message: `${STAGE_LABELS[queued[0].stage as FactoryStage] ?? queued[0].stage} is on the line`,
      isDemo,
    });
    return { advanced: true };
  }
  return { advanced: false };
}

export const tickFactory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await ensureCallerProfile(context.userId);
    await tickUserJobs(context.userId, profile.demo_mode);
    return loadFactory(context.userId, profile);
  });

export const getFactory = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await ensureCallerProfile(context.userId);
    return loadFactory(context.userId, profile);
  });

export async function loadFactory(userId: string, profile: ProfileRow) {
  const db = await getDb();
  const demo = profile.demo_mode;
  const jobs = await db<JobRow>`
    select * from engine_jobs
    where user_id = ${userId} and is_demo = ${demo}
    order by created_at desc
    limit 80`;
  const events = await db<{
    id: string;
    job_id: string | null;
    kind: string;
    message: string;
    created_at: string;
  }>`
    select id, job_id, kind, message, created_at from engine_events
    where user_id = ${userId} and is_demo = ${demo}
    order by created_at desc
    limit 40`;

  const counts: Record<string, { queued: number; running: number; succeeded: number; failed: number }> = {};
  for (const stage of FACTORY_STAGES) {
    counts[stage] = { queued: 0, running: 0, succeeded: 0, failed: 0 };
  }
  for (const job of jobs) {
    const bucket = counts[job.stage];
    if (!bucket) continue;
    if (job.status === "queued") bucket.queued += 1;
    else if (job.status === "running" || job.status === "retrying") bucket.running += 1;
    else if (job.status === "succeeded") bucket.succeeded += 1;
    else if (job.status === "failed") bucket.failed += 1;
  }

  const active = jobs.filter((j) => j.status === "running" || j.status === "queued" || j.status === "retrying");
  return {
    demoMode: demo,
    jobs,
    events,
    counts,
    activeCount: active.length,
    workers: [
      {
        id: "line-a",
        name: "Line A",
        status: active.length ? "busy" : "idle",
        job: jobs.find((j) => j.status === "running") ?? null,
      },
      {
        id: "line-b",
        name: "Line B",
        status: "idle",
        job: null,
      },
    ],
  };
}

export const retryJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => String(id))
  .handler(async ({ context, data: id }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const rows = await db<JobRow>`
      select * from engine_jobs where id = ${id} and user_id = ${context.userId} limit 1`;
    const job = rows[0];
    if (!job) return { ok: false as const, error: "Job not found." };
    if (job.status !== "failed") return { ok: false as const, error: "Only failed jobs can be retried." };
    await db`update engine_jobs
      set status = 'queued', error = null, progress = 0, retry_count = retry_count + 1, updated_at = now(), finished_at = null
      where id = ${id} and user_id = ${context.userId}`;
    await event(db, {
      jobId: id,
      userId: context.userId,
      kind: "retry",
      message: "Job returned to the queue",
      isDemo: profile.demo_mode,
    });
    return { ok: true as const };
  });
