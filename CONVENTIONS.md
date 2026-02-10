# Budgeify - Code Conventions (Project Brain)

> Production-grade standards for Budgeify SaaS development.
> Bu dosya projenin "beyni"dir. Tüm AI asistanlar ve geliştiriciler bu kurallara uymalıdır.

---

## Project Structure

### Execution Zone Principle
- **src/**: **ONLY** directory for functional code execution
- **skills/**: AI assistant skill modules (api, ui, ui/oracle, guard, data, debug, architect, devops)
- **public/**: Static assets only
- **archive/**: All legacy documentation and deprecated files

### Root Directory Standards
```
budgeify/
├── src/                    # 🚀 Execution Zone - ALL functional code
├── skills/                 # 🤖 AI Skill Modules
├── public/                 # 📁 Static Assets
├── CONVENTIONS.md          # 🧠 Project Brain (ONLY documentation in root)
├── package.json            # 📦 Dependencies
├── tsconfig.json           # ⚙️ TypeScript Config
├── drizzle.config.ts       # 🗄️ Database Config
├── next.config.mjs         # ⚡ Next.js Config
├── .gitignore              # 🚫 Git Ignore Rules
└── archive/                # 📚 Legacy Documentation
```

### Forbidden in Root Directory
- ❌ Documentation files (except CONVENTIONS.md)
- ❌ Functional code files
- ❌ Configuration that belongs in src/
- ❌ Test files
- ❌ Utility scripts

---

## 1. TypeScript Standards

### Strict Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Type Requirements
```typescript
// REQUIRED: Explicit function signatures
function calculateBalance(incomes: Income[], expenses: Expense[]): number { }

// REQUIRED: Interface over type for domain objects
interface Income {
  id: string;
  userId: string;
  amount: number;
  categoryId: string;
  description?: string;
  date: string;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// REQUIRED: Discriminated unions for API responses
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// REQUIRED: Zod schemas mirror TypeScript types
const IncomeSchema = z.object({
  amount: z.number().positive("Tutar pozitif olmalı"),
  categoryId: z.string().min(1),
  description: z.string().max(100).optional(),
  date: z.string().datetime(),
  isRecurring: z.boolean().default(false),
});
```

### Prohibited
```typescript
// BLOCKED: any type
const data: any = fetch()           // ❌ YASAK

// BLOCKED: Non-null assertion without check
user!.name                          // ❌ YASAK

// BLOCKED: Type assertion without validation
data as User                        // ❌ YASAK - use Zod or type guards

// BLOCKED: Untyped event handlers
onClick={(e) => {}}                 // ❌ YASAK - explicit React.MouseEvent

// BLOCKED: console.log for error handling
console.log("error:", err)          // ❌ YASAK - use structured error handling
```

---

## 2. React & Next.js 14 Patterns

### Component Structure
```typescript
// 1. Imports (external → internal → types)
// 2. Types/Interfaces
// 3. Component
// 4. No default exports (pages hariç)

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Income } from '@/types';

interface IncomeCardProps {
  income: Income;
  onDelete: (id: string) => void;
}

export function IncomeCard({ income, onDelete }: IncomeCardProps) {
  // 1. Hooks first
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. Handlers
  const handleDelete = async () => { /* ... */ };

  // 3. Render
  return ( /* ... */ );
}
```

### State Management Rules
```
Server data      → Server Actions + revalidatePath (Next.js 14)
Global UI state  → Zustand (persist middleware for client preferences)
Local UI state   → useState / useReducer
Form state       → useState + Zod validation
URL state        → useSearchParams / usePathname
```

### Mandatory State Handling (4-State Pattern)
```typescript
// ALL data-fetching components MUST handle these 4 states:
export function ExpenseList() {
  // ✅ Loading state
  if (isLoading) return <Skeleton className="glass-card h-24" />;

  // ✅ Error state
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  // ✅ Empty state
  if (!expenses?.length) return <EmptyState icon={Receipt} message="Henüz gider yok" />;

  // ✅ Success state
  return <List items={expenses} />;
}
```

### File Naming Conventions
| Type | Format | Example |
|------|--------|---------|
| Component | PascalCase | `MainBalanceCard.tsx` |
| Server Action | camelCase | `income.ts` (in `src/actions/`) |
| Store | camelCase + use | `useBudgetStore.ts` |
| Utility | camelCase | `formatCurrency.ts` |
| Type file | camelCase | `index.ts` |
| Folder | lowercase | `features/income/` |
| DB Schema | camelCase | `schema.ts` |

### Component Size Limit
- **Max 200 lines** per component file
- Extract sub-components when exceeding limit
- Co-locate types with components when small (<10 lines)

---

## 3. API Design (Server Actions)

### Server Action Structure
```typescript
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/db';
import { incomes } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';

const CreateIncomeSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().min(1),
  description: z.string().max(100).optional(),
  date: z.string(),
  isRecurring: z.boolean().default(false),
});

export async function createIncome(input: z.infer<typeof CreateIncomeSchema>) {
  // 1. Auth - ALWAYS FIRST
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' } as const;

  // 2. Validate - ALWAYS with Zod
  const parsed = CreateIncomeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Geçersiz veri' } as const;
  }

  // 3. Execute - ALWAYS with try/catch
  try {
    const [created] = await db.insert(incomes).values({
      ...parsed.data,
      userId,
    }).returning();

    revalidatePath('/dashboard');
    return { success: true, data: created } as const;
  } catch (error) {
    console.error('[createIncome]', { userId, error });
    return { success: false, error: 'Gelir eklenemedi' } as const;
  }
}
```

### Server Action Rules (v4.0 — Universal)
1. **Auth → Validate → Execute → Revalidate** (always this order)
2. **ALL** server actions return `ActionResult<T>` discriminated union — **no exceptions**
3. **NEVER** use `throw` in server actions — always return `{ success: false, error }`
4. **ALL** inputs validated with Zod schemas — no raw input accepted
5. Use `resolveUserId()` helper for auth check
6. User-facing error messages in Turkish
7. Server-side logs in English with context
8. Never expose internal errors to client
9. Always `revalidatePath` after mutations

### API Route Structure (Webhooks only)
```typescript
// src/app/api/webhooks/clerk/route.ts
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  // 1. Verify webhook signature
  // 2. Parse event
  // 3. Handle event type
  // 4. Return 200
}
```

---

## 4. Database Conventions (Drizzle ORM + Neon)

### Schema Design
```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, decimal, boolean, uuid } from 'drizzle-orm/pg-core';

export const incomes = pgTable('incomes', {
  // IDs: Always UUID
  id: uuid('id').defaultRandom().primaryKey(),

  // Foreign keys: Reference Clerk user ID
  userId: text('user_id').notNull(),

  // Money: Always decimal(12,2) - supports up to ₺9,999,999,999.99
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),

  // Timestamps: Always with defaults
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Soft delete
  deletedAt: timestamp('deleted_at'),
});
```

### Query Patterns
```typescript
// REQUIRED: Always filter by userId (multi-tenant)
const userExpenses = await db.select()
  .from(expenses)
  .where(and(
    eq(expenses.userId, userId),
    isNull(expenses.deletedAt)
  ))
  .orderBy(desc(expenses.createdAt))
  .limit(50);

// REQUIRED: Paginate lists
const page = 1;
const limit = 20;
const results = await db.select()
  .from(expenses)
  .where(eq(expenses.userId, userId))
  .offset((page - 1) * limit)
  .limit(limit);

// REQUIRED: Select only needed fields for lists
const summaries = await db.select({
  id: expenses.id,
  amount: expenses.amount,
  date: expenses.date,
}).from(expenses);
```

### Database Rules
1. **Always filter by `userId`** - multi-tenant isolation
2. **Never expose raw DB errors** to client
3. **Use transactions** for multi-table operations
4. **Soft delete** with `deletedAt` timestamp
5. **Money as `decimal(12,2)`** - never float
6. **Migrations** for production, `db:push` for development only

---

## 5. Error Handling

### Server-Side Errors
```typescript
// Structured error logging
console.error('[actionName]', {
  userId,
  operation: 'create',
  input: sanitizedInput,
  error: error instanceof Error ? error.message : 'Unknown error',
});

// Generic messages to client (Turkish)
return { success: false, error: 'İşlem gerçekleştirilemedi' };
```

### Client-Side Errors
```typescript
// Error boundaries for unexpected errors
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>

// Toast notifications for action results (sonner)
import { toast } from 'sonner';

const result = await createIncome(data);
if (result.success) {
  toast.success('Gelir başarıyla eklendi');
} else {
  toast.error(result.error);
}

// Explicit handling for expected errors
if (error) {
  return (
    <div className="glass-card p-6 text-center">
      <p className="text-rose-400">{error.message}</p>
      <Button onClick={retry} variant="ghost">Tekrar Dene</Button>
    </div>
  );
}
```

---

## 6. Security Requirements (Clerk Auth)

### Authentication
```typescript
// EVERY server action - first line
import { auth } from '@clerk/nextjs/server';

export async function protectedAction() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };
  // ...
}
```

### Middleware Protection
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
```

### Authorization
```typescript
// EVERY resource access - verify ownership
const income = await db.select()
  .from(incomes)
  .where(and(
    eq(incomes.id, incomeId),
    eq(incomes.userId, userId)  // ← CRITICAL: ownership check
  ))
  .limit(1);

if (!income.length) {
  return { success: false, error: 'Kayıt bulunamadı' };
}
```

### Input Validation
```typescript
// EVERY external input validated with Zod
const ExpenseSchema = z.object({
  amount: z.number().positive().max(999_999_999),
  categoryId: z.string().uuid(),
  note: z.string().max(200).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const result = ExpenseSchema.safeParse(input);
if (!result.success) {
  return { success: false, error: 'Geçersiz veri' };
}
```

---

## 7. UI & Design System (Sovereign v4.6: The Mechanical Heart)

> **Canonical Source**: `skills/ui/styles.md` — full specifications live there.
> **Oracle Chip Core**: `skills/ui/oracle.md` — Oracle visual spec.
> **v4.6 Execution Spec**: `skills/architect/v46-plan.md` — full milestone details.
> This section is the executive summary.

### Design Vision: Depth Black + Indigo Glow + Glassmorphism
```
"Siyah bir tuval değil, derinliği olan bir atmosfer.
Indigo ışığı sadece anlam taşıyan yerlerde parlar."

- %70 Depth Black Foundation (layered backgrounds with atmosphere)
- %15 Semantic Colors (emerald=income, rose=expense, amber=warning)
- %10 Indigo Glow Accent (#4F46E5 — CTA, focus, active states ONLY)
- %5  Atmospheric Layer (mesh gradients, noise, ambient orbs)
```

### Color Palette
```css
/* Depth Black Foundation */
--bg-base:       #000000;   /* Body background */
--bg-surface:    #050505;   /* Primary surface */
--bg-elevated:   #0A0A0A;   /* Elevated containers */
--bg-card:       #0F0F0F;   /* Card backgrounds */
--bg-atmosphere: radial-gradient(ellipse at 50% 0%, #0a0a1a, #050508, #000);

/* Indigo Glow Accent */
--indigo-400:    #818CF8;   /* Light accent, links */
--indigo-600:    #4F46E5;   /* Primary accent — THE glow */
--indigo-700:    #4338CA;   /* Hover state */

/* Semantic */
--success:       #10B981;   /* Income, positive */
--error:         #F43F5E;   /* Expense, negative */
--warning:       #F59E0B;   /* Alerts */
```

### Depth Layer System (v4.0)
```
Body: atmospheric gradient (NOT flat #000)
Noise: body::after overlay (opacity 0.035)
Ambient: fixed-position gradient orbs (indigo top, violet bottom-right)
Inner Light: inset 0 1px 0 rgba(255,255,255,0.06) on all glass elements
/* See skills/ui/styles.md Section 2 for full spec */
```

### Glassmorphism (Universal: blur 12px, border white/10, inner light)
```css
/* Level 3 - Card (most common) */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.06); /* v4.0: inner light */
}
/* See skills/ui/styles.md for all 5 levels */
```

### Motion Math (Chip Core Assembly)
```typescript
// Canonical spring for scroll-driven assembly
const ASSEMBLY_SPRING = { type: 'spring', stiffness: 260, damping: 20, mass: 1 };

// Oracle 3-State Machine: dormant → assembling → active
// Module scroll offsets (non-linear arrival)
// Income: 0.05-0.20 | Expense: 0.12-0.30 | Goals: 0.20-0.40
// See skills/ui/styles.md Section 4 for full interpolation map
// See skills/ui/oracle.md for Chip Core visual spec
```

### Component Styling Patterns
```tsx
// Glassmorphism Card
className="glass-card rounded-2xl p-6"

// Primary Button (Indigo Glow - CTA only)
className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3
           shadow-[0_0_24px_rgba(79,70,229,0.20)] transition-all duration-200"

// Ghost Button
className="bg-transparent hover:bg-white/5 text-zinc-400 rounded-xl"

// Input with Indigo focus
className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5
           focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
```

### Typography (Inter Variable)
```
Display    : text-5xl / font-black / tracking-tight / text-white
Heading 1  : text-3xl / font-bold / text-white
Heading 2  : text-2xl / font-semibold / text-white
Body       : text-base / font-normal / text-zinc-400
Caption    : text-xs / font-medium / tracking-wide / text-zinc-500
```

### Icons (Lucide React — Strict)
```tsx
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
<Wallet size={20} className="text-indigo-400" strokeWidth={2} />
// NO emojis in production UI — Lucide only
// strokeWidth: 2 (default), 1.5 (large icons > 24px)
```

### Animation Rules
- **60fps mandatory** — only `transform` and `opacity`
- **Spring > duration** — prefer spring physics over fixed durations
- Micro (hover): 150ms | Small (buttons): 200ms | Medium (cards): 300ms
- Assembly (scroll-driven): spring-based, no fixed duration
- Respect `prefers-reduced-motion` — disable assembly, keep opacity fades

---

## 8. Testing Standards

### Test Structure
```typescript
describe('IncomeActions', () => {
  describe('createIncome', () => {
    it('creates income with valid data', async () => {
      const result = await createIncome(validData);
      expect(result.success).toBe(true);
    });

    it('rejects unauthenticated requests', async () => {
      const result = await createIncome(validData);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('validates amount is positive', async () => {
      const result = await createIncome({ ...validData, amount: -100 });
      expect(result.success).toBe(false);
    });
  });
});
```

### Coverage Requirements
```
Minimum coverage  : 80%
Server actions    : 100% (auth + validation + happy path + error)
Critical paths    : 100% (money calculations, auth flows)
UI components     : Snapshot + interaction tests
```

---

## 9. Git Workflow

### Commit Messages (Conventional Commits)
```
feat(income): add recurring income support
fix(expense): correct category filter query
style(ui): update glassmorphism card shadows
refactor(auth): extract Clerk middleware config
docs(conventions): add database query patterns
test(actions): add expense CRUD tests
chore(deps): update drizzle-orm to 0.45
```

### Branch Naming
```
feature/recurring-income
fix/expense-category-filter
refactor/auth-middleware
```

### Scopes
`ui` | `income` | `expense` | `analytics` | `goals` | `auth` | `db` | `oracle` | `landing` | `layout` | `store` | `actions`

---

## 10. Zero-Tolerance Mode

### Prohibited Patterns
```
[X] Mock data in production code
[X] TODO/FIXME comments in committed code
[X] Empty event handlers
[X] Missing error boundaries
[X] Untyped variables (any)
[X] console.log for error handling
[X] Hardcoded colors (use CSS variables)
[X] Inline styles (use Tailwind)
[X] CSS modules or styled-components
[X] Class-based React components
[X] Float for money calculations
[X] Raw SQL without parameterization
[X] Exposed internal error messages to users
[X] Missing userId filter in DB queries
```

### Required Patterns
```
[✓] Real database integration (Drizzle + Neon)
[✓] Complete error handling (loading, error, empty, success)
[✓] User-facing feedback in Turkish (toast, alerts)
[✓] Type-safe implementations (Zod + TypeScript strict)
[✓] Auth check on every server action
[✓] Ownership verification on every resource access
[✓] Verified working build before completion
[✓] Mobile-first responsive design
[✓] Semantic HTML with ARIA labels
[✓] 60fps animations only
```

---

## Quick Reference

| Category | Rule |
|----------|------|
| **Types** | No `any`, explicit signatures, Zod validation |
| **Components** | All 4 states handled, max 200 lines |
| **Server Actions** | Auth → Validate → Execute → Revalidate |
| **Database** | Always userId filter, decimal for money, soft delete |
| **Errors** | Turkish user messages, English server logs |
| **Security** | Clerk auth on every action, ownership check |
| **UI** | Depth Black (atmosphere), Indigo Glow #4F46E5 (%10), blur(12px) + inner light, Spring physics |
| **Testing** | 80% minimum, 100% for critical paths |
| **Git** | Conventional commits, feature branches |

---

## Smart Routing

AI asistanlar görev türüne göre ilgili skill modülünü kullanır:

```
"Kart tasarımını güncelle"        → skills/ui + skills/ui/styles.md
"Oracle Core tasarla"             → skills/ui/oracle.md
"Dashboard layout değiştir"       → skills/ui/bento.md
"Gelir ekleme endpoint'i yaz"     → skills/api
"Clerk auth ayarla"               → skills/guard
"Drizzle schema güncelle"         → skills/data
"Bu hatayı düzelt"                → skills/debug
"Mimariyi planla"                 → skills/architect
"Vercel'e deploy et"              → skills/devops
```

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| v3.2 | 2026-02-06 | Skill manifest, ActionResult+Zod infrastructure, Oracle Core Assembly |
| v4.0 | 2026-02-06 | Depth Layer System, Oracle Chip Core 3-state machine, Bento Grid v2.0 |
| v4.5 | 2026-02-06 | Sticky Oracle Hero, Bento Density (8px), Currency Globalization, Brain Card |
| v4.6 | 2026-02-07 | Portal Navbar + Dock Bar, Pre-flight Screen, Auth Streamline, Cinematic Assembly (4-phase), Silicon Die (4-layer SVG) |
| v4.7 | 2026-02-07 | Landing/Auth pages sovereign unification, Cosmic Purge, formatCurrencyCompact |
| v4.8 | 2026-02-07 | Goals UI fix, Oracle AI v2.0 "The Brain", Logo refactor (SiliconDie SVG) |
| v4.9 | 2026-02-07 | Neon Silicon Resonance (cyan energy palette), SpendingVelocity, DockBar overlay-aware hide, Turkish ğüşıöç full support |
| v5.0 | 2026-02-07 | Vercel Lazy DB Proxy, NeonWalletIcon unification (all surfaces), Drawer dark theme |
| v6.0 | 2026-02-08 | Cross-device DB sync (visibility+60s+post-mutation), Zustand skipHydration, Oracle transparent wallet center, elliptical assembly, drawer sovereign depth |
| v6.0-overhaul M1 | 2026-02-09 | Plus Jakarta Sans font, Stitch 3 palette (--color-bg-dark #050511, --color-primary #7C3AED, --color-secondary #06B6D4), glass-panel/neon-border/neon-shadow utilities |
| v6.0-overhaul M2 | 2026-02-09 | Desktop Sidebar (Sidebar.tsx), responsive layout (mobile: PortalNavbar+DockBar, desktop lg+: Sidebar), collapsible w-20↔w-64, Clerk UserButton integration |
| v6.0-overhaul M3 | 2026-02-09 | Dashboard desktop redesign — 12-col grid (DashboardHeader, DesktopBalanceHero w/ SVG chart, DesktopAICard, RecentTransactions, MiniGoalGrid w/ SVG rings), mobile bento preserved, responsive switch lg breakpoint |
| v6.0-overhaul M4 | 2026-02-09 | Transaction Ledger full-page — TransactionTable (merged expenses+incomes, filter tabs, search, pagination, staggered animate-row), TransactionDetailPanel (xl+ side panel, spring slide-in, detail fields, delete action), DashboardClient responsive switch (desktop table lg+ / mobile toggle preserved) |
| v6.0-overhaul M5 | 2026-02-09 | Goals & Milestones full-page — GoalMilestoneCard (5 gradient themes, range badges KISA/ORTA/UZUN VADE, gradient progress bars w/ glow, inline add-funds/delete overlays), GoalsPage (header w/ gradient title + CTA, 3-col KPI stats bar, responsive grid md:2col xl:3col, dashed add-new placeholder, inline GoalForm toggle), DashboardClient responsive switch (desktop GoalsPage lg+ / mobile GoalForm+GoalList preserved) |
| v6.0-overhaul M6 | 2026-02-09 | Analytics & Reports full-page — AnalyticsPage ("Finansal İstihbarat" badge + "Detaylı Finansal Analiz" gradient title + time period toggles 7G/30G/90G, 4-col KPI row: Mevcut Bakiye / Net Değişim / Risk Faktörü / Aylık Yakma, SVG area chart w/ bezier curves + gradient stroke + data points, 3-col secondary widgets: Monthly Burn Rate w/ progress bar + projected / SVG Donut chart w/ legend / Finansal Projeksiyon w/ savings rate + goal pace + health factors, full-width Category Breakdown interactive bars w/ animated widths, Oracle AI Insights Banner w/ confidence badge), DashboardClient responsive switch (desktop AnalyticsPage lg+ / mobile SpendingVelocity+CategoryChart+ExpenseChart preserved) |
| v6.0-overhaul M7 | 2026-02-09 | Settings page + Landing page polish — SettingsPage (Profile w/ Clerk UserButton + useUser, Preferences w/ currency selector 3-col grid + notification/dark mode toggles w/ spring switch, Security w/ password/sessions/payment/logout rows), 'settings' TabType wired across Sidebar+DockBar+PortalNavbar+DashboardClient, Landing page: MouseFollowGradient (radial-gradient follows cursor via CSS custom props), MockDashboardPreview (tilted perspective glass-panel 12-col mock w/ SVG chart + AI card + transactions + goals), SiliconDie ambient glow ring, 4 floating decorative elements (xl breakpoint), font-display on headings, footer version tag |
| v7.0-M1 | 2026-02-09 | Auth pages Stitch 3 redesign — Auth layout: #050505 bg + nebula glow orbs (purple+cyan blur-120px) + trust badges footer (QUANTUM SECURED / NEURAL LINK ACTIVE) + back-to-home link. Sign-in/Sign-up: large PiggyBank icon (w-16 h-16 drop-shadow) + Logo + "ENTERPRISE PORTAL" subtitle, Clerk appearance restyled (card: bg-[#0e0e14]/80 border-white/10, formFieldLabel: uppercase tracking-[0.2em], formButtonPrimary: btn-portal-gradient uppercase, socialButtons: btn-social, inputs: neon-input, links: cyan-400, colorPrimary: #7C3AED), loading state: Loader2 spinner, footer cross-links (sign-in↔sign-up). Removed: framer-motion deps, FloatingElement, NeonWalletIcon, glass-card from auth pages. CSS utilities verified: neon-input, btn-portal-gradient, btn-social (from M0). Build: ✅ Green |
| v7.0-M9 | 2026-02-09 | DataSync & Store Validation — DataSyncProvider: added `date` field to updateIncome/updateExpense interfaces+implementations, added `status` field to updateGoal interface, added categoryId→server UUID resolution in updateIncome/updateExpense (was missing — create fns resolved but update fns sent raw local IDs). DesktopAICard: converted from useState+useEffect([]) to useMemo with store subscriptions (incomes/expenses/goals) for reactive oracle metrics (health score, spending velocity, goal pace now update when data changes). Store selectors validated: getMonthlyIncomes/getMonthlyExpenses/getMonthlyBalance/searchAll/resolveServerCategoryId all correct. Store rehydration: skipHydration+persist.rehydrate() after sync confirmed working. Reactive data flow verified: DesktopBalanceHero ✅ (monthly selectors), RecentTransactions ✅ (monthly selectors), MiniGoalGrid ✅ (goals selector), DesktopAICard ✅ (now reactive). Build: ✅ Green |
| v7.0-M10 | 2026-02-09 | Global Search (⌘K Command Palette) — CommandPalette.tsx (NEW): full-screen modal, glass-panel, real-time search via store searchAll(), results grouped by type (Gelir/Gider/Hedef), keyboard nav (↑↓ Enter Esc), mouse hover tracking, formatted amounts w/ currency, footer hints. DashboardClient: dynamic import, showCommandPalette state, ⌘K/Ctrl+K keyboard listener (toggle), open:command-palette event listener. DashboardHeader: already dispatched open:command-palette on search click. Store searchAll: already implemented. Build: ✅ Green |
| v7.0-M11 | 2026-02-09 | Settings Functional & Sign-Out Fix — SignOutDialog.tsx (NEW): confirmation dialog w/ glass-panel, useClerk().signOut() via inner component pattern (hook rules compliant), loading spinner, Escape to close. ProfileModal.tsx (NEW): glass-panel modal wrapping Clerk <UserProfile /> w/ full dark theme appearance overrides (transparent bg, dark inputs, primary buttons, styled navbar). SettingsPage.tsx: removed all .cl-userButtonTrigger hacks, replaced with SignOutDialog (logout) + ProfileModal (password/sessions/profile edit), ClerkAvatar component (useUser imageUrl or initials fallback), "Profili Düzenle →" link, version bumped to v7.0. Sidebar.tsx: replaced Clerk UserButton with static avatar (SidebarAvatar + SidebarUserName via useUser hook), avatar click → settings tab navigation. Build: ✅ Green |
| v7.0-M12 | 2026-02-09 | E2E Validation & Polish — Console.log audit: no stray debug statements (only legitimate console.error in catch blocks + server-side logger.ts). CONVENTIONS.md updated with M10-M12 milestones. Build: ✅ Green |
| v7.0-P6 | 2026-02-10 | DB & Type Safety Audit — Full codebase audit: DB schema (UUID PKs, decimal(12,2) money, timestamps, relations ✅), store↔DB type alignment (DataSyncProvider mapping layer ✅), `any` usage (only eslint-disabled Clerk dynamic import + jspdf plugin ✅). **Fixes**: category.ts refactored from throw→ActionResult<T> + Zod (getUserId→resolveUserId, getCategories/createCategory/deleteCategory/seedDefaultCategories all return ActionResult now), user.ts refactored from throw→ActionResult<T> + Zod (getOrCreateUser/getCurrentUser/updateUserProfile), goal.ts GoalIdSchema min(1)→uuid() for consistency, DataSyncProvider updated for new ActionResult returns (getOrCreateUser result check + getCategories in parallel Promise.all). **100% server action ActionResult compliance achieved** — zero throw statements remain in src/actions/. Build: ✅ Green |
| v7.0-P7 | 2026-02-10 | CI/CD & Testing — Vitest test framework installed (vitest + @vitejs/plugin-react). **Test infrastructure**: vitest.config.ts (node env, @/ alias, v8 coverage provider, 80% thresholds), src/__tests__/mocks/setup.ts (shared mocks for Clerk auth, Drizzle DB chain, next/cache revalidatePath, drizzle-orm operators, DB schema refs; helpers: mockAuthenticatedUser, mockUnauthenticatedUser, mockWhereTerminalQuery, resetAllMocks w/ vi.resetAllMocks()). **144 tests across 7 files**: src/utils/index.test.ts (33 tests — formatCurrency, formatCurrencyCompact, getCurrencySymbol, formatDate, formatDateShort, calculatePercentage, clamp, convertAmount, toTitleCase), src/lib/analytics.test.ts (24 tests — groupExpensesByCategory, getTopCategories, filterExpensesByDateRange, calculateDailyAverage, getWeeklyDistribution, calculateBudgetUsage, calculateSavingsGoal), src/actions/income.test.ts (17 tests), src/actions/expense.test.ts (17 tests), src/actions/goal.test.ts (22 tests), src/actions/category.test.ts (17 tests), src/actions/user.test.ts (14 tests). All server action tests cover: Auth rejection, Zod validation (negative/zero/invalid UUID), happy path CRUD, ownership checks, DB error handling (Turkish user messages). **CI pipeline**: ci.yml updated with `npm run test` step between lint and build. **Scripts**: test, test:watch, test:coverage added to package.json. Build: ✅ Green |
| v7.0-P8 | 2026-02-10 | Performance & Lighthouse — **next.config.mjs**: optimizePackageImports (lucide-react, framer-motion, date-fns, recharts, zod), image optimization (AVIF+WebP, 30-day cache), compiler.removeConsole in production (keep error/warn), poweredByHeader:false, immutable cache headers for _next/static, long-cache for public assets. **Web Vitals**: src/lib/web-vitals.ts (CLS, LCP, INP, TTFB, FCP reporting w/ color-coded dev console + navigator.sendBeacon production), WebVitalsReporter.tsx client component in layout.tsx, web-vitals package installed. **Landing page SSR**: page.tsx converted to server component with Metadata export (title, description, OG, Twitter card, canonical URL, keywords), LandingClient.tsx extracted to src/components/landing/ (all interactive content preserved). **Preconnect hints**: layout.tsx <head> with preconnect+dns-prefetch for clerk.budgeify.com and img.clerk.com. **CSS perf**: .perf-defer (content-visibility:auto + contain-intrinsic-size), .perf-contain (contain:layout style paint), .perf-gpu (will-change:transform + translateZ(0)), .ambient-layer strict containment, prefers-reduced-motion disables GPU hints. **Lighthouse CI**: ci.yml new lighthouse job (treosh/lighthouse-ci-action@v12, 3 runs, desktop preset), lighthouserc.json (perf≥0.7, a11y≥0.8, best-practices≥0.8, seo≥0.9, FCP<3s, LCP<4s, CLS<0.1, TBT<500ms). Build: ✅ Green · Tests: ✅ 144/144 |
| v7.0-P9 | 2026-02-10 | Accessibility (a11y) — **globals.css**: `.sr-only` visually-hidden utility, `.skip-to-content` skip link (fixed z-9999, visible on focus, purple bg), global `:focus-visible` outlines (2px solid purple/80 + offset, button ring+glow combo, input glow, link outline w/ radius), `:focus:not(:focus-visible)` outline removal, `prefers-reduced-motion` preserves focus outlines. **layout.tsx**: skip-to-content `<a>` ("Ana içeriğe geç") targeting `#main-content`. **DashboardClient.tsx**: removed redundant `role="main"` (already `<main>`), mobile transaction toggle: `role="tablist"` + `role="tab"` + `aria-selected` + `aria-controls`/`id` pairs, `role="tabpanel"` + `aria-labelledby` wrapper, decorative icons `aria-hidden="true"`. **Drawer.tsx**: `VaulDrawer.Description` (sr-only, "{title} formu"), handle `aria-hidden="true"`. **AIAssistant.tsx**: chat drawer `role="dialog"` + `aria-modal="true"` + `aria-label` + `aria-hidden` when closed, typing indicator `aria-live="polite"` + sr-only "Oracle düşünüyor..." text, status dot `aria-hidden="true"`. **LandingClient.tsx**: `<main id="main-content">` landmark wrapping all sections, nav `aria-label="Ana gezinme"`, nebula/glow orbs `aria-hidden="true"`, CreditCardVisual `role="img"` + `aria-label`, email input `<label>` (sr-only) + `id` + `autoComplete="email"`, social links individual `aria-label` (GitHub/Twitter/LinkedIn) + icon `aria-hidden`, decorative dots `aria-hidden`. **lighthouserc.json**: a11y threshold raised 0.8→0.9. |
| v7.0-P10 | 2026-02-10 | Deploy & Production Hardening — **Custom Error Pages**: `not-found.tsx` (dark theme 404 with ambient glow, "Sayfa Bulunamadı" + Ana Sayfa/Dashboard links), `error.tsx` (dark theme runtime error page with error reporting via reportError(), "Tekrar Dene" reset + digest code display). **ErrorBoundary dark theme fix**: `bg-slate-50`→`#050505`, `text-slate-600`→`text-slate-400`, Card variant `glass`, red indicators `bg-red-500/10 border-red-500/20`. **Version consistency fix**: `next.config.mjs` `generateBuildId` (timestamp-based unique build ID per deploy — prevents stale JS chunk mismatch across devices), HTML pages `Cache-Control: no-cache, no-store, must-revalidate` + `Pragma: no-cache` (browsers always fetch fresh HTML while static assets remain immutable-cached). **Security hardening**: Content-Security-Policy (default-src self, script/style/img/font/connect/frame-src whitelist for Clerk+Neon+Google Fonts, object-src none, base-uri self, form-action self), HSTS upgraded to `max-age=63072000; includeSubDomains; preload` (2 years + preload list eligible), `X-DNS-Prefetch-Control: on`, removed deprecated `X-XSS-Protection`. **vercel.json synced**: all security headers mirrored from next.config (CSP, HSTS, DNS prefetch). **package.json version**: `1.0.0`→`7.0.0`. **Console audit**: zero stray console.log in production (only logger.ts structured output, web-vitals.ts dev-only, db/index.ts warn-level). Build: ✅ Green · Tests: ✅ 144/144 |
| v8.0-M1 | 2026-02-10 | Deployment & Sync Fix — **vercel.json**: removed duplicate headers (next.config.mjs single source of truth), added `cleanUrls: true`, added `VERCEL_FORCE_NO_BUILD_CACHE=1` build env. **next.config.mjs**: `Surrogate-Control: no-store` for Vercel Edge cache bypass, CSP `connect-src` whitelists Server Action self-origin, `x-build-id` debug header. **middleware.ts**: `/pricing` + `/api/cron(.*)` added to public routes. **Store migration**: v3→v4 with stale field validation. Build: ✅ Green · Tests: ✅ 144/144 |
| v8.0-M2 | 2026-02-10 | Landing Page Mock Chart — **LandingClient.tsx**: static DataStrip replaced with recharts `AreaChart` using 12-month mock financial data (gelir/gider/tasarruf), dark-themed with gradient fills (purple/cyan/emerald), glass-panel container, custom dark tooltip. Build: ✅ Green |
| v8.0-M3 | 2026-02-10 | Pricing Page Split — **src/app/pricing/page.tsx** (NEW): server component with Metadata export. **PricingClient.tsx** (NEW): extracted pricing content (Aylık 99₺ / Yıllık 70₺/ay plan cards), FAQ section, comparison table. **LandingClient.tsx**: inline pricing replaced with CTA card linking to /pricing. Build: ✅ Green |
| v8.0-M4 | 2026-02-10 | Transaction Edit & Delete — **DashboardClient.tsx**: wired `onEdit`/`onDelete` handlers in TransactionDetailPanel, editing expense state + expense edit drawer. **TransactionTable.tsx**: 3-dot dropdown menu with "Düzenle"/"Sil" per row. **ExpenseForm.tsx**: `editingExpense` prop support (pre-fill + updateExpense action). Build: ✅ Green |
| v8.0-M5 | 2026-02-10 | DB Schema — Reminders & Budget Alerts — **schema.ts**: `reminderTypeEnum` (bill_payment/goal_deadline/budget_limit/custom), `reminderFrequencyEnum` (once/daily/weekly/monthly), `reminders` table (uuid PK, userId FK cascade, title, description, type, amount decimal(12,2), dueDate, frequency, isActive, lastTriggered, categoryId FK), `budgetAlerts` table (uuid PK, userId FK cascade, name, thresholdAmount decimal(12,2), alertType text, period text, isActive, lastTriggered). Relations + type exports added. Build: ✅ Green |
| v8.0-M6 | 2026-02-10 | Reminder & Budget Alert Server Actions — **reminder.ts** (NEW): full CRUD (getReminders, getUpcomingReminders, getReminderById, createReminder, updateReminder, deleteReminder), ActionResult<T> + Zod + Auth→Validate→Execute→Revalidate pattern. **budget-alert.ts** (NEW): CRUD (getBudgetAlerts, createBudgetAlert, updateBudgetAlert, deleteBudgetAlert, checkBudgetAlerts w/ period-based spending evaluation). Build: ✅ Green |
| v8.0-M7 | 2026-02-10 | Calendar & Reminder UI — **CalendarPage.tsx** (NEW): monthly grid (date-fns), expense/income/reminder/goal-deadline dots, day click → side panel, upcoming reminders list, budget alerts section. **ReminderForm.tsx** (NEW): drawer form (title, type, amount, dueDate, frequency, category). **BudgetAlertForm.tsx** (NEW): alert setup (name, threshold, alertType, period). **DayDetailPanel.tsx** (NEW): selected day transactions + reminders. 'calendar' TabType added across Sidebar/DockBar/PortalNavbar/DashboardClient. Build: ✅ Green |
| v8.0-M8 | 2026-02-10 | Vercel Cron for Reminder Notifications — **src/app/api/cron/reminders/route.ts** (NEW): GET handler secured with CRON_SECRET Bearer auth. Step 1: query active reminders where dueDate≤now and not yet triggered, update lastTriggered, deactivate one-time reminders, advance recurring reminders' dueDate (daily/weekly/monthly). Step 2: evaluate all active budget alerts — fetch user expenses filtered by period, compare against thresholds, update lastTriggered on triggered alerts. Returns CronResult JSON summary. **vercel.json**: cron config `/api/cron/reminders` at `0 8 * * *` (daily 8am UTC). **.env.example**: CRON_SECRET documentation added. Build: ✅ Green · Tests: ✅ 144/144 |
| v8.0-M9 | 2026-02-10 | Tests & Build Verification — **reminder.test.ts** (NEW): 22 tests (5 auth rejection, 5 Zod validation, 7 happy path CRUD, 2 ownership checks, 3 DB error handling). **budget-alert.test.ts** (NEW): 20 tests (5 auth, 5 validation, 5 happy path CRUD, 2 ownership, 3 DB error). **Mock setup updated**: reminders/budgetAlerts schema refs + lte/gte/sql operator mocks added. Build: ✅ Green · Tests: ✅ 186/186 |
| v8.0-M10 | 2026-02-10 | Final Hardening & Version Bump — **package.json**: version 7.0.0→8.0.0. **CONVENTIONS.md**: v8.0 M1-M10 milestones added. Build: ✅ Green · Tests: ✅ 186/186 |

---

## Current Architecture

### Safety Patterns
- **ActionResult\<T\>** discriminated union — ALL server actions, no exceptions
- **Zod** schema validation on every external input
- **Auth → Validate → Execute → Revalidate** universal flow
- **Clerk** auth with middleware protection + ownership checks

### UI Architecture
- **Bento Grid** — Spatial 1×1/2×1/2×2 widget system, 8px gap density
- **Glassmorphism** — blur(12px), border white/10, inner light on all cards
- **Depth Black** — Atmospheric gradient body, noise texture, ambient orbs
- **Spring Physics** — 260/20/1 canonical, DOCK_SPRING 400/10, CONVERGENCE_SPRING 300/15/1

### Oracle System
- **4-Phase Cinematic**: Awakening → Assembly → Ignition → Dock (250vh runway)
- **NeonWalletIcon**: Transparent wallet center (120px), dead-center balance overlay
- **BrainCard**: Real-time Spending Velocity + Goal Pace → AIAssistant
- **AIAssistant**: Context-aware suggestions, Turkish ğüşıöç support, actionable insight buttons

### Navigation
- **PortalNavbar**: NeonWalletIcon + "Budgeify" neon gradient text, context title, Clerk UserButton
- **DockBar**: Floating pill, center FAB, spring bounce, grey/neon icon sync, overlay-aware auto-hide

### Event System (CustomEvent)
- `oracle:open-assistant` — BrainCard → AIAssistant
- `oracle:reset-dashboard` — Logo click → DashboardClient (reset tab + scroll)
- `overlay:show` / `overlay:hide` — AIAssistant + Drawers → DockBar visibility
- `open:command-palette` — DashboardHeader search input → CommandPalette (⌘K)

### DB Resilience
- **Lazy Proxy** singleton — DATABASE_URL resolved at first runtime access, build-time safe
- **Cross-Device Sync** — visibility + focus re-sync, 60s silent interval, post-mutation confirmation
- **Zustand** skipHydration:true — server-first authority, persist.rehydrate() after sync

---

*Project Brain — Budgeify*
*Stack: Next.js 14 | Clerk Auth | Drizzle ORM | Neon PostgreSQL | Tailwind CSS 4*
*Design: Depth Black | Indigo Glow #4F46E5 | Neon Cyan #00F0FF | Glassmorphism blur(12px) | Spring 260/20/1*
