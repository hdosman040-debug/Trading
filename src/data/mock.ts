import { Trade, AccountMetrics } from '../types';

export const mockAccountMetrics: AccountMetrics = {
  balance: 104250.00,
  equity: 105120.00,
  todayPnL: 1450.00,
  monthlyPnL: 4250.00,
  drawdown: 1.2,
  maxDrawdown: 3.5,
  winRate: 68.5,
  profitFactor: 2.85,
  avgWin: 620.00,
  avgLoss: 210.00,
  expectancy: 358.50,
  bestSetup: 'Silver Bullet',
  disciplineScore: 92,
};

export const MOCK_METRICS = mockAccountMetrics;

export const mockTrades: Trade[] = [
  {
    id: 'tr-001',
    pair: 'NAS100',
    direction: 'LONG',
    entry: 19850.5,
    exit: 19980.0,
    risk: 250,
    rr: 3.2,
    profit: 800,
    session: 'NY Open',
    strategy: 'Silver Bullet',
    date: '2026-08-04',
    status: 'WIN',
    notes: 'Swept London low during NY 10 AM Silver Bullet window into 15m bullish FVG.',
    timeframe: '5m',
    entryTime: '10:05 NY',
    exitTime: '10:42 NY',
    lotSize: 2.5,
    stopLoss: 19810.0,
    takeProfit: 19980.0,
    riskPercent: 0.5,
    setup: 'Silver Bullet',
    marketBias: 'Bullish',
    liquidityType: 'SSL',
    fairValueGap: true,
    orderBlock: true,
    bos: true,
    confidence: 5,
    followedPlan: true,
    mistakes: [],
    lessonsLearned: 'Patience for the 10:00 AM NY Silver Bullet window yielded high R:R.'
  },
  {
    id: 'tr-002',
    pair: 'EUR/USD',
    direction: 'SHORT',
    entry: 1.0920,
    exit: 1.0885,
    risk: 200,
    rr: 2.5,
    profit: 500,
    session: 'London',
    strategy: 'Judas Swing',
    date: '2026-08-03',
    status: 'WIN',
    notes: 'Judas swing at London open expanding into Asian BSL before displacement lower.',
    timeframe: '15m',
    entryTime: '03:15 NY',
    exitTime: '05:30 NY',
    lotSize: 5.0,
    stopLoss: 1.0934,
    takeProfit: 1.0885,
    riskPercent: 0.5,
    setup: 'Judas Swing',
    marketBias: 'Bearish',
    liquidityType: 'BSL',
    orderBlock: true,
    choch: true,
    confidence: 4,
    followedPlan: true,
    mistakes: [],
    lessonsLearned: 'Classic London Judas raid into HTF supply.'
  },
  {
    id: 'tr-003',
    pair: 'US30',
    direction: 'SHORT',
    entry: 39100,
    exit: 39180,
    risk: 300,
    rr: -1.0,
    profit: -300,
    session: 'NY PM',
    strategy: 'Order Block',
    date: '2026-08-01',
    status: 'LOSS',
    notes: 'Took trade right before high-impact economic news release.',
    timeframe: '1m',
    entryTime: '14:10 NY',
    exitTime: '14:15 NY',
    lotSize: 1.5,
    stopLoss: 39180,
    takeProfit: 38900,
    riskPercent: 0.75,
    setup: 'Order Block',
    marketBias: 'Bearish',
    confidence: 2,
    followedPlan: false,
    mistakes: ['Traded ahead of news folder release'],
    lessonsLearned: 'Always close exposure 15 minutes prior to major economic releases.'
  }
];

export const MOCK_TRADES = mockTrades;

export const MOCK_EQUITY = [
  { date: '2026-07-01', balance: 100000 },
  { date: '2026-07-08', balance: 101200 },
  { date: '2026-07-15', balance: 100800 },
  { date: '2026-07-22', balance: 102500 },
  { date: '2026-07-29', balance: 103200 },
  { date: '2026-08-05', balance: 104250 },
];

export const MOCK_MOODS = [
  { date: '2026-08-01', mood: 'disciplined', rating: 4, notes: 'Followed model parameters' },
  { date: '2026-08-03', mood: 'focused', rating: 5, notes: 'Clean execution during Silver Bullet' },
  { date: '2026-08-04', mood: 'patient', rating: 5, notes: 'Waited for liquidity sweep' },
];

export const MOCK_GOALS = [
  { id: 'g1', title: 'Maintain Risk <= 1% per trade', current: 100, target: 100, category: 'Risk' },
  { id: 'g2', title: 'Target 70% Win Rate on Silver Bullet', current: 68.5, target: 70, category: 'Strategy' },
  { id: 'g3', title: 'Execute only NAS100, US30, EUR/USD', current: 100, target: 100, category: 'Discipline' },
];

export const MOCK_ACHIEVEMENTS = [
  { id: 'a1', title: 'Zero FOMO Week', description: 'Traded strictly within defined killzones for 5 consecutive days', date: '2026-08-01' },
  { id: 'a2', title: 'Silver Bullet Master', description: 'Achieved 3 consecutive Silver Bullet wins on NAS100', date: '2026-08-04' },
];

export const MOCK_DAILY_PNL = [
  { date: '2026-07-28', pnl: 350, profit: 350, amount: 350, count: 1, trades: 1 },
  { date: '2026-07-29', pnl: -150, profit: -150, amount: -150, count: 1, trades: 1 },
  { date: '2026-07-30', pnl: 620, profit: 620, amount: 620, count: 2, trades: 2 },
  { date: '2026-07-31', pnl: 0, profit: 0, amount: 0, count: 0, trades: 0 },
  { date: '2026-08-01', pnl: -300, profit: -300, amount: -300, count: 1, trades: 1 },
  { date: '2026-08-02', pnl: 0, profit: 0, amount: 0, count: 0, trades: 0 },
  { date: '2026-08-03', pnl: 500, profit: 500, amount: 500, count: 1, trades: 1 },
  { date: '2026-08-04', pnl: 800, profit: 800, amount: 800, count: 1, trades: 1 },
  { date: '2026-08-05', pnl: 450, profit: 450, amount: 450, count: 1, trades: 1 },
];

export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
