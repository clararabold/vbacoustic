import { describe, it, expect, beforeEach } from 'vitest';
import { AcousticCalculator } from '../src/calculations/AcousticCalculator';
import { ConstructionType, ElementType, RoomConfiguration, AcousticStandard, ScreedType } from '../src/models/AcousticTypes';
import { VBAConstructionType } from '../src/calculations/flanking/AirborneFlankingCalculator';

describe('AcousticCalculator', () => {
  let calculator: AcousticCalculator;

  beforeEach(() => {
    calculator = new AcousticCalculator();
  });

  describe('Floor Calculations', () => {
    it('should calculate airborne sound insulation for concrete floor with realistic values', async () => {
      const params = {
        configuration: {
          constructionType: ConstructionType.Solid,
          elementType: ElementType.Floor,
          roomConfiguration: RoomConfiguration.WithoutOffset,
          standard: AcousticStandard.DIN4109
        },
        separating: {
          elementType: VBAConstructionType.SBD,  // Concrete floor
          rw: 55,                               // Realistic Rw value for concrete floor
          lnw: 75,                             // Realistic impact sound level
          elementMass: 420,                    // Typical concrete floor mass [kg/m²]
          screedType: ScreedType.CementOnMineralFiber,
          area: 16.0,                          // 4x4m room
          length1: 4.0,
          length2: 4.0,
          drEstrich: 20,                       // Screed improvement
          dlUnterdecke: 10                     // Ceiling improvement
        },
        flanking: []
      };

      const result = await calculator.calculateBuilding(params);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      expect(result.separating).toBeDefined();
      expect(typeof result.separating).toBe('object');
      expect(result.separating.rw).toBe(55);
      expect(typeof result.separating.rw).toBe('number');
      expect(result.separating.lnw).toBe(75);
      expect(typeof result.separating.lnw).toBe('number');
      expect(result.separating.rsw).toBeUndefined();

      expect(result.flanking).toBeDefined();
      expect(Array.isArray(result.flanking)).toBe(true);
      expect(result.flanking).toHaveLength(0);

      expect(result.combined).toBeDefined();
      expect(typeof result.combined).toBe('object');
      expect(result.combined.rPrimew).toBe(55);
      expect(typeof result.combined.rPrimew).toBe('number');
      expect(result.combined.lnPrimew).toBeUndefined(); // DIN4109 doesn't calculate impact sound for floors

      expect(result.validationErrors).toBeDefined();
      expect(Array.isArray(result.validationErrors)).toBe(true);

      expect(result.timestamp).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.standard).toBeDefined();
      expect(result.standard).toBe(AcousticStandard.DIN4109);
      expect(typeof result.standard).toBe('string');
    });

    it('should calculate complete floor with flanking elements', async () => {
      const params = {
        configuration: {
          constructionType: ConstructionType.Solid,
          elementType: ElementType.Floor,
          roomConfiguration: RoomConfiguration.WithoutOffset,
          standard: AcousticStandard.DIN4109  // Use supported standard
        },
        separating: {
          elementType: VBAConstructionType.SBD,
          rw: 58,
          lnw: 72,
          elementMass: 480,
          screedType: ScreedType.CementOnMineralFiber,
          area: 20.0,
          length1: 5.0,
          length2: 4.0
        },
        flanking: [
          {
            flankingTypeSender: VBAConstructionType.MW,   // Masonry wall sender
            flankingTypeReceiver: VBAConstructionType.MW, // Masonry wall receiver
            couplingLength: 5.0,
            rwSender: 52,
            rwReceiver: 52,
            drwSender: 0,
            drwReceiver: 0,
            kFf: 2,    // Lower junction correction for better performance
            kDf: 5,
            kFd: 5
          }
        ]
      };

      const result = await calculator.calculateBuilding(params);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      expect(result.separating).toBeDefined();
      expect(typeof result.separating).toBe('object');
      expect(result.separating.rw).toBe(58);
      expect(typeof result.separating.rw).toBe('number');
      expect(result.separating.lnw).toBe(72);
      expect(typeof result.separating.lnw).toBe('number');
      expect(result.separating.rsw).toBeUndefined();

      expect(result.flanking).toBeDefined();
      expect(Array.isArray(result.flanking)).toBe(true);
      expect(result.flanking).toHaveLength(1);
      
      const flankingPath = result.flanking[0];
      expect(flankingPath).toBeDefined();
      expect(typeof flankingPath).toBe('object');
      
      expect(typeof flankingPath.rFfw).toBe('number');
      expect(flankingPath.rFfw).toBeGreaterThan(0);
      expect(flankingPath.rFfw).toBeLessThan(100);
      
      expect(typeof flankingPath.rDfw).toBe('number');
      expect(flankingPath.rDfw).toBeGreaterThanOrEqual(0);
      
      expect(typeof flankingPath.rFdw).toBe('number');
      expect(flankingPath.rFdw).toBeGreaterThanOrEqual(0);
      
      expect(flankingPath.lnDfw).toBeDefined();
      expect(typeof flankingPath.lnDfw).toBe('number');
      expect(flankingPath.lnDfw).toBeGreaterThanOrEqual(0);
      
      expect(flankingPath.lnDFfw).toBeDefined();
      expect(typeof flankingPath.lnDFfw).toBe('number');
      expect(flankingPath.lnDFfw).toBeGreaterThanOrEqual(0);
      
      expect(flankingPath.k1).toBeDefined();
      expect(typeof flankingPath.k1).toBe('number');
      
      expect(flankingPath.k2).toBeDefined();
      expect(typeof flankingPath.k2).toBe('number');

      expect(result.combined).toBeDefined();
      expect(typeof result.combined).toBe('object');
      expect(typeof result.combined.rPrimew).toBe('number');
      expect(result.combined.rPrimew).toBeGreaterThanOrEqual(0);
      expect(result.combined.rPrimew).toBeLessThanOrEqual(58);
      
      expect(result.combined.lnPrimew).toBeUndefined(); // DIN4109 doesn't calculate impact sound for floors

      expect(result.validationErrors).toBeDefined();
      expect(Array.isArray(result.validationErrors)).toBe(true);
      result.validationErrors.forEach(error => {
        expect(error).toBeDefined();
        expect(typeof error).toBe('object');
        expect(typeof error.field).toBe('string');
        expect(typeof error.message).toBe('string');
        expect(['error', 'warning']).toContain(error.severity);
      });

      expect(result.timestamp).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.standard).toBeDefined();
      expect(result.standard).toBe(AcousticStandard.DIN4109);
      expect(typeof result.standard).toBe('string');
    });
  });

  describe('Wall Calculations', () => {
    it('should calculate airborne sound insulation for masonry wall', async () => {
      const params = {
        configuration: {
          constructionType: ConstructionType.Solid,
          elementType: ElementType.Wall,
          roomConfiguration: RoomConfiguration.WithoutOffset,
          standard: AcousticStandard.DIN4109
        },
        separating: {
          elementType: VBAConstructionType.MW,
          rw: 55,
          elementMass: 380,
          area: 12.0,
          length1: 4.0,
          length2: 3.0
        },
        flanking: [
          {
            flankingTypeSender: VBAConstructionType.SBD,
            flankingTypeReceiver: VBAConstructionType.SBD,
            couplingLength: 4.0,
            rwSender: 58,
            rwReceiver: 58,
            drwSender: 0,
            drwReceiver: 0,
            kFf: 6,
            kDf: 10,
            kFd: 10
          }
        ]
      };

      const result = await calculator.calculateBuilding(params);

      expect(result).toBeDefined();
      expect(result.separating.rw).toBe(55);
      expect(result.flanking).toHaveLength(1);

      expect(result.combined.rPrimew).toBeLessThan(55);
      expect(result.combined.rPrimew).toBeGreaterThan(40);
      
      expect(result.combined.lnPrimew).toBeUndefined();
    });
  });

  describe('Mass Timber Calculations', () => {
    it('should calculate mass timber floor with realistic parameters', async () => {
      const params = {
        configuration: {
          constructionType: ConstructionType.MassTimber,
          elementType: ElementType.Floor,
          roomConfiguration: RoomConfiguration.WithoutOffset,
          standard: AcousticStandard.DIN4109  // Use supported standard
        },
        separating: {
          elementType: VBAConstructionType.MHD,  // Mass timber floor
          rw: 48,
          rsw: 52,                              // R + spectrum adaptation term
          lnw: 78,
          elementMass: 180,                     // Typical mass timber floor
          area: 15.0,
          length1: 5.0,
          length2: 3.0
        },
        flanking: [
          {
            flankingTypeSender: VBAConstructionType.MHW,   // Mass timber wall
            flankingTypeReceiver: VBAConstructionType.MHW,
            couplingLength: 5.0,
            rwSender: 45,
            rwReceiver: 45,
            drwSender: 0,
            drwReceiver: 0,
            kFf: 12,  // Higher correction for timber-timber connection
            kDf: 15,
            kFd: 15
          }
        ]
      };

      const result = await calculator.calculateBuilding(params);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      expect(result.separating).toBeDefined();
      expect(typeof result.separating).toBe('object');
      expect(result.separating.rw).toBe(48);
      expect(typeof result.separating.rw).toBe('number');
      expect(result.separating.lnw).toBe(78);
      expect(typeof result.separating.lnw).toBe('number');
      expect(result.separating.rsw).toBe(52);
      expect(typeof result.separating.rsw).toBe('number');

      expect(result.flanking).toBeDefined();
      expect(Array.isArray(result.flanking)).toBe(true);
      expect(result.flanking).toHaveLength(1);
      
      const flankingPath = result.flanking[0];
      expect(flankingPath).toBeDefined();
      expect(typeof flankingPath).toBe('object');
      
      expect(typeof flankingPath.rFfw).toBe('number');
      expect(Number.isFinite(flankingPath.rFfw)).toBe(true);
      expect(flankingPath.rFfw).toBeGreaterThanOrEqual(0);
      
      expect(typeof flankingPath.rDfw).toBe('number');
      expect(Number.isFinite(flankingPath.rDfw)).toBe(true);
      expect(flankingPath.rDfw).toBeGreaterThanOrEqual(0);
      
      expect(typeof flankingPath.rFdw).toBe('number');
      expect(Number.isFinite(flankingPath.rFdw)).toBe(true);
      expect(flankingPath.rFdw).toBeGreaterThanOrEqual(0);
      
      expect(flankingPath.lnDfw).toBeDefined();
      expect(typeof flankingPath.lnDfw).toBe('number');
      expect(Number.isFinite(flankingPath.lnDfw)).toBe(true);
      expect(flankingPath.lnDfw).toBeGreaterThanOrEqual(0);
      
      expect(flankingPath.lnDFfw).toBeDefined();
      expect(typeof flankingPath.lnDFfw).toBe('number');
      expect(Number.isFinite(flankingPath.lnDFfw)).toBe(true);
      expect(flankingPath.lnDFfw).toBeGreaterThanOrEqual(0);
      
      expect(flankingPath.k1).toBeDefined();
      expect(typeof flankingPath.k1).toBe('number');
      expect(Number.isFinite(flankingPath.k1)).toBe(true);
      
      expect(flankingPath.k2).toBeDefined();
      expect(typeof flankingPath.k2).toBe('number');
      expect(Number.isFinite(flankingPath.k2)).toBe(true);

      expect(result.combined).toBeDefined();
      expect(typeof result.combined).toBe('object');
      expect(typeof result.combined.rPrimew).toBe('number');
      expect(Number.isFinite(result.combined.rPrimew)).toBe(true);
      expect(result.combined.rPrimew).toBeLessThanOrEqual(48);
      expect(result.combined.rPrimew).toBeGreaterThan(0);
      
      expect(result.combined.lnPrimew).toBeUndefined(); // DIN4109 doesn't calculate impact sound for floors

      expect(result.validationErrors).toBeDefined();
      expect(Array.isArray(result.validationErrors)).toBe(true);
      result.validationErrors.forEach(error => {
        expect(error).toBeDefined();
        expect(typeof error.field).toBe('string');
        expect(error.field).not.toBe('');
        expect(typeof error.message).toBe('string');
        expect(error.message).not.toBe('');
        expect(['error', 'warning']).toContain(error.severity);
      });

      expect(result.timestamp).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(result.timestamp.getTime()).toBeGreaterThan(Date.now() - 10000);
      
      expect(result.standard).toBeDefined();
      expect(result.standard).toBe(AcousticStandard.DIN4109);
      expect(typeof result.standard).toBe('string');
      expect(result.standard).not.toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid input data gracefully', async () => {
      const invalidParams = {
        configuration: {
          constructionType: ConstructionType.Solid,
          elementType: ElementType.Floor,
          roomConfiguration: RoomConfiguration.WithoutOffset,
          standard: AcousticStandard.DIN4109
        },
        separating: {
          elementType: VBAConstructionType.SBD,
          rw: -10,  // Invalid negative Rw value
          area: 0,  // Invalid zero area
          length1: 0,
          length2: 0
        },
        flanking: []
      };

      await expect(calculator.calculateBuilding(invalidParams))
        .rejects.toThrow(/Data validation failed/);
    });
  });
});
