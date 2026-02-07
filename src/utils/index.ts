// Budgeify - Utility Functions

import type { CurrencyCode } from '@/types';

const CURRENCY_CONFIG: Record<CurrencyCode, { locale: string; symbol: string }> = {
  TRY: { locale: 'tr-TR', symbol: '₺' },
  USD: { locale: 'en-US', symbol: '$' },
  EUR: { locale: 'de-DE', symbol: '€' },
};

/**
 * Para birimini formatlar — store'daki currency state'ine göre dinamik
 * @example formatCurrency(1234.56) => "₺1.234,56"
 * @example formatCurrency(1234.56, 'USD') => "$1,234.56"
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'TRY'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.TRY;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Kompakt para formatı — küçük alanlarda (die, chip) kullanım için
 * Ondalık kısmı kaldırır, büyük sayıları kısaltır (1.2K, 3.5M)
 * @example formatCurrencyCompact(12000, 'TRY') => "₺12.000"
 * @example formatCurrencyCompact(1500000, 'TRY') => "₺1,5M"
 */
export function formatCurrencyCompact(amount: number, currency: CurrencyCode = 'TRY'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.TRY;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    const val = (abs / 1_000_000).toFixed(1).replace('.', currency === 'TRY' ? ',' : '.');
    return `${sign}${config.symbol}${val}M`;
  }
  if (abs >= 100_000) {
    const val = (abs / 1_000).toFixed(0);
    return `${sign}${config.symbol}${val}K`;
  }

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Para birimi sembolünü döndürür
 */
export function getCurrencySymbol(currency: CurrencyCode = 'TRY'): string {
  return CURRENCY_CONFIG[currency]?.symbol || '₺';
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

/**
 * Statik kur tablosu — TRY bazlı
 * Production'da API ile güncellenebilir.
 */
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  TRY: 1,
  USD: 0.029,
  EUR: 0.027,
};

/**
 * Para birimini dönüştürür
 * @example convertAmount(1000, 'TRY', 'USD') => 29
 */
export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  if (from === to) return amount;
  const inTRY = amount / EXCHANGE_RATES[from];
  return Math.round(inTRY * EXCHANGE_RATES[to] * 100) / 100;
}
