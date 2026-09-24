import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getEarnings, requestWithdrawal } from "@/lib/server/money";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/withdraw")({ component: WithdrawPage });

function WithdrawPage() {
  const q = useQuery({ queryKey: ["earnings"], queryFn: () => getEarnings() });
  const [msg, setMsg] = useState<string | null>(null);
  if (q.isPending || !q.data) return <Skeleton className="h-40 w-full" />;
  const d = q.data;
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Payouts</p>
        <h1 className="display text-4xl">Withdraw</h1>
      </div>
      <div className="rounded-xl border border-line bg-paper p-5 space-y-3">
        <Money cents={d.summary.availableCents} label="Available confirmed" size="lg" />
        <dl className="space-y-1 text-sm text-ink-soft">
          <div className="flex justify-between">
            <dt>Minimum</dt>
            <dd className="tabular">{formatUsd(d.minWithdrawalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Fees</dt>
            <dd>None configured</dd>
          </div>
          <div className="flex justify-between">
            <dt>Destination</dt>
            <dd>Payouts are not yet enabled</dd>
          </div>
          <div className="flex justify-between">
            <dt>Estimated time</dt>
            <dd>—</dd>
          </div>
        </dl>
        <Button
          className="w-full"
          onClick={async () => {
            const res = await requestWithdrawal({ data: { amountCents: d.summary.availableCents } });
            setMsg(res.error ?? "Payouts are not yet enabled.");
          }}
        >
          Confirm withdrawal
        </Button>
        {msg ? <p className="text-sm text-ink-soft">{msg}</p> : null}
      </div>
    </div>
  );
}
