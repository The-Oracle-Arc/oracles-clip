import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Badge } from "./badge-D0ehHZOq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-banner-2mqmggnI.js
var import_jsx_runtime = require_jsx_runtime();
function DemoBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3 rounded-lg border border-amber/20 bg-amber/8 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			tone: "amber",
			children: "Demo mode"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink-soft",
			children: "Figures and publications on this screen are simulated sample data. They are not confirmed earnings and cannot be withdrawn."
		})]
	});
}
//#endregion
export { DemoBanner as t };
