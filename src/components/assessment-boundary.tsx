import { FileQuestion } from "lucide-react";

import type { AnalysisResult } from "@/lib/schema";
import { useI18n } from "@/components/i18n-provider";

export function AssessmentBoundary({ analysis }: { analysis: AnalysisResult }) {
  const { t } = useI18n();
  const heading =
    analysis.assessmentStatus === "assessable"
      ? t("assessmentNone")
      : analysis.assessmentStatus === "not_media"
        ? t("assessmentRequest")
        : t("assessmentInsufficient");

  return (
    <article className="torch-panel overflow-hidden rounded-2xl">
      <div className="flex items-start gap-3.5 px-5 py-6 sm:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <FileQuestion className="size-5" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("assessmentNone")}
          </p>
          <h2 className="mt-1 text-lg font-semibold">{heading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {analysis.explanationEn}
          </p>
        </div>
      </div>
      <p className="border-t border-border/70 px-5 py-4 text-sm text-muted-foreground sm:px-6">
        Paste the message, post, ad copy, call details, suspicious link, or a
        screenshot you want checked.
      </p>
    </article>
  );
}
