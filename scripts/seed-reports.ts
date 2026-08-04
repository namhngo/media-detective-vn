import { config } from "dotenv";

config({ path: ".env.local" });

import {
  Category,
  ConfirmationSource,
  Platform,
  Source,
  Technique,
  Tier,
} from "@prisma/client";

import { getPrisma } from "../src/lib/db";
import { createEmbeddings, toVectorLiteral } from "../src/lib/embedding";
import { seedGallery } from "../src/lib/mock";
import { createStructuredSummary } from "../src/lib/structured-summary";

function assertStagingEnvironment() {
  if (process.env.DATABASE_BRANCH !== "staging") {
    throw new Error(
      "Refusing to seed: set DATABASE_BRANCH=staging in .env.local. Seeds must never be inserted into production by accident.",
    );
  }
}

async function main() {
  assertStagingEnvironment();

  const prisma = getPrisma();
  const summaries = seedGallery.map((seed) =>
    createStructuredSummary({
      category: seed.category,
      platform: seed.platform,
      claims: seed.claims,
      techniques: seed.techniques,
      explanationEn: seed.explanationEn,
    }),
  );
  const embeddings = await createEmbeddings(summaries);

  for (const [index, seed] of seedGallery.entries()) {
    const data = {
      createdAt: new Date(seed.createdAt),
      source: seed.source as Source,
      platform: seed.platform as Platform,
      category: seed.category as Category,
      claims: seed.claims,
      techniques: seed.techniques as Technique[],
      tier: seed.tier as Tier,
      riskScore: seed.tier === "warning" ? 80 : 20,
      explanationEn: seed.explanationEn,
      moneyRequested: seed.moneyRequested,
      amountVnd: seed.amountVnd === null ? null : BigInt(seed.amountVnd),
      location: seed.location,
      isSeed: true,
      isShared: false,
      confirmationSource: null as ConfirmationSource | null,
      submittedByClerkId: null,
      sourceCitation: seed.sourceCitation,
      agentSessionId: null,
    };

    await prisma.report.upsert({
      where: { id: seed.id },
      create: { id: seed.id, ...data },
      update: data,
    });

    await prisma.$executeRaw`
      UPDATE "reports"
      SET "embedding" = ${toVectorLiteral(embeddings[index])}::vector
      WHERE "id" = ${seed.id}
    `;
  }

  console.log(`Seeded ${seedGallery.length} structured cases into staging.`);
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
