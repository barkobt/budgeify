// Budgeify - Default Categories

import type { Category } from '@/types';

/**
 * Varsayılan harcama kategorileri
 */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Yemek', emoji: '🍕', color: '#EF4444', isDefault: true, isActive: true },
  { id: 'cat_coffee', name: 'Kahve', emoji: '☕', color: '#8B4513', isDefault: true, isActive: true },
  { id: 'cat_market', name: 'Market', emoji: '🛒', color: '#22C55E', isDefault: true, isActive: true },
  { id: 'cat_transport', name: 'Ulaşım', emoji: '🚗', color: '#3B82F6', isDefault: true, isActive: true },
  { id: 'cat_bills', name: 'Faturalar', emoji: '💡', color: '#F59E0B', isDefault: true, isActive: true },
  { id: 'cat_rent', name: 'Kira', emoji: '🏠', color: '#8B5CF6', isDefault: true, isActive: true },
  { id: 'cat_health', name: 'Sağlık', emoji: '💊', color: '#EC4899', isDefault: true, isActive: true },
  { id: 'cat_entertainment', name: 'Eğlence', emoji: '🎬', color: '#06B6D4', isDefault: true, isActive: true },
  { id: 'cat_clothing', name: 'Giyim', emoji: '👕', color: '#14B8A6', isDefault: true, isActive: true },
  { id: 'cat_tech', name: 'Teknoloji', emoji: '💻', color: '#6366F1', isDefault: true, isActive: true },
  { id: 'cat_personal', name: 'Kişisel Bakım', emoji: '🪒', color: '#F472B6', isDefault: true, isActive: true },
  { id: 'cat_education', name: 'Eğitim', emoji: '📚', color: '#10B981', isDefault: true, isActive: true },
  { id: 'cat_credit_card', name: 'Kredi Kartı Borcu', emoji: '💳', color: '#DC2626', isDefault: true, isActive: true },
  { id: 'cat_loan', name: 'Kredi Borcu', emoji: '🏦', color: '#7C3AED', isDefault: true, isActive: true },
  { id: 'cat_gift', name: 'Hediye', emoji: '🎁', color: '#F97316', isDefault: true, isActive: true },
  { id: 'cat_sports', name: 'Spor', emoji: '🏋️', color: '#059669', isDefault: true, isActive: true },
  { id: 'cat_pet', name: 'Evcil Hayvan', emoji: '🐕', color: '#D97706', isDefault: true, isActive: true },
  { id: 'cat_other', name: 'Diğer', emoji: '📦', color: '#6B7280', isDefault: true, isActive: true },
];

/**
 * Kategori ID'sine göre kategori bulur
 */
export function getCategoryById(id: string): Category | undefined {
  return DEFAULT_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Aktif kategorileri döndürür
 */
export function getActiveCategories(): Category[] {
  return DEFAULT_CATEGORIES.filter((cat) => cat.isActive);
}

/**
 * Gelir kategorileri
 */
export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Maaş', emoji: '💼' },
  { id: 'rent', name: 'Kira Geliri', emoji: '🏠' },
  { id: 'freelance', name: 'Serbest Çalışma', emoji: '💻' },
  { id: 'bonus', name: 'Prim/Bonus', emoji: '🎁' },
  { id: 'investment', name: 'Yatırım Geliri', emoji: '📈' },
  { id: 'other', name: 'Diğer', emoji: '📦' },
] as const;
