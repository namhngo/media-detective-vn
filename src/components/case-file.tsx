import { TierBadge } from "@/components/tier-badge";
import { formatCaseDate, formatVnd, shortCaseRef } from "@/lib/format";
import { categoryLabels, platformLabels, techniqueLabels, tierMeta } from "@/lib/tier";
import type { AnalysisResult, SimilarCase, Source } from "@/lib/schema";

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

const sourceLabels: Record<Source, string> = {
  text: "Pasted text",
  described_call: "Described call",
  screenshot: "Screenshot",
};

/**
 * The case file — the product's signature card. Structured fields, mono
 * evidence labels, tier stamp. The explanation is the centerpiece.
 */
export function CaseFile({
  reportId,
  source,
  analysis,
  similarCases,
  children,
}: {
  reportId: string;
  source: Source;
  analysis: AnalysisResult;
  similarCases: SimilarCase[];
  /** Slot for the Share prompt (rendered only at warning tier by the caller). */
  children?: React.ReactNode;
}) {
  return (
    <article className="rounded-lg border bg-card shadow-sm">
      {/* Meta header */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          Case {shortCaseRef(reportId)} · {sourceLabels[source]} ·{" "}
          {formatCaseDate(new Date().toISOString())}
        </p>
        <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground">
          Score {analysis.riskScore}/100
        </p>
      </header>

      {/* Verdict */}
      <div className="border-b px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <TierBadge tier={analysis.tier} />
          <p className="text-sm text-muted-foreground">
            {tierMeta[analysis.tier].guidance}
          </p>
        </div>
        <p className="mt-4 leading-relaxed">{analysis.explanationEn}</p>
      </div>

      {/* Evidence */}
      <div className="grid gap-6 px-5 py-5 sm:grid-cols-2 sm:px-6">
        <div>
          <MonoLabel>Claims made</MonoLabel>
          <ul className="mt-2 space-y-1.5 text-sm">
            {analysis.claims.map((claim, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 text-muted-foreground">—</span>
                {claim}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <MonoLabel>Manipulation techniques</MonoLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {analysis.techniques.length > 0 ? (
              analysis.techniques.map((t) => (
                <span
                  key={t}
                  className="rounded-md border px-2 py-0.5 text-xs font-medium"
                >
                  {techniqueLabels[t]}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                None detected
              </span>
            )}
          </div>
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <p>
              Category:{" "}
              <span className="text-foreground">
                {categoryLabels[analysis.category]}
              </span>
            </p>
            <p>
              Platform:{" "}
              <span className="text-foreground">
                {platformLabels[analysis.platform]}
              </span>
            </p>
            <p>
              Money requested:{" "}
              <span className="text-foreground">
                {analysis.moneyRequested ? "Yes" : "No"}
                {analysis.amountVnd
                  ? ` — ${formatVnd(analysis.amountVnd)}`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Similar cases */}
      <div className="border-t px-5 py-5 sm:px-6">
        <MonoLabel>Similar cases from the library</MonoLabel>
        {similarCases.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {similarCases.map((c) => (
              <li key={c.id} className="rounded-md border bg-background p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                    Case {shortCaseRef(c.id)}
                    {c.sourceCitation ? ` · ${c.sourceCitation}` : ""}
                  </p>
                  <p className="shrink-0 font-mono text-[10px] whitespace-nowrap text-muted-foreground">
                    {Math.round(c.similarity * 100)}% match
                  </p>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {c.explanationEn}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            No similar cases in the library yet — nothing cleared the similarity
            floor.
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Similar cases are context, not evidence — the tier comes from the
          analysis alone.
        </p>
      </div>

      {children}
    </article>
  );
}
