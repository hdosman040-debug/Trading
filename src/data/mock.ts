import type {
  Achievement,
  DailyPnl,
  EquityPoint,
  Goal,
  MoodEntry,
  Trade,
} from "@/types";

const PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "XAU/USD", "GBP/JPY", "EUR/JPY"];
const STRATEGIES = ["Breakout", "Trend Follow", "Reversal", "Range", "News", "SMC"];
const SESSIONS = ["London", "New York", "Asia", "Sydney"] as const;

// Deterministic PRNG so mock data is stable across renders.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seeded(42);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]!;

function makeTrades(n: number): Trade[] {
  const trades: Trade[] = [];
  const now = Date.now();
  for (let i = 0; i < n; i++) {
    const direction = rand() > 0.5 ? "LONG" : "SHORT";
    const rr = +(rand() * 4 + 0.5).toFixed(2);
    const risk = +(50 + rand() * 200).toFixed(2);
    const isWin = rand() > 0.42;
    const isBE = !isWin && rand() > 0.9;
    const profit = isBE ? 0 : isWin ? +(risk * rr).toFixed(2) : -risk;
    const entry = +(1 + rand() * 200).toFixed(4);
    const exit = +(entry + (rand() - 0.5) * 2).toFixed(4);
    trades.push({
      id: `t-${i + 1}`,
      pair: pick(PAIRS),
      direction,
      entry,
      exit,
      risk,
      rr,
      profit,
      session: pick(SESSIONS),
      strategy: pick(STRATEGIES),
      date: new Date(now - i * 1000 * 60 * 60 * (6 + rand() * 24)).toISOString(),
      status: isBE ? "BREAKEVEN" : isWin ? "WIN" : "LOSS",
      notes: rand() > 0.7 ? "Clean setup on 15m, confluence with H1 zone." : undefined,
    });
  }
  return trades;
}

export const MOCK_TRADES: Trade[] = makeTrades(120);

export const MOCK_EQUITY: EquityPoint[] = (() => {
  const out: EquityPoint[] = [];
  let eq = 10000;
  let bal = 10000;
  const now = Date.now();
  for (let i = 90; i >= 0; i--) {
    const change = (rand() - 0.4) * 300;
    eq += change;
    bal += change * 0.9;
    out.push({
      date: new Date(now - i * 24 * 3600 * 1000).toISOString().slice(0, 10),
      equity: +eq.toFixed(2),
      balance: +bal.toFixed(2),
    });
  }
  return out;
})();

export const MOCK_DAILY_PNL: DailyPnl[] = (() => {
  const out: DailyPnl[] = [];
  const now = Date.now();
  for (let i = 60; i >= 0; i--) {
    out.push({
      date: new Date(now - i * 24 * 3600 * 1000).toISOString().slice(0, 10),
      pnl: +((rand() - 0.45) * 800).toFixed(2),
      trades: Math.floor(rand() * 8),
    });
  }
  return out;
})();

export const MOCK_GOALS: Goal[] = [
  {
    id: "g1",
    title: "Reach $15,000 balance",
    description: "Grow account by 50% through disciplined trading.",
    target: 15000,
    current: 12480,
    unit: "USD",
    deadline: "2026-12-31",
    category: "profit",
  },
  {
    id: "g2",
    title: "Maintain 60% win rate",
    description: "Focus on high-quality A+ setups only.",
    target: 60,
    current: 54,
    unit: "%",
    deadline: "2026-09-30",
    category: "discipline",
  },
  {
    id: "g3",
    title: "Journal 100 trades",
    description: "Log every trade with screenshots and notes.",
    target: 100,
    current: 72,
    unit: "trades",
    deadline: "2026-08-15",
    category: "learning",
  },
  {
    id: "g4",
    title: "Keep max drawdown under 8%",
    description: "Cap risk per trade at 1% and daily loss at 3%.",
    target: 8,
    current: 5.2,
    unit: "%",
    deadline: "2026-12-31",
    category: "risk",
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "First Trade", description: "Logged your first trade", unlocked: true, icon: "trophy" },
  { id: "a2", title: "10 Wins Streak", description: "10 consecutive wins", unlocked: true, icon: "flame" },
  { id: "a3", title: "Risk Master", description: "30 days under 1% risk", unlocked: true, icon: "shield" },
  { id: "a4", title: "Century Club", description: "100 trades journaled", unlocked: false, icon: "target" },
  { id: "a5", title: "Zen Trader", description: "30 days of mood tracking", unlocked: false, icon: "sparkles" },
  { id: "a6", title: "Profit Hunter", description: "$5,000 total profit", unlocked: false, icon: "trending-up" },
];

export const MOCK_MOODS: MoodEntry[] = (() => {
  const out: MoodEntry[] = [];
  const moods: MoodEntry["mood"][] = ["great", "good", "neutral", "bad", "terrible"];
  const now = Date.now();
  for (let i = 0; i < 14; i++) {
    out.push({
      id: `m${i}`,
      date: new Date(now - i * 24 * 3600 * 1000).toISOString().slice(0, 10),
      mood: moods[Math.floor(rand() * moods.length)]!,
      confidence: Math.floor(50 + rand() * 50),
      discipline: Math.floor(50 + rand() * 50),
      notes: i === 0 ? "Great London session. Stuck to my plan." : "",
    });
  }
  return out;
})();

// --- Aggregates -----------------------------------------------------------

export function computeStats(trades: Trade[]) {
  const closed = trades.filter((t) => t.status !== "OPEN");
  const wins = closed.filter((t) => t.status === "WIN");
  const losses = closed.filter((t) => t.status === "LOSS");
  const grossWin = wins.reduce((s, t) => s + t.profit, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.profit, 0));
  const totalProfit = closed.reduce((s, t) => s + t.profit, 0);
  const winRate = closed.length ? (wins.length / closed.length) * 100 : 0;
  const avgRR = closed.length ? closed.reduce((s, t) => s + t.rr, 0) / closed.length : 0;
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin;

  // Streak
  let streak = 0;
  for (const t of closed) {
    if (t.status === "WIN") streak++;
    else break;
  }

  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);

  const todayPnl = closed
    .filter((t) => t.date.slice(0, 10) === today)
    .reduce((s, t) => s + t.profit, 0);
  const weekPnl = closed
    .filter((t) => t.date.slice(0, 10) >= weekAgo)
    .reduce((s, t) => s + t.profit, 0);
  const monthPnl = closed
    .filter((t) => t.date.slice(0, 10) >= monthAgo)
    .reduce((s, t) => s + t.profit, 0);

  return {
    todayPnl,
    weekPnl,
    monthPnl,
    totalTrades: trades.length,
    winRate,
    avgRR,
    profitFactor,
    streak,
    totalProfit,
  };
}

export function groupBy<T extends { profit: number }>(
  arr: T[],
  key: (t: T) => string,
): { name: string; profit: number; trades: number }[] {
  const map = new Map<string, { name: string; profit: number; trades: number }>();
  for (const item of arr) {
    const k = key(item);
    const existing = map.get(k) ?? { name: k, profit: 0, trades: 0 };
    existing.profit += item.profit;
    existing.trades += 1;
    map.set(k, existing);
  }
  return Array.from(map.values());
}
