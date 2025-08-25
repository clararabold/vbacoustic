import { describe, it, expect } from 'vitest';
import {
  validateSeparatingWall,
  validateSeparatingFloor,
  validateFlankingElement,
  validateBuildingConfiguration,
  BuildingElementValidator,
} from '../src/validation/BuildingElementValidator';
import {
  BuildingElement,
  ConstructionCategory,
  ElementType,
} from '../src/models/AcousticTypes';

describe('Building Element Validation - Comprehensive Tests', () => {
  describe('Separating Wall Validation', () => {
    it('validates healthy separating wall with warnings for extreme values', () => {
      const wall = {
        id: 'w1',
        type: ElementType.Wall,
        Rw: 90,
        massPerArea: 1200,
        area: 12,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;
      
      const result = validateSeparatingWall(wall);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.errors.length).toBe(0);
      expect(result.warnings.some(w => w.field === 'Rw')).toBeTruthy();
      expect(result.warnings.some(w => w.field === 'massPerArea')).toBeTruthy();
    });

    it('detects missing fields and invalid values for separating wall', () => {
      const badWall: any = {
        id: 'w2',
        // missing type
        Rw: -5,
        area: 0,
        constructionType: ConstructionCategory.Massivbau,
        // missing massPerArea
      };

      const result = validateSeparatingWall(badWall as any);
      expect(result.isValid).toBeFalsy();
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
      expect(result.errors.some(e => e.field === 'Rw')).toBeTruthy();
      expect(result.errors.some(e => e.field === 'area')).toBeTruthy();
      expect(result.errors.some(e => e.field === 'massPerArea')).toBeTruthy();
    });

    it('validates mass requirements for different construction types', () => {
      const massTimberWall = {
        id: 'w3',
        type: ElementType.Wall,
        Rw: 55,
        area: 10,
        constructionType: ConstructionCategory.Massivholzbau,
        // missing massPerArea - should trigger error
      } as any;

      const result = validateSeparatingWall(massTimberWall);
      expect(result.errors.some(e => e.field === 'massPerArea')).toBeTruthy();
    });

    it('provides warnings for extreme but valid values', () => {
      const extremeWall = {
        id: 'w4',
        type: ElementType.Wall,
        Rw: 85, // high but not extreme
        massPerArea: 1500, // very high
        area: 10,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;

      const result = validateSeparatingWall(extremeWall);
      expect(result.warnings.some(w => w.field === 'Rw')).toBeTruthy();
      expect(result.warnings.some(w => w.field === 'massPerArea')).toBeTruthy();
    });
  });

  describe('Separating Floor Validation', () => {
    it('validates separating floor missing acoustic parameters', () => {
      const floor = {
        id: 'f1',
        type: ElementType.Floor,
        Rw: 40,
        massPerArea: 200,
        area: 16,
        constructionType: ConstructionCategory.Massivholzbau,
      } as BuildingElement;
      
      const result = validateSeparatingFloor(floor, undefined as any);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'lnw')).toBeTruthy();
    });

    it('requires lnw and reports error when missing', () => {
      const floor: any = {
        id: 'f2',
        type: ElementType.Floor,
        Rw: 50,
        area: 20,
        massPerArea: 200,
        constructionType: ConstructionCategory.Massivholzbau,
      };

      const result = validateSeparatingFloor(floor, undefined);
      expect(result.errors.some(e => e.field === 'lnw')).toBeTruthy();
    });

    it('provides warning for high lnw values', () => {
      const floor: any = {
        id: 'f3',
        type: ElementType.Floor,
        Rw: 60,
        area: 20,
        massPerArea: 200,
        constructionType: ConstructionCategory.Massivholzbau,
      };
      
      const result = validateSeparatingFloor(floor, { rw: 60, lnw: 150 } as any);
      expect(result.warnings.some(w => w.field === 'lnw')).toBeTruthy();
    });

    it('validates mass requirements for mass timber floors', () => {
      const massTimberFloor: any = {
        id: 'f4',
        type: ElementType.Floor,
        Rw: 40,
        area: 20,
        constructionType: ConstructionCategory.Massivholzbau,
        // missing massPerArea and acousticParams
      };

      const result = validateSeparatingFloor(massTimberFloor, undefined);
      expect(result.isValid).toBeFalsy();
      expect(result.errors.some(e => e.field === 'lnw')).toBeTruthy();
      expect(result.errors.some(e => e.field === 'massPerArea')).toBeTruthy();
    });

    it('warns about low sound reduction for floors', () => {
      const lowRwFloor = {
        id: 'f5',
        type: ElementType.Floor,
        Rw: 25, // below 30 dB threshold
        area: 20,
        massPerArea: 300,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;

      const result = validateSeparatingFloor(lowRwFloor, { lnw: 65 } as any);
      expect(result.warnings.some(w => w.field === 'Rw')).toBeTruthy();
    });
  });

  describe('Flanking Element Validation', () => {
    it('validates flanking element with positive coupling length', () => {
      const flankingElement = {
        id: 'fl1',
        type: ElementType.Wall,
        Rw: 45,
        massPerArea: 200,
        area: 8,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;
      
      const result = validateFlankingElement(flankingElement, -1);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'couplingLength')).toBeTruthy();
    });

    it('enforces type and coupling length requirements', () => {
      const flankingElement: any = {
        id: 'fl2',
        // missing type
        Rw: 30,
        area: 10,
        constructionType: ConstructionCategory.Massivbau,
      };

      const result = validateFlankingElement(flankingElement as any, -1);
      expect(result.isValid).toBeFalsy();
      expect(result.errors.some(e => e.field === 'type')).toBeTruthy();
      expect(result.errors.some(e => e.field === 'couplingLength')).toBeTruthy();
    });

    it('validates mass requirements for solid construction flanking elements', () => {
      const flankingElement: any = {
        id: 'fl3',
        type: ElementType.Wall,
        Rw: 40,
        area: 5,
        massPerArea: 0, // invalid for Massivbau
        constructionType: ConstructionCategory.Massivbau,
      };
      
      const result = validateFlankingElement(flankingElement, 0); // zero coupling length
      expect(result.errors.some(e => e.field === 'couplingLength')).toBeTruthy();
      expect(result.errors.some(e => e.field === 'massPerArea')).toBeTruthy();
    });

    it('provides warnings for low mass in solid construction', () => {
      const lowMassElement = {
        id: 'fl4',
        type: ElementType.Wall,
        Rw: 45,
        area: 10,
        massPerArea: 40, // below 50 kg/m² threshold
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;

      const result = validateFlankingElement(lowMassElement, 2.5);
      expect(result.warnings.some(w => w.field === 'massPerArea')).toBeTruthy();
    });

    it('validates all required fields for flanking elements', () => {
      const incompleteElement: any = {
        id: 'fl5',
        // missing multiple required fields
        Rw: 0, // invalid
        area: -5, // invalid
        // missing constructionType and type
      };

      const result = validateFlankingElement(incompleteElement, undefined);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
      expect(result.errors.some(e => e.field === 'type')).toBeTruthy();
      expect(result.errors.some(e => e.field === 'constructionType')).toBeTruthy();
      expect(result.errors.some(e => e.field === 'Rw')).toBeTruthy();
      expect(result.errors.some(e => e.field === 'area')).toBeTruthy();
    });
  });

  describe('Building Configuration Validation', () => {
    it('requires at least one flanking element', () => {
      const separating = {
        id: 's1',
        type: ElementType.Floor,
        Rw: 55,
        massPerArea: 420,
        area: 12,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;
      
      const result = validateBuildingConfiguration({
        separatingElement: separating,
        flankingElements: [],
      });
      
      expect(result.isValid).toBeFalsy();
      expect(result.errors.find(e => e.field === 'flankingElements')).toBeDefined();
    });

    it('aggregates errors and warnings from separating and flanking elements', () => {
      const separating: any = {
        id: 's2',
        type: ElementType.Wall,
        Rw: 55,
        area: 10,
        massPerArea: 200,
        constructionType: ConstructionCategory.Massivbau,
      };

      const result = validateBuildingConfiguration({
        separatingElement: separating as any,
        flankingElements: [],
      });
      
      expect(result.isValid).toBeFalsy();
      expect(result.errors.some(e => e.field === 'flankingElements')).toBeTruthy();
    });

    it('validates coupling lengths and propagates flanking element errors with indices', () => {
      const separating: any = {
        id: 's3',
        type: ElementType.Wall,
        Rw: 50,
        area: 10,
        massPerArea: 200,
        constructionType: ConstructionCategory.Massivbau,
      };
      
      const flankingElements = [{
        id: 'f0',
        type: ElementType.Wall,
        Rw: 40,
        area: 5,
        massPerArea: 100,
        constructionType: ConstructionCategory.Massivbau,
        material: { type: 'concrete' as any, surfaceMass: 100 },
      }];
      
      const result = validateBuildingConfiguration({
        separatingElement: separating,
        flankingElements: flankingElements as any,
        couplingLengths: [0], // zero coupling length should cause error
      });
      
      // because couplingLengths[0] === 0, flanking element will have couplingLength error propagated
      expect(result.errors.some(e => e.field.startsWith('flanking[0]'))).toBeTruthy();
    });

    it('warns about too many flanking elements', () => {
      const separating = {
        id: 's4',
        type: ElementType.Wall,
        Rw: 55,
        area: 10,
        massPerArea: 200,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;
      
      // Create 5 flanking elements (more than 4)
      const manyFlankingElements = Array.from({ length: 5 }, (_, i) => ({
        id: `f${i}`,
        type: ElementType.Wall,
        Rw: 45,
        area: 5,
        massPerArea: 100,
        constructionType: ConstructionCategory.Massivbau,
        material: 'concrete',
        couplingLength: 1,
      }));

      const result = validateBuildingConfiguration({
        separatingElement: separating,
        flankingElements: manyFlankingElements as any,
      });
      
      expect(result.warnings.length).toBeGreaterThanOrEqual(1);
      expect(result.warnings.some(w => w.field === 'flankingElements')).toBeTruthy();
    });

    it('handles mixed element types with proper validation routing', () => {
      const floorSeparating = {
        id: 's5',
        type: ElementType.Floor,
        Rw: 50,
        area: 16,
        massPerArea: 300,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;

      const result = validateBuildingConfiguration({
        separatingElement: floorSeparating,
        flankingElements: [],
        acousticParams: { lnw: 70 } as any,
      });

      // Should route to floor validation and still require flanking elements
      expect(result.errors.some(e => e.field === 'flankingElements')).toBeTruthy();
    });
  });

  describe('BuildingElementValidator Class', () => {
    const validator = new BuildingElementValidator();

    it('validates building elements based on their type', () => {
      const floorElement = {
        id: 'test-floor',
        type: ElementType.Floor,
        Rw: 55,
        massPerArea: 420,
        area: 12,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;
      
      const result = validator.validate(floorElement, { lnw: 75 } as any);
      expect(validator.hasCriticalErrors(result)).toBe(false);
      expect(validator.getErrorMessage(result)).toBe('');
    });

    it('detects critical errors and formats error messages', () => {
      const invalidElement: any = {
        id: 'invalid',
        type: ElementType.Wall,
        Rw: 0, // invalid
        area: 5,
        massPerArea: 50,
        constructionType: ConstructionCategory.Leichtbau,
      };

      const result = validator.validate(invalidElement as any);
      expect(validator.hasCriticalErrors(result)).toBeTruthy();
      
      const errorMessage = validator.getErrorMessage(result);
      expect(typeof errorMessage).toBe('string');
      expect(errorMessage.length).toBeGreaterThan(0);
    });

    it('formats warning messages correctly', () => {
      const warningElement = {
        id: 'warning-wall',
        type: ElementType.Wall,
        Rw: 85, // high value - should trigger warning
        area: 10,
        massPerArea: 1200, // very high - should trigger warning
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;

      const result = validator.validate(warningElement);
      const warningMessage = validator.getWarningMessage(result);
      expect(typeof warningMessage).toBe('string');
    });

    it('validates complete building configurations through validateBuilding method', () => {
      const separating = {
        id: 'building-sep',
        type: ElementType.Wall,
        Rw: 55,
        area: 12,
        massPerArea: 300,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;

      const flanking = [{
        id: 'building-flank',
        type: ElementType.Wall,
        Rw: 45,
        area: 8,
        massPerArea: 200,
        constructionType: ConstructionCategory.Massivbau,
      }] as BuildingElement[];

      const result = validator.validateBuilding({
        separatingElement: separating,
        flankingElements: flanking,
        couplingLengths: [2.5],
      });

      expect(result.isValid).toBeTruthy();
      expect(validator.hasCriticalErrors(result)).toBeFalsy();
    });

    it('handles edge cases with missing or null elements', () => {
      const nullElement: any = null;
      expect(() => validator.validate(nullElement)).toThrow();
    });

    it('provides comprehensive error information for complex validation failures', () => {
      const complexInvalidElement: any = {
        id: 'complex-invalid',
        // type missing
        Rw: -10, // negative
        area: 0, // zero
        massPerArea: -5, // negative
        constructionType: ConstructionCategory.Massivbau,
      };

      const result = validator.validate(complexInvalidElement);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
      expect(validator.hasCriticalErrors(result)).toBeTruthy();
      
      const errorMessage = validator.getErrorMessage(result);
      expect(errorMessage).toContain('Rw');
      expect(errorMessage).toContain('area');
    });

    it('validates flanking elements with coupling length through generic validate method', () => {
      const flankingElement = {
        id: 'generic-flanking',
        type: ElementType.Wall,
        Rw: 45,
        area: 8,
        massPerArea: 150,
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;

      const result = validator.validate(flankingElement, undefined, 2.0);
      expect(result.isValid).toBeTruthy();
    });
  });

  describe('Edge Cases and Advanced Scenarios', () => {
    it('handles boundary values for acoustic parameters', () => {
      const boundaryFloor = {
        id: 'boundary',
        type: ElementType.Floor,
        Rw: 25, // below 30 dB threshold to trigger warning
        area: 1, // very small but valid
        massPerArea: 50, // minimum for solid
        constructionType: ConstructionCategory.Massivbau,
      } as BuildingElement;

      const result = validateSeparatingFloor(boundaryFloor, { lnw: 100 } as any);
      // Should have warnings but no errors
      expect(result.isValid).toBeTruthy();
      expect(result.warnings.length).toBeGreaterThanOrEqual(1);
    });

    it('validates complex building configurations with multiple error sources', () => {
      const problematicSeparating: any = {
        id: 'problematic',
        type: ElementType.Wall,
        Rw: 0, // invalid
        area: -1, // invalid
        massPerArea: 0, // invalid for Massivbau
        constructionType: ConstructionCategory.Massivbau,
      };

      const problematicFlanking: any = [{
        id: 'prob-flank',
        // missing type
        Rw: -5,
        area: 0,
        constructionType: ConstructionCategory.Massivbau,
      }];

      const result = validateBuildingConfiguration({
        separatingElement: problematicSeparating,
        flankingElements: problematicFlanking,
        couplingLengths: [-1], // negative coupling length
      });

      expect(result.isValid).toBeFalsy();
      expect(result.errors.length).toBeGreaterThanOrEqual(6); // Multiple sources of errors
    });

    it('validates construction type consistency and requirements', () => {
      const leichtbauWall = {
        id: 'leichtbau',
        type: ElementType.Wall,
        Rw: 45,
        area: 10,
        massPerArea: 25, // low mass for lightweight construction
        constructionType: ConstructionCategory.Leichtbau,
      } as BuildingElement;

      // Leichtbau doesn't require mass validation
      const result = validateSeparatingWall(leichtbauWall);
      expect(result.errors.some(e => e.field === 'massPerArea')).toBeFalsy();
    });
  });
});
