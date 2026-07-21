import { createFileRoute } from "@tanstack/react-router";
import { Flame, Shield, Sparkles, Target, TrendingUp, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Progress } from "@/components/ui/progress";
import { MOCK_ACHIEVEMENTS, MOCK_GOALS } from "@/data/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Goals — Fortex Journal" },
      { name: "description", content: "Set trading goals and unlock achievements." },
    ],
  }),
  component: GoalsPage,
});

const iconMap: Record<string, LucideIcon> = {
  trophy: Trophy,
  flame: Flame,
  shield: Shield,
  target: Target,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
};

function GoalsPage() {
  const unlocked = MOCK_ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <>
      <PageHeader
        title="Goals & Achievements"
        description="Track your trading milestones and celebrate wins."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryStat label="Active Goals" value={MOCK_GOALS.length.toString()} />
        <SummaryStat label="Completion" value="63%" />
        <SummaryStat label="Achievements" value={`${unlocked}/${MOCK_ACHIEVEMENTS.length}`} />
        <SummaryStat label="Best Streak" value="12" />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Goals
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MOCK_GOALS.map((g) => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          return (
            <div key={g.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{g.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{g.description}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                  {g.category}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between text-sm">
                <div>
                  <span className="text-2xl font-bold tabular-nums">
                    {g.unit === "USD" ? formatCurrency(g.current) : `${g.current}${g.unit === "%" ? "%" : ""}`}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    / {g.unit === "USD" ? formatCurrency(g.target) : `${g.target}${g.unit === "%" ? "%" : ""}`}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Due {formatDate(g.deadline)}</span>
              </div>
              <Progress value={pct} className="mt-3 h-2" />
              <div className="mt-2 text-right text-xs font-medium text-primary">{pct.toFixed(0)}%</div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Achievements
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {MOCK_ACHIEVEMENTS.map((a) => {
          const Icon = iconMap[a.icon] ?? Trophy;
          return (
            <div
              key={a.id}
              className={cn(
                "glass flex flex-col items-center rounded-2xl p-4 text-center",
                !a.unlocked && "opacity-40",
              )}
            >
              <div
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-2xl",
                  a.unlocked ? "gradient-primary shadow-[var(--shadow-glow)]" : "bg-muted",
                )}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="mt-3 text-xs font-semibold">{a.title}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{a.description}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-2xl font-bold">{value}</div>
    </div>
  );
}
