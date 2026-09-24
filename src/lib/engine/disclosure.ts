import type { AiDisclosure, ClipFormat } from "./types.ts";

/**
 * AI disclosure is evaluated from how the content was made — not from
 * "any AI was involved somewhere in the toolchain".
 */
export function evaluateAiDisclosure(input: {
  aiAssistedCaptions: boolean;
  aiGeneratedVisuals: boolean;
  aiGeneratedVoice: boolean;
  format: ClipFormat;
}): { disclosure: AiDisclosure; rationale: string } {
  const { aiGeneratedVisuals, aiGeneratedVoice, aiAssistedCaptions } = input;

  if (aiGeneratedVisuals && aiGeneratedVoice) {
    return {
      disclosure: "REQUIRED",
      rationale: "The picture and the voice were generated. Most platforms require a disclosure for this.",
    };
  }
  if (aiGeneratedVisuals) {
    return {
      disclosure: "REQUIRED",
      rationale: "Generated visuals usually require an AI disclosure on the destination platform.",
    };
  }
  if (aiGeneratedVoice) {
    return {
      disclosure: "REQUIRED",
      rationale: "A generated voice is treated as synthetic media on several platforms.",
    };
  }
  if (aiAssistedCaptions) {
    return {
      disclosure: "NOT_REQUIRED",
      rationale:
        "Captions that transcribe the original speech are a production aid, not a substitute for the work. This is not an automatic disclosure trigger.",
    };
  }
  return {
    disclosure: "NOT_REQUIRED",
    rationale: "No generated picture or voice was declared for this piece.",
  };
}
