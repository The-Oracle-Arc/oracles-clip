import { FACTORY_STAGES, STAGE_LABELS, type FactoryStage } from "@/lib/engine/types";
import { cn } from "@/lib/utils";

type Counts = Record<string, { queued: number; running: number; succeeded: number; failed: number }>;

export function FactoryStrip({
  counts,
  compact = false,
}: {
  counts: Counts;
  compact?: boolean;
}) {
  const stages = compact ? (["ingest", "clip", "render", "policy", "publish", "analyze"] as FactoryStage[]) : [...FACTORY_STAGES];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {stages.map((stage) => {
        const c = counts[stage] ?? { queued: 0, running: 0, succeeded: 0, failed: 0 };
        const live = c.running > 0;
        const total = c.queued + c.running + c.succeeded + c.failed;
        return (
          <div
            key={stage}
            className={cn(
              "min-w-[108px] rounded-lg border border-line bg-raised px-3 py-2",
              live && "border-forest/30",
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("live-dot", live ? "" : "live-dot-stone")} />
              <span className="text-[11px] font-medium uppercase tracking-wide text-stone">{STAGE_LABELS[stage]}</span>
            </div>
            <div className="mt-1 tabular text-lg font-medium text-ink">{total}</div>
          </div>
        );
      })}
    </div>
  );
}
