import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help-D0HsVgJ-.js
var import_jsx_runtime = require_jsx_runtime();
function HelpPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
			children: "Support"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "display text-4xl",
			children: "Help"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 text-sm text-ink-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Oracle’s Clip is your content business. The Engine Room is the machine underneath." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Create from sources you own or have permission to use. Estimated earnings are labeled and never treated as a balance. Confirmed earnings wait on a platform. Payouts stay off until a provider is configured." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Publishing uses official OAuth. If a destination is unavailable, it is not connected — we will not pretend otherwise." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Demo Mode in ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/settings",
						className: "text-forest",
						children: "Settings"
					}),
					" walks the factory with sample data. Demo money cannot be withdrawn."
				] })
			]
		})]
	});
}
//#endregion
export { HelpPage as component };
