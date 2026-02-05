# Budgeify Sovereign v2.0 — QA Checklist

**Last verified:** 2026-02-06
**Build:** Next.js 14.2.35 | Node 18

## Build & Lint
- [x] `npm run build` passes with 0 errors
- [x] `npm run lint` passes with 0 errors/warnings
- [x] `npm run typecheck` passes with 0 errors
- [x] No `console.log` in production code (centralized logger + error-reporting)

## PWA
- [x] manifest.json valid and referenced in layout.tsx
- [x] Icons: icon-192.png (24.5kB), icon-512.png (76kB), favicon-32.png (2.1kB)
- [x] Apple touch icon: apple-icon-180.png (21.9kB)
- [x] Theme color matches cosmic dark theme (#080B14)

## Accessibility
- [x] SkipNav component for keyboard navigation
- [x] ARIA labels on interactive elements (dashboard, forms, combobox)
- [x] Focus indicators via Tailwind ring utilities
- [x] Semantic HTML (main, section, article roles)
- [x] ErrorBoundary provides accessible fallback UI

## Performance
- [x] Dashboard First Load JS: 148kB (target < 150kB)
- [x] Skeleton loaders on all dynamic imports (no layout shift)
- [x] Framer Motion animations with spring physics
- [x] Bundle analyzer available: `npm run analyze`

## Security
- [x] No secrets in client bundle (env vars server-side only)
- [x] Security headers: X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy
- [x] Headers in both next.config.mjs (SSR) and vercel.json (edge)
- [x] Clerk auth middleware on all protected routes
- [x] Ownership verification on all CRUD operations

## Error Handling
- [x] ErrorBoundary wraps app with fallback UI
- [x] Sentry-ready error-reporting abstraction
- [x] Breadcrumb trail for debugging context
- [x] All server actions route through reportError()
- [x] All form components route through reportError()

## CI/CD
- [x] GitHub Actions: typecheck + lint + build on push/PR to main
- [x] Vercel deployment configured (vercel.json)
- [x] Static asset caching (icons: immutable, 1 year)

## Data Integrity
- [x] Zod available for input validation
- [x] Zustand persist middleware for offline state
- [x] Optimistic updates with rollback on server error
- [x] Oracle AI uses deterministic heuristics (no LLM hallucination)
