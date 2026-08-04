import { mockDetectResponse, sleep } from "@/lib/mock";
import { detectRequestSchema, detectResponseSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";

/**
 * MOCK STUB — backend phase will replace the internals with the eve agent run
 * (extract+analyze → find_similar_cases → save_report). The request/response
 * contract here is final; only the internals change.
 */
export async function POST(request: Request) {
  await auth.protect();
  const parsed = detectRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  await sleep(1400); // simulate analysis latency for realistic UI states

  const response = mockDetectResponse(
    parsed.data.text ?? parsed.data.imageBase64 ?? "",
  );
  // Parse on the way out so a drifting mock fails loudly in development.
  return Response.json(detectResponseSchema.parse(response));
}
