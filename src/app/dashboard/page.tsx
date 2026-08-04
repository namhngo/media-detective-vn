import type { Metadata } from "next";

import { DashboardView } from "@/components/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard — Media Detective Vietnam",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        Dashboard · all activity anonymous
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
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
