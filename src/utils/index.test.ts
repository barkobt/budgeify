import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatCurrencyCompact,
  getCurrencySymbol,
  formatDate,
  formatDateShort,
  calculatePercentage,
  clamp,
  convertAmount,
  toTitleCase,
} from './index';

describe('formatCurrency', () => {
  it('formats TRY amount correctly', () => {
    const result = formatCurrency(1234.56, 'TRY');
    expect(result).toContain('1.234,56');
  });

  it('formats USD amount correctly', () => {
    const result = formatCurrency(1234.56, 'USD');
    expect(result).toContain('1,234.56');
  });

  it('formats EUR amount correctly', () => {
    const result = formatCurrency(1234.56, 'EUR');
    expect(result).toContain('1.234,56');
  });

  it('defaults to TRY when no currency specified', () => {
    const result = formatCurrency(100);
    expect(result).toContain('₺');
  });

  it('handles zero amount', () => {
    const result = formatCurrency(0, 'TRY');
    expect(result).toContain('0,00');
  });

  it('handles negative amount', () => {
    const result = formatCurrency(-500, 'TRY');
    expect(result).toContain('-');
    expect(result).toContain('500');
  });
});

describe('formatCurrencyCompact', () => {
  it('formats millions with M suffix', () => {
    const result = formatCurrencyCompact(1500000, 'TRY');
    expect(result).toContain('₺');
    expect(result).toContain('M');
  });

  it('formats hundreds of thousands with K suffix', () => {
    const result = formatCurrencyCompact(150000, 'TRY');
    expect(result).toContain('₺');
    expect(result).toContain('K');
  });

  it('formats small amounts without suffix', () => {
    const result = formatCurrencyCompact(500, 'TRY');
    expect(result).toContain('₺');
    expect(result).toContain('500');
  });

  it('handles negative millions', () => {
    const result = formatCurrencyCompact(-2000000, 'TRY');
    expect(result).toContain('-');
    expect(result).toContain('M');
  });
});

describe('getCurrencySymbol', () => {
  it('returns ₺ for TRY', () => {
    expect(getCurrencySymbol('TRY')).toBe('₺');
  });

  it('returns $ for USD', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
  });

  it('returns € for EUR', () => {
    expect(getCurrencySymbol('EUR')).toBe('€');
  });

  it('defaults to ₺ when no currency specified', () => {
    expect(getCurrencySymbol()).toBe('₺');
  });
});

describe('formatDate', () => {
  it('formats date in Turkish long format', () => {
    const result = formatDate('2026-02-04');
    expect(result).toContain('2026');
    expect(result).toContain('4');
  });
});

describe('formatDateShort', () => {
  it('formats date in dd.mm.yyyy format', () => {
    const result = formatDateShort('2026-02-04');
    expect(result).toMatch(/04\.02\.2026/);
  });
});

describe('calculatePercentage', () => {
  it('calculates correct percentage', () => {
    expect(calculatePercentage(25, 100)).toBe(25);
  });

  it('rounds to nearest integer', () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });

  it('returns 0 when total is 0', () => {
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  it('handles 100%', () => {
    expect(calculatePercentage(100, 100)).toBe(100);
  });

  it('handles over 100%', () => {
    expect(calculatePercentage(150, 100)).toBe(150);
  });
});

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min when below range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to max when above range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles equal min and max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

describe('convertAmount', () => {
  it('returns same amount when converting to same currency', () => {
    expect(convertAmount(1000, 'TRY', 'TRY')).toBe(1000);
  });

  it('converts TRY to USD', () => {
    const result = convertAmount(1000, 'TRY', 'USD');
    expect(result).toBe(29);
  });

  it('converts TRY to EUR', () => {
    const result = convertAmount(1000, 'TRY', 'EUR');
    expect(result).toBe(27);
  });

  it('converts USD to TRY', () => {
    const result = convertAmount(29, 'USD', 'TRY');
    expect(result).toBe(1000);
  });
});

describe('toTitleCase', () => {
  it('capitalizes first letter of each word', () => {
    expect(toTitleCase('yeni araba')).toBe('Yeni Araba');
  });

  it('handles single word', () => {
    expect(toTitleCase('test')).toBe('Test');
  });

  it('lowercases rest of word', () => {
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('handles empty string', () => {
    expect(toTitleCase('')).toBe('');
  });
});
