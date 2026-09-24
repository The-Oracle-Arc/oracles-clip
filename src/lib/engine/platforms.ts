import { PLATFORMS, PLATFORM_CAPABILITIES, PLATFORM_LABELS, type PlatformId } from "./types.ts";

const ENV_KEYS: Record<PlatformId, string> = {
  youtube: "YOUTUBE_CLIENT_ID",
  tiktok: "TIKTOK_CLIENT_KEY",
  instagram: "INSTAGRAM_CLIENT_ID",
  facebook: "FACEBOOK_APP_ID",
  x: "X_PUBLISH_CLIENT_ID",
  linkedin: "LINKEDIN_CLIENT_ID",
  snapchat: "SNAPCHAT_CLIENT_ID",
  pinterest: "PINTEREST_APP_ID",
  threads: "THREADS_CLIENT_ID",
};

export function isPlatformConfigured(platform: PlatformId): boolean {
  if (typeof process === "undefined") return false;
  const key = ENV_KEYS[platform];
  return Boolean(process.env[key]?.trim());
}

export function payoutsEnabled(): boolean {
  if (typeof process === "undefined") return false;
  return Boolean(process.env.PAYOUTS_PROVIDER?.trim() && process.env.PAYOUTS_PROVIDER !== "none");
}

export function platformCatalog() {
  return PLATFORMS.map((id) => ({
    id,
    name: PLATFORM_LABELS[id],
    configured: isPlatformConfigured(id),
    capabilities: PLATFORM_CAPABILITIES[id],
  }));
}

export function publishFailureMessage(input: {
  platform: PlatformId;
  connected: boolean;
  configured: boolean;
  status?: string;
}): { code: string; message: string } {
  const name = PLATFORM_LABELS[input.platform];
  if (!input.configured) {
    return {
      code: "unavailable",
      message: `${name} publishing is not enabled yet. Your clip stays here until this destination is configured.`,
    };
  }
  if (!input.connected || input.status === "not_connected") {
    return {
      code: "not_connected",
      message: `Connect your ${name} account to publish there.`,
    };
  }
  if (input.status === "authorization_required") {
    return {
      code: "auth_required",
      message: `Your ${name} connection needs to be reauthorized.`,
    };
  }
  if (input.status === "restricted" || input.status === "review_required") {
    return {
      code: "review",
      message: `This clip requires review before publication on ${name}.`,
    };
  }
  if (input.status === "rate_limited") {
    return {
      code: "rate_limited",
      message: `${name} is temporarily rate-limited. Your clip remains queued.`,
    };
  }
  return {
    code: "adapter",
    message: `${name} could not accept this upload. The clip remains unpublished.`,
  };
}

export function connectMessage(platform: PlatformId): { status: string; message: string } {
  const name = PLATFORM_LABELS[platform];
  if (!isPlatformConfigured(platform)) {
    return {
      status: "unavailable",
      message: `${name} is not available yet. Oracle's Clip never asks for your password — when this destination is enabled, connection will use official OAuth.`,
    };
  }
  return {
    status: "authorization_required",
    message: `${name} is configured. Continue with the official OAuth screen — never paste a password or API secret here.`,
  };
}
