//#region node_modules/.nitro/vite/services/ssr/assets/clip-detect-goKREYyv.js
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
var WINDOWS = [
	{
		len: 12,
		kind: "hook",
		title: "Opening hook",
		hook: "The first seconds that decide whether someone stays.",
		at: 0
	},
	{
		len: 27,
		kind: "high_retention",
		title: "Hold the middle",
		hook: "A denser stretch where the source is most active.",
		at: .18
	},
	{
		len: 38,
		kind: "story_turn",
		title: "The turn",
		hook: "A natural shift in the story — not a manufactured cliffhanger.",
		at: .34
	},
	{
		len: 45,
		kind: "emotional",
		title: "The human beat",
		hook: "A quieter stretch that carries feeling rather than noise.",
		at: .48
	},
	{
		len: 32,
		kind: "dialogue",
		title: "What was said",
		hook: "A passage built around speech, not just cutting.",
		at: .58
	},
	{
		len: 22,
		kind: "visual_peak",
		title: "Visual peak",
		hook: "A tighter window around likely visual energy.",
		at: .72
	},
	{
		len: 48,
		kind: "educational",
		title: "The explanation",
		hook: "A longer cut suited to teaching or walking through an idea.",
		at: .4
	},
	{
		len: 20,
		kind: "episode_boundary",
		title: "Natural pause",
		hook: "A possible episode break rather than an arbitrary cut.",
		at: .85
	}
];
function platformFit(duration, kind) {
	const shortScore = duration <= 60 ? .9 : duration <= 90 ? .72 : .4;
	const midScore = duration >= 45 && duration <= 180 ? .86 : .5;
	const longScore = duration >= 90 ? .8 : .35;
	const eduBoost = kind === "educational" || kind === "dialogue" ? .08 : 0;
	return {
		youtube: clamp(shortScore * .7 + longScore * .5 + eduBoost, .2, .95),
		tiktok: clamp(shortScore, .2, .95),
		instagram: clamp(shortScore * .95, .2, .95),
		facebook: clamp(midScore, .2, .9),
		x: clamp(shortScore * .7, .2, .85),
		linkedin: clamp(kind === "educational" ? .78 : .4, .2, .85),
		snapchat: clamp(shortScore, .2, .9),
		pinterest: clamp(kind === "visual_peak" ? .74 : .45, .2, .85),
		threads: clamp(shortScore * .65, .2, .8)
	};
}
function detectMoments(input) {
	const duration = Math.max(0, input.durationSeconds || 0);
	const sourceTitle = (input.title || "Untitled source").trim();
	if (duration <= 0) return [{
		startSeconds: 0,
		endSeconds: 30,
		titleSuggestion: sourceTitle,
		hook: "Duration is unknown — trim this window after previewing the source.",
		momentKind: "hook",
		confidence: .34,
		platformFit: platformFit(30, "hook")
	}];
	if (duration < 18) return [{
		startSeconds: 0,
		endSeconds: round1(duration),
		titleSuggestion: sourceTitle,
		hook: "The whole source is already short-form length.",
		momentKind: "hook",
		confidence: .88,
		platformFit: platformFit(duration, "hook")
	}];
	const out = [];
	for (const window of WINDOWS) {
		if (window.len > duration) continue;
		const start = round1(clamp(duration * window.at, 0, Math.max(0, duration - window.len)));
		const end = round1(Math.min(duration, start + window.len));
		const len = end - start;
		if (len < 8) continue;
		const openingBoost = start < 3 ? .08 : 0;
		const sweet = len >= 21 && len <= 48 ? .1 : 0;
		const confidence = clamp(.46 + openingBoost + sweet + (1 - window.at) * .08, .38, .92);
		out.push({
			startSeconds: start,
			endSeconds: end,
			titleSuggestion: `${sourceTitle} — ${window.title}`,
			hook: window.hook,
			momentKind: window.kind,
			confidence: round1(confidence * 100) / 100,
			platformFit: platformFit(len, window.kind)
		});
	}
	const seen = /* @__PURE__ */ new Set();
	return out.filter((c) => {
		const key = `${c.startSeconds}-${c.endSeconds}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function segmentEpisodes(input) {
	const duration = Math.max(0, input.durationSeconds || 0);
	const target = input.targetSeconds ?? (duration >= 1200 ? 480 : 55);
	if (duration <= 0) return [{
		startSeconds: 0,
		endSeconds: target,
		episodeNumber: 1,
		title: `${input.seriesName} — Episode 1`,
		hook: "Duration unknown. Confirm the in and out points before publishing."
	}];
	if (duration <= target * 1.25) return [{
		startSeconds: 0,
		endSeconds: round1(duration),
		episodeNumber: 1,
		title: `${input.seriesName} — Episode 1`,
		hook: "The source fits a single episode. Split only if the story actually turns."
	}];
	const count = clamp(Math.round(duration / target), 2, 12);
	const slice = duration / count;
	const beats = [
		"The beginning",
		"What changes",
		"The middle",
		"A closer look",
		"The pressure",
		"The choice",
		"The consequence",
		"What remains",
		"The return",
		"The last word",
		"Afterward",
		"Coda"
	];
	const episodes = [];
	for (let i = 0; i < count; i += 1) {
		const start = round1(i * slice);
		const end = round1(i === count - 1 ? duration : (i + 1) * slice);
		episodes.push({
			startSeconds: start,
			endSeconds: end,
			episodeNumber: i + 1,
			title: `${input.seriesName} — Episode ${String(i + 1).padStart(2, "0")}: ${beats[i] ?? `Part ${i + 1}`}`,
			hook: `Continues the story from episode ${i === 0 ? "the opening" : String(i).padStart(2, "0")}.`
		});
	}
	return episodes;
}
//#endregion
export { segmentEpisodes as n, detectMoments as t };
