import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Frown, Meh, Smile, SmilePlus, Angry } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MOCK_MOODS } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/psychology")({
  head: () => ({
    meta: [
      { title: "Psychology — Fortex Journal" },
      { name: "description", content: "Track your trading mindset, mood, and reflections." },
    ],
  }),
  component: PsychologyPage,
});

const moods: { id: string; label: string; icon: LucideIcon; color: string }[] = [
  { id: "great", label: "Great", icon: SmilePlus, color: "text-success" },
  { id: "good", label: "Good", icon: Smile, color: "text-primary" },
  { id: "neutral", label: "Neutral", icon: Meh, color: "text-muted-foreground" },
  { id: "bad", label: "Bad", icon: Frown, color: "text-accent" },
  { id: "terrible", label: "Terrible", icon: Angry, color: "text-danger" },
];

function PsychologyPage() {
  const today = MOCK_MOODS[0]!;
  const [mood, setMood] = useState<string>(today.mood);
  const [confidence, setConfidence] = useState<number[]>([today.confidence]);
  const [discipline, setDiscipline] = useState<number[]>([today.discipline]);
  const [notes, setNotes] = useState<string>(today.notes);

  return (
    <>
      <PageHeader title="Psychology Journal" description="A calm mind is your biggest edge." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Today's Mood</h3>
          <p className="text-xs text-muted-foreground">How do you feel about your trading today?</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {moods.map((m) => {
              const Icon = m.icon;
              const active = mood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border border-border/50 p-3 transition-all hover:scale-105",
                    active && "border-primary bg-primary/10",
                  )}
                >
                  <Icon className={cn("h-6 w-6", m.color)} />
                  <span className="text-[11px] font-medium">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold">Weekly Streak</h3>
          <div className="mt-3 text-4xl font-black gradient-text">7 days</div>
          <p className="mt-1 text-xs text-muted-foreground">Consistent journaling. Keep going!</p>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold">Confidence Level</h3>
          <div className="mt-4 text-3xl font-bold tabular-nums">{confidence[0]}%</div>
          <Slider value={confidence} onValueChange={setConfidence} max={100} step={1} className="mt-3" />
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold">Discipline Score</h3>
          <div className="mt-4 text-3xl font-bold tabular-nums">{discipline[0]}%</div>
          <Slider value={discipline} onValueChange={setDiscipline} max={100} step={1} className="mt-3" />
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold">Focus Areas</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Stick to plan</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Wait for A+ setups</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Journal every trade</li>
          </ul>
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-3">
          <h3 className="text-sm font-semibold">Trading Notes</h3>
          <p className="text-xs text-muted-foreground">Capture how you traded and why.</p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="mt-3"
            placeholder="Reflect on today's decisions…"
          />
          <div className="mt-3 flex justify-end">
            {/* TODO(backend): persist mood + notes for the day */}
            <Button className="gradient-primary text-white">Save Entry</Button>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Weekly Reflection</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This week I found my edge in the London session. Trend-follow setups with clear H1 structure
            paid the most. I over-traded on Thursday and gave back gains — will size down after 2 losses.
          </p>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold">Monthly Reflection</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Best month in six. Sticking to 1% risk and journaling nightly are the two habits that moved
            the needle. Next month: refine SMC entries and reduce Sydney trades.
          </p>
        </div>
      </div>
    </>
  );
}
