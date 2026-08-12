"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { techniqueLabels } from "@/lib/tier";
import type { DashboardResponse } from "@/lib/schema";

const trendConfig = {
  watch: { label: "Watch", color: "var(--chart-1)" },
  caution: { label: "Caution", color: "var(--chart-2)" },
  warning: { label: "Warning", color: "var(--chart-3)" },
} satisfies ChartConfig;

/** Check volume over time, stacked by tier. Tier colors, naturally. */
export function TrendChart({
  data,
}: {
  data: DashboardResponse["trend"];
}) {
  return (
    <ChartContainer config={trendConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(iso: string) =>
            new Date(iso).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={36}
          allowDecimals={false}
          domain={[0, "dataMax"]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {(["watch", "caution", "warning"] as const).map((tier) => (
          <Area
            key={tier}
            dataKey={tier}
            name={trendConfig[tier].label}
            stackId="volume"
            type="monotone"
            stroke={`var(--color-${tier})`}
            fill={`var(--color-${tier})`}
            fillOpacity={0.25}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

const techniqueConfig = {
  count: { label: "Checks", color: "var(--chart-5)" },
} satisfies ChartConfig;

/** Technique frequency across all checks — neutral stone, not tier hues. */
export function TechniqueChart({
  data,
}: {
  data: DashboardResponse["techniqueCounts"];
}) {
  const top = data.slice(0, 6);
  return (
    <ChartContainer config={techniqueConfig} className="aspect-auto h-64 w-full">
      <BarChart data={top} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="technique"
          tickLine={false}
          axisLine={false}
          width={132}
          tickFormatter={(t: string) => techniqueLabels[t] ?? t}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

const splitConfig = {
  ai: { label: "AI + user confirmed", color: "var(--primary)" },
  user: { label: "Self-reported", color: "var(--confirmed-user)" },
} satisfies ChartConfig;

/** AI-confirmed vs self-reported — the cheap, credible insight. */
export function ConfirmationSplit({
  data,
}: {
  data: DashboardResponse["confirmationSplit"];
}) {
  const total = data.aiDetected + data.userReported;
  const pieData = [
    { key: "ai", name: splitConfig.ai.label, value: data.aiDetected },
    { key: "user", name: splitConfig.user.label, value: data.userReported },
  ];

  return (
    <div className="flex h-64 items-center justify-center">
      <ChartContainer config={splitConfig} className="aspect-auto h-full w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            strokeWidth={2}
          >
            {pieData.map((d) => (
              <Cell key={d.key} fill={`var(--color-${d.key})`} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground font-mono text-2xl"
          >
            {total}
          </text>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
