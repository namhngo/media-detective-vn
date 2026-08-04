"use client";

import { useEffect, useState } from "react";

import {
  ConfirmationSplit,
  TechniqueChart,
  TrendChart,
} from "@/components/dashboard-charts";
import { GalleryCard } from "@/components/gallery-card";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryLabels } from "@/lib/tier";
import type { DashboardResponse } from "@/lib/schema";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border bg-card px-5 py-4">
      <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-3xl font-medium tracking-tight">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function DashboardView() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <p className="text-sm text-muted-foreground">
        The dashboard didn&rsquo;t load. Refresh to try again.
      </p>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Checks run" value={String(data.stats.totalChecks)} />
        <StatCard
          label="Confirmed cases"
          value={String(data.stats.confirmedCases)}
          sub="Seed + shared + reported"
        />
        <StatCard
          label="Top category this week"
          value={
            data.stats.topCategoryThisWeek
              ? categoryLabels[data.stats.topCategoryThisWeek]
              : "—"
          }
        />
      </div>

      {/* Trend */}
      <section className="rounded-lg border bg-card p-5 sm:p-6">
        <h2 className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
          Check volume over time · by tier
        </h2>
        <div className="mt-4">
          <TrendChart data={data.trend} />
        </div>
        <div className="mt-2 flex justify-center gap-6 text-xs text-muted-foreground">
          <p>
            <span className="mr-1.5 inline-block size-2 rounded-full bg-tier-watch" />
            Watch
          </p>
          <p>
            <span className="mr-1.5 inline-block size-2 rounded-full bg-tier-caution" />
            Caution
          </p>
          <p>
            <span className="mr-1.5 inline-block size-2 rounded-full bg-tier-warning" />
            Warning
          </p>
        </div>
      </section>

      {/* Techniques + split */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border bg-card p-5 sm:p-6">
          <h2 className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
            Top manipulation techniques
          </h2>
          <div className="mt-4">
            <TechniqueChart data={data.techniqueCounts} />
          </div>
        </section>
        <section className="rounded-lg border bg-card p-5 sm:p-6">
          <h2 className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
            Confirmed by AI + user · vs · self-reported
          </h2>
          <div className="mt-4">
            <ConfirmationSplit data={data.confirmationSplit} />
          </div>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <p>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-primary" />
              AI + user confirmed ({data.confirmationSplit.aiDetected})
            </p>
            <p>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-confirmed-user" />
              Self-reported ({data.confirmationSplit.userReported})
            </p>
          </div>
        </section>
      </div>

      {/* Gallery */}
      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
            Confirmed case library
          </h2>
          <p className="text-xs text-muted-foreground">
            Structured summaries only — raw content never exists here
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {data.gallery.map((entry) => (
            <GalleryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
