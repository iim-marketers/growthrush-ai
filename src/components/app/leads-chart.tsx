"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ranges = [
  { days: 7, label: "7D" },
  { days: 14, label: "14D" },
  { days: 30, label: "30D" },
] as const;

const config = {
  leads: { label: "Leads", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function LeadsChart({
  leadsByDay,
}: {
  leadsByDay: { day: string; leads: number }[];
}) {
  const [days, setDays] = useState<number>(14);
  const data = leadsByDay.slice(-days);
  const total = data.reduce((sum, d) => sum + d.leads, 0);
  const best = data.reduce(
    (top, d) => (d.leads > top.leads ? d : top),
    data[0],
  );

  return (
    <Card className="h-full gap-2 rounded-2xl py-5">
      <CardHeader className="px-5">
        <CardTitle className="font-display text-base font-bold text-ink">
          Leads per day
        </CardTitle>
        {/* <CardDescription>
          <span className="font-semibold text-ink tabular-nums">{total}</span>{" "}
          leads in the last {days} days
          {best?.leads > 0 && (
            <span className="hidden sm:inline">
              {" "}
              · best day {best.day} ({best.leads})
            </span>
          )}
        </CardDescription> */}
        <CardAction>
          <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <TabsList aria-label="Date range">
              {ranges.map((range) => (
                <TabsTrigger
                  key={range.days}
                  value={String(range.days)}
                  className="px-2.5 text-xs"
                >
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>

      <CardContent className="relative px-2 sm:px-4">
        {total === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
            <div className="flex max-w-xs flex-col items-center gap-2 rounded-xl border border-hairline bg-card/90 px-5 py-4 text-center shadow-sm backdrop-blur-sm">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <BarChart3 aria-hidden className="size-4" />
              </span>
              <p className="font-display text-sm font-bold text-ink">
                No leads in this period
              </p>
              <p className="text-xs text-faint">
                Your daily lead count will chart here as enquiries come in.
              </p>
            </div>
          </div>
        )}
        <ChartContainer
          config={config}
          className="aspect-auto h-56 w-full sm:h-64"
        >
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 12 }}>
            <defs>
              <linearGradient id="leads-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-leads)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-leads)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={28}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={32}
              domain={[0, (max: number) => Math.max(2, max)]}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="leads"
              type="monotone"
              stroke="var(--color-leads)"
              strokeWidth={2.25}
              fill="url(#leads-fill)"
              activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ChartContainer>

        <table className="sr-only">
          <caption>Leads per day, last {days} days</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Leads</th>
            </tr>
          </thead>
          <tbody>
            {data.map((day) => (
              <tr key={day.day}>
                <th scope="row">{day.day}</th>
                <td>{day.leads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
