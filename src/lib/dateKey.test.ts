import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fromAnyToLocalDateKey, toLocalDateKey } from './dateKey';

describe('dateKey helpers', () => {
  const previousTz = process.env.TZ;

  beforeAll(() => {
    process.env.TZ = 'Europe/Istanbul';
  });

  afterAll(() => {
    process.env.TZ = previousTz;
  });

  it('keeps date-only strings stable without timezone shifting', () => {
    expect(fromAnyToLocalDateKey('2026-02-09')).toBe('2026-02-09');
  });

  it('maps near-midnight UTC timestamps into next local day for TR (+03)', () => {
    expect(fromAnyToLocalDateKey('2026-02-09T21:30:00.000Z')).toBe('2026-02-10');
  });

  it('keeps UTC timestamps before +03 cutoff on the same local day', () => {
    expect(fromAnyToLocalDateKey('2026-02-09T20:30:00.000Z')).toBe('2026-02-09');
  });

  it('formats Date input as YYYY-MM-DD local key', () => {
    const localDate = new Date('2026-02-10T00:15:00+03:00');
    expect(toLocalDateKey(localDate)).toBe('2026-02-10');
  });
});
