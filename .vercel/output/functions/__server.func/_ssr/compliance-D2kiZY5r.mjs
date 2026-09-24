import { c as POLICY_VERSION } from "./types-hvIGX_wW.mjs";
import { r as rightsAllowsPublish } from "./rights-Blc7xP7N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compliance-D2kiZY5r.js
/**
* AI disclosure is evaluated from how the content was made — not from
* "any AI was involved somewhere in the toolchain".
*/
function evaluateAiDisclosure(input) {
	const { aiGeneratedVisuals, aiGeneratedVoice, aiAssistedCaptions } = input;
	if (aiGeneratedVisuals && aiGeneratedVoice) return {
		disclosure: "REQUIRED",
		rationale: "The picture and the voice were generated. Most platforms require a disclosure for this."
	};
	if (aiGeneratedVisuals) return {
		disclosure: "REQUIRED",
		rationale: "Generated visuals usually require an AI disclosure on the destination platform."
	};
	if (aiGeneratedVoice) return {
		disclosure: "REQUIRED",
		rationale: "A generated voice is treated as synthetic media on several platforms."
	};
	if (aiAssistedCaptions) return {
		disclosure: "NOT_REQUIRED",
		rationale: "Captions that transcribe the original speech are a production aid, not a substitute for the work. This is not an automatic disclosure trigger."
	};
	return {
		disclosure: "NOT_REQUIRED",
		rationale: "No generated picture or voice was declared for this piece."
	};
}
function transformativeScore(t) {
	return [
		t.commentary,
		t.analysis,
		t.narration,
		t.substantialEditing,
		t.reaction,
		t.education,
		t.context
	].filter(Boolean).length;
}
function evaluateCompliance(input) {
	const rationale = [];
	const transform = transformativeScore(input.transformative);
	const rightsOk = rightsAllowsPublish(input.rightsStatus, input.ownershipConfirmed);
	let copyright = "REVIEW_REQUIRED";
	if (!input.ownershipConfirmed) {
		copyright = "REVIEW_REQUIRED";
		rationale.push("Ownership or permission has not been confirmed.");
	} else if (input.rightsStatus === "blocked") {
		copyright = "HIGH_RISK";
		rationale.push("This source is blocked and cannot be published.");
	} else if (input.rightsStatus === "unknown" || input.rightsStatus === "review_required") {
		copyright = "REVIEW_REQUIRED";
		rationale.push("Rights are not established. Detected risk is not a legal opinion.");
	} else if ((input.rightsStatus === "licensed" || input.rightsStatus === "authorized" || input.rightsStatus === "public_domain") && transform === 0) {
		copyright = "MEDIUM_RISK";
		rationale.push("Rights look documented, but there is little original contribution. Transformation is not a guarantee of safety.");
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
	let commercial = "NOT_REQUIRED";
	if (input.commercialIntent && input.rightsStatus !== "owned") {
		commercial = "REQUIRED";
		rationale.push("Commercial use of third-party material usually needs a commercial disclosure and a license check.");
	} else if (input.commercialIntent) {
		commercial = "REQUIRED";
		rationale.push("Paid promotion or commercial intent should be disclosed on the destination platform.");
	}
	let monetization = "UNKNOWN";
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
	let publishable = "review";
	if (input.rightsStatus === "blocked" || input.repetitionRisk === "BLOCK" || !input.ownershipConfirmed) publishable = "no";
	else if (rightsOk && copyright === "LOW_RISK" && input.repetitionRisk === "LOW") publishable = "yes";
	else if (copyright === "HIGH_RISK") publishable = "no";
	let accountRisk = "LOW";
	if (input.repetitionRisk === "BLOCK" || copyright === "HIGH_RISK") accountRisk = "HIGH";
	else if (input.repetitionRisk === "HIGH" || copyright === "MEDIUM_RISK") accountRisk = "MEDIUM";
	if (publishable === "yes") rationale.push("Publishable under current checks. Destination rules can still refuse the upload.");
	else if (publishable === "no") rationale.push("Publishing is held. Resolve rights, repetition, or policy before trying again.");
	else rationale.push("A person should look at this before it goes out.");
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
		policyVersion: POLICY_VERSION
	};
}
//#endregion
export { evaluateCompliance as t };
