export const PLATFORMS = [
  "youtube",
  "tiktok",
  "instagram",
  "facebook",
  "x",
  "linkedin",
  "snapchat",
  "pinterest",
  "threads",
] as const;

export type PlatformId = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<PlatformId, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X",
  linkedin: "LinkedIn",
  snapchat: "Snapchat",
  pinterest: "Pinterest",
  threads: "Threads",
};

export const CLIP_FORMATS = [
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
  "explainer",
] as const;

export type ClipFormat = (typeof CLIP_FORMATS)[number];

export const FORMAT_LABELS: Record<ClipFormat, string> = {
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
  explainer: "Explainer",
};

export const RIGHTS_STATUSES = [
  "owned",
  "licensed",
  "public_domain",
  "authorized",
  "unknown",
  "review_required",
  "blocked",
] as const;

export type RightsStatus = (typeof RIGHTS_STATUSES)[number];

export const CLIP_STATUSES = [
  "draft",
  "processing",
  "ready",
  "scheduled",
  "publishing",
  "published",
  "live",
  "earning",
  "failed",
  "review",
  "blocked",
] as const;

export type ClipStatus = (typeof CLIP_STATUSES)[number];

export const FACTORY_STAGES = [
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
  "learn",
] as const;

export type FactoryStage = (typeof FACTORY_STAGES)[number];

export const STAGE_LABELS: Record<FactoryStage, string> = {
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
  learn: "Learning",
};

export const JOB_STATUSES = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "retrying",
  "cancelled",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const AI_DISCLOSURE = [
  "NOT_REQUIRED",
  "REQUIRED",
  "UNKNOWN",
  "REVIEW_REQUIRED",
] as const;
export type AiDisclosure = (typeof AI_DISCLOSURE)[number];

export const COPYRIGHT_RISK = [
  "LOW_RISK",
  "MEDIUM_RISK",
  "HIGH_RISK",
  "REVIEW_REQUIRED",
] as const;
export type CopyrightRisk = (typeof COPYRIGHT_RISK)[number];

export const MONETIZATION = [
  "MONETIZATION_SAFE",
  "MONETIZATION_REVIEW",
  "MONETIZATION_RISK",
  "NOT_ELIGIBLE",
  "UNKNOWN",
] as const;
export type Monetization = (typeof MONETIZATION)[number];

export const REPETITION_RISK = ["LOW", "MEDIUM", "HIGH", "BLOCK"] as const;
export type RepetitionRisk = (typeof REPETITION_RISK)[number];

export const LEDGER_KINDS = [
  "estimated",
  "confirmed",
  "available",
  "withdrawn",
  "reversed",
  "fee",
] as const;
export type LedgerKind = (typeof LEDGER_KINDS)[number];

export const LEDGER_STATUSES = [
  "pending",
  "processing",
  "available",
  "withdrawn",
  "failed",
  "reversed",
  "on_hold",
] as const;
export type LedgerStatus = (typeof LEDGER_STATUSES)[number];

export const POLICY_VERSION = "oc-policy-2026.08";

export const MIN_WITHDRAWAL_CENTS = 2500;

export const PLATFORM_CAPABILITIES: Record<
  PlatformId,
  {
    shorts: boolean;
    longForm: boolean;
    analytics: boolean;
    monetization: boolean;
    aiDisclosureField: string | null;
  }
> = {
  youtube: {
    shorts: true,
    longForm: true,
    analytics: true,
    monetization: true,
    aiDisclosureField: "contains_synthetic_media",
  },
  tiktok: {
    shorts: true,
    longForm: false,
    analytics: true,
    monetization: true,
    aiDisclosureField: "aigc_label",
  },
  instagram: {
    shorts: true,
    longForm: false,
    analytics: true,
    monetization: true,
    aiDisclosureField: "ai_info_label",
  },
  facebook: {
    shorts: true,
    longForm: true,
    analytics: true,
    monetization: true,
    aiDisclosureField: "ai_info_label",
  },
  x: {
    shorts: true,
    longForm: false,
    analytics: true,
    monetization: false,
    aiDisclosureField: null,
  },
  linkedin: {
    shorts: false,
    longForm: true,
    analytics: true,
    monetization: false,
    aiDisclosureField: null,
  },
  snapchat: {
    shorts: true,
    longForm: false,
    analytics: true,
    monetization: true,
    aiDisclosureField: null,
  },
  pinterest: {
    shorts: true,
    longForm: false,
    analytics: true,
    monetization: false,
    aiDisclosureField: null,
  },
  threads: {
    shorts: true,
    longForm: false,
    analytics: false,
    monetization: false,
    aiDisclosureField: null,
  },
};

export type MomentKind =
  | "hook"
  | "high_retention"
  | "emotional"
  | "funny"
  | "educational"
  | "story_turn"
  | "dialogue"
  | "visual_peak"
  | "episode_boundary"
  | "controversial";

export type ClipCandidate = {
  startSeconds: number;
  endSeconds: number;
  titleSuggestion: string;
  hook: string;
  momentKind: MomentKind;
  confidence: number;
  platformFit: Partial<Record<PlatformId, number>>;
};

export type TransformativeSignals = {
  commentary: boolean;
  analysis: boolean;
  narration: boolean;
  substantialEditing: boolean;
  reaction: boolean;
  education: boolean;
  context: boolean;
};

export type ComplianceInput = {
  rightsStatus: RightsStatus;
  ownershipConfirmed: boolean;
  format: ClipFormat;
  platform?: PlatformId;
  aiAssistedCaptions: boolean;
  aiGeneratedVisuals: boolean;
  aiGeneratedVoice: boolean;
  commercialIntent: boolean;
  transformative: TransformativeSignals;
  repetitionRisk: RepetitionRisk;
  durationSeconds: number;
  title: string;
  previousTitles?: string[];
};

export type ComplianceDecision = {
  publishable: "yes" | "no" | "review";
  aiDisclosure: AiDisclosure;
  commercialDisclosure: "NOT_REQUIRED" | "REQUIRED" | "UNKNOWN";
  copyrightRisk: CopyrightRisk;
  monetization: Monetization;
  accountRisk: "LOW" | "MEDIUM" | "HIGH";
  contentRepetitionRisk: RepetitionRisk;
  rightsStatus: RightsStatus;
  rationale: string[];
  policyVersion: string;
};

export type LedgerEntry = {
  kind: LedgerKind;
  status: LedgerStatus;
  amountCents: number;
  isDemo: boolean;
};

export type PriorClip = {
  title: string;
  hook: string;
  description: string;
};
