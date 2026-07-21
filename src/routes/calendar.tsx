import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useTrades } from "@/hooks/use-trades";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Fortex Journal" },
      { name: "description", content: "Daily P&L calendar view of your trading activity." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { trades } = useTrades();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const days = useMemo(() => {
    const first = new Date(cursor);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = new Date(cursor.getFullYear(), cursor.getMonth(), d).toISOString().slice(0, 10);
      cells.push(iso);
    }
    return cells;
  }, [cursor]);

  const dayMap = useMemo(() => {
    const map = new Map<string, { pnl: number; count: number }>();
    for (const t of trades) {
      const key = t.date.slice(0, 10);
      const cur = map.get(key) ?? { pnl: 0, count: 0 };
      cur.pnl += t.profit;
      cur.count += 1;
      map.set(key, cur);
    }
    return map;
  }, [trades]);

  const selectedTrades = selected
    ? trades.filter((t) => t.date.slice(0, 10) === selected)
    : [];

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Click a day to see the trades logged that session."
        actions={
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[140px] text-center text-sm font-semibold">{monthLabel}</div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((iso, i) => {
              if (!iso) return <div key={i} />;
              const info = dayMap.get(iso);
              const pnl = info?.pnl ?? 0;
              const isSelected = selected === iso;
              return (
                <button
                  key={iso}
                  onClick={() => setSelected(iso)}
                  className={cn(
                    "flex aspect-square flex-col items-start justify-between rounded-lg border border-border/30 p-1.5 text-left text-xs transition-all hover:scale-[1.03]",
                    info && pnl > 0 && "bg-success/15 border-success/30",
                    info && pnl < 0 && "bg-danger/15 border-danger/30",
                    info && pnl === 0 && "bg-muted/20",
                    !info && "bg-transparent",
                    isSelected && "ring-2 ring-primary",
                  )}
                >
                  <span className="font-semibold">{parseInt(iso.slice(8, 10))}</span>
                  {info && (
                    <span
                      className={cn(
                        "truncate text-[10px] font-medium tabular-nums",
                        pnl > 0 ? "text-success" : pnl < 0 ? "text-danger" : "text-muted-foreground",
                      )}
                    >
                      {pnl >= 0 ? "+" : ""}{pnl.toFixed(0)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-semibold">
            {selected ?? "Select a day"}
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">
            {selectedTrades.length} trades
          </p>
          <div className="space-y-2">
            {selectedTrades.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg bg-muted/20 p-2.5 text-sm">
                <div>
                  <div className="font-medium">{t.pair}</div>
                  <div className="text-xs text-muted-foreground">{t.strategy}</div>
                </div>
                <div className={cn("font-semibold tabular-nums", t.profit >= 0 ? "text-success" : "text-danger")}>
                  {formatCurrency(t.profit, { sign: true })}
                </div>
              </div>
            ))}
            {selected && selectedTrades.length === 0 && (
              <p className="text-xs text-muted-foreground">No trades on this day.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
