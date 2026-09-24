import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { sql as getDb, type AnyRow } from "./helpers";
import { ensureCallerProfile } from "./profile";

async function requireOperator(userId: string) {
  const profile = await ensureCallerProfile(userId);
  if (profile.role !== "operator") {
    throw new Error("Operator access required.");
  }
  return profile;
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOperator(context.userId);
    const db = await getDb();
    const users = await db<{ n: number }>`select count(*)::int as n from profiles`;
    const clips = await db<{ n: number }>`select count(*)::int as n from clips`;
    const jobs = await db<{ status: string; n: number }>`select status, count(*)::int as n from engine_jobs group by status`;
    const pubs = await db<{ n: number }>`select count(*)::int as n from publications`;
    const audit = await db<AnyRow>`select * from audit_events order by created_at desc limit 40`;
    const failed = await db<AnyRow>`select * from engine_jobs where status = 'failed' order by updated_at desc limit 20`;
    return {
      users: users[0]?.n ?? 0,
      clips: clips[0]?.n ?? 0,
      publications: pubs[0]?.n ?? 0,
      jobs,
      audit,
      failed,
    };
  });

export const listUsersAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOperator(context.userId);
    const db = await getDb();
    return db<AnyRow>`select user_id, display_name, handle, role, demo_mode, onboarding_completed, created_at from profiles order by created_at desc`;
  });
