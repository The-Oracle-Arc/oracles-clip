import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as formatDuration } from "./format-DfLFR-2I.mjs";
import { t as Badge } from "./badge-D0ehHZOq.mjs";
import { t as StatusPill } from "./status-pill-DB4qvBy2.mjs";
import { a as getSourceAnalysis, l as listSources, n as createSeriesFromSource, o as ingestSource, t as createClipsFromCandidates } from "./content-Cryr-qN7.mjs";
import { l as RIGHTS_STATUSES, r as FORMAT_LABELS, t as CLIP_FORMATS } from "./types-hvIGX_wW.mjs";
import { t as Button } from "./button-DIqQuQHa.mjs";
import { t as Input } from "./input-DRKCQBaX.mjs";
import { t as Label } from "./label-B4FujwPh.mjs";
import { a as rightsLabel, i as rightsHelp } from "./rights-Blc7xP7N.mjs";
import { a as tickFactory } from "./factory-iVnNnG1d.mjs";
import { t as Progress } from "./progress-CNYGhxK7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-GRXbVc-x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function readVideoMeta(file) {
	const url = URL.createObjectURL(file);
	try {
		const video = document.createElement("video");
		video.preload = "metadata";
		video.src = url;
		video.muted = true;
		await new Promise((resolve, reject) => {
			video.onloadedmetadata = () => resolve();
			video.onerror = () => reject(/* @__PURE__ */ new Error("Could not read this file."));
		});
		const duration = Number.isFinite(video.duration) ? video.duration : 0;
		video.currentTime = Math.min(1, duration * .12 || 0);
		await new Promise((resolve) => {
			video.onseeked = () => resolve();
			window.setTimeout(() => resolve(), 800);
		});
		const canvas = document.createElement("canvas");
		canvas.width = 480;
		canvas.height = Math.max(1, Math.round(480 * (video.videoHeight || 9) / (video.videoWidth || 16)));
		canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
		const thumb = canvas.toDataURL("image/jpeg", .72);
		return {
			duration,
			width: video.videoWidth,
			height: video.videoHeight,
			thumb: thumb.length < 16e4 ? thumb : void 0
		};
	} finally {
		URL.revokeObjectURL(url);
	}
}
function CreatePage() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [mode, setMode] = (0, import_react.useState)("clips");
	const [rights, setRights] = (0, import_react.useState)("owned");
	const [confirmed, setConfirmed] = (0, import_react.useState)(false);
	const [file, setFile] = (0, import_react.useState)(null);
	const [url, setUrl] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [sourceId, setSourceId] = (0, import_react.useState)(null);
	const [jobs, setJobs] = (0, import_react.useState)([]);
	const [candidates, setCandidates] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [format, setFormat] = (0, import_react.useState)("short");
	const [seriesName, setSeriesName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [library, setLibrary] = (0, import_react.useState)([]);
	const [captions, setCaptions] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		listSources().then((rows) => setLibrary(rows));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!sourceId || step !== 2) return;
		let stop = false;
		const poll = async () => {
			await tickFactory();
			const res = await getSourceAnalysis({ data: sourceId });
			if (!res.ok || stop) return;
			setJobs(res.jobs);
			setCandidates(res.candidates);
			if (res.ready) setStep(3);
		};
		poll();
		const t = window.setInterval(() => void poll(), 900);
		return () => {
			stop = true;
			window.clearInterval(t);
		};
	}, [sourceId, step]);
	const progress = (0, import_react.useMemo)(() => {
		if (!jobs.length) return 8;
		const sum = jobs.reduce((a, j) => a + Number(j.progress || 0), 0);
		return Math.round(sum / jobs.length);
	}, [jobs]);
	async function submitSource(kind, libraryId) {
		setError(null);
		if (!confirmed) {
			setError("Confirm that you own this content or have permission to use it.");
			return;
		}
		setBusy(true);
		try {
			if (kind === "library" && libraryId) {
				setSourceId(libraryId);
				setStep(2);
				return;
			}
			let meta = {};
			if (kind === "upload" && file) meta = await readVideoMeta(file);
			const res = await ingestSource({ data: {
				kind,
				title: title || file?.name,
				originalFilename: file?.name,
				mimeType: file?.type,
				durationSeconds: meta.duration,
				width: meta.width,
				height: meta.height,
				fileSizeBytes: file?.size,
				sourceUrl: kind === "url" ? url : void 0,
				thumbnailDataUrl: meta.thumb,
				rightsStatus: rights,
				ownershipConfirmed: confirmed
			} });
			if (!res.ok) {
				setError(res.error);
				return;
			}
			setSourceId(res.sourceId);
			setStep(2);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not ingest this source.");
		} finally {
			setBusy(false);
		}
	}
	async function finishClips() {
		if (!sourceId) return;
		setBusy(true);
		const res = await createClipsFromCandidates({ data: {
			sourceId,
			candidateIds: selected,
			format,
			aiAssistedCaptions: captions,
			aiGeneratedVisuals: false,
			aiGeneratedVoice: false,
			commercialIntent: false,
			transformative: {
				substantialEditing: true,
				commentary: mode === "series",
				context: true
			}
		} });
		setBusy(false);
		if (!res.ok) {
			setError(res.error);
			return;
		}
		await navigate({ to: "/content" });
	}
	async function finishSeries() {
		if (!sourceId || !seriesName.trim()) {
			setError("Name the series.");
			return;
		}
		setBusy(true);
		const res = await createSeriesFromSource({ data: {
			sourceId,
			name: seriesName.trim(),
			format: "episode"
		} });
		setBusy(false);
		if (!res.ok) {
			setError(res.error);
			return;
		}
		await navigate({
			to: "/series/$id",
			params: { id: res.seriesId }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-stone",
				children: "Create"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display mt-1 text-4xl",
				children: "Put work on the line"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex gap-2 text-[11px] uppercase tracking-wide text-stone",
				children: [
					"Source",
					"Analyze",
					"Select",
					"Format",
					"Package"
				].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: i + 1 <= step ? "text-forest" : "",
					children: [
						i + 1,
						". ",
						label
					]
				}, label))
			}),
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 rounded-xl border border-line bg-paper p-5 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rights status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: RIGHTS_STATUSES.filter((s) => s !== "blocked" && s !== "review_required").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRights(s),
								className: `rounded-lg border px-3 py-3 text-left ${rights === s ? "border-forest bg-forest/5" : "border-line"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: rightsLabel(s)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-stone",
									children: rightsHelp(s)
								})]
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-1",
							checked: confirmed,
							onChange: (e) => setConfirmed(e.target.checked)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I own this content or have permission or a license to use it. Oracle’s Clip will not treat this as legal clearance." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "title",
							children: "Working title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "title",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Harbor morning"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-lg border border-line p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Upload video"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "file",
									accept: "video/*,audio/*",
									onChange: (e) => setFile(e.target.files?.[0] ?? null)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: busy || !file,
									onClick: () => void submitSource("upload"),
									children: busy ? "Ingesting…" : "Use this file"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-lg border border-line p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Paste a source URL"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: url,
									onChange: (e) => setUrl(e.target.value),
									placeholder: "https://"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-stone",
									children: "YouTube and Vimeo titles can be fetched. Publishing still needs a connected destination."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: busy || !url,
									variant: "outline",
									onClick: () => void submitSource("url"),
									children: "Import URL"
								})
							]
						})]
					}),
					library.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-sm font-medium",
						children: "Existing sources"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: library.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => void submitSource("library", s.id),
							children: s.title || "Untitled"
						}, s.id))
					})] }) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-rose",
						children: error
					}) : null
				]
			}),
			step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-xl border border-line bg-paper p-5 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display text-2xl",
							children: "Finding moments"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: j.stage
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { value: j.status })]
						}, j.stage))
					})
				]
			}),
			step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: "Select the moments worth keeping. Similarity across many cuts will be flagged before publish."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: candidates.map((c) => {
							const on = selected.includes(c.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelected((cur) => on ? cur.filter((id) => id !== c.id) : [...cur, c.id]),
								className: `w-full rounded-xl border p-4 text-left ${on ? "border-forest bg-forest/5" : "border-line bg-paper"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: c.title_suggestion
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: "stone",
											children: formatDuration(Number(c.end_seconds) - Number(c.start_seconds))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-ink-soft",
										children: c.hook
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex gap-2 text-xs text-stone",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.moment_kind?.replaceAll("_", " ") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"confidence ",
											Math.round(Number(c.confidence || 0) * 100),
											"%"
										] })]
									})
								]
							}, c.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: !selected.length,
						onClick: () => setStep(4),
						children: ["Continue with ", selected.length || 0]
					})
				]
			}),
			step >= 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 rounded-xl border border-line bg-paper p-5 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: mode === "clips" ? "default" : "outline",
						onClick: () => setMode("clips"),
						children: "Individual clips"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: mode === "series" ? "default" : "outline",
						onClick: () => setMode("series"),
						children: "Series"
					})]
				}), mode === "clips" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Format" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: CLIP_FORMATS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFormat(f),
							className: `rounded-full border px-3 py-1.5 text-sm ${format === f ? "border-forest bg-forest text-forest-fg" : "border-line"}`,
							children: FORMAT_LABELS[f]
						}, f))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: captions,
							onChange: (e) => setCaptions(e.target.checked)
						}), "Auto captions (transcription aid — not an automatic AI disclosure)"]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-rose",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void finishClips(),
						children: busy ? "Packaging…" : "Package clips"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "series",
							children: "Series name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "series",
							value: seriesName,
							onChange: (e) => setSeriesName(e.target.value),
							placeholder: "Harbor Lights"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-stone",
						children: "Episodes follow the source’s natural length. Titles describe continuity — they are not generated as bait."
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-rose",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void finishSeries(),
						children: busy ? "Building…" : "Build series"
					})
				] })]
			})
		]
	});
}
//#endregion
export { CreatePage as component };
