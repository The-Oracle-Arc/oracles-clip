//#region node_modules/.nitro/vite/services/ssr/assets/earnings-BozjqwJ6.js
function sum(entries, pred) {
	return entries.filter(pred).reduce((acc, e) => acc + e.amountCents, 0);
}
/** Confirmed money only. Estimated entries never enter these totals. */
function summarizeLedger(entries) {
	const confirmed = sum(entries, (e) => e.kind === "confirmed" && e.status !== "reversed" && e.status !== "failed");
	return {
		estimatedCents: sum(entries, (e) => e.kind === "estimated" && e.status !== "reversed"),
		confirmedCents: confirmed,
		availableCents: sum(entries, (e) => e.kind === "available" && e.status === "available"),
		pendingCents: sum(entries, (e) => (e.kind === "confirmed" || e.kind === "available") && (e.status === "pending" || e.status === "processing" || e.status === "on_hold")),
		withdrawnCents: sum(entries, (e) => e.kind === "withdrawn" && e.status === "withdrawn"),
		failedCents: sum(entries, (e) => e.status === "failed"),
		lifetimeConfirmedCents: confirmed
	};
}
function canWithdraw(input) {
	if (!input.payoutsEnabled) return {
		ok: false,
		reason: "Payouts are not yet enabled."
	};
	const min = input.minCents ?? 2500;
	if (input.availableCents < min) return {
		ok: false,
		reason: `The minimum withdrawal is ${formatUsd(min)}. Available confirmed balance is ${formatUsd(input.availableCents)}.`
	};
	return {
		ok: true,
		reason: "Ready to request a withdrawal."
	};
}
function formatUsd(cents) {
	const sign = cents < 0 ? "-" : "";
	const abs = Math.abs(cents);
	const dollars = Math.floor(abs / 100);
	const rest = String(abs % 100).padStart(2, "0");
	return `${sign}$${dollars.toLocaleString("en-US")}.${rest}`;
}
//#endregion
export { formatUsd as n, summarizeLedger as r, canWithdraw as t };
