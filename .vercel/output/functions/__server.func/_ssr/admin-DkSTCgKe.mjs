import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { o as sql } from "./helpers-CmjLoKEF.mjs";
import { n as ensureCallerProfile } from "./profile-nag8fwPl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DkSTCgKe.js
async function requireOperator(userId) {
	const profile = await ensureCallerProfile(userId);
	if (profile.role !== "operator") throw new Error("Operator access required.");
	return profile;
}
var getAdminOverview_createServerFn_handler = createServerRpc({
	id: "e5bf6ef5ca6f7c26de29c1c6b19ec76887c31a9570882199379930e50283a51d",
	name: "getAdminOverview",
	filename: "src/lib/server/admin.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminOverview_createServerFn_handler, async ({ context }) => {
	await requireOperator(context.userId);
	const db = await sql();
	const users = await db`select count(*)::int as n from profiles`;
	const clips = await db`select count(*)::int as n from clips`;
	const jobs = await db`select status, count(*)::int as n from engine_jobs group by status`;
	const pubs = await db`select count(*)::int as n from publications`;
	const audit = await db`select * from audit_events order by created_at desc limit 40`;
	const failed = await db`select * from engine_jobs where status = 'failed' order by updated_at desc limit 20`;
	return {
		users: users[0]?.n ?? 0,
		clips: clips[0]?.n ?? 0,
		publications: pubs[0]?.n ?? 0,
		jobs,
		audit,
		failed
	};
});
var listUsersAdmin_createServerFn_handler = createServerRpc({
	id: "2fb0171e9fa68cbd1250176d8f73c54fea6b67aead481796588fd815900d6f96",
	name: "listUsersAdmin",
	filename: "src/lib/server/admin.ts"
}, (opts) => listUsersAdmin.__executeServer(opts));
var listUsersAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listUsersAdmin_createServerFn_handler, async ({ context }) => {
	await requireOperator(context.userId);
	return (await sql())`select user_id, display_name, handle, role, demo_mode, onboarding_completed, created_at from profiles order by created_at desc`;
});
//#endregion
export { getAdminOverview_createServerFn_handler, listUsersAdmin_createServerFn_handler };
