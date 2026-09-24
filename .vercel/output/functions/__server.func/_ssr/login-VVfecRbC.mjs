import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as GROK_PROVIDERS } from "./server-zMMkOYxQ.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as Input } from "./input-DRKCQBaX.mjs";
import { t as Label } from "./label-B4FujwPh.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as AuthFrame } from "./auth-frame-BKRnDn5_.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-VVfecRbC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/home" });
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		const { error: err } = await authClient.signIn.email({
			email,
			password,
			callbackURL: "/home"
		});
		setBusy(false);
		if (err) {
			setError(err.message ?? "Could not sign in.");
			return;
		}
		await navigate({ to: "/home" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthFrame, {
		kicker: "Welcome back",
		title: "Sign in",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"No account yet?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/signup",
				className: "text-forest underline-offset-4 hover:underline",
				children: "Create one"
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
								autoComplete: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/forgot-password",
									className: "text-xs text-stone hover:text-ink",
									children: "Forgot"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								autoComplete: "current-password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-rose",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							type: "submit",
							disabled: busy,
							children: busy ? "Signing in…" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-xs uppercase tracking-wide text-stone",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
						"or",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "w-full",
						onClick: () => signIn(p.providerId, { callbackURL: "/home" }),
						children: ["Continue with ", p.label]
					}, p.providerId))
				})
			]
		})
	});
}
//#endregion
export { Login as component };
