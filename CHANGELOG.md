# Changelog

## [2.0.0] - 2026-02-06

### Sovereign v2.0 — Premium Fintech Edition

#### Sprint 1: Stabilization & Technical Debt
- Generated PWA icons (32, 180, 192, 512 PNG) from SVG source
- Configured ESLint with `next/core-web-vitals` + `@typescript-eslint/recommended`
- Created `/docs` governance structure (8 docs + 6 ADRs)
- Fixed manifest.json theme mismatch (light → cosmic dark `#080B14`)
- Replaced 14 `console.error` calls with centralized logger utility
- Added `npm run typecheck` script

#### Sprint 2: Premium UX Upgrade
- Added SkipNav accessibility component
- Created universal Skeleton component with card, list, chart variants
- Added skeleton loaders to all dynamic dashboard imports
- Built Framer Motion preset library (`lib/motion.ts`)
- Added `whileTap` micro-interactions to all buttons
- Implemented scroll-aware dashboard with stagger/reveal animations

#### Sprint 3: Oracle AI Advisor
- Built deterministic financial heuristics engine (`src/lib/oracle/`)
- Category breakdown, MoM trend analysis, anomaly detection
- 5-factor health score (A-F grading, 0-100 scale)
- Goal progress analysis with daily savings estimation
- Template-based Turkish insight generation
- Confidence estimation per insight based on data availability
- localStorage memory for insight persistence
- Integrated Oracle into AI Assistant chat interface

#### Sprint 4: Production Hardening
- Added `vercel.json` with security headers + static asset caching
- Created GitHub Actions CI pipeline (typecheck + lint + build)
- Added security headers in `next.config.mjs` (HSTS, X-Frame-Options, etc.)
- Built Sentry-ready error reporting abstraction (`src/lib/error-reporting.ts`)
- Migrated all error handling to structured `reportError()` calls
- Added `@next/bundle-analyzer` with `npm run analyze` script

#### Sprint 5: Product Finalization
- Completed QA checklist (all 28 items verified)
- Visual regression sanity pass (all imports/exports validated)
- Final build verified: 148kB dashboard, 0 errors, 0 warnings
- Architecture Decision Records: ADR-001 through ADR-006

### Build Metrics
- **Dashboard First Load JS:** 148kB
- **Shared JS:** 87.9kB
- **Build errors:** 0
- **Lint warnings:** 0
- **TypeScript errors:** 0

### Architecture
- **Framework:** Next.js 14.2 (App Router)
- **Auth:** Clerk
- **Database:** Neon PostgreSQL (Drizzle ORM)
- **State:** Zustand 5.0 with persist middleware
- **Styling:** Tailwind CSS 4.0 (Cosmic Indigo theme)
- **Animations:** Framer Motion 11.15
- **AI:** Oracle deterministic heuristics (no LLM dependency)
- **Error Tracking:** Pluggable abstraction (Sentry-ready)
- **CI:** GitHub Actions
- **Deploy:** Vercel

---

## [1.1.0] - 2026-02-05

### Professional Edition
- Animated number counters
- Deep Slate dark theme
- Vaul drawer integration
- Goal delete functionality
- Micro-animations suite

## [1.0.0] - 2026-02-05

### Initial Release
- Income/expense tracking with category system
- Analytics (pie, line, bar charts)
- Savings goals with progress tracking
- PWA support
- Turkish language interface
