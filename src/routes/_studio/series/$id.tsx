import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSeries } from "@/lib/server/content";
import { StatusPill } from "@/components/status-pill";
import { formatDuration } from "@/lib/format";
import { asNumber, asString } from "@/lib/cells";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/series/$id")({ component: SeriesDetail });

function SeriesDetail() {
  const { id } = Route.useParams();
  const q = useQuery({ queryKey: ["series", id], queryFn: () => getSeries({ data: id }) });
  if (q.isPending) return <Skeleton className="h-40 w-full" />;
  if (!q.data?.ok) return <p className="text-stone">Series not found.</p>;
  const { series, episodes } = q.data;
  return (
    <div className="space-y-6">
      <div>
        <Link to="/series" className="text-sm text-stone">
          Series
        </Link>
        <h1 className="display mt-2 text-4xl">{asString(series.name)}</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">{asString(series.description)}</p>
      </div>
      <ol className="space-y-2">
        {episodes.map((ep) => (
            <li key={asString(ep.id)}>
              <Link to="/content/$id" params={{ id: asString(ep.id) }} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper p-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-stone">Episode {String(asNumber(ep.episode_number)).padStart(2, "0")}</div>
                  <div className="font-medium">{asString(ep.title)}</div>
                  <p className="text-sm text-stone">{asString(ep.hook)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone">{formatDuration(asNumber(ep.duration_seconds))}</span>
                  <StatusPill value={asString(ep.status)} />
                </div>
              </Link>
            </li>
          ))}
      </ol>
    </div>
  );
}
