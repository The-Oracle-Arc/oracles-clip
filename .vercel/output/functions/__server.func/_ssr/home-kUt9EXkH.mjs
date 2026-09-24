import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as relativeTime, r as greetingFor, t as firstName } from "./format-DfLFR-2I.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { p as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { n as asString } from "./cells-B7WhMGI2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { n as FACTORY_STAGES, u as STAGE_LABELS } from "./types-hvIGX_wW.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as DemoBanner } from "./demo-banner-2mqmggnI.mjs";
import { t as EmptyState } from "./empty-state-DK6gRkXD.mjs";
import { a as tickFactory } from "./factory-iVnNnG1d.mjs";
import { t as Money } from "./money-BXj-iElC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-kUt9EXkH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("12f4ab217857644cafeba5584ea11337588ccfb271c4926d9a37286345b8bdf9"));
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-line bg-paper shadow-soft", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("px-5 pt-5 pb-3", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("text-base font-medium tracking-tight text-ink", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("px-5 pb-5", className),
		...props
	});
}
function FactoryStrip({ counts, compact = false }) {
	const stages = compact ? [
		"ingest",
		"clip",
		"render",
		"policy",
		"publish",
		"analyze"
	] : [...FACTORY_STAGES];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: stages.map((stage) => {
			const c = counts[stage] ?? {
				queued: 0,
				running: 0,
				succeeded: 0,
				failed: 0
			};
			const live = c.running > 0;
			const total = c.queued + c.running + c.succeeded + c.failed;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("min-w-[108px] rounded-lg border border-line bg-raised px-3 py-2", live && "border-forest/30"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("live-dot", live ? "" : "live-dot-stone") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium uppercase tracking-wide text-stone",
						children: STAGE_LABELS[stage]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 tabular text-lg font-medium text-ink",
					children: total
				})]
			}, stage);
		})
	});
}
function HomePage() {
	const home = useQuery({
		queryKey: ["home"],
		queryFn: () => getHome()
	});
	(0, import_react.useEffect)(() => {
		if (!home.data?.factory.activeCount) return;
		const t = window.setInterval(() => {
			tickFactory().then(() => home.refetch());
		}, 1200);
		return () => window.clearInterval(t);
	}, [home.data?.factory.activeCount, home]);
	if (home.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36 w-full" })]
	});
	if (!home.data) return null;
	const d = home.data;
	const name = firstName(d.profile.display_name);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			d.demoMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.18em] text-stone",
					children: greetingFor()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display mt-1 text-4xl text-ink md:text-5xl",
					children: name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/create",
							children: "Create a clip"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/earnings",
							children: "View earnings"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.money.availableCents,
						label: "Available",
						size: "lg"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.money.pendingCents,
						label: "Pending"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-stone",
						children: "Confirmed, not yet available"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.money.estimatedCents,
						label: "Estimated",
						muted: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-stone",
						children: "Not a payout"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.money.confirmedCents,
						label: "Confirmed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-stone",
						children: "Lifetime, when platforms report it"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Views",
						value: d.analytics.views
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Engagement",
						value: d.analytics.engagements
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Followers gained",
						value: d.analytics.followers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Active series",
						value: d.seriesCount
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Content factory" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-stone",
					children: d.factory.activeCount ? `${d.factory.activeCount} job${d.factory.activeCount === 1 ? "" : "s"} on the line` : "The line is idle"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/engine",
						children: ["Engine Room ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactoryStrip, {
				counts: d.factory.counts,
				compact: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2 text-sm sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Processing",
						value: d.byStatus.processing ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Ready to publish",
						value: d.byStatus.ready ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Review",
						value: d.byStatus.review ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Published",
						value: (d.byStatus.published ?? 0) + (d.byStatus.live ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Connections needing attention",
						value: d.platformAttention
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Clips created",
						value: d.clipsCreated
					})
				]
			})] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent clips" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: d.recentClips.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nothing on the floor yet",
					body: "Upload a source you own. The factory will find moments — it will not invent an audience.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/create",
							children: "Create a clip"
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line",
					children: d.recentClips.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/content/$id",
						params: { id: asString(c.id) },
						className: "flex items-center justify-between gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: asString(c.title)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-stone",
								children: [
									asString(c.format),
									" · ",
									relativeTime(asString(c.created_at))
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(c.status) })]
					}) }, asString(c.id)))
				}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "What to make next" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-4",
					children: (d.opportunities.length ? d.opportunities : d.recommendations).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: asString(o.title)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-ink-soft",
							children: asString("recommendation" in o ? o.recommendation : o.reason)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-stone",
							children: asString(o.reason)
						})
					] }, asString(o.title)))
				})] })]
			})
		]
	});
}
function StatCard({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-line bg-paper p-5 shadow-soft",
		children
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-paper px-5 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-medium uppercase tracking-[0.14em] text-stone",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 tabular text-2xl font-medium",
			children: value.toLocaleString()
		})]
	});
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-md bg-mist/60 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-stone",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular font-medium",
			children: value
		})]
	});
}
//#endregion
export { HomePage as component };
