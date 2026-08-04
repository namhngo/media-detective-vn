import { ChevronDown } from "lucide-react";

import { TierBadge } from "@/components/tier-badge";
import { formatCaseDate, formatVnd, shortCaseRef } from "@/lib/format";
import { categoryLabels, platformLabels, techniqueLabels } from "@/lib/tier";
import type { GalleryEntry } from "@/lib/schema";

function confirmationMark(entry: GalleryEntry) {
  if (entry.isSeed) {
    return (
      <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        Seed case
      </span>
    );
  }
  if (entry.confirmationSource === "ai_detected") {
    return (
      <span className="font-mono text-[10px] tracking-[0.12em] text-primary uppercase">
        AI + user confirmed
      </span>
    );
  }
  return (
    <span className="font-mono text-[10px] tracking-[0.12em] text-confirmed-user uppercase">
      Reported by user
    </span>
  );
}

/**
 * One confirmed case in the public library — expandable case-file card.
 * Structured summary only; raw content never exists here.
 */
export function GalleryCard({ entry }: { entry: GalleryEntry }) {
  return (
    <details className="group rounded-lg border bg-card">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          Case {shortCaseRef(entry.id)} · {formatCaseDate(entry.createdAt)} ·{" "}
          {platformLabels[entry.platform]}
        </p>
        <span className="text-sm font-medium">
          {categoryLabels[entry.category]}
        </span>
        <span className="ml-auto flex items-center gap-3">
          {confirmationMark(entry)}
          <TierBadge tier={entry.tier} showVi={false} />
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </span>
      </summary>

      <div className="border-t px-5 py-4">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
              Claims
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
            <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
              Techniques
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {entry.techniques.length > 0 ? (
                entry.techniques.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border px-2 py-0.5 text-xs font-medium"
                  >
                    {techniqueLabels[t]}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  None tagged
                </span>
              )}
            </div>
            {(entry.location || entry.amountVnd) && (
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {entry.location && <p>Location: {entry.location}</p>}
                {entry.amountVnd && <p>Losses: {formatVnd(entry.amountVnd)}</p>}
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {entry.explanationEn}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          {entry.sourceCitation ? (
            <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
              Source: {entry.sourceCitation}
            </p>
          ) : (
            <span />
          )}
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            Raw content:{" "}
            <span className="text-redacted" aria-hidden="true">
              ████████
            </span>{" "}
            never stored
          </p>
        </div>
      </div>
    </details>
  );
}
