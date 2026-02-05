'use server';

/**
 * Income Server Actions
 *
 * 🎓 MENTOR NOTU - CRUD Pattern:
 * -----------------------------
 * CRUD = Create, Read, Update, Delete
 * Her veri modeli için bu 4 temel operasyon tanımlanır.
 *
 * Server Actions'da revalidatePath ile cache'i temizleyebilirsin.
 * Bu sayede UI otomatik güncellenir.
 */

import { db } from '@/db';
import { incomes, NewIncome, users } from '@/db/schema';
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
 * Get All Incomes
 * Kullanıcının tüm gelirlerini getir
 */
export async function getIncomes() {
  try {
    const userId = await getUserId();

    const result = await db
      .select()
      .from(incomes)
      .where(eq(incomes.userId, userId))
      .orderBy(desc(incomes.date));

    return result;
  } catch (error) {
    logger.error('income', 'getIncomes failed', error);
    throw new Error('Gelirler yüklenirken bir hata oluştu');
  }
}

/**
 * Get Income by ID
 */
export async function getIncomeById(id: string) {
  const userId = await getUserId();

  const result = await db
    .select()
    .from(incomes)
    .where(and(eq(incomes.id, id), eq(incomes.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Create Income
 */
export async function createIncome(data: {
  amount: number;
  description?: string;
  categoryId?: string;
  date?: Date;
  isRecurring?: boolean;
}) {
  try {
    const userId = await getUserId();

    const newIncome: NewIncome = {
      userId,
      amount: data.amount.toString(),
      description: data.description ?? null,
      categoryId: data.categoryId ?? null,
      date: data.date ?? new Date(),
      isRecurring: data.isRecurring ?? false,
    };

    const [created] = await db.insert(incomes).values(newIncome).returning();

    revalidatePath('/dashboard');
    revalidatePath('/income');

    return created;
  } catch (error) {
    logger.error('income', 'createIncome failed', error);
    throw new Error('Gelir eklenirken bir hata oluştu');
  }
}

/**
 * Update Income
 */
export async function updateIncome(
  id: string,
  data: {
    amount?: number;
    description?: string;
    categoryId?: string;
    date?: Date;
    isRecurring?: boolean;
  }
) {
  const userId = await getUserId();

  // Verify ownership
  const existing = await db
    .select()
    .from(incomes)
    .where(and(eq(incomes.id, id), eq(incomes.userId, userId)))
    .limit(1);

  if (!existing[0]) {
    throw new Error('Income not found or unauthorized');
  }

  const updateData: Partial<NewIncome> = {
    updatedAt: new Date(),
  };

  if (data.amount !== undefined) updateData.amount = data.amount.toString();
  if (data.description !== undefined) updateData.description = data.description;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.date !== undefined) updateData.date = data.date;
  if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring;

  const [updated] = await db
    .update(incomes)
    .set(updateData)
    .where(eq(incomes.id, id))
    .returning();

  revalidatePath('/dashboard');
  revalidatePath('/income');

  return updated;
}

/**
 * Delete Income
 */
export async function deleteIncome(id: string) {
  try {
    const userId = await getUserId();

    // Verify ownership
    const existing = await db
      .select()
      .from(incomes)
      .where(and(eq(incomes.id, id), eq(incomes.userId, userId)))
      .limit(1);

    if (!existing[0]) {
      throw new Error('Gelir bulunamadı veya yetkiniz yok');
    }

    await db.delete(incomes).where(eq(incomes.id, id));

    revalidatePath('/dashboard');
    revalidatePath('/income');

    return { success: true };
  } catch (error) {
    logger.error('income', 'deleteIncome failed', error);
    if (error instanceof Error && error.message.includes('bulunamadı')) {
      throw error;
    }
    throw new Error('Gelir silinirken bir hata oluştu');
  }
}

/**
 * Get Total Income for Current Month
 */
export async function getTotalIncomeThisMonth() {
  const userId = await getUserId();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const result = await db
    .select()
    .from(incomes)
    .where(eq(incomes.userId, userId));

  // Filter by date in JS (Drizzle doesn't have great date range support)
  const monthlyIncomes = result.filter((income) => {
    const incomeDate = new Date(income.date);
    return incomeDate >= startOfMonth && incomeDate <= endOfMonth;
  });

  const total = monthlyIncomes.reduce(
    (sum, income) => sum + parseFloat(income.amount),
    0
  );

  return total;
}
