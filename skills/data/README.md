# Skill: Database & Data Layer (Drizzle ORM + Neon)

> Budgeify'ın veritabanı mimarisi ve veri erişim katmanı.
> Tetikleyici: Schema tasarımı, migration, query optimizasyonu, veri modelleme görevleri.

---

## Stack

| Technology | Purpose |
|-----------|---------|
| **Neon PostgreSQL** | Serverless database (edge-compatible) |
| **Drizzle ORM** | Type-safe query builder |
| **Drizzle Kit** | Schema migrations |
| **Zod** | Runtime validation |

---

## Database Connection

```typescript
// src/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

---

## Schema Design

### Entity Relationship
```
users (1) ──→ (N) incomes
users (1) ──→ (N) expenses
users (1) ──→ (N) goals
categories (1) ──→ (N) incomes
categories (1) ──→ (N) expenses
```

### Schema Conventions
```typescript
import {
  pgTable, uuid, text, timestamp, decimal, boolean, pgEnum
} from 'drizzle-orm/pg-core';

// Enum definitions
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense']);
export const goalStatusEnum = pgEnum('goal_status', ['active', 'completed', 'cancelled']);

// Table template
export const incomes = pgTable('incomes', {
  // PK: Always UUID with auto-generation
  id: uuid('id').defaultRandom().primaryKey(),

  // FK: Clerk user ID (text, not UUID)
  userId: text('user_id').notNull(),

  // FK: Category reference
  categoryId: uuid('category_id').references(() => categories.id),

  // Money: ALWAYS decimal(12,2) - supports up to ₺9,999,999,999.99
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),

  // Text fields with constraints
  description: text('description'),

  // Boolean with default
  isRecurring: boolean('is_recurring').default(false).notNull(),

  // Date field
  date: text('date').notNull(), // ISO format YYYY-MM-DD

  // Timestamps: Always present, always with defaults
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Soft delete
  deletedAt: timestamp('deleted_at'),
});
```

---

## Schema Rules

| Rule | Implementation |
|------|---------------|
| **IDs** | UUID with `defaultRandom()` |
| **User reference** | `text('user_id')` (Clerk ID format) |
| **Money** | `decimal(12, 2)` - NEVER float |
| **Timestamps** | `timestamp().defaultNow().notNull()` |
| **Soft delete** | `timestamp('deleted_at')` nullable |
| **Booleans** | Always `.default(false).notNull()` |
| **Enums** | `pgEnum` for fixed value sets |
| **Naming** | snake_case for columns, camelCase for JS |

---

## Query Patterns

### List with Pagination
```typescript
export async function getExpenses(userId: string, page = 1, limit = 20) {
  return db.select()
    .from(expenses)
    .where(and(
      eq(expenses.userId, userId),
      isNull(expenses.deletedAt)
    ))
    .orderBy(desc(expenses.createdAt))
    .offset((page - 1) * limit)
    .limit(limit);
}
```

### Aggregation (Monthly Summary)
```typescript
export async function getMonthlySummary(userId: string, month: string) {
  const totalIncome = await db.select({
    total: sql<string>`COALESCE(SUM(${incomes.amount}), 0)`,
  })
    .from(incomes)
    .where(and(
      eq(incomes.userId, userId),
      sql`to_char(${incomes.createdAt}, 'YYYY-MM') = ${month}`,
      isNull(incomes.deletedAt)
    ));

  const totalExpense = await db.select({
    total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
  })
    .from(expenses)
    .where(and(
      eq(expenses.userId, userId),
      sql`to_char(${expenses.createdAt}, 'YYYY-MM') = ${month}`,
      isNull(expenses.deletedAt)
    ));

  return {
    income: parseFloat(totalIncome[0].total),
    expense: parseFloat(totalExpense[0].total),
    balance: parseFloat(totalIncome[0].total) - parseFloat(totalExpense[0].total),
  };
}
```

### Category Breakdown
```typescript
export async function getCategoryBreakdown(userId: string, month: string) {
  return db.select({
    categoryId: expenses.categoryId,
    categoryName: categories.name,
    categoryIcon: categories.icon,
    categoryColor: categories.color,
    total: sql<string>`SUM(${expenses.amount})`,
    count: sql<number>`COUNT(*)`,
  })
    .from(expenses)
    .innerJoin(categories, eq(expenses.categoryId, categories.id))
    .where(and(
      eq(expenses.userId, userId),
      sql`to_char(${expenses.createdAt}, 'YYYY-MM') = ${month}`,
      isNull(expenses.deletedAt)
    ))
    .groupBy(expenses.categoryId, categories.name, categories.icon, categories.color)
    .orderBy(sql`SUM(${expenses.amount}) DESC`);
}
```

### Transaction (Multi-table)
```typescript
import { db } from '@/db';

// Use transaction for operations that span multiple tables
await db.transaction(async (tx) => {
  await tx.update(goals)
    .set({ currentAmount: sql`${goals.currentAmount} + ${amount}` })
    .where(eq(goals.id, goalId));

  await tx.insert(goalContributions).values({
    goalId,
    amount,
    userId,
  });
});
```

---

## Migration Commands

```bash
# Development: Push schema directly (fast iteration)
npm run db:push

# Production: Generate migration files
npm run db:generate

# Visual DB management
npm run db:studio
```

---

## Type Exports

```typescript
// src/db/schema.ts - export inferred types
export type Income = typeof incomes.$inferSelect;
export type NewIncome = typeof incomes.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type User = typeof users.$inferSelect;
```

---

## Prohibited

```
❌ Float for money (use decimal)
❌ Missing userId filter (multi-tenant violation)
❌ Hard delete (use soft delete with deletedAt)
❌ Raw SQL without parameterization
❌ SELECT * (always specify columns for lists)
❌ Missing pagination on list queries
❌ N+1 queries (use joins or batch)
❌ Exposing raw DB errors to client
❌ Using db:push in production
```

---

*Skill Module: Database & Data Layer*
*Stack: Drizzle ORM | Neon PostgreSQL | Drizzle Kit*
