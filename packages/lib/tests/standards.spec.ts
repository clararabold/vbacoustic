import { describe, it, expect } from 'vitest';
import { StandardsManager } from '../src/standards/StandardsManager';
import { StandardType } from '../src/standards/AcousticStandard';
import { ConstructionTypeStandard, ElementType } from '../src/standards/AcousticStandard';

describe('StandardsManager basic behaviors', () => {
  it('returns available standards and recommended standard', () => {
    const mgr = new StandardsManager();
    const available = mgr.getAvailableStandards();
    expect(Array.isArray(available)).toBe(true);
    expect(available.length).toBeGreaterThan(0);
    // Check that all returned standards are valid types
    available.forEach(standard => {
      expect(typeof standard).toBe('string');
      expect(standard.length).toBeGreaterThan(0);
    });

    // Test recommendations for different construction types
    const recommendedMixed = mgr.getRecommendedStandard(ConstructionTypeStandard.MIXED_CONSTRUCTION);
    expect(recommendedMixed).toBeDefined();
    expect(typeof recommendedMixed).toBe('string');

    const recommendedMassive = mgr.getRecommendedStandard(ConstructionTypeStandard.MASSIVBAU_BETON);
    expect(recommendedMassive).toBeDefined();
    expect(typeof recommendedMassive).toBe('string');

    const recommendedWood = mgr.getRecommendedStandard(ConstructionTypeStandard.HOLZBAU_MASSIV);
    expect(recommendedWood).toBeDefined();
    expect(typeof recommendedWood).toBe('string');
  });

  it('validateAgainstMultipleStandards returns map with results for supported standards', () => {
    const mgr = new StandardsManager();
    
    // Test with realistic acoustic results
    const goodResults = { 
      walls: [{ 
        name: 'Wall-1', 
        Rw: 55, 
        buildingClass: 'standard',
        elementType: ElementType.SEPARATING_WALL,
        mass: 200
      }], 
      floors: [{ 
        name: 'Floor-1', 
        Rw: 52, 
        Lnw: 55,
        buildingClass: 'standard',
        elementType: ElementType.SEPARATING_FLOOR,
        mass: 300
      }] 
    };
    
    const resultsGood = mgr.validateAgainstMultipleStandards(goodResults, [StandardType.DIN4109, StandardType.ISO12354]);
    expect(resultsGood instanceof Map).toBe(true);
    expect(resultsGood.size).toBe(2); // Should have both standards
    
    // Validate each standard result
    resultsGood.forEach((validation, standardType) => {
      expect(typeof standardType).toBe('string');
      expect(validation).toBeDefined();
      expect(typeof validation.isCompliant).toBe('boolean');
      expect(Array.isArray(validation.deviations)).toBe(true);
      expect(Array.isArray(validation.recommendedActions)).toBe(true);
    });

    // Test with failing results
    const poorResults = { 
      walls: [{ 
        name: 'Poor-Wall', 
        Rw: 35, // Too low
        buildingClass: 'standard',
        elementType: ElementType.SEPARATING_WALL,
        mass: 100
      }], 
      floors: [{ 
        name: 'Poor-Floor', 
        Rw: 40, 
        Lnw: 75, // Too high
        buildingClass: 'standard',
        elementType: ElementType.SEPARATING_FLOOR,
        mass: 200
      }] 
    };
    
    const resultsPoor = mgr.validateAgainstMultipleStandards(poorResults, [StandardType.DIN4109]);
    expect(resultsPoor.size).toBe(1);
    const dinValidation = resultsPoor.get(StandardType.DIN4109)!;
    expect(dinValidation.isCompliant).toBe(false);
    expect(dinValidation.deviations.length).toBeGreaterThan(0);
  });

  it('applyStandardCorrections delegates to standard implementation', () => {
    const mgr = new StandardsManager();
    
    // Test basic correction application
    const baseRw = 60;
    const corrected = mgr.applyStandardCorrections(StandardType.DIN4109, baseRw, { applySafetyMargin: true });
    expect(typeof corrected).toBe('number');
    expect(corrected).toBeLessThan(baseRw); // Safety margin should reduce value
    expect(corrected).toBe(58); // DIN4109 safety margin is -2 dB
    
    // Test field correction
    const fieldCorrected = mgr.applyStandardCorrections(StandardType.DIN4109, baseRw, { fieldCorrection: true });
    expect(fieldCorrected).toBe(55); // DIN4109 field correction is -5 dB
    
    // Test combined corrections
    const bothCorrections = mgr.applyStandardCorrections(StandardType.DIN4109, baseRw, { 
      applySafetyMargin: true, 
      fieldCorrection: true 
    });
    expect(bothCorrections).toBe(53); // -2 -5 = -7 dB total
    
    // Test no corrections
    const noCorrections = mgr.applyStandardCorrections(StandardType.DIN4109, baseRw, {});
    expect(noCorrections).toBe(baseRw); // Should remain unchanged
    
    // Test with different standard
    const isoCorrected = mgr.applyStandardCorrections(StandardType.ISO12354, baseRw, { applySafetyMargin: true });
    expect(typeof isoCorrected).toBe('number');
    expect(isoCorrected).toBeLessThanOrEqual(baseRw);
    
    // Test boundary values
    const highValue = mgr.applyStandardCorrections(StandardType.DIN4109, 80, { applySafetyMargin: true });
    expect(highValue).toBe(78);
    
    const lowValue = mgr.applyStandardCorrections(StandardType.DIN4109, 30, { applySafetyMargin: true });
    expect(lowValue).toBe(28);
  });

  it('compareJunctionAttenuations returns a map with numbers', () => {
    const mgr = new StandardsManager();
    
    // Test with typical masses for different junction types
    const lightMasses = [100, 120]; // Light construction
    const mediumMasses = [200, 250]; // Medium construction  
    const heavyMasses = [400, 500]; // Heavy construction
    
    // Test rigid-rigid junction
    const rigidMap = mgr.compareJunctionAttenuations('rigid_rigid' as any, mediumMasses);
    expect(rigidMap instanceof Map).toBe(true);
    expect(rigidMap.size).toBeGreaterThan(0);
    
    // Validate all values are numbers and within reasonable range
    rigidMap.forEach((attenuation, standardType) => {
      expect(typeof standardType).toBe('string');
      expect(typeof attenuation).toBe('number');
      expect(attenuation).toBeGreaterThanOrEqual(0);
      expect(attenuation).toBeLessThanOrEqual(50); // Max reasonable attenuation
    });
    
    // Test flexible junction should generally give different results
    const flexibleMap = mgr.compareJunctionAttenuations('flexible_flexible' as any, mediumMasses);
    expect(flexibleMap instanceof Map).toBe(true);
    expect(flexibleMap.size).toBeGreaterThan(0);
    
    flexibleMap.forEach((attenuation, standardType) => {
      expect(typeof attenuation).toBe('number');
      expect(attenuation).toBeGreaterThanOrEqual(0);
      expect(attenuation).toBeLessThanOrEqual(50);
    });
    
    // Test mass dependency - heavier masses should generally give different attenuation
    const lightMap = mgr.compareJunctionAttenuations('rigid_rigid' as any, lightMasses);
    const heavyMap = mgr.compareJunctionAttenuations('rigid_rigid' as any, heavyMasses);
    
    expect(lightMap.size).toBeGreaterThan(0);
    expect(heavyMap.size).toBeGreaterThan(0);
    
    // Both should be valid ranges
    lightMap.forEach((attenuation) => {
      expect(attenuation).toBeGreaterThanOrEqual(0);
      expect(attenuation).toBeLessThanOrEqual(50);
    });
    
    heavyMap.forEach((attenuation) => {
      expect(attenuation).toBeGreaterThanOrEqual(0);
      expect(attenuation).toBeLessThanOrEqual(50);
    });
    
    // Test extreme cases
    const veryLightMasses = [50, 50];
    const veryHeavyMasses = [800, 1000];
    
    const veryLightMap = mgr.compareJunctionAttenuations('rigid_rigid' as any, veryLightMasses);
    const veryHeavyMap = mgr.compareJunctionAttenuations('rigid_rigid' as any, veryHeavyMasses);
    
    expect(veryLightMap.size).toBeGreaterThan(0);
    expect(veryHeavyMap.size).toBeGreaterThan(0);
  });
});
