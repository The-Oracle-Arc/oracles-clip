import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getClip, updateClip } from "@/lib/server/content";
import { queuePublish } from "@/lib/server/publish";
import { listPlatforms } from "@/lib/server/publish";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusPill } from "@/components/status-pill";
import { formatDuration, formatUsd, relativeTime } from "@/lib/format";
import { asNumber, asString } from "@/lib/cells";
import type { PlatformId } from "@/lib/engine/types";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/content/$id")({ component: ClipDetail });

function ClipDetail() {
  const { id } = Route.useParams();
  const q = useQuery({ queryKey: ["clip", id], queryFn: () => getClip({ data: id }) });
  const platforms = useQuery({ queryKey: ["platforms"], queryFn: () => listPlatforms() });
  const [chosen, setChosen] = useState<PlatformId[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  if (q.isPending) return <Skeleton className="h-64 w-full" />;
  if (!q.data?.ok) return <p className="text-stone">{q.data && "error" in q.data ? q.data.error : "Missing."}</p>;
  const { clip, compliance, publications, jobs, events, analytics, ledger, series } = q.data;
  const views = analytics.reduce((a, r) => a + asNumber(r.views), 0);

  return (
    <div className="space-y-8">
      <div>
        <Link to="/content" className="text-sm text-stone hover:text-ink">
          Content
        </Link>
        <h1 className="display mt-2 text-4xl">{asString(clip.title)}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusPill value={asString(clip.status)} />
          <span className="text-sm text-stone">
            {asString(clip.format)} · {formatDuration(asNumber(clip.duration_seconds))}
          </span>
          {series ? (
            <Link to="/series/$id" params={{ id: asString(series.id) }} className="text-sm text-forest">
              {asString(series.name)}
            </Link>
          ) : null}
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper p-5">
          <h2 className="text-sm font-medium">Edit</h2>
          <div className="mt-3 space-y-3">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input defaultValue={asString(clip.title)} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea defaultValue={asString(clip.description)} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button
              variant="outline"
              onClick={async () => {
                await updateClip({ data: { id, title: title ?? undefined, description: description ?? undefined } });
                void q.refetch();
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-paper p-5">
          <h2 className="text-sm font-medium">Compliance</h2>
          {compliance ? (
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Item k="Publishable" v={asString(compliance.publishable)} />
              <Item k="AI disclosure" v={asString(compliance.ai_disclosure)} />
              <Item k="Commercial" v={asString(compliance.commercial_disclosure)} />
              <Item k="Copyright / reuse" v={asString(compliance.copyright_risk)} />
              <Item k="Monetization" v={asString(compliance.monetization)} />
              <Item k="Repetition" v={asString(compliance.content_repetition_risk)} />
            </dl>
          ) : (
            <p className="mt-2 text-sm text-stone">No decision recorded yet.</p>
          )}
          {compliance ? (
            <p className="mt-4 whitespace-pre-line text-sm text-ink-soft">{asString(compliance.rationale)}</p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric label="Views" value={views.toLocaleString()} />
        <Metric
          label="Estimated"
          value={formatUsd(ledger.filter((r) => r.kind === "estimated").reduce((a, r) => a + asNumber(r.amount_cents), 0))}
          hint="Not confirmed"
        />
        <Metric
          label="Confirmed"
          value={formatUsd(ledger.filter((r) => r.kind === "confirmed").reduce((a, r) => a + asNumber(r.amount_cents), 0))}
        />
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Publish</h2>
        <p className="mt-1 text-sm text-stone">A destination that is not configured will not be marked as published.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {platforms.data?.map((p) => {
            const on = chosen.includes(p.id as PlatformId);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  setChosen((cur) => (on ? cur.filter((x) => x !== p.id) : [...cur, p.id as PlatformId]))
                }
                className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-forest bg-forest text-forest-fg" : "border-line"}`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
        <Button
          className="mt-4"
          disabled={!chosen.length}
          onClick={async () => {
            const res = await queuePublish({ data: { clipId: id, platforms: chosen } });
            if (res.ok) setMessage(res.results.map((r) => r.message).join(" "));
            else setMessage("error" in res ? res.error : null);
            void q.refetch();
          }}
        >
          Queue publication
        </Button>
        {message ? <p className="mt-3 text-sm text-ink-soft">{message}</p> : null}
        <ul className="mt-4 space-y-2 text-sm">
          {publications.map((p) => (
            <li key={asString(p.id)} className="flex flex-wrap items-center justify-between gap-2">
              <span>
                {asString(p.platform)} · {relativeTime(asString(p.created_at))}
              </span>
              <StatusPill value={asString(p.status)} />
              {p.failure_reason ? <span className="w-full text-stone">{asString(p.failure_reason)}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Timeline</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {events.map((e) => (
            <li key={asString(e.id)} className="flex justify-between gap-3">
              <span>{asString(e.message)}</span>
              <span className="shrink-0 text-stone">{relativeTime(asString(e.created_at))}</span>
            </li>
          ))}
          {jobs.map((j) => (
            <li key={asString(j.id)} className="flex items-center justify-between">
              <span className="capitalize">{asString(j.stage)}</span>
              <StatusPill value={asString(j.status)} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-stone">{k}</div>
      <div className="mt-1">
        <StatusPill value={v} />
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <div className="text-[11px] uppercase tracking-wide text-stone">{label}</div>
      <div className="mt-1 tabular text-2xl font-medium">{value}</div>
      {hint ? <div className="text-xs text-stone">{hint}</div> : null}
    </div>
  );
}
