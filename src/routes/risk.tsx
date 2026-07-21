import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, Scale, Coins, Ruler } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Risk Calculator — Fortex Journal" },
      { name: "description", content: "Risk, lot size, pip, and position calculators for forex traders." },
    ],
  }),
  component: RiskPage,
});

function RiskPage() {
  return (
    <>
      <PageHeader title="Risk Calculator" description="Plan every trade before you take it." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RiskAmountCard />
        <LotSizeCard />
        <PipValueCard />
        <PositionSizeCard />
      </div>
    </>
  );
}

function CalcCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 rounded-xl gradient-primary p-4 text-white shadow-[var(--shadow-glow)]">
      <div className="text-xs uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function RiskAmountCard() {
  const [balance, setBalance] = useState(10000);
  const [risk, setRisk] = useState(1);
  const amount = balance * (risk / 100);
  return (
    <CalcCard title="Risk Amount" icon={Calculator}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Account Balance ($)</Label>
          <Input type="number" value={balance} onChange={(e) => setBalance(+e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Risk %</Label>
          <Input type="number" step="0.1" value={risk} onChange={(e) => setRisk(+e.target.value)} />
        </div>
      </div>
      <Result label="Risk per Trade" value={formatCurrency(amount)} />
    </CalcCard>
  );
}

function LotSizeCard() {
  const [risk, setRisk] = useState(100);
  const [stop, setStop] = useState(20);
  const [pipValue, setPipValue] = useState(10);
  const lots = stop > 0 && pipValue > 0 ? risk / (stop * pipValue) : 0;
  return (
    <CalcCard title="Lot Size" icon={Scale}>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Risk ($)</Label>
          <Input type="number" value={risk} onChange={(e) => setRisk(+e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Stop (pips)</Label>
          <Input type="number" value={stop} onChange={(e) => setStop(+e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Pip Value</Label>
          <Input type="number" value={pipValue} onChange={(e) => setPipValue(+e.target.value)} />
        </div>
      </div>
      <Result label="Lot Size" value={formatNumber(lots, 2)} />
    </CalcCard>
  );
}

function PipValueCard() {
  const [lots, setLots] = useState(1);
  const [contract, setContract] = useState(100000);
  const [pipDecimal, setPipDecimal] = useState(0.0001);
  const value = lots * contract * pipDecimal;
  return (
    <CalcCard title="Pip Value" icon={Ruler}>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Lots</Label>
          <Input type="number" step="0.01" value={lots} onChange={(e) => setLots(+e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Contract</Label>
          <Input type="number" value={contract} onChange={(e) => setContract(+e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Pip (decimal)</Label>
          <Input type="number" step="0.0001" value={pipDecimal} onChange={(e) => setPipDecimal(+e.target.value)} />
        </div>
      </div>
      <Result label="Pip Value" value={formatCurrency(value)} />
    </CalcCard>
  );
}

function PositionSizeCard() {
  const [balance, setBalance] = useState(10000);
  const [risk, setRisk] = useState(2);
  const [stopPips, setStopPips] = useState(25);
  const [pipValue, setPipValue] = useState(10);
  const riskAmt = balance * (risk / 100);
  const size = stopPips > 0 && pipValue > 0 ? riskAmt / (stopPips * pipValue) : 0;
  return (
    <CalcCard title="Position Size" icon={Coins}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Balance ($)</Label>
          <Input type="number" value={balance} onChange={(e) => setBalance(+e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Risk %</Label>
          <Input type="number" step="0.1" value={risk} onChange={(e) => setRisk(+e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Stop (pips)</Label>
          <Input type="number" value={stopPips} onChange={(e) => setStopPips(+e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Pip Value</Label>
          <Input type="number" value={pipValue} onChange={(e) => setPipValue(+e.target.value)} />
        </div>
      </div>
      <Result label="Position Size (lots)" value={formatNumber(size, 2)} />
      <Button variant="ghost" size="sm" className="mt-2 w-full text-xs text-muted-foreground">
        Risk amount: {formatCurrency(riskAmt)}
      </Button>
    </CalcCard>
  );
}
