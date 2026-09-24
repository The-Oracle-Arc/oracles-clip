import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { r as summarizeLedger } from "./earnings-BozjqwJ6.mjs";
import { o as sql } from "./helpers-CmjLoKEF.mjs";
import { n as ensureCallerProfile } from "./profile-nag8fwPl.mjs";
import { r as loadFactory } from "./factory-iVnNnG1d.mjs";
import { t as recommendNext } from "./recommendations-Dkt_UpqO.mjs";
import { r as payoutsEnabled } from "./platforms-2gZEaLPg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-BtZYosf1.js
var getHome_createServerFn_handler = createServerRpc({
	id: "12f4ab217857644cafeba5584ea11337588ccfb271c4926d9a37286345b8bdf9",
	name: "getHome",
	filename: "src/lib/server/home.ts"
}, (opts) => getHome.__executeServer(opts));
var getHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getHome_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const demo = profile.demo_mode;
	const clipCounts = await db`
      select status, count(*)::int as n from clips
      where user_id = ${context.userId} and is_demo = ${demo}
      group by status`;
	const byStatus = {};
	let clipsCreated = 0;
	for (const row of clipCounts) {
		byStatus[row.status] = row.n;
		clipsCreated += row.n;
	}
	const seriesCount = await db`select count(*)::int as n from series where user_id = ${context.userId} and is_demo = ${demo}`;
	const ledger = await db`
      select kind, status, amount_cents, is_demo from earnings_ledger
      where user_id = ${context.userId} and is_demo = ${demo}`;
	const money = summarizeLedger(ledger.map((r) => ({
		kind: r.kind,
		status: r.status,
		amountCents: Number(r.amount_cents),
		isDemo: r.is_demo
	})));
	const analytics = await db`
      select coalesce(sum(views),0)::int as views,
             coalesce(sum(engagements),0)::int as engagements,
             coalesce(sum(followers_gained),0)::int as followers
      from analytics_snapshots
      where user_id = ${context.userId} and is_demo = ${demo}`;
	const recentClips = await db`
      select id, title, status, format, duration_seconds, thumbnail_data_url, created_at, series_id, episode_number
      from clips
      where user_id = ${context.userId} and is_demo = ${demo}
      order by created_at desc limit 6`;
	const recentEvents = await db`
      select id, kind, message, created_at from engine_events
      where user_id = ${context.userId} and is_demo = ${demo}
      order by created_at desc limit 8`;
	const unread = await db`
      select count(*)::int as n from notifications
      where user_id = ${context.userId} and read_at is null and is_demo = ${demo}`;
	const attention = (await db`
      select platform, status from platform_accounts
      where user_id = ${context.userId} and is_demo = ${demo}`).filter((p) => p.status === "authorization_required" || p.status === "restricted");
	const factory = await loadFactory(context.userId, profile);
	const recs = recommendNext({
		clipCount: clipsCreated,
		publishedCount: (byStatus.published ?? 0) + (byStatus.live ?? 0) + (byStatus.earning ?? 0),
		seriesCount: seriesCount[0]?.n ?? 0,
		hasAnalytics: (analytics[0]?.views ?? 0) > 0
	});
	const opportunities = await db`
      select * from revenue_opportunities
      where user_id = ${context.userId} and is_demo = ${demo}
      order by created_at desc limit 3`;
	return {
		profile,
		demoMode: demo,
		payoutsEnabled: payoutsEnabled(),
		money,
		analytics: analytics[0] ?? {
			views: 0,
			engagements: 0,
			followers: 0
		},
		clipsCreated,
		byStatus,
		seriesCount: seriesCount[0]?.n ?? 0,
		recentClips,
		recentEvents,
		unreadCount: unread[0]?.n ?? 0,
		platformAttention: attention.length,
		factory,
		recommendations: recs,
		opportunities
	};
});
//#endregion
export { getHome_createServerFn_handler };
