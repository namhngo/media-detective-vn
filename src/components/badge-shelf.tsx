import {
  Eye,
  Flame,
  HeartHandshake,
  MessageSquareText,
  Puzzle,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

import type { ActivityBadge, ActivityBadgeId } from "@/lib/schema";
import { cn } from "@/lib/utils";

const BADGE_ICON: Record<
  ActivityBadgeId,
  React.ComponentType<{ className?: string }>
> = {
  first_check: ScanSearch,
  watchful_10: Eye,
  watchful_50: ShieldCheck,
  first_report: MessageSquareText,
  guardian_5: HeartHandshake,
  streak_7: Flame,
  pattern_spotter: Puzzle,
};

/** Earned badges carry brand color; locked ones stay muted with progress. */
export function BadgeShelf({ badges }: { badges: ActivityBadge[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge) => {
        const Icon = BADGE_ICON[badge.id];
        return (
          <li
            key={badge.id}
            className={cn(
              "flex gap-3 rounded-2xl border p-3.5 transition-colors",
              badge.earned
                ? "border-primary/25 bg-primary/5"
                : "border-border/60 bg-secondary/40",
            )}
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full",
                badge.earned
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-semibold",
                  !badge.earned && "text-muted-foreground",
                )}
              >
                {badge.label}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {badge.description}
              </p>
              {badge.earned && badge.earnedAt ? (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Earned{" "}
                  {new Date(badge.earnedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              ) : (
                !badge.earned &&
                badge.target > 1 && (
                  <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                    {badge.progress} / {badge.target}
                  </p>
                )
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
