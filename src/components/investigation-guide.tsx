"use client";

import {
  BookOpenCheck,
  Clock3,
  Eye,
  LockKeyhole,
  MessageSquareText,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

type GuideMode = "detect" | "report";

/** The companion rail that teaches a verification habit before an AI answer. */
export function InvestigationGuide({ mode }: { mode: GuideMode }) {
  const { t } = useI18n();
  const content =
    mode === "detect"
      ? {
          title: t("guideDetectTitle"),
          lead: t("guideDetectLead"),
          items: [
            { icon: ShieldCheck, title: t("officialChannel"), body: t("officialChannelBody") },
            { icon: Clock3, title: t("slowUrgency"), body: t("slowUrgencyBody") },
            { icon: Share2, title: t("virality"), body: t("viralityBody") },
          ],
          footer: t("detectLead"),
        }
      : {
          title: t("guideReportTitle"),
          lead: t("guideReportLead"),
          items: [
            { icon: MessageSquareText, title: t("describe"), body: t("describeBody") },
            { icon: LockKeyhole, title: t("rawPrivate"), body: t("rawPrivateBody") },
            { icon: Eye, title: t("reviewPublish"), body: t("reviewPublishBody") },
          ],
          footer: t("reportLead"),
        };

  return (
    <aside className="torch-panel relative overflow-hidden rounded-3xl p-5 lg:sticky lg:top-24">
      {/* A faint coordinate field keeps the checklist part of the same workspace. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklch,white_9%,transparent)_1px,transparent_1.5px)] bg-[size:20px_20px]"
      />
      <div className="relative">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <BookOpenCheck className="size-4 text-primary" />
          {content.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{content.lead}</p>

        <ol className="relative mt-5 space-y-4 before:absolute before:top-3 before:bottom-3 before:left-3.5 before:w-px before:bg-white/10">
          {content.items.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="flex gap-3">
              <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary ring-1 ring-primary/20">
                {index + 1}
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Icon className="size-3.5 text-muted-foreground" />
                  {title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-5 border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground">
          {content.footer}
        </p>
      </div>
    </aside>
  );
}
