"use client";

import { useEffect, useState } from "react";

import { categoryLabels } from "@/lib/tier";
import type { Category, DashboardResponse } from "@/lib/schema";

/**
 * Quiet evidence strip on the home page — real (mock) aggregate numbers that
 * ground the product in data. Degrades to nothing if the fetch fails.
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
    <p className="mt-8 font-mono text-xs tracking-wide text-muted-foreground">
      {stats.totalChecks} checks run · {stats.confirmedCases} confirmed cases ·
      Most common this week:{" "}
      {stats.topCategoryThisWeek
        ? categoryLabels[stats.topCategoryThisWeek as Category]
        : "—"}
    </p>
  );
}
