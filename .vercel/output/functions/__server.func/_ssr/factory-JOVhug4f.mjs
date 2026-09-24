import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { n as FACTORY_STAGES, u as STAGE_LABELS } from "./types-hvIGX_wW.mjs";
import { i as newId, o as sql, r as event } from "./helpers-CmjLoKEF.mjs";
import { n as ensureCallerProfile } from "./profile-nag8fwPl.mjs";
import { t as detectMoments } from "./clip-detect-goKREYyv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/factory-JOVhug4f.js
async function finishUnderstand(job) {
	const db = await sql();
	if (!job.source_id) return;
	const source = (await db`
    select id, title, duration_seconds from content_sources where id = ${job.source_id} limit 1`)[0];
	if (!source) return;
	const moments = detectMoments({
		durationSeconds: Number(source.duration_seconds || 0),
		title: source.title
	});
	await db`delete from clip_candidates where source_id = ${source.id}`;
	for (const m of moments) await db`insert into clip_candidates (
      id, source_id, user_id, start_seconds, end_seconds, title_suggestion, hook, moment_kind, confidence, platform_fit_json, is_demo
    ) values (
      ${newId("cand")}, ${source.id}, ${job.user_id}, ${m.startSeconds}, ${m.endSeconds},
      ${m.titleSuggestion}, ${m.hook}, ${m.momentKind}, ${m.confidence}, ${JSON.stringify(m.platformFit)}, ${job.is_demo}
    )`;
	await event(db, {
		jobId: job.id,
		userId: job.user_id,
		kind: "moments",
		message: `Found ${moments.length} candidate moment${moments.length === 1 ? "" : "s"}`,
		isDemo: job.is_demo
	});
}
async function tickUserJobs(userId, isDemo) {
	const db = await sql();
	const job = (await db`
    select * from engine_jobs
    where user_id = ${userId} and is_demo = ${isDemo} and status = 'running'
    order by updated_at asc
    limit 1`)[0];
	if (job) {
		const next = Math.min(100, Number(job.progress) + 38);
		if (next >= 100) {
			if (job.stage === "understand" || job.stage === "clip") await finishUnderstand(job);
			await db`update engine_jobs
        set status = 'succeeded', progress = 100, updated_at = now(), finished_at = now(), worker_id = ${"line-a"}
        where id = ${job.id} and status = 'running'`;
			await event(db, {
				jobId: job.id,
				userId,
				clipId: job.clip_id,
				kind: "succeeded",
				message: `${STAGE_LABELS[job.stage] ?? job.stage} finished`,
				isDemo
			});
		} else await db`update engine_jobs
        set progress = ${next}, worker_id = ${"line-a"}, updated_at = now()
        where id = ${job.id} and status = 'running'`;
		return { advanced: true };
	}
	const queued = await db`
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
			message: `${STAGE_LABELS[queued[0].stage] ?? queued[0].stage} is on the line`,
			isDemo
		});
		return { advanced: true };
	}
	return { advanced: false };
}
var tickFactory_createServerFn_handler = createServerRpc({
	id: "c1462312af439a72509ecc256063d1f387f566caf2ed441e62c544e7c486bb2d",
	name: "tickFactory",
	filename: "src/lib/server/factory.ts"
}, (opts) => tickFactory.__executeServer(opts));
var tickFactory = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(tickFactory_createServerFn_handler, async ({ context }) => {
	const profile = await ensureCallerProfile(context.userId);
	await tickUserJobs(context.userId, profile.demo_mode);
	return loadFactory(context.userId, profile);
});
var getFactory_createServerFn_handler = createServerRpc({
	id: "f945112f12089433b54c47ac0048c04a6c567a5e654361ecacedb93a21b09822",
	name: "getFactory",
	filename: "src/lib/server/factory.ts"
}, (opts) => getFactory.__executeServer(opts));
var getFactory = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getFactory_createServerFn_handler, async ({ context }) => {
	const profile = await ensureCallerProfile(context.userId);
	return loadFactory(context.userId, profile);
});
async function loadFactory(userId, profile) {
	const db = await sql();
	const demo = profile.demo_mode;
	const jobs = await db`
    select * from engine_jobs
    where user_id = ${userId} and is_demo = ${demo}
    order by created_at desc
    limit 80`;
	const events = await db`
    select id, job_id, kind, message, created_at from engine_events
    where user_id = ${userId} and is_demo = ${demo}
    order by created_at desc
    limit 40`;
	const counts = {};
	for (const stage of FACTORY_STAGES) counts[stage] = {
		queued: 0,
		running: 0,
		succeeded: 0,
		failed: 0
	};
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
		workers: [{
			id: "line-a",
			name: "Line A",
			status: active.length ? "busy" : "idle",
			job: jobs.find((j) => j.status === "running") ?? null
		}, {
			id: "line-b",
			name: "Line B",
			status: "idle",
			job: null
		}]
	};
}
var retryJob_createServerFn_handler = createServerRpc({
	id: "5ffd9e79932769acde53aa892a5b07d988cfb3940ba140d261c90b16d9b31b5d",
	name: "retryJob",
	filename: "src/lib/server/factory.ts"
}, (opts) => retryJob.__executeServer(opts));
var retryJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => String(id)).handler(retryJob_createServerFn_handler, async ({ context, data: id }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const job = (await db`
      select * from engine_jobs where id = ${id} and user_id = ${context.userId} limit 1`)[0];
	if (!job) return {
		ok: false,
		error: "Job not found."
	};
	if (job.status !== "failed") return {
		ok: false,
		error: "Only failed jobs can be retried."
	};
	await db`update engine_jobs
      set status = 'queued', error = null, progress = 0, retry_count = retry_count + 1, updated_at = now(), finished_at = null
      where id = ${id} and user_id = ${context.userId}`;
	await event(db, {
		jobId: id,
		userId: context.userId,
		kind: "retry",
		message: "Job returned to the queue",
		isDemo: profile.demo_mode
	});
	return { ok: true };
});
//#endregion
export { getFactory_createServerFn_handler, retryJob_createServerFn_handler, tickFactory_createServerFn_handler };
