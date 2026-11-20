"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const ranges = [7, 30] as const;

const config = {
  leads: { label: "Leads", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function PortalLeadsChart({ byDay }: { byDay: { day: string; leads: number }[] }) {
  const [days, setDays] = useState<(typeof ranges)[number]>(30);
  const data = byDay.slice(-days);
  const total = data.reduce((sum, d) => sum + d.leads, 0);
  const peak = Math.max(2, ...data.map((d) => d.leads));
  const axisWidth = 16 + peak.toLocaleString("en-IN").length * 7;

  return (
    <section className="h-full rounded-2xl border border-hairline bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-ink">Leads received</h2>
          <p className="mt-0.5 text-sm text-faint">
            <span className="font-semibold text-ink tabular-nums">{total.toLocaleString("en-IN")}</span>{" "}
            in the last {days} days
          </p>
        </div>
        <div role="group" aria-label="Date range" className="flex rounded-lg bg-surface-subtle p-0.5">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              aria-pressed={days === range}
              onClick={() => setDays(range)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                days === range ? "bg-white text-ink shadow-sm" : "text-faint hover:text-ink",
              )}
            >
              {range}D
            </button>
          ))}
        </div>
      </div>

      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <BarChart data={data} margin={{ left: 0, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 4" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} minTickGap={24} />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={axisWidth}
            tickFormatter={(value: number) => value.toLocaleString("en-IN")}
            domain={[0, (max: number) => Math.max(2, max)]}
          />
          <ChartTooltip cursor={{ fill: "var(--color-leads)", opacity: 0.06 }} content={<ChartTooltipContent />} />
          <Bar dataKey="leads" fill="var(--color-leads)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ChartContainer>
    </section>
  );
}
