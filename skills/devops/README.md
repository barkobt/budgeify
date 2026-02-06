# Skill: DevOps & Deployment

> Budgeify'ın deployment, CI/CD ve altyapı yönetimi.
> Tetikleyici: Deploy, build, environment, CI/CD, performans görevleri.

---

## Deployment Stack

| Service | Purpose |
|---------|---------|
| **Vercel** | Next.js hosting, edge functions, preview deploys |
| **Neon** | Serverless PostgreSQL database |
| **Clerk** | Authentication service |
| **GitHub** | Source control, CI triggers |

---

## Environment Variables

### Required (.env.local)
```bash
# Database (Neon)
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Variable Rules
- `NEXT_PUBLIC_` prefix → exposed to browser (safe values only)
- No prefix → server-only (secrets)
- Never commit `.env.local`
- Use `.env.example` as template

---

## Build & Deploy Commands

```bash
# Local Development
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint check
npm run typecheck        # TypeScript check

# Database
npm run db:push          # Push schema to DB (dev only)
npm run db:generate      # Generate migration files
npm run db:studio        # Open Drizzle Studio

# Analysis
npm run analyze          # Bundle analyzer
```

---

## Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## Deployment Checklist

### Pre-Deploy
```
[ ] npm run typecheck passes (0 errors)
[ ] npm run lint passes
[ ] npm run build succeeds (0 errors)
[ ] Bundle size < 150kB first load
[ ] All environment variables set in Vercel
[ ] Database schema up to date (migrations applied)
[ ] Clerk webhook URL configured
```

### Post-Deploy
```
[ ] Landing page loads correctly
[ ] Sign-in/sign-up flow works
[ ] Dashboard loads with data
[ ] CRUD operations work (create, read, update, delete)
[ ] Mobile responsive check
[ ] Performance: LCP < 2.5s, FID < 100ms, CLS < 0.1
```

---

## Git Workflow

### Branch Strategy
```
main              → Production (auto-deploy to Vercel)
feature/*         → New features
fix/*             → Bug fixes
refactor/*        → Code improvements
```

### Commit Convention
```
feat(scope): description     # New feature
fix(scope): description      # Bug fix
style(scope): description    # UI/styling change
refactor(scope): description # Code restructure
docs(scope): description     # Documentation
test(scope): description     # Tests
chore(scope): description    # Maintenance
```

### Scopes
`ui` | `income` | `expense` | `analytics` | `goals` | `auth` | `db` | `oracle` | `landing` | `layout` | `store` | `actions` | `deps`

---

## Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Load JS | < 150kB | `npm run build` |
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Build Time | < 30s | Vercel logs |
| Cold Start | < 1s | Vercel Edge |

---

## Database Operations

### Development
```bash
# Quick schema push (no migration files)
npm run db:push

# Visual database browser
npm run db:studio
```

### Production
```bash
# Generate migration SQL
npm run db:generate

# Apply migrations (via Drizzle Kit or CI)
# Migrations are in src/db/migrations/
```

### Backup Strategy
- Neon provides automatic daily backups
- Point-in-time recovery available
- Database branching for testing migrations

---

## Monitoring

### Error Tracking
- Vercel built-in error logging
- Server action error logs with context
- Error boundaries for client-side crashes

### Performance Monitoring
- Vercel Analytics (Web Vitals)
- Bundle analyzer for size regression
- Database query timing logs

---

## Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Prohibited

```
❌ Deploying without build check
❌ Committing .env.local or secrets
❌ Using db:push in production
❌ Skipping TypeScript check before deploy
❌ Deploying with console.log debug statements
❌ Missing environment variables in Vercel
❌ Ignoring bundle size regressions
```

---

*Skill Module: DevOps & Deployment*
*Stack: Vercel | Neon | GitHub | Clerk*
