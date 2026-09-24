import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authEnabled, authClient, signIn } from "@/lib/auth/client";
import { AuthFrame } from "@/components/auth-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) return <Navigate to="/home" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await authClient.signIn.email({ email, password, callbackURL: "/home" });
    setBusy(false);
    if (err) {
      setError(err.message ?? "Could not sign in.");
      return;
    }
    await navigate({ to: "/home" });
  }

  return (
    <AuthFrame
      kicker="Welcome back"
      title="Sign in"
      footer={
        <>
          No account yet?{" "}
          <Link to="/signup" className="text-forest underline-offset-4 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      {authEnabled ? (
        <div className="space-y-4">
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-stone hover:text-ink">
                  Forgot
                </Link>
              </div>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error ? <p className="text-sm text-rose">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
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
                onClick={() => signIn(p.providerId, { callbackURL: "/home" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-stone">Sign-in is disabled.</p>
      )}
    </AuthFrame>
  );
}
