import { FileQuestion } from "lucide-react";

import type { AnalysisResult } from "@/lib/schema";

const headings: Record<
  Exclude<AnalysisResult["assessmentStatus"], "assessable">,
  string
> = {
  not_media: "This is a request, not media to investigate",
  insufficient: "There is not enough content to investigate",
};

export function AssessmentBoundary({ analysis }: { analysis: AnalysisResult }) {
  const heading =
    analysis.assessmentStatus === "assessable"
      ? "No case file was created"
      : headings[analysis.assessmentStatus];

  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex items-start gap-3.5 px-5 py-6 sm:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <FileQuestion className="size-5" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            No case file created or saved
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
