import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { a as relativeTime, n as formatDuration } from "./_ssr/format-DfLFR-2I.mjs";
import { t as useQuery } from "./_libs/tanstack__react-query.mjs";
import { r as Route$3 } from "./_ssr/router-Fm6d9Ypi.mjs";
import { t as StatusPill } from "./_ssr/status-pill-DB4qvBy2.mjs";
import { n as asString, t as asNumber } from "./_ssr/cells-B7WhMGI2.mjs";
import { t as Skeleton } from "./_ssr/skeleton-Co-_KBin.mjs";
import { r as getClip, u as updateClip } from "./_ssr/content-Cryr-qN7.mjs";
import { n as formatUsd } from "./_ssr/earnings-BozjqwJ6.mjs";
import { i as queuePublish, n as listPlatforms } from "./_ssr/publish-2e7g_sgF.mjs";
import { t as Button } from "./_ssr/button-DIqQuQHa.mjs";
import { t as Input } from "./_ssr/input-DRKCQBaX.mjs";
import { t as Textarea } from "./_ssr/textarea-D31CATl3.mjs";
import { t as Label } from "./_ssr/label-B4FujwPh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-Blc9f0pb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClipDetail() {
	const { id } = Route$3.useParams();
	const q = useQuery({
		queryKey: ["clip", id],
		queryFn: () => getClip({ data: id })
	});
	const platforms = useQuery({
		queryKey: ["platforms"],
		queryFn: () => listPlatforms()
	});
	const [chosen, setChosen] = (0, import_react.useState)([]);
	const [message, setMessage] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)(null);
	const [description, setDescription] = (0, import_react.useState)(null);
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" });
	if (!q.data?.ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-stone",
		children: q.data && "error" in q.data ? q.data.error : "Missing."
	});
	const { clip, compliance, publications, jobs, events, analytics, ledger, series } = q.data;
	const views = analytics.reduce((a, r) => a + asNumber(r.views), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/content",
					className: "text-sm text-stone hover:text-ink",
					children: "Content"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display mt-2 text-4xl",
					children: asString(clip.title)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(clip.status) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-stone",
							children: [
								asString(clip.format),
								" · ",
								formatDuration(asNumber(clip.duration_seconds))
							]
						}),
						series ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/series/$id",
							params: { id: asString(series.id) },
							className: "text-sm text-forest",
							children: asString(series.name)
						}) : null
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-paper p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Edit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									defaultValue: asString(clip.title),
									onChange: (e) => setTitle(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									defaultValue: asString(clip.description),
									onChange: (e) => setDescription(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: async () => {
									await updateClip({ data: {
										id,
										title: title ?? void 0,
										description: description ?? void 0
									} });
									q.refetch();
								},
								children: "Save"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-paper p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Compliance"
						}),
						compliance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 grid grid-cols-2 gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Publishable",
									v: asString(compliance.publishable)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "AI disclosure",
									v: asString(compliance.ai_disclosure)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Commercial",
									v: asString(compliance.commercial_disclosure)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Copyright / reuse",
									v: asString(compliance.copyright_risk)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Monetization",
									v: asString(compliance.monetization)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									k: "Repetition",
									v: asString(compliance.content_repetition_risk)
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-stone",
							children: "No decision recorded yet."
						}),
						compliance ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 whitespace-pre-line text-sm text-ink-soft",
							children: asString(compliance.rationale)
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Views",
						value: views.toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Estimated",
						value: formatUsd(ledger.filter((r) => r.kind === "estimated").reduce((a, r) => a + asNumber(r.amount_cents), 0)),
						hint: "Not confirmed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Confirmed",
						value: formatUsd(ledger.filter((r) => r.kind === "confirmed").reduce((a, r) => a + asNumber(r.amount_cents), 0))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Publish"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-stone",
						children: "A destination that is not configured will not be marked as published."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: platforms.data?.map((p) => {
							const on = chosen.includes(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setChosen((cur) => on ? cur.filter((x) => x !== p.id) : [...cur, p.id]),
								className: `rounded-full border px-3 py-1.5 text-sm ${on ? "border-forest bg-forest text-forest-fg" : "border-line"}`,
								children: p.name
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						disabled: !chosen.length,
						onClick: async () => {
							const res = await queuePublish({ data: {
								clipId: id,
								platforms: chosen
							} });
							if (res.ok) setMessage(res.results.map((r) => r.message).join(" "));
							else setMessage("error" in res ? res.error : null);
							q.refetch();
						},
						children: "Queue publication"
					}),
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-ink-soft",
						children: message
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: publications.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									asString(p.platform),
									" · ",
									relativeTime(asString(p.created_at))
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(p.status) }),
								p.failure_reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-full text-stone",
									children: asString(p.failure_reason)
								}) : null
							]
						}, asString(p.id)))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line bg-paper p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Timeline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: [events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: asString(e.message) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-stone",
							children: relativeTime(asString(e.created_at))
						})]
					}, asString(e.id))), jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize",
							children: asString(j.stage)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: asString(j.status) })]
					}, asString(j.id)))]
				})]
			})
		]
	});
}
function Item({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[11px] uppercase tracking-wide text-stone",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: v })
	})] });
}
function Metric({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-paper p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] uppercase tracking-wide text-stone",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 tabular text-2xl font-medium",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-stone",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { ClipDetail as component };
