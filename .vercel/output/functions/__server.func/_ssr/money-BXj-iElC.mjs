import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as formatUsd } from "./earnings-BozjqwJ6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-BXj-iElC.js
var import_jsx_runtime = require_jsx_runtime();
function Money({ cents, label, size = "md", muted = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-w-0", muted && "opacity-80"),
		children: [label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-medium uppercase tracking-[0.14em] text-stone",
			children: label
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("tabular tracking-tight text-ink", size === "lg" && "display text-4xl font-medium", size === "md" && "text-2xl font-medium", size === "sm" && "text-base font-medium"),
			children: formatUsd(cents)
		})]
	});
}
//#endregion
export { Money as t };
