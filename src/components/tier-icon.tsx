import { Eye, OctagonAlert, TriangleAlert } from "lucide-react";

import type { Tier } from "@/lib/schema";
import { cn } from "@/lib/utils";

const icons = {
  watch: Eye,
  caution: TriangleAlert,
  warning: OctagonAlert,
} as const;

/** The icon that carries each tier's emotional register, used everywhere the tier appears. */
export function TierIcon({
  tier,
  className,
}: {
  tier: Tier;
  className?: string;
}) {
  const Icon = icons[tier];
  return <Icon className={cn("size-4", className)} />;
}
