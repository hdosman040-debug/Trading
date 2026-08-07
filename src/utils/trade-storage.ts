import { Trade } from '../types';
import { MOCK_TRADES } from '../data/mock';

const STORAGE_KEY = 'trade_master_suite_trades';

export function getStoredTrades(): Trade[] {
  if (typeof window === 'undefined') return MOCK_TRADES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TRADES));
      return MOCK_TRADES;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_TRADES;
  }
}

export function saveNewTrade(trade: Trade): Trade[] {
  const current = getStoredTrades();
  const updated = [trade, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('trades_updated'));
  }
  return updated;
}

export function updateStoredTrade(trade: Trade): Trade[] {
  const current = getStoredTrades();
  const updated = current.map((t) => (t.id === trade.id ? trade : t));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('trades_updated'));
  }
  return updated;
}

export function deleteStoredTrade(id: string): Trade[] {
  const current = getStoredTrades();
  const updated = current.filter((t) => t.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('trades_updated'));
  }
  return updated;
}
