import { ReportEventType } from "@prisma/client";

import { getPrisma } from "@/lib/db";
import {
  availableLightStars,
  completedActivityCounts,
  earnedLightStars,
} from "@/lib/light-reveals";
import {
  LIGHT_REVEAL_COST,
  LIGHT_STARS_PER_ACTIVITY,
  type ActivityDay,
  type ActivityResponse,
} from "@/lib/schema";

/** 53 weeks — the width of the contribution grid. */
const WINDOW_DAYS = 371;

type PrismaLike = ReturnType<typeof getPrisma>;

/**
 * Reveal count, degraded to 0 on any failure. Reading the prize ledger must
 * never be able to take the whole activity panel down with it.
 */
async function countLightReveals(prisma: PrismaLike, clerkId: string) {
  try {
    if (!prisma.lightReveal) {
      throw new Error(
        "Prisma Client has no lightReveal delegate — run `prisma generate` and restart.",
      );
    }
    return await prisma.lightReveal.count({ where: { user: { clerkId } } });
  } catch (error) {
    console.error("Light reveal count failed", error);
    return 0;
  }
}

/**
 * The signed-in caller's own activity. Cached aggregate metrics come from the
 * user row, while completed actions and the prize balance use immutable events.
 */
export async function getUserActivity(
  clerkId: string,
): Promise<ActivityResponse> {
  const prisma = getPrisma();

  const [user, days, factsRevealed, earnedEvents] = await Promise.all([
    prisma.user.upsert({
      where: { clerkId },
      create: { clerkId },
      update: {},
      select: {
        publicContributions: true,
        currentStreak: true,
        longestStreak: true,
        categoriesSeen: true,
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
    // The prize ledger is secondary: the contribution grid must never disappear
    // because the reveal feature is unavailable. A stale bundled Prisma Client
    // can leave the delegate itself undefined, so probe before calling it.
    countLightReveals(prisma, clerkId),
    prisma.reportEvent.groupBy({
      by: ["type"],
      where: {
        actorClerkId: clerkId,
        type: {
          in: [
            ReportEventType.analysis_created,
            ReportEventType.user_reported,
          ],
        },
      },
      _count: { _all: true },
    }),
  ]);
  const { checks: completedChecks, reports: completedReports } =
    completedActivityCounts(earnedEvents);
  const earned = earnedLightStars(completedChecks, completedReports);

  return {
    days,
    stats: {
      totalActions: completedChecks + completedReports,
      publicContributions: user.publicContributions,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      categoriesSeen: user.categoriesSeen,
    },
    light: {
      stars: availableLightStars(earned, factsRevealed),
      earned,
      factsRevealed,
      starsPerActivity: LIGHT_STARS_PER_ACTIVITY,
      revealCost: LIGHT_REVEAL_COST,
    },
  };
}
