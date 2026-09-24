//#region node_modules/.nitro/vite/services/ssr/assets/types-hvIGX_wW.js
var PLATFORMS = [
	"youtube",
	"tiktok",
	"instagram",
	"facebook",
	"x",
	"linkedin",
	"snapchat",
	"pinterest",
	"threads"
];
var PLATFORM_LABELS = {
	youtube: "YouTube",
	tiktok: "TikTok",
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	linkedin: "LinkedIn",
	snapchat: "Snapchat",
	pinterest: "Pinterest",
	threads: "Threads"
};
var CLIP_FORMATS = [
	"short",
	"shorts",
	"reel",
	"tiktok",
	"episode",
	"long_form",
	"trailer",
	"teaser",
	"commentary",
	"reaction",
	"explainer"
];
var FORMAT_LABELS = {
	short: "Short",
	shorts: "Shorts",
	reel: "Reel",
	tiktok: "TikTok",
	episode: "Episode",
	long_form: "Long form",
	trailer: "Trailer",
	teaser: "Teaser",
	commentary: "Commentary",
	reaction: "Reaction",
	explainer: "Explainer"
};
var RIGHTS_STATUSES = [
	"owned",
	"licensed",
	"public_domain",
	"authorized",
	"unknown",
	"review_required",
	"blocked"
];
var FACTORY_STAGES = [
	"ingest",
	"understand",
	"clip",
	"edit",
	"ai",
	"render",
	"quality",
	"rights",
	"policy",
	"monetization",
	"package",
	"queue",
	"publish",
	"verify",
	"analyze",
	"learn"
];
var STAGE_LABELS = {
	ingest: "Ingesting",
	understand: "Analyzing",
	clip: "Finding moments",
	edit: "Editing",
	ai: "Generating",
	render: "Rendering",
	quality: "Quality checking",
	rights: "Rights check",
	policy: "Compliance checking",
	monetization: "Monetization check",
	package: "Packaging",
	queue: "Queuing",
	publish: "Publishing",
	verify: "Verifying",
	analyze: "Measuring",
	learn: "Learning"
};
var POLICY_VERSION = "oc-policy-2026.08";
var MIN_WITHDRAWAL_CENTS = 2500;
var PLATFORM_CAPABILITIES = {
	youtube: {
		shorts: true,
		longForm: true,
		analytics: true,
		monetization: true,
		aiDisclosureField: "contains_synthetic_media"
	},
	tiktok: {
		shorts: true,
		longForm: false,
		analytics: true,
		monetization: true,
		aiDisclosureField: "aigc_label"
	},
	instagram: {
		shorts: true,
		longForm: false,
		analytics: true,
		monetization: true,
		aiDisclosureField: "ai_info_label"
	},
	facebook: {
		shorts: true,
		longForm: true,
		analytics: true,
		monetization: true,
		aiDisclosureField: "ai_info_label"
	},
	x: {
		shorts: true,
		longForm: false,
		analytics: true,
		monetization: false,
		aiDisclosureField: null
	},
	linkedin: {
		shorts: false,
		longForm: true,
		analytics: true,
		monetization: false,
		aiDisclosureField: null
	},
	snapchat: {
		shorts: true,
		longForm: false,
		analytics: true,
		monetization: true,
		aiDisclosureField: null
	},
	pinterest: {
		shorts: true,
		longForm: false,
		analytics: true,
		monetization: false,
		aiDisclosureField: null
	},
	threads: {
		shorts: true,
		longForm: false,
		analytics: false,
		monetization: false,
		aiDisclosureField: null
	}
};
//#endregion
export { PLATFORMS as a, POLICY_VERSION as c, MIN_WITHDRAWAL_CENTS as i, RIGHTS_STATUSES as l, FACTORY_STAGES as n, PLATFORM_CAPABILITIES as o, FORMAT_LABELS as r, PLATFORM_LABELS as s, CLIP_FORMATS as t, STAGE_LABELS as u };
