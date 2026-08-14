import { getPrisma } from "@/lib/db";
import {
  LIGHT_REVEAL_COST,
  LIGHT_STARS_PER_ACTIVITY,
  lightRevealResponseSchema,
  milFactPublicSchema,
  type LightRevealResponse,
} from "@/lib/schema";
import { ensureUser } from "@/lib/users";

export function earnedLightStars(totalChecks: number, totalReports: number) {
  return (totalChecks + totalReports) * LIGHT_STARS_PER_ACTIVITY;
}

export function availableLightStars(earned: number, factsRevealed: number) {
  return Math.max(0, earned - factsRevealed * LIGHT_REVEAL_COST);
}

/** Opens one previously unseen reviewed fact for the authenticated user. */
export async function revealLightFact(
  clerkId: string,
): Promise<LightRevealResponse> {
  const prisma = getPrisma();
  const userId = await ensureUser(clerkId);

  return prisma.$transaction(async (tx) => {
    // Serialize one user's blind-box opens so parallel clicks cannot double-spend.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;

    const [user, factsRevealed] = await Promise.all([
      tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { totalChecks: true, totalReports: true },
      }),
      tx.lightReveal.count({ where: { userId } }),
    ]);
    const earned = earnedLightStars(user.totalChecks, user.totalReports);
    const stars = availableLightStars(earned, factsRevealed);

    if (stars < LIGHT_REVEAL_COST) {
      return lightRevealResponseSchema.parse({
        ok: false,
        stars,
        factsRevealed,
        fact: null,
        reason: "insufficient_stars",
      });
    }

    const candidates = await tx.milFact.findMany({
      where: {
        reviewed: true,
        reveals: { none: { userId } },
      },
      select: { id: true, category: true, fact: true, source: true },
    });

    if (candidates.length === 0) {
      return lightRevealResponseSchema.parse({
        ok: false,
        stars,
        factsRevealed,
        fact: null,
        reason: "no_facts_available",
      });
    }

    const fact = candidates[Math.floor(Math.random() * candidates.length)]!;
    await tx.lightReveal.create({ data: { userId, factId: fact.id } });

    return lightRevealResponseSchema.parse({
      ok: true,
      stars: stars - LIGHT_REVEAL_COST,
      factsRevealed: factsRevealed + 1,
      fact: milFactPublicSchema.parse(fact),
      reason: null,
    });
  });
}
