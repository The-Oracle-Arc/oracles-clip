import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getHome } from "@/lib/server/home";
import { tickFactory } from "@/lib/server/factory";
import { firstName, greetingFor, relativeTime } from "@/lib/format";
import { asString } from "@/lib/cells";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoBanner } from "@/components/demo-banner";
import { EmptyState } from "@/components/empty-state";
import { FactoryStrip } from "@/components/factory-strip";
import { StatusPill } from "@/components/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, type ReactNode } from "react";

export const Route = createFileRoute("/_studio/home")({ component: HomePage });

function HomePage() {
  const home = useQuery({ queryKey: ["home"], queryFn: () => getHome() });

  useEffect(() => {
    if (!home.data?.factory.activeCount) return;
    const t = window.setInterval(() => {
      void tickFactory().then(() => home.refetch());
    }, 1200);
    return () => window.clearInterval(t);
  }, [home.data?.factory.activeCount, home]);

  if (home.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }
  if (!home.data) return null;
  const d = home.data;
  const name = firstName(d.profile.display_name);

  return (
    <div className="space-y-8">
      {d.demoMode ? <DemoBanner /> : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone">{greetingFor()}</p>
          <h1 className="display mt-1 text-4xl text-ink md:text-5xl">{name}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/create">Create a clip</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/earnings">View earnings</Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard>
          <Money cents={d.money.availableCents} label="Available" size="lg" />
        </StatCard>
        <StatCard>
          <Money cents={d.money.pendingCents} label="Pending" />
          <p className="mt-2 text-xs text-stone">Confirmed, not yet available</p>
        </StatCard>
        <StatCard>
          <Money cents={d.money.estimatedCents} label="Estimated" muted />
          <p className="mt-2 text-xs text-stone">Not a payout</p>
        </StatCard>
        <StatCard>
          <Money cents={d.money.confirmedCents} label="Confirmed" />
          <p className="mt-2 text-xs text-stone">Lifetime, when platforms report it</p>
        </StatCard>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Mini label="Views" value={d.analytics.views} />
        <Mini label="Engagement" value={d.analytics.engagements} />
        <Mini label="Followers gained" value={d.analytics.followers} />
        <Mini label="Active series" value={d.seriesCount} />
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Content factory</CardTitle>
            <p className="mt-1 text-sm text-stone">
              {d.factory.activeCount ? `${d.factory.activeCount} job${d.factory.activeCount === 1 ? "" : "s"} on the line` : "The line is idle"}
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/engine">
              Engine Room <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <FactoryStrip counts={d.factory.counts} compact />
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <Fact label="Processing" value={d.byStatus.processing ?? 0} />
            <Fact label="Ready to publish" value={d.byStatus.ready ?? 0} />
            <Fact label="Review" value={d.byStatus.review ?? 0} />
            <Fact label="Published" value={(d.byStatus.published ?? 0) + (d.byStatus.live ?? 0)} />
            <Fact label="Connections needing attention" value={d.platformAttention} />
            <Fact label="Clips created" value={d.clipsCreated} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent clips</CardTitle>
          </CardHeader>
          <CardContent>
            {d.recentClips.length === 0 ? (
              <EmptyState
                title="Nothing on the floor yet"
                body="Upload a source you own. The factory will find moments — it will not invent an audience."
                action={
                  <Button asChild>
                    <Link to="/create">Create a clip</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-line">
                {d.recentClips.map((c) => (
                  <li key={asString(c.id)}>
                    <Link to="/content/$id" params={{ id: asString(c.id) }} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{asString(c.title)}</div>
                        <div className="text-xs text-stone">
                          {asString(c.format)} · {relativeTime(asString(c.created_at))}
                        </div>
                      </div>
                      <StatusPill value={asString(c.status)} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What to make next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(d.opportunities.length ? d.opportunities : d.recommendations).map((o) => (
                <div key={asString(o.title)}>
                  <div className="text-sm font-medium">{asString(o.title)}</div>
                  <p className="mt-1 text-sm text-ink-soft">{asString("recommendation" in o ? o.recommendation : o.reason)}</p>
                  <p className="mt-1 text-xs text-stone">{asString(o.reason)}</p>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-line bg-paper p-5 shadow-soft">{children}</div>;
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-paper px-5 py-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone">{label}</div>
      <div className="mt-1 tabular text-2xl font-medium">{value.toLocaleString()}</div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-mist/60 px-3 py-2">
      <span className="text-stone">{label}</span>
      <span className="tabular font-medium">{value}</span>
    </div>
  );
}
