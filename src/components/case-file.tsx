"use client";

import { BookOpenCheck, ExternalLink, Puzzle, Quote, Users } from "lucide-react";
import { motion } from "motion/react";

import { TierIcon } from "@/components/tier-icon";
import { formatCaseDate, formatVnd, shortCaseRef } from "@/lib/format";
import { fadeUp } from "@/lib/motion";
import { categoryLabels, platformLabels, techniqueLabels, tierMeta } from "@/lib/tier";
import type { AnalysisResult, SimilarCase, Source } from "@/lib/schema";
import { cn } from "@/lib/utils";

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-sm font-medium">
      <Icon className="size-4 text-muted-foreground" />
      {children}
    </p>
  );
}

const sourceLabels: Record<Source, string> = {
  text: "Pasted text",
  screenshot: "Screenshot",
};

const tierTint: Record<AnalysisResult["tier"], string> = {
  watch: "bg-tier-watch/8",
  caution: "bg-tier-caution/8",
  warning: "bg-tier-warning/8",
};

const tierIconBg: Record<AnalysisResult["tier"], string> = {
  watch: "bg-tier-watch",
  caution: "bg-tier-caution",
  warning: "bg-tier-warning",
};

/**
 * The result card — a warm, icon-led verdict callout up top (the product's
 * signature moment), then the supporting evidence in plain, quiet sections.
 */
export function CaseFile({
  reportId,
  source,
  analysis,
  similarCases,
  attestation,
  children,
}: {
  reportId: string;
  source: Source;
  analysis: AnalysisResult;
  similarCases: SimilarCase[];
  /** Report flow: "Reported by user · AI signal: X" transparency strip. */
  attestation?: React.ReactNode;
  /** Slot for the Share prompt (rendered only at warning tier by the caller). */
  children?: React.ReactNode;
}) {
  const meta = tierMeta[analysis.tier];

  return (
    <motion.article
      {...fadeUp}
      className="torch-panel overflow-hidden rounded-2xl"
    >
      {/* Reference tag — present for traceability, deliberately quiet */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4 sm:px-6">
        <p className="text-xs text-muted-foreground">
          Reference #{shortCaseRef(reportId).replace("#", "")} ·{" "}
          {sourceLabels[source]} · {formatCaseDate(new Date().toISOString())}
        </p>
        <p className="text-xs text-muted-foreground">
          Model confidence: {analysis.riskScore}/100
        </p>
      </div>

      {attestation}

      {/* Verdict callout — the signature moment */}
      <div className={cn("mx-5 mt-4 rounded-2xl p-5 sm:mx-6 sm:p-6", tierTint[analysis.tier])}>
        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full text-white",
              tierIconBg[analysis.tier],
            )}
          >
            <TierIcon tier={analysis.tier} className="size-5" />
          </span>
          <div>
            <p className="text-lg font-semibold">{meta.label}</p>
            <p className="text-sm text-muted-foreground">{meta.guidance}</p>
          </div>
        </div>
        <p className="mt-4 leading-relaxed">{analysis.explanationEn}</p>
      </div>

      {/* Evidence */}
      <div className="grid gap-6 px-5 py-6 sm:grid-cols-2 sm:px-6">
        <div>
          <SectionHeading icon={Quote}>What it claims</SectionHeading>
          <ul className="mt-2.5 space-y-1.5 text-sm">
            {analysis.claims.map((claim, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 text-muted-foreground">—</span>
                {claim}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeading icon={Puzzle}>Manipulation techniques</SectionHeading>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {analysis.techniques.length > 0 ? (
              analysis.techniques.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium"
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

      {analysis.evidenceSources.length > 0 && (
        <div className="border-t border-border/70 px-5 py-6 sm:px-6">
          <SectionHeading icon={BookOpenCheck}>Sources checked</SectionHeading>
          <ul className="mt-3 space-y-2">
            {analysis.evidenceSources.map((source) => (
              <li key={`${source.provider}:${source.url}`}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-start justify-between gap-3 rounded-xl bg-secondary/60 p-3.5 transition-colors hover:bg-secondary"
                >
                  <span>
                    <span className="block text-sm font-medium group-hover:underline">
                      {source.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {source.publisher ??
                        (source.provider === "exa"
                          ? "Source found via Exa"
                          : "Published fact check")}
                      {source.publishedAt ? ` · ${source.publishedAt}` : ""}
                    </span>
                  </span>
                  <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            These links are context for your own verification. They do not set
            the confidence tier.
          </p>
        </div>
      )}

      {/* Similar cases */}
      <div className="border-t border-border/70 px-5 py-6 sm:px-6">
        <SectionHeading icon={Users}>
          Others have seen this before
        </SectionHeading>
        {similarCases.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {similarCases.map((c) => (
              <li key={c.id} className="rounded-xl bg-secondary/60 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    {shortCaseRef(c.id)}
                    {c.sourceCitation ? ` · ${c.sourceCitation}` : ""}
                  </p>
                  <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {Math.round(c.similarity * 100)}% match
                  </span>
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

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {children}
        </motion.div>
      )}
    </motion.article>
  );
}
