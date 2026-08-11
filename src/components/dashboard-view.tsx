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

import { CountUp } from "@/components/count-up";
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
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="flex flex-col justify-center rounded-2xl border border-border/60 bg-gradient-to-b from-card to-secondary/50 px-5 py-4 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_12px_28px_-14px_rgba(28,25,23,0.12),inset_0_1px_0_0_rgba(255,255,255,0.8)]">
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
        <div className="grid gap-4 lg:grid-cols-4">
          <Skeleton className="h-72 rounded-2xl lg:col-span-3" />
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bento row: the trend is the hero cell — data-dense, non-sequential
          content is exactly where a real hierarchy grid earns its keep. */}
      <div className="grid gap-4 lg:grid-cols-4">
        <section className="flex min-w-0 flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_12px_28px_-14px_rgba(28,25,23,0.12),inset_0_1px_0_0_rgba(255,255,255,0.8)] sm:p-6 lg:col-span-3">
          <SectionHeading icon={Activity}>
            Check volume over time, by tier
          </SectionHeading>
          <div className="mt-4 flex-1">
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

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <StatCard
            icon={Activity}
            label="Checks run"
            value={<CountUp value={data.stats.totalChecks} />}
          />
          <StatCard
            icon={CheckCircle2}
            label="Confirmed"
            value={<CountUp value={data.stats.confirmedCases} />}
            sub="Seed + shared + reported"
          />
          <div className="col-span-2 lg:col-span-1">
            <StatCard
              icon={TrendingUp}
              label="Top this week"
              value={
                <span className="text-lg">
                  {data.stats.topCategoryThisWeek
                    ? categoryLabels[data.stats.topCategoryThisWeek]
                    : "—"}
                </span>
              }
            />
          </div>
        </div>
      </div>

      {/* Techniques + split — matched-width pair, same bento discipline */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="min-w-0 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading icon={Puzzle}>
            Top manipulation techniques
          </SectionHeading>
          <div className="mt-4">
            <TechniqueChart data={data.techniqueCounts} />
          </div>
        </section>
        <section className="min-w-0 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
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

      {/* Gallery — a list, deliberately not a grid: sequential content reads
          better as a stack than forced into cells. */}
      <section className="pt-6">
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
