import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { connectPlatform, listPlatforms } from "@/lib/server/publish";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import type { PlatformId } from "@/lib/engine/types";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/platforms")({ component: PlatformsPage });

function PlatformsPage() {
  const q = useQuery({ queryKey: ["platforms"], queryFn: () => listPlatforms() });
  const [msg, setMsg] = useState<string | null>(null);
  if (q.isPending) return <Skeleton className="h-40 w-full" />;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Destinations</p>
        <h1 className="display text-4xl">Platforms</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Connection uses official OAuth. Oracle’s Clip never asks for a password or an API secret. Unavailable means the adapter is not configured — not that you failed.
        </p>
      </div>
      {msg ? <p className="rounded-lg border border-line bg-paper px-4 py-3 text-sm">{msg}</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {q.data?.map((p) => (
          <article key={p.id} className="rounded-xl border border-line bg-paper p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <h2 className="display text-2xl">{p.name}</h2>
              <StatusPill value={p.status} />
            </div>
            <ul className="mt-3 space-y-1 text-sm text-stone">
              <li>Shorts {p.capabilities.shorts ? "supported" : "no"}</li>
              <li>Long form {p.capabilities.longForm ? "supported" : "no"}</li>
              <li>Monetization signals {p.capabilities.monetization ? "supported" : "not assumed"}</li>
              <li>AI field {p.capabilities.aiDisclosureField ?? "none mapped"}</li>
            </ul>
            <Button
              className="mt-4"
              variant="outline"
              onClick={async () => {
                const res = await connectPlatform({ data: p.id as PlatformId });
                setMsg(res.message ?? res.error ?? null);
                void q.refetch();
              }}
            >
              Connect
            </Button>
            {p.lastError ? <p className="mt-2 text-xs text-stone">{p.lastError}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
