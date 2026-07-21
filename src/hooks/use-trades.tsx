import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { MOCK_TRADES } from "@/data/mock";
import type { Trade } from "@/types";

// TODO(backend): replace this in-memory store with server-backed queries + mutations.
interface TradesContext {
  trades: Trade[];
  addTrade: (t: Omit<Trade, "id">) => void;
  updateTrade: (id: string, patch: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
}

const Ctx = createContext<TradesContext | null>(null);

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);

  const value = useMemo<TradesContext>(
    () => ({
      trades,
      addTrade: (t) =>
        setTrades((prev) => [{ ...t, id: `t-${Date.now()}` }, ...prev]),
      updateTrade: (id, patch) =>
        setTrades((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x))),
      deleteTrade: (id) => setTrades((prev) => prev.filter((x) => x.id !== id)),
    }),
    [trades],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTrades() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTrades must be used within TradesProvider");
  return ctx;
}
