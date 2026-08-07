import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { mockAccountMetrics, mockTrades } from '../data/mock';
import { 
  TrendingUp, TrendingDown, ShieldAlert, CheckSquare, 
  Brain, BarChart3, Clock, Target, DollarSign, Activity, Zap
} from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

export default function Dashboard() {
  const [checklist, setChecklist] = useState({
    htfBias: true,
    liquidity: true,
    orderBlock: true,
    fvg: false,
    newsChecked: true,
    riskAcceptable: true,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistScore = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100 bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Total Balance</p>
          <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            ${mockAccountMetrics.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Today's P/L</span>
              <span className={`font-bold ${mockAccountMetrics.todayPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {mockAccountMetrics.todayPnL >= 0 ? '+' : ''}${mockAccountMetrics.todayPnL.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Current Drawdown</span>
              <span className="font-bold text-amber-400">{mockAccountMetrics.drawdown}%</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Win Rate</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{mockAccountMetrics.winRate}%</div>
            <span className="text-[10px] text-slate-500">Target &gt; 60%</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Profit Factor</span>
              <BarChart3 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{mockAccountMetrics.profitFactor}</div>
            <span className="text-[10px] text-emerald-400">Optimal ratio</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Expectancy</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">${mockAccountMetrics.expectancy}</div>
            <span className="text-[10px] text-slate-500">Per execution</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Best Setup</span>
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-sm font-bold text-amber-300 mt-2 truncate">{mockAccountMetrics.bestSetup}</div>
            <span className="text-[10px] text-slate-500">High win probability</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Average Win</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-2">${mockAccountMetrics.avgWin}</div>
            <span className="text-[10px] text-slate-500">Avg Loss: ${mockAccountMetrics.avgLoss}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Discipline</span>
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 mt-2">{mockAccountMetrics.disciplineScore}%</div>
            <span className="text-[10px] text-purple-400/80">Plan adherence</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Watchlist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ICT Pre-Trade Checklist */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100">ICT Pre-Trade Filter</h3>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              checklistScore === 6 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {checklistScore}/6 Passed
            </span>
          </div>

          <div className="space-y-2.5 text-sm">
            {Object.entries({
              htfBias: 'HTF Directional Bias Confirmed',
              liquidity: 'BSL / SSL Liquidity Identified',
              orderBlock: 'Order Block / Breaker Zone Valid',
              fvg: 'Fair Value Gap / Displacement Present',
              newsChecked: 'Economic News Calendar Clean',
              riskAcceptable: 'Risk ≤ 1.0% Calculated',
            }).map(([key, label]) => (
              <label 
                key={key} 
                onClick={() => toggleCheck(key as keyof typeof checklist)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 cursor-pointer hover:border-slate-700 transition"
              >
                <span className="text-slate-300 text-xs font-medium">{label}</span>
                <input 
                  type="checkbox" 
                  checked={checklist[key as keyof typeof checklist]} 
                  readOnly 
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0" 
                />
              </label>
            ))}
          </div>
        </div>

        {/* Watchlist */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-100">Primary Markets</h3>
            </div>
            <span className="text-xs text-slate-400">NY Session Focus</span>
          </div>

          <div className="space-y-3">
            {[
              { pair: 'NAS100', name: 'Nasdaq 100 Index', time: '09:30 - 11:00 NY', status: 'Silver Bullet Active' },
              { pair: 'US30', name: 'Dow Jones Industrial', time: '09:30 - 11:30 NY', status: 'Liquidity Raid Zone' },
              { pair: 'EUR/USD', name: 'Euro / US Dollar', time: '02:00 & 08:00 NY', status: 'London/NY Killzones' },
            ].map((item) => (
              <div key={item.pair} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{item.pair}</div>
                  <div className="text-[11px] text-slate-400">{item.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-indigo-400 font-semibold">{item.time}</div>
                  <div className="text-[10px] text-slate-500">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Psychology Note */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-slate-100">Psychology & Discipline</h3>
          </div>
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs text-purple-200 space-y-2">
            <p className="font-semibold text-purple-300">Rule of the Day:</p>
            <p className="leading-relaxed">"Never execute outside the London or NY Silver Bullet windows. Wait for liquidity sweeps and displacement back into Fair Value Gaps."</p>
          </div>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Primary Mistake Tag:</span>
              <span className="text-rose-400 font-medium">Entering before 10 AM NY</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Confidence:</span>
              <span className="text-emerald-400 font-medium">4.5 / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm">Recent ICT Executions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3">Date / Time</th>
                <th className="pb-3">Pair</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Setup</th>
                <th className="pb-3">Session</th>
                <th className="pb-3">R:R</th>
                <th className="pb-3 text-right">P/L ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {mockTrades.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 text-slate-300">{t.date} ({t.entryTime})</td>
                  <td className="py-3 font-bold text-white">{t.pair}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {t.direction}
                    </span>
                  </td>
                  <td className="py-3 text-indigo-300 font-medium">{t.setup}</td>
                  <td className="py-3 text-slate-400">{t.session}</td>
                  <td className="py-3 font-semibold text-slate-200">{t.rr}R</td>
                  <td className={`py-3 text-right font-bold ${t.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.profit >= 0 ? '+' : ''}${t.profit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
