import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { n as ensureProfile, o as sql } from "./helpers-CmjLoKEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-nag8fwPl.js
async function ensureCallerProfile(userId) {
	const db = await sql();
	const users = await db`
    select name, email from "user" where id = ${userId} limit 1`;
	return ensureProfile(db, userId, users[0]?.name ?? null, users[0]?.email ?? null);
}
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("43089abf67b0d2fc04dd8ee11c57f4f4a6f26a675e0ebab772a5634a77d97f36"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2516a54386004386c896f1a0ac5bdf163cb6fe80f8ce05136f7c7b30edbcc98d"));
var saveOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c16e6f22c3b2a5025cded76444caab53312cad50b7fbcbf8d2ccf7be87409535"));
var claimOperator = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("fd42b01e218bbfa9c40dc7292c93c5099c5ab2003cf7d2d3fe9d73919b17d699"));
//#endregion
export { updateMyProfile as a, saveOnboarding as i, ensureCallerProfile as n, getMyProfile as r, claimOperator as t };
