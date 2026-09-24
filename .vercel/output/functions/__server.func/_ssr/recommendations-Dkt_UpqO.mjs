//#region node_modules/.nitro/vite/services/ssr/assets/recommendations-Dkt_UpqO.js
function recommendNext(input) {
	if (!input.hasAnalytics && input.publishedCount === 0 && input.clipCount === 0) return [{
		title: "Start with one honest source",
		recommendation: "Upload a piece you own and make two or three distinct cuts — not a hundred near-copies.",
		platform: null,
		format: "short",
		estimatedBand: "UNKNOWN",
		confidence: .4,
		reason: "There is not enough of your own activity yet to recommend a platform or a series."
	}];
	if (!input.hasAnalytics) return [{
		title: "Publish a small, varied set",
		recommendation: input.seriesCount > 0 ? "Finish two episodes with real continuity, then publish where you actually have an audience." : "Ship a few distinct pieces, then let performance — not volume — decide the next format.",
		platform: input.topPlatform ?? null,
		format: input.topFormat ?? "short",
		estimatedBand: "UNKNOWN",
		confidence: .48,
		reason: "Recommendations stay conservative until a destination returns real performance data."
	}];
	const out = [];
	if (input.avgDuration && input.avgDuration >= 40 && input.avgDuration <= 70) out.push({
		title: "Stay in the 40–70s band",
		recommendation: "Your mid-length pieces are the ones with enough room for a turn. Keep that shape.",
		platform: input.topPlatform ?? "tiktok",
		format: "episode",
		estimatedBand: "MEDIUM",
		confidence: .72,
		reason: "Observed duration cluster — not a guarantee of revenue."
	});
	if (input.seriesCount > 0) out.push({
		title: "Continue the series you already started",
		recommendation: "A second and third episode compound better than a new one-off with the same hook.",
		platform: input.topPlatform ?? "youtube",
		format: "episode",
		estimatedBand: "MEDIUM",
		confidence: .64,
		reason: "Series continuity is available in your library."
	});
	if (out.length === 0) out.push({
		title: "Make the next piece more different, not more frequent",
		recommendation: "Change the opening, the length, or the platform — not just the caption.",
		platform: input.topPlatform ?? null,
		format: input.topFormat ?? "short",
		estimatedBand: "LOW",
		confidence: .55,
		reason: "Volume without variation is the failure mode this product is built to resist."
	});
	return out;
}
//#endregion
export { recommendNext as t };
