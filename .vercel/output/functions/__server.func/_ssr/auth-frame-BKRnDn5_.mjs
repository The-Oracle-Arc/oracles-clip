import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Wordmark } from "./mark-DdLTZkXE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-frame-BKRnDn5_.js
var import_jsx_runtime = require_jsx_runtime();
function AuthFrame({ kicker, title, children, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid min-h-dvh max-w-6xl md:grid-cols-[1.1fr_0.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hidden flex-col justify-between px-12 py-10 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium uppercase tracking-[0.18em] text-stone",
								children: "Create · Publish · Earn"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "display mt-4 text-5xl leading-[1.05] text-ink",
								children: "A studio for work you actually own."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-base text-ink-soft",
								children: "Estimated money is labeled. Confirmed money waits on the platform. Payouts stay off until a provider is configured."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-stone",
						children: "Oracle’s Clip never asks for a destination password."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex items-center justify-center px-5 py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-xl border border-line bg-paper p-6 shadow-soft md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-6 md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						}),
						kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
							children: kicker
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display mt-1 text-3xl text-ink",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children
						}),
						footer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 text-sm text-stone",
							children: footer
						}) : null
					]
				})
			})]
		})
	});
}
//#endregion
export { AuthFrame as t };
