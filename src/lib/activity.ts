import { BADGE_BY_KIND, BADGE_DEFINITIONS } from "@/lib/badges";
import { getPrisma } from "@/lib/db";
import type { ActivityBadge, ActivityDay, ActivityResponse } from "@/lib/schema";

/** 53 weeks — the width of the contribution grid. */
const WINDOW_DAYS = 371;

/**
 * The signed-in caller's own activity. Counters and badge awards come from the
 * user row (O(1) read); the contribution grid comes from report_events, which
 * stays the source of truth so the grid can never drift from reality.
 */
export async function getUserActivity(
  clerkId: string,
): Promise<ActivityResponse> {
  const prisma = getPrisma();

  const [user, days] = await Promise.all([
    prisma.user.upsert({
      where: { clerkId },
      create: { clerkId },
      update: {},
      select: {
        totalChecks: true,
        totalReports: true,
        publicContributions: true,
        currentStreak: true,
        longestStreak: true,
        categoriesSeen: true,
        badges: {
          select: { badge: true, earnedAt: true },
          orderBy: { earnedAt: "asc" },
        },
      },
    }),
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
  ]);

  const earnedAtByKind = new Map(
    user.badges.map((row) => [row.badge, row.earnedAt.toISOString()]),
  );

  const metricValue = {
    totalChecks: user.totalChecks,
    totalReports: user.totalReports,
    publicContributions: user.publicContributions,
    currentStreak: user.currentStreak,
    categoriesSeen: user.categoriesSeen,
  };

  const badges: ActivityBadge[] = BADGE_DEFINITIONS.map((definition) => {
    const earnedAt = earnedAtByKind.get(definition.kind) ?? null;
    const progress = Math.min(
      metricValue[definition.metric],
      definition.target,
    );
    return {
      id: definition.kind,
      label: definition.label,
      description: definition.description,
      earned: earnedAt !== null,
      earnedAt,
      progress,
      target: definition.target,
    };
  });

  return {
    days,
    stats: {
      totalActions: user.totalChecks + user.totalReports,
      publicContributions: user.publicContributions,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      categoriesSeen: user.categoriesSeen,
    },
    badges,
  };
}

export { BADGE_BY_KIND };
