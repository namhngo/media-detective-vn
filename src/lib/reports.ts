import { ConfirmationSource, ReportEventType } from "@prisma/client";

import { getPrisma } from "@/lib/db";
import { toVectorLiteral } from "@/lib/embedding";
import type { AnalysisResult, Source } from "@/lib/schema";
import { ensureUser, recomputeUserStats } from "@/lib/users";

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
  const userId = await ensureUser(submittedByClerkId);
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
      userId,
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
      userId,
    },
  });

  // Counters and badge awards follow the event that earned them.
  await recomputeUserStats(submittedByClerkId);

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
  const userId = await ensureUser(submittedByClerkId);
  await prisma.reportEvent.upsert({
    where: {
      reportId_type: { reportId: report.id, type: eventType },
    },
    create: {
      reportId: report.id,
      type: eventType,
      actorClerkId: submittedByClerkId,
      userId,
    },
    update: {},
  });

  await recomputeUserStats(submittedByClerkId);
}
