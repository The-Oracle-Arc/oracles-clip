import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/server/money";
import { DemoBanner } from "@/components/demo-banner";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const q = useQuery({ queryKey: ["analytics"], queryFn: () => getAnalytics() });
  if (q.isPending) return <Skeleton className="h-40 w-full" />;
  const d = q.data;
  if (!d) return null;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Audience</p>
        <h1 className="display text-4xl">Analytics</h1>
      </div>
      {d.demoMode ? <DemoBanner /> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Views" value={d.totals.views} />
        <Stat label="Qualified views" value={d.totals.qualified} hint="Where the platform provides them" />
        <Stat label="Watch time (s)" value={d.totals.watch} />
        <Stat label="Followers gained" value={d.totals.followers} />
      </div>
      {!d.hasAnalytics ? (
        <EmptyState
          title="No performance yet"
          body="Analytics appear after a destination returns them. Views are not treated as monetization views."
        />
      ) : null}
      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Revenue engine</h2>
        <div className="mt-4 space-y-4">
          {d.recommendations.map((r) => (
            <div key={r.title}>
              <div className="font-medium">{r.title}</div>
              <p className="mt-1 text-sm text-ink-soft">{r.recommendation}</p>
              <p className="mt-1 text-xs text-stone">
                {r.reason} · confidence {Math.round(r.confidence * 100)}% · {r.estimatedBand}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <div className="text-[11px] uppercase tracking-wide text-stone">{label}</div>
      <div className="mt-1 tabular text-2xl font-medium">{value.toLocaleString()}</div>
      {hint ? <p className="text-xs text-stone">{hint}</p> : null}
    </div>
  );
}
