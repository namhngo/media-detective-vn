"use client";
import Link from "next/link";
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
import { categoryLabel } from "@/lib/tier";
import { useI18n } from "@/components/i18n-provider";
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
  const { language, t } = useI18n();

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
            <SectionHeading icon={Sparkles}>{t("dashboardActivity")}</SectionHeading>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <LockKeyhole className="size-3" />
              {t("dashboardOnlyYou")}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="torch-inset rounded-xl px-3.5 py-3">
              <p className="font-mono text-xl font-semibold">
                <CountUp value={activity.stats.totalActions} />
              </p>
              <p className="text-xs text-muted-foreground">{t("dashboardActions")}</p>
            </div>
            <div className="torch-inset rounded-xl px-3.5 py-3">
              <p className="font-mono text-xl font-semibold">
                <CountUp value={activity.stats.publicContributions} />
              </p>
              <p className="text-xs text-muted-foreground">
                {t("dashboardAdded")}
              </p>
            </div>
            <div className="torch-inset rounded-xl px-3.5 py-3">
              <p className="flex items-center gap-1.5 font-mono text-xl font-semibold">
                <Flame className="size-4 text-tier-caution" />
                <CountUp value={activity.stats.currentStreak} />
              </p>
              <p className="text-xs text-muted-foreground">
                {t("dashboardStreak")} {activity.stats.longestStreak}
              </p>
            </div>
            <div className="torch-inset rounded-xl px-3.5 py-3">
              <p className="font-mono text-xl font-semibold">
                <CountUp value={activity.stats.categoriesSeen} />
              </p>
              <p className="text-xs text-muted-foreground">{t("dashboardCategories")}</p>
            </div>
          </div>

          <div className="mt-5">
            <ContributionGraph days={activity.days} />
          </div>
          <LearningLightBar totalActions={activity.stats.totalActions} />

          {activity.stats.totalActions === 0 ? (
            <p className="torch-inset mt-4 rounded-xl px-3.5 py-3 text-sm text-muted-foreground">
              {t("dashboardNoActivity")}
            </p>
          ) : (
            <>
              <div className="mt-6 border-t border-border/70 pt-5">
                <SectionHeading icon={CheckCircle2}>{t("dashboardBadges")}</SectionHeading>
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
          {t("dashboardUnavailable")}
        </section>
      )}

      {/* Bento row: the trend is the hero cell — data-dense, non-sequential
          content is exactly where a real hierarchy grid earns its keep. */}
      <div className="grid gap-4 lg:grid-cols-4">
        <section className="torch-panel flex min-w-0 flex-col rounded-2xl p-5 sm:p-6 lg:col-span-3">
          <SectionHeading icon={Activity}>
            {t("dashboardVolume")}
          </SectionHeading>
          <div className="mt-4 flex-1">
            <TrendChart data={data.trend} />
          </div>
          <div className="mt-2 flex justify-center gap-6 text-xs text-muted-foreground">
            <p>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-tier-watch" />
              {t("tierWatch")}
            </p>
            <p>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-tier-caution" />
              {t("tierCaution")}
            </p>
            <p>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-tier-warning" />
              {t("tierWarning")}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <StatCard
            icon={Activity}
            label={t("dashboardChecks")}
            value={<CountUp value={data.stats.totalChecks} />}
          />
          <StatCard
            icon={CheckCircle2}
            label={t("dashboardConfirmed")}
            value={<CountUp value={data.stats.confirmedCases} />}
            sub={t("dashboardConfirmedSub")}
          />
          <div className="col-span-2 lg:col-span-1">
            <StatCard
              icon={TrendingUp}
            label={t("dashboardTop")}
              value={
                <span className="text-lg">
                  {data.stats.topCategoryThisWeek
                    ? categoryLabel(data.stats.topCategoryThisWeek, language)
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
            {t("dashboardTechniques")}
          </SectionHeading>
          <div className="mt-4">
            <TechniqueChart data={data.techniqueCounts} />
          </div>
        </section>
        <section className="torch-panel min-w-0 rounded-2xl p-5 sm:p-6">
          <SectionHeading icon={Users2}>
            {t("dashboardSplit")}
          </SectionHeading>
          <div className="mt-4">
            <ConfirmationSplit data={data.confirmationSplit} />
          </div>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <p>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-primary" />
              {t("dashboardAiConfirmed")} ({data.confirmationSplit.aiDetected})
            </p>
            <p>
              <span className="mr-1.5 inline-block size-2 rounded-full bg-confirmed-user" />
              {t("dashboardSelfReported")} ({data.confirmationSplit.userReported})
            </p>
          </div>
        </section>
      </div>

      {/* Gallery — a list, deliberately not a grid: sequential content reads
          better as a stack than forced into cells. */}
      <section className="border-t border-white/10 pt-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <SectionHeading icon={FileSearch}>
            {t("dashboardLibrary")}
          </SectionHeading>
          <p className="text-xs text-muted-foreground">
            {t("dashboardLibraryNote")}
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

const BEAM_STAGE_THRESHOLDS = [0, 5, 15, 35, 70];

function beamStageForActions(totalActions: number) {
  let stage = 0;
  for (let index = 0; index < BEAM_STAGE_THRESHOLDS.length; index += 1) {
    if (totalActions >= BEAM_STAGE_THRESHOLDS[index]!) stage = index;
  }
  return stage;
}

function LearningLightBar({ totalActions }: { totalActions: number }) {
  const { t } = useI18n();
  const stage = beamStageForActions(totalActions);
  const stageKeys = [
    "dashboardBeamStage0",
    "dashboardBeamStage1",
    "dashboardBeamStage2",
    "dashboardBeamStage3",
    "dashboardBeamStage4",
  ] as const;
  const stageRanges = ["0-4", "5-14", "15-34", "35-69", "70+"];
  const nextThreshold = BEAM_STAGE_THRESHOLDS[stage + 1];
  const progress = ((stage + 1) / stageKeys.length) * 100;

  return (
    <div className="mt-5 border-t border-border/70 pt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            {t("dashboardLightBar")}
            <span className="text-primary">{t(stageKeys[stage])}</span>
            <details className="relative inline-block">
              <summary className="ml-0.5 flex size-4 cursor-pointer list-none items-center justify-center rounded-full border border-current text-[9px] text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                i
                <span className="sr-only">{t("dashboardLightInfo")}</span>
              </summary>
              <div className="absolute left-0 z-10 mt-2 w-64 rounded-xl border border-border bg-card p-3 text-left text-xs leading-relaxed font-normal text-muted-foreground normal-case shadow-xl">
                <p>{t("dashboardLightInfo")}</p>
                <ul className="mt-2 space-y-0.5 font-mono">
                  {stageKeys.map((key, index) => (
                    <li key={key} className="flex justify-between gap-3">
                      <span className={index === stage ? "text-primary" : undefined}>
                        {t(key)}
                      </span>
                      <span>{stageRanges[index]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t("dashboardLightNext")}</p>
        </div>
        <Link href="/learn" className="shrink-0 text-xs font-medium text-primary hover:underline">
          {t("dashboardOpenLearn")}
        </Link>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
        {stageKeys.map((key, index) => (
          <span key={key} className={index === stage ? "text-primary" : undefined}>
            {t(key)}
          </span>
        ))}
      </div>
      {nextThreshold !== undefined && (
        <p className="mt-2 text-right text-[11px] text-muted-foreground">
          {totalActions} / {nextThreshold} {t("dashboardActions")}
        </p>
      )}
    </div>
  );
}
