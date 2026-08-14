import { readFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });

import { getPrisma } from "../src/lib/db";
import type { MilFactCategory } from "../src/lib/schema";

type MilFactRow = {
  id: string;
  category: MilFactCategory;
  fact: string;
  source: string;
  reviewed: boolean;
};

const factsPath = new URL("../content/mil-facts.json", import.meta.url);

/** Upserts curated field notes; the JSON file is the human review source. */
async function main() {
  const rows: MilFactRow[] = JSON.parse(readFileSync(factsPath, "utf8"));
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

  const reviewed = rows.filter((row) => row.reviewed).length;
  console.log(`Seeded ${rows.length} MIL facts (${reviewed} reviewed).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
