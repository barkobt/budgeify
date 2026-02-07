# Budgeify - Code Conventions (Project Brain)

> Production-grade standards for Budgeify SaaS development.
> Bu dosya projenin "beyni"dir. Tüm AI asistanlar ve geliştiriciler bu kurallara uymalıdır.

---

## Project Structure v4.5

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

## Progress Log

| Date | Milestone | Status | Notes |
|------|-----------|--------|-------|
| 2026-02-06 | v3.2 M1: Skill Manifest | Completed | `skills/ui/styles.md` created, CONVENTIONS.md synced |
| 2026-02-06 | v3.2 M2: Infrastructure Repair | Completed | middleware optimized, goal.ts refactored to ActionResult+Zod |
| 2026-02-06 | v3.2 M3: Oracle Core Assembly | Completed | OracleHero rewritten with HubX Assembly, OracleModuleChip extracted |
| 2026-02-06 | v4.0 M1: Skills Overhaul | Completed | styles.md v4.0 (Depth Layer), oracle.md created, api/README v4.0, CONVENTIONS v4.0 |
| 2026-02-06 | v4.0 M2: Infrastructure Repair | Completed | income.ts + expense.ts → ActionResult+Zod, goal.ts UUID fix, DataSyncProvider unified + updateIncome/updateExpense |
| 2026-02-06 | v4.0 M4: Depth Layer System | Completed | globals.css → v4.0 (atmospheric gradient body, noise texture body::after, ambient orbs, glassmorphism blur(12px)+inner light, indigo #4F46E5 palette), layout.tsx ambient layer |
| 2026-02-06 | v4.0 M5: Oracle Chip Core | Completed | OracleHero/OracleModuleChip rewritten — 3-speed rings, central die, 3-state machine, layoutId assembly, circuit-trace, silicon-glow |
| 2026-02-06 | v4.0 M8: Bento Grid v2.0 | Completed | skills/ui/bento.md spec, BentoGrid+BentoCard components, globals.css bento system, dashboard refactored to spatial grid layout |
| 2026-02-06 | v4.5 Plan Created | Planned | archive/v4_PLAN.md updated — M9 Sticky Oracle, M10 Bento Density, M6 Currency, M7 Oracle AI v2.0 |
| 2026-02-06 | v4.5 M9: Sticky Oracle Hero | Completed | oracle-runway (150vh) + oracle-sticky (position:sticky, 100vh) CSS, OracleHero scroll-driven 3-state pinned in viewport |
| 2026-02-06 | v4.5 M10: Bento Density | Completed | Gap 12px→8px, padding reduced across all sizes, 2×1 cards broken into 1×1 high-density widgets, Control Center aesthetic |
| 2026-02-06 | v4.5 M6: Currency Globalization | Completed | convertAmount() utility in src/utils, currency selector 1×1 widget, cycleCurrency on dashboard |
| 2026-02-06 | v4.5 M7: Oracle Brain Card | Completed | OracleBrainCard.tsx — 1×1 AI widget with animated health score ring + top insight preview |
| 2026-02-07 | v4.6 Plan: The Mechanical Heart | Approved | Full spec: `skills/architect/v46-plan.md` — 5 milestones below |
| 2026-02-07 | v4.6 M13-C: Portal Navbar + Dock Bar | Completed | `PortalNavbar.tsx` (command strip, context title, Clerk UserBtn) + `DockBar.tsx` (atmospheric glass blur(20px)+saturate(180%), DOCK_SPRING 400/10 bounce, energy glow halo, center FAB with radial quick-add + blur overlay) — replaces Header+BottomNav in dashboard |
| 2026-02-07 | v4.6 M13-A: Pre-flight Screen | Completed | `dashboard/loading.tsx` rewrite — 4-layer Silicon Die SVG (substrate→traces→core→heatspreader), CSS-only preflight-rotate (4s) + preflight-pulse (2s), circuit trace stroke-dashoffset animation, 4-phase sequential status text (800ms each), ambient glow ring, indigo progress sweep bar |
| 2026-02-07 | v4.6 M13-B: Auth Streamline | Completed | ClerkProvider `afterSignInUrl`/`afterSignUpUrl` → `/dashboard`, middleware matcher hardened (manifest.json, robots.txt, .txt/.json excluded), page.tsx → async server wrapper + DashboardClient.tsx extraction |
| 2026-02-07 | v4.6 M11: Cinematic Assembly | Completed | 200vh runway, 4-phase scroll choreography (Awakening 0-20%, Assembly 20-50%, Ignition 50-70%, Dock 70-100%), ambient layer ignition via CSS custom properties (--ambient-indigo-opacity/--ambient-violet-opacity), scroll progress indicator (2px indigo bar right edge), chromatic aberration @keyframes + screen shake at 95%/98% dock, LayoutGroup wrapping OracleHero+BentoGrid, module convergence shifted to 20-50% range with CONVERGENCE_SPRING (300/15/1), ring fade-out in Phase 4, coreDockY translateY(60) |
| 2026-02-07 | v4.6 M12: Silicon Die | Completed | `SiliconDie.tsx` (NEW) — 4-layer SVG (substrate grid + traces stroke-dashoffset + core logic gradient + heatspreader frame with corner pads), Z-axis parallax via useTransform (rotateX 0→2deg, per-layer translateZ -2/-1/+1/+2), 3 light leaks (radial-gradient + mix-blend-mode:screen), 3 size states (dormant 100px, active 120px, docked 64px), useMotionValue fallback for unconditional hooks, replaces Wallet icon in OracleHero, layoutId='silicon-die-core' |
| 2026-02-07 | v4.6 Tech Debt: UX Polish | Completed | **Landing CTA**: `GuestNavButtons` Link/Button nesting fix (anchor inside button → Link wraps GlowButton). **Clerk Popover**: `PortalNavbar.tsx` + `layout.tsx` — added `userPreviewMainIdentifier: !text-white`, `userPreviewSecondaryIdentifier: !text-slate-400`, `userButtonPopoverActions: !bg-transparent` for dark-theme readability. **SiliconDie Modernization**: brighter substrate gradient, vivid trace colors (#818CF8/#A5B4FC/#C7D2FE), 4-stop core gradient, radial coreCenterGlow, energy conduit micro-traces, enhanced light leaks (35%/28%/22% opacity), brighter drop-shadow cascade. **Amount Overflow**: `formatCurrencyCompact()` utility (0 decimals, K/M abbreviation for large numbers), OracleHero data readout uses compact format (text-sm + max-w-[90%] truncate), GoalCard stats use compact format with truncate. **Runway Gap**: oracle-runway 200vh→250vh for docked state alignment. |
| 2026-02-07 | v4.7 M14: Landing Page Sovereign Unification | Completed | `page.tsx` — replaced `cosmic-*` gradient classes (not in @theme) with sovereign depth inline styles (#050508/#0a0a1a/#0d0d1f), nav bg rgba(5,5,8,0.80), footer bg rgba(5,5,8,0.5), hero glow radial-gradients (indigo 0.25/violet 0.15), CTA glow radial-gradient (indigo 0.35), SiliconDie hero visual with slow 20s rotation |
| 2026-02-07 | v4.7 M15: Auth Pages Polish | Completed | `sign-in/page.tsx` + `sign-up/page.tsx` — replaced `cosmic-*` gradient bg with sovereign depth inline style, consistent visual language across all public pages |
| 2026-02-07 | v4.7 M16: Cosmic Purge | Completed | Zero `cosmic-*` class usages remain in src/. `AIAssistant.tsx` overlay+drawer bg → sovereign depth inline (rgba(5,5,8) + linear-gradient rgba(13,13,31)). `BottomNav.tsx` bg → rgba(5,5,8,0.90). Chart files + EmptyState only had comment refs (no class changes needed). Full codebase unified to sovereign depth system. |
| 2026-02-07 | v4.7 M17: Formatting & Popover Unification | Completed | `insights.ts` local `formatCurrency` replaced with `formatCurrencyCompact` from `@/utils` — eliminates misleading number format root cause. `Header.tsx` Clerk `UserButton` popover: added `userPreviewMainIdentifier: !text-white`, `userPreviewSecondaryIdentifier: !text-slate-400`, `userButtonPopoverActions: !bg-transparent` for dark-theme readability (matches PortalNavbar + layout.tsx). |
| 2026-02-07 | v4.8 M19: Goals UI Surgical Fix | Completed | `GoalCard.tsx` — Responsive header layout (flex-col mobile, flex-row desktop), title truncate with max-w-45/md:max-w-60, min-w-0 flex overflow fix, progress bar glow (boxShadow indigo/emerald per state), all amounts formatCurrencyCompact |
| 2026-02-07 | v4.8 M7: Oracle AI v2.0 "The Brain" | Completed | `OracleBrainCard.tsx` — Real-time Spending Velocity (getSpendingTrend) + Goal Pace (analyzeGoals, closest goal progress). Click dispatches `oracle:open-assistant` CustomEvent. `AIAssistant.tsx` — Listens for open event, Actionable Insight buttons (Butceyi Ayarla, Hedefleri Gor, Saglik Analizi) on assistant messages with insights |
| 2026-02-07 | v4.8 Logo Refactor | Completed | `PortalNavbar.tsx` — Replaced Cpu icon with inline mini SiliconDie SVG (substrate+traces+core gradient). Click triggers smooth scroll-to-top + `oracle:reset-dashboard` event. `DashboardClient.tsx` listens and resets activeTab to 'dashboard' |
| 2026-02-07 | v4.8 UI Polish & Versioning | Completed | `DockBar.tsx` — v4.8-sovereign version tag (text-[10px] text-white/20). safe-area-inset-bottom already correct. `globals.css` — SiliconDie wrapper `will-change: transform` + `contain: layout style paint` for 60fps GPU compositing |
| 2026-02-07 | v4.8 Final Handover | Completed | No stray console.log found. Build ✅ green. All ActionResult+Zod patterns intact. Codebase ready for production handover |
| 2026-02-07 | v4.9 M19.2: Goal Page & Amount Fix | Completed | `GoalCard.tsx` — CSS Grid header layout (grid-cols-[auto_1fr_auto]) prevents label/title overlap, overflow-hidden on title container, `formatCurrencyCompact` applied to ALL currency displays across entire app (ExpenseList, IncomeList, CategoryChart, ExpenseChart, GoalCard) — zero raw large numbers remain |
| 2026-02-07 | v4.9 Task 2: Silicon Wallet Logo | Completed | `PortalNavbar.tsx` — Futuristic Silicon Wallet hybrid SVG (wallet body + flap + circuit traces + silicon core die + core glow + card slot accent). Indigo glow shadow on hover. Click triggers `oracle:reset-dashboard` + smooth scroll-to-top |
| 2026-02-07 | v4.9 M20: Analysis Depth & AI Character Fix | Completed | `SpendingVelocity.tsx` (NEW) — Daily velocity, projected monthly spend, health score summary, month-over-month trend with %, category-wise delta comparisons with TrendingUp/Down indicators. `AIAssistant.tsx` — Full Turkish character support (ğ, ü, ş, ı, ö, ç) in all suggestion chips, greetings, button labels, and context messages. `lang="tr"` on input field |
| 2026-02-07 | v4.9 Task 4: DockBar Persistence Logic | Completed | `DockBar.tsx` — `hidden` prop with spring-animated translate-y-100/opacity-0 transition. `DashboardClient.tsx` — `isOverlayActive` state driven by `overlay:show`/`overlay:hide` CustomEvents. `AIAssistant.tsx` dispatches overlay events on open/close. Drawer open/close also triggers overlay events. DockBar smoothly hides during overlays, reappears on dismiss |
| 2026-02-07 | v4.9 Sovereign Masterpiece: Final Handover | Completed | Build verified. console.log cleanup done. All ActionResult+Zod patterns intact. DockBar v4.9-sovereign tag. Full milestone coverage M1→M20 |
| 2026-02-07 | v5.0 M21: Vercel Deployment Fix | Completed | `db/index.ts` — Lazy Proxy singleton replaces eager `neon(‘’)` init. Build-time safe: DATABASE_URL resolved at first runtime access only. Clear error message when unset |
| 2026-02-07 | v5.0 M22: Silicon Wallet Resurrection | Completed | `Logo.tsx` — Lucide Wallet icon replaced with inline Silicon Wallet SVG (wallet body+flap+circuit traces+coin core+currency mark). Neon cyan glow (#00F0FF/#00D4E8/#00B8D4). Applied to auth pages via Logo component. PortalNavbar + OracleHero SiliconDie already had wallet form factor from v4.9 |
| 2026-02-07 | v5.0 M23: Final Polish Sweep | Completed | **Turkish encoding**: AIAssistant processQuery calls fixed (ğüşıöç), sign-in/sign-up fallback text fixed. **Auth text**: Logo.tsx already has tracking-widest. **DockBar**: overlay-aware hide already wired via CustomEvent system (overlay:show/hide). **Goals amounts**: all GoalCard amounts already use formatCurrencyCompact. **DockBar version**: v5.0-final tag |
| 2026-02-07 | v5.0-final: Absolute Final Handover | Completed | Build ✅ green. Zero ASCII-only Turkish strings remain. Lazy DB proxy prevents Vercel build crash. Silicon Wallet unified across all surfaces. CONVENTIONS.md sealed |
| 2026-02-07 | v5.0 Stabilization: Emergency Protocol | Completed | **Task 1**: db/index.ts — safeDbAccess() edge warm-up helper + improved error message. **Task 2**: NeonWalletIcon.tsx shared component (useId for unique gradient IDs) — unified across DockBar Home, Auth spinners, PortalNavbar. OracleHero uses SiliconDie (wallet form). **Task 3**: PortalNavbar — NeonWalletIcon + "Budgeify" text (tracking-widest), oracle:reset-dashboard on click. **Task 4**: GoalCard — min-w-0 + shrink-0 on stat grid children, truncate on Hedef Tarihi. Turkish chars ✅ (v4.9). DockBar overlay-aware hide ✅ (v4.9). |
| 2026-02-07 | v5.0 Final Handover: Neon Wallet Mandate | Completed | **DB**: Proxy build-safe — returns undefined when DATABASE_URL missing (prevents Vercel build crash). **Icon Unification**: OracleHero center SiliconDie → NeonWalletIcon (size 80, scroll-driven scale/glow preserved). Preflight chip SVG → NeonWalletIcon. NeonWalletIcon now used in ALL surfaces: PortalNavbar, DockBar, Auth spinners, OracleHero center, Preflight screen. **Verified**: PortalNavbar (NeonWalletIcon + Budgeify tracking-widest + oracle:reset-dashboard), GoalCard (formatCurrencyCompact + min-w-0 + truncate), AIAssistant (Turkish ğüşıöç + lang=tr), DockBar (overlay:show/hide auto-hide). |
| 2026-02-07 | v5.0 Final Stabilization: Contrast & Git Sync | Completed | **Drawer Dark Theme**: `Drawer.tsx` converted from `bg-white` to sovereign depth gradient (`rgba(13,13,31,0.98)→rgba(10,10,26,0.98)`), handle `bg-white/20`, title `text-white`, close button `bg-white/10`, border `border-white/10`. Income/Expense/Goal drawers now match dark UI. **Console Cleanup**: Removed stray `console.warn` from `MainSalaryForm.tsx`. **Verified**: DB lazy proxy ✅, NeonWalletIcon unified ✅, GoalCard grid+compact ✅, AIAssistant Turkish ✅, DockBar overlay-hide ✅, Analytics dark-themed ✅. **Git**: Staged + pushed to main for Vercel deployment. |
| 2026-02-08 | v6.0 M24: Database Resilience & Cross-Device Sync | Completed | **M24-A**: Visibility+focus re-sync (visibilitychange+focus events trigger syncData). **M24-B**: 60s periodic silent sync (silentSyncData — no loading flash). **M24-C**: Post-mutation server confirmation (syncData after every create/update/delete). **M24-D**: DB Proxy edge retry with build-phase detection (NEXT_PHASE check). **M24-E**: Zustand skipHydration:true + persist.rehydrate() after sync for currency preference preservation. |
| 2026-02-08 | v6.0 M25: Visual Identity — Navbar & DockBar | Completed | **M25-A**: `.text-gradient-neon` CSS class (cyan→indigo brand gradient). **M25-B**: PortalNavbar — icon 28→24px, font text-lg→text-[15px], gap 2.5→2, padding tightened, text-gradient-neon applied. **M25-C**: DockBar NeonWalletIcon grey/active state sync (grayscale+brightness inactive, neon glow active). **M25-D**: Removed floating version tag from DockBar, added subtle `Budgeify v6.0` at page bottom. |
| 2026-02-08 | v6.0 M26: Oracle Hero — Transparent Wallet Center | Completed | **M26-A**: Removed purple box (blur glow + ai-gradient container), NeonWalletIcon rendered directly at 120px with ambient drop-shadow only. **M26-B**: Balance text dead-center overlay inside wallet SVG (absolute inset-0 flex items-center justify-center). **M26-C**: Elliptical assembly container (border-radius 45%/40%, responsive 360→400→440px height, 420→480→540px max-width), removed rounded-full class. |
| 2026-02-08 | v6.0 M27: Drawer Contrast & Forms Dark Theme | Completed | **M27-A**: `[vaul-drawer-content]` background fixed from zinc rgba(24,24,27) to sovereign depth gradient rgba(13,13,31)→rgba(10,10,26). `[vaul-drawer-overlay]` from rgba(0,0,0) to rgba(5,5,8,0.85). |
| 2026-02-08 | v6.0 M28: Mobile Safety & AI Button Fix | Completed | **M28-A**: AI button moved from bottom-24 right-5 h-14 w-14 to bottom-32 right-4 h-12 w-12 (clears DockBar, Apple HIG 48px min tap target). Sparkles icon 24→20. **M28-B**: DockBar max-width 380→360px for mobile breathing room. |
| 2026-02-08 | v6.0 M29: Goals UI & Turkish Final Audit | Completed | **M29-A**: GoalCard stat grid gap-3→gap-2 sm:gap-3 (responsive for 320px iPhone SE). **M29-B**: Turkish audit — all SUGGESTION_MAP, getNextContext, initializeChat, handleResetContext, aria-labels verified ğüşıöç correct. lang="tr" on input confirmed. No changes needed. |
| 2026-02-08 | v6.0 M30: Git Sync & CONVENTIONS Update | Completed | CONVENTIONS.md updated with v6.0 milestone log + registry. Version footer updated to v6.0. Build ✅ green. |

---

## Sovereign v5.0 Handover Summary

### Key Architectural Wins

1. **Vercel Production Resilience**: Lazy Proxy singleton for DB access + `safeDbAccess()` helper. `DATABASE_URL` is never touched at build-time; resolved lazily at first runtime access. Edge warm-up crashes eliminated.

2. **Neon Wallet Icon Unification**: Single `NeonWalletIcon.tsx` component (wallet body + flap + circuit traces + coin core + currency mark, dual-tone #00F0FF/#00D4E8/#00B8D4 energy palette). Used consistently across:
   - **PortalNavbar**: Logo + "Budgeify" text (tracking-widest)
   - **DockBar**: Home/Dashboard tab icon
   - **Auth Pages**: Sign-in/Sign-up loading spinner
   - **OracleHero**: NeonWalletIcon center (scroll-driven scale/glow, replaces SiliconDie)
   - **Preflight Screen**: NeonWalletIcon (replaces inline chip SVG)

3. **Navigation Stability**: PortalNavbar brand container (NeonWalletIcon + Budgeify text) triggers `oracle:reset-dashboard` + smooth scroll-to-top. DockBar auto-hides via `overlay:show`/`overlay:hide` CustomEvent system when AIAssistant or transaction drawers are active.

4. **Goals UI Hardened**: CSS Grid stat children have `min-w-0` for proper truncation, icon elements have `shrink-0` to prevent compression, all amounts use `formatCurrencyCompact` (K/M abbreviation).

5. **Turkish Language Support**: Full ğüşıöç support in AIAssistant suggestions, greetings, button labels, context messages. `lang="tr"` on input fields.

6. **Event-Driven Architecture**:
   - `oracle:open-assistant` — BrainCard → AIAssistant
   - `oracle:reset-dashboard` — PortalNavbar logo → DashboardClient
   - `overlay:show` / `overlay:hide` — AIAssistant + Drawers → DockBar visibility

---

## Sovereign v5.0 — Complete Milestone Registry

| # | Milestone | Version | Status |
|---|-----------|---------|--------|
| M1 | Skill Manifest | v3.2 | ✅ |
| M2 | Infrastructure Repair (ActionResult+Zod) | v3.2→v4.0 | ✅ |
| M3 | Oracle Core Assembly | v3.2 | ✅ |
| M4 | Depth Layer System | v4.0 | ✅ |
| M5 | Oracle Chip Core (3-state machine) | v4.0 | ✅ |
| M6 | Currency Globalization (TRY/USD/EUR) | v4.5 | ✅ |
| M7 | Oracle AI v2.0 "The Brain" | v4.5→v4.8 | ✅ |
| M8 | Bento Grid v2.0 | v4.0 | ✅ |
| M9 | Sticky Oracle Hero (150→250vh runway) | v4.5 | ✅ |
| M10 | Bento Density (8px gap) | v4.5 | ✅ |
| M11 | Cinematic Assembly (4-phase scroll) | v4.6 | ✅ |
| M12 | Silicon Die (4-layer SVG + parallax) | v4.6 | ✅ |
| M13-A | Pre-flight Screen (CSS-only) | v4.6 | ✅ |
| M13-B | Auth Streamline (Clerk → /dashboard) | v4.6 | ✅ |
| M13-C | Portal Navbar + Dock Bar | v4.6 | ✅ |
| M14 | Landing Page Sovereign Unification | v4.7 | ✅ |
| M15 | Auth Pages Polish | v4.7 | ✅ |
| M16 | Cosmic Purge | v4.7 | ✅ |
| M17 | Formatting & Popover Unification | v4.7 | ✅ |
| M19 | Goals UI Surgical Fix | v4.8 | ✅ |
| M19.2 | Goal Page & Amount Compact Fix | v4.9 | ✅ |
| M20 | Analysis Depth & AI Character Fix | v4.9 | ✅ |
| M21 | Vercel Deployment Fix (Lazy DB Proxy) | v5.0 | ✅ |
| M22 | Silicon Wallet Resurrection (Logo SVG) | v5.0 | ✅ |
| M23 | Final Polish Sweep (Turkish/Auth/DockBar) | v5.0 | ✅ |
| M24 | Database Resilience & Cross-Device Sync | v6.0 | ✅ |
| M25 | Visual Identity — Navbar & DockBar | v6.0 | ✅ |
| M26 | Oracle Hero — Transparent Wallet Center | v6.0 | ✅ |
| M27 | Drawer Contrast & Forms Dark Theme | v6.0 | ✅ |
| M28 | Mobile Safety & AI Button Fix | v6.0 | ✅ |
| M29 | Goals UI & Turkish Final Audit | v6.0 | ✅ |
| M30 | Git Sync & CONVENTIONS Update | v6.0 | ✅ |

---

## Technical Architecture Highlights

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
- **Silicon Die**: 4-layer SVG with Z-axis parallax + 3 light leaks
- **BrainCard**: Real-time Spending Velocity + Goal Pace → AIAssistant
- **AIAssistant**: Context-aware suggestions, Turkish character support, actionable insight buttons

### Navigation
- **PortalNavbar**: NeonWalletIcon logo + "Budgeify" text (tracking-widest), context-aware title, Clerk UserButton
- **DockBar**: Floating pill, center FAB with radial quick-add, spring bounce, energy glow, overlay-aware auto-hide

### Event System (CustomEvent)
- `oracle:open-assistant` — BrainCard → AIAssistant
- `oracle:reset-dashboard` — Logo click → DashboardClient (reset tab + scroll)
- `overlay:show` / `overlay:hide` — AIAssistant + Drawers → DockBar visibility

---

*Project Brain v6.0-sovereign - Budgeify: App-Store Ready*
*Stack: Next.js 14 | Clerk Auth | Drizzle ORM | Neon PostgreSQL | Tailwind CSS 4*
*Design: Depth Black | Indigo Glow #4F46E5 | Neon Cyan #00F0FF | Glassmorphism blur(12px) | Spring 260/20/1*
*DB: Lazy Proxy + Cross-Device Sync (visibility + 60s interval + post-mutation) — server-first authority, skipHydration*
*Navigation: Portal Navbar (NeonWalletIcon + neon gradient "Budgeify") + Dock Bar (grey/neon state sync, no floating version)*
*Oracle: Transparent wallet center (120px, no purple box), dead-center balance, elliptical assembly container*
*Drawer: Sovereign Depth (rgba(13,13,31)) — !important override fixed*
*AI Button: bottom-32 right-4 h-12 w-12 — clears DockBar (360px max-width)*
*Goals: Responsive stat gap (gap-2 sm:gap-3) — iPhone SE safe*
*Turkish: Full ğüşıöç audit verified — all AIAssistant strings correct*

**✅ Sovereign v6.0 — App-Store Ready — All Milestones M24→M30 Complete**

---

## 🚀 Sovereign v6.0: The Final Stabilization — Executable Plan

**Status**: ✅ Completed
**Date**: 2026-02-08
**Goal**: App-Store Ready quality. Zero amateur touches. Production-grade DB sync. Premium visual identity.

### Execution Rules
- Execute milestones **in order** (M24 → M25 → M26 → M27 → M28 → M29 → M30)
- Run `npm run build` after **each milestone** — must be ✅ green before proceeding
- **Never** break ActionResult<T> + Zod patterns
- **Never** break Spring 260/20/1 canonical or M10 Bento Density (8px gap)
- Respect `prefers-reduced-motion` — 60fps only transform+opacity
- After all milestones: `git add . && git commit -m "feat(v6.0): sovereign final polish — app-store ready stabilization" && git push origin main`

---

### M24: Database Resilience & Cross-Device Sync (PRIORITY ALPHA)

**Problem**: User logs into the same Clerk account on different devices but sees different data. Root cause: `DataSyncProvider.syncData()` only runs once on mount. Zustand `persist` middleware writes to localStorage per-device. No re-sync on tab focus, no periodic refresh, no post-mutation server confirmation. Stale localStorage loads instantly and masks server state.

**Files to modify**:
- `src/providers/DataSyncProvider.tsx`
- `src/db/index.ts`
- `src/store/useBudgetStore.ts`

**Tasks**:

**M24-A: Visibility-Based Re-Sync** (`DataSyncProvider.tsx`)
Add a `visibilitychange` + `focus` event listener that triggers `syncData()` when user returns to the tab/app. This is the #1 fix for cross-device consistency — when user switches from Device A to Device B and focuses the tab, fresh server data loads.
```tsx
// Inside DataSyncProvider, add useEffect:
useEffect(() => {
  const handleVisibility = () => {
    if (document.visibilityState === 'visible' && isSignedIn && !operationLockRef.current) {
      syncData();
    }
  };
  const handleFocus = () => {
    if (isSignedIn && !operationLockRef.current) {
      syncData();
    }
  };
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('focus', handleFocus);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('focus', handleFocus);
  };
}, [isSignedIn, syncData]);
```

**M24-B: Periodic Background Sync** (`DataSyncProvider.tsx`)
Add a 60-second interval sync when the tab is active. Silent — no loading state change (use a separate `isSilentSync` flag to skip `setIsLoading(true)` during interval syncs). This catches any server-side changes without user action.
```tsx
useEffect(() => {
  if (!isSignedIn) return;
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible' && !operationLockRef.current) {
      // Silent sync — don't flash loading state
      silentSyncData();
    }
  }, 60_000);
  return () => clearInterval(interval);
}, [isSignedIn]);
```
Create `silentSyncData()` — identical to `syncData()` but skips `setIsLoading(true/false)` calls.

**M24-C: Server-First Data Authority** (`DataSyncProvider.tsx`)
After every successful create/update/delete mutation, call `syncData()` to pull the confirmed server state. This ensures the optimistic UI gets replaced with the real server IDs and timestamps. Currently, only the temp ID gets swapped — but amounts, dates, and other fields aren't re-confirmed.
```tsx
// At the end of each create/update/delete callback, after the server call succeeds:
await syncData(); // Pull confirmed server state
```

**M24-D: DB Proxy Edge Retry** (`src/db/index.ts`)
Strengthen the Proxy getter: if `DATABASE_URL` is missing at runtime (not build-time), log a warning and retry once after 100ms before returning undefined. This covers Vercel Edge cold-start timing.
```tsx
get(_target, prop, receiver) {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      // Build-time: return undefined silently
      if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
        return undefined;
      }
      // Runtime cold-start: warn
      console.warn('[Budgeify] DATABASE_URL not yet available — edge cold-start');
      return undefined;
    }
    _db = createDb();
  }
  return Reflect.get(_db, prop, receiver);
}
```

**M24-E: Zustand Hydration Guard** (`src/store/useBudgetStore.ts`)
Add `skipHydration: true` to the persist config so server data from DataSyncProvider always takes priority over stale localStorage. Zustand's persist middleware currently hydrates from localStorage BEFORE DataSyncProvider's server fetch completes — causing a flash of stale data that can confuse the sync.
```tsx
{
  name: 'budgeify-store',
  version: 2,
  skipHydration: true, // Server data takes priority
  // ...existing migrate config
}
```
Then in `DataSyncProvider`, after successful sync, call `useBudgetStore.persist.rehydrate()` to load any localStorage data that wasn't overwritten by the server (like currency preference).

**Verification**: Open app on two browser tabs. Add income on Tab A. Switch to Tab B — data must appear within seconds (visibility re-sync). Wait 60s on Tab B without switching — data must appear (periodic sync).

---

### M25: Visual Identity — Navbar & DockBar (PRIORITY BETA)

**Files to modify**:
- `src/components/layout/PortalNavbar.tsx`
- `src/components/layout/DockBar.tsx`
- `src/app/globals.css`

**Tasks**:

**M25-A: Neon Cyan Text Gradient** (`globals.css`)
Add a new `.text-gradient-neon` class for the "Budgeify" brand text. The current `.text-gradient` uses indigo→violet which doesn't match the neon cyan wallet icon palette.
```css
.text-gradient-neon {
  background: linear-gradient(135deg, #00F0FF 0%, #00D4E8 40%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**M25-B: PortalNavbar Logo Refinement** (`PortalNavbar.tsx`)
- Replace `text-gradient` class → `text-gradient-neon`
- Reduce icon size: 28 → 24px
- Reduce font: `text-lg` → `text-[15px]`
- Tighten gap: `gap-2.5` → `gap-2`
- Reduce padding: `px-4 sm:px-6` → `px-3 sm:px-5`

**M25-C: DockBar Icon State Sync** (`DockBar.tsx`)
The NeonWalletIcon has a permanent cyan glow via its built-in `filter: drop-shadow(...)` in the SVG. When inactive, it must match the grey/muted look of other Lucide icons (`text-zinc-500`).
- In `DockItem`, when rendering `NeonWalletIcon` (detected by checking `icon === NeonWalletIcon` or via a prop):
  - **Inactive**: Apply `style={{ filter: 'grayscale(1) brightness(0.5)', transition: 'filter 0.2s ease' }}`
  - **Active**: Apply `style={{ filter: 'drop-shadow(0 0 4px rgba(0,240,255,0.5))', transition: 'filter 0.2s ease' }}`
- Ensure `size={22}` matches other icons (already correct).

**M25-D: Version Tag — Professional Placement** (`DockBar.tsx` + `globals.css`)
Remove the amateur `v5.0-final` tag floating above the DockBar. Replace with a subtle, professional version indicator:
- Remove the `<span className="absolute -top-5 ...">v5.0-final</span>` from DockBar
- Add a minimal version line at the very bottom of the dashboard page content (inside `DashboardClient.tsx`), below all bento cards:
```tsx
<p className="text-center text-[10px] text-white/10 py-4 select-none">
  Budgeify v6.0
</p>
```
This is the Apple approach — version info at the bottom of scrollable content, never floating over UI.

**Verification**: Navbar text has neon cyan→indigo gradient. DockBar wallet icon is grey when inactive, neon cyan when active. No floating version tag above DockBar. Subtle version at page bottom.

---

### M26: Oracle Hero — Transparent Wallet Center (PRIORITY BETA)

**Files to modify**:
- `src/components/features/oracle/OracleHero.tsx`
- `src/app/globals.css`

**Tasks**:

**M26-A: Remove Purple Box** (`OracleHero.tsx`)
The current center die has:
1. A `blur-lg` glow div with `linear-gradient(135deg, #00F0FF, #4F46E5, #00B8D4)`
2. An `ai-gradient p-4 rounded-2xl` solid purple/indigo background container
3. NeonWalletIcon at 80px inside it

Replace with:
- Remove the `<div className="absolute inset-0 rounded-2xl blur-lg opacity-60" ...>` (inner blur glow)
- Remove the `<div className="relative ai-gradient p-4 rounded-2xl ...">` wrapper (solid purple box)
- Render NeonWalletIcon directly at **size={120}**, transparent (no background), with only a subtle ambient drop-shadow
- Keep the outer `motion.div` with `coreScale` and `coreDockY` transforms

Result structure:
```tsx
<motion.div layoutId="neon-wallet-core">
  <NeonWalletIcon
    size={120}
    className="oracle-center-wallet"
    style={{
      filter: oracleState === 'active'
        ? 'drop-shadow(0 0 20px rgba(0,240,255,0.4)) drop-shadow(0 0 50px rgba(0,184,212,0.2))'
        : 'drop-shadow(0 0 10px rgba(0,240,255,0.15))',
      transition: 'filter 0.5s ease',
    }}
  />
</motion.div>
```

**M26-B: Dead-Center Balance Text** (`OracleHero.tsx`)
Move the balance `<Counter />` (the `formatCurrencyCompact` readout) to be **absolutely centered inside the wallet SVG** using `absolute inset-0 flex items-center justify-center`. The balance text should overlap the wallet center.
```tsx
<motion.div layoutId="neon-wallet-core" className="relative">
  <NeonWalletIcon size={120} ... />
  {/* Balance overlay — dead center */}
  <AnimatePresence>
    {oracleState === 'active' && (
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ opacity: dataReadoutOpacity }}
      >
        <span className="text-base font-black tabular-nums text-white drop-shadow-lg">
          {formatCurrencyCompact(balance, currency)}
        </span>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```
Remove the old separate `absolute inset-0 flex flex-col` data readout div that was positioned over the purple box.

**M26-C: Elliptical Assembly Shape** (`globals.css`)
Change `.oracle-assembly-container` from circular to wider ellipse for better mobile fit:
```css
.oracle-assembly-container {
  height: 360px;
  max-width: 420px;
  border-radius: 45% / 40%;  /* wider, shallower ellipse */
}

@media (min-width: 768px) {
  .oracle-assembly-container {
    height: 400px;
    max-width: 480px;
  }
}

@media (min-width: 1024px) {
  .oracle-assembly-container {
    height: 440px;
    max-width: 540px;
  }
}
```
Remove the `rounded-full` class from OracleHero's container div (it was overriding CSS).

**Verification**: Oracle center shows a large transparent wallet SVG with no purple/indigo box behind it. Balance text is dead-center over the wallet. Assembly shape is an elegant ellipse, not a perfect circle.

---

### M27: Drawer Contrast & Forms Dark Theme (PRIORITY GAMMA)

**Files to modify**:
- `src/app/globals.css`

**Tasks**:

**M27-A: Vaul Drawer Sovereign Depth** (`globals.css`)
The `[vaul-drawer-content]` CSS uses `rgba(24, 24, 27, 0.98) !important` — a **zinc** tone that clashes with the sovereign indigo depth palette. The component's inline style sets `rgba(13, 13, 31, 0.98)` but the `!important` overrides it.
```css
[vaul-drawer-content] {
  background: linear-gradient(180deg, rgba(13, 13, 31, 0.98) 0%, rgba(10, 10, 26, 0.98) 100%) !important;
  /* ...keep other properties unchanged */
}
```
Also update `[vaul-drawer-overlay]`:
```css
[vaul-drawer-overlay] {
  background: rgba(5, 5, 8, 0.85) !important;
  /* ...keep blur unchanged */
}
```

**Verification**: Open Income or Expense drawer. Background should be deep indigo-tinted black, NOT grey zinc. Overlay should match sovereign body tint.

---

### M28: Mobile Safety & AI Button Fix (PRIORITY GAMMA)

**Files to modify**:
- `src/components/features/ai/AIAssistant.tsx`
- `src/app/globals.css`

**Tasks**:

**M28-A: AI Button Position** (`AIAssistant.tsx`)
Move the floating AI button from `bottom-24 right-5` (96px) to `bottom-32 right-4` (128px) to clear the DockBar which occupies ~118px from viewport bottom (48px offset + 70px height). Also reduce from `h-14 w-14` → `h-12 w-12` for tighter mobile fit (48px = Apple HIG minimum tap target).
```tsx
<motion.button
  className="fixed bottom-32 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full ai-gradient ai-glow animate-pulse-glow"
  ...
>
  <Sparkles size={20} className="text-white" strokeWidth={2} />
</motion.button>
```

**M28-B: DockBar AI-Safe Zone** (`globals.css`)
Add a `max-width` constraint to prevent DockBar from becoming too wide on tablets and overlapping the AI button area:
```css
.dock-bar {
  max-width: 360px; /* was 380px — tighter for mobile breathing room */
}
```

**Verification**: On 375px (iPhone) viewport, AI button must NOT overlap DockBar. Tap targets are clear and distinct.

---

### M29: Goals UI & Turkish Final Audit (PRIORITY GAMMA)

**Files to modify**:
- `src/components/features/goals/GoalCard.tsx`
- `src/components/features/ai/AIAssistant.tsx` (audit only)

**Tasks**:

**M29-A: Stat Grid Responsive Gap** (`GoalCard.tsx`)
On very narrow screens (320px iPhone SE), the 3-column stat grid with `gap-3` can feel tight. Change to responsive gap:
```tsx
<div className="grid grid-cols-3 gap-2 sm:gap-3">
```

**M29-B: Turkish Character Audit** (`AIAssistant.tsx`)
Verify ALL hardcoded strings use proper Turkish: ğ, ü, ş, ı, ö, ç. Check:
- `SUGGESTION_MAP` entries
- `getNextContext` keyword matching (must match both ASCII and Turkish variants)
- `initializeChat` greeting
- `handleResetContext` message
- All `aria-label` attributes

This is an **audit-only** task. If all strings are already correct (they should be from v4.9/v5.0), no changes needed. Document the verification.

**Verification**: Open AI Assistant. All Turkish text renders correctly. Goal stat grid doesn't overflow on small screens.

---

### M30: Git Sync & CONVENTIONS Update (FINAL)

**Tasks**:
1. Update CONVENTIONS.md: Mark M24–M29 as Completed in the milestone log table
2. Update the milestone registry table with new entries
3. Update version footer in CONVENTIONS.md to v6.0
4. Run: `npm run build` — must be ✅ green
5. Run: `git add . && git commit -m "feat(v6.0): sovereign final polish — app-store ready stabilization" && git push origin main`

---

### v6.0 Files Impact Matrix

| File | Milestones | Changes |
|------|-----------|---------|
| `src/providers/DataSyncProvider.tsx` | M24-A,B,C,E | Visibility re-sync, periodic 60s sync, post-mutation re-sync, hydration control |
| `src/db/index.ts` | M24-D | Edge cold-start build-phase detection |
| `src/store/useBudgetStore.ts` | M24-E | `skipHydration: true` for server-first authority |
| `src/components/layout/PortalNavbar.tsx` | M25-B | Logo sizing, neon text gradient |
| `src/components/layout/DockBar.tsx` | M25-C,D | Icon grey/active states, remove version tag |
| `src/app/(dashboard)/dashboard/DashboardClient.tsx` | M25-D | Version at page bottom |
| `src/components/features/oracle/OracleHero.tsx` | M26-A,B | Transparent wallet, dead-center balance |
| `src/app/globals.css` | M25-A, M26-C, M27-A, M28-B | Neon gradient, ellipse shape, drawer contrast, dock width |
| `src/components/features/ai/AIAssistant.tsx` | M28-A, M29-B | Button position, Turkish audit |
| `src/components/features/goals/GoalCard.tsx` | M29-A | Responsive stat gap |
| `CONVENTIONS.md` | M30 | Milestone log + version |

### Constraints Preserved
- **ActionResult\<T\> + Zod** — untouched
- **M10 Bento Density** — 8px gap preserved
- **Spring 260/20/1** — canonical
- **prefers-reduced-motion** — respected
- **60fps** — only transform+opacity animations
- **Event System** — oracle:open-assistant, oracle:reset-dashboard, overlay:show/hide unchanged

---

*Project Brain v6.0-sovereign - Budgeify: App-Store Ready*
*Stack: Next.js 14 | Clerk Auth | Drizzle ORM | Neon PostgreSQL | Tailwind CSS 4*
*Design: Depth Black | Indigo Glow #4F46E5 | Neon Cyan #00F0FF | Glassmorphism blur(12px) | Spring 260/20/1*
*DB: Lazy Proxy + Cross-Device Sync (visibility + 60s interval + post-mutation) — server-first authority*
*Navigation: Portal Navbar (NeonWalletIcon + neon gradient "Budgeify") + Dock Bar (grey/neon state sync, no floating version)*
*Oracle: Transparent wallet center, dead-center balance, elliptical assembly container*
*Drawer: Sovereign Depth (rgba(13,13,31)) — !important override fixed*

**✅ Sovereign v6.0 — Execution Complete — Build Green — App-Store Ready**
