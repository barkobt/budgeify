# Skill: System Architecture & Planning

> Budgeify'ın mimari kararları ve sistem tasarım prensipleri.
> Tetikleyici: Yeni özellik planlama, mimari değişiklik, sistem tasarımı görevleri.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14 App Router)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Landing  │  │Dashboard │  │  Forms   │  │  Oracle AI     │  │
│  │  Page    │  │ (Auth)   │  │ (CRUD)   │  │  (Chat + DB)   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │
│       │             │             │                 │           │
│  ┌────┴─────────────┴─────────────┴─────────────────┴─────────┐ │
│  │                  Server Actions (API Layer)                 │ │
│  └─────────────────────────────┬───────────────────────────────┘ │
└────────────────────────────────┼────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────┐
│                        MIDDLEWARE                                │
│  ┌─────────────────────────────┴──────────────────────────────┐  │
│  │                   Clerk Auth Middleware                      │  │
│  │            (Protected routes, user sessions)                │  │
│  └─────────────────────────────┬──────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────┐
│                         BACKEND                                  │
│  ┌──────────────┐  ┌──────────┴──────────┐  ┌────────────────┐  │
│  │   Drizzle    │  │  Neon PostgreSQL    │  │  Clerk Auth    │  │
│  │     ORM      │──│  (Serverless DB)    │  │   Service      │  │
│  └──────────────┘  └─────────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
budgeify/
├── src/
│   ├── app/
│   │   ├── (auth)/                # Auth route group (public)
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/           # Protected route group
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── transactions/page.tsx
│   │   │   ├── goals/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/webhooks/clerk/route.ts
│   │   ├── page.tsx               # Landing page (public)
│   │   ├── layout.tsx             # Root layout (ClerkProvider)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                    # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── AnimatedCounter.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── features/              # Feature-specific components
│   │   │   ├── income/
│   │   │   ├── expenses/
│   │   │   ├── analytics/
│   │   │   ├── goals/
│   │   │   └── oracle/            # AI Assistant
│   │   ├── landing/               # Landing page components
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   └── CTA.tsx
│   │   └── layout/                # Layout components
│   │       ├── Header.tsx
│   │       ├── BottomNav.tsx
│   │       └── Sidebar.tsx
│   │
│   ├── actions/                   # Server Actions (API layer)
│   │   ├── income.ts
│   │   ├── expense.ts
│   │   ├── goal.ts
│   │   ├── category.ts
│   │   └── user.ts
│   │
│   ├── db/                        # Database layer
│   │   ├── index.ts               # Drizzle client
│   │   ├── schema.ts              # Table definitions
│   │   └── migrations/            # Schema migrations
│   │
│   ├── lib/                       # Shared utilities
│   │   ├── auth.ts                # Clerk helpers
│   │   ├── analytics.ts           # Analytics calculations
│   │   └── oracle/                # AI Agent logic
│   │
│   ├── store/                     # Zustand (client-only state)
│   │   └── useBudgetStore.ts
│   │
│   ├── styles/
│   │   └── themeConfig.ts         # Design tokens
│   │
│   ├── types/
│   │   └── index.ts               # Shared TypeScript types
│   │
│   ├── utils/
│   │   └── index.ts               # formatCurrency, formatDate, etc.
│   │
│   └── constants/
│       └── categories.ts          # Default categories
│
├── skills/                        # AI Skill Modules
│   ├── ui/README.md
│   ├── api/README.md
│   ├── guard/README.md
│   ├── data/README.md
│   ├── debug/README.md
│   ├── architect/README.md
│   └── devops/README.md
│
├── middleware.ts                   # Clerk auth middleware
├── drizzle.config.ts              # Drizzle Kit config
├── CONVENTIONS.md                 # Project Brain
├── CLAUDE.md                      # Developer guide
└── DESIGN_PHILOSOPHY.md           # Design system docs
```

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | SSR, Server Actions, Node 18 compat |
| **Auth** | Clerk | Native Next.js support, pre-built UI |
| **Database** | Neon PostgreSQL | Serverless, edge-compatible, free tier |
| **ORM** | Drizzle | Type-safe, minimal overhead, edge runtime |
| **Styling** | Tailwind CSS 4 | CSS-first config, utility classes |
| **State** | Zustand | Lightweight, persist middleware |
| **Validation** | Zod | Runtime + TypeScript inference |
| **Charts** | Recharts | React-native, responsive |
| **Animation** | Framer Motion | Declarative, GPU-accelerated |
| **Icons** | Lucide React | Tree-shakeable, consistent |
| **Toast** | Sonner | Minimal, beautiful |
| **Drawer** | Vaul | Mobile-native bottom sheets |
| **Deployment** | Vercel | Zero-config Next.js hosting |

---

## Design Principles

### 1. Server-First
- Data fetching via Server Actions (not client-side fetch)
- Server Components by default, `'use client'` only when needed
- `revalidatePath` for cache invalidation

### 2. Multi-Tenant Isolation
- Every DB query filtered by `userId`
- No shared data between users
- Ownership verification on every resource access

### 3. Progressive Enhancement
- Works without JavaScript (basic HTML)
- Enhanced with client-side interactivity
- Graceful degradation for slow connections

### 4. Mobile-First
- Design for 375px, enhance for larger screens
- Bottom navigation for mobile, sidebar for desktop
- Touch-optimized (44px minimum targets)

---

## Feature Planning Template

```markdown
## Feature: [Name]

### Problem
What user problem does this solve?

### Solution
How will we solve it?

### Data Model
What schema changes are needed?

### Server Actions
What CRUD operations are needed?

### UI Components
What components need to be created/modified?

### Edge Cases
- Empty state
- Error state
- Loading state
- Boundary conditions

### Security
- Auth requirements
- Input validation
- Authorization rules

### Testing
- Unit tests for actions
- Integration tests for queries
- Component tests for UI
```

---

## Scaling Considerations

### Current (v2.0)
- Single Neon database
- Clerk free tier
- Vercel hobby plan
- localStorage for client preferences

### Future (v3.0+)
- Database connection pooling
- Redis for caching
- Rate limiting
- Multi-currency support
- Family/shared budgets
- Bank API integration

---

*Skill Module: System Architecture & Planning*
*Codename: Sovereign (Egemen)*
