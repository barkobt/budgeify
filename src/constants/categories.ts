// Budgeify - Default Categories (Lucide Icons)

import type { Category } from '@/types';

/**
 * Varsayilan harcama kategorileri — Lucide icon identifiers
 */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Yemek', icon: 'Pizza', color: '#EF4444', isDefault: true, isActive: true },
  { id: 'cat_coffee', name: 'Kahve', icon: 'Coffee', color: '#8B4513', isDefault: true, isActive: true },
  { id: 'cat_market', name: 'Market', icon: 'ShoppingCart', color: '#22C55E', isDefault: true, isActive: true },
  { id: 'cat_transport', name: 'Ulaşım', icon: 'Car', color: '#3B82F6', isDefault: true, isActive: true },
  { id: 'cat_bills', name: 'Faturalar', icon: 'Lightbulb', color: '#F59E0B', isDefault: true, isActive: true },
  { id: 'cat_rent', name: 'Kira', icon: 'Home', color: '#8B5CF6', isDefault: true, isActive: true },
  { id: 'cat_health', name: 'Sağlık', icon: 'Heart', color: '#EC4899', isDefault: true, isActive: true },
  { id: 'cat_entertainment', name: 'Eğlence', icon: 'Film', color: '#06B6D4', isDefault: true, isActive: true },
  { id: 'cat_clothing', name: 'Giyim', icon: 'Shirt', color: '#14B8A6', isDefault: true, isActive: true },
  { id: 'cat_tech', name: 'Teknoloji', icon: 'Laptop', color: '#6366F1', isDefault: true, isActive: true },
  { id: 'cat_personal', name: 'Kişisel Bakım', icon: 'Scissors', color: '#F472B6', isDefault: true, isActive: true },
  { id: 'cat_education', name: 'Eğitim', icon: 'BookOpen', color: '#10B981', isDefault: true, isActive: true },
  { id: 'cat_credit_card', name: 'Kredi Kartı Borcu', icon: 'CreditCard', color: '#DC2626', isDefault: true, isActive: true },
  { id: 'cat_loan', name: 'Kredi Borcu', icon: 'Building2', color: '#7C3AED', isDefault: true, isActive: true },
  { id: 'cat_gift', name: 'Hediye', icon: 'Gift', color: '#F97316', isDefault: true, isActive: true },
  { id: 'cat_sports', name: 'Spor', icon: 'Dumbbell', color: '#059669', isDefault: true, isActive: true },
  { id: 'cat_pet', name: 'Evcil Hayvan', icon: 'Dog', color: '#D97706', isDefault: true, isActive: true },
  { id: 'cat_other', name: 'Diğer', icon: 'Package', color: '#6B7280', isDefault: true, isActive: true },
];

/**
 * Kategori ID'sine gore kategori bulur
 */
export function getCategoryById(id: string): Category | undefined {
  return DEFAULT_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Aktif kategorileri dondurur
 */
export function getActiveCategories(): Category[] {
  return DEFAULT_CATEGORIES.filter((cat) => cat.isActive);
}

/**
 * Gelir kategorileri
 */
export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Maaş', icon: 'Briefcase' },
  { id: 'rent', name: 'Kira Geliri', icon: 'Home' },
  { id: 'freelance', name: 'Serbest Çalışma', icon: 'Laptop' },
  { id: 'bonus', name: 'Prim/Bonus', icon: 'Gift' },
  { id: 'investment', name: 'Yatırım Geliri', icon: 'TrendingUp' },
  { id: 'other', name: 'Diğer', icon: 'Package' },
] as const;
