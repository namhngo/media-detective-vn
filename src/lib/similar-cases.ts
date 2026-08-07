import type { Technique } from "@prisma/client";

import { getPrisma } from "@/lib/db";
import { toVectorLiteral } from "@/lib/embedding";
import type { SimilarCase } from "@/lib/schema";

const SIMILARITY_FLOOR = 0.78;
const SIMILAR_CASE_LIMIT = 3;

type SimilarCaseRow = {
  id: string;
  category: SimilarCase["category"];
  techniques: Technique[];
  tier: SimilarCase["tier"];
  explanationEn: string;
  similarity: number;
  confirmationSource: SimilarCase["confirmationSource"];
  sourceCitation: string | null;
};

/**
 * Retrieves context only after the model has fixed its tier. Weak matches are
 * omitted rather than used to inflate a new assessment.
 */
export async function findSimilarCases(embedding: number[]): Promise<SimilarCase[]> {
  const vector = toVectorLiteral(embedding);
  const prisma = getPrisma();
  const rows = await prisma.$queryRaw<SimilarCaseRow[]>`
    SELECT
      "id",
      "category",
      "techniques",
      "tier",
      "explanation_en" AS "explanationEn",
      1 - ("embedding" <=> ${vector}::vector) AS "similarity",
      "confirmation_source" AS "confirmationSource",
      "source_citation" AS "sourceCitation"
    FROM "reports"
    WHERE "embedding" IS NOT NULL
      AND ("is_seed" = true OR "is_shared" = true)
      AND 1 - ("embedding" <=> ${vector}::vector) >= ${SIMILARITY_FLOOR}
    ORDER BY "embedding" <=> ${vector}::vector
    LIMIT ${SIMILAR_CASE_LIMIT}
  `;

  return rows.map((row) => ({
    ...row,
    techniques: row.techniques,
    similarity: Number(row.similarity),
  }));
}
