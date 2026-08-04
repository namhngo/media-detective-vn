import { sleep } from "@/lib/mock";
import { shareRequestSchema, shareResponseSchema } from "@/lib/schema";

/**
 * MOCK STUB — backend phase: verify the row's tier is "warning" SERVER-SIDE
 * (the Share gate lives here, never only in the UI), then set is_shared=true,
 * confirmation_source="ai_detected", and generate the case embedding.
 */
export async function POST(request: Request) {
  const parsed = shareRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  await sleep(500);
  return Response.json(shareResponseSchema.parse({ ok: true }));
}
