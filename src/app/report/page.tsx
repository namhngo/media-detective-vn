import type { Metadata } from "next";

import { ReportFlow } from "@/components/report-flow";

export const metadata: Metadata = {
  title: "Report a scam — Media Detective Vietnam",
};

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        Report · your account is the warning
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Report a scam
      </h1>
      <p className="mt-2 text-muted-foreground">
        It already happened to you — no need to pretend otherwise. Describe
        what happened and the same engine structures it into a case file.
        Publishing depends on your word, not the AI&rsquo;s tier; the AI&rsquo;s
        independent signal stays attached for transparency.
      </p>
      <div className="mt-8">
        <ReportFlow />
      </div>
    </div>
  );
}
