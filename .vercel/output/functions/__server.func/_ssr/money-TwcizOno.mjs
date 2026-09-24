import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { i as MIN_WITHDRAWAL_CENTS } from "./types-hvIGX_wW.mjs";
import { r as summarizeLedger, t as canWithdraw } from "./earnings-BozjqwJ6.mjs";
import { i as newId, o as sql, t as audit } from "./helpers-CmjLoKEF.mjs";
import { n as ensureCallerProfile } from "./profile-nag8fwPl.mjs";
import { t as recommendNext } from "./recommendations-Dkt_UpqO.mjs";
import { r as payoutsEnabled } from "./platforms-2gZEaLPg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-TwcizOno.js
var getEarnings_createServerFn_handler = createServerRpc({
	id: "86142a47cf4ad78d994b0f29432b4ebfbee86eafd46b684c847646cb52485ee7",
	name: "getEarnings",
	filename: "src/lib/server/money.ts"
}, (opts) => getEarnings.__executeServer(opts));
var getEarnings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getEarnings_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const rows = await db`
      select * from earnings_ledger
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc`;
	const summary = summarizeLedger(rows.map((r) => ({
		kind: r.kind,
		status: r.status,
		amountCents: Number(r.amount_cents),
		isDemo: r.is_demo
	})));
	const byPlatform = {};
	for (const r of rows) {
		const key = r.platform || "other";
		byPlatform[key] ??= {
			estimated: 0,
			confirmed: 0
		};
		if (r.kind === "estimated") byPlatform[key].estimated += Number(r.amount_cents);
		if (r.kind === "confirmed") byPlatform[key].confirmed += Number(r.amount_cents);
	}
	const withdrawals = await db`
      select * from withdrawals
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc limit 20`;
	const transactions = await db`
      select * from transactions
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc limit 40`;
	return {
		demoMode: profile.demo_mode,
		payoutsEnabled: payoutsEnabled(),
		minWithdrawalCents: MIN_WITHDRAWAL_CENTS,
		summary,
		ledger: rows,
		byPlatform,
		withdrawals,
		transactions
	};
});
var requestWithdrawal_createServerFn_handler = createServerRpc({
	id: "a2dd4135fe7c016af1763d6831b66f4bd06433363a04ad9d2c2b7e84e49eefba",
	name: "requestWithdrawal",
	filename: "src/lib/server/money.ts"
}, (opts) => requestWithdrawal.__executeServer(opts));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(requestWithdrawal_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	if ((await ensureCallerProfile(context.userId)).demo_mode) return {
		ok: false,
		error: "Demo earnings cannot be withdrawn."
	};
	const rows = await db`
      select * from earnings_ledger where user_id = ${context.userId} and is_demo = false`;
	const summary = summarizeLedger(rows.map((r) => ({
		kind: r.kind,
		status: r.status,
		amountCents: Number(r.amount_cents),
		isDemo: false
	})));
	const check = canWithdraw({
		availableCents: summary.availableCents,
		payoutsEnabled: payoutsEnabled()
	});
	if (!check.ok) return {
		ok: false,
		error: check.reason
	};
	if (data.amountCents > summary.availableCents) return {
		ok: false,
		error: "You cannot withdraw more than the available confirmed balance."
	};
	const id = newId("wdr");
	await db`insert into withdrawals (id, user_id, amount_cents, status, destination_kind, failure_reason, is_demo)
      values (${id}, ${context.userId}, ${data.amountCents}, ${"failed"}, ${"none"}, ${"Payouts are not yet enabled."}, ${false})`;
	await db`insert into transactions (id, user_id, kind, amount_cents, status, reference_id, description, is_demo)
      values (${newId("txn")}, ${context.userId}, ${"withdrawal"}, ${data.amountCents}, ${"failed"}, ${id}, ${"Payouts are not yet enabled."}, ${false})`;
	await audit(db, {
		userId: context.userId,
		actorId: context.userId,
		action: "withdrawal.blocked",
		entityType: "withdrawal",
		entityId: id,
		detail: "Payouts are not yet enabled."
	});
	return {
		ok: false,
		error: "Payouts are not yet enabled."
	};
});
var getAnalytics_createServerFn_handler = createServerRpc({
	id: "962fa6ac841d1133fec8b56f9715100e7975396788a54f66c2f8e30e27349a81",
	name: "getAnalytics",
	filename: "src/lib/server/money.ts"
}, (opts) => getAnalytics.__executeServer(opts));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAnalytics_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const snapshots = await db`
      select * from analytics_snapshots
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by collected_at desc limit 200`;
	const totals = await db`
      select coalesce(sum(views),0)::int as views,
             coalesce(sum(qualified_views),0)::int as qualified,
             coalesce(sum(watch_time_seconds),0)::int as watch,
             coalesce(sum(engagements),0)::int as engagements,
             coalesce(sum(followers_gained),0)::int as followers
      from analytics_snapshots
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}`;
	const clips = await db`select count(*)::int as n from clips where user_id = ${context.userId} and is_demo = ${profile.demo_mode}`;
	const published = await db`select count(*)::int as n from clips where user_id = ${context.userId} and is_demo = ${profile.demo_mode} and status in ('published','live','earning')`;
	const series = await db`select count(*)::int as n from series where user_id = ${context.userId} and is_demo = ${profile.demo_mode}`;
	const recs = recommendNext({
		clipCount: clips[0]?.n ?? 0,
		publishedCount: published[0]?.n ?? 0,
		seriesCount: series[0]?.n ?? 0,
		hasAnalytics: (totals[0]?.views ?? 0) > 0
	});
	return {
		demoMode: profile.demo_mode,
		snapshots,
		totals: totals[0] ?? {
			views: 0,
			qualified: 0,
			watch: 0,
			engagements: 0,
			followers: 0
		},
		recommendations: recs,
		hasAnalytics: (totals[0]?.views ?? 0) > 0
	};
});
//#endregion
export { getAnalytics_createServerFn_handler, getEarnings_createServerFn_handler, requestWithdrawal_createServerFn_handler };
