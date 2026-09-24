import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/mark";

export function AuthFrame({
  kicker,
  title,
  children,
  footer,
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto grid min-h-dvh max-w-6xl md:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden flex-col justify-between px-12 py-10 md:flex">
          <Link to="/">
            <Wordmark />
          </Link>
          <div className="max-w-md">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone">Create · Publish · Earn</p>
            <h1 className="display mt-4 text-5xl leading-[1.05] text-ink">A studio for work you actually own.</h1>
            <p className="mt-4 text-base text-ink-soft">
              Estimated money is labeled. Confirmed money waits on the platform. Payouts stay off until a provider is configured.
            </p>
          </div>
          <p className="text-xs text-stone">Oracle’s Clip never asks for a destination password.</p>
        </section>
        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md rounded-xl border border-line bg-paper p-6 shadow-soft md:p-8">
            <div className="mb-6 md:hidden">
              <Wordmark />
            </div>
            {kicker ? <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">{kicker}</p> : null}
            <h2 className="display mt-1 text-3xl text-ink">{title}</h2>
            <div className="mt-6">{children}</div>
            {footer ? <div className="mt-6 text-sm text-stone">{footer}</div> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
