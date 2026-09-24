import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listContent } from "@/lib/server/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/status-pill";
import { EmptyState } from "@/components/empty-state";
import { DemoBanner } from "@/components/demo-banner";
import { formatDuration, formatUsd } from "@/lib/format";
import { asNumber, asString } from "@/lib/cells";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/content/")({ component: ContentPage });

const FILTERS = ["all", "draft", "processing", "ready", "published", "review", "blocked", "failed"];

function ContentPage() {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const list = useQuery({
    queryKey: ["content", status, query],
    queryFn: () => listContent({ data: { status, query } }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Library</p>
          <h1 className="display text-4xl">Content</h1>
        </div>
        <Button asChild>
          <Link to="/create">Create</Link>
        </Button>
      </div>
      {list.data?.demoMode ? <DemoBanner /> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles" className="sm:max-w-xs" />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatus(f)}
              className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-wide ${status === f ? "bg-forest text-forest-fg" : "bg-mist text-stone"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {list.isPending ? <Skeleton className="h-40 w-full" /> : null}
      {list.data && list.data.clips.length === 0 ? (
        <EmptyState
          title="The library is empty"
          body="Create from a source you own. Nothing here is invented to look busy."
          action={
            <Button asChild>
              <Link to="/create">Create a clip</Link>
            </Button>
          }
        />
      ) : null}
      <div className="grid gap-3">
        {list.data?.clips.map((c) => (
            <Link
              key={asString(c.id)}
              to="/content/$id"
              params={{ id: asString(c.id) }}
              className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{asString(c.title)}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-stone">
                  <span>{asString(c.format)}</span>
                  <span>{formatDuration(asNumber(c.duration_seconds))}</span>
                  {c.last_platform ? <span>{asString(c.last_platform)}</span> : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <StatusPill value={asString(c.status)} />
                {c.copyright_risk ? <StatusPill value={asString(c.copyright_risk)} /> : null}
                <span className="tabular text-stone">{asNumber(c.views).toLocaleString()} views</span>
                <span className="tabular">
                  <span className="text-stone">est. </span>
                  {formatUsd(asNumber(c.estimated_cents))}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
