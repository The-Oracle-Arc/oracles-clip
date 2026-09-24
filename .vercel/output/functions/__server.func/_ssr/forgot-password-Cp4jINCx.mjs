import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as Input } from "./input-DRKCQBaX.mjs";
import { t as Label } from "./label-B4FujwPh.mjs";
import { t as AuthFrame } from "./auth-frame-BKRnDn5_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-Cp4jINCx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Forgot() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setMessage("Password reset email cannot be sent until email delivery is configured.");
		setBusy(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthFrame, {
		kicker: "Account recovery",
		title: "Reset password",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			className: "text-forest underline-offset-4 hover:underline",
			children: "Back to sign in"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})]
				}),
				message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: message
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					type: "submit",
					disabled: busy,
					children: busy ? "Sending…" : "Send reset link"
				})
			]
		})
	});
}
//#endregion
export { Forgot as component };
