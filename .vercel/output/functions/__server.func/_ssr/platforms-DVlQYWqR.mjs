import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { n as listPlatforms, t as connectPlatform } from "./publish-2e7g_sgF.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/platforms-DVlQYWqR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlatformsPage() {
	const q = useQuery({
		queryKey: ["platforms"],
		queryFn: () => listPlatforms()
	});
	const [msg, setMsg] = (0, import_react.useState)(null);
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
					children: "Destinations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display text-4xl",
					children: "Platforms"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-ink-soft",
					children: "Connection uses official OAuth. Oracle’s Clip never asks for a password or an API secret. Unavailable means the adapter is not configured — not that you failed."
				})
			] }),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-line bg-paper px-4 py-3 text-sm",
				children: msg
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: q.data?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-line bg-paper p-5 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "display text-2xl",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: p.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-1 text-sm text-stone",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Shorts ", p.capabilities.shorts ? "supported" : "no"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Long form ", p.capabilities.longForm ? "supported" : "no"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Monetization signals ", p.capabilities.monetization ? "supported" : "not assumed"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["AI field ", p.capabilities.aiDisclosureField ?? "none mapped"] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							variant: "outline",
							onClick: async () => {
								const res = await connectPlatform({ data: p.id });
								setMsg(res.message ?? res.error ?? null);
								q.refetch();
							},
							children: "Connect"
						}),
						p.lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-stone",
							children: p.lastError
						}) : null
					]
				}, p.id))
			})
		]
	});
}
//#endregion
export { PlatformsPage as component };
