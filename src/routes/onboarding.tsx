import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMyProfile, saveOnboarding } from "@/lib/server/profile";
import { listPlatforms, connectPlatform } from "@/lib/server/publish";
import { StatusPill } from "@/components/status-pill";
import type { PlatformId } from "@/lib/engine/types";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const STEPS = ["Welcome", "Profile", "Platforms", "Earnings", "Ready"];

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [platforms, setPlatforms] = useState<Array<{ id: string; name: string; status: string; message?: string }>>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void getMyProfile().then((p) => {
      setName(p.display_name);
      setBio(p.bio ?? "");
      if (p.onboarding_completed) void navigate({ to: "/home" });
      else setStep(p.onboarding_step || 0);
    });
    void listPlatforms().then((rows) => setPlatforms(rows.map((r) => ({ id: r.id, name: r.name, status: r.status }))));
  }, [user, navigate]);

  if (isPending) return <Shell />;
  if (!user) return <RedirectToSignIn />;

  async function persist(next: number, complete = false) {
    await saveOnboarding({ data: { displayName: name, bio, step: next, complete } });
    setStep(next);
    if (complete) await navigate({ to: "/home" });
  }

  return (
    <Shell>
      <div className="mb-8 flex gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1 rounded-full ${i <= step ? "bg-forest" : "bg-line"}`} />
            <div className="mt-2 hidden text-[11px] uppercase tracking-wide text-stone sm:block">{label}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <Step title="This is your content business." body="The factory underneath will clip, check rights, and queue publishing. You stay in charge of what goes out — and estimated money is never treated as cash.">
          <Button onClick={() => void persist(1)}>Continue</Button>
        </Step>
      )}

      {step === 1 && (
        <Step title="A name people will see." body="Keep it short. You can change it later.">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Creator name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">How you work</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Original footage, commentary, a series…" />
            </div>
            <Button onClick={() => void persist(2)}>Save and continue</Button>
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step
          title="Destinations use official OAuth."
          body="Oracle’s Clip will never ask for a platform password. If a destination isn’t configured yet, it stays unavailable — we won’t pretend it’s connected."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                className="flex items-center justify-between rounded-lg border border-line bg-paper px-3 py-3 text-left"
                onClick={async () => {
                  const res = await connectPlatform({ data: p.id as PlatformId });
                  setNotice(res.message ?? res.error ?? null);
                  void listPlatforms().then((rows) => setPlatforms(rows.map((r) => ({ id: r.id, name: r.name, status: r.status }))));
                }}
              >
                <span className="text-sm font-medium">{p.name}</span>
                <StatusPill value={p.status} />
              </button>
            ))}
          </div>
          {notice ? <p className="mt-3 text-sm text-ink-soft">{notice}</p> : null}
          <Button className="mt-4" onClick={() => void persist(3)}>
            Continue
          </Button>
        </Step>
      )}

      {step === 3 && (
        <Step
          title="Earnings stay honest."
          body="Estimated ranges are labeled. Confirmed money appears only from a platform. Available balance is confirmed money that can be withdrawn. Payouts are not enabled until a provider is configured."
        >
          <Button onClick={() => void persist(4)}>I understand</Button>
        </Step>
      )}

      {step === 4 && (
        <Step title="You’re ready." body="Upload something you own, or open Demo Mode from Settings if you want to walk the factory with sample data first.">
          <Button onClick={() => void persist(4, true)}>Enter the studio</Button>
        </Step>
      )}
    </Shell>
  );
}

function Shell({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas px-5 py-8">
      <div className="mx-auto max-w-2xl">
        <Wordmark />
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}

function Step({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="rise-in">
      <h1 className="display text-4xl text-ink">{title}</h1>
      <p className="mt-3 max-w-lg text-ink-soft">{body}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
