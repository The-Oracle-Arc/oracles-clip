import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_studio/help")({ component: HelpPage });

function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Support</p>
        <h1 className="display text-4xl">Help</h1>
      </div>
      <div className="space-y-4 text-sm text-ink-soft">
        <p>Oracle’s Clip is your content business. The Engine Room is the machine underneath.</p>
        <p>
          Create from sources you own or have permission to use. Estimated earnings are labeled and never treated as a
          balance. Confirmed earnings wait on a platform. Payouts stay off until a provider is configured.
        </p>
        <p>Publishing uses official OAuth. If a destination is unavailable, it is not connected — we will not pretend otherwise.</p>
        <p>
          Demo Mode in <Link to="/settings" className="text-forest">Settings</Link> walks the factory with sample data. Demo money cannot be withdrawn.
        </p>
      </div>
    </div>
  );
}
