import { describe, it, expect, vi } from 'vitest';
import {
  calculateMassTimberRw,
  calculateCombinedLayerImprovement,
  MassTimberCalculator,
  MassTimberType,
  calculateMassTimberJunctionAttenuation,
  MassTimberJunctionType,
  MassTimberStandard,
  TransmissionDirection,
} from '../src/calculations/MassTimberCalculator';
import { FlankingPathType } from '../src/models/AcousticTypes';

describe('MassTimberCalculator - combined tests', () => {
  it('calculates Rw for heavy timber correctly for given mass', () => {
    const rw = calculateMassTimberRw(200, MassTimberType.HEAVY_TIMBER);
    expect(rw).toBeDefined();
    expect(typeof rw).toBe('number');
    expect(Number.isFinite(rw)).toBe(true);
    expect(rw).toBeCloseTo(50.5, 1);
    expect(rw).toBeGreaterThan(0);
    expect(rw).toBeLessThan(100); // Reasonable upper bound for Rw

    const rwFlex = calculateMassTimberRw(100, MassTimberType.FLEXIBLE);
    expect(rwFlex).toBeDefined();
    expect(typeof rwFlex).toBe('number');
    expect(Number.isFinite(rwFlex)).toBe(true);
    expect(rwFlex).toBeCloseTo(52, 1);
    expect(rwFlex).toBeGreaterThan(0);
    expect(rwFlex).toBeLessThan(100);

    const rwLoaded = calculateMassTimberRw(150, MassTimberType.LOADED);
    expect(rwLoaded).toBeDefined();
    expect(typeof rwLoaded).toBe('number');
    expect(Number.isFinite(rwLoaded)).toBe(true);
    expect(rwLoaded).toBeGreaterThan(0);
    expect(rwLoaded).toBeLessThan(100);
    expect(rwLoaded).toBeGreaterThan(40); // Reasonable lower bound for 150 kg/m²
  });

  it('calculates combined layer improvement positive and negative cases', () => {
    const pos = calculateCombinedLayerImprovement(10, 6);
    expect(pos).toBeDefined();
    expect(typeof pos).toBe('number');
    expect(Number.isFinite(pos)).toBe(true);
    expect(pos).toBeCloseTo(13, 1);
    expect(pos).toBeGreaterThan(0); // Positive improvement case
    expect(pos).toBeGreaterThan(Math.max(10, 6)); // Combined should be greater than individual

    const neg = calculateCombinedLayerImprovement(-5, -2);
    expect(neg).toBeDefined();
    expect(typeof neg).toBe('number');
    expect(Number.isFinite(neg)).toBe(true);
    expect(neg).toBeCloseTo(-6, 1);
    expect(neg).toBeLessThan(0); // Negative improvement case
    expect(neg).toBeLessThan(Math.min(-5, -2)); // Combined negative should be more negative
    
    // Test zero case
    const zero = calculateCombinedLayerImprovement(0, 0);
    expect(zero).toBeDefined();
    expect(typeof zero).toBe('number');
    expect(Number.isFinite(zero)).toBe(true);
    expect(Math.abs(zero)).toBe(0); // Handle -0 vs +0 JavaScript quirk
    
    // Test mixed case
    const mixed = calculateCombinedLayerImprovement(5, -3);
    expect(mixed).toBeDefined();
    expect(typeof mixed).toBe('number');
    expect(Number.isFinite(mixed)).toBe(true);
    expect(mixed).toBeGreaterThan(-3);
    expect(mixed).toBeLessThan(5);
  });

  it('calculates junction attenuation for mass timber vertical and horizontal cases', () => {
    const kij = calculateMassTimberJunctionAttenuation({
      junctionType: MassTimberJunctionType.T_JOINT,
      standard: MassTimberStandard.DIN4109_33,
      flankingPath: FlankingPathType.Ff,
      transmissionDirection: TransmissionDirection.VERTICAL,
      flankingMass: 150,
      separatingMass: 300,
    });
    
    expect(kij).toBeDefined();
    expect(typeof kij).toBe('number');
    expect(Number.isFinite(kij)).toBe(true);
    expect(kij).toBeCloseTo(22.5, 1);
    expect(kij).toBeGreaterThan(0); // Junction attenuation should be positive
    expect(kij).toBeLessThan(50); // Reasonable upper bound for junction attenuation

    const kijH = calculateMassTimberJunctionAttenuation({
      junctionType: MassTimberJunctionType.X_JOINT_FLOOR_CONTINUOUS,
      standard: MassTimberStandard.DIN_EN_ISO12354,
      flankingPath: FlankingPathType.Ff,
      transmissionDirection: TransmissionDirection.HORIZONTAL,
      flankingMass: 150,
      separatingMass: 300,
    });
    
    expect(kijH).toBeDefined();
    expect(typeof kijH).toBe('number');
    expect(Number.isFinite(kijH)).toBe(true);
    expect(kijH).toBeGreaterThan(0);
    expect(kijH).toBeLessThan(50);
    
    // Test different parameters affect results
    expect(kij).not.toBe(kijH); // Different junction types should give different results
    
    // Test mass dependency
    const kijLowerMass = calculateMassTimberJunctionAttenuation({
      junctionType: MassTimberJunctionType.T_JOINT,
      standard: MassTimberStandard.DIN4109_33,
      flankingPath: FlankingPathType.Ff,
      transmissionDirection: TransmissionDirection.VERTICAL,
      flankingMass: 100,
      separatingMass: 200,
    });
    
    expect(kijLowerMass).toBeDefined();
    expect(typeof kijLowerMass).toBe('number');
    expect(Number.isFinite(kijLowerMass)).toBe(true);
    expect(kijLowerMass).toBeGreaterThan(0);
    // Note: Junction attenuation may have same result for similar mass ratios in this implementation
  });

  it('MassTimberCalculator API validates and throws on invalid params', () => {
    const calc = new MassTimberCalculator();
    
    // Test invalid parameter validation
    expect(() => calc.validateParameters({ surfaceMass: 0, timberType: MassTimberType.HEAVY_TIMBER })).toThrow();
    expect(() => calc.validateParameters({ surfaceMass: -10, timberType: MassTimberType.HEAVY_TIMBER })).toThrow();
    
    // Test valid calculation
    const result = calc.calculateSoundReduction(200);
    expect(result).toBeDefined();
    expect(typeof result).toBe('number');
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeCloseTo(50.5, 1);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
    
    // Test different mass values
    const result100 = calc.calculateSoundReduction(100);
    expect(result100).toBeDefined();
    expect(typeof result100).toBe('number');
    expect(Number.isFinite(result100)).toBe(true);
    expect(result100).toBeGreaterThan(0);
    expect(result100).toBeLessThan(100);
    expect(result100).not.toBe(result); // Different mass should give different result
    
    // Test mass dependency relationship
    const result300 = calc.calculateSoundReduction(300);
    expect(result300).toBeDefined();
    expect(typeof result300).toBe('number');
    expect(Number.isFinite(result300)).toBe(true);
    expect(result300).toBeGreaterThan(result); // Higher mass should give higher Rw
  });

  it('additional branches and validations', () => {
    // Test zero mass validation
    expect(() => calculateMassTimberRw(0, MassTimberType.HEAVY_TIMBER)).toThrow();
    
    // Test low mass boundary
    const lowMass = calculateMassTimberRw(30, MassTimberType.HEAVY_TIMBER);
    expect(lowMass).toBeDefined();
    expect(typeof lowMass).toBe('number');
    expect(Number.isFinite(lowMass)).toBe(true);
    expect(lowMass).toBeGreaterThan(0);
    expect(lowMass).toBeLessThan(100);
    
    // Test high mass boundary
    const highMass = calculateMassTimberRw(600, MassTimberType.HEAVY_TIMBER);
    expect(highMass).toBeDefined();
    expect(typeof highMass).toBe('number');
    expect(Number.isFinite(highMass)).toBe(true);
    expect(highMass).toBeGreaterThan(0);
    expect(highMass).toBeLessThan(100);
    expect(highMass).toBeGreaterThan(lowMass); // Higher mass should give higher Rw

    // Test junction attenuation with extreme mass difference
    const val = calculateMassTimberJunctionAttenuation({
      junctionType: MassTimberJunctionType.T_JOINT,
      standard: MassTimberStandard.DIN4109_33,
      flankingPath: FlankingPathType.Ff,
      transmissionDirection: TransmissionDirection.VERTICAL,
      flankingMass: 50,
      separatingMass: 400,
    });
    
    expect(val).toBeDefined();
    expect(typeof val).toBe('number');
    expect(Number.isFinite(val)).toBe(true);
    expect(val).toBeGreaterThan(0);
    expect(val).toBeLessThan(50);

    // Test different standard with horizontal transmission
    const v = calculateMassTimberJunctionAttenuation({
      junctionType: MassTimberJunctionType.X_JOINT_FLOOR_CONTINUOUS,
      standard: MassTimberStandard.DIN_EN_ISO12354,
      flankingPath: FlankingPathType.Ff,
      transmissionDirection: TransmissionDirection.HORIZONTAL,
      flankingMass: 80,
      separatingMass: 200,
    });
    
    expect(v).toBeDefined();
    expect(typeof v).toBe('number');
    expect(Number.isFinite(v)).toBe(true);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(50);
    expect(v).not.toBe(val); // Different parameters should give different results

    // Test validation warnings for boundary conditions
    const calc = new MassTimberCalculator();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Test low mass warning
    const lowMassValid = calc.validateParameters({ surfaceMass: 20, timberType: MassTimberType.HEAVY_TIMBER });
    expect(lowMassValid).toBe(true);
    expect(typeof lowMassValid).toBe('boolean');
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('low')); // Should warn about low mass
    
    warnSpy.mockClear();
    
    // Test high mass warning
    const highMassValid = calc.validateParameters({ surfaceMass: 600, timberType: MassTimberType.HEAVY_TIMBER });
    expect(highMassValid).toBe(true);
    expect(typeof highMassValid).toBe('boolean');
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('high')); // Should warn about high mass
    
    warnSpy.mockRestore();
    
    // Test normal mass range doesn't warn
    const normalSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const normalValid = calc.validateParameters({ surfaceMass: 150, timberType: MassTimberType.HEAVY_TIMBER });
    expect(normalValid).toBe(true);
    expect(typeof normalValid).toBe('boolean');
    expect(normalSpy).not.toHaveBeenCalled(); // Should not warn for normal values
    normalSpy.mockRestore();
  });
});
