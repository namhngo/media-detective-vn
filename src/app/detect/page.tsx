import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DetectFlow } from "@/components/detect-flow";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";

export const metadata: Metadata = {
  title: "Check content — Media Detective Vietnam",
};

export default async function DetectPage() {
  await auth.protect();

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <WorkspaceBackdrop />
      <PageHero
        eyebrowIcon={Lock}
        eyebrow="Private by default"
        title="What made you pause?"
        accent="pause"
        lede="Paste a message or upload a screenshot. The raw content is analyzed in the moment and never stored — only the structured assessment counts."
      />
      <div className="mt-10">
        <DetectFlow />
      </div>
    </div>
  );
}
