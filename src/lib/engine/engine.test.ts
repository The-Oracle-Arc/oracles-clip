import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectMoments, segmentEpisodes } from "./clip-detect.ts";
import { evaluateCompliance } from "./compliance.ts";
import { evaluateAiDisclosure } from "./disclosure.ts";
import { assessRepetition } from "./repetition.ts";
import { summarizeLedger, canWithdraw, formatUsd } from "./earnings.ts";
import { rightsAllowsPublish } from "./rights.ts";
import { recommendNext } from "./recommendations.ts";
import { publishFailureMessage } from "./platforms.ts";

describe("clip detection", () => {
  it("returns the whole source when already short", () => {
    const moments = detectMoments({ durationSeconds: 12, title: "Walk" });
    assert.equal(moments.length, 1);
    assert.equal(moments[0]?.endSeconds, 12);
  });

  it("finds multiple windows in a longer source", () => {
    const moments = detectMoments({ durationSeconds: 420, title: "Harbor" });
    assert.ok(moments.length >= 4);
    for (const m of moments) {
      assert.ok(m.endSeconds > m.startSeconds);
      assert.ok(m.confidence > 0 && m.confidence <= 1);
    }
  });

  it("segments a long source into bounded episodes", () => {
    const eps = segmentEpisodes({ durationSeconds: 3600, seriesName: "Harbor Lights", targetSeconds: 480 });
    assert.ok(eps.length >= 2 && eps.length <= 12);
    assert.equal(eps[0]?.episodeNumber, 1);
    assert.ok(eps[0]?.title.includes("Harbor Lights"));
  });
});

describe("compliance", () => {
  const transform = {
    commentary: true,
    analysis: false,
    narration: true,
    substantialEditing: true,
    reaction: false,
    education: false,
    context: true,
  };

  it("keeps publishability, disclosure, reuse and monetization separate", () => {
    const d = evaluateCompliance({
      rightsStatus: "owned",
      ownershipConfirmed: true,
      format: "short",
      aiAssistedCaptions: true,
      aiGeneratedVisuals: false,
      aiGeneratedVoice: false,
      commercialIntent: false,
      transformative: transform,
      repetitionRisk: "LOW",
      durationSeconds: 42,
      title: "Harbor morning",
    });
    assert.equal(d.publishable, "yes");
    assert.equal(d.aiDisclosure, "NOT_REQUIRED");
    assert.equal(d.copyrightRisk, "LOW_RISK");
    assert.equal(d.monetization, "MONETIZATION_SAFE");
    assert.ok(!d.rationale.some((r) => /legally safe/i.test(r)));
  });

  it("does not treat caption assistance as automatic AI disclosure", () => {
    const d = evaluateAiDisclosure({
      aiAssistedCaptions: true,
      aiGeneratedVisuals: false,
      aiGeneratedVoice: false,
      format: "short",
    });
    assert.equal(d.disclosure, "NOT_REQUIRED");
  });

  it("requires disclosure for generated visuals", () => {
    const d = evaluateAiDisclosure({
      aiAssistedCaptions: false,
      aiGeneratedVisuals: true,
      aiGeneratedVoice: false,
      format: "reel",
    });
    assert.equal(d.disclosure, "REQUIRED");
  });

  it("blocks unconfirmed or blocked rights", () => {
    const d = evaluateCompliance({
      rightsStatus: "blocked",
      ownershipConfirmed: true,
      format: "short",
      aiAssistedCaptions: false,
      aiGeneratedVisuals: false,
      aiGeneratedVoice: false,
      commercialIntent: false,
      transformative: transform,
      repetitionRisk: "LOW",
      durationSeconds: 30,
      title: "Movie scene",
    });
    assert.equal(d.publishable, "no");
    assert.equal(d.monetization, "NOT_ELIGIBLE");
    assert.equal(rightsAllowsPublish("unknown", true), false);
  });
});

describe("repetition", () => {
  it("flags near-identical hooks", () => {
    const r = assessRepetition({
      title: "She didn't know who was watching",
      hook: "She didn't know who was watching the door",
      previous: [
        { title: "She didn't know who was watching", hook: "She didn't know who was watching the door", description: "" },
        { title: "She didn't know who was watching 2", hook: "She didn't know who was watching the door", description: "" },
        { title: "She didn't know who was watching 3", hook: "She didn't know who was watching the door", description: "" },
      ],
    });
    assert.ok(r.risk === "HIGH" || r.risk === "BLOCK");
  });
});

describe("earnings ledger", () => {
  it("never treats estimated money as available", () => {
    const s = summarizeLedger([
      { kind: "estimated", status: "pending", amountCents: 50000, isDemo: false },
      { kind: "confirmed", status: "pending", amountCents: 1200, isDemo: false },
      { kind: "available", status: "available", amountCents: 400, isDemo: false },
    ]);
    assert.equal(s.estimatedCents, 50000);
    assert.equal(s.availableCents, 400);
    assert.equal(s.pendingCents, 1200);
    assert.equal(s.confirmedCents, 1200);
  });

  it("refuses withdrawals when payouts are disabled", () => {
    const r = canWithdraw({ availableCents: 10_000_00, payoutsEnabled: false });
    assert.equal(r.ok, false);
    assert.match(r.reason, /not yet enabled/i);
  });

  it("formats cents as dollars", () => {
    assert.equal(formatUsd(12480), "$124.80");
    assert.equal(formatUsd(0), "$0.00");
  });
});

describe("publishing honesty", () => {
  it("explains a missing connection instead of a generic failure", () => {
    const m = publishFailureMessage({ platform: "tiktok", connected: false, configured: true });
    assert.match(m.message, /Connect your TikTok/i);
  });
});

describe("revenue engine", () => {
  it("admits when there is not enough data", () => {
    const recs = recommendNext({
      clipCount: 0,
      publishedCount: 0,
      seriesCount: 0,
      hasAnalytics: false,
    });
    assert.ok(recs[0]?.reason.toLowerCase().includes("not enough"));
  });
});
