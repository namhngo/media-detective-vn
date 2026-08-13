import { auth } from "@clerk/nextjs/server";

import { playStarGame } from "@/lib/star-game";
import { starGamePlayResponseSchema } from "@/lib/schema";

/** No request body — the cost is fixed and the fact is chosen server-side. */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await playStarGame(userId);
    return Response.json(starGamePlayResponseSchema.parse(result));
  } catch (error) {
    console.error("Star game play failed", error);
    return Response.json({ error: "Could not play right now." }, { status: 502 });
  }
}
