import { auth } from "@clerk/nextjs/server";

import { getUserActivity } from "@/lib/activity";
import { activityResponseSchema } from "@/lib/schema";

/**
 * Private per-user activity. The Clerk session is the only source of identity —
 * the caller can never request another user's activity.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const activity = await getUserActivity(userId);
    return Response.json(activityResponseSchema.parse(activity));
  } catch (error) {
    console.error("Activity lookup failed", error);
    return Response.json(
      { error: "Activity could not be loaded." },
      { status: 502 },
    );
  }
}
