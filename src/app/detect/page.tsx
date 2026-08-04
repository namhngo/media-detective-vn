import type { Metadata } from "next";

import { DetectFlow } from "@/components/detect-flow";

export const metadata: Metadata = {
  title: "Check content — Media Detective Vietnam",
};

export default function DetectPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        Detect · private by default
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Check content
      </h1>
      <p className="mt-2 text-muted-foreground">
        Paste a message, describe a call, or upload a screenshot. The raw
        content is analyzed in the moment and never stored — only the
        structured assessment counts.
      </p>
      <div className="mt-8">
        <DetectFlow />
      </div>
    </div>
  );
}
