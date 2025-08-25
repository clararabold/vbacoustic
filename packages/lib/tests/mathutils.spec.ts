import { describe, it, expect } from 'vitest';
import { log10, roundToDecimalPlaces, roundToOneDecimal, validatePositive, validateFrequencyRange, clamp } from '../src/utils/MathUtils';

describe('MathUtils', () => {
  it('log10 throws for non-positive input and calculates for positive', () => {
    expect(() => log10(0)).toThrow();
    expect(() => log10(-1)).toThrow();
    expect(log10(10)).toBeCloseTo(1);
  });

  it('roundToDecimalPlaces and roundToOneDecimal work', () => {
    expect(roundToDecimalPlaces(1.2345, 2)).toBe(1.23);
    expect(roundToOneDecimal(1.25)).toBe(1.3);
  });

  it('validatePositive throws for non-positive', () => {
    expect(() => validatePositive(0, 'x')).toThrow();
    expect(() => validatePositive(-5, 'y')).toThrow();
    expect(() => validatePositive(1, 'ok')).not.toThrow();
  });

  it('validateFrequencyRange enforces range', () => {
    expect(() => validateFrequencyRange(10)).toThrow();
    expect(() => validateFrequencyRange(300)).toThrow();
    expect(() => validateFrequencyRange(100)).not.toThrow();
  });

  it('clamp clamps values', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(20, 0, 10)).toBe(10);
  });
});
