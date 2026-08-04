import type { Tier } from "@/lib/schema";
import { TierIcon } from "@/components/tier-icon";
import { tierMeta } from "@/lib/tier";
import { cn } from "@/lib/utils";

const tierClass: Record<Tier, string> = {
  watch: "bg-tier-watch",
  caution: "bg-tier-caution",
  warning: "bg-tier-warning",
};

/** The tier pill — icon + label, the friendliest a stamp can look while still being unmistakable. */
export function TierBadge({
  tier,
  showVi = true,
  className,
}: {
  tier: Tier;
  showVi?: boolean;
  className?: string;
}) {
  const meta = tierMeta[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white",
        tierClass[tier],
        className,
      )}
    >
      <TierIcon tier={tier} className="size-3.5" />
      {meta.label}
      {showVi && (
        <span className="font-normal opacity-80">· {meta.vi}</span>
      )}
    </span>
  );
}
