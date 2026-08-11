import { getPrisma } from "@/lib/db";
import type { ActivityBadge, ActivityDay, ActivityResponse } from "@/lib/schema";

/** 53 weeks — the width of the contribution grid. */
const WINDOW_DAYS = 371;

type EventTypeRow = { type: string; count: number };
type ReportAggregateRow = { publicContributions: number; categoriesSeen: number };

/**
 * Counts consecutive active days ending today or yesterday. Yesterday still
 * counts so a streak does not appear broken before the user acts today.
 */
function currentStreak(days: ActivityDay[]) {
  const active = new Set(days.filter((d) => d.count > 0).map((d) => d.date));
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  const isoDay = (date: Date) => date.toISOString().slice(0, 10);
  if (!active.has(isoDay(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!active.has(isoDay(cursor))) return 0;
  }

  let streak = 0;
  while (active.has(isoDay(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function buildBadges({
  totalChecks,
  reportsFiled,
  publicContributions,
  streak,
  categoriesSeen,
}: {
  totalChecks: number;
  reportsFiled: number;
  publicContributions: number;
  streak: number;
  categoriesSeen: number;
}): ActivityBadge[] {
  const badge = (
    id: ActivityBadge["id"],
    label: string,
    description: string,
    progress: number,
    target: number,
  ): ActivityBadge => ({
    id,
    label,
    description,
    progress: Math.min(progress, target),
    target,
    earned: progress >= target,
  });

  return [
    badge(
      "first_check",
      "First check",
      "Ran your first content check.",
      totalChecks,
      1,
    ),
    badge(
      "watchful_10",
      "Watchful",
      "Checked 10 pieces of content.",
      totalChecks,
      10,
    ),
    badge(
      "watchful_50",
      "Vigilant",
      "Checked 50 pieces of content.",
      totalChecks,
      50,
    ),
    badge(
      "first_report",
      "First report",
      "Reported a case from your own experience.",
      reportsFiled,
      1,
    ),
    badge(
      "guardian_5",
      "Community guardian",
      "Added 5 cases to the public library.",
      publicContributions,
      5,
    ),
    badge(
      "streak_7",
      "Streak keeper",
      "Stayed active 7 days in a row.",
      streak,
      7,
    ),
    badge(
      "pattern_spotter",
      "Pattern spotter",
      "Encountered 5 different scam categories.",
      categoriesSeen,
      5,
    ),
  ];
}

/**
 * The signed-in caller's own activity. Scoped by their Clerk id at the query
 * level — this never reads or returns another user's rows.
 */
export async function getUserActivity(
  clerkId: string,
): Promise<ActivityResponse> {
  const prisma = getPrisma();

  const [days, eventTypes, aggregate] = await Promise.all([
    prisma.$queryRaw<ActivityDay[]>`
      SELECT
        to_char(date_trunc('day', "created_at"), 'YYYY-MM-DD') AS "date",
        COUNT(*)::int AS "count"
      FROM "report_events"
      WHERE "actor_clerk_id" = ${clerkId}
        AND "created_at" >= now() - make_interval(days => ${WINDOW_DAYS})
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.$queryRaw<EventTypeRow[]>`
      SELECT "type"::text AS "type", COUNT(*)::int AS "count"
      FROM "report_events"
      WHERE "actor_clerk_id" = ${clerkId}
      GROUP BY 1
    `,
    prisma.$queryRaw<ReportAggregateRow[]>`
      SELECT
        COUNT(*) FILTER (WHERE "is_shared" = true)::int AS "publicContributions",
        COUNT(DISTINCT "category")::int AS "categoriesSeen"
      FROM "reports"
      WHERE "submitted_by_clerk_id" = ${clerkId}
    `,
  ]);

  const eventCount = (type: string) =>
    eventTypes.find((row) => row.type === type)?.count ?? 0;

  const totalChecks = eventCount("analysis_created");
  const reportsFiled = eventCount("user_reported");
  const totalActions = eventTypes.reduce((sum, row) => sum + row.count, 0);
  const publicContributions = aggregate[0]?.publicContributions ?? 0;
  const categoriesSeen = aggregate[0]?.categoriesSeen ?? 0;
  const streak = currentStreak(days);

  return {
    days,
    stats: {
      totalActions,
      publicContributions,
      currentStreak: streak,
      categoriesSeen,
    },
    badges: buildBadges({
      totalChecks,
      reportsFiled,
      publicContributions,
      streak,
      categoriesSeen,
    }),
  };
}
