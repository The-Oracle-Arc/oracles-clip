import type { PriorClip, RepetitionRisk } from "./types.ts";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string): Set<string> {
  return new Set(normalize(text).split(" ").filter((t) => t.length > 2));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function assessRepetition(input: {
  title: string;
  hook: string;
  description?: string;
  previous: PriorClip[];
}): { risk: RepetitionRisk; score: number; similarCount: number; rationale: string } {
  if (input.previous.length === 0) {
    return { risk: "LOW", score: 0, similarCount: 0, rationale: "No prior titles to compare." };
  }
  const title = tokens(input.title);
  const hook = tokens(input.hook);
  const desc = tokens(input.description || "");
  let similar = 0;
  let max = 0;
  for (const prev of input.previous) {
    const t = jaccard(title, tokens(prev.title));
    const h = jaccard(hook, tokens(prev.hook));
    const d = jaccard(desc, tokens(prev.description));
    const score = Math.max(t, h, d * 0.8);
    max = Math.max(max, score);
    if (score >= 0.72) similar += 1;
  }
  if (max >= 0.92 || similar >= 6) {
    return {
      risk: "BLOCK",
      score: max,
      similarCount: similar,
      rationale: "These pieces are materially similar. Publishing at this volume creates account and monetization risk.",
    };
  }
  if (max >= 0.8 || similar >= 3) {
    return {
      risk: "HIGH",
      score: max,
      similarCount: similar,
      rationale: "Several recent pieces share the same template, hook, or caption. Vary the work before scaling.",
    };
  }
  if (max >= 0.58 || similar >= 1) {
    return {
      risk: "MEDIUM",
      score: max,
      similarCount: similar,
      rationale: "There is overlap with recent work. A little more original contribution will lower the risk.",
    };
  }
  return {
    risk: "LOW",
    score: max,
    similarCount: similar,
    rationale: "Variation against recent work looks healthy.",
  };
}
