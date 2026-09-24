import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-xl border border-line bg-paper shadow-soft", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 pt-5 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-base font-medium tracking-tight text-ink", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-stone", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}
