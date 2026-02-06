# Budgeify v4.0 — Implementation Plan: The Apple/HubX Evolution

## Current State Diagnosis

| Area | Status | Root Cause |
|------|--------|------------|
| **Oracle Core** | Dated arrow-based layout | SVG lines + circular convergence → looks like a wiring diagram, not premium hardware |
| **Flat Black Void** | No depth or atmosphere | Body is `#050505` flat, `.noise-overlay` exists in CSS but never applied globally, nothing behind glass cards |
| **Income Edit/Delete** | Broken | `DataSyncProvider` exposes `createIncome` + `removeIncome` but **no** `updateIncome`. No edit UI exists for income items |
| **Goals Failing** | Bug | `GoalIdSchema = z.string().uuid()` may reject non-UUID temp IDs; DataSyncProvider error handling double-throws |
| **Profile Menu** | Black-on-black | Clerk `UserButton` popover uses `!bg-zinc-900` with `colorBackground: '#0A0A0F'` — invisible on dark bg |
| **Currency** | Partially wired | Store has `currency`/`setCurrency`, utils exist, but **no UI** to switch currency |
| **AI Oracle** | Rudimentary | Heuristic string-matching in `src/lib/oracle/`, no dynamic actions, no spending alerts |
| **income.ts / expense.ts** | Legacy pattern | Still use `throw` instead of `ActionResult<T>` — inconsistent with `goal.ts` |

---

## Milestone Breakdown

### M1: Skills Overhaul — Define v4.0 Standards
> *"Skills before code."*

**Files to update/create:**
- **`skills/ui/styles.md`** → v4.0: Add **Depth Layer System** (body mesh gradient, noise texture on body, VisionOS-inspired inner light), **Chip Core Assembly spec**, updated color ratios
- **`skills/ui/oracle.md`** (NEW) → Oracle Chip Core v4.0 visual spec: concentric silicon rings, layered z-depth via `layoutId`, glow traces, 3-state machine (dormant → assembling → active)
- **`skills/api/README.md`** → v4.0: Mandate `ActionResult<T>` + Zod for **all** server actions (income, expense, goal)
- **`CONVENTIONS.md`** → Bump to v4.0, update Section 7 (UI) with depth system reference, update Section 3 (API) to require ActionResult universally

**Commit:** `chore(v4.0): M1 skills overhaul and v4.0 standards`

---

### M2: Infrastructure Repair — ActionResult Migration + Bug Fixes
> *Fix the foundation before building on it.*

**Technical Logic:**

1. **`src/actions/income.ts`** — Full rewrite to ActionResult<T> + Zod:
   - Add `resolveUserId()` helper (same pattern as `goal.ts`)
   - Add `CreateIncomeSchema`, `UpdateIncomeSchema` with Zod
   - All functions return `ActionResult<T>` — never throw
   - Turkish user-facing errors, English server logs

2. **`src/actions/expense.ts`** — Same migration as income

3. **`src/actions/goal.ts`** — Fix the UUID validation bug:
   - `GoalIdSchema = z.string().uuid()` rejects temp IDs from optimistic updates
   - DataSyncProvider catches + re-throws causing double error propagation

4. **`src/providers/DataSyncProvider.tsx`** — Unify all operations to ActionResult:
   - `createIncome`, `createExpense` switch from try/catch-throw to ActionResult check
   - **Add** `updateIncome(id, data)` and `updateExpense(id, data)` methods to context
   - Fix goal error double-propagation

5. **`src/actions/index.ts`** — Ensure all new exports are wired

**Commit:** `refactor(v4.0): M2 ActionResult migration for income + expense + goal bugfix`

---

### M3: Income & Goal CRUD — Full Stability
> *Every data operation works end-to-end.*

**Technical Logic:**

1. **`src/components/features/income/IncomeList.tsx`** (NEW) — Swipeable/tappable income items with edit/delete:
   - Uses `useDataSync().removeIncome(id)` for delete
   - Uses `useDataSync().updateIncome(id, data)` for edit
   - Inline edit mode or drawer-based editing

2. **`src/components/features/income/MainSalaryForm.tsx`** — Add edit mode:
   - Accept optional `editingIncome?: Income` prop
   - Pre-fill form when editing
   - Call `updateIncome` instead of `createIncome` when in edit mode

3. **`src/components/features/goals/GoalCard.tsx`** — Verify edit/delete wiring:
   - Wire `removeGoal` from DataSyncProvider
   - Add "Add savings" button using `addToGoal`

4. **`src/components/features/goals/GoalForm.tsx`** — Verify end-to-end:
   - Confirm `icon` field passes validation
   - Test with and without targetDate

5. **Dashboard page** — Wire IncomeList into Transactions tab (incomes view)

**Commit:** `feat(v4.0): M3 income CRUD UI + goal stability`

---

### M4: Depth Layer System — Break the Flat Black
> *"From amateur void to VisionOS atmosphere."*

**Technical Logic:**

1. **`src/app/globals.css`** — Body depth overhaul:
   - Body background: subtle radial gradient (`radial-gradient(ellipse at 50% 0%, #0a0a1a 0%, #050508 50%, #000000 100%)`)
   - Apply `.noise-overlay::after` to body (currently exists but unused)
   - Add `mesh-gradient-bg` class with animated indigo/violet mesh blobs (very subtle, opacity 0.03-0.05)
   - Update glass levels: add `inner-glow` with `inset 0 1px 0 rgba(255,255,255,0.06)` for top-edge light catch

2. **`src/components/layout/Header.tsx`** — Fix Clerk UserButton popover:
   - `colorBackground: '#1a1a2e'` (lighter, visible)
   - `userButtonPopoverCard: '!bg-[#1a1a2e] border border-white/15 shadow-2xl'`
   - Ensure action button text is `!text-zinc-100`

3. **`src/app/layout.tsx`** or `PageWrapper` — Add ambient background layer:
   - Fixed position div with subtle gradient orbs (indigo at top, violet at bottom-right)
   - Opacity 0.04-0.06 — barely visible but kills the flat black

4. **Update `skills/ui/styles.md`** — Document the depth system

**Commit:** `style(v4.0): M4 depth layer system + profile menu fix`

---

### M5: Oracle Chip Core v4.0 — Premium Assembly
> *"From arrows to silicon. From diagram to hardware."*

**Technical Logic:**

1. **`src/components/features/oracle/OracleHero.tsx`** — Complete redesign:
   - **Concentric rings**: 3 rotating rings at different speeds (CSS `@keyframes` for 60fps)
   - **Central die**: Indigo gradient "processor" with subtle glow pulse
   - **Module chips** arrive from edges on scroll, dock into ring positions using `layoutId`
   - **3-state machine**: `dormant` (rings dim, no modules) → `assembling` (modules flying in, rings brightening) → `active` (all docked, full glow)
   - Use `useScroll` + `useTransform` for state transitions
   - Data readout: balance/savings overlaid on core when active

2. **`src/components/features/oracle/OracleModuleChip.tsx`** — Hardware aesthetic:
   - Rounded-xl with subtle circuit-trace border animation on dock
   - Glow intensifies when docked (color-matched: emerald for income, rose for expense, etc.)
   - `layoutId={mod.id}` for smooth position transitions
   - Haptic-like `whileTap` feedback

3. **New CSS in `globals.css`**:
   - `.chip-ring` — rotating border with dash-array animation
   - `.silicon-glow` — multi-layer indigo shadow cascade

**Commit:** `feat(v4.0): M5 Oracle Chip Core v4.0 premium assembly`

---

### M6: Currency Globalization
> *"1-click TRY ↔ USD ↔ EUR."*

**Technical Logic:**

1. **`src/lib/currency.ts`** (NEW):
   - Static exchange rates object: `{ TRY_USD: 0.028, TRY_EUR: 0.026, ... }`
   - `convertAmount(amount, from, to)` function
   - Option to fetch live rates from a free API (future enhancement)

2. **`src/components/ui/CurrencySelector.tsx`** (NEW):
   - 3-button pill group: ₺ | $ | €
   - Calls `useBudgetStore.setCurrency()`
   - Animated active indicator

3. **Integration points:**
   - `MainBalanceCard` — already reads `currency` from store ✓
   - `MainSalaryForm` — already reads `symbol` ✓
   - `GoalForm` — already reads `symbol` ✓
   - `ExpenseForm` / `ExpenseList` — verify and wire
   - Add `CurrencySelector` to Header or Settings area

4. **Store persistence** — `currency` already persisted via Zustand persist middleware ✓

**Commit:** `feat(v4.0): M6 currency globalization TRY/USD/EUR`

---

### M7: Oracle AI v2.0 — Context-Aware Financial Advisor
> *"From chatbot to command center."*

**Technical Logic:**

1. **`src/lib/oracle/insights.ts`** — Enhanced analysis:
   - Spending velocity detection (are you spending faster this month?)
   - Category anomaly alerts (unusual spike in a category)
   - Goal pace calculation (on-track / behind / ahead)
   - Savings opportunity detection

2. **`src/lib/oracle/actions.ts`** (NEW) — Dynamic suggested actions:
   - "Set a ₺5,000 savings goal" → opens GoalForm pre-filled
   - "Cut dining expenses by 20%" → shows category breakdown
   - Action callbacks that integrate with drawer/tab system

3. **`src/components/features/ai/AIAssistant.tsx`** — v2.0 upgrade:
   - Action buttons in assistant responses (not just text)
   - Mini spending chart inline in responses
   - Proactive alerts: "You've spent 80% of your typical monthly dining budget"

4. **`src/components/features/oracle/OracleInsightCard.tsx`** — Dashboard insight widget:
   - Top 1-2 insights displayed as glass cards below Oracle Core
   - Tap to open AIAssistant with context pre-loaded

**Commit:** `feat(v4.0): M7 Oracle AI v2.0 context-aware advisor`

---

## Execution Order & Dependencies

```
M1 (Skills) ─────► M2 (Infrastructure) ─────► M3 (CRUD UI)
                         │                          │
                         ▼                          ▼
                    M4 (Depth System)          M6 (Currency)
                         │
                         ▼
                    M5 (Chip Core) ─────► M7 (AI v2.0)
```

**Each milestone = 1 atomic commit + push → Vercel stays green.**

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| Oracle Chip Core too complex for mobile | Simplified mobile variant: fade-in only, no scroll assembly |
| Exchange rate staleness | Start with static rates, add API fetch in v4.1 |
| AI actions triggering unintended state changes | All AI actions require user confirmation tap |
| ActionResult migration breaks existing flows | DataSyncProvider already handles both patterns; migrate + test incrementally |

---

**This document serves as the v4.0 constitution. All development must follow this plan.**
