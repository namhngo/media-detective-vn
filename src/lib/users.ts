import type { PrismaClient } from "@prisma/client";

import { getPrisma } from "@/lib/db";

type Client = PrismaClient | Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];

type StreakRow = { current: number; longest: number };
type ActiveDayRow = { day: Date };

/** Upserts the app user for a Clerk identity and returns its row id. */
export async function ensureUser(clerkId: string, client?: Client) {
  const prisma = client ?? getPrisma();
  const user = await prisma.user.upsert({
    where: { clerkId },
    create: { clerkId },
    update: {},
    select: { id: true },
  });
  return user.id;
}

/**
 * Streaks from the source of truth: distinct active days, walked backwards.
 * Yesterday still counts so a streak is not reported broken before today's use.
 */
function streaksFromDays(days: Date[]): StreakRow {
  const keys = [...new Set(days.map((d) => d.toISOString().slice(0, 10)))]
    .sort()
    .reverse();
  if (keys.length === 0) return { current: 0, longest: 0 };

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < keys.length; i++) {
    const previous = new Date(`${keys[i - 1]!}T00:00:00Z`);
    const expected = new Date(previous);
    expected.setUTCDate(previous.getUTCDate() - 1);
    if (keys[i] === iso(expected)) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  let current = 0;
  if (keys[0] === iso(today) || keys[0] === iso(yesterday)) {
    current = 1;
    for (let i = 1; i < keys.length; i++) {
      const previous = new Date(`${keys[i - 1]!}T00:00:00Z`);
      const expected = new Date(previous);
      expected.setUTCDate(previous.getUTCDate() - 1);
      if (keys[i] !== iso(expected)) break;
      current += 1;
    }
  }

  return { current, longest: Math.max(longest, current) };
}

/**
 * Rebuilds every user-facing activity counter from reports/report_events.
 * Idempotent, so it doubles as the reconciliation job if a write path fails.
 */
export async function recomputeUserStats(clerkId: string) {
  const prisma = getPrisma();
  const userId = await ensureUser(clerkId);

  const [eventCounts, activeDays] = await Promise.all([
    prisma.reportEvent.groupBy({
      by: ["type"],
      where: { actorClerkId: clerkId },
      _count: { _all: true },
    }),
    prisma.$queryRaw<ActiveDayRow[]>`
      SELECT DISTINCT date_trunc('day', "created_at")::date AS "day"
      FROM "report_events"
      WHERE "actor_clerk_id" = ${clerkId}
      ORDER BY 1 DESC
    `,
  ]);

  const distinctCategories = await prisma.report.findMany({
    where: { submittedByClerkId: clerkId },
    select: { category: true },
    distinct: ["category"],
  });

  const publicContributions = await prisma.report.count({
    where: { submittedByClerkId: clerkId, isShared: true },
  });

  const countOf = (type: string) =>
    eventCounts.find((row) => row.type === type)?._count._all ?? 0;

  const { current, longest } = streaksFromDays(activeDays.map((r) => r.day));

  const metrics = {
    totalChecks: countOf("analysis_created"),
    totalReports: countOf("user_reported"),
    publicContributions,
    currentStreak: current,
    categoriesSeen: distinctCategories.length,
  };

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalChecks: metrics.totalChecks,
      totalReports: metrics.totalReports,
      publicContributions: metrics.publicContributions,
      currentStreak: current,
      longestStreak: longest,
      categoriesSeen: metrics.categoriesSeen,
      lastActiveOn: activeDays[0]?.day ?? null,
    },
  });

  return { userId, metrics };
}
