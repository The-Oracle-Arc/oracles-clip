//#region node_modules/.nitro/vite/services/ssr/assets/cells-B7WhMGI2.js
function asString(v, fallback = "") {
	if (v == null) return fallback;
	return String(v);
}
function asNumber(v) {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
}
//#endregion
export { asString as n, asNumber as t };
