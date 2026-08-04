import { mockDetectResponse, sleep } from "@/lib/mock";
import { reportRequestSchema, reportResponseSchema } from "@/lib/schema";

/**
 * MOCK STUB — backend phase: require a signed-in session (anonymous auth),
 * run the SAME extract+analyze pipeline as /api/detect, then publish
 * immediately on the user's attestation (confirmation_source="user_reported").
 * The AI's independent tier is returned for the transparency badge.
 */
export async function POST(request: Request) {
  const parsed = reportRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  await sleep(1400);

  const { analysis } = mockDetectResponse(
    parsed.data.text ?? parsed.data.imageBase64 ?? "",
  );
  const response = {
    reportId: `mock-${Date.now()}`,
    analysis,
    published: true,
  };
  return Response.json(reportResponseSchema.parse(response));
}
