import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authEnabled, authClient, signIn } from "@/lib/auth/client";
import { AuthFrame } from "@/components/auth-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) return <Navigate to="/home" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/onboarding",
    });
    setBusy(false);
    if (err) {
      setError(err.message ?? "Could not create the account.");
      return;
    }
    await navigate({ to: "/onboarding" });
  }

  return (
    <AuthFrame
      kicker="New account"
      title="Create your studio"
      footer={
        <>
          Already here?{" "}
          <Link to="/login" className="text-forest underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {authEnabled ? (
        <div className="space-y-4">
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8} />
            </div>
            {error ? <p className="text-sm text-rose">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create account"}
            </Button>
          </form>
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-stone">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/onboarding" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-stone">Sign-up is disabled.</p>
      )}
    </AuthFrame>
  );
}
