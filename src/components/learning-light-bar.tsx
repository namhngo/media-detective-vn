"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import type { ActivityResponse } from "@/lib/schema";

const BEAM_STAGE_THRESHOLDS = [0, 5, 15, 35, 70];
const STAGE_RANGES = ["0-4", "5-14", "15-34", "35-69", "70+"];

const STAGE_KEYS = [
  "dashboardBeamStage0",
  "dashboardBeamStage1",
  "dashboardBeamStage2",
  "dashboardBeamStage3",
  "dashboardBeamStage4",
] as const;

function beamStageForActions(totalActions: number) {
  let stage = 0;
  for (let index = 0; index < BEAM_STAGE_THRESHOLDS.length; index += 1) {
    if (totalActions >= BEAM_STAGE_THRESHOLDS[index]!) stage = index;
  }
  return stage;
}

/**
 * Lifetime progress, not a score: the stage bar plus the star balance the prize
 * box on the mini game page spends. Progress only ever moves forward.
 */
export function LearningLightBar({
  light,
  totalActions,
}: {
  light: ActivityResponse["light"];
  totalActions: number;
}) {
  const { t } = useI18n();
  const stage = beamStageForActions(totalActions);
  const nextThreshold = BEAM_STAGE_THRESHOLDS[stage + 1];
  const progress = ((stage + 1) / STAGE_KEYS.length) * 100;

  return (
    <div className="mt-5 border-t border-border/70 pt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            {t("dashboardLightBar")}
            <span className="text-primary">{t(STAGE_KEYS[stage])}</span>
            <details className="relative inline-block">
              <summary className="ml-0.5 flex size-4 cursor-pointer list-none items-center justify-center rounded-full border border-current text-[9px] text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                i
                <span className="sr-only">{t("dashboardLightInfo")}</span>
              </summary>
              <div className="absolute left-0 z-10 mt-2 w-64 rounded-xl border border-border bg-card p-3 text-left text-xs leading-relaxed font-normal text-muted-foreground normal-case shadow-xl">
                <p>{t("dashboardLightInfo")}</p>
                <ul className="mt-2 space-y-0.5 font-mono">
                  {STAGE_KEYS.map((key, index) => (
                    <li key={key} className="flex justify-between gap-3">
                      <span className={index === stage ? "text-primary" : undefined}>
                        {t(key)}
                      </span>
                      <span>{STAGE_RANGES[index]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t("dashboardLightNext")}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <Link
            href="/learn"
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("dashboardOpenLearn")}
          </Link>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Star className="size-3 text-primary" />
            <b className="font-medium text-foreground">{light.stars}</b>
            {t("lightStarsAvailable")}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
        {STAGE_KEYS.map((key, index) => (
          <span key={key} className={index === stage ? "text-primary" : undefined}>
            {t(key)}
          </span>
        ))}
      </div>
      {nextThreshold !== undefined && (
        <p className="mt-2 text-right text-[11px] text-muted-foreground">
          {totalActions} / {nextThreshold} {t("dashboardActions")}
        </p>
      )}
    </div>
  );
}
