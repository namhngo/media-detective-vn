import { auth } from "@clerk/nextjs/server";

import { revealLightFact } from "@/lib/light-reveals";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return Response.json(await revealLightFact(userId));
  } catch (error) {
    console.error("Light fact reveal failed", error);
    return Response.json(
      { error: "Could not reveal a fact right now." },
      { status: 502 },
    );
  }
}
