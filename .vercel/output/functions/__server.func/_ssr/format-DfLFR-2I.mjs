//#region node_modules/.nitro/vite/services/ssr/assets/format-DfLFR-2I.js
function greetingFor(date = /* @__PURE__ */ new Date()) {
	const h = date.getHours();
	if (h < 5) return "Good night";
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	return "Good evening";
}
function firstName(displayName) {
	const raw = (displayName || "").trim();
	if (!raw) return "there";
	return raw.split(/\s+/)[0] ?? raw;
}
function formatDuration(seconds) {
	const s = Math.max(0, Math.round(seconds || 0));
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const r = s % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return `${m}:${String(r).padStart(2, "0")}`;
}
function handleFromName(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18) || "creator";
}
function relativeTime(iso) {
	const d = typeof iso === "string" ? new Date(iso) : iso;
	const diff = Date.now() - d.getTime();
	const min = Math.round(diff / 6e4);
	if (min < 1) return "just now";
	if (min < 60) return `${min}m ago`;
	const hr = Math.round(min / 60);
	if (hr < 24) return `${hr}h ago`;
	const day = Math.round(hr / 24);
	if (day < 14) return `${day}d ago`;
	return d.toLocaleDateString();
}
//#endregion
export { relativeTime as a, handleFromName as i, formatDuration as n, greetingFor as r, firstName as t };
