import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { newId } from "@/lib/ids";
import { canWithdraw, summarizeLedger } from "@/lib/engine/earnings";
import { payoutsEnabled } from "@/lib/engine/platforms";
import { MIN_WITHDRAWAL_CENTS } from "@/lib/engine/types";
import { recommendNext } from "@/lib/engine/recommendations";
import { audit, sql as getDb, type AnyRow } from "./helpers";
import { ensureCallerProfile } from "./profile";

type LedgerRow = {
  id: string;
  kind: string;
  status: string;
  amount_cents: number;
  platform: string | null;
  revenue_source: string;
  clip_id: string | null;
  series_id: string | null;
  note: string | null;
  is_demo: boolean;
  created_at: string;
};

export const getEarnings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const rows = await db<LedgerRow>`
      select * from earnings_ledger
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc`;
    const summary = summarizeLedger(
      rows.map((r) => ({
        kind: r.kind as never,
        status: r.status as never,
        amountCents: Number(r.amount_cents),
        isDemo: r.is_demo,
      })),
    );
    const byPlatform: Record<string, { estimated: number; confirmed: number }> = {};
    for (const r of rows) {
      const key = r.platform || "other";
      byPlatform[key] ??= { estimated: 0, confirmed: 0 };
      if (r.kind === "estimated") byPlatform[key].estimated += Number(r.amount_cents);
      if (r.kind === "confirmed") byPlatform[key].confirmed += Number(r.amount_cents);
    }
    const withdrawals = await db<AnyRow>`
      select * from withdrawals
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc limit 20`;
    const transactions = await db<AnyRow>`
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
      transactions,
    };
  });

export const requestWithdrawal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { amountCents: number }) => input)
  .handler(async ({ context, data }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    if (profile.demo_mode) {
      return { ok: false as const, error: "Demo earnings cannot be withdrawn." };
    }
    const rows = await db<LedgerRow>`
      select * from earnings_ledger where user_id = ${context.userId} and is_demo = false`;
    const summary = summarizeLedger(
      rows.map((r) => ({
        kind: r.kind as never,
        status: r.status as never,
        amountCents: Number(r.amount_cents),
        isDemo: false,
      })),
    );
    const check = canWithdraw({
      availableCents: summary.availableCents,
      payoutsEnabled: payoutsEnabled(),
    });
    if (!check.ok) return { ok: false as const, error: check.reason };
    if (data.amountCents > summary.availableCents) {
      return { ok: false as const, error: "You cannot withdraw more than the available confirmed balance." };
    }
    const id = newId("wdr");
    await db<AnyRow>`insert into withdrawals (id, user_id, amount_cents, status, destination_kind, failure_reason, is_demo)
      values (${id}, ${context.userId}, ${data.amountCents}, ${"failed"}, ${"none"}, ${"Payouts are not yet enabled."}, ${false})`;
    await db<AnyRow>`insert into transactions (id, user_id, kind, amount_cents, status, reference_id, description, is_demo)
      values (${newId("txn")}, ${context.userId}, ${"withdrawal"}, ${data.amountCents}, ${"failed"}, ${id}, ${"Payouts are not yet enabled."}, ${false})`;
    await audit(db, {
      userId: context.userId,
      actorId: context.userId,
      action: "withdrawal.blocked",
      entityType: "withdrawal",
      entityId: id,
      detail: "Payouts are not yet enabled.",
    });
    return { ok: false as const, error: "Payouts are not yet enabled." };
  });

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const snapshots = await db<AnyRow>`
      select * from analytics_snapshots
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by collected_at desc limit 200`;
    const totals = await db<{
      views: number;
      qualified: number;
      watch: number;
      engagements: number;
      followers: number;
    }>`
      select coalesce(sum(views),0)::int as views,
             coalesce(sum(qualified_views),0)::int as qualified,
             coalesce(sum(watch_time_seconds),0)::int as watch,
             coalesce(sum(engagements),0)::int as engagements,
             coalesce(sum(followers_gained),0)::int as followers
      from analytics_snapshots
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}`;
    const clips = await db<{ n: number }>`select count(*)::int as n from clips where user_id = ${context.userId} and is_demo = ${profile.demo_mode}`;
    const published = await db<{ n: number }>`select count(*)::int as n from clips where user_id = ${context.userId} and is_demo = ${profile.demo_mode} and status in ('published','live','earning')`;
    const series = await db<{ n: number }>`select count(*)::int as n from series where user_id = ${context.userId} and is_demo = ${profile.demo_mode}`;
    const recs = recommendNext({
      clipCount: clips[0]?.n ?? 0,
      publishedCount: published[0]?.n ?? 0,
      seriesCount: series[0]?.n ?? 0,
      hasAnalytics: (totals[0]?.views ?? 0) > 0,
    });
    return {
      demoMode: profile.demo_mode,
      snapshots,
      totals: totals[0] ?? { views: 0, qualified: 0, watch: 0, engagements: 0, followers: 0 },
      recommendations: recs,
      hasAnalytics: (totals[0]?.views ?? 0) > 0,
    };
  });
