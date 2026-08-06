import {
  ConfirmationSource,
  ReportEventType,
  type Technique,
} from "@prisma/client";

import { getPrisma } from "@/lib/db";
import { toVectorLiteral } from "@/lib/embedding";
import type {
  AnalysisResult,
  SimilarCase,
  Source,
} from "@/lib/schema";

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
 * Searches only shared reports and reviewed seed cases. The model's tier is
 * already fixed before this retrieval runs, so similarity cannot change it.
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

/**
 * Persists only the structured model output and its structured-summary vector.
 * The caller never provides raw text, images, or an Eve session identifier.
 */
export async function createReport({
  source,
  analysis,
  embedding,
  submittedByClerkId,
  confirmationSource,
}: {
  source: Source;
  analysis: AnalysisResult;
  embedding: number[];
  submittedByClerkId: string;
  confirmationSource: ConfirmationSource | null;
}) {
  const prisma = getPrisma();
  const isShared = confirmationSource !== null;
  const report = await prisma.report.create({
    data: {
      source,
      platform: analysis.platform,
      category: analysis.category,
      claims: analysis.claims,
      techniques: analysis.techniques,
      tier: analysis.tier,
      riskScore: analysis.riskScore,
      explanationEn: analysis.explanationEn,
      moneyRequested: analysis.moneyRequested,
      amountVnd: analysis.amountVnd === null ? null : BigInt(analysis.amountVnd),
      isShared,
      confirmationSource,
      submittedByClerkId,
    },
  });

  await prisma.$executeRaw`
    UPDATE "reports"
    SET "embedding" = ${toVectorLiteral(embedding)}::vector
    WHERE "id" = ${report.id}
  `;

  await prisma.reportEvent.create({
    data: {
      reportId: report.id,
      type:
        confirmationSource === ConfirmationSource.user_reported
          ? ReportEventType.user_reported
          : ReportEventType.analysis_created,
      actorClerkId: submittedByClerkId,
    },
  });

  return report.id;
}

/** Applies an explicit user or warning-tier attestation to an existing report. */
export async function publishReport({
  reportId,
  submittedByClerkId,
  confirmationSource,
}: {
  reportId: string;
  submittedByClerkId: string;
  confirmationSource: ConfirmationSource;
}) {
  const prisma = getPrisma();
  const report = await prisma.report.findFirst({
    where: { id: reportId, submittedByClerkId },
    select: { id: true, tier: true },
  });
  if (!report) throw new Error("Report not found.");
  if (
    confirmationSource === ConfirmationSource.ai_detected &&
    report.tier !== "warning"
  ) {
    throw new Error("Only warning-tier reports can be shared automatically.");
  }

  await prisma.report.update({
    where: { id: report.id },
    data: { isShared: true, confirmationSource },
  });
  const eventType =
    confirmationSource === ConfirmationSource.user_reported
      ? ReportEventType.user_reported
      : ReportEventType.shared;
  await prisma.reportEvent.upsert({
    where: {
      reportId_type: { reportId: report.id, type: eventType },
    },
    create: {
      reportId: report.id,
      type: eventType,
      actorClerkId: submittedByClerkId,
    },
    update: {},
  });
}
