import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { summarizeLedger } from "@/lib/engine/earnings";
import { recommendNext } from "@/lib/engine/recommendations";
import { payoutsEnabled } from "@/lib/engine/platforms";
import { sql as getDb, type AnyRow } from "./helpers";
import { ensureCallerProfile } from "./profile";
import { loadFactory } from "./factory";

export const getHome = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const demo = profile.demo_mode;
    const clipCounts = await db<{ status: string; n: number }>`
      select status, count(*)::int as n from clips
      where user_id = ${context.userId} and is_demo = ${demo}
      group by status`;
    const byStatus: Record<string, number> = {};
    let clipsCreated = 0;
    for (const row of clipCounts) {
      byStatus[row.status] = row.n;
      clipsCreated += row.n;
    }
    const seriesCount = await db<{ n: number }>`select count(*)::int as n from series where user_id = ${context.userId} and is_demo = ${demo}`;
    const ledger = await db<{ kind: string; status: string; amount_cents: number; is_demo: boolean }>`
      select kind, status, amount_cents, is_demo from earnings_ledger
      where user_id = ${context.userId} and is_demo = ${demo}`;
    const money = summarizeLedger(
      ledger.map((r) => ({
        kind: r.kind as never,
        status: r.status as never,
        amountCents: Number(r.amount_cents),
        isDemo: r.is_demo,
      })),
    );
    const analytics = await db<{ views: number; engagements: number; followers: number }>`
      select coalesce(sum(views),0)::int as views,
             coalesce(sum(engagements),0)::int as engagements,
             coalesce(sum(followers_gained),0)::int as followers
      from analytics_snapshots
      where user_id = ${context.userId} and is_demo = ${demo}`;
    const recentClips = await db<AnyRow>`
      select id, title, status, format, duration_seconds, thumbnail_data_url, created_at, series_id, episode_number
      from clips
      where user_id = ${context.userId} and is_demo = ${demo}
      order by created_at desc limit 6`;
    const recentEvents = await db<AnyRow>`
      select id, kind, message, created_at from engine_events
      where user_id = ${context.userId} and is_demo = ${demo}
      order by created_at desc limit 8`;
    const unread = await db<{ n: number }>`
      select count(*)::int as n from notifications
      where user_id = ${context.userId} and read_at is null and is_demo = ${demo}`;
    const platforms = await db<{ platform: string; status: string }>`
      select platform, status from platform_accounts
      where user_id = ${context.userId} and is_demo = ${demo}`;
    const attention = platforms.filter((p) => p.status === "authorization_required" || p.status === "restricted");
    const factory = await loadFactory(context.userId, profile);
    const recs = recommendNext({
      clipCount: clipsCreated,
      publishedCount: (byStatus.published ?? 0) + (byStatus.live ?? 0) + (byStatus.earning ?? 0),
      seriesCount: seriesCount[0]?.n ?? 0,
      hasAnalytics: (analytics[0]?.views ?? 0) > 0,
    });
    const opportunities = await db<AnyRow>`
      select * from revenue_opportunities
      where user_id = ${context.userId} and is_demo = ${demo}
      order by created_at desc limit 3`;

    return {
      profile,
      demoMode: demo,
      payoutsEnabled: payoutsEnabled(),
      money,
      analytics: analytics[0] ?? { views: 0, engagements: 0, followers: 0 },
      clipsCreated,
      byStatus,
      seriesCount: seriesCount[0]?.n ?? 0,
      recentClips,
      recentEvents,
      unreadCount: unread[0]?.n ?? 0,
      platformAttention: attention.length,
      factory,
      recommendations: recs,
      opportunities,
    };
  });
