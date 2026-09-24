import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listPublishing } from "@/lib/server/publish";
import { StatusPill } from "@/components/status-pill";
import { EmptyState } from "@/components/empty-state";
import { DemoBanner } from "@/components/demo-banner";
import { Button } from "@/components/ui/button";
import { relativeTime } from "@/lib/format";
import { asString } from "@/lib/cells";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/publish")({ component: PublishPage });

function PublishPage() {
  const q = useQuery({ queryKey: ["publishing"], queryFn: () => listPublishing() });
  if (q.isPending) return <Skeleton className="h-40 w-full" />;
  const data = q.data;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Outbound</p>
        <h1 className="display text-4xl">Publish</h1>
      </div>
      {data?.demoMode ? <DemoBanner /> : null}
      <section>
        <h2 className="text-sm font-medium">Ready</h2>
        {data?.ready.length ? (
          <ul className="mt-3 grid gap-2">
            {data.ready.map((c) => (
              <li key={asString(c.id)}>
                <Link to="/content/$id" params={{ id: asString(c.id) }} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3">
                  <span className="font-medium">{asString(c.title)}</span>
                  <StatusPill value={asString(c.status)} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-3"
            title="Nothing waiting"
            body="Package a clip first. Destinations that are not connected will not be marked live."
            action={
              <Button asChild>
                <Link to="/create">Create</Link>
              </Button>
            }
          />
        )}
      </section>
      <section>
        <h2 className="text-sm font-medium">Attempts</h2>
        {data?.publications.length ? (
          <ul className="mt-3 space-y-2">
            {data.publications.map((p) => (
                <li key={asString(p.id)} className="rounded-xl border border-line bg-paper p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link to="/content/$id" params={{ id: asString(p.clip_id) }} className="font-medium">
                      {asString(p.clip_title)}
                    </Link>
                    <StatusPill value={asString(p.status)} />
                  </div>
                  <p className="mt-1 text-sm text-stone">
                    {asString(p.platform)} · {relativeTime(asString(p.created_at))}
                  </p>
                  {p.failure_reason ? <p className="mt-2 text-sm text-ink-soft">{asString(p.failure_reason)}</p> : null}
                </li>
              ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-stone">No publication attempts yet.</p>
        )}
      </section>
    </div>
  );
}
