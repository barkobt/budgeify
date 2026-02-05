# Budgeify — Decision Log

## Sprint 1 Decisions

| ID | Decision | Rationale | Date |
|----|----------|-----------|------|
| D-001 | Use `sharp` for PWA icon generation | Reliable, fast SVG→PNG; added as devDep with generation script | 2026-02-06 |
| D-002 | ESLint extends `next/core-web-vitals` + `@typescript-eslint/recommended` | Covers Next.js best practices + strict TS rules | 2026-02-06 |
| D-003 | Centralized logger with env-aware log levels | Suppresses debug/info in production, keeps error/warn | 2026-02-06 |
| D-004 | Cosmic dark theme in manifest.json | Align PWA chrome with app's actual dark theme | 2026-02-06 |
