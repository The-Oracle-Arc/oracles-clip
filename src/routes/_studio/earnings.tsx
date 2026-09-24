import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getEarnings, requestWithdrawal } from "@/lib/server/money";
import { Money } from "@/components/money";
import { DemoBanner } from "@/components/demo-banner";
import { EmptyState } from "@/components/empty-state";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { formatUsd, relativeTime } from "@/lib/format";
import { PLATFORM_LABELS, type PlatformId } from "@/lib/engine/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, type ReactNode } from "react";

export const Route = createFileRoute("/_studio/earnings")({ component: EarningsPage });

function EarningsPage() {
  const q = useQuery({ queryKey: ["earnings"], queryFn: () => getEarnings() });
  const [msg, setMsg] = useState<string | null>(null);
  if (q.isPending) return <Skeleton className="h-40 w-full" />;
  const d = q.data;
  if (!d) return null;
  const platforms = Object.entries(d.byPlatform);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Money</p>
          <h1 className="display text-4xl">Earnings</h1>
        </div>
        <Button variant="outline" asChild>
          <Link to="/withdraw">Withdraw</Link>
        </Button>
      </div>
      {d.demoMode ? <DemoBanner /> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Box>
          <Money cents={d.summary.availableCents} label="Available" size="lg" />
        </Box>
        <Box>
          <Money cents={d.summary.pendingCents} label="Pending" />
        </Box>
        <Box>
          <Money cents={d.summary.confirmedCents} label="Confirmed" />
        </Box>
        <Box>
          <Money cents={d.summary.estimatedCents} label="Estimated" muted />
          <p className="mt-2 text-xs text-stone">Never mixed into available balance</p>
        </Box>
        <Box>
          <Money cents={d.summary.withdrawnCents} label="Paid out" />
        </Box>
        <Box>
          <div className="text-[11px] uppercase tracking-wide text-stone">Payouts</div>
          <div className="mt-1 text-lg font-medium">{d.payoutsEnabled ? "Enabled" : "Not enabled"}</div>
        </Box>
      </div>

      {platforms.length === 0 ? (
        <EmptyState title="No ledger yet" body="Confirmed earnings appear only when a platform reports them. Estimates stay labeled." />
      ) : (
        <section className="rounded-xl border border-line bg-paper p-5">
          <h2 className="text-sm font-medium">By destination</h2>
          <ul className="mt-3 space-y-2">
            {platforms.map(([id, v]) => (
              <li key={id} className="flex items-center justify-between text-sm">
                <span>{PLATFORM_LABELS[id as PlatformId] ?? id}</span>
                <span className="tabular">
                  <span className="text-stone">est. {formatUsd(v.estimated)}</span>
                  <span className="mx-2 text-line">/</span>
                  confirmed {formatUsd(v.confirmed)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Ledger</h2>
        {d.ledger.length === 0 ? (
          <p className="mt-2 text-sm text-stone">Empty. That is the correct state until money actually moves.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {d.ledger.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <div className="font-medium">
                    {row.kind} · {row.revenue_source}
                  </div>
                  <div className="text-xs text-stone">
                    {row.note} · {relativeTime(row.created_at)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="tabular font-medium">{formatUsd(Number(row.amount_cents))}</div>
                  <StatusPill value={row.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div>
        <Button
          onClick={async () => {
            const res = await requestWithdrawal({ data: { amountCents: d.summary.availableCents } });
            setMsg(res.error);
          }}
        >
          Request withdrawal
        </Button>
        {msg ? <p className="mt-2 text-sm text-ink-soft">{msg}</p> : null}
      </div>
    </div>
  );
}

function Box({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-line bg-paper p-5 shadow-soft">{children}</div>;
}
