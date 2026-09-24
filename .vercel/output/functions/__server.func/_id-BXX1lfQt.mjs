import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as formatDuration } from "./_ssr/format-DfLFR-2I.mjs";
import { t as useQuery } from "./_libs/tanstack__react-query.mjs";
import { n as Route$1 } from "./_ssr/router-Fm6d9Ypi.mjs";
import { t as StatusPill } from "./_ssr/status-pill-DB4qvBy2.mjs";
import { n as asString, t as asNumber } from "./_ssr/cells-B7WhMGI2.mjs";
import { t as Skeleton } from "./_ssr/skeleton-Co-_KBin.mjs";
import { i as getSeries } from "./_ssr/content-Cryr-qN7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BXX1lfQt.js
var import_jsx_runtime = require_jsx_runtime();
function SeriesDetail() {
	const { id } = Route$1.useParams();
	const q = useQuery({
		queryKey: ["series", id],
		queryFn: () => getSeries({ data: id })
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	if (!q.data?.ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-stone",
		children: "Series not found."
	});
	const { series, episodes } = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/series",
				className: "text-sm text-stone",
				children: "Series"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display mt-2 text-4xl",
				children: asString(series.name)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-ink-soft",
				children: asString(series.description)
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-2",
			children: episodes.map((ep) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/content/$id",
				params: { id: asString(ep.id) },
				className: "flex items-center justify-between gap-3 rounded-xl border border-line bg-paper p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs uppercase tracking-wide text-stone",
						children: ["Episode ", String(asNumber(ep.episode_number)).padStart(2, "0")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: asString(ep.title)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-stone",
						children: asString(ep.hook)
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-stone",
						children: formatDuration(asNumber(ep.duration_seconds))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(ep.status) })]
				})]
			}) }, asString(ep.id)))
		})]
	});
}
//#endregion
export { SeriesDetail as component };
