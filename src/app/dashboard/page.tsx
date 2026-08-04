import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DashboardView } from "@/components/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard — Media Detective Vietnam",
};

export default async function DashboardPage() {
  await auth.protect();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-muted-foreground">
        <Activity className="size-3.5" />
        All activity anonymous
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        The picture so far
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Aggregates from every check run against the library. Individual cases
        are only ever shown when confirmed — everything else contributes to
        counts, never to names.
      </p>
      <div className="mt-8">
        <DashboardView />
      </div>
    </div>
  );
}
