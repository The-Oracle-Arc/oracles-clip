import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureProfile, sql as getDb, type ProfileRow } from "./helpers";

export async function ensureCallerProfile(userId: string): Promise<ProfileRow> {
  const db = await getDb();
  const users = await db<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId} limit 1`;
  return ensureProfile(db, userId, users[0]?.name ?? null, users[0]?.email ?? null);
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await ensureCallerProfile(context.userId);
    const db = await getDb();
    const users = await db<{ email: string | null }>`select email from "user" where id = ${context.userId} limit 1`;
    return {
      ...profile,
      email: users[0]?.email ?? null,
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName?: string; handle?: string; bio?: string; timezone?: string }) => input)
  .handler(async ({ context, data }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const displayName = (data.displayName ?? profile.display_name).trim() || profile.display_name;
    const handle = (data.handle ?? profile.handle ?? "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 24);
    const bio = data.bio ?? profile.bio;
    const timezone = data.timezone ?? profile.timezone;
    if (handle) {
      const clash = await db`select user_id from profiles where handle = ${handle} and user_id <> ${context.userId} limit 1`;
      if (clash[0]) return { ok: false as const, error: "That handle is already taken." };
    }
    await db`update profiles
      set display_name = ${displayName},
          handle = ${handle || profile.handle},
          bio = ${bio},
          timezone = ${timezone},
          updated_at = now()
      where user_id = ${context.userId}`;
    return { ok: true as const };
  });

export const saveOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      displayName?: string;
      bio?: string;
      timezone?: string;
      step: number;
      complete?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const db = await getDb();
    await ensureCallerProfile(context.userId);
    const displayName = data.displayName?.trim();
    await db`update profiles
      set display_name = coalesce(${displayName ?? null}, display_name),
          bio = coalesce(${data.bio ?? null}, bio),
          timezone = coalesce(${data.timezone ?? null}, timezone),
          onboarding_step = ${data.step},
          onboarding_completed = ${Boolean(data.complete)},
          updated_at = now()
      where user_id = ${context.userId}`;
    return { ok: true as const };
  });

export const claimOperator = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    await ensureCallerProfile(context.userId);
    const ops = await db<{ n: number }>`select count(*)::int as n from profiles where role = 'operator'`;
    if ((ops[0]?.n ?? 0) > 0) {
      return { ok: false as const, error: "An operator already exists. Ask them to grant access." };
    }
    await db`update profiles set role = 'operator', updated_at = now() where user_id = ${context.userId}`;
    return { ok: true as const };
  });
