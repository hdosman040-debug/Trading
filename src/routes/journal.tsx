import { createFileRoute, Link } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { getStoredTrades, updateStoredTrade } from '../utils/trade-storage';
import { TradeScreenshotsSection } from '../components/journal/trade-screenshots-section';
import { Trade } from '../types';

export const Route = createFileRoute('/journal')({
  component: JournalComponent,
});

function JournalComponent() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  useEffect(() => {
    const loaded = getStoredTrades();
    setTrades(loaded);
    if (loaded.length > 0) setSelectedTrade(loaded[0]);

    const handleUpdate = () => {
      const updated = getStoredTrades();
      setTrades(updated);
      if (updated.length > 0) setSelectedTrade(updated[0]);
    };

    window.addEventListener('trades_updated', handleUpdate);
    return () => window.removeEventListener('trades_updated', handleUpdate);
  }, []);

  const handleUpdateTradeScreenshots = (
    tradeId: string,
    screenshots: { beforeScreenshot?: string; afterScreenshot?: string; chartScreenshot?: string }
  ) => {
    const target = trades.find((t) => t.id === tradeId);
    if (!target) return;

    const updated: Trade = {
      ...target,
      ...screenshots,
    };

    updateStoredTrade(updated);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Trade Journal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Detailed log and screenshot records for all executed positions.
          </p>
        </div>
        <Link
          to="/new-trade"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow flex items-center gap-1.5"
        >
          <span>+ Log Trade</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade List Sidebar */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Logged Trades ({trades.length})
          </h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {trades.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTrade(t)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedTrade?.id === t.id
                    ? 'bg-slate-800 border-blue-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-100 text-sm">{t.pair}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.status === 'WIN'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : t.status === 'LOSS'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-mono">
                  <span>
                    {t.direction} • {t.setup || t.strategy}
                  </span>
                  <span
                    className={t.profit >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}
                  >
                    {t.profit >= 0 ? '+' : ''}${t.profit}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Trade Detail */}
        <div className="lg:col-span-2">
          {selectedTrade ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedTrade.pair}</h2>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300">
                      {selectedTrade.direction}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">#{selectedTrade.id}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedTrade.date} • {selectedTrade.session} Session • {selectedTrade.timeframe || 'M5'}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-lg font-extrabold text-slate-100">
                    {selectedTrade.profit >= 0 ? '+' : ''}${selectedTrade.profit}
                  </div>
                  <div className="text-xs text-amber-400 font-bold">{selectedTrade.rr} R</div>
                </div>
              </div>

              {/* Execution Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Entry</span>
                  <span className="text-slate-200">{selectedTrade.entry}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Stop Loss</span>
                  <span className="text-rose-400">{selectedTrade.stopLoss || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Take Profit</span>
                  <span className="text-emerald-400">{selectedTrade.takeProfit || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Lot / Risk</span>
                  <span className="text-slate-200">{selectedTrade.lotSize || 1} lots ({selectedTrade.riskPercent || 0.5}%)</span>
                </div>
              </div>

              {/* Notes */}
              {selectedTrade.notes && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Analysis Notes</h4>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {selectedTrade.notes}
                  </p>
                </div>
              )}

              {/* Screenshots Section */}
              <TradeScreenshotsSection
                trade={selectedTrade}
                onUpdateTradeScreenshots={(screenshots) =>
                  handleUpdateTradeScreenshots(selectedTrade.id, screenshots)
                }
              />
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
              No trade selected. Select a trade from the list to view screenshots and details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
