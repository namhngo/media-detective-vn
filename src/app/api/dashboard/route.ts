import { mockDashboard, sleep } from "@/lib/mock";
import { dashboardResponseSchema } from "@/lib/schema";

/**
 * MOCK STUB — backend phase: plain aggregate SQL against `reports`. Rows with
 * is_seed or is_shared are shown individually; everything else counts only.
 */
export async function GET() {
  await sleep(300);
  return Response.json(dashboardResponseSchema.parse(mockDashboard));
}
