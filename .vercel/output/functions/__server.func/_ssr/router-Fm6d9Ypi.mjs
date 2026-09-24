import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-zMMkOYxQ.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Fm6d9Ypi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-D9J3pomg.css";
var APP_NAME = "Oracle’s Clip";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$23 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#2C4A3E"
			},
			{
				name: "description",
				content: "Oracle’s Clip is a creator business: create, publish, grow, and earn from work you own."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		refetchOnWindowFocus: false,
		retry: 1
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-canvas text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
					client: queryClient,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$21 = () => import("./routes-BWKDbOpW.mjs");
var Route$22 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./route-jMWcar7S.mjs");
var Route$21 = createFileRoute("/_studio")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./forgot-password-Cp4jINCx.mjs");
var Route$20 = createFileRoute("/forgot-password")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./login-VVfecRbC.mjs");
var Route$19 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./onboarding-iw1z7-Qs.mjs");
var Route$18 = createFileRoute("/onboarding")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./reset-password-9H3UvM8U.mjs");
var Route$17 = createFileRoute("/reset-password")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./signup-q5rgYSJm.mjs");
var Route$16 = createFileRoute("/signup")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./analytics-DFGNOAqk.mjs");
var Route$15 = createFileRoute("/_studio/analytics")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./create-GRXbVc-x.mjs");
var Route$14 = createFileRoute("/_studio/create")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./earnings-IVWqxXx2.mjs");
var Route$13 = createFileRoute("/_studio/earnings")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./engine-bATSTjNx.mjs");
var Route$12 = createFileRoute("/_studio/engine")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./help-D0HsVgJ-.mjs");
var Route$11 = createFileRoute("/_studio/help")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./home-kUt9EXkH.mjs");
var Route$10 = createFileRoute("/_studio/home")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./platforms-DVlQYWqR.mjs");
var Route$9 = createFileRoute("/_studio/platforms")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./publish-BaDY5NVe.mjs");
var Route$8 = createFileRoute("/_studio/publish")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./settings-BE8NBqta.mjs");
var Route$7 = createFileRoute("/_studio/settings")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./withdraw-DFeLDRYd.mjs");
var Route$6 = createFileRoute("/_studio/withdraw")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin-BC9HkkVE.mjs");
var Route$5 = createFileRoute("/_studio/admin/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./content-DFBqslHQ.mjs");
var Route$4 = createFileRoute("/_studio/content/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("../_id-Blc9f0pb.mjs");
var Route$3 = createFileRoute("/_studio/content/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./series-BfOqhTnE.mjs");
var Route$2 = createFileRoute("/_studio/series/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("../_id-BXX1lfQt.mjs");
var Route$1 = createFileRoute("/_studio/series/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$23
});
var StudioRouteRoute = Route$21.update({
	id: "/_studio",
	getParentRoute: () => Route$23
});
var ForgotPasswordRoute = Route$20.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$23
});
var LoginRoute = Route$19.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$23
});
var OnboardingRoute = Route$18.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$23
});
var ResetPasswordRoute = Route$17.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$23
});
var SignupRoute = Route$16.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$23
});
var StudioAnalyticsRoute = Route$15.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => StudioRouteRoute
});
var StudioCreateRoute = Route$14.update({
	id: "/create",
	path: "/create",
	getParentRoute: () => StudioRouteRoute
});
var StudioEarningsRoute = Route$13.update({
	id: "/earnings",
	path: "/earnings",
	getParentRoute: () => StudioRouteRoute
});
var StudioEngineRoute = Route$12.update({
	id: "/engine",
	path: "/engine",
	getParentRoute: () => StudioRouteRoute
});
var StudioHelpRoute = Route$11.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => StudioRouteRoute
});
var StudioHomeRoute = Route$10.update({
	id: "/home",
	path: "/home",
	getParentRoute: () => StudioRouteRoute
});
var StudioPlatformsRoute = Route$9.update({
	id: "/platforms",
	path: "/platforms",
	getParentRoute: () => StudioRouteRoute
});
var StudioPublishRoute = Route$8.update({
	id: "/publish",
	path: "/publish",
	getParentRoute: () => StudioRouteRoute
});
var StudioSettingsRoute = Route$7.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => StudioRouteRoute
});
var StudioWithdrawRoute = Route$6.update({
	id: "/withdraw",
	path: "/withdraw",
	getParentRoute: () => StudioRouteRoute
});
var StudioAdminIndexRoute = Route$5.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => StudioRouteRoute
});
var StudioContentIndexRoute = Route$4.update({
	id: "/content/",
	path: "/content/",
	getParentRoute: () => StudioRouteRoute
});
var StudioContentIdRoute = Route$3.update({
	id: "/content/$id",
	path: "/content/$id",
	getParentRoute: () => StudioRouteRoute
});
var StudioSeriesIndexRoute = Route$2.update({
	id: "/series/",
	path: "/series/",
	getParentRoute: () => StudioRouteRoute
});
var StudioSeriesIdRoute = Route$1.update({
	id: "/series/$id",
	path: "/series/$id",
	getParentRoute: () => StudioRouteRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$23
});
var StudioRouteRouteChildren = {
	StudioAnalyticsRoute,
	StudioCreateRoute,
	StudioEarningsRoute,
	StudioEngineRoute,
	StudioHelpRoute,
	StudioHomeRoute,
	StudioPlatformsRoute,
	StudioPublishRoute,
	StudioSettingsRoute,
	StudioWithdrawRoute,
	StudioContentIdRoute,
	StudioSeriesIdRoute,
	StudioAdminIndexRoute,
	StudioContentIndexRoute,
	StudioSeriesIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	StudioRouteRoute: StudioRouteRoute._addFileChildren(StudioRouteRouteChildren),
	ForgotPasswordRoute,
	LoginRoute,
	OnboardingRoute,
	ResetPasswordRoute,
	SignupRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$23._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$1 as n, Route$3 as r, router_exports as t };
