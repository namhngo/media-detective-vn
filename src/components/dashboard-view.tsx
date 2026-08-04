"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  TrendingUp,
  Puzzle,
  Users2,
  FileSearch,
} from "lucide-react";

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
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-sm">
      <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </p>
      <p className="mt-1.5 font-mono text-3xl font-medium tracking-tight">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-medium">
      <Icon className="size-4 text-muted-foreground" />
      {children}
    </h2>
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
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Activity}
          label="Checks run"
          value={String(data.stats.totalChecks)}
        />
        <StatCard
          icon={CheckCircle2}
          label="Confirmed cases"
          value={String(data.stats.confirmedCases)}
          sub="Seed + shared + reported"
        />
        <StatCard
          icon={TrendingUp}
          label="Top category this week"
          value={
            data.stats.topCategoryThisWeek
              ? categoryLabels[data.stats.topCategoryThisWeek]
              : "—"
          }
        />
      </div>

      {/* Trend */}
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <SectionHeading icon={Activity}>
          Check volume over time, by tier
        </SectionHeading>
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
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading icon={Puzzle}>
            Top manipulation techniques
          </SectionHeading>
          <div className="mt-4">
            <TechniqueChart data={data.techniqueCounts} />
          </div>
        </section>
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading icon={Users2}>
            Confirmed by AI + user, vs. self-reported
          </SectionHeading>
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
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <SectionHeading icon={FileSearch}>
            Confirmed case library
          </SectionHeading>
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
