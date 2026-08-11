import { Skeleton } from "@/components/ui/skeleton";

/** Reserved shape shown only while the server prepares first-render dashboard data. */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-12 sm:px-6 sm:py-16">
      <Skeleton className="h-5 w-40 rounded-full" />
      <Skeleton className="h-12 w-80 max-w-full rounded-xl" />
      <Skeleton className="h-5 w-[32rem] max-w-full rounded-full" />
      <div className="mt-10 space-y-4">
        <Skeleton className="h-72 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-4">
          <Skeleton className="h-72 rounded-2xl lg:col-span-3" />
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
