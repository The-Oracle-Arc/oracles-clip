import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as relativeTime } from "./format-DfLFR-2I.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { n as asString } from "./cells-B7WhMGI2.mjs";
import { t as Skeleton } from "./skeleton-Co-_KBin.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BC9HkkVE.js
var import_jsx_runtime = require_jsx_runtime();
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e5bf6ef5ca6f7c26de29c1c6b19ec76887c31a9570882199379930e50283a51d"));
var listUsersAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2fb0171e9fa68cbd1250176d8f73c54fea6b67aead481796588fd815900d6f96"));
function AdminPage() {
	const overview = useQuery({
		queryKey: ["admin"],
		queryFn: () => getAdminOverview()
	});
	const users = useQuery({
		queryKey: ["admin-users"],
		queryFn: () => listUsersAdmin()
	});
	if (overview.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "display text-4xl",
			children: "Operations"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-ink-soft",
			children: "Operator access required."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/settings",
			className: "mt-3 inline-block text-sm text-forest",
			children: "Settings"
		})
	] });
	if (overview.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" });
	const d = overview.data;
	if (!d) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
				children: "Internal"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display text-4xl",
				children: "Operations"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
						label: "Accounts",
						value: d.users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
						label: "Clips",
						value: d.clips
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
						label: "Publications",
						value: d.publications
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Failed jobs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: [d.failed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-stone",
						children: "None."
					}) : null, d.failed.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: asString(j.stage) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(j.status) })]
					}, asString(j.id)))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Accounts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: users.data?.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							asString(u.display_name),
							" @",
							asString(u.handle)
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-stone",
							children: [asString(u.role), u.demo_mode ? " · demo" : ""]
						})]
					}, asString(u.user_id)))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Audit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: d.audit.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [asString(a.action), a.detail ? ` — ${asString(a.detail)}` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-stone",
							children: relativeTime(asString(a.created_at))
						})]
					}, asString(a.id)))
				})]
			})
		]
	});
}
function Box({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-paper p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-wide text-stone",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 tabular text-2xl font-medium",
			children: value
		})]
	});
}
//#endregion
export { AdminPage as component };
