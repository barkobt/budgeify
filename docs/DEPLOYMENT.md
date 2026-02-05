# Budgeify — Deployment Guide

## Platform
Vercel (recommended) — auto-deploys from `main` branch.

## Environment Variables
Required in Vercel dashboard:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## Build Commands
```bash
npm run build     # Production build
npm run lint      # ESLint check
npm run typecheck # TypeScript check
```

## Pre-deploy Checklist
1. All quality gates pass (build, lint, typecheck)
2. Environment variables configured on Vercel
3. Database migrations applied (`npm run db:push`)
4. PWA icons present in `/public/`

## Vercel Configuration
See `vercel.json` in project root (Sprint 4).
