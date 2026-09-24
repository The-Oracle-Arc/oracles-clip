import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Library, c as Factory, d as CircleHelp, f as ChartColumn, i as Plus, l as Coins, n as Share2, o as Layers, r as Settings, s as House, u as Clapperboard } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { r as getMyProfile } from "./profile-nag8fwPl.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { t as Wordmark } from "./mark-DdLTZkXE.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-jMWcar7S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRIMARY = [
	{
		to: "/home",
		label: "Home",
		icon: House
	},
	{
		to: "/create",
		label: "Create",
		icon: Plus
	},
	{
		to: "/content",
		label: "Content",
		icon: Library
	},
	{
		to: "/publish",
		label: "Publish",
		icon: Share2
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/earnings",
		label: "Earnings",
		icon: Coins
	}
];
var SECONDARY = [
	{
		to: "/series",
		label: "Series",
		icon: Layers
	},
	{
		to: "/platforms",
		label: "Platforms",
		icon: Clapperboard
	},
	{
		to: "/engine",
		label: "Engine Room",
		icon: Factory
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	},
	{
		to: "/help",
		label: "Help",
		icon: CircleHelp
	}
];
var MOBILE = [
	{
		to: "/create",
		label: "Create",
		icon: Plus
	},
	{
		to: "/content",
		label: "Content",
		icon: Library
	},
	{
		to: "/publish",
		label: "Publish",
		icon: Share2
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/earnings",
		label: "Earnings",
		icon: Coins
	}
];
function NavLink({ to, label, icon: Icon, collapsed }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const active = pathname === to || pathname.startsWith(`${to}/`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors", active ? "bg-forest text-forest-fg" : "text-ink-soft hover:bg-mist hover:text-ink", collapsed && "justify-center px-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn(collapsed && "sr-only"),
			children: label
		})]
	});
}
function AppShell({ children, demoMode, unread, isOperator }) {
	const { user } = useCurrentUserState();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const initial = (user?.displayName || user?.primaryEmail || "C").charAt(0).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-canvas text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-paper md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-16 items-center px-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/home",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-1 flex-col gap-1 px-3",
						children: [
							PRIMARY.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, { ...item }, item.to)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 h-px bg-line" }),
							SECONDARY.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, { ...item }, item.to)),
							isOperator ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
								to: "/admin",
								label: "Operations",
								icon: Factory
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-line p-3",
						children: [demoMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 rounded-md bg-amber/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-amber",
							children: "Demo mode"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 place-items-center rounded-full bg-mist text-sm font-medium",
								children: initial
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: user?.displayName ?? "Account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-stone hover:text-ink",
									disabled: signingOut,
									onClick: () => {
										setSigningOut(true);
										signOut("/").catch(() => setSigningOut(false));
									},
									children: signingOut ? "Signing out…" : "Sign out"
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/home",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/settings",
						className: "relative grid size-10 place-items-center rounded-full bg-mist",
						children: [initial, unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1 top-1 size-2 rounded-full bg-forest" }) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "px-4 pb-28 pt-5 md:px-8 md:pb-12 md:pt-8",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5",
					children: MOBILE.map((item) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileItem, { ...item }, item.to);
					})
				})
			})
		]
	});
}
function MobileItem({ to, label, icon: Icon }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const active = pathname === to || pathname.startsWith(`${to}/`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]", active ? "text-forest" : "text-stone"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), label]
	});
}
function StudioLayout() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-canvas p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-40 w-full" })]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (profile.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full" }) });
	if (profile.data && !profile.data.onboarding_completed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		demoMode: profile.data?.demo_mode,
		isOperator: profile.data?.role === "operator",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { StudioLayout as component };
