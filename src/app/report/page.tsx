import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { ReportFlow } from "@/components/report-flow";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";

export const metadata: Metadata = {
  title: "Report a case — Media Detective Vietnam",
};

export default async function ReportPage() {
  await auth.protect();

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <WorkspaceBackdrop />
      <PageHero
        eyebrowIcon={MessageSquareText}
        eyebrow="Your account is the warning"
        title="Help someone else pause."
        accent="pause"
        lede="It already happened to you — a scam, a fake video call, or a viral lie that targeted you or someone you know. Describe what happened and the same engine structures it into a case file. Publishing depends on your word, not the AI's tier."
      />
      <div className="mt-10">
        <ReportFlow />
      </div>
    </div>
  );
}
