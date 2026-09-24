import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-dashed border-line bg-paper/60 px-6 py-10 text-center", className)}>
      <h3 className="display text-xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
