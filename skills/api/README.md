# Skill: API & Server Actions

> Budgeify'ın veri katmanı ve sunucu tarafı iş mantığı.
> Tetikleyici: CRUD operasyonları, server action yazma, endpoint oluşturma görevleri.

---

## Architecture

Budgeify v2.0 **Server Actions** pattern kullanır (Next.js 14 App Router).
API Routes sadece webhook'lar için kullanılır.

```
src/actions/
├── income.ts        # Gelir CRUD
├── expense.ts       # Gider CRUD
├── goal.ts          # Hedef CRUD
├── user.ts          # Kullanıcı sync
└── category.ts      # Kategori yönetimi

src/app/api/
└── webhooks/
    └── clerk/
        └── route.ts # Clerk webhook handler
```

---

## Server Action Template

Her server action bu sırayı takip eder: **Auth → Validate → Execute → Revalidate**

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { incomes } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq, and, desc, isNull } from 'drizzle-orm';

// 1. Schema Definition
const CreateIncomeSchema = z.object({
  amount: z.number().positive("Tutar pozitif olmalı"),
  categoryId: z.string().min(1, "Kategori seçiniz"),
  description: z.string().max(100).optional(),
  date: z.string(),
  isRecurring: z.boolean().default(false),
});

// 2. Type Export
export type CreateIncomeInput = z.infer<typeof CreateIncomeSchema>;

// 3. Action Implementation
export async function createIncome(input: CreateIncomeInput) {
  // AUTH
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' } as const;

  // VALIDATE
  const parsed = CreateIncomeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Geçersiz veri' } as const;
  }

  // EXECUTE
  try {
    const [created] = await db.insert(incomes).values({
      ...parsed.data,
      userId,
    }).returning();

    // REVALIDATE
    revalidatePath('/dashboard');
    return { success: true, data: created } as const;
  } catch (error) {
    console.error('[createIncome]', { userId, error });
    return { success: false, error: 'Gelir eklenemedi' } as const;
  }
}
```

---

## CRUD Pattern

### Read (List)
```typescript
export async function getIncomes(page = 1, limit = 20) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' } as const;

  try {
    const results = await db.select()
      .from(incomes)
      .where(and(
        eq(incomes.userId, userId),
        isNull(incomes.deletedAt)
      ))
      .orderBy(desc(incomes.createdAt))
      .offset((page - 1) * limit)
      .limit(limit);

    return { success: true, data: results } as const;
  } catch (error) {
    console.error('[getIncomes]', { userId, error });
    return { success: false, error: 'Gelirler yüklenemedi' } as const;
  }
}
```

### Read (Single)
```typescript
export async function getIncome(id: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' } as const;

  try {
    const [income] = await db.select()
      .from(incomes)
      .where(and(
        eq(incomes.id, id),
        eq(incomes.userId, userId),  // ownership check
        isNull(incomes.deletedAt)
      ))
      .limit(1);

    if (!income) return { success: false, error: 'Kayıt bulunamadı' } as const;
    return { success: true, data: income } as const;
  } catch (error) {
    console.error('[getIncome]', { userId, id, error });
    return { success: false, error: 'Gelir yüklenemedi' } as const;
  }
}
```

### Update
```typescript
export async function updateIncome(id: string, input: Partial<CreateIncomeInput>) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' } as const;

  try {
    const [updated] = await db.update(incomes)
      .set({ ...input, updatedAt: new Date() })
      .where(and(
        eq(incomes.id, id),
        eq(incomes.userId, userId)
      ))
      .returning();

    if (!updated) return { success: false, error: 'Kayıt bulunamadı' } as const;

    revalidatePath('/dashboard');
    return { success: true, data: updated } as const;
  } catch (error) {
    console.error('[updateIncome]', { userId, id, error });
    return { success: false, error: 'Gelir güncellenemedi' } as const;
  }
}
```

### Delete (Soft)
```typescript
export async function deleteIncome(id: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' } as const;

  try {
    const [deleted] = await db.update(incomes)
      .set({ deletedAt: new Date() })
      .where(and(
        eq(incomes.id, id),
        eq(incomes.userId, userId)
      ))
      .returning();

    if (!deleted) return { success: false, error: 'Kayıt bulunamadı' } as const;

    revalidatePath('/dashboard');
    return { success: true, data: deleted } as const;
  } catch (error) {
    console.error('[deleteIncome]', { userId, id, error });
    return { success: false, error: 'Gelir silinemedi' } as const;
  }
}
```

---

## Response Type

```typescript
// All server actions return this discriminated union
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

---

## Client-Side Usage

```typescript
'use client';

import { createIncome } from '@/actions/income';
import { toast } from 'sonner';

async function handleSubmit(data: CreateIncomeInput) {
  const result = await createIncome(data);

  if (result.success) {
    toast.success('Gelir başarıyla eklendi');
    closeDrawer();
  } else {
    toast.error(result.error);
  }
}
```

---

## Webhook Handler (Clerk)

```typescript
// src/app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error('Missing CLERK_WEBHOOK_SECRET');

  const headerPayload = headers();
  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': headerPayload.get('svix-id')!,
      'svix-timestamp': headerPayload.get('svix-timestamp')!,
      'svix-signature': headerPayload.get('svix-signature')!,
    }) as WebhookEvent;
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  if (evt.type === 'user.created') {
    await db.insert(users).values({
      clerkId: evt.data.id,
      email: evt.data.email_addresses[0]?.email_address ?? '',
      name: `${evt.data.first_name ?? ''} ${evt.data.last_name ?? ''}`.trim(),
    });
  }

  return new Response('OK', { status: 200 });
}
```

---

## Rules

1. **Auth → Validate → Execute → Revalidate** (always this order)
2. Return `ActionResult<T>` discriminated union
3. User-facing errors in **Turkish**
4. Server logs in **English** with context
5. Never expose internal errors to client
6. Always `revalidatePath` after mutations
7. Always filter by `userId` (multi-tenant)
8. Use Zod for ALL input validation
9. Soft delete with `deletedAt` timestamp
10. Use `decimal(12,2)` for money fields

---

*Skill Module: API & Server Actions*
*Stack: Next.js 14 Server Actions | Drizzle ORM | Zod | Clerk Auth*
