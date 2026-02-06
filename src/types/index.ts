// Budgeify - TypeScript Type Definitions

/**
 * Gelir tipi
 */
export interface Income {
  id: string;
  type: 'salary' | 'additional';
  category: IncomeCategory;
  amount: number;
  description?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IncomeCategory =
  | 'salary'
  | 'rent'
  | 'freelance'
  | 'bonus'
  | 'investment'
  | 'other';

/**
 * Gider tipi
 */
export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  note?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Kategori tipi
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isActive: boolean;
}

/**
 * Hedef tipi
 */
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  targetDate?: string;
  status: GoalStatus;
  createdAt: string;
}

export type GoalStatus = 'active' | 'completed' | 'cancelled';

/**
 * Kullanıcı ayarları
 */
export interface UserSettings {
  currency: string;
  locale: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

/**
 * Analiz verileri
 */
export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  topCategories: CategorySummary[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
  color: string;
}

/**
 * Zaman aralığı filtresi
 */
/**
 * Para birimi kodu
 */
export type CurrencyCode = 'TRY' | 'USD' | 'EUR';

export type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface DateFilter {
  range: DateRange;
  startDate?: string;
  endDate?: string;
}
