import { ChevronDown, Lock, Quote, Puzzle } from "lucide-react";

import { TierBadge } from "@/components/tier-badge";
import { RedactedLine } from "@/components/redacted-line";
import { formatCaseDate, formatVnd, shortCaseRef } from "@/lib/format";
import { categoryLabel, platformLabel, techniqueLabel } from "@/lib/tier";
import type { GalleryEntry } from "@/lib/schema";
import { useI18n } from "@/components/i18n-provider";

function confirmationMark(entry: GalleryEntry, labels: { seed: string; ai: string; reported: string }) {
  if (entry.isSeed) {
    return (
      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
        {labels.seed}
      </span>
    );
  }
  if (entry.confirmationSource === "ai_detected") {
    return (
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        {labels.ai}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-confirmed-user/10 px-2 py-0.5 text-xs font-medium text-confirmed-user">
      {labels.reported}
    </span>
  );
}

/**
 * One confirmed case in the public library — expandable case-file card.
 * Structured summary only; raw content never exists here.
 */
export function GalleryCard({ entry }: { entry: GalleryEntry }) {
  const { language, t } = useI18n();
  return (
    <details className="torch-panel group rounded-2xl">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.035] [&::-webkit-details-marker]:hidden">
        <p className="text-xs text-muted-foreground">
           {shortCaseRef(entry.id)} · {formatCaseDate(entry.createdAt, language)} ·{" "}
           {platformLabel(entry.platform, language)}
        </p>
        <span className="text-sm font-medium">
           {categoryLabel(entry.category, language)}
        </span>
        <span className="ml-auto flex items-center gap-3">
           {confirmationMark(entry, { seed: t("gallerySeed"), ai: t("galleryAi"), reported: t("galleryReported") })}
          <TierBadge tier={entry.tier} />
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </span>
      </summary>

      <div className="border-t border-border/70 px-5 py-4">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
             <p className="flex items-center gap-1.5 text-sm font-medium">
              <Quote className="size-3.5 text-muted-foreground" />
               {t("galleryClaims")}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {entry.claims.map((claim, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">—</span>
                  {claim}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Puzzle className="size-3.5 text-muted-foreground" />
               {t("galleryTechniques")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {entry.techniques.length > 0 ? (
                entry.techniques.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium"
                  >
                   {techniqueLabel(t, language)}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                   {t("galleryNone")}
                </span>
              )}
            </div>
            {(entry.location || entry.amountVnd) && (
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
               {entry.location && <p>{t("galleryLocation")} {entry.location}</p>}
               {entry.amountVnd && <p>{t("galleryLosses")} {formatVnd(entry.amountVnd, language)}</p>}
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {entry.explanationEn}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
          {entry.sourceCitation ? (
            <p className="text-xs text-muted-foreground">
               {t("gallerySource")} {entry.sourceCitation}
            </p>
          ) : (
            <span />
          )}
          <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Lock className="size-3 shrink-0" />
               {t("galleryRaw")}
            </span>
            <RedactedLine />
             <span>{t("galleryNever")}</span>
          </p>
        </div>
      </div>
    </details>
  );
}
