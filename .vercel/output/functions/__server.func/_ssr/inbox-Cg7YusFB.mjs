import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { o as sql } from "./helpers-CmjLoKEF.mjs";
import { n as ensureCallerProfile } from "./profile-nag8fwPl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inbox-Cg7YusFB.js
var listNotifications_createServerFn_handler = createServerRpc({
	id: "a1c46ac5264cda97d831346b151c063b1002e7f346ebf97d57993558fbb04602",
	name: "listNotifications",
	filename: "src/lib/server/inbox.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	return db`
      select * from notifications
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc
      limit 40`;
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "e7b564e84784d975e3c3bfdc127f1594ac86b66035be9e718460329c75313e5c",
	name: "markNotificationsRead",
	filename: "src/lib/server/inbox.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await sql())`update notifications set read_at = now()
      where user_id = ${context.userId} and read_at is null`;
	return { ok: true };
});
var listPolicies_createServerFn_handler = createServerRpc({
	id: "0448bb338d6383b31c1b636f665c7b644e4a18079639640bad1b24970e18d661",
	name: "listPolicies",
	filename: "src/lib/server/inbox.ts"
}, (opts) => listPolicies.__executeServer(opts));
var listPolicies = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPolicies_createServerFn_handler, async () => {
	const db = await sql();
	return {
		policies: await db`select * from policies order by platform, topic`,
		changes: await db`select * from policy_changes order by created_at desc limit 30`
	};
});
//#endregion
export { listNotifications_createServerFn_handler, listPolicies_createServerFn_handler, markNotificationsRead_createServerFn_handler };
