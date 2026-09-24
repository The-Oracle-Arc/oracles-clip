import type { ClipCandidate, MomentKind, PlatformId } from "./types.ts";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

const WINDOWS: Array<{ len: number; kind: MomentKind; title: string; hook: string; at: number }> = [
  {
    len: 12,
    kind: "hook",
    title: "Opening hook",
    hook: "The first seconds that decide whether someone stays.",
    at: 0,
  },
  {
    len: 27,
    kind: "high_retention",
    title: "Hold the middle",
    hook: "A denser stretch where the source is most active.",
    at: 0.18,
  },
  {
    len: 38,
    kind: "story_turn",
    title: "The turn",
    hook: "A natural shift in the story — not a manufactured cliffhanger.",
    at: 0.34,
  },
  {
    len: 45,
    kind: "emotional",
    title: "The human beat",
    hook: "A quieter stretch that carries feeling rather than noise.",
    at: 0.48,
  },
  {
    len: 32,
    kind: "dialogue",
    title: "What was said",
    hook: "A passage built around speech, not just cutting.",
    at: 0.58,
  },
  {
    len: 22,
    kind: "visual_peak",
    title: "Visual peak",
    hook: "A tighter window around likely visual energy.",
    at: 0.72,
  },
  {
    len: 48,
    kind: "educational",
    title: "The explanation",
    hook: "A longer cut suited to teaching or walking through an idea.",
    at: 0.4,
  },
  {
    len: 20,
    kind: "episode_boundary",
    title: "Natural pause",
    hook: "A possible episode break rather than an arbitrary cut.",
    at: 0.85,
  },
];

function platformFit(duration: number, kind: MomentKind): Partial<Record<PlatformId, number>> {
  const shortScore = duration <= 60 ? 0.9 : duration <= 90 ? 0.72 : 0.4;
  const midScore = duration >= 45 && duration <= 180 ? 0.86 : 0.5;
  const longScore = duration >= 90 ? 0.8 : 0.35;
  const eduBoost = kind === "educational" || kind === "dialogue" ? 0.08 : 0;
  return {
    youtube: clamp(shortScore * 0.7 + longScore * 0.5 + eduBoost, 0.2, 0.95),
    tiktok: clamp(shortScore, 0.2, 0.95),
    instagram: clamp(shortScore * 0.95, 0.2, 0.95),
    facebook: clamp(midScore, 0.2, 0.9),
    x: clamp(shortScore * 0.7, 0.2, 0.85),
    linkedin: clamp(kind === "educational" ? 0.78 : 0.4, 0.2, 0.85),
    snapchat: clamp(shortScore, 0.2, 0.9),
    pinterest: clamp(kind === "visual_peak" ? 0.74 : 0.45, 0.2, 0.85),
    threads: clamp(shortScore * 0.65, 0.2, 0.8),
  };
}

export function detectMoments(input: {
  durationSeconds: number;
  title?: string | null;
  formatHint?: string | null;
}): ClipCandidate[] {
  const duration = Math.max(0, input.durationSeconds || 0);
  const sourceTitle = (input.title || "Untitled source").trim();

  if (duration <= 0) {
    return [
      {
        startSeconds: 0,
        endSeconds: 30,
        titleSuggestion: sourceTitle,
        hook: "Duration is unknown — trim this window after previewing the source.",
        momentKind: "hook",
        confidence: 0.34,
        platformFit: platformFit(30, "hook"),
      },
    ];
  }

  if (duration < 18) {
    return [
      {
        startSeconds: 0,
        endSeconds: round1(duration),
        titleSuggestion: sourceTitle,
        hook: "The whole source is already short-form length.",
        momentKind: "hook",
        confidence: 0.88,
        platformFit: platformFit(duration, "hook"),
      },
    ];
  }

  const out: ClipCandidate[] = [];
  for (const window of WINDOWS) {
    if (window.len > duration) continue;
    const start = round1(clamp(duration * window.at, 0, Math.max(0, duration - window.len)));
    const end = round1(Math.min(duration, start + window.len));
    const len = end - start;
    if (len < 8) continue;
    const openingBoost = start < 3 ? 0.08 : 0;
    const sweet = len >= 21 && len <= 48 ? 0.1 : 0;
    const confidence = clamp(0.46 + openingBoost + sweet + (1 - window.at) * 0.08, 0.38, 0.92);
    out.push({
      startSeconds: start,
      endSeconds: end,
      titleSuggestion: `${sourceTitle} — ${window.title}`,
      hook: window.hook,
      momentKind: window.kind,
      confidence: round1(confidence * 100) / 100,
      platformFit: platformFit(len, window.kind),
    });
  }

  const seen = new Set<string>();
  return out.filter((c) => {
    const key = `${c.startSeconds}-${c.endSeconds}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function segmentEpisodes(input: {
  durationSeconds: number;
  seriesName: string;
  targetSeconds?: number;
}): Array<{ startSeconds: number; endSeconds: number; episodeNumber: number; title: string; hook: string }> {
  const duration = Math.max(0, input.durationSeconds || 0);
  const target = input.targetSeconds ?? (duration >= 20 * 60 ? 8 * 60 : 55);
  if (duration <= 0) {
    return [
      {
        startSeconds: 0,
        endSeconds: target,
        episodeNumber: 1,
        title: `${input.seriesName} — Episode 1`,
        hook: "Duration unknown. Confirm the in and out points before publishing.",
      },
    ];
  }
  if (duration <= target * 1.25) {
    return [
      {
        startSeconds: 0,
        endSeconds: round1(duration),
        episodeNumber: 1,
        title: `${input.seriesName} — Episode 1`,
        hook: "The source fits a single episode. Split only if the story actually turns.",
      },
    ];
  }

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
    "Coda",
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
      hook: `Continues the story from episode ${i === 0 ? "the opening" : String(i).padStart(2, "0")}.`,
    });
  }
  return episodes;
}
