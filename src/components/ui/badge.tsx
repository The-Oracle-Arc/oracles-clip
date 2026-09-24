import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "stone",
  children,
}: {
  className?: string;
  tone?: "stone" | "forest" | "amber" | "rose" | "sky" | "sage";
  children: ReactNode;
}) {
  const tones = {
    stone: "bg-mist text-stone",
    forest: "bg-forest/10 text-forest",
    sage: "bg-sage/10 text-sage",
    amber: "bg-amber/10 text-amber",
    rose: "bg-rose/10 text-rose",
    sky: "bg-sky/10 text-sky",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
