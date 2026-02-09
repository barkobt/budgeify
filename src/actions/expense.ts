'use server';

/**
 * Expense Server Actions (v4.0 — Sovereign Pattern)
 *
 * Pattern: Auth → Validate → Execute → Revalidate
 * Returns: ActionResult<T> discriminated union
 * Errors: Turkish user-facing, English server logs
 */

import { db } from '@/db';
import { expenses, type NewExpense, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ========================================
// TYPES
// ========================================

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ========================================
// ZOD SCHEMAS
// ========================================

const CreateExpenseSchema = z.object({
  amount: z.number().positive('Tutar pozitif olmalı'),
  note: z.string().max(200).optional(),
  categoryId: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  status: z.enum(['completed', 'pending']).optional(),
  expectedDate: z.coerce.date().optional(),
});

const UpdateExpenseSchema = z.object({
  amount: z.number().positive().optional(),
  note: z.string().max(200).optional(),
  categoryId: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  status: z.enum(['completed', 'pending']).optional(),
  expectedDate: z.coerce.date().nullable().optional(),
});

const ExpenseIdSchema = z.string().uuid('Geçersiz gider ID');

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof UpdateExpenseSchema>;

// ========================================
// AUTH HELPER
// ========================================

async function resolveUserId(): Promise<ActionResult<string>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user[0]) return { success: false, error: 'Kullanıcı bulunamadı' };
  return { success: true, data: user[0].id };
}

function revalidateExpensePaths(): void {
  revalidatePath('/dashboard');
  revalidatePath('/expenses');
  revalidatePath('/analytics');
}

// ========================================
// READ ACTIONS
// ========================================

/**
 * Get All Expenses
 */
export async function getExpenses(): Promise<ActionResult<(typeof expenses.$inferSelect)[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userResult.data))
      .orderBy(desc(expenses.date));

    return { success: true, data: result };
  } catch (error) {
    console.error('[getExpenses]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Giderler yüklenirken bir hata oluştu' };
  }
}

/**
 * Get Expense by ID
 */
export async function getExpenseById(id: string): Promise<ActionResult<typeof expenses.$inferSelect | null>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = ExpenseIdSchema.safeParse(id);
  if (!parsed.success) return { success: false, error: 'Geçersiz gider ID' };

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, parsed.data), eq(expenses.userId, userResult.data)))
      .limit(1);

    return { success: true, data: result[0] ?? null };
  } catch (error) {
    console.error('[getExpenseById]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gider yüklenemedi' };
  }
}

// ========================================
// WRITE ACTIONS
// ========================================

/**
 * Create Expense
 */
export async function createExpense(input: CreateExpenseInput): Promise<ActionResult<typeof expenses.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = CreateExpenseSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    const newExpense: NewExpense = {
      userId: userResult.data,
      amount: parsed.data.amount.toString(),
      note: parsed.data.note ?? null,
      categoryId: parsed.data.categoryId ?? null,
      date: parsed.data.date ?? new Date(),
      status: parsed.data.status ?? 'completed',
      expectedDate: parsed.data.expectedDate ?? null,
    };

    const [created] = await db.insert(expenses).values(newExpense).returning();

    // REVALIDATE
    revalidateExpensePaths();
    return { success: true, data: created };
  } catch (error) {
    console.error('[createExpense]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gider eklenirken bir hata oluştu' };
  }
}

/**
 * Update Expense
 */
export async function updateExpense(id: string, input: UpdateExpenseInput): Promise<ActionResult<typeof expenses.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = ExpenseIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz gider ID' };

  const parsed = UpdateExpenseSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, idParsed.data), eq(expenses.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Gider bulunamadı' };

    const updateData: Partial<NewExpense> = { updatedAt: new Date() };
    if (parsed.data.amount !== undefined) updateData.amount = parsed.data.amount.toString();
    if (parsed.data.note !== undefined) updateData.note = parsed.data.note;
    if (parsed.data.categoryId !== undefined) updateData.categoryId = parsed.data.categoryId;
    if (parsed.data.date !== undefined) updateData.date = parsed.data.date;
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
    if (parsed.data.expectedDate !== undefined) updateData.expectedDate = parsed.data.expectedDate;

    const [updated] = await db
      .update(expenses)
      .set(updateData)
      .where(eq(expenses.id, idParsed.data))
      .returning();

    // REVALIDATE
    revalidateExpensePaths();
    return { success: true, data: updated };
  } catch (error) {
    console.error('[updateExpense]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gider güncellenirken bir hata oluştu' };
  }
}

/**
 * Delete Expense
 */
export async function deleteExpense(id: string): Promise<ActionResult<{ id: string }>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = ExpenseIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz gider ID' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, idParsed.data), eq(expenses.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Gider bulunamadı' };

    await db.delete(expenses).where(eq(expenses.id, idParsed.data));

    // REVALIDATE
    revalidateExpensePaths();
    return { success: true, data: { id: idParsed.data } };
  } catch (error) {
    console.error('[deleteExpense]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gider silinirken bir hata oluştu' };
  }
}

// ========================================
// ANALYTICS ACTIONS
// ========================================

/**
 * Get Total Expenses for Current Month
 */
export async function getTotalExpensesThisMonth(): Promise<ActionResult<number>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const result = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userResult.data));

    const monthlyExpenses = result.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });

    const total = monthlyExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );

    return { success: true, data: total };
  } catch (error) {
    console.error('[getTotalExpensesThisMonth]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Aylık gider hesaplanamadı' };
  }
}

interface CategorySummary {
  name: string;
  color: string;
  icon: string;
  total: number;
  count: number;
}

/**
 * Get Expenses by Category
 */
export async function getExpensesByCategory(): Promise<ActionResult<Awaited<ReturnType<typeof db.query.expenses.findMany>>>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const result = await db.query.expenses.findMany({
      where: eq(expenses.userId, userResult.data),
      with: {
        category: true,
      },
      orderBy: [desc(expenses.date)],
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('[getExpensesByCategory]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Kategori bazlı giderler yüklenemedi' };
  }
}

/**
 * Get Monthly Expense Summary
 */
export async function getMonthlyExpenseSummary(): Promise<ActionResult<CategorySummary[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const result = await db.query.expenses.findMany({
      where: eq(expenses.userId, userResult.data),
      with: {
        category: true,
      },
    });

    const monthlyExpenses = result.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });

    const categoryTotals = monthlyExpenses.reduce(
      (acc, expense) => {
        const categoryName = expense.category?.name ?? 'Diğer';
        const categoryColor = expense.category?.color ?? '#6B7280';
        const categoryIcon = expense.category?.icon ?? 'Package';

        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            color: categoryColor,
            icon: categoryIcon,
            total: 0,
            count: 0,
          };
        }

        acc[categoryName].total += parseFloat(expense.amount);
        acc[categoryName].count += 1;

        return acc;
      },
      {} as Record<string, CategorySummary>
    );

    return { success: true, data: Object.values(categoryTotals).sort((a, b) => b.total - a.total) };
  } catch (error) {
    console.error('[getMonthlyExpenseSummary]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Aylık özet hesaplanamadı' };
  }
}
