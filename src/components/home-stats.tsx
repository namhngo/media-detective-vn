"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, TrendingUp } from "lucide-react";

import { CountUp } from "@/components/count-up";
import { categoryLabels } from "@/lib/tier";
import type { Category, DashboardResponse } from "@/lib/schema";

/**
 * The home page's proof-at-a-glance strip — real (mock) numbers, promoted
 * from a throwaway text line to its own small bento row. Counts up once,
 * on arrival, because the numbers are real, not for show.
 */
export function HomeStats() {
  const [stats, setStats] = useState<DashboardResponse["stats"] | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: DashboardResponse | null) => d && setStats(d.stats))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
      <div className="rounded-xl bg-secondary/60 px-3.5 py-3">
        <Activity className="size-4 text-muted-foreground" />
        <p className="mt-1.5 font-mono text-xl font-semibold">
          <CountUp value={stats.totalChecks} />
        </p>
        <p className="text-xs text-muted-foreground">checks run</p>
      </div>
      <div className="rounded-xl bg-secondary/60 px-3.5 py-3">
        <CheckCircle2 className="size-4 text-muted-foreground" />
        <p className="mt-1.5 font-mono text-xl font-semibold">
          <CountUp value={stats.confirmedCases} />
        </p>
        <p className="text-xs text-muted-foreground">confirmed cases</p>
      </div>
      <div className="rounded-xl bg-secondary/60 px-3.5 py-3">
        <TrendingUp className="size-4 text-muted-foreground" />
        <p className="mt-1.5 text-sm font-semibold">
          {stats.topCategoryThisWeek
            ? categoryLabels[stats.topCategoryThisWeek as Category]
            : "—"}
        </p>
        <p className="text-xs text-muted-foreground">top this week</p>
      </div>
    </div>
  );
}
