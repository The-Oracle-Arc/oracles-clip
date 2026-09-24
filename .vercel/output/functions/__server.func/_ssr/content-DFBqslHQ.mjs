import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as formatDuration } from "./format-DfLFR-2I.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { n as asString, t as asNumber } from "./cells-B7WhMGI2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { s as listContent } from "./content-Cryr-qN7.mjs";
import { n as formatUsd } from "./earnings-BozjqwJ6.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as Input } from "./input-DRKCQBaX.mjs";
import { t as DemoBanner } from "./demo-banner-2mqmggnI.mjs";
import { t as EmptyState } from "./empty-state-DK6gRkXD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-DFBqslHQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	"all",
	"draft",
	"processing",
	"ready",
	"published",
	"review",
	"blocked",
	"failed"
];
function ContentPage() {
	const [status, setStatus] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const list = useQuery({
		queryKey: [
			"content",
			status,
			query
		],
		queryFn: () => listContent({ data: {
			status,
			query
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
					children: "Library"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display text-4xl",
					children: "Content"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/create",
						children: "Create"
					})
				})]
			}),
			list.data?.demoMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search titles",
					className: "sm:max-w-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStatus(f),
						className: `rounded-full px-3 py-1.5 text-xs uppercase tracking-wide ${status === f ? "bg-forest text-forest-fg" : "bg-mist text-stone"}`,
						children: f
					}, f))
				})]
			}),
			list.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" }) : null,
			list.data && list.data.clips.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "The library is empty",
				body: "Create from a source you own. Nothing here is invented to look busy.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/create",
						children: "Create a clip"
					})
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: list.data?.clips.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/content/$id",
					params: { id: asString(c.id) },
					className: "flex flex-col gap-3 rounded-xl border border-line bg-paper p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-medium",
							children: asString(c.title)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap gap-2 text-xs text-stone",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: asString(c.format) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(asNumber(c.duration_seconds)) }),
								c.last_platform ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: asString(c.last_platform) }) : null
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(c.status) }),
							c.copyright_risk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(c.copyright_risk) }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-stone",
								children: [asNumber(c.views).toLocaleString(), " views"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-stone",
									children: "est. "
								}), formatUsd(asNumber(c.estimated_cents))]
							})
						]
					})]
				}, asString(c.id)))
			})
		]
	});
}
//#endregion
export { ContentPage as component };
