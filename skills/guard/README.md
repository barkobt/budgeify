# Skill: Security & Authentication (Clerk)

> Budgeify'ın güvenlik katmanı ve kullanıcı kimlik doğrulama sistemi.
> Tetikleyici: Auth, güvenlik, yetkilendirme, kullanıcı yönetimi görevleri.

---

## Authentication Provider: Clerk

### Why Clerk?
- Next.js 14 App Router native support
- Pre-built UI components (SignIn, SignUp, UserButton)
- Webhook-based user sync
- Multi-factor authentication
- Session management

---

## Middleware Configuration

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',                    // Landing page
  '/sign-in(.*)',         // Auth pages
  '/sign-up(.*)',         // Auth pages
  '/api/webhooks(.*)',    // Webhook endpoints
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

## Route Protection Strategy

```
PUBLIC ROUTES (no auth required):
├── /                    → Landing page
├── /sign-in             → Clerk sign-in
├── /sign-up             → Clerk sign-up
└── /api/webhooks/*      → Webhook handlers

PROTECTED ROUTES (auth required):
├── /dashboard           → Main app
├── /transactions        → Income/Expense lists
├── /goals               → Savings goals
├── /analytics           → Charts & reports
└── /settings            → User preferences
```

---

## Auth in Server Actions

```typescript
// PATTERN: Every server action starts with auth check
import { auth } from '@clerk/nextjs/server';

export async function protectedAction() {
  // 1. Get authenticated user
  const { userId } = await auth();

  // 2. Reject if not authenticated
  if (!userId) {
    return { success: false, error: 'Unauthorized' } as const;
  }

  // 3. Use userId for all DB operations
  const data = await db.select()
    .from(table)
    .where(eq(table.userId, userId));

  return { success: true, data } as const;
}
```

---

## Authorization (Resource Ownership)

```typescript
// CRITICAL: Every resource access must verify ownership
export async function updateIncome(id: string, input: UpdateInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' } as const;

  // Ownership check - NEVER skip this
  const [income] = await db.select()
    .from(incomes)
    .where(and(
      eq(incomes.id, id),
      eq(incomes.userId, userId)  // ← CRITICAL
    ))
    .limit(1);

  // Don't reveal existence of other users' resources
  if (!income) {
    return { success: false, error: 'Kayıt bulunamadı' } as const;
  }

  // Proceed with update...
}
```

---

## User Sync (Clerk Webhook)

```
Flow:
1. User signs up via Clerk
2. Clerk sends webhook to /api/webhooks/clerk
3. Webhook handler creates user record in Neon DB
4. App uses clerkId to link all user data

Events handled:
- user.created  → Insert into users table
- user.updated  → Update user record
- user.deleted  → Soft delete user and cascade
```

---

## Auth UI Components

```tsx
// Sign-in page
// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-accent-500 hover:bg-accent-600',
            card: 'glass-card',
          }
        }}
      />
    </div>
  );
}

// User button in header
import { UserButton } from '@clerk/nextjs';
<UserButton afterSignOutUrl="/" />
```

---

## Input Validation (Defense in Depth)

```typescript
// Layer 1: Client-side (UX feedback)
const schema = z.object({
  amount: z.number().positive("Tutar pozitif olmalı"),
  note: z.string().max(200, "Not en fazla 200 karakter"),
});

// Layer 2: Server-side (security)
export async function createExpense(input: unknown) {
  const parsed = ExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Geçersiz veri' } as const;
  }
  // Use parsed.data (sanitized)
}

// Layer 3: Database constraints
amount: decimal('amount', { precision: 12, scale: 2 }).notNull()
```

---

## Environment Variables

```bash
# .env.local (NEVER commit)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## Security Checklist

```
[✓] Clerk middleware on all protected routes
[✓] Auth check as first line in every server action
[✓] Ownership verification on every resource access
[✓] Zod validation on every external input
[✓] Webhook signature verification
[✓] Environment variables in .env.local (not committed)
[✓] NEXT_PUBLIC_ prefix only for client-safe values
[✓] Generic error messages to client (no internal details)
[✓] Rate limiting on API routes (Clerk built-in)
[✓] CSRF protection (Next.js built-in for Server Actions)
```

---

## Prohibited

```
❌ Exposing CLERK_SECRET_KEY to client
❌ Skipping auth check in server actions
❌ Skipping ownership check on resource access
❌ Trusting client-side validation alone
❌ Revealing resource existence to unauthorized users
❌ Storing sensitive data in localStorage
❌ Hardcoding API keys in source code
```

---

*Skill Module: Security & Authentication*
*Stack: Clerk Auth | Zod Validation | Neon PostgreSQL*
