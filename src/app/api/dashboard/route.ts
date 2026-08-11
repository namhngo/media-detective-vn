import { auth } from "@clerk/nextjs/server";

import { getDashboardData } from "@/lib/dashboard";

/**
 * MOCK STUB — backend phase: plain aggregate SQL against `reports`. Rows with
 * is_seed or is_shared are shown individually; everything else counts only.
 */
export async function GET() {
  await auth.protect();
  return Response.json(await getDashboardData());
}
