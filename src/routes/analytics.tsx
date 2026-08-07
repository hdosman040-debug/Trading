import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

function Analytics() {
  const stats = [
    { label: 'Win Rate', value: '68.4%', detail: '38W - 18L', color: 'text-emerald-400' },
    { label: 'Profit Factor', value: '2.45', detail: 'Optimal Ratio', color: 'text-blue-400' },
    { label: 'Expectancy', value: '$358.50', detail: 'Per Execution', color: 'text-amber-400' },
    { label: 'Plan Adherence', value: '92%', detail: 'ICT Rules Followed', color: 'text-purple-400' },
  ];

  const setups = [
    { name: 'Silver Bullet', trades: 24, winRate: '75%', pnl: '+$4,250' },
    { name: 'Judas Swing + FVG', trades: 18, winRate: '66%', pnl: '+$2,800' },
    { name: 'HTF Liquidity Sweep', trades: 14, winRate: '57%', pnl: '+$1,120' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trading Performance Analytics</h1>
          <p className="text-sm text-slate-400">Quantitative metric breakdown for tracked executions</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-800 border border-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-300">
            Asset: NAS100 & USDJPY
          </span>
          <span className="bg-blue-600/20 border border-blue-500/30 text-xs px-3 py-1.5 rounded-lg text-blue-400 font-medium">
            Timezone: NY EST
          </span>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
            <div className={`text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</div>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">{stat.detail}</span>
          </div>
        ))}
      </div>

      {/* Equity Performance Chart */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200">Equity Growth Curve</h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">+18.4% Cumulative</span>
        </div>
        <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-800/80">
          {[35, 42, 38, 55, 62, 58, 70, 78, 74, 88, 95, 100].map((height, i) => (
            <div key={i} className="flex-1 bg-slate-800/60 hover:bg-blue-600/30 rounded-t transition-all group relative h-full flex items-end">
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t transition-all" 
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>Session Start</span>
          <span>Mid Period</span>
          <span>Current</span>
        </div>
      </div>

      {/* Setup Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-slate-200">
          Model & Setup Breakdown
        </div>
        <div className="divide-y divide-slate-800/60 text-xs">
          {setups.map((setup) => (
            <div key={setup.name} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
              <div>
                <div className="font-semibold text-slate-200">{setup.name}</div>
                <div className="text-slate-500 text-[11px]">{setup.trades} Sample Executions</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400">{setup.pnl}</div>
                <div className="text-slate-400 text-[11px]">{setup.winRate} Win Rate</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/analytics')({
  component: Analytics,
});
