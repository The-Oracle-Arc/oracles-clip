import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as relativeTime } from "./format-DfLFR-2I.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { s as PLATFORM_LABELS } from "./types-hvIGX_wW.mjs";
import { n as formatUsd } from "./earnings-BozjqwJ6.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { n as getEarnings, r as requestWithdrawal } from "./money-COh1Xgp8.mjs";
import { t as DemoBanner } from "./demo-banner-2mqmggnI.mjs";
import { t as EmptyState } from "./empty-state-DK6gRkXD.mjs";
import { t as Money } from "./money-BXj-iElC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/earnings-IVWqxXx2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EarningsPage() {
	const q = useQuery({
		queryKey: ["earnings"],
		queryFn: () => getEarnings()
	});
	const [msg, setMsg] = (0, import_react.useState)(null);
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	const d = q.data;
	if (!d) return null;
	const platforms = Object.entries(d.byPlatform);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
					children: "Money"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display text-4xl",
					children: "Earnings"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/withdraw",
						children: "Withdraw"
					})
				})]
			}),
			d.demoMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.summary.availableCents,
						label: "Available",
						size: "lg"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.summary.pendingCents,
						label: "Pending"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.summary.confirmedCents,
						label: "Confirmed"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Box, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.summary.estimatedCents,
						label: "Estimated",
						muted: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-stone",
						children: "Never mixed into available balance"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						cents: d.summary.withdrawnCents,
						label: "Paid out"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Box, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] uppercase tracking-wide text-stone",
						children: "Payouts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-lg font-medium",
						children: d.payoutsEnabled ? "Enabled" : "Not enabled"
					})] })
				]
			}),
			platforms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No ledger yet",
				body: "Confirmed earnings appear only when a platform reports them. Estimates stay labeled."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "By destination"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: platforms.map(([id, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: PLATFORM_LABELS[id] ?? id }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-stone",
									children: ["est. ", formatUsd(v.estimated)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2 text-line",
									children: "/"
								}),
								"confirmed ",
								formatUsd(v.confirmed)
							]
						})]
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Ledger"
				}), d.ledger.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-stone",
					children: "Empty. That is the correct state until money actually moves."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-line",
					children: d.ledger.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-medium",
							children: [
								row.kind,
								" · ",
								row.revenue_source
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-stone",
							children: [
								row.note,
								" · ",
								relativeTime(row.created_at)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "tabular font-medium",
								children: formatUsd(Number(row.amount_cents))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: row.status })]
						})]
					}, row.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: async () => {
					const res = await requestWithdrawal({ data: { amountCents: d.summary.availableCents } });
					setMsg(res.error);
				},
				children: "Request withdrawal"
			}), msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink-soft",
				children: msg
			}) : null] })
		]
	});
}
function Box({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-line bg-paper p-5 shadow-soft",
		children
	});
}
//#endregion
export { EarningsPage as component };
