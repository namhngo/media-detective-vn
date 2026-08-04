import type { Tier } from "@/lib/schema";
import { tierMeta } from "@/lib/tier";
import { cn } from "@/lib/utils";

const tierClass: Record<Tier, string> = {
  watch: "bg-tier-watch",
  caution: "bg-tier-caution",
  warning: "bg-tier-warning",
};

/**
 * The tier stamp — solid tier color, uppercase, letterspaced. Reads like a
 * stamped verdict on a case file; never color anything else in these hues.
 */
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
        "inline-flex items-baseline gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-white uppercase",
        tierClass[tier],
        className,
      )}
    >
      {meta.label}
      {showVi && (
        <span className="font-normal normal-case tracking-normal opacity-80">
          · {meta.vi}
        </span>
      )}
    </span>
  );
}
