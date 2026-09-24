import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as relativeTime } from "./format-DfLFR-2I.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { n as asString } from "./cells-B7WhMGI2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { r as listPublishing } from "./publish-2e7g_sgF.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as DemoBanner } from "./demo-banner-2mqmggnI.mjs";
import { t as EmptyState } from "./empty-state-DK6gRkXD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publish-BaDY5NVe.js
var import_jsx_runtime = require_jsx_runtime();
function PublishPage() {
	const q = useQuery({
		queryKey: ["publishing"],
		queryFn: () => listPublishing()
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	const data = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
				children: "Outbound"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display text-4xl",
				children: "Publish"
			})] }),
			data?.demoMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Ready"
			}), data?.ready.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid gap-2",
				children: data.ready.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/content/$id",
					params: { id: asString(c.id) },
					className: "flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: asString(c.title)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(c.status) })]
				}) }, asString(c.id)))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				className: "mt-3",
				title: "Nothing waiting",
				body: "Package a clip first. Destinations that are not connected will not be marked live.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/create",
						children: "Create"
					})
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Attempts"
			}), data?.publications.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: data.publications.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-line bg-paper p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/content/$id",
								params: { id: asString(p.clip_id) },
								className: "font-medium",
								children: asString(p.clip_title)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(p.status) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-stone",
							children: [
								asString(p.platform),
								" · ",
								relativeTime(asString(p.created_at))
							]
						}),
						p.failure_reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ink-soft",
							children: asString(p.failure_reason)
						}) : null
					]
				}, asString(p.id)))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-stone",
				children: "No publication attempts yet."
			})] })
		]
	});
}
//#endregion
export { PublishPage as component };
