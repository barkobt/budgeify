# Budgeify — Architecture Overview

## Stack
- **Framework:** Next.js 14 (App Router, SSR)
- **Language:** TypeScript 5.7 (strict mode)
- **Styling:** Tailwind CSS 4.0 (CSS-first config)
- **State:** Zustand 5.0 with persist middleware
- **Auth:** Clerk (NextJS SDK)
- **Database:** Neon (PostgreSQL via Drizzle ORM)
- **Charts:** Recharts 2.14
- **Animations:** Framer Motion 11.15
- **Validation:** Zod 3.24
- **Icons:** Lucide React

## Directory Layout
```
src/
├── app/          # Next.js App Router pages + layouts
├── actions/      # Server Actions (income, expense, goal)
├── components/
│   ├── ui/       # Reusable primitives (Button, Card, Input, etc.)
│   ├── features/ # Domain-specific components
│   └── layout/   # Header, BottomNav, Sidebar
├── store/        # Zustand stores
├── lib/          # Business logic, utilities (analytics, logger)
├── types/        # TypeScript interfaces
├── utils/        # Helper functions
├── constants/    # Category definitions, config
└── providers/    # React context providers (DataSync)
```

## Data Flow
1. **Auth:** Clerk middleware protects routes, provides userId
2. **Server Actions:** CRUD operations run server-side via `"use server"`
3. **Database:** Drizzle ORM → Neon PostgreSQL
4. **Client State:** Zustand stores hydrate from server data via DataSyncProvider
5. **UI:** React components render from Zustand state

## Key Patterns
- **SSR disabled for store-dependent components** (dynamic import with `ssr: false`)
- **Tab-based navigation** on single page (no route transitions for main views)
- **Glassmorphism design system** with Cosmic Indigo theme
- **Centralized logger** replaces raw console usage
