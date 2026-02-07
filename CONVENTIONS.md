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
| 2026-02-07 | v4.6 M13-B: Auth Streamline | Planned | Clerk `afterSignInUrl`/`afterSignUpUrl` → `/dashboard` direct redirect, eliminate intermediate step |
| 2026-02-07 | v4.6 M11: Cinematic Assembly | Planned | 200vh runway, 4-phase choreography (Awakening→Assembly→Ignition→Dock), ambient layer ignition, scroll progress indicator, seamless handover via layoutId, chromatic aberration + screen shake on dock |
| 2026-02-07 | v4.6 M12: Silicon Die | Planned | `SiliconDie.tsx` — 4-layer SVG (substrate→traces→core→heatspreader), Z-axis parallax, light leaks, 3 size states (100/120/64px), replaces Wallet icon |

---

*Project Brain v4.6 - Budgeify Sovereign: The Mechanical Heart*
*Stack: Next.js 14 | Clerk Auth | Drizzle ORM | Neon PostgreSQL | Tailwind CSS 4*
*Design: Depth Black (atmosphere) | Indigo Glow #4F46E5 | Glassmorphism blur(12px) + inner light | Spring Physics 260/20/1*
*API: ActionResult<T> + Zod universal mandate | Oracle: Chip Core 4-phase cinematic | Runway 200vh*
*Bento: 8px gap, high-density 1×1 widgets | Currency: TRY/USD/EUR with convertAmount*
*Navigation: Portal Navbar (top command strip) + Dock Bar (floating pill, center FAB)*
*Execution Spec: skills/architect/v46-plan.md*
