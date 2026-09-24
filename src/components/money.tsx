import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Money({
  cents,
  label,
  size = "md",
  muted = false,
}: {
  cents: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  muted?: boolean;
}) {
  return (
    <div className={cn("min-w-0", muted && "opacity-80")}>
      {label ? <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone">{label}</div> : null}
      <div
        className={cn(
          "tabular tracking-tight text-ink",
          size === "lg" && "display text-4xl font-medium",
          size === "md" && "text-2xl font-medium",
          size === "sm" && "text-base font-medium",
        )}
      >
        {formatUsd(cents)}
      </div>
    </div>
  );
}
