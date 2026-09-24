import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as relativeTime } from "./format-DfLFR-2I.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { n as FACTORY_STAGES, u as STAGE_LABELS } from "./types-hvIGX_wW.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as DemoBanner } from "./demo-banner-2mqmggnI.mjs";
import { a as tickFactory, i as retryJob, n as getFactory } from "./factory-iVnNnG1d.mjs";
import { t as Progress } from "./progress-CNYGhxK7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-bATSTjNx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EnginePage() {
	const q = useQuery({
		queryKey: ["factory"],
		queryFn: () => getFactory()
	});
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => {
			tickFactory().then(() => q.refetch());
		}, 1100);
		return () => window.clearInterval(t);
	}, [q]);
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" });
	const d = q.data;
	if (!d) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
					children: "Operating system"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display text-4xl",
					children: "Engine Room"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-ink-soft",
					children: "The factory behind your studio. Jobs are real. Empty is idle — not broken."
				})
			] }),
			d.demoMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: d.workers.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-line bg-paper p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-medium",
							children: w.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("live-dot", w.status === "busy" ? "" : "live-dot-stone") }), w.status]
						})]
					}), w.job ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-ink-soft",
								children: STAGE_LABELS[w.job.stage] ?? w.job.stage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-2",
								value: Number(w.job.progress)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 tabular text-xs text-stone",
								children: [w.job.progress, "%"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-stone",
						children: "Waiting for work"
					})]
				}, w.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Line"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-max gap-2",
					children: FACTORY_STAGES.map((stage) => {
						const c = d.counts[stage];
						const live = (c?.running ?? 0) > 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-28 rounded-lg border border-line bg-raised p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("live-dot", live ? "" : "live-dot-stone") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-wide text-stone",
										children: STAGE_LABELS[stage]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 tabular text-xl font-medium",
									children: (c?.queued ?? 0) + (c?.running ?? 0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-stone",
									children: [
										c?.succeeded ?? 0,
										" done · ",
										c?.failed ?? 0,
										" failed"
									]
								})
							]
						}, stage);
					})
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-paper p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Jobs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 max-h-96 space-y-2 overflow-auto",
						children: [d.jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-stone",
							children: "No jobs."
						}) : null, d.jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "capitalize",
								children: j.stage
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-stone",
								children: j.detail
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: j.status }), j.status === "failed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: async () => {
										await retryJob({ data: j.id });
										q.refetch();
									},
									children: "Retry"
								}) : null]
							})]
						}, j.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-paper p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 max-h-96 space-y-2 overflow-auto text-sm",
						children: d.events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.message }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-stone",
								children: relativeTime(e.created_at)
							})]
						}, e.id))
					})]
				})]
			})
		]
	});
}
//#endregion
export { EnginePage as component };
