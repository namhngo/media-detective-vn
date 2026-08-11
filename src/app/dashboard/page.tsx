import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { DashboardView } from "@/components/dashboard-view";
import { PageHero } from "@/components/page-hero";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";
import { getUserActivity } from "@/lib/activity";
import { getDashboardData } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Media Detective Vietnam",
};

export default async function DashboardPage() {
  const { userId } = await auth.protect();
  const [data, activity] = await Promise.all([
    getDashboardData(),
    getUserActivity(userId).catch((error) => {
      console.error("Dashboard activity lookup failed", error);
      return null;
    }),
  ]);

  return (
    <div className="relative isolate mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <WorkspaceBackdrop />
      <PageHero
        eyebrowIcon={Activity}
        eyebrow="All activity anonymous"
        title="The picture so far"
        accent="picture"
        lede="Aggregates from every check run against the library. Individual cases are only ever shown when confirmed — everything else contributes to counts, never to names."
      />
      <div className="mt-10">
        <DashboardView data={data} activity={activity} />
      </div>
    </div>
  );
}
