"use client";

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
            { title: t("officialChannel"), body: t("officialChannelBody") },
            { title: t("slowUrgency"), body: t("slowUrgencyBody") },
            { title: t("virality"), body: t("viralityBody") },
          ],
        }
      : {
          title: t("guideReportTitle"),
          lead: t("guideReportLead"),
          items: [
            { title: t("describe"), body: t("describeBody") },
            { title: t("rawPrivate"), body: t("rawPrivateBody") },
            { title: t("reviewPublish"), body: t("reviewPublishBody") },
          ],
        };

  return (
    <aside className="torch-panel relative overflow-hidden rounded-3xl p-5 lg:sticky lg:top-24">
      {/* A faint coordinate field keeps the checklist part of the same workspace. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklch,white_9%,transparent)_1px,transparent_1.5px)] bg-[size:20px_20px]"
      />
      <div className="relative">
        <p className="text-sm font-semibold">{content.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{content.lead}</p>

        <div className="mt-5 space-y-4">
          {content.items.map(({ title, body }) => (
            <div key={title}>
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
