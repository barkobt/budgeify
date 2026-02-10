'use server';

/**
 * Reminder Server Actions (v8.0 — Sovereign Pattern)
 *
 * Pattern: Auth → Validate → Execute → Revalidate
 * Returns: ActionResult<T> discriminated union
 * Errors: Turkish user-facing, English server logs
 */

import { db } from '@/db';
import { reminders, type NewReminder, users } from '@/db/schema';
import { eq, desc, and, lte, gte } from 'drizzle-orm';
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

const CreateReminderSchema = z.object({
  title: z.string().min(1, 'Hatırlatıcı başlığı gerekli').max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['bill_payment', 'goal_deadline', 'budget_limit', 'custom']),
  amount: z.number().positive('Tutar pozitif olmalı').optional(),
  dueDate: z.coerce.date(),
  frequency: z.enum(['once', 'daily', 'weekly', 'monthly']).optional(),
  categoryId: z.string().uuid().optional(),
});

const UpdateReminderSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  type: z.enum(['bill_payment', 'goal_deadline', 'budget_limit', 'custom']).optional(),
  amount: z.number().positive().nullable().optional(),
  dueDate: z.coerce.date().optional(),
  frequency: z.enum(['once', 'daily', 'weekly', 'monthly']).optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string().uuid().nullable().optional(),
});

const ReminderIdSchema = z.string().uuid('Geçersiz hatırlatıcı ID');

export type CreateReminderInput = z.infer<typeof CreateReminderSchema>;
export type UpdateReminderInput = z.infer<typeof UpdateReminderSchema>;

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

function revalidateReminderPaths(): void {
  revalidatePath('/dashboard');
  revalidatePath('/calendar');
}

// ========================================
// READ ACTIONS
// ========================================

/**
 * Get All Reminders
 */
export async function getReminders(): Promise<ActionResult<(typeof reminders.$inferSelect)[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(reminders)
      .where(eq(reminders.userId, userResult.data))
      .orderBy(desc(reminders.dueDate));

    return { success: true, data: result };
  } catch (error) {
    console.error('[getReminders]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hatırlatıcılar yüklenirken bir hata oluştu' };
  }
}

/**
 * Get Upcoming Reminders (next 7 days)
 */
export async function getUpcomingReminders(): Promise<ActionResult<(typeof reminders.$inferSelect)[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const result = await db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.userId, userResult.data),
          eq(reminders.isActive, true),
          gte(reminders.dueDate, now),
          lte(reminders.dueDate, nextWeek)
        )
      )
      .orderBy(reminders.dueDate);

    return { success: true, data: result };
  } catch (error) {
    console.error('[getUpcomingReminders]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Yaklaşan hatırlatıcılar yüklenemedi' };
  }
}

/**
 * Get Reminder by ID
 */
export async function getReminderById(id: string): Promise<ActionResult<typeof reminders.$inferSelect | null>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = ReminderIdSchema.safeParse(id);
  if (!parsed.success) return { success: false, error: 'Geçersiz hatırlatıcı ID' };

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(reminders)
      .where(and(eq(reminders.id, parsed.data), eq(reminders.userId, userResult.data)))
      .limit(1);

    return { success: true, data: result[0] ?? null };
  } catch (error) {
    console.error('[getReminderById]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hatırlatıcı yüklenemedi' };
  }
}

// ========================================
// WRITE ACTIONS
// ========================================

/**
 * Create Reminder
 */
export async function createReminder(input: CreateReminderInput): Promise<ActionResult<typeof reminders.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = CreateReminderSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    const newReminder: NewReminder = {
      userId: userResult.data,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      type: parsed.data.type,
      amount: parsed.data.amount?.toString() ?? null,
      dueDate: parsed.data.dueDate,
      frequency: parsed.data.frequency ?? 'once',
      isActive: true,
      categoryId: parsed.data.categoryId ?? null,
    };

    const [created] = await db.insert(reminders).values(newReminder).returning();

    // REVALIDATE
    revalidateReminderPaths();
    return { success: true, data: created };
  } catch (error) {
    console.error('[createReminder]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hatırlatıcı eklenirken bir hata oluştu' };
  }
}

/**
 * Update Reminder
 */
export async function updateReminder(id: string, input: UpdateReminderInput): Promise<ActionResult<typeof reminders.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = ReminderIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz hatırlatıcı ID' };

  const parsed = UpdateReminderSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(reminders)
      .where(and(eq(reminders.id, idParsed.data), eq(reminders.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Hatırlatıcı bulunamadı' };

    const updateData: Partial<NewReminder> = { updatedAt: new Date() };
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.type !== undefined) updateData.type = parsed.data.type;
    if (parsed.data.amount !== undefined) updateData.amount = parsed.data.amount?.toString() ?? null;
    if (parsed.data.dueDate !== undefined) updateData.dueDate = parsed.data.dueDate;
    if (parsed.data.frequency !== undefined) updateData.frequency = parsed.data.frequency;
    if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;
    if (parsed.data.categoryId !== undefined) updateData.categoryId = parsed.data.categoryId;

    const [updated] = await db
      .update(reminders)
      .set(updateData)
      .where(eq(reminders.id, idParsed.data))
      .returning();

    // REVALIDATE
    revalidateReminderPaths();
    return { success: true, data: updated };
  } catch (error) {
    console.error('[updateReminder]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hatırlatıcı güncellenirken bir hata oluştu' };
  }
}

/**
 * Delete Reminder
 */
export async function deleteReminder(id: string): Promise<ActionResult<{ id: string }>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = ReminderIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz hatırlatıcı ID' };

  // EXECUTE
  try {
    // Ownership check
    const existing = await db
      .select()
      .from(reminders)
      .where(and(eq(reminders.id, idParsed.data), eq(reminders.userId, userResult.data)))
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Hatırlatıcı bulunamadı' };

    await db.delete(reminders).where(eq(reminders.id, idParsed.data));

    // REVALIDATE
    revalidateReminderPaths();
    return { success: true, data: { id: idParsed.data } };
  } catch (error) {
    console.error('[deleteReminder]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Hatırlatıcı silinirken bir hata oluştu' };
  }
}
