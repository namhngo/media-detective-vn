import { getPrisma } from "@/lib/db";
import { ensureUser } from "@/lib/users";
import { STAR_PLAY_COST, type MilFactPublic, type StarGamePlayResponse } from "@/lib/schema";

type RandomFactRow = {
  id: string;
  category: string;
  fact: string;
  source: string;
};

/**
 * Spends STAR_PLAY_COST stars for a random reviewed fact. Atomic: the balance
 * check and decrement happen in one guarded UPDATE, so two concurrent plays
 * can never both succeed off the same balance. Never touches totalChecks,
 * totalReports, or any other lifetime counter — spending only ever moves
 * starBalance, which is why it can safely go up and down.
 */
export async function playStarGame(clerkId: string): Promise<StarGamePlayResponse> {
  const prisma = getPrisma();
  const userId = await ensureUser(clerkId);

  return prisma.$transaction(async (tx) => {
    const [fact] = await tx.$queryRaw<RandomFactRow[]>`
      SELECT "id", "category", "fact", "source"
      FROM "mil_facts"
      WHERE "reviewed" = true
      ORDER BY random()
      LIMIT 1
    `;

    if (!fact) {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { starBalance: true },
      });
      return {
        ok: false,
        balance: user.starBalance,
        fact: null,
        reason: "no_facts_available" as const,
      };
    }

    const spent = await tx.user.updateMany({
      where: { id: userId, starBalance: { gte: STAR_PLAY_COST } },
      data: { starBalance: { decrement: STAR_PLAY_COST } },
    });

    if (spent.count === 0) {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { starBalance: true },
      });
      return {
        ok: false,
        balance: user.starBalance,
        fact: null,
        reason: "insufficient_balance" as const,
      };
    }

    await tx.starEvent.create({
      data: { userId, delta: -STAR_PLAY_COST, factId: fact.id },
    });

    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { starBalance: true },
    });

    const publicFact: MilFactPublic = {
      id: fact.id,
      category: fact.category as MilFactPublic["category"],
      fact: fact.fact,
      source: fact.source,
    };

    return { ok: true, balance: user.starBalance, fact: publicFact, reason: null };
  });
}
