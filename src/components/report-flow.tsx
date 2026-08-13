"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock, MessageSquareText } from "lucide-react";

import { AnalyzingCard } from "@/components/analyzing-card";
import { AssessmentBoundary } from "@/components/assessment-boundary";
import { Button } from "@/components/ui/button";
import { CaseFile } from "@/components/case-file";
import { ContentInput } from "@/components/content-input";
import { InvestigationGuide } from "@/components/investigation-guide";
import { RedactedLine } from "@/components/redacted-line";
import {
  categorySchema,
  platformSchema,
  type Category,
  type DetectRequest,
  type Platform,
  type ReportResponse,
} from "@/lib/schema";
import { useI18n } from "@/components/i18n-provider";
import { categoryLabel, platformLabel, tierLabel } from "@/lib/tier";
import { cn } from "@/lib/utils";

type Phase =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "preview"; request: DetectRequest; result: ReportResponse }
  | { status: "publishing"; request: DetectRequest; result: ReportResponse }
  | { status: "published"; reportId: string }
  | { status: "error"; message: string };

/**
 * Report flow — for people who already know. The same engine structures the
 * account into a case file, but publishing depends on the user's attestation,
 * not the AI's tier. The AI's independent tier stays visible as a
 * transparency badge even when it diverges from the user's account.
 */
export function ReportFlow() {
  const { language, t } = useI18n();
  const [phase, setPhase] = useState<Phase>({ status: "idle" });
  const [platformHint, setPlatformHint] = useState<Platform | null>(null);
  const [categoryHint, setCategoryHint] = useState<Category | null>(null);

  function resetFlow() {
    setPlatformHint(null);
    setCategoryHint(null);
    setPhase({ status: "idle" });
  }

  async function analyze(payload: DetectRequest) {
    setPhase({ status: "analyzing" });
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
      const result: ReportResponse = await res.json();
      setPhase({ status: "preview", request: payload, result });
    } catch (e) {
      setPhase({
        status: "error",
        message: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }

  async function publish() {
    if (phase.status !== "preview") return;
    const { request, result } = phase;
    if (result.reportId === null) return;
    const reportId = result.reportId;
    setPhase({ status: "publishing", request, result });
    try {
      const response = await fetch("/api/report/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reportId }),
      });
      if (!response.ok) throw new Error(`Publishing failed (${response.status})`);
      setPhase({ status: "published", reportId });
    } catch (error) {
      setPhase({
        status: "error",
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }

  const analyzing = phase.status === "analyzing";
  const publishing = phase.status === "publishing";

  return (
    <div className="space-y-6">
      {(phase.status === "idle" || analyzing || phase.status === "error") && (
        <>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="space-y-4">
              <ReportHintChips
                language={language}
                platformHint={platformHint}
                categoryHint={categoryHint}
                onPlatformHint={setPlatformHint}
                onCategoryHint={setCategoryHint}
              />
              <ContentInput
                busy={analyzing}
                submitLabel={t("reportSubmit")}
                onSubmit={analyze}
                mode="report"
              />
            </div>
            <InvestigationGuide mode="report" />
          </div>
          {analyzing && (
            <AnalyzingCard label={t("reportProgress")} />
          )}
          {phase.status === "error" && (
            <div
              className="torch-panel rounded-2xl border-destructive/40 px-5 py-4 sm:px-6"
              role="alert"
            >
              <p className="text-sm">
                {t("flowError")} {phase.message}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("flowNothingStored")}
              </p>
            </div>
          )}
        </>
      )}

      {(phase.status === "preview" || phase.status === "publishing") && (
        phase.result.reportId === null ? (
          <div className="mx-auto max-w-3xl space-y-4">
            <AssessmentBoundary analysis={phase.result.analysis} />
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={resetFlow}
                className="rounded-full"
              >
                {t("flowTryAnother")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto max-w-3xl">
              <CaseFile
                reportId={phase.result.reportId}
                source={phase.request.source}
                analysis={phase.result.analysis}
                similarCases={phase.result.similarCases}
                attestation={
                  <div className="mx-5 mt-4 flex flex-wrap items-center gap-2 rounded-full bg-confirmed-user/10 px-3.5 py-2 text-sm font-medium text-confirmed-user sm:mx-6">
                    <MessageSquareText className="size-4" />
                    {t("reportAttestation")} {tierLabel(phase.result.analysis.tier, language)}
                    {(platformHint || categoryHint) && (
                      <span className="text-confirmed-user/70">
                        · {[
                          platformHint && platformLabel(platformHint, language),
                          categoryHint && categoryLabel(categoryHint, language),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </div>
                }
              />
            </div>
            <div className="torch-panel mx-auto max-w-3xl rounded-2xl px-5 py-5 sm:px-6">
              <p className="text-sm leading-relaxed">
                {t("reportPublishIntro")}
              </p>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <p>{t("reportPublishedFields")}</p>
                <p className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Lock className="size-3 shrink-0" />
                    {t("reportNeverPublished")}
                  </span>
                  <RedactedLine />
                   <span>{t("reportRaw")}</span>
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={publish}
                  disabled={publishing}
                  className="rounded-full"
                >
                  {publishing ? t("reportPublishing") : t("reportPublish")}
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetFlow}
                  disabled={publishing}
                  className="rounded-full"
                >
                  {t("reportDiscard")}
                </Button>
              </div>
            </div>
          </>
        )
      )}

      {phase.status === "published" && (
        <div className="torch-panel rounded-2xl px-5 py-10 text-center sm:px-6">
          <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-confirmed-user/15">
            <Check className="size-5 text-confirmed-user" />
          </span>
          <p className="mt-3 font-medium">{t("reportPublished")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("reportPublishedBody")}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              variant="outline"
              className="rounded-full"
            >
              {t("reportDashboard")}
            </Button>
            <Button
              variant="ghost"
              onClick={resetFlow}
              className="rounded-full"
            >
              {t("reportAnother")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Where/what chips — the user's own account, collected up front. Kept
 * separate from the AI's independent platform/category (see ReportFlow's
 * attestation banner): this is what the user says, shown alongside, never
 * substituted for, what the AI finds on its own.
 */
function ReportHintChips({
  language,
  platformHint,
  categoryHint,
  onPlatformHint,
  onCategoryHint,
}: {
  language: "en" | "vi";
  platformHint: Platform | null;
  categoryHint: Category | null;
  onPlatformHint: (value: Platform) => void;
  onCategoryHint: (value: Category) => void;
}) {
  const vi = language === "vi";

  return (
    <div className="torch-panel rounded-3xl p-5 sm:p-6">
      <p className="torch-label mb-4">
        <span className="torch-label-num">00</span>
        {vi ? "TRƯỚC KHI MÔ TẢ" : "BEFORE YOU DESCRIBE IT"}
      </p>
      <div className="space-y-4">
        <ChipGroup
          label={vi ? "Bạn thấy nó ở đâu?" : "Where did you see it?"}
          options={platformSchema.options}
          value={platformHint}
          onChange={onPlatformHint}
          labelFor={(value) => platformLabel(value, language)}
        />
        <ChipGroup
          label={vi ? "Điều gì khiến bạn thấy sai?" : "What felt wrong?"}
          options={categorySchema.options}
          value={categoryHint}
          onChange={onCategoryHint}
          labelFor={(value) => categoryLabel(value, language)}
        />
      </div>
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  labelFor,
}: {
  label: string;
  options: readonly T[];
  value: T | null;
  onChange: (value: T) => void;
  labelFor: (value: T) => string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              value === option
                ? "border-primary bg-primary/15 text-primary"
                : "border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground",
            )}
          >
            {labelFor(option)}
          </button>
        ))}
      </div>
    </div>
  );
}
