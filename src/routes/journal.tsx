import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowUpDown, Filter, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DirectionBadge, StatusBadge } from "@/components/common/trade-badges";
import { useTrades } from "@/hooks/use-trades";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Trade Journal — Fortex Journal" },
      { name: "description", content: "Log, review, and edit every trade with rich detail." },
    ],
  }),
  component: JournalPage,
});

const TradeSchema = z.object({
  pair: z.string().min(3, "Required"),
  direction: z.enum(["LONG", "SHORT"]),
  entry: z.coerce.number().positive(),
  exit: z.coerce.number().positive(),
  risk: z.coerce.number().positive(),
  rr: z.coerce.number().min(0),
  profit: z.coerce.number(),
  session: z.enum(["London", "New York", "Asia", "Sydney"]),
  strategy: z.string().min(2, "Required"),
  status: z.enum(["WIN", "LOSS", "BREAKEVEN", "OPEN"]),
  notes: z.string().optional(),
});
type TradeInput = z.infer<typeof TradeSchema>;

const PAGE_SIZE = 10;

function JournalPage() {
  const { trades, addTrade, updateTrade, deleteTrade } = useTrades();
  const [query, setQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [viewing, setViewing] = useState<Trade | null>(null);
  const [deleting, setDeleting] = useState<Trade | null>(null);

  const filtered = useMemo(() => {
    let out = trades.filter((t) => {
      if (query && !t.pair.toLowerCase().includes(query.toLowerCase()) && !t.strategy.toLowerCase().includes(query.toLowerCase())) return false;
      if (sessionFilter !== "all" && t.session !== sessionFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      return true;
    });
    out = out.sort((a, b) =>
      sortDesc ? +new Date(b.date) - +new Date(a.date) : +new Date(a.date) - +new Date(b.date),
    );
    return out;
  }, [trades, query, sessionFilter, statusFilter, sortDesc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Trade Journal"
        description={`${filtered.length} trades logged`}
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className="gradient-primary text-white shadow-[var(--shadow-glow)]"
          >
            <Plus className="mr-1.5 h-4 w-4" /> New Trade
          </Button>
        }
      />

      <div className="glass mb-4 flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pair or strategy…"
            className="pl-9"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-1.5 h-3.5 w-3.5" /> Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Session</Label>
              <Select value={sessionFilter} onValueChange={setSessionFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sessions</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="Sydney">Sydney</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="WIN">Win</SelectItem>
                  <SelectItem value="LOSS">Loss</SelectItem>
                  <SelectItem value="BREAKEVEN">Breakeven</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="sm" onClick={() => setSortDesc((v) => !v)}>
          <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" /> {sortDesc ? "Newest" : "Oldest"}
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Pair</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">Exit</TableHead>
                <TableHead className="text-right">Risk</TableHead>
                <TableHead className="text-right">RR</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer border-border/40"
                  onClick={() => setViewing(t)}
                >
                  <TableCell className="font-medium">{t.pair}</TableCell>
                  <TableCell><DirectionBadge direction={t.direction} /></TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(t.entry, 4)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(t.exit, 4)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(t.risk)}</TableCell>
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
                  <TableCell className="text-muted-foreground">{t.strategy}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(t.date)}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setDialogOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-danger" onClick={() => setDeleting(t)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="py-10 text-center text-muted-foreground">
                    No trades match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border/40 p-3 text-sm text-muted-foreground">
          <div>
            Page {currentPage} of {pageCount}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <TradeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSubmit={(values) => {
          if (editing) {
            updateTrade(editing.id, values);
            toast.success("Trade updated");
          } else {
            addTrade({ ...values, date: new Date().toISOString() });
            toast.success("Trade added");
          }
          setDialogOpen(false);
          setEditing(null);
        }}
      />

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trade Details</DialogTitle>
            <DialogDescription>{viewing && formatDate(viewing.date)}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Pair" value={viewing.pair} />
              <Detail label="Direction" value={<DirectionBadge direction={viewing.direction} />} />
              <Detail label="Entry" value={formatNumber(viewing.entry, 4)} />
              <Detail label="Exit" value={formatNumber(viewing.exit, 4)} />
              <Detail label="Risk" value={formatCurrency(viewing.risk)} />
              <Detail label="RR" value={formatNumber(viewing.rr, 2)} />
              <Detail
                label="Profit"
                value={
                  <span className={viewing.profit >= 0 ? "text-success" : "text-danger"}>
                    {formatCurrency(viewing.profit, { sign: true })}
                  </span>
                }
              />
              <Detail label="Status" value={<StatusBadge status={viewing.status} />} />
              <Detail label="Session" value={viewing.session} />
              <Detail label="Strategy" value={viewing.strategy} />
              {viewing.notes && (
                <div className="col-span-2 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                  {viewing.notes}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trade?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The trade will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-danger-foreground hover:bg-danger/90"
              onClick={() => {
                if (deleting) {
                  deleteTrade(deleting.id);
                  toast.success("Trade deleted");
                }
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/20 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function TradeFormDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: Trade | null;
  onSubmit: (values: TradeInput) => void;
}) {
  const form = useForm<TradeInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(TradeSchema) as any,
    values: editing
      ? {
          pair: editing.pair,
          direction: editing.direction,
          entry: editing.entry,
          exit: editing.exit,
          risk: editing.risk,
          rr: editing.rr,
          profit: editing.profit,
          session: editing.session,
          strategy: editing.strategy,
          status: editing.status,
          notes: editing.notes ?? "",
        }
      : {
          pair: "EUR/USD",
          direction: "LONG",
          entry: 1.085,
          exit: 1.09,
          risk: 100,
          rr: 2,
          profit: 200,
          session: "London",
          strategy: "Breakout",
          status: "WIN",
          notes: "",
        },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Trade" : "New Trade"}</DialogTitle>
          <DialogDescription>All fields validated locally. No backend yet.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((v) => onSubmit(v as TradeInput))}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <Field label="Pair"><Input {...form.register("pair")} /></Field>
          <Field label="Direction">
            <Select value={form.watch("direction")} onValueChange={(v) => form.setValue("direction", v as "LONG" | "SHORT")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="LONG">Long</SelectItem>
                <SelectItem value="SHORT">Short</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Entry"><Input type="number" step="0.0001" {...form.register("entry")} /></Field>
          <Field label="Exit"><Input type="number" step="0.0001" {...form.register("exit")} /></Field>
          <Field label="Risk (USD)"><Input type="number" step="0.01" {...form.register("risk")} /></Field>
          <Field label="Risk / Reward"><Input type="number" step="0.01" {...form.register("rr")} /></Field>
          <Field label="Profit (USD)"><Input type="number" step="0.01" {...form.register("profit")} /></Field>
          <Field label="Status">
            <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v as Trade["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="WIN">Win</SelectItem>
                <SelectItem value="LOSS">Loss</SelectItem>
                <SelectItem value="BREAKEVEN">Breakeven</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Session">
            <Select value={form.watch("session")} onValueChange={(v) => form.setValue("session", v as Trade["session"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="London">London</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Sydney">Sydney</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Strategy"><Input {...form.register("strategy")} /></Field>
          <div className="sm:col-span-2">
            <Field label="Notes"><Textarea rows={3} {...form.register("notes")} /></Field>
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-white">
              {editing ? "Save changes" : "Add trade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
