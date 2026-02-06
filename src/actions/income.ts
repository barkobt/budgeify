'use server';

/**
 * Income Server Actions (v4.0 — Sovereign Pattern)
 *
 * Pattern: Auth → Validate → Execute → Revalidate
 * Returns: ActionResult<T> discriminated union
 * Errors: Turkish user-facing, English server logs
 */

import { db } from '@/db';
import { incomes, type NewIncome, users } from '@/db/schema';
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

const CreateIncomeSchema = z.object({
  amount: z.number().positive('Tutar pozitif olmalı'),
  description: z.string().max(100).optional(),
  categoryId: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  isRecurring: z.boolean().optional(),
});

const UpdateIncomeSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().max(100).optional(),
  categoryId: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  isRecurring: z.boolean().optional(),
});

const IncomeIdSchema = z.string().uuid('Geçersiz gelir ID');

export type CreateIncomeInput = z.infer<typeof CreateIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof UpdateIncomeSchema>;

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

function revalidateIncomePaths(): void {
  revalidatePath('/dashboard');
  revalidatePath('/income');
}

// ========================================
// READ ACTIONS
// ========================================

/**
 * Get All Incomes
 */
export async function getIncomes(): Promise<ActionResult<(typeof incomes.$inferSelect)[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(incomes)
      .where(eq(incomes.userId, userResult.data))
      .orderBy(desc(incomes.date));

    return { success: true, data: result };
  } catch (error) {
    console.error('[getIncomes]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gelirler yüklenirken bir hata oluştu' };
  }
}

/**
 * Get Income by ID
 */
export async function getIncomeById(id: string): Promise<ActionResult<typeof incomes.$inferSelect | null>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = IncomeIdSchema.safeParse(id);
  if (!parsed.success) return { success: false, error: 'Geçersiz gelir ID' };

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(incomes)
      .where(and(eq(incomes.id, parsed.data), eq(incomes.userId, userResult.data)))
      .limit(1);

    return { success: true, data: result[0] ?? null };
  } catch (error) {
    console.error('[getIncomeById]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gelir yüklenemedi' };
  }
}

// ========================================
// WRITE ACTIONS
// ========================================

/**
 * Create Income
 */
export async function createIncome(input: CreateIncomeInput): Promise<ActionResult<typeof incomes.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = CreateIncomeSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    const newIncome: NewIncome = {
      userId: userResult.data,
      amount: parsed.data.amount.toString(),
      description: parsed.data.description ?? null,
      categoryId: parsed.data.categoryId ?? null,
      date: parsed.data.date ?? new Date(),
      isRecurring: parsed.data.isRecurring ?? false,
    };

    const [created] = await db.insert(incomes).values(newIncome).returning();

    // REVALIDATE
    revalidateIncomePaths();
    return { success: true, data: created };
  } catch (error) {
    console.error('[createIncome]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gelir eklenirken bir hata oluştu' };
  }
}

/**
 * Update Income
 */
export async function updateIncome(id: string, input: UpdateIncomeInput): Promise<ActionResult<typeof incomes.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = IncomeIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz gelir ID' };

  const parsed = UpdateIncomeSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(incomes)
      .where(and(eq(incomes.id, idParsed.data), eq(incomes.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Gelir bulunamadı' };

    const updateData: Partial<NewIncome> = { updatedAt: new Date() };
    if (parsed.data.amount !== undefined) updateData.amount = parsed.data.amount.toString();
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.categoryId !== undefined) updateData.categoryId = parsed.data.categoryId;
    if (parsed.data.date !== undefined) updateData.date = parsed.data.date;
    if (parsed.data.isRecurring !== undefined) updateData.isRecurring = parsed.data.isRecurring;

    const [updated] = await db
      .update(incomes)
      .set(updateData)
      .where(eq(incomes.id, idParsed.data))
      .returning();

    // REVALIDATE
    revalidateIncomePaths();
    return { success: true, data: updated };
  } catch (error) {
    console.error('[updateIncome]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gelir güncellenirken bir hata oluştu' };
  }
}

/**
 * Delete Income
 */
export async function deleteIncome(id: string): Promise<ActionResult<{ id: string }>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = IncomeIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz gelir ID' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(incomes)
      .where(and(eq(incomes.id, idParsed.data), eq(incomes.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Gelir bulunamadı' };

    await db.delete(incomes).where(eq(incomes.id, idParsed.data));

    // REVALIDATE
    revalidateIncomePaths();
    return { success: true, data: { id: idParsed.data } };
  } catch (error) {
    console.error('[deleteIncome]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Gelir silinirken bir hata oluştu' };
  }
}

// ========================================
// ANALYTICS ACTIONS
// ========================================

/**
 * Get Total Income for Current Month
 */
export async function getTotalIncomeThisMonth(): Promise<ActionResult<number>> {
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
      .from(incomes)
      .where(eq(incomes.userId, userResult.data));

    const monthlyIncomes = result.filter((income) => {
      const incomeDate = new Date(income.date);
      return incomeDate >= startOfMonth && incomeDate <= endOfMonth;
    });

    const total = monthlyIncomes.reduce(
      (sum, income) => sum + parseFloat(income.amount),
      0
    );

    return { success: true, data: total };
  } catch (error) {
    console.error('[getTotalIncomeThisMonth]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Aylık gelir hesaplanamadı' };
  }
}
