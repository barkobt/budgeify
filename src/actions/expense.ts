'use server';

/**
 * Expense Server Actions
 *
 * 🎓 MENTOR NOTU - Data Validation:
 * ---------------------------------
 * Production'da Zod ile validation yapılmalı.
 * Şimdilik basit kontroller yapıyoruz.
 */

import { db } from '@/db';
import { expenses, NewExpense, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

/**
 * Helper: Get user ID from Clerk session
 */
async function getUserId(): Promise<string> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user[0]) {
    throw new Error('User not found in database');
  }

  return user[0].id;
}

/**
 * Get All Expenses
 */
export async function getExpenses() {
  try {
    const userId = await getUserId();

    const result = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(desc(expenses.date));

    return result;
  } catch (error) {
    logger.error('expense', 'getExpenses failed', error);
    throw new Error('Giderler yüklenirken bir hata oluştu');
  }
}

/**
 * Get Expense by ID
 */
export async function getExpenseById(id: string) {
  const userId = await getUserId();

  const result = await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Create Expense
 */
export async function createExpense(data: {
  amount: number;
  note?: string;
  categoryId?: string;
  date?: Date;
}) {
  try {
    const userId = await getUserId();

    const newExpense: NewExpense = {
      userId,
      amount: data.amount.toString(),
      note: data.note ?? null,
      categoryId: data.categoryId ?? null,
      date: data.date ?? new Date(),
    };

    const [created] = await db.insert(expenses).values(newExpense).returning();

    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/analytics');

    return created;
  } catch (error) {
    logger.error('expense', 'createExpense failed', error);
    throw new Error('Gider eklenirken bir hata oluştu');
  }
}

/**
 * Update Expense
 */
export async function updateExpense(
  id: string,
  data: {
    amount?: number;
    note?: string;
    categoryId?: string;
    date?: Date;
  }
) {
  const userId = await getUserId();

  // Verify ownership
  const existing = await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .limit(1);

  if (!existing[0]) {
    throw new Error('Expense not found or unauthorized');
  }

  const updateData: Partial<NewExpense> = {
    updatedAt: new Date(),
  };

  if (data.amount !== undefined) updateData.amount = data.amount.toString();
  if (data.note !== undefined) updateData.note = data.note;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.date !== undefined) updateData.date = data.date;

  const [updated] = await db
    .update(expenses)
    .set(updateData)
    .where(eq(expenses.id, id))
    .returning();

  revalidatePath('/dashboard');
  revalidatePath('/expenses');
  revalidatePath('/analytics');

  return updated;
}

/**
 * Delete Expense
 */
export async function deleteExpense(id: string) {
  try {
    const userId = await getUserId();

    // Verify ownership
    const existing = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
      .limit(1);

    if (!existing[0]) {
      throw new Error('Gider bulunamadı veya yetkiniz yok');
    }

    await db.delete(expenses).where(eq(expenses.id, id));

    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/analytics');

    return { success: true };
  } catch (error) {
    logger.error('expense', 'deleteExpense failed', error);
    if (error instanceof Error && error.message.includes('bulunamadı')) {
      throw error;
    }
    throw new Error('Gider silinirken bir hata oluştu');
  }
}

/**
 * Get Total Expenses for Current Month
 */
export async function getTotalExpensesThisMonth() {
  const userId = await getUserId();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const result = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId));

  // Filter by date
  const monthlyExpenses = result.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
  });

  const total = monthlyExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  return total;
}

/**
 * Get Expenses by Category
 */
export async function getExpensesByCategory() {
  const userId = await getUserId();

  const result = await db.query.expenses.findMany({
    where: eq(expenses.userId, userId),
    with: {
      category: true,
    },
    orderBy: [desc(expenses.date)],
  });

  return result;
}

/**
 * Get Monthly Expense Summary
 * Kategorilere göre aylık harcama özeti
 */
export async function getMonthlyExpenseSummary() {
  const userId = await getUserId();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const result = await db.query.expenses.findMany({
    where: eq(expenses.userId, userId),
    with: {
      category: true,
    },
  });

  // Filter and group by category
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
    {} as Record<
      string,
      { name: string; color: string; icon: string; total: number; count: number }
    >
  );

  return Object.values(categoryTotals).sort((a, b) => b.total - a.total);
}
