import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminOverview, listUsersAdmin } from "@/lib/server/admin";
import { StatusPill } from "@/components/status-pill";
import { relativeTime } from "@/lib/format";
import { asString } from "@/lib/cells";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/admin/")({ component: AdminPage });

function AdminPage() {
  const overview = useQuery({ queryKey: ["admin"], queryFn: () => getAdminOverview() });
  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => listUsersAdmin() });

  if (overview.isError) {
    return (
      <div>
        <h1 className="display text-4xl">Operations</h1>
        <p className="mt-3 text-ink-soft">Operator access required.</p>
        <Link to="/settings" className="mt-3 inline-block text-sm text-forest">
          Settings
        </Link>
      </div>
    );
  }
  if (overview.isPending) return <Skeleton className="h-40 w-full" />;
  const d = overview.data;
  if (!d) return null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Internal</p>
        <h1 className="display text-4xl">Operations</h1>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Box label="Accounts" value={d.users} />
        <Box label="Clips" value={d.clips} />
        <Box label="Publications" value={d.publications} />
      </div>
      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Failed jobs</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {d.failed.length === 0 ? <li className="text-stone">None.</li> : null}
          {d.failed.map((j) => (
            <li key={asString(j.id)} className="flex justify-between gap-3">
              <span>{asString(j.stage)}</span>
              <StatusPill value={asString(j.status)} />
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Accounts</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {users.data?.map((u) => (
            <li key={asString(u.user_id)} className="flex justify-between">
              <span>
                {asString(u.display_name)} @{asString(u.handle)}
              </span>
              <span className="text-stone">
                {asString(u.role)}
                {u.demo_mode ? " · demo" : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Audit</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {d.audit.map((a) => (
            <li key={asString(a.id)} className="flex justify-between gap-3">
              <span>
                {asString(a.action)}
                {a.detail ? ` — ${asString(a.detail)}` : ""}
              </span>
              <span className="text-stone">{relativeTime(asString(a.created_at))}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Box({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <div className="text-[11px] uppercase tracking-wide text-stone">{label}</div>
      <div className="mt-1 tabular text-2xl font-medium">{value}</div>
    </div>
  );
}
