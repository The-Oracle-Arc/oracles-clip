import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { t as getAnalytics } from "./money-COh1Xgp8.mjs";
import { t as DemoBanner } from "./demo-banner-2mqmggnI.mjs";
import { t as EmptyState } from "./empty-state-DK6gRkXD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-DFGNOAqk.js
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	const q = useQuery({
		queryKey: ["analytics"],
		queryFn: () => getAnalytics()
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	const d = q.data;
	if (!d) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
				children: "Audience"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display text-4xl",
				children: "Analytics"
			})] }),
			d.demoMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Views",
						value: d.totals.views
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Qualified views",
						value: d.totals.qualified,
						hint: "Where the platform provides them"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Watch time (s)",
						value: d.totals.watch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Followers gained",
						value: d.totals.followers
					})
				]
			}),
			!d.hasAnalytics ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No performance yet",
				body: "Analytics appear after a destination returns them. Views are not treated as monetization views."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Revenue engine"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-4",
					children: d.recommendations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-ink-soft",
							children: r.recommendation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-stone",
							children: [
								r.reason,
								" · confidence ",
								Math.round(r.confidence * 100),
								"% · ",
								r.estimatedBand
							]
						})
					] }, r.title))
				})]
			})
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-paper p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] uppercase tracking-wide text-stone",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 tabular text-2xl font-medium",
				children: value.toLocaleString()
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-stone",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { AnalyticsPage as component };
