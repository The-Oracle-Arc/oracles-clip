import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/")({ component: Landing });

const LOOP = ["Create", "Publish", "Grow", "Earn", "Reinvest"];

function Landing() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) {
    return <RedirectToSignIn to="/home" />;
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Wordmark />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Create account</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:pt-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone">Creator business</p>
        <h1 className="display mt-4 max-w-3xl text-5xl leading-[1.04] text-ink md:text-7xl">
          Turn footage you own into a repeating content practice.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          Oracle’s Clip is an earning account powered by a quiet factory: ingest, clip, comply, publish, measure. It will not pretend a view is a payout.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link to="/signup">
              Open an account <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">I already have one</Link>
          </Button>
        </div>

        <div className="mt-14 flex flex-wrap gap-2">
          {LOOP.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-line bg-paper px-4 py-2 text-sm">{step}</span>
              {i < LOOP.length - 1 ? <span className="text-stone">→</span> : null}
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Your account, not a console",
              body: "Home shows available, pending, estimated, and confirmed money as four different numbers — empty until they are real.",
            },
            {
              title: "A factory you can open",
              body: "The Engine Room is the machine: jobs, queues, policy, retries. Most days you never need it.",
            },
            {
              title: "Series over spam",
              body: "Episodic continuity is first-class. Near-identical mass production is treated as a risk, not a feature.",
            },
          ].map((card) => (
            <article key={card.title} className="rounded-xl border border-line bg-paper p-6 shadow-soft">
              <h2 className="display text-2xl">{card.title}</h2>
              <p className="mt-3 text-sm text-ink-soft">{card.body}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
