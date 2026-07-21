import { MOCK_DAILY_PNL } from "@/data/mock";
import { cn } from "@/lib/utils";

function colorFor(pnl: number) {
  if (pnl === 0) return "bg-muted/40";
  const magnitude = Math.min(1, Math.abs(pnl) / 500);
  if (pnl > 0) {
    if (magnitude > 0.75) return "bg-success";
    if (magnitude > 0.5) return "bg-success/70";
    if (magnitude > 0.25) return "bg-success/50";
    return "bg-success/30";
  }
  if (magnitude > 0.75) return "bg-danger";
  if (magnitude > 0.5) return "bg-danger/70";
  if (magnitude > 0.25) return "bg-danger/50";
  return "bg-danger/30";
}

export function CalendarHeatmap() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(14px,1fr))] gap-1">
      {MOCK_DAILY_PNL.map((d) => (
        <div
          key={d.date}
          title={`${d.date} · ${d.pnl >= 0 ? "+" : ""}$${d.pnl.toFixed(0)} · ${d.trades} trades`}
          className={cn("aspect-square rounded-[3px] transition-transform hover:scale-125", colorFor(d.pnl))}
        />
      ))}
    </div>
  );
}
