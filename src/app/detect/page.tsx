import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DetectFlow } from "@/components/detect-flow";

export const metadata: Metadata = {
  title: "Check content — Media Detective Vietnam",
};

export default async function DetectPage() {
  await auth.protect();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground">
        <Lock className="size-3.5" />
        Private by default
      </span>
      <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        What made you pause?
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
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
