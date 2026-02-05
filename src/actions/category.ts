'use server';

/**
 * Category Server Actions
 *
 * 🎓 MENTOR NOTU - Default Categories:
 * ------------------------------------
 * Kategoriler iki türlü olabilir:
 * 1. Sistem kategorileri (isDefault=true, userId=null)
 * 2. Kullanıcı kategorileri (isDefault=false, userId=user.id)
 *
 * Sistem kategorileri tüm kullanıcılar için ortaktır.
 */

import { db } from '@/db';
import { categories, NewCategory, users } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

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
  { name: 'Kredi Kartı', icon: 'CreditCard', color: '#DC2626', type: 'expense', isDefault: true, userId: null },
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
export async function seedDefaultCategories() {
  // Check if default categories exist
  const existingDefaults = await db
    .select()
    .from(categories)
    .where(eq(categories.isDefault, true))
    .limit(1);

  if (existingDefaults.length > 0) {
    return { message: 'Default categories already exist' };
  }

  // Insert all default categories
  const allDefaults = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];

  await db.insert(categories).values(allDefaults);

  return { message: 'Default categories created successfully' };
}

/**
 * Get All Categories
 * Sistem + kullanıcı kategorileri
 */
export async function getCategories(type?: 'income' | 'expense') {
  const userId = await getUserId();

  const query = db
    .select()
    .from(categories)
    .where(
      or(
        eq(categories.isDefault, true),
        eq(categories.userId, userId)
      )
    );

  const result = await query;

  // Filter by type if specified
  if (type) {
    return result.filter((c) => c.type === type);
  }

  return result;
}

/**
 * Get Expense Categories
 */
export async function getExpenseCategories() {
  return getCategories('expense');
}

/**
 * Get Income Categories
 */
export async function getIncomeCategories() {
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
}) {
  const userId = await getUserId();

  const newCategory: NewCategory = {
    name: data.name,
    icon: data.icon,
    color: data.color,
    type: data.type,
    isDefault: false,
    userId,
  };

  const [created] = await db.insert(categories).values(newCategory).returning();

  revalidatePath('/dashboard');
  revalidatePath('/expenses');
  revalidatePath('/income');

  return created;
}

/**
 * Delete Custom Category
 * Sadece kullanıcının kendi kategorilerini silebilir
 */
export async function deleteCategory(id: string) {
  const userId = await getUserId();

  // Verify ownership (only non-default categories can be deleted)
  const existing = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.id, id),
        eq(categories.userId, userId),
        eq(categories.isDefault, false)
      )
    )
    .limit(1);

  if (!existing[0]) {
    throw new Error('Category not found or cannot be deleted');
  }

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath('/dashboard');
  revalidatePath('/expenses');
  revalidatePath('/income');

  return { success: true };
}
