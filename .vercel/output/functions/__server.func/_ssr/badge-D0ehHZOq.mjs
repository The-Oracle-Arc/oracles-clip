import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-D0ehHZOq.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "stone", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
			stone: "bg-mist text-stone",
			forest: "bg-forest/10 text-forest",
			sage: "bg-sage/10 text-sage",
			amber: "bg-amber/10 text-amber",
			rose: "bg-rose/10 text-rose",
			sky: "bg-sky/10 text-sky"
		}[tone], className),
		children
	});
}
//#endregion
export { Badge as t };
