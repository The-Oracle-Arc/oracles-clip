import { i as handleFromName } from "./format-DfLFR-2I.mjs";
import { r as getSql } from "./db-idgu52P2.mjs";
import { a as PLATFORMS } from "./types-hvIGX_wW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/helpers-CmjLoKEF.js
function newId(prefix = "") {
	const id = crypto.randomUUID();
	return prefix ? `${prefix}_${id}` : id;
}
async function sql() {
	return getSql();
}
async function audit(db, input) {
	await db`insert into audit_events (id, user_id, actor_id, action, entity_type, entity_id, detail)
    values (${newId("aud")}, ${input.userId ?? null}, ${input.actorId ?? null}, ${input.action}, ${input.entityType ?? null}, ${input.entityId ?? null}, ${input.detail ?? null})`;
}
async function notify(db, input) {
	await db`insert into notifications (id, user_id, title, body, kind, href, is_demo)
    values (${newId("ntf")}, ${input.userId}, ${input.title}, ${input.body}, ${input.kind}, ${input.href ?? null}, ${input.isDemo ?? false})`;
}
async function uniqueHandle(db, base) {
	const clean = handleFromName(base);
	for (let i = 0; i < 12; i += 1) {
		const candidate = i === 0 ? clean : `${clean}${i + 1}`;
		if ((await db`select user_id from profiles where handle = ${candidate} limit 1`).length === 0) return candidate;
	}
	return `${clean}${crypto.randomUUID().slice(0, 6)}`;
}
async function ensureProfile(db, userId, displayName, email) {
	const existing = await db`select * from profiles where user_id = ${userId} limit 1`;
	if (existing[0]) return existing[0];
	const name = (displayName || email || "Creator").split("@")[0] || "Creator";
	await db`insert into profiles (user_id, display_name, handle)
    values (${userId}, ${name}, ${await uniqueHandle(db, name)})`;
	for (const platform of PLATFORMS) await db`insert into platform_accounts (id, user_id, platform, status, is_demo)
      values (${newId("plt")}, ${userId}, ${platform}, ${"not_connected"}, ${false})
      on conflict (user_id, platform, is_demo) do nothing`;
	await seedPolicies(db);
	await notify(db, {
		userId,
		title: "Welcome to Oracle's Clip",
		body: "Your account is ready. Create from work you own — estimated money is never treated as a payout.",
		kind: "system",
		href: "/home"
	});
	await audit(db, {
		userId,
		actorId: userId,
		action: "account.created",
		entityType: "profile",
		entityId: userId
	});
	return (await db`select * from profiles where user_id = ${userId} limit 1`)[0];
}
async function seedPolicies(db) {
	if (((await db`select count(*)::int as n from policies`)[0]?.n ?? 0) > 0) return;
	for (const [platform, topic, version, summary] of [
		[
			"youtube",
			"ai_disclosure",
			"2026.1",
			"YouTube requires disclosure of realistic synthetic or altered content where applicable."
		],
		[
			"youtube",
			"reused_content",
			"2026.1",
			"Reused content can limit monetization. Original, transformative work is evaluated separately from publishability."
		],
		[
			"tiktok",
			"aigc_label",
			"2026.1",
			"TikTok uses AIGC labels for AI-generated content. Caption assistance is not treated as automatic AIGC."
		],
		[
			"tiktok",
			"rate_limits",
			"2026.1",
			"Publishing APIs are quota-limited. Failed uploads remain queued rather than silently dropped."
		],
		[
			"instagram",
			"ai_info_label",
			"2026.1",
			"Meta AI labels apply to photorealistic generated or altered media."
		],
		[
			"x",
			"automation",
			"2026.1",
			"Automated posting must respect platform automation and spam rules."
		],
		[
			"all",
			"copyright",
			"2026.1",
			"Detected risk is not legal advice. Owned, licensed, public-domain, and authorized sources only."
		]
	]) await db`insert into policies (id, platform, topic, version, summary)
      values (${newId("pol")}, ${platform}, ${topic}, ${version}, ${summary})`;
}
async function event(db, input) {
	await db`insert into engine_events (id, job_id, user_id, clip_id, kind, message, payload_json, is_demo)
    values (${newId("evt")}, ${input.jobId ?? null}, ${input.userId ?? null}, ${input.clipId ?? null}, ${input.kind}, ${input.message}, ${input.payload ? JSON.stringify(input.payload) : null}, ${input.isDemo ?? false})`;
}
//#endregion
export { notify as a, newId as i, ensureProfile as n, sql as o, event as r, audit as t };
