import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listSeries } from "@/lib/server/content";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { DemoBanner } from "@/components/demo-banner";
import { formatUsd } from "@/lib/format";
import { asNumber, asString } from "@/lib/cells";
import { getMyProfile } from "@/lib/server/profile";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/series/")({ component: SeriesPage });

function SeriesPage() {
  const q = useQuery({ queryKey: ["series"], queryFn: () => listSeries() });
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  if (q.isPending) return <Skeleton className="h-40 w-full" />;
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Franchises</p>
          <h1 className="display text-4xl">Series</h1>
        </div>
        <Button asChild>
          <Link to="/create">New series</Link>
        </Button>
      </div>
      {profile.data?.demo_mode ? <DemoBanner /> : null}
      {q.data && q.data.length === 0 ? (
        <EmptyState
          title="No series yet"
          body="Turn a long source into numbered episodes with continuity — not a stack of identical hooks."
          action={
            <Button asChild>
              <Link to="/create">Start from a source</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {q.data?.map((s) => (
              <Link key={asString(s.id)} to="/series/$id" params={{ id: asString(s.id) }} className="rounded-xl border border-line bg-paper p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="display text-2xl">{asString(s.name)}</h2>
                    <p className="mt-1 text-sm text-ink-soft">{asString(s.description)}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-stone">{asString(s.genre)}</span>
                </div>
                <div className="mt-4 flex gap-6 text-sm text-stone">
                  <span>{asNumber(s.episode_count)} episodes</span>
                  <span className="tabular">{asNumber(s.views).toLocaleString()} views</span>
                  <span className="tabular">confirmed {formatUsd(asNumber(s.confirmed_cents))}</span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
