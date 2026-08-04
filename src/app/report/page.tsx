import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { ReportFlow } from "@/components/report-flow";

export const metadata: Metadata = {
  title: "Report a case — Media Detective Vietnam",
};

export default async function ReportPage() {
  await auth.protect();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground">
        <MessageSquareText className="size-3.5" />
        Your account is the warning
      </span>
      <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        Help someone else pause.
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        It already happened to you — a scam, a deepfake, or a viral lie that
        targeted you or someone you know. No need to pretend otherwise.
        Describe what happened and the same engine structures it into a case
        file. Publishing depends on your word, not the AI&rsquo;s tier; the
        AI&rsquo;s independent signal stays attached for transparency.
      </p>
      <div className="mt-8">
        <ReportFlow />
      </div>
    </div>
  );
}
