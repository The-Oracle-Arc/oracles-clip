import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { sql as getDb, type AnyRow } from "./helpers";
import { ensureCallerProfile } from "./profile";

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    return db<AnyRow>`
      select * from notifications
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc
      limit 40`;
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    await db<AnyRow>`update notifications set read_at = now()
      where user_id = ${context.userId} and read_at is null`;
    return { ok: true as const };
  });

export const listPolicies = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const db = await getDb();
    const policies = await db<AnyRow>`select * from policies order by platform, topic`;
    const changes = await db<AnyRow>`select * from policy_changes order by created_at desc limit 30`;
    return { policies, changes };
  });
