import { Badge } from "@/components/ui/badge";

export function DemoBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber/20 bg-amber/8 px-4 py-3">
      <Badge tone="amber">Demo mode</Badge>
      <p className="text-sm text-ink-soft">
        Figures and publications on this screen are simulated sample data. They are not confirmed earnings and cannot be withdrawn.
      </p>
    </div>
  );
}
