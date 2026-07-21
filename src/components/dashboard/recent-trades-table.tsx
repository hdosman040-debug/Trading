import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DirectionBadge, StatusBadge } from "@/components/common/trade-badges";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { Trade } from "@/types";
import { cn } from "@/lib/utils";

export function RecentTradesTable({ trades }: { trades: Trade[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead>Pair</TableHead>
            <TableHead>Side</TableHead>
            <TableHead className="text-right">RR</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((t) => (
            <TableRow key={t.id} className="border-border/40">
              <TableCell className="font-medium">{t.pair}</TableCell>
              <TableCell><DirectionBadge direction={t.direction} /></TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(t.rr, 2)}</TableCell>
              <TableCell
                className={cn(
                  "text-right font-semibold tabular-nums",
                  t.profit > 0 ? "text-success" : t.profit < 0 ? "text-danger" : "",
                )}
              >
                {formatCurrency(t.profit, { sign: true })}
              </TableCell>
              <TableCell className="text-muted-foreground">{t.session}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(t.date)}</TableCell>
              <TableCell><StatusBadge status={t.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
