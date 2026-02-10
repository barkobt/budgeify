'use server';

/**
 * Category Server Actions (v7.0 — Sovereign Pattern)
 *
 * Pattern: Auth → Validate → Execute → Revalidate
 * Returns: ActionResult<T> discriminated union
 * Errors: Turkish user-facing, English server logs
 */

import { db } from '@/db';
import { categories, type NewCategory, users } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
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

const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gerekli').max(50),
  icon: z.string().min(1),
  color: z.string().min(1),
  type: z.enum(['income', 'expense']),
});

const CategoryIdSchema = z.string().uuid('Geçersiz kategori ID');

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

/**
 * Default Expense Categories
 */
const DEFAULT_EXPENSE_CATEGORIES: Omit<NewCategory, 'id' | 'createdAt'>[] = [
  { name: 'Yemek', icon: 'Pizza', color: '#EF4444', type: 'expense', isDefault: true, userId: null },
  { name: 'Kahve', icon: 'Coffee', color: '#8B4513', type: 'expense', isDefault: true, userId: null },
  { name: 'Market', icon: 'ShoppingCart', color: '#22C55E', type: 'expense', isDefault: true, userId: null },
  { name: 'Ulaşım', icon: 'Car', color: '#3B82F6', type: 'expense', isDefault: true, userId: null },
  { name: 'Faturalar', icon: 'Lightbulb', color: '#F59E0B', type: 'expense', isDefault: true, userId: null },
  { name: 'Kira', icon: 'Home', color: '#8B5CF6', type: 'expense', isDefault: true, userId: null },
  { name: 'Sağlık', icon: 'Heart', color: '#EC4899', type: 'expense', isDefault: true, userId: null },
  { name: 'Eğlence', icon: 'Film', color: '#06B6D4', type: 'expense', isDefault: true, userId: null },
  { name: 'Giyim', icon: 'Shirt', color: '#14B8A6', type: 'expense', isDefault: true, userId: null },
  { name: 'Teknoloji', icon: 'Laptop', color: '#6366F1', type: 'expense', isDefault: true, userId: null },
  { name: 'Kişisel Bakım', icon: 'Scissors', color: '#F472B6', type: 'expense', isDefault: true, userId: null },
  { name: 'Eğitim', icon: 'BookOpen', color: '#10B981', type: 'expense', isDefault: true, userId: null },
  { name: 'Kredi Kartı Borcu', icon: 'CreditCard', color: '#DC2626', type: 'expense', isDefault: true, userId: null },
  { name: 'Kredi Borcu', icon: 'Building2', color: '#7C3AED', type: 'expense', isDefault: true, userId: null },
  { name: 'Hediye', icon: 'Gift', color: '#F97316', type: 'expense', isDefault: true, userId: null },
  { name: 'Spor', icon: 'Dumbbell', color: '#059669', type: 'expense', isDefault: true, userId: null },
  { name: 'Evcil Hayvan', icon: 'Dog', color: '#D97706', type: 'expense', isDefault: true, userId: null },
  { name: 'Diğer', icon: 'Package', color: '#6B7280', type: 'expense', isDefault: true, userId: null },
];

/**
 * Default Income Categories
 */
const DEFAULT_INCOME_CATEGORIES: Omit<NewCategory, 'id' | 'createdAt'>[] = [
  { name: 'Maaş', icon: 'Wallet', color: '#22C55E', type: 'income', isDefault: true, userId: null },
  { name: 'Kira Geliri', icon: 'Home', color: '#3B82F6', type: 'income', isDefault: true, userId: null },
  { name: 'Freelance', icon: 'Laptop', color: '#8B5CF6', type: 'income', isDefault: true, userId: null },
  { name: 'Prim/Bonus', icon: 'Trophy', color: '#F59E0B', type: 'income', isDefault: true, userId: null },
  { name: 'Yatırım', icon: 'TrendingUp', color: '#10B981', type: 'income', isDefault: true, userId: null },
  { name: 'Diğer', icon: 'Coins', color: '#6B7280', type: 'income', isDefault: true, userId: null },
];

/**
 * Seed Default Categories
 * Varsayılan kategorileri oluştur (sadece yoksa)
 */
export async function seedDefaultCategories(): Promise<ActionResult<{ message: string }>> {
  try {
    // Check if default categories exist
    const existingDefaults = await db
      .select()
      .from(categories)
      .where(eq(categories.isDefault, true));

    if (existingDefaults.length > 0) {
      // Sync name mismatches for existing defaults (e.g. 'Kredi Kartı' → 'Kredi Kartı Borcu')
      const allDefaults = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
      for (const def of allDefaults) {
        const existing = existingDefaults.find(
          (e) => e.icon === def.icon && e.type === def.type && e.isDefault
        );
        if (existing && existing.name !== def.name) {
          await db
            .update(categories)
            .set({ name: def.name })
            .where(eq(categories.id, existing.id));
        }
      }
      return { success: true, data: { message: 'Default categories already exist' } };
    }

    // Insert all default categories
    const allDefaults = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
    await db.insert(categories).values(allDefaults);

    return { success: true, data: { message: 'Default categories created successfully' } };
  } catch (error) {
    console.error('[seedDefaultCategories]', { error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Varsayılan kategoriler oluşturulamadı' };
  }
}

/**
 * Get All Categories
 * Sistem + kullanıcı kategorileri
 */
export async function getCategories(type?: 'income' | 'expense'): Promise<ActionResult<(typeof categories.$inferSelect)[]>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // EXECUTE
  try {
    const result = await db
      .select()
      .from(categories)
      .where(
        or(
          eq(categories.isDefault, true),
          eq(categories.userId, userResult.data)
        )
      );

    // Filter by type if specified
    const filtered = type ? result.filter((c) => c.type === type) : result;
    return { success: true, data: filtered };
  } catch (error) {
    console.error('[getCategories]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Kategoriler yüklenemedi' };
  }
}

/**
 * Get Expense Categories
 */
export async function getExpenseCategories(): Promise<ActionResult<(typeof categories.$inferSelect)[]>> {
  return getCategories('expense');
}

/**
 * Get Income Categories
 */
export async function getIncomeCategories(): Promise<ActionResult<(typeof categories.$inferSelect)[]>> {
  return getCategories('income');
}

/**
 * Create Custom Category
 */
export async function createCategory(data: {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}): Promise<ActionResult<typeof categories.$inferSelect>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const parsed = CreateCategorySchema.safeParse(data);
  if (!parsed.success) return { success: false, error: 'Geçersiz veri' };

  // EXECUTE
  try {
    const newCategory: NewCategory = {
      name: parsed.data.name,
      icon: parsed.data.icon,
      color: parsed.data.color,
      type: parsed.data.type,
      isDefault: false,
      userId: userResult.data,
    };

    const [created] = await db.insert(categories).values(newCategory).returning();

    // REVALIDATE
    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/income');

    return { success: true, data: created };
  } catch (error) {
    console.error('[createCategory]', { userId: userResult.data, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Kategori oluşturulamadı' };
  }
}

/**
 * Delete Custom Category
 * Sadece kullanıcının kendi kategorilerini silebilir
 */
export async function deleteCategory(id: string): Promise<ActionResult<{ id: string }>> {
  // AUTH
  const userResult = await resolveUserId();
  if (!userResult.success) return userResult;

  // VALIDATE
  const idParsed = CategoryIdSchema.safeParse(id);
  if (!idParsed.success) return { success: false, error: 'Geçersiz kategori ID' };

  // EXECUTE
  try {
    // Verify ownership (only non-default categories can be deleted)
    const existing = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, idParsed.data),
          eq(categories.userId, userResult.data),
          eq(categories.isDefault, false)
        )
      )
      .limit(1);

    if (!existing[0]) return { success: false, error: 'Kategori bulunamadı veya silinemez' };

    await db.delete(categories).where(eq(categories.id, idParsed.data));

    // REVALIDATE
    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/income');

    return { success: true, data: { id: idParsed.data } };
  } catch (error) {
    console.error('[deleteCategory]', { userId: userResult.data, id, error: error instanceof Error ? error.message : 'Unknown error' });
    return { success: false, error: 'Kategori silinirken bir hata oluştu' };
  }
}
