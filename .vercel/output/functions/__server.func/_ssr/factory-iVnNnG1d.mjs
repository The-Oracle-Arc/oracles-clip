import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { n as FACTORY_STAGES, u as STAGE_LABELS } from "./types-hvIGX_wW.mjs";
import { i as newId, o as sql, r as event } from "./helpers-CmjLoKEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/factory-iVnNnG1d.js
async function enqueueStages(input) {
	const db = await sql();
	const isDemo = input.isDemo ?? false;
	const ids = [];
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
			isDemo
		});
	}
	return ids;
}
var tickFactory = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("c1462312af439a72509ecc256063d1f387f566caf2ed441e62c544e7c486bb2d"));
var getFactory = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f945112f12089433b54c47ac0048c04a6c567a5e654361ecacedb93a21b09822"));
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
var retryJob = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => String(id)).handler(createSsrRpc("5ffd9e79932769acde53aa892a5b07d988cfb3940ba140d261c90b16d9b31b5d"));
//#endregion
export { tickFactory as a, retryJob as i, getFactory as n, loadFactory as r, enqueueStages as t };
