"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CaseFile } from "@/components/case-file";
import { ContentInput } from "@/components/content-input";
import { RedactedLine } from "@/components/redacted-line";
import { tierMeta } from "@/lib/tier";
import type { DetectRequest, ReportResponse } from "@/lib/schema";

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
  const [phase, setPhase] = useState<Phase>({ status: "idle" });

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
    setPhase({ status: "publishing", request, result });
    // Mock phase: /api/report already published. Backend phase: confirm call
    // against the signed-in (anonymous auth) session.
    await new Promise((r) => setTimeout(r, 600));
    setPhase({ status: "published", reportId: result.reportId });
  }

  const analyzing = phase.status === "analyzing";
  const publishing = phase.status === "publishing";

  return (
    <div className="space-y-6">
      {(phase.status === "idle" || analyzing || phase.status === "error") && (
        <>
          <ContentInput
            busy={analyzing}
            submitLabel="Structure my report"
            onSubmit={analyze}
          />
          {analyzing && (
            <div className="rounded-2xl border border-border/70 bg-card px-5 py-8 shadow-sm sm:px-6">
              <div className="flex items-center gap-3">
                <span className="size-2 animate-pulse rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Structuring your account into a case file…
                </p>
              </div>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-primary/60" />
              </div>
            </div>
          )}
          {phase.status === "error" && (
            <div
              className="rounded-2xl border border-destructive/40 bg-card px-5 py-4 sm:px-6"
              role="alert"
            >
              <p className="text-sm">
                The analysis didn&rsquo;t complete: {phase.message}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check the input and try again — nothing was stored.
              </p>
            </div>
          )}
        </>
      )}

      {(phase.status === "preview" || phase.status === "publishing") && (
        <>
          <CaseFile
            reportId={phase.result.reportId}
            source={phase.request.source}
            analysis={phase.result.analysis}
            similarCases={phase.result.similarCases}
            attestation={
              <div className="mx-5 mt-4 flex items-center gap-2 rounded-full bg-confirmed-user/10 px-3.5 py-2 text-sm font-medium text-confirmed-user sm:mx-6">
                <MessageSquareText className="size-4" />
                Reported by you · AI signal: {tierMeta[phase.result.analysis.tier].label}
              </div>
            }
          />
          <div className="rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-sm sm:px-6">
            <p className="text-sm leading-relaxed">
              Publishing adds this case file to the public library. Your
              account is the trust signal here — the AI&rsquo;s independent
              signal stays attached for transparency, even where it differs
              from your experience.
            </p>
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <p>Published: category, techniques, tier, and explanation.</p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Lock className="size-3 shrink-0" />
                  Never published:
                </span>
                <RedactedLine />
                <span>raw content, names, numbers.</span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={publish} disabled={publishing} className="rounded-full">
                {publishing ? "Publishing…" : "Publish case file"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPhase({ status: "idle" })}
                disabled={publishing}
                className="rounded-full"
              >
                Discard
              </Button>
            </div>
          </div>
        </>
      )}

      {phase.status === "published" && (
        <div className="rounded-2xl border border-border/70 bg-card px-5 py-10 text-center shadow-sm sm:px-6">
          <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-confirmed-user/15">
            <Check className="size-5 text-confirmed-user" />
          </span>
          <p className="mt-3 font-medium">Published — thank you.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your case file is now part of the public library. The next person
            who checks a similar pattern will see it.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              variant="outline"
              className="rounded-full"
            >
              View dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPhase({ status: "idle" })}
              className="rounded-full"
            >
              Report another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
