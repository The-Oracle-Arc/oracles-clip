import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state-DK6gRkXD.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ title, body, action, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl border border-dashed border-line bg-paper/60 px-6 py-10 text-center", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "display text-xl text-ink",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-stone",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: action
			}) : null
		]
	});
}
//#endregion
export { EmptyState as t };
