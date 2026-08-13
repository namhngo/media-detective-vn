import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceBackdrop } from "@/components/workspace-backdrop";

/** Reserved shape shown only while the server prepares first-render dashboard data. */
export default function DashboardLoading() {
  return (
    <div className="torch-workspace relative isolate min-h-[calc(100svh-4rem)] overflow-hidden py-12 sm:py-16">
      <WorkspaceBackdrop />
      <div className="relative mx-auto max-w-5xl space-y-4 px-4 sm:px-6">
        <Skeleton className="h-5 w-40 rounded-full bg-white/10" />
        <Skeleton className="h-12 w-80 max-w-full rounded-xl bg-white/10" />
        <Skeleton className="h-5 w-[32rem] max-w-full rounded-full bg-white/10" />
        <div className="mt-10 space-y-4">
          <Skeleton className="h-72 rounded-2xl bg-white/10" />
          <div className="grid gap-4 lg:grid-cols-4">
            <Skeleton className="h-72 rounded-2xl bg-white/10 lg:col-span-3" />
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
