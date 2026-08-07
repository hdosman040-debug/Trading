import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ShieldAlert, Calculator } from 'lucide-react';

export const Route = createFileRoute('/risk')({
  component: Risk,
});

export default function Risk() {
  const [accountBalance, setAccountBalance] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [stopLossPips, setStopLossPips] = useState<number>(15);
  const [selectedPair, setSelectedPair] = useState<'NAS100' | 'US30' | 'EUR/USD'>('NAS100');

  const riskAmount = (accountBalance * riskPercent) / 100;

  const calculatePositionSize = () => {
    if (stopLossPips <= 0) return 0;
    if (selectedPair === 'EUR/USD') {
      return (riskAmount / (stopLossPips * 10)).toFixed(2);
    } else {
      return (riskAmount / stopLossPips).toFixed(2);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto text-slate-100 bg-slate-950 min-h-screen">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Prop Firm Risk Manager</h1>
        <p className="text-xs text-slate-400">Position size & drawdown control for NAS100, US30 & EUR/USD</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Position Size Calculator */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-white text-base">Position Size Calculator</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Select Instrument</label>
              <div className="grid grid-cols-3 gap-2">
                {(['NAS100', 'US30', 'EUR/USD'] as const).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => setSelectedPair(pair)}
                    className={`p-2 rounded-lg font-bold transition text-xs ${
                      selectedPair === pair 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {pair}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Account Balance ($)</label>
              <input 
                type="number" 
                value={accountBalance} 
                onChange={(e) => setAccountBalance(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Risk Percentage (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={riskPercent} 
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">
                Stop Loss ({selectedPair === 'EUR/USD' ? 'Pips' : 'Points'})
              </label>
              <input 
                type="number" 
                value={stopLossPips} 
                onChange={(e) => setStopLossPips(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 bg-indigo-950/30 p-4 rounded-xl border border-indigo-900/40 text-center space-y-1">
            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Recommended Lot Size</span>
            <div className="text-3xl font-extrabold text-white">{calculatePositionSize()} Lots</div>
            <span className="text-[11px] text-slate-400 block">Risking ${riskAmount.toLocaleString()} ({riskPercent}%)</span>
          </div>
        </div>

        {/* Prop Firm Drawdown Guard */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-white text-base">Prop Firm Exposure Rules</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Max Daily Loss Limit</span>
                <span className="text-[11px] text-slate-400">Hard stop at 4.0% daily equity loss</span>
              </div>
              <span className="font-bold text-rose-400 text-sm">$4,000.00</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Max Overall Drawdown</span>
                <span className="text-[11px] text-slate-400">Trailing maximum threshold (8.0%)</span>
              </div>
              <span className="font-bold text-amber-400 text-sm">$8,000.00</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">Max Active Trades</span>
                <span className="text-[11px] text-slate-400">Concurrent open exposure limit</span>
              </div>
              <span className="font-bold text-indigo-400 text-sm">2 Trades</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
