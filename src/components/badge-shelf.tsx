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
import { useI18n } from "@/components/i18n-provider";

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
  const { language } = useI18n();
  const badgeCopy: Record<string, { label: string; description: string }> = language === "vi" ? {
    first_check: { label: "Lần kiểm tra đầu tiên", description: "Đã kiểm tra nội dung lần đầu." },
    watchful_10: { label: "Cảnh giác", description: "Đã kiểm tra 10 nội dung." },
    watchful_50: { label: "Tỉnh táo", description: "Đã kiểm tra 50 nội dung." },
    first_report: { label: "Báo cáo đầu tiên", description: "Đã báo cáo một vụ việc từ trải nghiệm của mình." },
    guardian_5: { label: "Người bảo vệ cộng đồng", description: "Đã thêm 5 vụ việc vào thư viện công khai." },
    streak_7: { label: "Giữ mạch", description: "Đã hoạt động 7 ngày liên tiếp." },
    pattern_spotter: { label: "Nhận ra thủ đoạn", description: "Đã gặp 5 danh mục lừa đảo khác nhau." },
  } : {};
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
                {badgeCopy[badge.id]?.label ?? badge.label}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {badgeCopy[badge.id]?.description ?? badge.description}
              </p>
              {badge.earned && badge.earnedAt ? (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {language === "vi" ? "Đã nhận " : "Earned "}
                  {new Date(badge.earnedAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
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
