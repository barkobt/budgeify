/**
 * Shared Category Icon Map — Lucide React
 *
 * Single source of truth for category → icon mapping.
 * Used by ExpenseForm, ExpenseList, CategoryChart, MainSalaryForm.
 */
import {
  Pizza,
  Coffee,
  ShoppingCart,
  Car,
  Lightbulb,
  Home,
  Heart,
  Film,
  Shirt,
  Laptop,
  Scissors,
  BookOpen,
  CreditCard,
  Building2,
  Gift,
  Dumbbell,
  Dog,
  Package,
  Briefcase,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

/** Expense category ID → Lucide icon component */
export const EXPENSE_ICON_MAP: Record<string, LucideIcon> = {
  cat_food: Pizza,
  cat_coffee: Coffee,
  cat_market: ShoppingCart,
  cat_transport: Car,
  cat_bills: Lightbulb,
  cat_rent: Home,
  cat_health: Heart,
  cat_entertainment: Film,
  cat_clothing: Shirt,
  cat_tech: Laptop,
  cat_personal: Scissors,
  cat_education: BookOpen,
  cat_credit_card: CreditCard,
  cat_loan: Building2,
  cat_gift: Gift,
  cat_sports: Dumbbell,
  cat_pet: Dog,
  cat_other: Package,
};

/** Income category ID → Lucide icon component */
export const INCOME_ICON_MAP: Record<string, LucideIcon> = {
  salary: Briefcase,
  rent: Home,
  freelance: Laptop,
  bonus: Gift,
  investment: TrendingUp,
  other: Package,
};

/** Get icon for any category ID, fallback to Package */
export function getCategoryIcon(categoryId: string): LucideIcon {
  return EXPENSE_ICON_MAP[categoryId] || INCOME_ICON_MAP[categoryId] || Package;
}
