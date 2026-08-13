import type { Tier } from "@/lib/schema";
import { TierIcon } from "@/components/tier-icon";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";
import { tierLabel } from "@/lib/tier";

const tierClass: Record<Tier, string> = {
  watch: "bg-tier-watch",
  caution: "bg-tier-caution",
  warning: "bg-tier-warning",
};

/** The tier pill — icon + label, the friendliest a stamp can look while still being unmistakable. */
export function TierBadge({
  tier,
  className,
}: {
  tier: Tier;
  className?: string;
}) {
  const { language } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white",
        tierClass[tier],
        className,
      )}
    >
      <TierIcon tier={tier} className="size-3.5" />
      {tierLabel(tier, language)}
    </span>
  );
}
