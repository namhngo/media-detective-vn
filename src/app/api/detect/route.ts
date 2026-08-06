import { auth } from "@clerk/nextjs/server";

import { analyzeWithEve } from "@/lib/eve-analysis";
import { createEmbeddings } from "@/lib/embedding";
import { createReport, findSimilarCases } from "@/lib/reports";
import { detectRequestSchema, detectResponseSchema } from "@/lib/schema";
import { createStructuredSummary } from "@/lib/structured-summary";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = detectRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const analysis = await analyzeWithEve({
      request,
      source: parsed.data.source,
      text: parsed.data.text,
    });
    const summary = createStructuredSummary(analysis);
    const [embedding] = await createEmbeddings([summary]);
    const similarCases = await findSimilarCases(embedding);
    const reportId = await createReport({
      source: parsed.data.source,
      analysis,
      embedding,
      submittedByClerkId: userId,
      confirmationSource: null,
    });

    return Response.json(
      detectResponseSchema.parse({
        reportId,
        analysis,
        similarCases,
        sharePrompted: analysis.tier === "warning",
      }),
    );
  } catch (error) {
    console.error("Detect analysis failed", error);
    return Response.json(
      { error: "Analysis could not be completed. Nothing was stored." },
      { status: 502 },
    );
  }
}
