"use client";
import {
  Activity,
  CheckCircle2,
  TrendingUp,
  Puzzle,
  Users2,
  FileSearch,
  Flame,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { BadgeShelf } from "@/components/badge-shelf";
import { ContributionGraph } from "@/components/contribution-graph";
import { CountUp } from "@/components/count-up";
import {
  ConfirmationSplit,
  TechniqueChart,
  TrendChart,
} from "@/components/dashboard-charts";
import { GalleryCard } from "@/components/gallery-card";
import { categoryLabels } from "@/lib/tier";
import type { ActivityResponse, DashboardResponse } from "@/lib/schema";

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
    <div className="torch-panel relative flex flex-col justify-center overflow-hidden rounded-2xl px-5 py-4">
      <div
        aria-hidden
        className="absolute -right-7 -top-8 size-24 rounded-full bg-primary/10 blur-2xl"
      />
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
      <Icon className="size-4 text-primary/80" />
      {children}
    </h2>
  );
}

export function DashboardView({
  data,
  activity,
}: {
  data: DashboardResponse;
  activity: ActivityResponse | null;
}) {

  return (
    <div className="space-y-5">
      {/* Your activity — private to the signed-in user, never in the library */}
      {activity && (
        <section className="torch-panel relative overflow-hidden rounded-2xl p-5 sm:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeading icon={Sparkles}>Your activity</SectionHeading>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <LockKeyhole className="size-3" />
              Only you can see this
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="torch-inset rounded-xl px-3.5 py-3">
              <p className="font-mono text-xl font-semibold">
                <CountUp value={activity.stats.totalActions} />
              </p>
              <p className="text-xs text-muted-foreground">your actions</p>
            </div>
            <div className="torch-inset rounded-xl px-3.5 py-3">
              <p className="font-mono text-xl font-semibold">
                <CountUp value={activity.stats.publicContributions} />
              </p>
              <p className="text-xs text-muted-foreground">
                added to the library
              </p>
            </div>
            <div className="torch-inset rounded-xl px-3.5 py-3">
              <p className="flex items-center gap-1.5 font-mono text-xl font-semibold">
                <Flame className="size-4 text-tier-caution" />
                <CountUp value={activity.stats.currentStreak} />
              </p>
              <p className="text-xs text-muted-foreground">
                day streak · best {activity.stats.longestStreak}
              </p>
            </div>
            <div className="torch-inset rounded-xl px-3.5 py-3">
              <p className="font-mono text-xl font-semibold">
                <CountUp value={activity.stats.categoriesSeen} />
              </p>
              <p className="text-xs text-muted-foreground">categories seen</p>
            </div>
          </div>

          <div className="mt-5">
            <ContributionGraph days={activity.days} />
          </div>

          {activity.stats.totalActions === 0 ? (
            <p className="torch-inset mt-4 rounded-xl px-3.5 py-3 text-sm text-muted-foreground">
              No activity yet. Run your first check — your grid and first badges
              appear here.
            </p>
          ) : (
            <>
              <div className="mt-6 border-t border-border/70 pt-5">
                <SectionHeading icon={CheckCircle2}>Badges earned</SectionHeading>
                <div className="mt-4">
                  <BadgeShelf
                    badges={activity.badges.filter((b) => b.earned)}
                  />
                </div>
              </div>
            </>
          )}
        </section>
      )}
      {!activity && (
        <section className="torch-panel rounded-2xl px-5 py-4 text-sm text-muted-foreground">
          Your private activity is temporarily unavailable. Community trends are
          still up to date below.
        </section>
      )}

      {/* Bento row: the trend is the hero cell — data-dense, non-sequential
          content is exactly where a real hierarchy grid earns its keep. */}
      <div className="grid gap-4 lg:grid-cols-4">
        <section className="torch-panel flex min-w-0 flex-col rounded-2xl p-5 sm:p-6 lg:col-span-3">
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
        <section className="torch-panel min-w-0 rounded-2xl p-5 sm:p-6">
          <SectionHeading icon={Puzzle}>
            Top manipulation techniques
          </SectionHeading>
          <div className="mt-4">
            <TechniqueChart data={data.techniqueCounts} />
          </div>
        </section>
        <section className="torch-panel min-w-0 rounded-2xl p-5 sm:p-6">
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
      <section className="border-t border-white/10 pt-7">
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
