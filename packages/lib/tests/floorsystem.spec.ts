import { describe, it, expect } from 'vitest';
import { FloorSystemCalculator, FloorSystemType, LoadingType } from '../src/calculations/FloorSystemCalculator';
import { ScreedType } from '../src/calculations/ImpactSoundCalculator';
import { ConstructionCategory, ElementType } from '../src/models/AcousticTypes';

describe('FloorSystemCalculator', () => {
  it('throws on invalid inputs (non-positive base Rw or Lnw)', () => {
    const calc = new FloorSystemCalculator();
    
    // Test invalid baseRw values
    expect(() => calc.calculateFloorSystem({
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 0,
      baseLnw: 60,
      hasSuspendedCeiling: false,
      floorArea: 10
    } as any)).toThrow('Base Rw must be positive');

    expect(() => calc.calculateFloorSystem({
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: -5,
      baseLnw: 60,
      hasSuspendedCeiling: false,
      floorArea: 10
    } as any)).toThrow('Base Rw must be positive');

    // Test invalid baseLnw values
    expect(() => calc.calculateFloorSystem({
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 50,
      baseLnw: 0,
      hasSuspendedCeiling: false,
      floorArea: 10
    } as any)).toThrow('Base Lnw must be positive');

    expect(() => calc.calculateFloorSystem({
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 50,
      baseLnw: -10,
      hasSuspendedCeiling: false,
      floorArea: 10
    } as any)).toThrow('Base Lnw must be positive');

    // Test invalid floor area
    expect(() => calc.calculateFloorSystem({
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 50,
      baseLnw: 60,
      hasSuspendedCeiling: false,
      floorArea: 0
    } as any)).toThrow('Floor area must be positive');

    expect(() => calc.calculateFloorSystem({
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 50,
      baseLnw: 60,
      hasSuspendedCeiling: false,
      floorArea: -5
    } as any)).toThrow('Floor area must be positive');

    // Test mass timber floors without element mass
    expect(() => calc.calculateFloorSystem({
      systemType: FloorSystemType.MHD,
      loadingType: LoadingType.NONE,
      baseRw: 45,
      baseLnw: 65,
      hasSuspendedCeiling: false,
      floorArea: 15
    } as any)).toThrow('Element mass is required for mass timber floors');

    expect(() => calc.calculateFloorSystem({
      systemType: FloorSystemType.MHD_UD,
      loadingType: LoadingType.NONE,
      baseRw: 48,
      baseLnw: 62,
      hasSuspendedCeiling: false,
      floorArea: 20,
      baseMass: 0
    } as any)).toThrow('Element mass is required for mass timber floors');

    // Test missing system type
    expect(() => calc.calculateFloorSystem({
      loadingType: LoadingType.NONE,
      baseRw: 50,
      baseLnw: 60,
      hasSuspendedCeiling: false,
      floorArea: 10
    } as any)).toThrow('Floor system type is required');
  });

  it('calculates floor system improvements with screed and ceiling', () => {
    const calc = new FloorSystemCalculator();
    
    // Test comprehensive floor system with all improvements
    const fullSystemParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.SCREED,
      baseRw: 50,
      baseLnw: 75,
      floorArea: 20,
      screedType: ScreedType.CEMENT_MINERAL_FIBER,
      screedThickness: 0.04, // 40mm
      screedMass: 85, // kg/m²
      hasSuspendedCeiling: true,
      ceilingImprovement: 3,
      ceilingImpactImprovement: 2
    } as any;

    const results = calc.calculateFloorSystem(fullSystemParams);
    
    // Validate basic structure
    expect(results).toBeDefined();
    expect(typeof results).toBe('object');
    
    // Validate all result properties exist
    expect(results).toHaveProperty('baseRw');
    expect(results).toHaveProperty('baseLnw');
    expect(results).toHaveProperty('screedImprovement');
    expect(results).toHaveProperty('impactImprovement');
    expect(results).toHaveProperty('ceilingImprovement');
    expect(results).toHaveProperty('ceilingImpactImprovement');
    expect(results).toHaveProperty('finalRw');
    expect(results).toHaveProperty('finalLnw');
    
    // Validate base values are preserved
    expect(results.baseRw).toBe(fullSystemParams.baseRw);
    expect(results.baseLnw).toBe(fullSystemParams.baseLnw);
    
    // Validate improvements are applied correctly
    expect(typeof results.finalRw).toBe('number');
    expect(results.finalRw).toBeGreaterThanOrEqual(fullSystemParams.baseRw);
    expect(results.finalRw).toBe(fullSystemParams.baseRw + fullSystemParams.ceilingImprovement);
    
    expect(typeof results.finalLnw).toBe('number');
    expect(results.finalLnw).toBeGreaterThanOrEqual(0); // Cannot be negative
    expect(results.finalLnw).toBeLessThanOrEqual(fullSystemParams.baseLnw); // Should be improved (reduced)
    
    // Validate improvement values
    expect(typeof results.screedImprovement).toBe('number');
    expect(typeof results.impactImprovement).toBe('number');
    expect(results.impactImprovement).toBeGreaterThan(0); // Should provide improvement
    
    expect(results.ceilingImprovement).toBe(fullSystemParams.ceilingImprovement);
    expect(results.ceilingImpactImprovement).toBe(fullSystemParams.ceilingImpactImprovement);
    
    // Test floor system without improvements
    const basicParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 48,
      baseLnw: 78,
      floorArea: 15,
      hasSuspendedCeiling: false
    } as any;
    
    const basicResults = calc.calculateFloorSystem(basicParams);
    expect(basicResults.finalRw).toBe(basicParams.baseRw);
    expect(basicResults.finalLnw).toBe(basicParams.baseLnw);
    expect(basicResults.screedImprovement).toBe(0);
    expect(basicResults.impactImprovement).toBe(0);
    expect(basicResults.ceilingImprovement).toBe(0);
    expect(basicResults.ceilingImpactImprovement).toBe(0);
    
    // Test mass timber floor system
    const massTimberParams = {
      systemType: FloorSystemType.MHD,
      loadingType: LoadingType.SCREED,
      baseRw: 42,
      baseLnw: 82,
      baseMass: 95, // kg/m²
      floorArea: 25,
      screedType: ScreedType.DRY_SCREED,
      screedThickness: 0.05, // 50mm
      screedMass: 75,
      hasSuspendedCeiling: true,
      ceilingImprovement: 4,
      ceilingImpactImprovement: 3
    } as any;
    
    const massTimberResults = calc.calculateFloorSystem(massTimberParams);
    expect(massTimberResults.baseRw).toBe(massTimberParams.baseRw);
    expect(massTimberResults.baseLnw).toBe(massTimberParams.baseLnw);
    expect(massTimberResults.finalRw).toBeGreaterThan(massTimberParams.baseRw);
    expect(massTimberResults.finalLnw).toBeLessThan(massTimberParams.baseLnw);
    
    // Test hollow core floor system
    const hollowCoreParams = {
      systemType: FloorSystemType.HOLLOW_CORE,
      loadingType: LoadingType.GRAVEL,
      baseRw: 52,
      baseLnw: 72,
      floorArea: 30,
      hasSuspendedCeiling: false
    } as any;
    
    const hollowCoreResults = calc.calculateFloorSystem(hollowCoreParams);
    expect(hollowCoreResults.finalRw).toBe(hollowCoreParams.baseRw);
    expect(hollowCoreResults.finalLnw).toBe(hollowCoreParams.baseLnw);
    
    // Test with only ceiling improvements
    const ceilingOnlyParams = {
      systemType: FloorSystemType.HBD_ABH_2GK,
      loadingType: LoadingType.NONE,
      baseRw: 45,
      baseLnw: 85,
      floorArea: 18,
      hasSuspendedCeiling: true,
      ceilingImprovement: 5,
      ceilingImpactImprovement: 4
    } as any;
    
    const ceilingOnlyResults = calc.calculateFloorSystem(ceilingOnlyParams);
    expect(ceilingOnlyResults.finalRw).toBe(ceilingOnlyParams.baseRw + ceilingOnlyParams.ceilingImprovement);
    expect(ceilingOnlyResults.finalLnw).toBe(ceilingOnlyParams.baseLnw - ceilingOnlyParams.ceilingImpactImprovement);
    expect(ceilingOnlyResults.screedImprovement).toBe(0);
    expect(ceilingOnlyResults.impactImprovement).toBe(0);
    
    // Test edge cases
    
    // Very high impact improvement that would make Lnw negative
    const highImprovementParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.SCREED,
      baseRw: 55,
      baseLnw: 60,
      floorArea: 20,
      screedType: ScreedType.CEMENT_MINERAL_FIBER,
      screedThickness: 0.06, // Thick screed
      screedMass: 120, // Heavy screed
      hasSuspendedCeiling: true,
      ceilingImprovement: 2,
      ceilingImpactImprovement: 70 // Very high improvement
    } as any;
    
    const highImprovementResults = calc.calculateFloorSystem(highImprovementParams);
    expect(highImprovementResults.finalLnw).toBeGreaterThanOrEqual(0); // Should not be negative
    
    // Large floor area
    const largeFloorParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 51,
      baseLnw: 74,
      floorArea: 1000, // Large area
      hasSuspendedCeiling: false
    } as any;
    
    const largeFloorResults = calc.calculateFloorSystem(largeFloorParams);
    expect(largeFloorResults.finalRw).toBe(largeFloorParams.baseRw);
    expect(largeFloorResults.finalLnw).toBe(largeFloorParams.baseLnw);
    
    // Very small floor area
    const smallFloorParams = {
      systemType: FloorSystemType.MHD_UD,
      loadingType: LoadingType.NONE,
      baseRw: 46,
      baseLnw: 68,
      baseMass: 80,
      floorArea: 0.1, // Very small area
      hasSuspendedCeiling: false
    } as any;
    
    const smallFloorResults = calc.calculateFloorSystem(smallFloorParams);
    expect(smallFloorResults.finalRw).toBe(smallFloorParams.baseRw);
    expect(smallFloorResults.finalLnw).toBe(smallFloorParams.baseLnw);
    
    // Test all timber floor types require mass
    const timberTypes = [
      FloorSystemType.MHD,
      FloorSystemType.MHD_UD,
      FloorSystemType.MHD_HBV,
      FloorSystemType.MHD_RIPPEN_KASTEN
    ];
    
    timberTypes.forEach(systemType => {
      const validParams = {
        systemType,
        loadingType: LoadingType.NONE,
        baseRw: 44,
        baseLnw: 70,
        baseMass: 90,
        floorArea: 20,
        hasSuspendedCeiling: false
      } as any;
      
      const validResults = calc.calculateFloorSystem(validParams);
      expect(validResults.baseRw).toBe(validParams.baseRw);
      expect(validResults.baseLnw).toBe(validParams.baseLnw);
    });
  });

  it('createFloorElement returns a building element with correct category and material', () => {
    const calc = new FloorSystemCalculator();
    
    // Test concrete slab floor element creation
    const concreteParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 48,
      baseLnw: 70,
      floorArea: 12,
      hasSuspendedCeiling: false
    } as any;

    const concreteResults = calc.calculateFloorSystem(concreteParams);
    const concreteElement = calc.createFloorElement(concreteParams, concreteResults as any);

    // Validate basic structure
    expect(concreteElement).toBeDefined();
    expect(typeof concreteElement).toBe('object');
    
    // Validate element properties
    expect(concreteElement).toHaveProperty('id');
    expect(concreteElement).toHaveProperty('type');
    expect(concreteElement).toHaveProperty('material');
    expect(concreteElement).toHaveProperty('area');
    expect(concreteElement).toHaveProperty('Rw');
    expect(concreteElement).toHaveProperty('massPerArea');
    expect(concreteElement).toHaveProperty('constructionType');
    expect(concreteElement).toHaveProperty('acousticParams');
    
    // Validate concrete floor specifics
    expect(concreteElement.constructionType).toBe(ConstructionCategory.Massivbau);
    expect(concreteElement.type).toBe(ElementType.Floor); // Should be 'floor'
    expect(concreteElement.area).toBe(concreteParams.floorArea);
    expect(concreteElement.Rw).toBe(concreteResults.finalRw);
    expect(concreteElement.massPerArea).toBe(0); // No mass specified
    expect(concreteElement.id).toMatch(/floor_/);
    
    // Validate material
    expect(concreteElement.material).toBeDefined();
    expect(typeof concreteElement.material).toBe('object');
    expect(concreteElement.material).toHaveProperty('type');
    expect(concreteElement.material).toHaveProperty('surfaceMass');
    expect(concreteElement.material).toHaveProperty('constructionType');
    expect(typeof concreteElement.material.constructionType === 'string' || typeof concreteElement.material.constructionType === 'object').toBe(true);
    
    // Validate acoustic parameters
    expect(concreteElement.acousticParams).toBeDefined();
    expect(concreteElement.acousticParams).toHaveProperty('rw');
    expect(concreteElement.acousticParams).toHaveProperty('lnw');
    if (concreteElement.acousticParams) {
      expect(concreteElement.acousticParams.rw).toBe(concreteResults.finalRw);
      expect(concreteElement.acousticParams.lnw).toBe(concreteResults.finalLnw);
    }
    
    // Test mass timber floor element creation
    const massTimberParams = {
      systemType: FloorSystemType.MHD,
      loadingType: LoadingType.SCREED,
      baseRw: 45,
      baseLnw: 75,
      baseMass: 85,
      floorArea: 25,
      screedType: ScreedType.DRY_SCREED,
      screedThickness: 0.05,
      screedMass: 70,
      hasSuspendedCeiling: true,
      ceilingImprovement: 3,
      ceilingImpactImprovement: 2
    } as any;
    
    const massTimberResults = calc.calculateFloorSystem(massTimberParams);
    const massTimberElement = calc.createFloorElement(massTimberParams, massTimberResults as any);
    
    expect(massTimberElement.constructionType).toBe(ConstructionCategory.Massivholzbau);
    expect(massTimberElement.massPerArea).toBe(massTimberParams.baseMass);
    expect(massTimberElement.area).toBe(massTimberParams.floorArea);
    expect(massTimberElement.Rw).toBe(massTimberResults.finalRw);
    if (massTimberElement.acousticParams) {
      expect(massTimberElement.acousticParams.rw).toBe(massTimberResults.finalRw);
      expect(massTimberElement.acousticParams.lnw).toBe(massTimberResults.finalLnw);
    }
    
    // Test timber frame floor element creation (lightweight construction)
    const timberFrameParams = {
      systemType: FloorSystemType.HBD_ABH_2GK,
      loadingType: LoadingType.NONE,
      baseRw: 42,
      baseLnw: 82,
      floorArea: 18,
      hasSuspendedCeiling: false
    } as any;
    
    const timberFrameResults = calc.calculateFloorSystem(timberFrameParams);
    const timberFrameElement = calc.createFloorElement(timberFrameParams, timberFrameResults as any);
    
    expect(timberFrameElement.constructionType).toBe(ConstructionCategory.Leichtbau);
    expect(timberFrameElement.massPerArea).toBe(0); // No mass specified for HBD
    expect(timberFrameElement.area).toBe(timberFrameParams.floorArea);
    expect(timberFrameElement.Rw).toBe(timberFrameResults.finalRw);
    
    // Test hollow core floor element creation
    const hollowCoreParams = {
      systemType: FloorSystemType.HOLLOW_CORE,
      loadingType: LoadingType.GRAVEL,
      baseRw: 53,
      baseLnw: 68,
      floorArea: 30,
      hasSuspendedCeiling: false
    } as any;
    
    const hollowCoreResults = calc.calculateFloorSystem(hollowCoreParams);
    const hollowCoreElement = calc.createFloorElement(hollowCoreParams, hollowCoreResults as any);
    
    expect(hollowCoreElement.constructionType).toBe(ConstructionCategory.Massivbau);
    expect(hollowCoreElement.area).toBe(hollowCoreParams.floorArea);
    expect(hollowCoreElement.Rw).toBe(hollowCoreResults.finalRw);
    
    // Test all floor system types create valid elements
    const allFloorTypes = Object.values(FloorSystemType);
    
    allFloorTypes.forEach(systemType => {
      const baseParams: any = {
        systemType,
        loadingType: LoadingType.NONE,
        baseRw: 47,
        baseLnw: 73,
        floorArea: 20,
        hasSuspendedCeiling: false
      };
      
      // Add mass for mass timber types
      if (systemType.startsWith('mhd')) {
        baseParams.baseMass = 90;
      }
      
      const results = calc.calculateFloorSystem(baseParams);
      const element = calc.createFloorElement(baseParams, results);
      
      expect(element).toBeDefined();
      expect(element.type).toBe(ElementType.Floor);
      expect(element.area).toBe(baseParams.floorArea);
      expect(element.Rw).toBe(results.finalRw);
      if (element.acousticParams) {
        expect(element.acousticParams.rw).toBe(results.finalRw);
        expect(element.acousticParams.lnw).toBe(results.finalLnw);
      }
      expect(Object.values(ConstructionCategory)).toContain(element.constructionType);
      
      // Validate construction category assignment
      if (systemType.startsWith('mhd')) {
        expect(element.constructionType).toBe(ConstructionCategory.Massivholzbau);
      } else if (systemType.startsWith('hbd')) {
        expect(element.constructionType).toBe(ConstructionCategory.Leichtbau);
      } else {
        expect(element.constructionType).toBe(ConstructionCategory.Massivbau);
      }
    });
    
    // Test element creation with improvements
    const improvedParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.SCREED,
      baseRw: 50,
      baseLnw: 75,
      floorArea: 15,
      screedType: ScreedType.CEMENT_MINERAL_FIBER,
      screedThickness: 0.04,
      screedMass: 85,
      hasSuspendedCeiling: true,
      ceilingImprovement: 4,
      ceilingImpactImprovement: 3
    } as any;
    
    const improvedResults = calc.calculateFloorSystem(improvedParams);
    const improvedElement = calc.createFloorElement(improvedParams, improvedResults);
    
    // Element should reflect improved performance
    expect(improvedElement.Rw).toBe(improvedResults.finalRw);
    expect(improvedElement.Rw).toBeGreaterThan(improvedParams.baseRw);
    if (improvedElement.acousticParams) {
      expect(improvedElement.acousticParams.rw).toBe(improvedResults.finalRw);
      expect(improvedElement.acousticParams.lnw).toBe(improvedResults.finalLnw);
      expect(improvedElement.acousticParams.lnw).toBeLessThan(improvedParams.baseLnw);
    }
  });

  it('combines airborne and impact sound transmissions', () => {
    const calc = new FloorSystemCalculator();
    
    // Test airborne sound combination with realistic values
    const directRw = 50;
    const flankingRijw = [40, 45, 42]; // Typical flanking values
    const combinedAirborne = calc.calculateCombinedAirborneSound(directRw, flankingRijw);
    
    expect(typeof combinedAirborne).toBe('number');
    expect(combinedAirborne).toBeGreaterThan(0);
    expect(combinedAirborne).toBeLessThan(directRw); // Combined should be lower due to flanking
    expect(Number.isFinite(combinedAirborne)).toBe(true);
    
    // Test impact sound combination with realistic values
    const directLnw = 70;
    const flankingLnijw = [65, 72, 68]; // Typical flanking values
    const combinedImpact = calc.calculateCombinedImpactSound(directLnw, flankingLnijw);
    
    expect(typeof combinedImpact).toBe('number');
    expect(combinedImpact).toBeGreaterThan(0);
    expect(combinedImpact).toBeGreaterThan(directLnw); // Combined should be higher due to flanking
    expect(Number.isFinite(combinedImpact)).toBe(true);
    
    // Test airborne with no flanking (should equal direct)
    const noFlankingAirborne = calc.calculateCombinedAirborneSound(52, []);
    expect(noFlankingAirborne).toBe(52);
    
    // Test impact with no flanking (should equal direct)
    const noFlankingImpact = calc.calculateCombinedImpactSound(73, []);
    expect(noFlankingImpact).toBe(73);
    
    // Test airborne with zero flanking values (ignored per VBA logic)
    const zeroFlankingAirborne = calc.calculateCombinedAirborneSound(48, [0, 0, 0]);
    expect(zeroFlankingAirborne).toBe(48);
    
    // Test impact with invalid flanking values (ignored per VBA logic)
    const invalidFlankingImpact = calc.calculateCombinedImpactSound(75, [NaN, undefined as any, null as any]);
    expect(invalidFlankingImpact).toBe(75);
    
    // Test with mixed valid and invalid flanking values
    const mixedFlankingAirborne = calc.calculateCombinedAirborneSound(55, [43, 0, 47, -5]);
    expect(typeof mixedFlankingAirborne).toBe('number');
    expect(mixedFlankingAirborne).toBeLessThan(55);
    
    const mixedFlankingImpact = calc.calculateCombinedImpactSound(68, [62, NaN, 70, 65]);
    expect(typeof mixedFlankingImpact).toBe('number');
    expect(mixedFlankingImpact).toBeGreaterThan(68);
    
    // Test high-performance scenarios
    const highPerformanceAirborne = calc.calculateCombinedAirborneSound(65, [58, 62, 60]);
    expect(highPerformanceAirborne).toBeLessThan(65);
    expect(highPerformanceAirborne).toBeGreaterThan(50); // Should be reasonable
    
    const lowImpactSound = calc.calculateCombinedImpactSound(45, [42, 48, 46]);
    expect(lowImpactSound).toBeGreaterThan(45);
    expect(lowImpactSound).toBeLessThan(60); // Should be reasonable
    
    // Test edge cases
    
    // Very low direct transmission
    const veryLowAirborne = calc.calculateCombinedAirborneSound(30, [25, 28]);
    expect(typeof veryLowAirborne).toBe('number');
    expect(veryLowAirborne).toBeGreaterThan(0);
    expect(veryLowAirborne).toBeLessThan(30);
    
    // Very high direct transmission
    const veryHighAirborne = calc.calculateCombinedAirborneSound(75, [68, 72, 70]);
    expect(typeof veryHighAirborne).toBe('number');
    expect(veryHighAirborne).toBeGreaterThan(60);
    expect(veryHighAirborne).toBeLessThan(75);
    
    // Very low impact sound (good performance)
    const veryLowImpact = calc.calculateCombinedImpactSound(35, [32, 38, 36]);
    expect(typeof veryLowImpact).toBe('number');
    expect(veryLowImpact).toBeGreaterThan(35);
    expect(veryLowImpact).toBeLessThan(50);
    
    // Very high impact sound (poor performance)
    const veryHighImpact = calc.calculateCombinedImpactSound(90, [85, 92, 88]);
    expect(typeof veryHighImpact).toBe('number');
    expect(veryHighImpact).toBeGreaterThan(90);
    expect(veryHighImpact).toBeLessThan(100);
    
    // Test logarithmic combination behavior
    
    // Multiple weak flanking paths should have significant effect
    const manyWeakFlanking = calc.calculateCombinedAirborneSound(60, [35, 35, 35, 35, 35]);
    expect(manyWeakFlanking).toBeLessThan(60);
    expect(manyWeakFlanking).toBeGreaterThan(25); // Adjusted based on actual behavior
    
    // Single strong flanking path vs multiple weak paths
    const singleStrongFlanking = calc.calculateCombinedAirborneSound(65, [45]);
    const multipleWeakFlanking = calc.calculateCombinedAirborneSound(65, [35, 35, 35]);
    expect(singleStrongFlanking).toBeGreaterThan(multipleWeakFlanking); // Strong single path performs better
    
    // Test consistency with VBA logarithmic formulas
    
    // Airborne: R' = -10*log10(10^(-0.1*Rw) + sum(10^(-0.1*Rijw)))
    const testDirectRw = 53;
    const testFlankingRijw = [41, 44];
    const expectedCombined = -10 * Math.log10(
      Math.pow(10, -0.1 * testDirectRw) + 
      Math.pow(10, -0.1 * testFlankingRijw[0]) + 
      Math.pow(10, -0.1 * testFlankingRijw[1])
    );
    const actualCombined = calc.calculateCombinedAirborneSound(testDirectRw, testFlankingRijw);
    expect(Math.abs(actualCombined - expectedCombined)).toBeLessThan(0.1); // Within rounding tolerance
    
    // Impact: L'n = 10*log10(10^(0.1*Lnw) + sum(10^(0.1*Lnijw)))
    const testDirectLnw = 67;
    const testFlankingLnijw = [63, 71];
    const expectedImpactCombined = 10 * Math.log10(
      Math.pow(10, 0.1 * testDirectLnw) + 
      Math.pow(10, 0.1 * testFlankingLnijw[0]) + 
      Math.pow(10, 0.1 * testFlankingLnijw[1])
    );
    const actualImpactCombined = calc.calculateCombinedImpactSound(testDirectLnw, testFlankingLnijw);
    expect(Math.abs(actualImpactCombined - expectedImpactCombined)).toBeLessThan(0.1); // Within rounding tolerance
    
    // Test floating point precision
    const precisionTest = calc.calculateCombinedAirborneSound(50.7, [42.3, 45.8, 43.1]);
    expect(typeof precisionTest).toBe('number');
    expect(Number.isFinite(precisionTest)).toBe(true);
    
    // Test result rounding (should be to one decimal place)
    const roundingTestAirborne = calc.calculateCombinedAirborneSound(50, [40, 45]);
    expect(Number.isInteger(roundingTestAirborne * 10)).toBe(true); // Should be rounded to 1 decimal
    
    const roundingTestImpact = calc.calculateCombinedImpactSound(70, [65, 72]);
    expect(Number.isInteger(roundingTestImpact * 10)).toBe(true); // Should be rounded to 1 decimal
  });

  it('handles comprehensive floor system scenarios and edge cases', () => {
    const calc = new FloorSystemCalculator();
    
    // Test all floor system types with loading variations
    const testScenarios = [
      {
        name: 'Concrete slab with screed and ceiling',
        params: {
          systemType: FloorSystemType.CONCRETE_SLAB,
          loadingType: LoadingType.SCREED,
          baseRw: 52,
          baseLnw: 72,
          floorArea: 25,
          screedType: ScreedType.CEMENT_MINERAL_FIBER,
          screedThickness: 0.045,
          screedMass: 90,
          hasSuspendedCeiling: true,
          ceilingImprovement: 4,
          ceilingImpactImprovement: 3
        }
      },
      {
        name: 'Hollow core with gravel loading',
        params: {
          systemType: FloorSystemType.HOLLOW_CORE,
          loadingType: LoadingType.GRAVEL,
          baseRw: 54,
          baseLnw: 68,
          floorArea: 40,
          hasSuspendedCeiling: false
        }
      },
      {
        name: 'Mass timber with ceiling only',
        params: {
          systemType: FloorSystemType.MHD_UD,
          loadingType: LoadingType.NONE,
          baseRw: 46,
          baseLnw: 76,
          baseMass: 110,
          floorArea: 30,
          hasSuspendedCeiling: true,
          ceilingImprovement: 5,
          ceilingImpactImprovement: 4
        }
      },
      {
        name: 'Timber frame basic',
        params: {
          systemType: FloorSystemType.HBD_OFFEN,
          loadingType: LoadingType.NONE,
          baseRw: 38,
          baseLnw: 88,
          floorArea: 22,
          hasSuspendedCeiling: false
        }
      }
    ];
    
    testScenarios.forEach(scenario => {
      const results = calc.calculateFloorSystem(scenario.params as any);
      
      // Validate basic requirements
      expect(results).toBeDefined();
      expect(results.baseRw).toBe(scenario.params.baseRw);
      expect(results.baseLnw).toBe(scenario.params.baseLnw);
      expect(results.finalRw).toBeGreaterThanOrEqual(scenario.params.baseRw);
      expect(results.finalLnw).toBeGreaterThanOrEqual(0);
      
      // Validate improvement logic
      if (scenario.params.hasSuspendedCeiling) {
        expect(results.ceilingImprovement).toBeGreaterThan(0);
        expect(results.finalRw).toBeGreaterThan(scenario.params.baseRw);
      } else {
        expect(results.ceilingImprovement).toBe(0);
      }
      
      if (scenario.params.screedType) {
        expect(results.impactImprovement).toBeGreaterThan(0);
        expect(results.finalLnw).toBeLessThan(scenario.params.baseLnw);
      } else {
        expect(results.impactImprovement).toBe(0);
      }
      
      // Test element creation for each scenario
      const element = calc.createFloorElement(scenario.params as any, results);
      expect(element).toBeDefined();
      expect(element.Rw).toBe(results.finalRw);
      expect(element.area).toBe(scenario.params.floorArea);
    });
    
    // Test extreme performance scenarios
    
    // Very high base performance
    const highPerformanceParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.SCREED,
      baseRw: 70, // Very high
      baseLnw: 45, // Very low (good)
      floorArea: 50,
      screedType: ScreedType.DRY_SCREED,
      screedThickness: 0.06,
      screedMass: 100,
      hasSuspendedCeiling: true,
      ceilingImprovement: 6,
      ceilingImpactImprovement: 5
    } as any;
    
    const highPerfResults = calc.calculateFloorSystem(highPerformanceParams);
    expect(highPerfResults.finalRw).toBeGreaterThan(70);
    expect(highPerfResults.finalLnw).toBeLessThan(45);
    expect(highPerfResults.finalLnw).toBeGreaterThanOrEqual(0);
    
    // Very low base performance with maximum improvements
    const lowPerformanceParams = {
      systemType: FloorSystemType.HBD_OFFEN,
      loadingType: LoadingType.SCREED,
      baseRw: 35, // Very low
      baseLnw: 95, // Very high (poor)
      floorArea: 15,
      screedType: ScreedType.CEMENT_MINERAL_FIBER,
      screedThickness: 0.08, // Very thick
      screedMass: 150, // Very heavy
      hasSuspendedCeiling: true,
      ceilingImprovement: 8, // High improvement
      ceilingImpactImprovement: 10 // High improvement
    } as any;
    
    const lowPerfResults = calc.calculateFloorSystem(lowPerformanceParams);
    expect(lowPerfResults.finalRw).toBeGreaterThan(35);
    expect(lowPerfResults.finalLnw).toBeLessThan(95);
    expect(lowPerfResults.finalLnw).toBeGreaterThanOrEqual(0);
    
    // Test boundary values
    
    // Minimum valid parameters
    const minParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.NONE,
      baseRw: 0.1, // Minimum positive
      baseLnw: 0.1, // Minimum positive
      floorArea: 0.1, // Minimum positive
      hasSuspendedCeiling: false
    } as any;
    
    const minResults = calc.calculateFloorSystem(minParams);
    expect(minResults.finalRw).toBe(0.1);
    expect(minResults.finalLnw).toBe(0.1);
    
    // Very large area
    const largeAreaParams = {
      systemType: FloorSystemType.HOLLOW_CORE,
      loadingType: LoadingType.NONE,
      baseRw: 50,
      baseLnw: 70,
      floorArea: 10000, // Very large
      hasSuspendedCeiling: false
    } as any;
    
    const largeAreaResults = calc.calculateFloorSystem(largeAreaParams);
    expect(largeAreaResults.finalRw).toBe(50);
    expect(largeAreaResults.finalLnw).toBe(70);
    
    // Test all mass timber types
    const massTimberTypes = [
      FloorSystemType.MHD,
      FloorSystemType.MHD_UD,
      FloorSystemType.MHD_HBV,
      FloorSystemType.MHD_RIPPEN_KASTEN
    ];
    
    massTimberTypes.forEach(systemType => {
      const params = {
        systemType,
        loadingType: LoadingType.SCREED,
        baseRw: 44,
        baseLnw: 74,
        baseMass: 85,
        floorArea: 20,
        screedType: ScreedType.DRY_SCREED,
        screedThickness: 0.04,
        screedMass: 80,
        hasSuspendedCeiling: true,
        ceilingImprovement: 3,
        ceilingImpactImprovement: 2
      } as any;
      
      const results = calc.calculateFloorSystem(params);
      expect(results.finalRw).toBeGreaterThan(params.baseRw);
      expect(results.finalLnw).toBeLessThan(params.baseLnw);
      
      const element = calc.createFloorElement(params, results);
      expect(element.constructionType).toBe(ConstructionCategory.Massivholzbau);
      expect(element.massPerArea).toBe(params.baseMass);
    });
    
    // Test all timber frame types
    const timberFrameTypes = [
      FloorSystemType.HBD_ABH_2GK,
      FloorSystemType.HBD_ABH_GK,
      FloorSystemType.HBD_OFFEN,
      FloorSystemType.HBD_L_GK
    ];
    
    timberFrameTypes.forEach(systemType => {
      const params = {
        systemType,
        loadingType: LoadingType.NONE,
        baseRw: 40,
        baseLnw: 80,
        floorArea: 18,
        hasSuspendedCeiling: false
      } as any;
      
      const results = calc.calculateFloorSystem(params);
      expect(results.finalRw).toBe(params.baseRw);
      expect(results.finalLnw).toBe(params.baseLnw);
      
      const element = calc.createFloorElement(params, results);
      expect(element.constructionType).toBe(ConstructionCategory.Leichtbau);
      expect(element.massPerArea).toBe(0); // No mass required for timber frame
    });
    
    // Test calculation consistency
    const consistencyParams = {
      systemType: FloorSystemType.CONCRETE_SLAB,
      loadingType: LoadingType.SCREED,
      baseRw: 48,
      baseLnw: 76,
      floorArea: 20,
      screedType: ScreedType.CEMENT_MINERAL_FIBER,
      screedThickness: 0.04,
      screedMass: 85,
      hasSuspendedCeiling: true,
      ceilingImprovement: 3,
      ceilingImpactImprovement: 2
    } as any;
    
    // Multiple calculations should yield identical results
    const result1 = calc.calculateFloorSystem(consistencyParams);
    const result2 = calc.calculateFloorSystem(consistencyParams);
    const result3 = calc.calculateFloorSystem(consistencyParams);
    
    expect(result1.finalRw).toBe(result2.finalRw);
    expect(result1.finalRw).toBe(result3.finalRw);
    expect(result1.finalLnw).toBe(result2.finalLnw);
    expect(result1.finalLnw).toBe(result3.finalLnw);
    expect(result1.screedImprovement).toBe(result2.screedImprovement);
    expect(result1.impactImprovement).toBe(result2.impactImprovement);
  });
});
