import { describe, it, expect } from 'vitest';
import {
  K1K2Calculator,
  FloorConstructionType,
  WallCladdingType,
  ScreedConstructionType,
  calculateK1Factor,
  calculateK2Factor,
} from '../src/calculations/flanking/K1K2Calculator';
import { ScreedType, CladdingType } from '../src/models/AcousticTypes';

describe('K1K2Calculator - combined tests', () => {
  const calc = new K1K2Calculator();

  it('calculateK1 returns expected values for known combos', () => {
    const result1 = calc.calculateK1(FloorConstructionType.HBD_ABH_2GK, WallCladdingType.HWST_GK);
    expect(result1).toBe(6);
    expect(typeof result1).toBe('number');
    expect(Number.isFinite(result1)).toBe(true);
    expect(result1).toBeGreaterThan(0);
    
    const result2 = calc.calculateK1(FloorConstructionType.MHD, WallCladdingType.MHW);
    expect(result2).toBe(4);
    expect(typeof result2).toBe('number');
    expect(Number.isFinite(result2)).toBe(true);
    expect(result2).toBeGreaterThan(0);
    
    const result3 = calculateK1Factor(FloorConstructionType.HBD_ABH_GK, WallCladdingType.GF);
    expect(result3).toBe(4);
    expect(typeof result3).toBe('number');
    expect(Number.isFinite(result3)).toBe(true);
    expect(result3).toBeGreaterThan(0);
  });

  it('calculateK1 exhaustive enumeration yields numeric or VBA error 1000', () => {
    const floorTypes = Object.values(FloorConstructionType) as FloorConstructionType[];
    const claddings = Object.values(WallCladdingType) as WallCladdingType[];
    for (const f of floorTypes) {
      for (const c of claddings) {
        const k1 = calc.calculateK1(f, c);
        expect(typeof k1 === 'number').toBeTruthy();
        if (k1 !== 1000) expect(k1).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('calculateK2 clamps columns and returns finite numbers for ranges', () => {
    const k2 = calculateK2Factor(80, 5, WallCladdingType.HWST_GK, ScreedConstructionType.ZE_MF);
    expect(k2).toBeDefined();
    expect(typeof k2).toBe('number');
    expect(Number.isFinite(k2)).toBe(true);
    expect(k2).toBeGreaterThanOrEqual(0);
    expect(k2).toBeLessThanOrEqual(20); // Reasonable upper bound from K2 matrix

    const vLow = calc.calculateK2(5, 0, WallCladdingType.HWST_GK, ScreedConstructionType.ZE_WF);
    expect(vLow).toBeDefined();
    expect(typeof vLow).toBe('number');
    expect(Number.isFinite(vLow)).toBe(true);
    expect(vLow).toBeGreaterThanOrEqual(0);
    
    const vZero = calc.calculateK2(30, 5, WallCladdingType.HWST_GK, ScreedConstructionType.ZE_WF);
    expect(vZero).toBeDefined();
    expect(typeof vZero).toBe('number');
    expect(Number.isFinite(vZero)).toBe(true);
    expect(vZero).toBeGreaterThanOrEqual(0);
    expect(vLow).toBe(vZero); // Column clamping behavior

    const vHigh = calc.calculateK2(50, 6, WallCladdingType.GF, ScreedConstructionType.TE);
    expect(vHigh).toBeDefined();
    expect(typeof vHigh).toBe('number');
    expect(Number.isFinite(vHigh)).toBe(true);
    expect(vHigh).toBeGreaterThanOrEqual(0);
    
    const vBeyond = calc.calculateK2(200, 100, WallCladdingType.GF, ScreedConstructionType.TE);
    expect(vBeyond).toBeDefined();
    expect(typeof vBeyond).toBe('number');
    expect(Number.isFinite(vBeyond)).toBe(true);
    expect(vBeyond).toBeGreaterThanOrEqual(0);
    expect(vBeyond).toBe(vHigh); // High column clamping behavior
  });

  it('specific matrix row expectations for known entries', () => {
    const v = calc.calculateK2(30, 5, WallCladdingType.HWST_GK, ScreedConstructionType.ZE_WF);
    expect(v).toBe(10);
    expect(typeof v).toBe('number');
    expect(Number.isFinite(v)).toBe(true);
    expect(v).toBeGreaterThan(0);

    const v2 = calc.calculateK2(30, 5, WallCladdingType.MHW, ScreedConstructionType.ZE_WF);
    expect(v2).toBe(11);
    expect(typeof v2).toBe('number');
    expect(Number.isFinite(v2)).toBe(true);
    expect(v2).toBeGreaterThan(0);
    expect(v2).toBeGreaterThan(v); // MHW should have higher K2 than HWST_GK for same conditions
  });

  it('mapToVBAEnums maps ScreedType and CladdingType values without throwing', () => {
    const screeds = Object.values(ScreedType);
    const claddings = Object.values(CladdingType);
    for (const s of screeds) {
      for (const c of claddings) {
        const mapped = K1K2Calculator.mapToVBAEnums({ screedType: s as any, claddingType: c as any });
        expect(mapped).toBeDefined();
        expect(typeof mapped).toBe('object');
        expect(mapped).toHaveProperty('screedTypeVBA');
        expect(mapped).toHaveProperty('claddingTypeVBA');
        
        if (mapped.screedTypeVBA !== undefined) {
          expect(typeof mapped.screedTypeVBA).toBe('string');
          expect(mapped.screedTypeVBA).not.toBe('');
          expect(Object.values(ScreedConstructionType)).toContain(mapped.screedTypeVBA);
        }
        
        if (mapped.claddingTypeVBA !== undefined) {
          expect(typeof mapped.claddingTypeVBA).toBe('string');
          expect(mapped.claddingTypeVBA).not.toBe('');
          expect(Object.values(WallCladdingType)).toContain(mapped.claddingTypeVBA);
        }
      }
    }
  });

  it('calculateImpactSoundFlanking handles multiple branches (lightweight, mass timber, under-ceiling, unknown)', () => {
    const resLight = calc.calculateImpactSoundFlanking({
      floorType: FloorConstructionType.HBD_OFFEN,
      screedType: ScreedConstructionType.ZE_MF,
      lnw: 60,
      deltaLUnderCeiling: 0,
      sendingRoomArea: 40,
      couplingLength: 2,
      sendingCladdingType: WallCladdingType.HWST_GK,
      receivingCladdingType: WallCladdingType.GF,
      sendingDRw: 5,
      receivingDRw: 6,
      sendingRw: 55,
      receivingRw: 52,
      kFf: 0,
      kDf: 0,
      isMassTimber: false,
    });
    
    expect(resLight).toBeDefined();
    expect(typeof resLight).toBe('object');
    expect(resLight).toHaveProperty('lnDfw');
    expect(resLight).toHaveProperty('lnDFfw');
    expect(resLight).toHaveProperty('k1');
    expect(resLight).toHaveProperty('k2');
    
    expect(typeof resLight.lnDfw).toBe('number');
    expect(Number.isFinite(resLight.lnDfw)).toBe(true);
    expect(typeof resLight.lnDFfw).toBe('number');
    expect(Number.isFinite(resLight.lnDFfw)).toBe(true);
    expect(typeof resLight.k1).toBe('number');
    expect(Number.isFinite(resLight.k1)).toBe(true);
    expect(resLight.k1).toBeGreaterThanOrEqual(0);
    expect(typeof resLight.k2).toBe('number');
    expect(Number.isFinite(resLight.k2)).toBe(true);
    expect(resLight.k2).toBeGreaterThanOrEqual(0);

    const resMass = calc.calculateImpactSoundFlanking({
      floorType: FloorConstructionType.MHD_UD,
      screedType: ScreedConstructionType.ZE_WF,
      lnw: 50,
      deltaLUnderCeiling: 5,
      sendingRoomArea: 30,
      couplingLength: 2,
      sendingCladdingType: WallCladdingType.MHW,
      receivingCladdingType: WallCladdingType.MHW,
      sendingDRw: 8,
      receivingDRw: 7,
      sendingRw: 65,
      receivingRw: 62,
      kFf: 0,
      kDf: 0,
      isMassTimber: true,
    });
    
    expect(resMass).toBeDefined();
    expect(typeof resMass).toBe('object');
    expect(resMass).toHaveProperty('lnDfw');
    expect(resMass).toHaveProperty('lnDFfw');
    expect(resMass).toHaveProperty('k1');
    expect(resMass).toHaveProperty('k2');
    
    expect(typeof resMass.lnDfw).toBe('number');
    expect(Number.isFinite(resMass.lnDfw)).toBe(true);
    expect(typeof resMass.lnDFfw).toBe('number');
    expect(Number.isFinite(resMass.lnDFfw)).toBe(true);
    expect(typeof resMass.k1).toBe('number');
    expect(Number.isFinite(resMass.k1)).toBe(true);
    expect(resMass.k1).toBeGreaterThanOrEqual(0);
    expect(typeof resMass.k2).toBe('number');
    expect(Number.isFinite(resMass.k2)).toBe(true);
    expect(resMass.k2).toBeGreaterThanOrEqual(0);

    const resUnder = calc.calculateImpactSoundFlanking({
      floorType: FloorConstructionType.MHD_UD,
      screedType: ScreedConstructionType.ZE_WF,
      lnw: 55,
      deltaLUnderCeiling: 4,
      sendingRoomArea: 30,
      couplingLength: 2,
      sendingCladdingType: WallCladdingType.HWST_GK,
      receivingCladdingType: WallCladdingType.HWST_GK,
      sendingDRw: 2,
      receivingDRw: 3,
      sendingRw: 65,
      receivingRw: 66,
      kFf: 0,
      kDf: 0,
      isMassTimber: false,
    });
    
    expect(resUnder).toBeDefined();
    expect(typeof resUnder).toBe('object');
    expect(resUnder).toHaveProperty('lnDfw');
    expect(resUnder).toHaveProperty('lnDFfw');
    expect(resUnder).toHaveProperty('k1');
    expect(resUnder).toHaveProperty('k2');
    
    expect(typeof resUnder.lnDfw).toBe('number');
    expect(Number.isFinite(resUnder.lnDfw)).toBe(true);
    expect(typeof resUnder.lnDFfw).toBe('number');
    expect(Number.isFinite(resUnder.lnDFfw)).toBe(true);
    expect(typeof resUnder.k1).toBe('number');
    expect(Number.isFinite(resUnder.k1)).toBe(true);
    expect(resUnder.k1).toBeGreaterThanOrEqual(0);
    expect(typeof resUnder.k2).toBe('number');
    expect(Number.isFinite(resUnder.k2)).toBe(true);
    expect(resUnder.k2).toBeGreaterThanOrEqual(0);

    const resUnknown = calc.calculateImpactSoundFlanking({
      floorType: 'UNKNOWN' as any,
      screedType: ScreedConstructionType.ZE_MF,
      lnw: 50,
      deltaLUnderCeiling: 0,
      sendingRoomArea: 20,
      couplingLength: 1,
      sendingCladdingType: WallCladdingType.HWST_GK,
      receivingCladdingType: WallCladdingType.HWST_GK,
      sendingDRw: 1,
      receivingDRw: 1,
      sendingRw: 40,
      receivingRw: 42,
      kFf: 0,
      kDf: 0,
      isMassTimber: false,
    });
    
    expect(resUnknown).toBeDefined();
    expect(typeof resUnknown).toBe('object');
    expect(resUnknown).toHaveProperty('lnDfw');
    expect(resUnknown).toHaveProperty('lnDFfw');
    expect(resUnknown).toHaveProperty('k1');
    expect(resUnknown).toHaveProperty('k2');
    
    expect(typeof resUnknown.lnDfw).toBe('number');
    expect(Number.isFinite(resUnknown.lnDfw)).toBe(true);
    expect(typeof resUnknown.lnDFfw).toBe('number');
    expect(Number.isFinite(resUnknown.lnDFfw)).toBe(true);
    expect(resUnknown.k1).toBe(1000); // Unknown floor type returns error value
    expect(typeof resUnknown.k1).toBe('number');
    expect(Number.isFinite(resUnknown.k1)).toBe(true);
    expect(typeof resUnknown.k2).toBe('number');
    expect(Number.isFinite(resUnknown.k2)).toBe(true);
    expect(resUnknown.k2).toBeGreaterThanOrEqual(0);
  });

  it('functional wrappers produce same kind of results', () => {
    const k1 = calculateK1Factor(FloorConstructionType.HBD_OFFEN, WallCladdingType.GF);
    expect(k1).toBe(1);
    expect(typeof k1).toBe('number');
    expect(Number.isFinite(k1)).toBe(true);
    expect(k1).toBeGreaterThan(0);
    
    const k2 = calculateK2Factor(55, k1, WallCladdingType.GF, ScreedConstructionType.ZE_MF);
    expect(k2).toBeDefined();
    expect(typeof k2).toBe('number');
    expect(Number.isFinite(k2)).toBe(true);
    expect(k2).toBeGreaterThanOrEqual(0);
    expect(k2).toBeLessThanOrEqual(20); // Reasonable upper bound from K2 matrix
    
    // Verify consistency between class method and functional wrapper
    const k1Class = calc.calculateK1(FloorConstructionType.HBD_OFFEN, WallCladdingType.GF);
    const k2Class = calc.calculateK2(55, k1, WallCladdingType.GF, ScreedConstructionType.ZE_MF);
    
    expect(k1).toBe(k1Class); // Functional wrapper should match class method
    expect(k2).toBe(k2Class); // Functional wrapper should match class method
  });
});
