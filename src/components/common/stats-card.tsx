import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  delta?: number; // percent
  icon?: LucideIcon;
  accent?: "primary" | "success" | "danger" | "accent";
  children?: ReactNode;
}

const accentMap: Record<NonNullable<StatsCardProps["accent"]>, string> = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  danger: "text-danger bg-danger/10",
  accent: "text-accent bg-accent/10",
};

export function StatsCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "primary",
  children,
}: StatsCardProps) {
  const isUp = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass group relative overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-elegant)] transition-all hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 truncate text-2xl font-bold tracking-tight">{value}</div>
        </div>
        {Icon && (
          <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", accentMap[accent])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {typeof delta === "number" && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5",
              isUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
            )}
          >
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  );
}
