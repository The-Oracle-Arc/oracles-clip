import type { LedgerEntry } from "./types.ts";
import { MIN_WITHDRAWAL_CENTS } from "./types.ts";

function sum(entries: LedgerEntry[], pred: (e: LedgerEntry) => boolean): number {
  return entries.filter(pred).reduce((acc, e) => acc + e.amountCents, 0);
}

/** Confirmed money only. Estimated entries never enter these totals. */
export function summarizeLedger(entries: LedgerEntry[]) {
  const confirmed = sum(entries, (e) => e.kind === "confirmed" && e.status !== "reversed" && e.status !== "failed");
  const estimated = sum(entries, (e) => e.kind === "estimated" && e.status !== "reversed");
  const available = sum(entries, (e) => e.kind === "available" && e.status === "available");
  const pending = sum(
    entries,
    (e) =>
      (e.kind === "confirmed" || e.kind === "available") &&
      (e.status === "pending" || e.status === "processing" || e.status === "on_hold"),
  );
  const withdrawn = sum(entries, (e) => e.kind === "withdrawn" && e.status === "withdrawn");
  const failed = sum(entries, (e) => e.status === "failed");
  return {
    estimatedCents: estimated,
    confirmedCents: confirmed,
    availableCents: available,
    pendingCents: pending,
    withdrawnCents: withdrawn,
    failedCents: failed,
    lifetimeConfirmedCents: confirmed,
  };
}

export function canWithdraw(input: {
  availableCents: number;
  payoutsEnabled: boolean;
  minCents?: number;
}): { ok: boolean; reason: string } {
  if (!input.payoutsEnabled) {
    return { ok: false, reason: "Payouts are not yet enabled." };
  }
  const min = input.minCents ?? MIN_WITHDRAWAL_CENTS;
  if (input.availableCents < min) {
    return {
      ok: false,
      reason: `The minimum withdrawal is ${formatUsd(min)}. Available confirmed balance is ${formatUsd(input.availableCents)}.`,
    };
  }
  return { ok: true, reason: "Ready to request a withdrawal." };
}

export function formatUsd(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, "0");
  return `${sign}$${dollars.toLocaleString("en-US")}.${rest}`;
}

export function estimatedBandFromSignals(input: {
  durationSeconds: number;
  monetization: string;
  format: string;
}): { lowCents: number; highCents: number; label: string } | null {
  if (input.monetization === "NOT_ELIGIBLE") return null;
  // Bands are illustrative ranges for UI copy only — never written as confirmed.
  const base = input.durationSeconds >= 45 ? 800 : 320;
  const formatBoost = input.format === "episode" || input.format === "long_form" ? 1.4 : 1;
  const riskCut = input.monetization === "MONETIZATION_RISK" ? 0.35 : input.monetization === "MONETIZATION_REVIEW" ? 0.6 : 1;
  const low = Math.round(base * 0.4 * formatBoost * riskCut);
  const high = Math.round(base * 1.8 * formatBoost * riskCut);
  return { lowCents: low, highCents: high, label: "Estimated" };
}
