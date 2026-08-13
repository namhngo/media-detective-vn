import { readFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });

import { getPrisma } from "../src/lib/db";

type MilFactRow = {
  id: string;
  category:
    | "source-verification"
    | "emotional-manipulation"
    | "technical-ai-literacy"
    | "sharing-responsibility";
  fact: string;
  source: string;
  reviewed: boolean;
};

const FACTS_PATH = new URL("../content/mil-facts.json", import.meta.url);

/**
 * Manual command only — never run by the extraction step or by CI. Upserts
 * every row in content/mil-facts.json by id, so it is always safe to re-run
 * after new facts are appended without duplicating existing rows.
 *
 * `reviewed` is read straight from the file: this script never flips it.
 * Only a human editing content/mil-facts.json decides what becomes eligible
 * for /api/dashboard/play to serve.
 */
async function main() {
  const rows: MilFactRow[] = JSON.parse(readFileSync(FACTS_PATH, "utf8"));

  const prisma = getPrisma();
  for (const row of rows) {
    await prisma.milFact.upsert({
      where: { id: row.id },
      create: row,
      update: {
        category: row.category,
        fact: row.fact,
        source: row.source,
        reviewed: row.reviewed,
      },
    });
  }

  const reviewedCount = rows.filter((row) => row.reviewed).length;
  console.log(
    `Seeded ${rows.length} MIL facts (${reviewedCount} reviewed, ${rows.length - reviewedCount} pending review) into ${process.env.DATABASE_BRANCH}.`,
  );
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
