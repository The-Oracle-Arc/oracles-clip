import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as relativeTime } from "./format-DfLFR-2I.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as asString } from "./cells-B7WhMGI2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as Input } from "./input-DRKCQBaX.mjs";
import { t as Textarea } from "./textarea-D31CATl3.mjs";
import { t as Label } from "./label-B4FujwPh.mjs";
import { a as updateMyProfile, r as getMyProfile, t as claimOperator } from "./profile-nag8fwPl.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BE8NBqta.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var setDemoMode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("170ebfc0bd7e9fb7c25caf8132b4eeaef3dfacaf268209b198a9101a91cacaef"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a1c46ac5264cda97d831346b151c063b1002e7f346ebf97d57993558fbb04602"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("e7b564e84784d975e3c3bfdc127f1594ac86b66035be9e718460329c75313e5c"));
var listPolicies = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0448bb338d6383b31c1b636f665c7b644e4a18079639640bad1b24970e18d661"));
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-line bg-mist transition-colors data-[state=checked]:bg-forest", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-paper shadow-soft transition-transform data-[state=checked]:translate-x-4" })
	});
}
function SettingsPage() {
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile()
	});
	const notes = useQuery({
		queryKey: ["notes"],
		queryFn: () => listNotifications()
	});
	const policies = useQuery({
		queryKey: ["policies"],
		queryFn: () => listPolicies()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (profile.isPending || !profile.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	const p = profile.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
				children: "Account"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display text-4xl",
				children: "Settings"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Creator profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								defaultValue: p.display_name,
								onChange: (e) => setName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								defaultValue: p.bio ?? "",
								onChange: (e) => setBio(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-stone",
							children: [
								"Signed in as ",
								p.email ?? "your account",
								" · @",
								p.handle
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								const res = await updateMyProfile({ data: {
									displayName: name || p.display_name,
									bio
								} });
								setMsg(res.ok ? "Saved." : res.error);
								profile.refetch();
							},
							children: "Save profile"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Demo mode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-stone",
						children: "Sample factory activity, clearly labeled. Never mixed with real earnings."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: p.demo_mode,
						onCheckedChange: async (enabled) => {
							await setDemoMode({ data: { enabled } });
							window.location.reload();
						}
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Payouts & billing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: "Payouts are not yet enabled. Billing is not configured."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/withdraw",
							children: "Withdrawal status"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Notifications"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: notes.data?.length ? notes.data.slice(0, 8).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: asString(n.title)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-stone",
						children: [
							asString(n.body),
							" · ",
							relativeTime(asString(n.created_at))
						]
					})] }, asString(n.id))) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-stone",
						children: "None yet."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Policy Watch"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-stone",
						children: "Catalog of platform topics. Alerts appear only for material, verified changes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: [policies.data?.policies.map((pol) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [
								asString(pol.platform),
								" / ",
								asString(pol.topic)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-stone",
							children: asString(pol.summary)
						})] }, asString(pol.id))), policies.data?.changes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-stone",
							children: "No material changes recorded."
						}) : null]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Operations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-stone",
						children: p.role === "operator" ? "You operate this workspace as well as your own creator account." : "If no operator exists yet, you can claim the first operator seat — same product, not a hidden bypass."
					}),
					p.role !== "operator" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "outline",
						onClick: async () => {
							const res = await claimOperator();
							setMsg(res.ok ? "You are now an operator." : res.error);
							profile.refetch();
						},
						children: "Claim operator access"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							children: "Open operations"
						})
					})
				]
			}),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: msg
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut("/").catch(() => setSigningOut(false));
				},
				children: "Sign out"
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
