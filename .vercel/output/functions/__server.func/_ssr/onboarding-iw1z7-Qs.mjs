import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { n as listPlatforms, t as connectPlatform } from "./publish-2e7g_sgF.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as Input } from "./input-DRKCQBaX.mjs";
import { t as Textarea } from "./textarea-D31CATl3.mjs";
import { t as Label } from "./label-B4FujwPh.mjs";
import { i as saveOnboarding, r as getMyProfile } from "./profile-nag8fwPl.mjs";
import { t as Wordmark } from "./mark-DdLTZkXE.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-iw1z7-Qs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"Welcome",
	"Profile",
	"Platforms",
	"Earnings",
	"Ready"
];
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(0);
	const [name, setName] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [platforms, setPlatforms] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMyProfile().then((p) => {
			setName(p.display_name);
			setBio(p.bio ?? "");
			if (p.onboarding_completed) navigate({ to: "/home" });
			else setStep(p.onboarding_step || 0);
		});
		listPlatforms().then((rows) => setPlatforms(rows.map((r) => ({
			id: r.id,
			name: r.name,
			status: r.status
		}))));
	}, [user, navigate]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function persist(next, complete = false) {
		await saveOnboarding({ data: {
			displayName: name,
			bio,
			step: next,
			complete
		} });
		setStep(next);
		if (complete) await navigate({ to: "/home" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8 flex gap-2",
			children: STEPS.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 rounded-full ${i <= step ? "bg-forest" : "bg-line"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 hidden text-[11px] uppercase tracking-wide text-stone sm:block",
					children: label
				})]
			}, label))
		}),
		step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
			title: "This is your content business.",
			body: "The factory underneath will clip, check rights, and queue publishing. You stay in charge of what goes out — and estimated money is never treated as cash.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void persist(1),
				children: "Continue"
			})
		}),
		step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
			title: "A name people will see.",
			body: "Keep it short. You can change it later.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "Creator name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							value: name,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "bio",
							children: "How you work"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "bio",
							value: bio,
							onChange: (e) => setBio(e.target.value),
							placeholder: "Original footage, commentary, a series…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void persist(2),
						children: "Save and continue"
					})
				]
			})
		}),
		step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
			title: "Destinations use official OAuth.",
			body: "Oracle’s Clip will never ask for a platform password. If a destination isn’t configured yet, it stays unavailable — we won’t pretend it’s connected.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: platforms.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex items-center justify-between rounded-lg border border-line bg-paper px-3 py-3 text-left",
						onClick: async () => {
							const res = await connectPlatform({ data: p.id });
							setNotice(res.message ?? res.error ?? null);
							listPlatforms().then((rows) => setPlatforms(rows.map((r) => ({
								id: r.id,
								name: r.name,
								status: r.status
							}))));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: p.status })]
					}, p.id))
				}),
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-ink-soft",
					children: notice
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					onClick: () => void persist(3),
					children: "Continue"
				})
			]
		}),
		step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
			title: "Earnings stay honest.",
			body: "Estimated ranges are labeled. Confirmed money appears only from a platform. Available balance is confirmed money that can be withdrawn. Payouts are not enabled until a provider is configured.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void persist(4),
				children: "I understand"
			})
		}),
		step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
			title: "You’re ready.",
			body: "Upload something you own, or open Demo Mode from Settings if you want to walk the factory with sample data first.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void persist(4, true),
				children: "Enter the studio"
			})
		})
	] });
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas px-5 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children
			})]
		})
	});
}
function Step({ title, body, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display text-4xl text-ink",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-lg text-ink-soft",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children
			})
		]
	});
}
//#endregion
export { Onboarding as component };
