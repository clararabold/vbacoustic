import { describe, it, expect, beforeEach } from 'vitest';
import { WallElementCalculator, BuildingAcousticCalculator } from '../src/calculations/BuildingAcousticCalculator';
import { ElementType, MaterialType, ConstructionType, FlankingPathType } from '../src/models/AcousticTypes';

describe('BuildingAcousticCalculator and WallElementCalculator', () => {
  let wallCalculator: WallElementCalculator;
  let buildingCalculator: BuildingAcousticCalculator;

  beforeEach(() => {
    wallCalculator = new WallElementCalculator();
    buildingCalculator = new BuildingAcousticCalculator();
  });

  describe('WallElementCalculator', () => {
    it('should calculate wall performance with realistic concrete wall and masonry flanking', () => {
      const separatingWall = {
        id: 'concrete_wall_01',
        type: ElementType.Wall,
        material: { 
          type: MaterialType.Concrete, 
          surfaceMass: 350, 
          constructionType: ConstructionType.Solid 
        },
        area: 15,                    // 3m x 5m wall
        Rw: 58,                     // Realistic Rw for 350 kg/m² concrete wall
        massPerArea: 350,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: 58 }
      };

      const flankingResults = [
        { 
          path: FlankingPathType.Ff, 
          transmissionValue: 52,      // Realistic flanking transmission
          isActive: true 
        },
        { 
          path: FlankingPathType.Df, 
          transmissionValue: 48,      // Another flanking path
          isActive: true 
        }
      ];

      const flankingElement = {
        id: 'masonry_flanking',
        type: ElementType.Floor,
        material: { 
          type: MaterialType.Masonry, 
          surfaceMass: 280, 
          constructionType: ConstructionType.Solid 
        },
        area: 15,                   // Same area as separating wall
        Rw: 54,                     // Masonry wall Rw
        massPerArea: 280,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: 54 }
      };

      const result = wallCalculator.calculateWallPerformance({ 
        separatingWall, 
        flankingElements: [flankingElement], 
        flankingResults 
      });

      // Test complete result structure
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      // Test separating element - ALL parameters
      expect(result.separating).toBeDefined();
      expect(typeof result.separating).toBe('object');
      expect(result.separating.rw).toBe(58);
      expect(typeof result.separating.rw).toBe('number');
      expect(result.separating.c50).toBeUndefined(); // Not provided in input
      expect(result.separating.ctr50).toBeUndefined(); // Not provided in input

      // Test combined results - ALL parameters
      expect(result.combined).toBeDefined();
      expect(typeof result.combined).toBe('object');
      expect(typeof result.combined.rw).toBe('number');
      expect(result.combined.rw).toBeLessThan(58);
      expect(result.combined.rw).toBeGreaterThan(40); // Reasonable lower bound
      expect(Number.isFinite(result.combined.rw)).toBe(true);
      expect(result.combined.c50).toBeUndefined(); // Not calculated
      expect(result.combined.ctr50).toBeUndefined(); // Not calculated

      // Test flanking results - ALL parameters
      expect(result.flanking).toBeDefined();
      expect(Array.isArray(result.flanking)).toBe(true);
      expect(result.flanking).toHaveLength(2);
      
      result.flanking.forEach((flankingPath, index) => {
        expect(flankingPath).toBeDefined();
        expect(typeof flankingPath).toBe('object');
        expect(typeof flankingPath.transmissionValue).toBe('number');
        expect(flankingPath.transmissionValue).toBeGreaterThan(0);
        expect(typeof flankingPath.isActive).toBe('boolean');
        expect(flankingPath.isActive).toBe(true);
        expect(Object.values(FlankingPathType)).toContain(flankingPath.path);
      });

      // Test timestamp
      expect(result.timestamp).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(result.timestamp.getTime()).toBeGreaterThan(Date.now() - 10000);

      expect(result.validationErrors).toBeDefined();
      expect(Array.isArray(result.validationErrors)).toBe(true);
      result.validationErrors!.forEach(error => {
        expect(error).toBeDefined();
        expect(typeof error.field).toBe('string');
        expect(error.field).not.toBe('');
        expect(typeof error.message).toBe('string');
        expect(error.message).not.toBe('');
        expect(['error', 'warning']).toContain(error.severity);
      });
    });

    it('should handle diagonal room configuration correctly', () => {
      const separatingWall = {
        id: 'diagonal_wall',
        type: ElementType.Wall,
        material: { 
          type: MaterialType.Masonry, 
          surfaceMass: 240, 
          constructionType: ConstructionType.Solid 
        },
        area: 12,
        Rw: 50,
        massPerArea: 240,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: 50 }
      };

      const flankingElement = {
        id: 'diagonal_flanking',
        type: ElementType.Floor,
        material: { 
          type: MaterialType.Masonry, 
          surfaceMass: 200, 
          constructionType: ConstructionType.Solid 
        },
        area: 12,
        Rw: 48,
        massPerArea: 200,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: 48 }
      };

      const flankingResults = [
        { 
          path: FlankingPathType.Ff, 
          transmissionValue: 45, 
          isActive: true 
        }
      ];

      const result = wallCalculator.calculateWallPerformance({ 
        separatingWall, 
        flankingElements: [flankingElement], 
        flankingResults,
        isDiagonal: true  // Diagonal configuration
      });

      expect(result).toBeDefined();
      expect(result.separating.rw).toBe(50);
      
      // For diagonal configuration, combined result equals the flanking transmission
      // since there's no direct transmission
      expect(result.combined.rw).toBeGreaterThanOrEqual(45);
      expect(result.combined.rw).toBeLessThan(60);
    });

    it('should handle walls with acoustic spectrum adaptation terms', () => {
      const separatingWall = {
        id: 'acoustic_wall',
        type: ElementType.Wall,
        material: { 
          type: MaterialType.LightweightConcrete, 
          surfaceMass: 200, 
          constructionType: ConstructionType.Solid 
        },
        area: 10,
        Rw: 48,
        massPerArea: 200,
        constructionType: ConstructionType.Solid,
        acousticParams: { 
          rw: 48,
          c50: -2,    // Spectrum adaptation term C50-3150
          ctr50: -8   // Spectrum adaptation term Ctr50-3150
        }
      };

      const flankingElement = {
        id: 'acoustic_flanking',
        type: ElementType.Floor,
        material: { 
          type: MaterialType.Concrete, 
          surfaceMass: 250, 
          constructionType: ConstructionType.Solid 
        },
        area: 10,
        Rw: 50,
        massPerArea: 250,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: 50 }
      };

      const result = wallCalculator.calculateWallPerformance({ 
        separatingWall, 
        flankingElements: [flankingElement]
      });

      // Test complete result structure
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      // Test separating element - ALL parameters including spectrum adaptation
      expect(result.separating).toBeDefined();
      expect(typeof result.separating).toBe('object');
      expect(result.separating.rw).toBe(48);
      expect(typeof result.separating.rw).toBe('number');
      expect(result.separating.c50).toBe(-2);
      expect(typeof result.separating.c50).toBe('number');
      expect(result.separating.ctr50).toBe(-8);
      expect(typeof result.separating.ctr50).toBe('number');
      expect(result.separating.lnw).toBeUndefined(); // Not applicable for walls
      
      // Test combined results - ALL parameters, spectrum adaptation should be preserved
      expect(result.combined).toBeDefined();
      expect(typeof result.combined).toBe('object');
      expect(typeof result.combined.rw).toBe('number');
      expect(result.combined.rw).toBeLessThanOrEqual(48);
      expect(result.combined.rw).toBeGreaterThan(0);
      expect(Number.isFinite(result.combined.rw)).toBe(true);
      expect(result.combined.c50).toBe(-2);
      expect(typeof result.combined.c50).toBe('number');
      expect(result.combined.ctr50).toBe(-8);
      expect(typeof result.combined.ctr50).toBe('number');
      expect(result.combined.lnw).toBeUndefined(); // Not applicable for walls

      // Test flanking results - structure validation
      expect(result.flanking).toBeDefined();
      expect(Array.isArray(result.flanking)).toBe(true);
      
      // Test timestamp with full validation
      expect(result.timestamp).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(typeof result.timestamp.getTime()).toBe('number');
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(result.timestamp.getTime()).toBeGreaterThan(Date.now() - 10000);

      expect(result.validationErrors).toBeDefined();
      expect(Array.isArray(result.validationErrors)).toBe(true);
      result.validationErrors!.forEach(error => {
        expect(error).toBeDefined();
        expect(typeof error).toBe('object');
        expect(typeof error.field).toBe('string');
        expect(error.field.length).toBeGreaterThan(0);
        expect(typeof error.message).toBe('string');
        expect(error.message.length).toBeGreaterThan(0);
        expect(['error', 'warning']).toContain(error.severity);
      });
    });
  });

  describe('BuildingAcousticCalculator', () => {
    it('should throw error when no flanking elements provided', () => {
      const separating = {
        id: 'wall_no_flanking',
        type: ElementType.Wall,
        material: { 
          type: MaterialType.Masonry, 
          surfaceMass: 250, 
          constructionType: ConstructionType.Solid 
        },
        area: 10,
        Rw: 50,
        massPerArea: 250,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: 50 }
      };

      expect(() => buildingCalculator.calculate({ 
        separatingElement: separating, 
        flankingElements: [] 
      })).toThrow(/Validation failed/);
    });

    it('should calculate combined acoustic performance for mass timber construction', () => {
      const separating = {
        id: 'mass_timber_wall',
        type: ElementType.Wall,
        material: { 
          type: MaterialType.MassTimber, 
          surfaceMass: 140, 
          constructionType: ConstructionType.MassTimber 
        },
        area: 18,                   // 3m x 6m wall
        Rw: 45,                     // Typical mass timber wall
        massPerArea: 140,
        constructionType: ConstructionType.MassTimber,
        acousticParams: { rw: 45 }
      };

      const flankingElement = {
        id: 'mass_timber_floor',
        type: ElementType.Floor,
        material: { 
          type: MaterialType.MassTimber, 
          surfaceMass: 160, 
          constructionType: ConstructionType.MassTimber 
        },
        area: 25,                   // Floor area
        Rw: 42,                     // Mass timber floor Rw
        massPerArea: 160,
        constructionType: ConstructionType.MassTimber,
        acousticParams: { rw: 42, lnw: 78 }  // Include impact sound for floor
      };

      const result = buildingCalculator.calculate({ 
        separatingElement: separating, 
        flankingElements: [flankingElement] 
      });

      expect(result).toBeDefined();
      expect(result.separating.rw).toBe(45);
      expect(result.combined.rw).toBeLessThanOrEqual(45);
      expect(result.combined.rw).toBeGreaterThan(30);
      expect(result.validationErrors).toBeDefined();
      expect(Array.isArray(result.validationErrors)).toBe(true);
    });

    it('should handle lightweight construction with realistic performance', () => {
      const separating = {
        id: 'lightweight_wall',
        type: ElementType.Wall,
        material: { 
          type: MaterialType.TimberFrame, 
          surfaceMass: 65, 
          constructionType: ConstructionType.Lightweight 
        },
        area: 20,
        Rw: 52,                     // Lightweight wall with good insulation
        massPerArea: 65,
        constructionType: ConstructionType.Lightweight,
        acousticParams: { rw: 52 }
      };

      const flankingElement = {
        id: 'concrete_floor',
        type: ElementType.Floor,
        material: { 
          type: MaterialType.Concrete, 
          surfaceMass: 400, 
          constructionType: ConstructionType.Solid 
        },
        area: 25,
        Rw: 60,                     // Heavy concrete floor
        massPerArea: 400,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: 60, lnw: 68 }
      };

      const result = buildingCalculator.calculate({ 
        separatingElement: separating, 
        flankingElements: [flankingElement] 
      });

      expect(result).toBeDefined();
      expect(result.separating.rw).toBe(52);
      expect(result.combined.rw).toBeLessThanOrEqual(52);
      expect(result.combined.rw).toBeGreaterThan(35);
      
      // Should have validation results
      expect(result.validationErrors).toBeDefined();
    });

    it('should handle invalid input data appropriately', () => {
      const invalidSeparating = {
        id: 'invalid_wall',
        type: ElementType.Wall,
        material: { 
          type: MaterialType.Concrete, 
          surfaceMass: -50,  // Invalid negative mass
          constructionType: ConstructionType.Solid 
        },
        area: 0,              // Invalid zero area
        Rw: -10,              // Invalid negative Rw
        massPerArea: -50,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: -10 }
      };

      const validFlanking = {
        id: 'valid_flanking',
        type: ElementType.Floor,
        material: { 
          type: MaterialType.Concrete, 
          surfaceMass: 300, 
          constructionType: ConstructionType.Solid 
        },
        area: 20,
        Rw: 55,
        massPerArea: 300,
        constructionType: ConstructionType.Solid,
        acousticParams: { rw: 55 }
      };

      expect(() => buildingCalculator.calculate({ 
        separatingElement: invalidSeparating, 
        flankingElements: [validFlanking] 
      })).toThrow(/Validation failed/);
    });
  });
});
