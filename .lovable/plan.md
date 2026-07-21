# Forex Trading Journal — Frontend Skeleton

A premium, dark-only fintech SaaS frontend using the project's existing stack, mock data only, no backend.

## Stack note (important adaptation)

The project template uses **TanStack Router + TanStack Start**, not React Router DOM. Swapping in React Router DOM would break the SSR shell, route tree, and build. I'll keep TanStack Router (file-based routing under `src/routes/`) — the developer ergonomics are the same (`<Link>`, `useNavigate`) and all other requested libraries (Tailwind, shadcn/ui, Framer Motion, Recharts, React Hook Form, Zod) will be used as specified. If you'd rather scrap TanStack and use React Router DOM, say so and I'll restructure.

Framer Motion, Recharts, React Hook Form, and Zod will be added via `bun add`.

## Design system

Update `src/styles.css` tokens (dark-only, force `.dark` on `<html>`):

- `--background` #0B1120, `--card` #111827, `--primary` #3B82F6
- Add `--success` #10B981, `--danger` #EF4444, `--accent` #8B5CF6
- Register in `@theme inline` so `bg-success`, `text-danger`, etc. work
- Add gradient + shadow tokens (`--gradient-primary`, `--shadow-glow`) and a `.glass` utility (bg white/5, backdrop-blur-xl, border white/10)
- Import Inter via `<link>` in `__root.tsx` head; set `--font-sans`

## Folder structure

```text
src/
  routes/                 # TanStack file-based routes (pages)
    __root.tsx            # shell + <AppLayout>
    index.tsx             # Dashboard
    journal.tsx
    analytics.tsx
    calendar.tsx
    risk.tsx
    goals.tsx
    psychology.tsx
    settings.tsx
  components/
    layout/               # AppSidebar, Topbar, MobileDrawer, ProfileMenu
    ui/                   # shadcn primitives (already present)
    common/               # StatsCard, ChartCard, DataTable, SearchInput,
                          # Modal, EmptyState, LoadingSkeleton, SectionHeader
    dashboard/            # EquityCurve, PerformanceChart, CalendarHeatmap,
                          # RecentTradesTable
    journal/              # TradesTable, TradeFormDialog, TradeDetailsDialog,
                          # DeleteTradeDialog, FilterPopover
    analytics/            # WinRateCard, PairPerformance, SessionPerformance,
                          # StrategyPerformance, MonthlyProfit, Heatmap
    risk/                 # RiskCalculator, LotSizeCalculator, PipCalculator,
                          # PositionSizeCalculator
    goals/                # GoalCard, AchievementBadge
    psychology/           # MoodCard, ConfidenceCard, DisciplineCard,
                          # NotesCard, ReflectionCard
    settings/             # ProfileForm, AccountForm, AppearanceForm,
                          # NotificationsForm, DataIO, DangerZone
  data/                   # mock: trades, stats, goals, moods, equity, calendar
  types/                  # Trade, Goal, MoodEntry, Stats, etc.
  hooks/                  # useTrades (mock CRUD), useStats, useMediaQuery
  lib/                    # formatters (currency, pips, dates), cn
  utils/                  # calc helpers (risk, lot, pip, position size)
  services/               # TODO stubs for backend calls (return mock)
  assets/
```

## Layout & navigation

- `__root.tsx` wraps `<Outlet />` in `AppLayout` (sidebar + topbar). Force dark by adding `class="dark"` to `<html>` in `RootShell`.
- `AppSidebar`: shadcn Sidebar (`collapsible="icon"`), nav items with lucide icons, active-state via `useRouterState`, gradient logo.
- `Topbar`: `SidebarTrigger`, `SearchInput` (command-style), notification bell (badge dot), `ProfileMenu` (dropdown).
- Mobile: sidebar switches to drawer via shadcn built-in Sheet behavior.
- Framer Motion page transitions in `AppLayout` (`AnimatePresence` on pathname).

## Pages (mock data only)

**Dashboard (`/`)** — 8 StatsCards (Today/Weekly/Monthly Profit, Total Trades, Win Rate, Avg RR, Profit Factor, Streak) with sparkline + delta chip; EquityCurve (Recharts area), PerformanceChart (bar), CalendarHeatmap (grid of divs colored by pnl bucket), RecentTradesTable (last 8).

**Trade Journal (`/journal`)** — DataTable with columns Pair, Direction (badge), Entry, Exit, Risk, RR, Profit (colored), Session, Strategy, Date, Status. Toolbar: SearchInput, Filter popover (pair/session/status), Sort dropdown, "New Trade" button. Pagination footer. New/Edit dialog uses React Hook Form + Zod schema. Details dialog shows trade summary. Delete confirm dialog. All state in `useTrades` hook (in-memory).

**Analytics (`/analytics`)** — grid of ChartCards: EquityCurve (line), BalanceCurve (area), WinRate (donut), PairPerformance (horizontal bar), SessionPerformance (bar), StrategyPerformance (bar), MonthlyProfit (bar), Heatmap. All Recharts + fake data.

**Calendar (`/calendar`)** — month grid, each day colored by daily pnl, hover shows trade count; side panel lists trades for selected day.

**Risk Calculator (`/risk`)** — 4 cards, each a React Hook Form + Zod: Risk %, Lot Size, Pip Value, Position Size. Compute client-side, display result panel.

**Goals (`/goals`)** — GoalCards (title, target, current, Progress bar, deadline), AchievementBadges grid, summary stats row. "New Goal" dialog.

**Psychology (`/psychology`)** — Daily Mood (emoji selector), Confidence + Discipline sliders, Trading Notes textarea, Weekly & Monthly Reflection cards. Save to local mock store.

**Settings (`/settings`)** — Tabs: Profile, Account, Appearance (theme locked to dark w/ note), Notifications (switches), Data (Export/Import buttons — TODO), Danger Zone (destructive card).

**404** — already in `__root.tsx`; restyle to match theme with gradient.

## Reusable components

StatsCard, ChartCard, DataTable (generic w/ column config), SearchInput, Modal (thin Dialog wrapper), EmptyState, LoadingSkeleton, SectionHeader, GradientButton variant, Badge variants (success/danger/accent).

## Quality

- Strict TS, no `any` in public APIs
- Mobile-first, sidebar collapses < md
- Framer Motion for card entrance + page transitions
- Recharts with theme-aware colors from CSS vars
- `// TODO(backend):` comments in `services/` and mutation hooks
- All routes register with `createFileRoute` and add `head()` metadata (unique title/description per page)
- Update `__root.tsx` head defaults away from "Lovable App"

## Out of scope

No Supabase, no auth, no persistence beyond in-memory hooks, no real-time data, no chart interactions beyond Recharts defaults.

Before finishing, ensure:

- The project builds successfully with no TypeScript errors.

- There are no placeholder imports that cause compilation failures.

- Every navigation link works.

- Every page is responsive on mobile.

- All charts render using mock data.

- All dialogs open and close correctly.

- The code is clean, modular, and ready for future Supabase integration.

- Avoid duplicate components and unnecessary complexity.

- Use lazy loading for routes where appropriate.

&nbsp;