import { auth } from "@clerk/nextjs/server";
import { ConfirmationSource } from "@prisma/client";

import { publishReport } from "@/lib/reports";
import {
  reportPublishRequestSchema,
  reportPublishResponseSchema,
} from "@/lib/schema";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = reportPublishRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await publishReport({
      reportId: parsed.data.reportId,
      submittedByClerkId: userId,
      confirmationSource: ConfirmationSource.user_reported,
    });
    return Response.json(reportPublishResponseSchema.parse({ ok: true }));
  } catch (error) {
    console.error("Report publishing failed", error);
    return Response.json({ error: "Report could not be published." }, { status: 422 });
  }
}
