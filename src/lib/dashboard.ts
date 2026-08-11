import { mockDashboard } from "@/lib/mock";
import { dashboardResponseSchema, type DashboardResponse } from "@/lib/schema";

/**
 * Single dashboard data boundary. It returns calibrated mock data today and is
 * the one seam to replace with aggregate SQL when community analytics go live.
 */
export async function getDashboardData(): Promise<DashboardResponse> {
  return dashboardResponseSchema.parse(mockDashboard);
}
