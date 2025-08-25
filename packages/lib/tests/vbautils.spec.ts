import { describe, it, expect } from 'vitest';
import {
  max_, min_, roundVBA, log10, pow, abs, energySum, energyDifference, toDecibel, fromDecibel,
  calculateRwFromMass, isValidAcousticValue, clampAcousticValue, safeDivision, ArrayUtils, AcousticFormatter, StringUtils, AcousticConstants
} from '../src/utils/VBAUtils';

describe('VBAUtils', () => {
  it('max_ and min_ validate args', () => {
    expect(() => max_()).toThrow();
    expect(max_(1, 2, 3)).toBe(3);
    expect(min_(1, 2, 3)).toBe(1);
  });

  it('roundVBA and math funcs', () => {
    expect(roundVBA(1.234, 2)).toBe(1.23);
    expect(log10(10)).toBeCloseTo(1);
    expect(pow(2, 3)).toBe(8);
    expect(abs(-5)).toBe(5);
  });

  it('energy functions', () => {
    expect(energySum(60, 60)).toBeCloseTo(63.01, 1);
    expect(energyDifference(100, 90)).toBeGreaterThan(0);
  });

  it('decibel conversions and rw from mass', () => {
    expect(toDecibel(10)).toBeCloseTo(10);
    expect(fromDecibel(10)).toBeCloseTo(10);
    expect(() => calculateRwFromMass(0)).toThrow();
    expect(calculateRwFromMass(10)).toBeGreaterThan(0);
  });

  it('isValid and clamp', () => {
    expect(isValidAcousticValue(50)).toBe(true);
    expect(clampAcousticValue(NaN)).toBe(0);
  });

  it('safeDivision handles zero', () => {
    expect(safeDivision(1, 0, -1)).toBe(-1);
    expect(safeDivision(4, 2)).toBe(2);
  });

  it('ArrayUtils works', () => {
    expect(ArrayUtils.max([1, 2, 3])).toBe(3);
    expect(ArrayUtils.min([1, 2, 3])).toBe(1);
    expect(ArrayUtils.energySum([60, 60])).toBeGreaterThan(0);
  });

  it('formatters and string utils', () => {
    expect(AcousticFormatter.formatValue(12.345)).toBe('12.3');
    expect(AcousticFormatter.formatMass(123.4)).toBe('123');
    expect(AcousticFormatter.formatArea(12.34)).toBe('12.3');
    expect(AcousticFormatter.formatThickness(0.02)).toBe('20');
    expect(StringUtils.equalsIgnoreCase('A', 'a')).toBe(true);
    expect(StringUtils.contains('Hello', 'ell')).toBe(true);
    expect(StringUtils.formatError('x')).toContain('Fehler');
    expect(AcousticConstants.SPEED_OF_SOUND).toBe(343);
  });
});
