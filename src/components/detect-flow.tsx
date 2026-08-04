"use client";

import { useState } from "react";

import { CaseFile } from "@/components/case-file";
import { ContentInput } from "@/components/content-input";
import { SharePrompt } from "@/components/share-prompt";
import type { DetectRequest, DetectResponse } from "@/lib/schema";

type Phase =
  | { status: "idle" }
  | { status: "analyzing"; source: DetectRequest["source"] }
  | { status: "done"; request: DetectRequest; result: DetectResponse }
  | { status: "error"; message: string };

export function DetectFlow() {
  const [phase, setPhase] = useState<Phase>({ status: "idle" });

  async function analyze(payload: DetectRequest) {
    setPhase({ status: "analyzing", source: payload.source });
    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
      const result: DetectResponse = await res.json();
      setPhase({ status: "done", request: payload, result });
    } catch (e) {
      setPhase({
        status: "error",
        message: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }

  const analyzing = phase.status === "analyzing";

  return (
    <div className="space-y-6">
      <ContentInput busy={analyzing} submitLabel="Investigate" onSubmit={analyze} />

      {analyzing && (
        <div className="rounded-2xl border border-border/70 bg-card px-5 py-8 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            <p className="text-sm text-muted-foreground">
              Analyzing — extracting claims, checking techniques, searching
              similar cases…
            </p>
          </div>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-primary/60" />
          </div>
        </div>
      )}

      {phase.status === "error" && (
        <div className="rounded-2xl border border-destructive/40 bg-card px-5 py-4 sm:px-6" role="alert">
          <p className="text-sm">
            The analysis didn&rsquo;t complete: {phase.message}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the input and try again — nothing was stored.
          </p>
        </div>
      )}

      {phase.status === "done" && (
        <>
          <CaseFile
            reportId={phase.result.reportId}
            source={phase.request.source}
            analysis={phase.result.analysis}
            similarCases={phase.result.similarCases}
          >
            {phase.result.sharePrompted && (
              <SharePrompt reportId={phase.result.reportId} />
            )}
          </CaseFile>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setPhase({ status: "idle" })}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Check another
            </button>
          </div>
        </>
      )}
    </div>
  );
}
