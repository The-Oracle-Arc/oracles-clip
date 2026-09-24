import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { claimOperator, getMyProfile, updateMyProfile } from "@/lib/server/profile";
import { setDemoMode } from "@/lib/server/demo";
import { listNotifications } from "@/lib/server/inbox";
import { listPolicies } from "@/lib/server/inbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { relativeTime } from "@/lib/format";
import { asString } from "@/lib/cells";
import { signOut } from "@/lib/auth/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_studio/settings")({ component: SettingsPage });

function SettingsPage() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  const notes = useQuery({ queryKey: ["notes"], queryFn: () => listNotifications() });
  const policies = useQuery({ queryKey: ["policies"], queryFn: () => listPolicies() });
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  if (profile.isPending || !profile.data) return <Skeleton className="h-40 w-full" />;
  const p = profile.data;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Account</p>
        <h1 className="display text-4xl">Settings</h1>
      </div>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Creator profile</h2>
        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input defaultValue={p.display_name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea defaultValue={p.bio ?? ""} onChange={(e) => setBio(e.target.value)} />
          </div>
          <p className="text-sm text-stone">Signed in as {p.email ?? "your account"} · @{p.handle}</p>
          <Button
            onClick={async () => {
              const res = await updateMyProfile({ data: { displayName: name || p.display_name, bio } });
              setMsg(res.ok ? "Saved." : res.error);
              void profile.refetch();
            }}
          >
            Save profile
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Demo mode</h2>
            <p className="mt-1 text-sm text-stone">Sample factory activity, clearly labeled. Never mixed with real earnings.</p>
          </div>
          <Switch
            checked={p.demo_mode}
            onCheckedChange={async (enabled) => {
              await setDemoMode({ data: { enabled } });
              window.location.reload();
            }}
          />
        </div>
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Payouts & billing</h2>
        <p className="mt-2 text-sm text-ink-soft">Payouts are not yet enabled. Billing is not configured.</p>
        <Button className="mt-3" variant="outline" asChild>
          <Link to="/withdraw">Withdrawal status</Link>
        </Button>
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Notifications</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {notes.data?.length ? (
            notes.data.slice(0, 8).map((n) => (
              <li key={asString(n.id)}>
                <div className="font-medium">{asString(n.title)}</div>
                <div className="text-stone">
                  {asString(n.body)} · {relativeTime(asString(n.created_at))}
                </div>
              </li>
            ))
          ) : (
            <li className="text-stone">None yet.</li>
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Policy Watch</h2>
        <p className="mt-1 text-sm text-stone">Catalog of platform topics. Alerts appear only for material, verified changes.</p>
        <ul className="mt-3 space-y-2 text-sm">
          {policies.data?.policies.map((pol) => (
            <li key={asString(pol.id)}>
              <span className="font-medium">
                {asString(pol.platform)} / {asString(pol.topic)}
              </span>
              <p className="text-stone">{asString(pol.summary)}</p>
            </li>
          ))}
          {policies.data?.changes.length === 0 ? <li className="text-stone">No material changes recorded.</li> : null}
        </ul>
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-medium">Operations</h2>
        <p className="mt-1 text-sm text-stone">
          {p.role === "operator"
            ? "You operate this workspace as well as your own creator account."
            : "If no operator exists yet, you can claim the first operator seat — same product, not a hidden bypass."}
        </p>
        {p.role !== "operator" ? (
          <Button
            className="mt-3"
            variant="outline"
            onClick={async () => {
              const res = await claimOperator();
              setMsg(res.ok ? "You are now an operator." : res.error);
              void profile.refetch();
            }}
          >
            Claim operator access
          </Button>
        ) : (
          <Button className="mt-3" variant="outline" asChild>
            <Link to="/admin">Open operations</Link>
          </Button>
        )}
      </section>

      {msg ? <p className="text-sm text-ink-soft">{msg}</p> : null}

      <Button
        variant="ghost"
        disabled={signingOut}
        onClick={() => {
          setSigningOut(true);
          void signOut("/").catch(() => setSigningOut(false));
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
