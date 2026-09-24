import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { n as formatUsd } from "./earnings-BozjqwJ6.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { n as getEarnings, r as requestWithdrawal } from "./money-COh1Xgp8.mjs";
import { t as Money } from "./money-BXj-iElC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/withdraw-DFeLDRYd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WithdrawPage() {
	const q = useQuery({
		queryKey: ["earnings"],
		queryFn: () => getEarnings()
	});
	const [msg, setMsg] = (0, import_react.useState)(null);
	if (q.isPending || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	const d = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
			children: "Payouts"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "display text-4xl",
			children: "Withdraw"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-line bg-paper p-5 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
					cents: d.summary.availableCents,
					label: "Available confirmed",
					size: "lg"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-1 text-sm text-ink-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Minimum" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular",
								children: formatUsd(d.minWithdrawalCents)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Fees" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "None configured" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Destination" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Payouts are not yet enabled" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Estimated time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "—" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: async () => {
						const res = await requestWithdrawal({ data: { amountCents: d.summary.availableCents } });
						setMsg(res.error ?? "Payouts are not yet enabled.");
					},
					children: "Confirm withdrawal"
				}),
				msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: msg
				}) : null
			]
		})]
	});
}
//#endregion
export { WithdrawPage as component };
