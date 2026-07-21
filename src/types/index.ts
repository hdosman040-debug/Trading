export type Direction = "LONG" | "SHORT";
export type TradeStatus = "WIN" | "LOSS" | "BREAKEVEN" | "OPEN";
export type Session = "London" | "New York" | "Asia" | "Sydney";

export interface Trade {
  id: string;
  pair: string;
  direction: Direction;
  entry: number;
  exit: number;
  risk: number; // in USD
  rr: number;
  profit: number; // in USD
  session: Session;
  strategy: string;
  date: string; // ISO
  status: TradeStatus;
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: "profit" | "discipline" | "learning" | "risk";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: "great" | "good" | "neutral" | "bad" | "terrible";
  confidence: number; // 0-100
  discipline: number; // 0-100
  notes: string;
}

export interface EquityPoint {
  date: string;
  equity: number;
  balance: number;
}

export interface DailyPnl {
  date: string;
  pnl: number;
  trades: number;
}
