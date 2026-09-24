import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Badge } from "./badge-D0ehHZOq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-pill-DB4qvBy2.js
var import_jsx_runtime = require_jsx_runtime();
var MAP = {
	draft: {
		tone: "stone",
		label: "Draft"
	},
	processing: {
		tone: "sky",
		label: "Processing"
	},
	ready: {
		tone: "forest",
		label: "Ready"
	},
	scheduled: {
		tone: "sky",
		label: "Scheduled"
	},
	publishing: {
		tone: "amber",
		label: "Publishing"
	},
	published: {
		tone: "sage",
		label: "Published"
	},
	live: {
		tone: "sage",
		label: "Live"
	},
	earning: {
		tone: "forest",
		label: "Earning"
	},
	failed: {
		tone: "rose",
		label: "Failed"
	},
	review: {
		tone: "amber",
		label: "Review"
	},
	review_required: {
		tone: "amber",
		label: "Review"
	},
	blocked: {
		tone: "rose",
		label: "Blocked"
	},
	pending: {
		tone: "amber",
		label: "Pending"
	},
	available: {
		tone: "forest",
		label: "Available"
	},
	withdrawn: {
		tone: "stone",
		label: "Paid out"
	},
	connected: {
		tone: "sage",
		label: "Connected"
	},
	not_connected: {
		tone: "stone",
		label: "Not connected"
	},
	authorization_required: {
		tone: "amber",
		label: "Auth required"
	},
	restricted: {
		tone: "rose",
		label: "Restricted"
	},
	unavailable: {
		tone: "stone",
		label: "Unavailable"
	},
	queued: {
		tone: "stone",
		label: "Queued"
	},
	running: {
		tone: "sky",
		label: "Running"
	},
	succeeded: {
		tone: "forest",
		label: "Done"
	},
	retrying: {
		tone: "amber",
		label: "Retrying"
	},
	owned: {
		tone: "forest",
		label: "Owned"
	},
	licensed: {
		tone: "sky",
		label: "Licensed"
	},
	public_domain: {
		tone: "sage",
		label: "Public domain"
	},
	authorized: {
		tone: "forest",
		label: "Authorized"
	},
	unknown: {
		tone: "amber",
		label: "Unknown"
	},
	LOW_RISK: {
		tone: "forest",
		label: "Low risk"
	},
	MEDIUM_RISK: {
		tone: "amber",
		label: "Medium risk"
	},
	HIGH_RISK: {
		tone: "rose",
		label: "High risk"
	},
	REVIEW_REQUIRED: {
		tone: "amber",
		label: "Review"
	},
	NOT_REQUIRED: {
		tone: "stone",
		label: "Not required"
	},
	REQUIRED: {
		tone: "amber",
		label: "Required"
	},
	MONETIZATION_SAFE: {
		tone: "forest",
		label: "Eligible"
	},
	MONETIZATION_REVIEW: {
		tone: "amber",
		label: "Review"
	},
	MONETIZATION_RISK: {
		tone: "rose",
		label: "Risk"
	},
	NOT_ELIGIBLE: {
		tone: "rose",
		label: "Not eligible"
	},
	UNKNOWN: {
		tone: "stone",
		label: "Unknown"
	},
	yes: {
		tone: "forest",
		label: "Yes"
	},
	no: {
		tone: "rose",
		label: "No"
	},
	LOW: {
		tone: "forest",
		label: "Low"
	},
	MEDIUM: {
		tone: "amber",
		label: "Medium"
	},
	HIGH: {
		tone: "rose",
		label: "High"
	},
	BLOCK: {
		tone: "rose",
		label: "Block"
	}
};
function StatusPill({ value }) {
	if (!value) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: "stone",
		children: "—"
	});
	const mapped = MAP[value] ?? {
		tone: "stone",
		label: value.replaceAll("_", " ")
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: mapped.tone,
		children: mapped.label
	});
}
//#endregion
export { StatusPill as t };
