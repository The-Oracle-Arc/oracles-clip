import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { AuthFrame } from "@/components/auth-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({ component: Reset });

function Reset() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    if (!token) {
      setMessage("This reset link is missing a token. Request a new one.");
      return;
    }
    setBusy(true);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    setBusy(false);
    if (error) {
      setMessage(error.message ?? "The reset could not be completed. Email delivery may not be configured.");
      return;
    }
    setMessage("Password updated. You can sign in now.");
  }

  return (
    <AuthFrame
      kicker="Account recovery"
      title="Choose a new password"
      footer={
        <Link to="/login" className="text-forest underline-offset-4 hover:underline">
          Sign in
        </Link>
      }
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
        <Button className="w-full" type="submit" disabled={busy}>
          {busy ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthFrame>
  );
}
