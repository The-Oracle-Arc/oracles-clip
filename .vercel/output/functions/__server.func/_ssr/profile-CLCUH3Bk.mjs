import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { n as ensureProfile, o as sql } from "./helpers-CmjLoKEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CLCUH3Bk.js
async function ensureCallerProfile(userId) {
	const db = await sql();
	const users = await db`
    select name, email from "user" where id = ${userId} limit 1`;
	return ensureProfile(db, userId, users[0]?.name ?? null, users[0]?.email ?? null);
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "43089abf67b0d2fc04dd8ee11c57f4f4a6f26a675e0ebab772a5634a77d97f36",
	name: "getMyProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const profile = await ensureCallerProfile(context.userId);
	const users = await (await sql())`select email from "user" where id = ${context.userId} limit 1`;
	return {
		...profile,
		email: users[0]?.email ?? null
	};
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "2516a54386004386c896f1a0ac5bdf163cb6fe80f8ce05136f7c7b30edbcc98d",
	name: "updateMyProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const displayName = (data.displayName ?? profile.display_name).trim() || profile.display_name;
	const handle = (data.handle ?? profile.handle ?? "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 24);
	const bio = data.bio ?? profile.bio;
	const timezone = data.timezone ?? profile.timezone;
	if (handle) {
		if ((await db`select user_id from profiles where handle = ${handle} and user_id <> ${context.userId} limit 1`)[0]) return {
			ok: false,
			error: "That handle is already taken."
		};
	}
	await db`update profiles
      set display_name = ${displayName},
          handle = ${handle || profile.handle},
          bio = ${bio},
          timezone = ${timezone},
          updated_at = now()
      where user_id = ${context.userId}`;
	return { ok: true };
});
var saveOnboarding_createServerFn_handler = createServerRpc({
	id: "c16e6f22c3b2a5025cded76444caab53312cad50b7fbcbf8d2ccf7be87409535",
	name: "saveOnboarding",
	filename: "src/lib/server/profile.ts"
}, (opts) => saveOnboarding.__executeServer(opts));
var saveOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveOnboarding_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await ensureCallerProfile(context.userId);
	await db`update profiles
      set display_name = coalesce(${data.displayName?.trim() ?? null}, display_name),
          bio = coalesce(${data.bio ?? null}, bio),
          timezone = coalesce(${data.timezone ?? null}, timezone),
          onboarding_step = ${data.step},
          onboarding_completed = ${Boolean(data.complete)},
          updated_at = now()
      where user_id = ${context.userId}`;
	return { ok: true };
});
var claimOperator_createServerFn_handler = createServerRpc({
	id: "fd42b01e218bbfa9c40dc7292c93c5099c5ab2003cf7d2d3fe9d73919b17d699",
	name: "claimOperator",
	filename: "src/lib/server/profile.ts"
}, (opts) => claimOperator.__executeServer(opts));
var claimOperator = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimOperator_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	await ensureCallerProfile(context.userId);
	if (((await db`select count(*)::int as n from profiles where role = 'operator'`)[0]?.n ?? 0) > 0) return {
		ok: false,
		error: "An operator already exists. Ask them to grant access."
	};
	await db`update profiles set role = 'operator', updated_at = now() where user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { claimOperator_createServerFn_handler, getMyProfile_createServerFn_handler, saveOnboarding_createServerFn_handler, updateMyProfile_createServerFn_handler };
