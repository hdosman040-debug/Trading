import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  DollarSign,
  Flame,
  Percent,
  Scale,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";

import { PageHeader } from "@/components/common/page-header";
import { StatsCard } from "@/components/common/stats-card";
import { ChartCard } from "@/components/common/chart-card";
import { EquityCurveChart } from "@/components/charts/equity-curve-chart";
import { ProfitBarChart } from "@/components/charts/profit-bar-chart";
import { CalendarHeatmap } from "@/components/charts/calendar-heatmap";
import { RecentTradesTable } from "@/components/dashboard/recent-trades-table";
import { computeStats, groupBy } from "@/data/mock";
import { useTrades } from "@/hooks/use-trades";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Fortex Journal" },
      { name: "description", content: "Overview of your trading performance, equity, and stats." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { trades } = useTrades();
  const stats = useMemo(() => computeStats(trades), [trades]);
  const bySession = useMemo(
    () => groupBy(trades.filter((t) => t.status !== "OPEN"), (t) => t.session),
    [trades],
  );
  const recent = useMemo(() => [...trades].slice(0, 8), [trades]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's a snapshot of your trading."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatsCard label="Today's Profit" value={formatCurrency(stats.todayPnl, { sign: true })} delta={4.2} icon={DollarSign} accent="success" />
        <StatsCard label="Weekly Profit" value={formatCurrency(stats.weekPnl, { sign: true })} delta={12.5} icon={TrendingUp} accent="primary" />
        <StatsCard label="Monthly Profit" value={formatCurrency(stats.monthPnl, { sign: true })} delta={8.1} icon={Wallet} accent="accent" />
        <StatsCard label="Total Trades" value={formatNumber(stats.totalTrades, 0)} icon={Activity} accent="primary" />
        <StatsCard label="Win Rate" value={formatPercent(stats.winRate)} delta={2.3} icon={Percent} accent="success" />
        <StatsCard label="Avg RR" value={formatNumber(stats.avgRR)} icon={Scale} accent="accent" />
        <StatsCard label="Profit Factor" value={formatNumber(stats.profitFactor)} icon={Target} accent="primary" />
        <StatsCard label="Current Streak" value={`${stats.streak} W`} icon={Flame} accent="danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Equity Curve" description="Last 90 days" className="lg:col-span-2">
          <EquityCurveChart />
        </ChartCard>
        <ChartCard title="Performance by Session" description="Net profit">
          <ProfitBarChart data={bySession} />
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Calendar Heatmap" description="Daily P&L" className="lg:col-span-1">
          <CalendarHeatmap />
        </ChartCard>
        <ChartCard title="Recent Trades" description="Latest 8 executions" className="lg:col-span-2">
          <RecentTradesTable trades={recent} />
        </ChartCard>
      </div>
    </>
  );
}
