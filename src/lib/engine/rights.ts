import type { RightsStatus } from "./types.ts";

export function normalizeRightsStatus(value: string | null | undefined): RightsStatus {
  const v = (value || "unknown").toLowerCase();
  if (
    v === "owned" ||
    v === "licensed" ||
    v === "public_domain" ||
    v === "authorized" ||
    v === "unknown" ||
    v === "review_required" ||
    v === "blocked"
  ) {
    return v;
  }
  return "unknown";
}

export function rightsAllowsProcessing(status: RightsStatus, ownershipConfirmed: boolean): boolean {
  if (!ownershipConfirmed) return false;
  if (status === "blocked") return false;
  return true;
}

export function rightsAllowsPublish(status: RightsStatus, ownershipConfirmed: boolean): boolean {
  if (!ownershipConfirmed) return false;
  return status === "owned" || status === "licensed" || status === "public_domain" || status === "authorized";
}

export function rightsLabel(status: RightsStatus): string {
  switch (status) {
    case "owned":
      return "Owned";
    case "licensed":
      return "Licensed";
    case "public_domain":
      return "Public domain";
    case "authorized":
      return "Authorized";
    case "unknown":
      return "Unknown";
    case "review_required":
      return "Review required";
    case "blocked":
      return "Blocked";
  }
}

export function rightsHelp(status: RightsStatus): string {
  switch (status) {
    case "owned":
      return "You created this and hold the rights.";
    case "licensed":
      return "You have a license that covers this use.";
    case "public_domain":
      return "The source is in the public domain.";
    case "authorized":
      return "A rights holder has authorized this use.";
    case "unknown":
      return "Rights are unclear. Publishing stays on hold.";
    case "review_required":
      return "This source needs a rights review before it can go further.";
    case "blocked":
      return "This source cannot be used on Oracle's Clip.";
  }
}
