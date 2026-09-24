export function asString(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

export function asNumber(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function asBool(v: unknown): boolean {
  return v === true || v === "true" || v === 1;
}
