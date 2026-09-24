import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getFactory, retryJob, tickFactory } from "@/lib/server/factory";
import { FACTORY_STAGES, STAGE_LABELS, type FactoryStage } from "@/lib/engine/types";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/status-pill";
import { DemoBanner } from "@/components/demo-banner";
import { Button } from "@/components/ui/button";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/engine")({ component: EnginePage });

function EnginePage() {
  const q = useQuery({ queryKey: ["factory"], queryFn: () => getFactory() });

  useEffect(() => {
    const t = window.setInterval(() => {
      void tickFactory().then(() => q.refetch());
    }, 1100);
    return () => window.clearInterval(t);
  }, [q]);

  if (q.isPending) return <Skeleton className="h-64 w-full" />;
  const d = q.data;
  if (!d) return null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Operating system</p>
        <h1 className="display text-4xl">Engine Room</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          The factory behind your studio. Jobs are real. Empty is idle — not broken.
        </p>
      </div>
      {d.demoMode ? <DemoBanner /> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {d.workers.map((w) => (
          <article key={w.id} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{w.name}</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className={cn("live-dot", w.status === "busy" ? "" : "live-dot-stone")} />
                {w.status}
              </div>
            </div>
            {w.job ? (
              <div className="mt-4">
                <div className="text-sm text-ink-soft">{STAGE_LABELS[w.job.stage as FactoryStage] ?? w.job.stage}</div>
                <Progress className="mt-2" value={Number(w.job.progress)} />
                <div className="mt-1 tabular text-xs text-stone">{w.job.progress}%</div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-stone">Waiting for work</p>
            )}
          </article>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-medium">Line</h2>
        <div className="mt-3 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {FACTORY_STAGES.map((stage) => {
              const c = d.counts[stage];
              const live = (c?.running ?? 0) > 0;
              return (
                <div key={stage} className="w-28 rounded-lg border border-line bg-raised p-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("live-dot", live ? "" : "live-dot-stone")} />
                    <span className="text-[10px] uppercase tracking-wide text-stone">{STAGE_LABELS[stage]}</span>
                  </div>
                  <div className="mt-2 tabular text-xl font-medium">{(c?.queued ?? 0) + (c?.running ?? 0)}</div>
                  <div className="text-[10px] text-stone">
                    {c?.succeeded ?? 0} done · {c?.failed ?? 0} failed
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper p-5">
          <h2 className="text-sm font-medium">Jobs</h2>
          <ul className="mt-3 max-h-96 space-y-2 overflow-auto">
            {d.jobs.length === 0 ? <li className="text-sm text-stone">No jobs.</li> : null}
            {d.jobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-2 text-sm">
                <div>
                  <div className="capitalize">{j.stage}</div>
                  <div className="text-xs text-stone">{j.detail}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={j.status} />
                  {j.status === "failed" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await retryJob({ data: j.id });
                        void q.refetch();
                      }}
                    >
                      Retry
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-paper p-5">
          <h2 className="text-sm font-medium">Activity</h2>
          <ul className="mt-3 max-h-96 space-y-2 overflow-auto text-sm">
            {d.events.map((e) => (
              <li key={e.id} className="flex justify-between gap-3">
                <span>{e.message}</span>
                <span className="shrink-0 text-stone">{relativeTime(e.created_at)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
