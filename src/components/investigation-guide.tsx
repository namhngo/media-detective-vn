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
    <aside className="relative py-2 lg:sticky lg:top-24">
      <div>
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
