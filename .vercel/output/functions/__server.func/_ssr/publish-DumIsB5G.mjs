import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { a as PLATFORMS } from "./types-hvIGX_wW.mjs";
import { a as notify, i as newId, o as sql, r as event, t as audit } from "./helpers-CmjLoKEF.mjs";
import { n as ensureCallerProfile } from "./profile-nag8fwPl.mjs";
import { r as rightsAllowsPublish, t as normalizeRightsStatus } from "./rights-Blc7xP7N.mjs";
import { t as enqueueStages } from "./factory-iVnNnG1d.mjs";
import { a as publishFailureMessage, i as platformCatalog, n as isPlatformConfigured, t as connectMessage } from "./platforms-2gZEaLPg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publish-DumIsB5G.js
var listPlatforms_createServerFn_handler = createServerRpc({
	id: "a82933418019a07798e5ff9327663eb2a9e3c4636eb5ef27724ac00023afdbd4",
	name: "listPlatforms",
	filename: "src/lib/server/publish.ts"
}, (opts) => listPlatforms.__executeServer(opts));
var listPlatforms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPlatforms_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const accounts = await db`
      select * from platform_accounts
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}`;
	const byId = new Map(accounts.map((a) => [String(a.platform), a]));
	return platformCatalog().map((p) => {
		const row = byId.get(p.id);
		return {
			...p,
			status: String(row?.status ?? (p.configured ? "not_connected" : "unavailable")),
			handle: row?.handle ? String(row.handle) : null,
			lastError: row?.last_error ? String(row.last_error) : null,
			connectedAt: row?.connected_at ? String(row.connected_at) : null
		};
	});
});
var connectPlatform_createServerFn_handler = createServerRpc({
	id: "054e275c0d1ca4d5bdf2a51f02a64c64cc745ca1c3083796ca1fe8e6c51aaaf2",
	name: "connectPlatform",
	filename: "src/lib/server/publish.ts"
}, (opts) => connectPlatform.__executeServer(opts));
var connectPlatform = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((platform) => String(platform)).handler(connectPlatform_createServerFn_handler, async ({ context, data: platform }) => {
	if (!PLATFORMS.includes(platform)) return {
		ok: false,
		error: "Unknown destination."
	};
	const db = await sql();
	await ensureCallerProfile(context.userId);
	const msg = connectMessage(platform);
	await db`insert into platform_accounts (id, user_id, platform, status, last_error, is_demo)
      values (${newId("plt")}, ${context.userId}, ${platform}, ${msg.status}, ${msg.message}, ${false})
      on conflict (user_id, platform, is_demo) do update set
        status = excluded.status, last_error = excluded.last_error, updated_at = now()`;
	await audit(db, {
		userId: context.userId,
		actorId: context.userId,
		action: "platform.connect_attempted",
		entityType: "platform",
		entityId: platform,
		detail: msg.status
	});
	return {
		ok: false,
		status: msg.status,
		message: msg.message
	};
});
var queuePublish_createServerFn_handler = createServerRpc({
	id: "12d0b4ec252b554d8e9cdc2af60714dcb3763d3b4eecf27454e129cc63ab44f5",
	name: "queuePublish",
	filename: "src/lib/server/publish.ts"
}, (opts) => queuePublish.__executeServer(opts));
var queuePublish = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(queuePublish_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await ensureCallerProfile(context.userId);
	if (data.platforms.length === 0) return {
		ok: false,
		error: "Choose at least one destination."
	};
	const clip = (await db`select * from clips where id = ${data.clipId} and user_id = ${context.userId} limit 1`)[0];
	if (!clip) return {
		ok: false,
		error: "Clip not found."
	};
	if (clip.is_demo) return {
		ok: false,
		error: "Demo clips cannot be published to real destinations."
	};
	if (clip.status === "blocked") return {
		ok: false,
		error: "This clip is blocked and cannot be published."
	};
	const decision = (await db`
      select * from compliance_decisions where clip_id = ${clip.id} order by created_at desc limit 1`)[0];
	if (decision?.publishable === "no") return {
		ok: false,
		error: "Compliance held this clip. It cannot go out."
	};
	if (decision && !rightsAllowsPublish(normalizeRightsStatus(decision.rights_status), true)) return {
		ok: false,
		error: "Rights are not clear enough to publish."
	};
	const results = [];
	for (const platform of data.platforms) {
		const account = (await db`
        select * from platform_accounts
        where user_id = ${context.userId} and platform = ${platform} and is_demo = false limit 1`)[0];
		const configured = isPlatformConfigured(platform);
		const connected = account?.status === "connected";
		const failure = publishFailureMessage({
			platform,
			connected,
			configured,
			status: account?.status
		});
		const pubId = newId("pub");
		await db`insert into publications (id, clip_id, user_id, platform, status, failure_reason, failure_code, is_demo)
        values (${pubId}, ${clip.id}, ${context.userId}, ${platform}, ${"failed"}, ${failure.message}, ${failure.code}, ${false})`;
		await db`insert into publishing_jobs (
        id, publication_id, user_id, clip_id, platform, stage, status, detail, is_demo
      ) values (
        ${newId("pjb")}, ${pubId}, ${context.userId}, ${clip.id}, ${platform}, ${"compliance"}, ${"failed"}, ${failure.message}, ${false}
      )`;
		results.push({
			platform,
			status: "failed",
			message: failure.message
		});
		await event(db, {
			userId: context.userId,
			clipId: clip.id,
			kind: "publish.held",
			message: failure.message
		});
	}
	await enqueueStages({
		userId: context.userId,
		clipId: clip.id,
		stages: ["queue", "publish"],
		type: "clip.publish",
		isDemo: false
	});
	await db`update clips set status = 'review', updated_at = now() where id = ${clip.id} and user_id = ${context.userId}`;
	await notify(db, {
		userId: context.userId,
		title: "Publishing held",
		body: results[0]?.message ?? "Destinations are not ready.",
		kind: "publish",
		href: `/content/${clip.id}`
	});
	await audit(db, {
		userId: context.userId,
		actorId: context.userId,
		action: "publish.attempted",
		entityType: "clip",
		entityId: clip.id,
		detail: results.map((r) => `${r.platform}:${r.status}`).join(",")
	});
	return {
		ok: true,
		results
	};
});
var listPublishing_createServerFn_handler = createServerRpc({
	id: "5c5a17a6415755e94916e8b78bfeded10a4892f9b83d37dfbd056652563bd6dc",
	name: "listPublishing",
	filename: "src/lib/server/publish.ts"
}, (opts) => listPublishing.__executeServer(opts));
var listPublishing = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPublishing_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const publications = await db`
      select p.*, c.title as clip_title, c.thumbnail_data_url, c.format
      from publications p
      join clips c on c.id = p.clip_id
      where p.user_id = ${context.userId} and p.is_demo = ${profile.demo_mode}
      order by p.created_at desc
      limit 50`;
	const ready = await db`
      select id, title, status, format, thumbnail_data_url, duration_seconds, created_at
      from clips
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
        and status in ('ready', 'review')
      order by updated_at desc
      limit 40`;
	return {
		demoMode: profile.demo_mode,
		publications,
		ready
	};
});
//#endregion
export { connectPlatform_createServerFn_handler, listPlatforms_createServerFn_handler, listPublishing_createServerFn_handler, queuePublish_createServerFn_handler };
