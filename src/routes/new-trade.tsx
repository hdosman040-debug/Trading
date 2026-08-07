import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Trade } from '../types';
import { saveNewTrade } from '../utils/trade-storage';
import { saveTradeScreenshot, getScreenshotStoragePath } from '../utils/screenshot-storage';

export const Route = createFileRoute('/new-trade')({
  component: NewTradeComponent,
});

function NewTradeComponent() {
  const navigate = useNavigate();

  const [id] = useState(`tr-${Date.now().toString().slice(-6)}`);
  const [pair, setPair] = useState('NAS100');
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [setup, setSetup] = useState('Liquidity Sweep');
  const [session, setSession] = useState('New York');
  const [timeframe, setTimeframe] = useState('M5');

  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [exit, setExit] = useState('');
  const [lotSize, setLotSize] = useState('1.0');
  const [riskPercent, setRiskPercent] = useState('0.5');

  const [status, setStatus] = useState<'WIN' | 'LOSS' | 'BE'>('WIN');
  const [profit, setProfit] = useState('');
  const [rr, setRr] = useState('');

  const [notes, setNotes] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string>('');
  const [afterPreview, setAfterPreview] = useState<string>('');

  const handleBeforeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBeforeFile(file);
      setBeforePreview(URL.createObjectURL(file));
    }
  };

  const handleAfterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let beforeUrl = '';
    let afterUrl = '';

    if (beforeFile) {
      beforeUrl = await saveTradeScreenshot(id, 'before', beforeFile);
    }
    if (afterFile) {
      afterUrl = await saveTradeScreenshot(id, 'after', afterFile);
    }

    const calculatedProfit = profit !== '' ? parseFloat(profit) : status === 'LOSS' ? -250 : 500;
    const calculatedRr = rr !== '' ? parseFloat(rr) : status === 'LOSS' ? -1 : 2.5;

    const newTrade: Trade = {
      id,
      pair,
      direction,
      setup,
      strategy: setup,
      session,
      timeframe,
      entry: parseFloat(entry) || 0,
      exit: parseFloat(exit) || 0,
      stopLoss: parseFloat(stopLoss) || 0,
      takeProfit: parseFloat(takeProfit) || 0,
      lotSize: parseFloat(lotSize) || 1,
      riskPercent: parseFloat(riskPercent) || 0.5,
      risk: (parseFloat(riskPercent) || 0.5) * 500,
      status,
      profit: calculatedProfit,
      rr: calculatedRr,
      date: new Date().toISOString().split('T')[0],
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes,
      mistakes: mistakes ? mistakes.split(',').map((s) => s.trim()) : [],
      lessonsLearned,
      beforeScreenshot: beforeUrl || undefined,
      afterScreenshot: afterUrl || undefined,
      followedPlan: true,
    };

    saveNewTrade(newTrade);
    navigate({ to: '/journal' as any });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">+</span> Log New Trade
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Offline-first entry logging into local device storage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: '/' as any })}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Market & Direction */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">1. Market & Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Market Instrument</label>
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="NAS100">NAS100</option>
                <option value="US30">US30</option>
                <option value="EUR/USD">EUR/USD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('LONG')}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    direction === 'LONG'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  LONG ⬆
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SHORT')}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    direction === 'SHORT'
                      ? 'bg-rose-600/20 border-rose-500 text-rose-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  SHORT ⬇
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Setup Type</label>
              <select
                value={setup}
                onChange={(e) => setSetup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="Liquidity Sweep">Liquidity Sweep</option>
                <option value="Order Block">Order Block</option>
                <option value="Fair Value Gap">Fair Value Gap</option>
                <option value="Breaker Block">Breaker Block</option>
                <option value="SMT Divergence">SMT Divergence</option>
                <option value="Silver Bullet">Silver Bullet</option>
                <option value="Power of Three">Power of Three</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="London">London</option>
                <option value="New York">New York</option>
                <option value="Asia">Asia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="M5">M5 (5m)</option>
                <option value="M15">M15 (15m)</option>
                <option value="H1">H1 (1h)</option>
                <option value="H4">H4 (4h)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Execution & Risk */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">2. Trade Execution Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Entry Price</label>
              <input
                type="number"
                step="any"
                placeholder="19850.5"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Stop Loss</label>
              <input
                type="number"
                step="any"
                placeholder="19810.0"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Take Profit</label>
              <input
                type="number"
                step="any"
                placeholder="19980.0"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Exit Price</label>
              <input
                type="number"
                step="any"
                placeholder="19980.0"
                value={exit}
                onChange={(e) => setExit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Lot Size</label>
              <input
                type="number"
                step="any"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Risk (%)</label>
              <input
                type="number"
                step="any"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Outcome */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">3. Outcome & Result</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(['WIN', 'LOSS', 'BE'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      status === s
                        ? s === 'WIN'
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                          : s === 'LOSS'
                          ? 'bg-rose-600/20 border-rose-500 text-rose-400'
                          : 'bg-slate-700 border-slate-500 text-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Net Profit ($)</label>
              <input
                type="number"
                step="any"
                placeholder="500"
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">R Multiple (R:R)</label>
              <input
                type="number"
                step="any"
                placeholder="2.5"
                value={rr}
                onChange={(e) => setRr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Journal Notes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">4. Journal & Reflections</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Entry Reason & Analysis</label>
              <textarea
                rows={2}
                placeholder="Describe market structure, liquidity sweep, or key setup context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Mistakes (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Moved SL early, Late entry"
                  value={mistakes}
                  onChange={(e) => setMistakes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Lessons Learned</label>
                <input
                  type="text"
                  placeholder="e.g. Wait for 15m candle close before entry"
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">5. Attach Chart Screenshots</h2>
            <span className="text-[10px] text-slate-500 font-mono">Stored at user-data/trades/{id}/</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Before Entry Chart</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBeforeSelect}
                className="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-lg p-2"
              />
              {beforePreview && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-800 aspect-video bg-black">
                  <img src={beforePreview} alt="Before preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">After Exit Chart</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAfterSelect}
                className="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-lg p-2"
              />
              {afterPreview && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-800 aspect-video bg-black">
                  <img src={afterPreview} alt="After preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>Save Trade to Journal</span>
          <span>→</span>
        </button>
      </form>
    </div>
  );
}
