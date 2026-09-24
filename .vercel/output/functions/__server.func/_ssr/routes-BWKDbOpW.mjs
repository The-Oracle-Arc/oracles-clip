import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { p as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as Wordmark } from "./mark-DdLTZkXE.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BWKDbOpW.js
var import_jsx_runtime = require_jsx_runtime();
var LOOP = [
	"Create",
	"Publish",
	"Grow",
	"Earn",
	"Reinvest"
];
function Landing() {
	const { user, isPending } = useCurrentUserState();
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, { to: "/home" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-canvas text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-6xl items-center justify-between px-5 py-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: "Sign in"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						children: "Create account"
					})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-5 pb-24 pt-10 md:pt-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.2em] text-stone",
					children: "Creator business"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display mt-4 max-w-3xl text-5xl leading-[1.04] text-ink md:text-7xl",
					children: "Turn footage you own into a repeating content practice."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-xl text-lg text-ink-soft",
					children: "Oracle’s Clip is an earning account powered by a quiet factory: ingest, clip, comply, publish, measure. It will not pretend a view is a payout."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/signup",
							children: ["Open an account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "I already have one"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 flex flex-wrap gap-2",
					children: LOOP.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-line bg-paper px-4 py-2 text-sm",
							children: step
						}), i < LOOP.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-stone",
							children: "→"
						}) : null]
					}, step))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-16 grid gap-4 md:grid-cols-3",
					children: [
						{
							title: "Your account, not a console",
							body: "Home shows available, pending, estimated, and confirmed money as four different numbers — empty until they are real."
						},
						{
							title: "A factory you can open",
							body: "The Engine Room is the machine: jobs, queues, policy, retries. Most days you never need it."
						},
						{
							title: "Series over spam",
							body: "Episodic continuity is first-class. Near-identical mass production is treated as a risk, not a feature."
						}
					].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-line bg-paper p-6 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display text-2xl",
							children: card.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-ink-soft",
							children: card.body
						})]
					}, card.title))
				})
			]
		})]
	});
}
//#endregion
export { Landing as component };
