import { cn } from "@/lib/utils";
import type { Direction, TradeStatus } from "@/types";

export function DirectionBadge({ direction }: { direction: Direction }) {
  const isLong = direction === "LONG";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold tracking-wide",
        isLong ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
      )}
    >
      {direction}
    </span>
  );
}

export function StatusBadge({ status }: { status: TradeStatus }) {
  const map: Record<TradeStatus, string> = {
    WIN: "bg-success/15 text-success",
    LOSS: "bg-danger/15 text-danger",
    BREAKEVEN: "bg-muted text-muted-foreground",
    OPEN: "bg-primary/15 text-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold tracking-wide",
        map[status],
      )}
    >
      {status}
    </span>
  );
}
