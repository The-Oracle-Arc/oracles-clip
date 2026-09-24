import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as asString, t as asNumber } from "./cells-B7WhMGI2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { c as listSeries } from "./content-Cryr-qN7.mjs";
import { n as formatUsd } from "./earnings-BozjqwJ6.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { r as getMyProfile } from "./profile-nag8fwPl.mjs";
import { t as DemoBanner } from "./demo-banner-2mqmggnI.mjs";
import { t as EmptyState } from "./empty-state-DK6gRkXD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/series-BfOqhTnE.js
var import_jsx_runtime = require_jsx_runtime();
function SeriesPage() {
	const q = useQuery({
		queryKey: ["series"],
		queryFn: () => listSeries()
	});
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile()
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
					children: "Franchises"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display text-4xl",
					children: "Series"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/create",
						children: "New series"
					})
				})]
			}),
			profile.data?.demo_mode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}) : null,
			q.data && q.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No series yet",
				body: "Turn a long source into numbered episodes with continuity — not a stack of identical hooks.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/create",
						children: "Start from a source"
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: q.data?.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/series/$id",
					params: { id: asString(s.id) },
					className: "rounded-xl border border-line bg-paper p-5 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display text-2xl",
							children: asString(s.name)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-ink-soft",
							children: asString(s.description)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-wide text-stone",
							children: asString(s.genre)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-6 text-sm text-stone",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [asNumber(s.episode_count), " episodes"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular",
								children: [asNumber(s.views).toLocaleString(), " views"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular",
								children: ["confirmed ", formatUsd(asNumber(s.confirmed_cents))]
							})
						]
					})]
				}, asString(s.id)))
			})
		]
	});
}
//#endregion
export { SeriesPage as component };
