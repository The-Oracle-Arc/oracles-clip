import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mark-DdLTZkXE.js
var import_jsx_runtime = require_jsx_runtime();
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-7", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				className: "fill-forest"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 8.5c-4.1 0-7.5 3.2-7.5 7.5S11.9 23.5 16 23.5 23.5 20.3 23.5 16 20.1 8.5 16 8.5zm0 2.2c2.9 0 5.3 2.3 5.3 5.3S18.9 21.3 16 21.3 10.7 19 10.7 16 13.1 10.7 16 10.7z",
				className: "fill-forest-fg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "21.2",
				y: "21.2",
				width: "5.2",
				height: "1.7",
				rx: "0.6",
				className: "fill-forest-fg"
			})
		]
	});
}
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2.5 text-ink", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "display text-[17px] leading-none tracking-tight",
			children: ["Oracle’s ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "italic",
				children: "Clip"
			})]
		})]
	});
}
//#endregion
export { Wordmark as t };
