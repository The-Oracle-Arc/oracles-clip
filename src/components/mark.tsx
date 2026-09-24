import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-forest" />
      <path
        d="M16 8.5c-4.1 0-7.5 3.2-7.5 7.5S11.9 23.5 16 23.5 23.5 20.3 23.5 16 20.1 8.5 16 8.5zm0 2.2c2.9 0 5.3 2.3 5.3 5.3S18.9 21.3 16 21.3 10.7 19 10.7 16 13.1 10.7 16 10.7z"
        className="fill-forest-fg"
      />
      <rect x="21.2" y="21.2" width="5.2" height="1.7" rx="0.6" className="fill-forest-fg" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 text-ink", className)}>
      <Mark />
      <span className="display text-[17px] leading-none tracking-tight">
        Oracle’s <span className="italic">Clip</span>
      </span>
    </span>
  );
}
