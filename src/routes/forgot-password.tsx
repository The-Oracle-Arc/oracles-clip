import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthFrame } from "@/components/auth-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("Password reset email cannot be sent until email delivery is configured.");
    setBusy(false);
  }

  return (
    <AuthFrame
      kicker="Account recovery"
      title="Reset password"
      footer={
        <Link to="/login" className="text-forest underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
        <Button className="w-full" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </AuthFrame>
  );
}
