import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { newId } from "@/lib/ids";
import {
  connectMessage,
  isPlatformConfigured,
  platformCatalog,
  publishFailureMessage,
} from "@/lib/engine/platforms";
import { rightsAllowsPublish, normalizeRightsStatus } from "@/lib/engine/rights";
import type { PlatformId } from "@/lib/engine/types";
import { PLATFORMS } from "@/lib/engine/types";
import { audit, event, notify, sql as getDb, type AnyRow } from "./helpers";
import { ensureCallerProfile } from "./profile";
import { enqueueStages } from "./factory";

export const listPlatforms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const accounts = await db<AnyRow>`
      select * from platform_accounts
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}`;
    const byId = new Map(accounts.map((a) => [String(a.platform), a]));
    return platformCatalog().map((p) => {
      const row = byId.get(p.id);
      return {
        ...p,
        status: String(row?.status ?? (p.configured ? "not_connected" : "unavailable")),
        handle: row?.handle ? String(row.handle) : null,
        lastError: row?.last_error ? String(row.last_error) : null,
        connectedAt: row?.connected_at ? String(row.connected_at) : null,
      };
    });
  });

export const connectPlatform = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((platform: unknown) => String(platform) as PlatformId)
  .handler(async ({ context, data: platform }) => {
    if (!PLATFORMS.includes(platform)) return { ok: false as const, error: "Unknown destination." };
    const db = await getDb();
    await ensureCallerProfile(context.userId);
    const msg = connectMessage(platform);
    await db<AnyRow>`insert into platform_accounts (id, user_id, platform, status, last_error, is_demo)
      values (${newId("plt")}, ${context.userId}, ${platform}, ${msg.status}, ${msg.message}, ${false})
      on conflict (user_id, platform, is_demo) do update set
        status = excluded.status, last_error = excluded.last_error, updated_at = now()`;
    await audit(db, {
      userId: context.userId,
      actorId: context.userId,
      action: "platform.connect_attempted",
      entityType: "platform",
      entityId: platform,
      detail: msg.status,
    });
    return { ok: false as const, status: msg.status, message: msg.message };
  });

export const queuePublish = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { clipId: string; platforms: PlatformId[] }) => input)
  .handler(async ({ context, data }) => {
    const db = await getDb();
    await ensureCallerProfile(context.userId);
    if (data.platforms.length === 0) return { ok: false as const, error: "Choose at least one destination." };
    const clips = await db<AnyRow>`select * from clips where id = ${data.clipId} and user_id = ${context.userId} limit 1`;
    const clip = clips[0] as
      | { id: string; title: string; status: string; is_demo: boolean }
      | undefined;
    if (!clip) return { ok: false as const, error: "Clip not found." };
    if (clip.is_demo) {
      return { ok: false as const, error: "Demo clips cannot be published to real destinations." };
    }
    if (clip.status === "blocked") {
      return { ok: false as const, error: "This clip is blocked and cannot be published." };
    }
    const decisions = await db<AnyRow>`
      select * from compliance_decisions where clip_id = ${clip.id} order by created_at desc limit 1`;
    const decision = decisions[0] as
      | { publishable: string; rights_status: string }
      | undefined;
    if (decision?.publishable === "no") {
      return { ok: false as const, error: "Compliance held this clip. It cannot go out." };
    }
    if (decision && !rightsAllowsPublish(normalizeRightsStatus(decision.rights_status), true)) {
      return { ok: false as const, error: "Rights are not clear enough to publish." };
    }

    const results: Array<{ platform: PlatformId; status: string; message: string }> = [];
    for (const platform of data.platforms) {
      const accounts = await db<AnyRow>`
        select * from platform_accounts
        where user_id = ${context.userId} and platform = ${platform} and is_demo = false limit 1`;
      const account = accounts[0] as { status: string } | undefined;
      const configured = isPlatformConfigured(platform);
      const connected = account?.status === "connected";
      const failure = publishFailureMessage({
        platform,
        connected,
        configured,
        status: account?.status,
      });
      const pubId = newId("pub");
      await db<AnyRow>`insert into publications (id, clip_id, user_id, platform, status, failure_reason, failure_code, is_demo)
        values (${pubId}, ${clip.id}, ${context.userId}, ${platform}, ${"failed"}, ${failure.message}, ${failure.code}, ${false})`;
      await db<AnyRow>`insert into publishing_jobs (
        id, publication_id, user_id, clip_id, platform, stage, status, detail, is_demo
      ) values (
        ${newId("pjb")}, ${pubId}, ${context.userId}, ${clip.id}, ${platform}, ${"compliance"}, ${"failed"}, ${failure.message}, ${false}
      )`;
      results.push({ platform, status: "failed", message: failure.message });
      await event(db, {
        userId: context.userId,
        clipId: clip.id,
        kind: "publish.held",
        message: failure.message,
      });
    }
    await enqueueStages({
      userId: context.userId,
      clipId: clip.id,
      stages: ["queue", "publish"],
      type: "clip.publish",
      isDemo: false,
    });
    await db<AnyRow>`update clips set status = 'review', updated_at = now() where id = ${clip.id} and user_id = ${context.userId}`;
    await notify(db, {
      userId: context.userId,
      title: "Publishing held",
      body: results[0]?.message ?? "Destinations are not ready.",
      kind: "publish",
      href: `/content/${clip.id}`,
    });
    await audit(db, {
      userId: context.userId,
      actorId: context.userId,
      action: "publish.attempted",
      entityType: "clip",
      entityId: clip.id,
      detail: results.map((r) => `${r.platform}:${r.status}`).join(","),
    });
    return { ok: true as const, results };
  });

export const listPublishing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await getDb();
    const profile = await ensureCallerProfile(context.userId);
    const publications = await db<AnyRow>`
      select p.*, c.title as clip_title, c.thumbnail_data_url, c.format
      from publications p
      join clips c on c.id = p.clip_id
      where p.user_id = ${context.userId} and p.is_demo = ${profile.demo_mode}
      order by p.created_at desc
      limit 50`;
    const ready = await db<AnyRow>`
      select id, title, status, format, thumbnail_data_url, duration_seconds, created_at
      from clips
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
        and status in ('ready', 'review')
      order by updated_at desc
      limit 40`;
    return { demoMode: profile.demo_mode, publications, ready };
  });
