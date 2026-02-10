/**
 * Calendar Day Selection — Regression Tests
 *
 * Verifies that:
 * 1. Date creation from (year, month, day) produces correct local-midnight dates
 * 2. isSameDay correctly compares two dates
 * 3. Selecting different days produces distinct dates (no drift/mutation)
 * 4. Drawer title formatting shows correct Turkish date
 */

import { describe, it, expect } from 'vitest';

// Inline the same helpers used in CalendarPage to test them in isolation
function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-first
}

describe('Calendar date helpers', () => {
  describe('getDaysInMonth', () => {
    it('returns 31 for January', () => {
      expect(getDaysInMonth(2026, 0)).toBe(31);
    });

    it('returns 28 for February 2026 (non-leap)', () => {
      expect(getDaysInMonth(2026, 1)).toBe(28);
    });

    it('returns 29 for February 2024 (leap year)', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });
  });

  describe('getFirstDayOfWeek (Monday-first)', () => {
    it('returns correct day for Feb 2026 (Sunday → 6)', () => {
      // Feb 1, 2026 is a Sunday → Monday-first index = 6
      expect(getFirstDayOfWeek(2026, 1)).toBe(6);
    });

    it('returns 0 for a month starting on Monday', () => {
      // June 1, 2026 is a Monday
      expect(getFirstDayOfWeek(2026, 5)).toBe(0);
    });
  });

  describe('isSameDay', () => {
    it('returns true for same date', () => {
      const a = new Date(2026, 1, 10);
      const b = new Date(2026, 1, 10);
      expect(isSameDay(a, b)).toBe(true);
    });

    it('returns true even if time differs', () => {
      const a = new Date(2026, 1, 10, 0, 0, 0);
      const b = new Date(2026, 1, 10, 23, 59, 59);
      expect(isSameDay(a, b)).toBe(true);
    });

    it('returns false for different days', () => {
      const a = new Date(2026, 1, 10);
      const b = new Date(2026, 1, 11);
      expect(isSameDay(a, b)).toBe(false);
    });

    it('returns false for different months', () => {
      const a = new Date(2026, 0, 10);
      const b = new Date(2026, 1, 10);
      expect(isSameDay(a, b)).toBe(false);
    });
  });

  describe('day selection simulation (no drift)', () => {
    it('selecting day A then day B produces correct distinct dates', () => {
      const year = 2026;
      const month = 1; // February

      // Simulate tapping day 10
      let selectedDate: Date | null = null;
      selectedDate = new Date(year, month, 10);
      expect(selectedDate.getDate()).toBe(10);
      expect(selectedDate.getMonth()).toBe(1);
      expect(selectedDate.getFullYear()).toBe(2026);

      // Simulate tapping day 15
      const previousDate = selectedDate;
      selectedDate = new Date(year, month, 15);
      expect(selectedDate.getDate()).toBe(15);
      expect(selectedDate.getMonth()).toBe(1);

      // Previous date should NOT have mutated
      expect(previousDate.getDate()).toBe(10);

      // They should not be the same day
      expect(isSameDay(previousDate, selectedDate)).toBe(false);
    });

    it('drawer title shows correct Turkish formatted date', () => {
      const date = new Date(2026, 1, 10); // Feb 10, 2026
      const title = date.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      expect(title).toContain('10');
      expect(title).toContain('Şubat');
    });

    it('selecting same day twice produces equal dates', () => {
      const year = 2026;
      const month = 5; // June
      const day = 22;

      const first = new Date(year, month, day);
      const second = new Date(year, month, day);
      expect(isSameDay(first, second)).toBe(true);
    });
  });
});
