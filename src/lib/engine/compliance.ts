import { evaluateAiDisclosure } from "./disclosure.ts";
import { rightsAllowsPublish } from "./rights.ts";
import type { ComplianceDecision, ComplianceInput } from "./types.ts";
import { POLICY_VERSION } from "./types.ts";

function transformativeScore(t: ComplianceInput["transformative"]): number {
  return [
    t.commentary,
    t.analysis,
    t.narration,
    t.substantialEditing,
    t.reaction,
    t.education,
    t.context,
  ].filter(Boolean).length;
}

export function evaluateCompliance(input: ComplianceInput): ComplianceDecision {
  const rationale: string[] = [];
  const transform = transformativeScore(input.transformative);
  const rightsOk = rightsAllowsPublish(input.rightsStatus, input.ownershipConfirmed);

  let copyright = "REVIEW_REQUIRED" as ComplianceDecision["copyrightRisk"];
  if (!input.ownershipConfirmed) {
    copyright = "REVIEW_REQUIRED";
    rationale.push("Ownership or permission has not been confirmed.");
  } else if (input.rightsStatus === "blocked") {
    copyright = "HIGH_RISK";
    rationale.push("This source is blocked and cannot be published.");
  } else if (input.rightsStatus === "unknown" || input.rightsStatus === "review_required") {
    copyright = "REVIEW_REQUIRED";
    rationale.push("Rights are not established. Detected risk is not a legal opinion.");
  } else if (
    (input.rightsStatus === "licensed" || input.rightsStatus === "authorized" || input.rightsStatus === "public_domain") &&
    transform === 0
  ) {
    copyright = "MEDIUM_RISK";
    rationale.push(
      "Rights look documented, but there is little original contribution. Transformation is not a guarantee of safety.",
    );
  } else if (input.rightsStatus === "owned" && transform >= 1) {
    copyright = "LOW_RISK";
    rationale.push("Owned source with original contribution. This is a low detected risk, not a legal clearance.");
  } else if (input.rightsStatus === "owned") {
    copyright = "LOW_RISK";
    rationale.push("Owned source. Still confirm that music, faces, and third-party clips inside the file are cleared.");
  } else {
    copyright = "MEDIUM_RISK";
    rationale.push("Documented rights with limited original contribution. Review recommended.");
  }

  const ai = evaluateAiDisclosure(input);
  rationale.push(ai.rationale);

  let commercial: ComplianceDecision["commercialDisclosure"] = "NOT_REQUIRED";
  if (input.commercialIntent && input.rightsStatus !== "owned") {
    commercial = "REQUIRED";
    rationale.push("Commercial use of third-party material usually needs a commercial disclosure and a license check.");
  } else if (input.commercialIntent) {
    commercial = "REQUIRED";
    rationale.push("Paid promotion or commercial intent should be disclosed on the destination platform.");
  }

  let monetization: ComplianceDecision["monetization"] = "UNKNOWN";
  if (!rightsOk || copyright === "HIGH_RISK" || input.rightsStatus === "blocked") {
    monetization = "NOT_ELIGIBLE";
    rationale.push("Monetization is not eligible until rights and reuse risk are resolved.");
  } else if (input.repetitionRisk === "BLOCK" || input.repetitionRisk === "HIGH") {
    monetization = "MONETIZATION_RISK";
    rationale.push("Channel-level repetition can put creator programs and the account itself at risk.");
  } else if (copyright === "REVIEW_REQUIRED" || copyright === "MEDIUM_RISK" || input.repetitionRisk === "MEDIUM") {
    monetization = "MONETIZATION_REVIEW";
    rationale.push("Monetization should be reviewed — originality, reuse, or disclosure is not settled.");
  } else if (input.durationSeconds > 0 && input.durationSeconds < 8) {
    monetization = "MONETIZATION_REVIEW";
    rationale.push("Very short pieces are often ineligible or weakly monetized on major platforms.");
  } else {
    monetization = "MONETIZATION_SAFE";
    rationale.push("No automatic disqualifier fired. This is not a promise of revenue.");
  }

  let publishable: ComplianceDecision["publishable"] = "review";
  if (input.rightsStatus === "blocked" || input.repetitionRisk === "BLOCK" || !input.ownershipConfirmed) {
    publishable = "no";
  } else if (rightsOk && copyright === "LOW_RISK" && input.repetitionRisk === "LOW") {
    publishable = "yes";
  } else if (copyright === "HIGH_RISK") {
    publishable = "no";
  }

  let accountRisk: ComplianceDecision["accountRisk"] = "LOW";
  if (input.repetitionRisk === "BLOCK" || copyright === "HIGH_RISK") accountRisk = "HIGH";
  else if (input.repetitionRisk === "HIGH" || copyright === "MEDIUM_RISK") accountRisk = "MEDIUM";

  if (publishable === "yes") {
    rationale.push("Publishable under current checks. Destination rules can still refuse the upload.");
  } else if (publishable === "no") {
    rationale.push("Publishing is held. Resolve rights, repetition, or policy before trying again.");
  } else {
    rationale.push("A person should look at this before it goes out.");
  }

  return {
    publishable,
    aiDisclosure: ai.disclosure,
    commercialDisclosure: commercial,
    copyrightRisk: copyright,
    monetization,
    accountRisk,
    contentRepetitionRisk: input.repetitionRisk,
    rightsStatus: input.rightsStatus,
    rationale,
    policyVersion: POLICY_VERSION,
  };
}
