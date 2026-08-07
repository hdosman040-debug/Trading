export interface Trade {
  id: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  risk: number;
  rr: number;
  profit: number;
  session: string;
  strategy: string;
  date: string;
  status: 'WIN' | 'LOSS' | 'BE';
  notes?: string;
  timeframe?: string;
  entryTime?: string;
  exitTime?: string;
  lotSize?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskPercent?: number;
  setup?: string;
  marketBias?: string;
  liquidityType?: string;
  fairValueGap?: boolean;
  orderBlock?: boolean;
  bos?: boolean;
  choch?: boolean;
  confidence?: number;
  followedPlan?: boolean;
  mistakes?: string[];
  lessonsLearned?: string;
  beforeScreenshot?: string;
  afterScreenshot?: string;
  chartScreenshot?: string;
}

export interface AccountMetrics {
  balance: number;
  equity: number;
  todayPnL: number;
  monthlyPnL: number;
  drawdown: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  bestSetup: string;
  disciplineScore: number;
}
