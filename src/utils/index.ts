// Budgeify - Utility Functions

/**
 * Para birimini Türk Lirası formatında gösterir
 * @example formatCurrency(1234.56) => "₺1.234,56"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Tarihi Türkçe formatında gösterir
 * @example formatDate('2026-02-04') => "4 Şubat 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Kısa tarih formatı
 * @example formatDateShort('2026-02-04') => "04.02.2026"
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * UUID oluşturur
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * ISO 8601 formatında şu anki tarihi döndürür
 */
export function getCurrentISODate(): string {
  return new Date().toISOString();
}

/**
 * YYYY-MM-DD formatında bugünün tarihini döndürür
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Yüzde hesaplar
 * @example calculatePercentage(25, 100) => 25
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Sayıyı kısaltılmış formatta gösterir
 * @example formatCompactNumber(1500000) => "1,5M"
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Değerin belirli bir aralıkta olup olmadığını kontrol eder
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
