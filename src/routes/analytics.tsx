import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/common/chart-card";
import { PageHeader } from "@/components/common/page-header";
import { CalendarHeatmap } from "@/components/charts/calendar-heatmap";
import { MOCK_EQUITY, groupBy } from "@/data/mock";
import { useTrades } from "@/hooks/use-trades";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Fortex Journal" },
      { name: "description", content: "Deep-dive analytics into your trading performance." },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
};

function AnalyticsPage() {
  const { trades } = useTrades();
  const closed = trades.filter((t) => t.status !== "OPEN");

  const wins = closed.filter((t) => t.status === "WIN").length;
  const losses = closed.filter((t) => t.status === "LOSS").length;
  const be = closed.filter((t) => t.status === "BREAKEVEN").length;

  const winRateData = [
    { name: "Wins", value: wins, color: "var(--color-success)" },
    { name: "Losses", value: losses, color: "var(--color-danger)" },
    { name: "BE", value: be, color: "var(--color-muted-foreground)" },
  ];

  const byPair = useMemo(() => groupBy(closed, (t) => t.pair), [closed]);
  const bySession = useMemo(() => groupBy(closed, (t) => t.session), [closed]);
  const byStrategy = useMemo(() => groupBy(closed, (t) => t.strategy), [closed]);

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of closed) {
      const key = t.date.slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + t.profit);
    }
    return Array.from(map, ([name, profit]) => ({ name, profit })).sort((a, b) => a.name.localeCompare(b.name));
  }, [closed]);

  return (
    <>
      <PageHeader title="Analytics" description="Explore your performance from every angle." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Equity Curve" description="Cumulative equity">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MOCK_EQUITY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="equity" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Balance Curve" description="Account balance">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MOCK_EQUITY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="balance" stroke="var(--color-accent)" strokeWidth={2} fill="url(#balFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Win Rate" description={`${wins}W · ${losses}L · ${be}BE`}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={winRateData} dataKey="value" cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={2}>
                {winRateData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Profit" description="Net P&L per month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                {byMonth.map((d, i) => (
                  <Cell key={i} fill={d.profit >= 0 ? "var(--color-success)" : "var(--color-danger)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance by Pair" description="Net profit">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byPair} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="profit" radius={[0, 6, 6, 0]}>
                {byPair.map((d, i) => (
                  <Cell key={i} fill={d.profit >= 0 ? "var(--color-primary)" : "var(--color-danger)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Session Performance" description="Net profit">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bySession} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="profit" radius={[6, 6, 0, 0]} fill="var(--color-accent)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Strategy Performance" description="Net profit">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byStrategy} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="profit" radius={[6, 6, 0, 0]} fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Heatmap" description="Last 60 days">
          <CalendarHeatmap />
        </ChartCard>
      </div>
    </>
  );
}
