import { describe, it, expect } from 'vitest';
import { AcousticCalculator, VBACalculationParameters } from '../src/calculations/AcousticCalculator';
import { VBAConstructionType } from '../src/calculations/flanking/AirborneFlankingCalculator';
import {
  ConstructionType,
  ElementType,
  RoomConfiguration,
  AcousticStandard,
  ScreedType,
  CladdingType
} from '../src/models/AcousticTypes';

describe('Comprehensive example scenarios (from examples/comprehensive-test.ts)', () => {
  it('Mass timber floor (MHD) calculation', async () => {
    const calculator = new AcousticCalculator();
    const params: VBACalculationParameters = {
      configuration: {
        constructionType: ConstructionType.MassTimber,
        elementType: ElementType.Floor,
        roomConfiguration: RoomConfiguration.WithoutOffset,
        standard: AcousticStandard.ISO12354
      },
      separating: {
        elementType: VBAConstructionType.MHD,
        rw: 48,
        rsw: 42,
        lnw: 68,
        elementMass: 78,
        screedType: ScreedType.CementOnMineralFiber,
        area: 20.25,
        length1: 4.5,
        length2: 4.5,
        drEstrich: 23,
        dlUnterdecke: 15
      },
      flanking: [
        {
          flankingTypeSender: VBAConstructionType.MHW,
          flankingTypeReceiver: VBAConstructionType.MHW,
          claddingSender: CladdingType.FireResistantDouble,
          claddingReceiver: CladdingType.FireResistantDouble,
          couplingLength: 4.5,
          rwSender: 44,
          rwReceiver: 44,
          drwSender: 8,
          drwReceiver: 8
        },
        {
          flankingTypeSender: VBAConstructionType.MHW,
          flankingTypeReceiver: VBAConstructionType.MHW,
          claddingSender: CladdingType.DoubleGypsum,
          claddingReceiver: CladdingType.DoubleGypsum,
          couplingLength: 4.5,
          rwSender: 44,
          rwReceiver: 44,
          drwSender: 6,
          drwReceiver: 6
        }
      ]
    };

    const results = await calculator.calculateBuilding(params);
    
    expect(results).toBeDefined();
    expect(typeof results).toBe('object');

    expect(results.separating).toBeDefined();
    expect(typeof results.separating).toBe('object');
    expect(results.separating.rw).toBe(48);
    expect(typeof results.separating.rw).toBe('number');
    expect(results.separating.lnw).toBe(68);
    expect(typeof results.separating.lnw).toBe('number');
    expect(results.separating.rsw).toBe(42);
    expect(typeof results.separating.rsw).toBe('number');

    expect(results.flanking).toBeDefined();
    expect(Array.isArray(results.flanking)).toBe(true);
    expect(results.flanking).toHaveLength(2);
    
    results.flanking.forEach((flankingPath, index) => {
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
      
      expect(flankingPath.lnDFfw).toBeDefined();
      expect(typeof flankingPath.lnDFfw).toBe('number');
      expect(Number.isFinite(flankingPath.lnDFfw)).toBe(true);
      
      expect(flankingPath.k1).toBeDefined();
      expect(typeof flankingPath.k1).toBe('number');
      expect(Number.isFinite(flankingPath.k1)).toBe(true);
      
      expect(flankingPath.k2).toBeDefined();
      expect(typeof flankingPath.k2).toBe('number');
      expect(Number.isFinite(flankingPath.k2)).toBe(true);
    });

    expect(results.combined).toBeDefined();
    expect(typeof results.combined).toBe('object');
    expect(typeof results.combined.rPrimew).toBe('number');
    expect(Number.isFinite(results.combined.rPrimew)).toBe(true);
    expect(results.combined.rPrimew).toBeLessThanOrEqual(48);
    expect(results.combined.rPrimew).toBeGreaterThan(0);
    
    expect(results.combined.lnPrimew).toBeDefined(); // ISO12354 calculates impact sound for floors
    expect(typeof results.combined.lnPrimew).toBe('number');
    expect(Number.isFinite(results.combined.lnPrimew!)).toBe(true);
    expect(results.combined.lnPrimew!).toBeGreaterThan(0);

    expect(results.validationErrors).toBeDefined();
    expect(Array.isArray(results.validationErrors)).toBe(true);
    results.validationErrors.forEach(error => {
      expect(error).toBeDefined();
      expect(typeof error.field).toBe('string');
      expect(error.field).not.toBe('');
      expect(typeof error.message).toBe('string');
      expect(error.message).not.toBe('');
      expect(['error', 'warning']).toContain(error.severity);
    });

    expect(results.timestamp).toBeDefined();
    expect(results.timestamp).toBeInstanceOf(Date);
    expect(results.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    expect(results.timestamp.getTime()).toBeGreaterThan(Date.now() - 10000);
    
    expect(results.standard).toBeDefined();
    expect(results.standard).toBe(AcousticStandard.ISO12354);
    expect(typeof results.standard).toBe('string');
    expect(results.standard).not.toBe('');
  });

  it('Mass timber wall (MHW) calculation', async () => {
    const calculator = new AcousticCalculator();
    const params: VBACalculationParameters = {
      configuration: {
        constructionType: ConstructionType.MassTimber,
        elementType: ElementType.Wall,
        roomConfiguration: RoomConfiguration.WithoutOffset,
        standard: AcousticStandard.DIN4109
      },
      separating: {
        elementType: VBAConstructionType.MHW,
        rw: 42,
        elementMass: 95,
        area: 12.0,
        length1: 4.0,
        length2: 3.0,
        drSender: 8,
        drReceiver: 8
      },
      flanking: [
        {
          flankingTypeSender: VBAConstructionType.MHD,
          flankingTypeReceiver: VBAConstructionType.MHD,
          claddingSender: CladdingType.OSB,
          claddingReceiver: CladdingType.OSB,
          couplingLength: 4.0,
          rwSender: 46,
          rwReceiver: 46,
          drwSender: 3,
          drwReceiver: 3,
          dnfwSender: 22,
          dnfwReceiver: 22
        }
      ]
    };

    const results = await calculator.calculateBuilding(params);
    
    expect(results).toBeDefined();
    expect(typeof results).toBe('object');

    expect(results.separating).toBeDefined();
    expect(typeof results.separating).toBe('object');
    expect(results.separating.rw).toBe(42);
    expect(typeof results.separating.rw).toBe('number');
    expect(results.separating.lnw).toBeUndefined(); // Walls don't have impact sound
    expect(results.separating.rsw).toBeUndefined(); // Mass timber walls may not have rsw

    expect(results.flanking).toBeDefined();
    expect(Array.isArray(results.flanking)).toBe(true);
    expect(results.flanking).toHaveLength(1);
    
    const flankingPath = results.flanking[0];
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
    
    expect(flankingPath.lnDfw).toBeDefined(); // DIN4109 calculates impact sound values (may be 0)
    expect(typeof flankingPath.lnDfw).toBe('number');
    expect(Number.isFinite(flankingPath.lnDfw)).toBe(true);
    
    expect(flankingPath.lnDFfw).toBeDefined(); // DIN4109 calculates impact sound values (may be 0)
    expect(typeof flankingPath.lnDFfw).toBe('number');
    expect(Number.isFinite(flankingPath.lnDFfw)).toBe(true);
    
    expect(flankingPath.k1).toBeDefined(); // K factors are calculated
    expect(typeof flankingPath.k1).toBe('number');
    expect(Number.isFinite(flankingPath.k1)).toBe(true);
    
    expect(flankingPath.k2).toBeDefined(); // K factors are calculated
    expect(typeof flankingPath.k2).toBe('number');
    expect(Number.isFinite(flankingPath.k2)).toBe(true);

    expect(results.combined).toBeDefined();
    expect(typeof results.combined).toBe('object');
    expect(typeof results.combined.rPrimew).toBe('number');
    expect(Number.isFinite(results.combined.rPrimew)).toBe(true);
    expect(results.combined.rPrimew).toBeLessThanOrEqual(42);
    expect(results.combined.rPrimew).toBeGreaterThan(0);
    
    expect(results.combined.lnPrimew).toBeUndefined(); // DIN4109 doesn't calculate impact sound for walls

    expect(results.validationErrors).toBeDefined();
    expect(Array.isArray(results.validationErrors)).toBe(true);
    results.validationErrors.forEach(error => {
      expect(error).toBeDefined();
      expect(typeof error.field).toBe('string');
      expect(error.field).not.toBe('');
      expect(typeof error.message).toBe('string');
      expect(error.message).not.toBe('');
      expect(['error', 'warning']).toContain(error.severity);
    });

    expect(results.timestamp).toBeDefined();
    expect(results.timestamp).toBeInstanceOf(Date);
    expect(results.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    expect(results.timestamp.getTime()).toBeGreaterThan(Date.now() - 10000);
    
    expect(results.standard).toBeDefined();
    expect(results.standard).toBe(AcousticStandard.DIN4109);
    expect(typeof results.standard).toBe('string');
    expect(results.standard).not.toBe('');
  });

  it('Concrete floor (SBD) calculation', async () => {
    const calculator = new AcousticCalculator();
    const params: VBACalculationParameters = {
      configuration: {
        constructionType: ConstructionType.Solid,
        elementType: ElementType.Floor,
        roomConfiguration: RoomConfiguration.WithoutOffset,
        standard: AcousticStandard.DIN4109
      },
      separating: {
        elementType: VBAConstructionType.SBD,
        rw: 58,
        lnw: 78,
        elementMass: 480,
        screedType: ScreedType.CementOnMineralFiber,
        area: 16.0,
        length1: 4.0,
        length2: 4.0,
        drEstrich: 28,
        dlUnterdecke: 18
      },
      flanking: [
        {
          flankingTypeSender: VBAConstructionType.MW,
          flankingTypeReceiver: VBAConstructionType.MW,
          claddingSender: CladdingType.SingleGypsum,
          claddingReceiver: CladdingType.SingleGypsum,
          couplingLength: 4.0,
          rwSender: 52,
          rwReceiver: 52,
          drwSender: 2,
          drwReceiver: 2
        }
      ]
    };

    const results = await calculator.calculateBuilding(params);
    
    expect(results).toBeDefined();
    expect(typeof results).toBe('object');

    expect(results.separating).toBeDefined();
    expect(typeof results.separating).toBe('object');
    expect(results.separating.rw).toBe(58);
    expect(typeof results.separating.rw).toBe('number');
    expect(results.separating.lnw).toBe(78);
    expect(typeof results.separating.lnw).toBe('number');
    expect(results.separating.rsw).toBeUndefined(); // Concrete doesn't have rsw

    expect(results.flanking).toBeDefined();
    expect(Array.isArray(results.flanking)).toBe(true);
    expect(results.flanking).toHaveLength(1);
    
    const flankingPath = results.flanking[0];
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
    
    expect(flankingPath.lnDfw).toBeDefined(); // DIN4109 calculates impact sound values (may be 0)
    expect(typeof flankingPath.lnDfw).toBe('number');
    expect(Number.isFinite(flankingPath.lnDfw)).toBe(true);
    
    expect(flankingPath.lnDFfw).toBeDefined(); // DIN4109 calculates impact sound values (may be 0)
    expect(typeof flankingPath.lnDFfw).toBe('number');
    expect(Number.isFinite(flankingPath.lnDFfw)).toBe(true);
    
    expect(flankingPath.k1).toBeDefined(); // K factors are calculated
    expect(typeof flankingPath.k1).toBe('number');
    expect(Number.isFinite(flankingPath.k1)).toBe(true);
    
    expect(flankingPath.k2).toBeDefined(); // K factors are calculated
    expect(typeof flankingPath.k2).toBe('number');
    expect(Number.isFinite(flankingPath.k2)).toBe(true);

    expect(results.combined).toBeDefined();
    expect(typeof results.combined).toBe('object');
    expect(typeof results.combined.rPrimew).toBe('number');
    expect(Number.isFinite(results.combined.rPrimew)).toBe(true);
    expect(results.combined.rPrimew).toBeLessThanOrEqual(58);
    expect(results.combined.rPrimew).toBeGreaterThan(0);
    
    expect(results.combined.lnPrimew).toBeUndefined(); // DIN4109 doesn't calculate impact sound for floors

    expect(results.validationErrors).toBeDefined();
    expect(Array.isArray(results.validationErrors)).toBe(true);
    results.validationErrors.forEach(error => {
      expect(error).toBeDefined();
      expect(typeof error.field).toBe('string');
      expect(error.field).not.toBe('');
      expect(typeof error.message).toBe('string');
      expect(error.message).not.toBe('');
      expect(['error', 'warning']).toContain(error.severity);
    });

    expect(results.timestamp).toBeDefined();
    expect(results.timestamp).toBeInstanceOf(Date);
    expect(results.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    expect(results.timestamp.getTime()).toBeGreaterThan(Date.now() - 10000);
    
    expect(results.standard).toBeDefined();
    expect(results.standard).toBe(AcousticStandard.DIN4109);
    expect(typeof results.standard).toBe('string');
    expect(results.standard).not.toBe('');
  });

  it('Lightweight wall (HSTW) calculation', async () => {
    const calculator = new AcousticCalculator();
    const params: VBACalculationParameters = {
      configuration: {
        constructionType: ConstructionType.Lightweight,
        elementType: ElementType.Wall,
        roomConfiguration: RoomConfiguration.WithoutOffset,
        standard: AcousticStandard.Vibroakustik
      },
      separating: {
        elementType: VBAConstructionType.HSTW,
        rw: 38,
        elementMass: 45,
        area: 12.0,
        length1: 4.0,
        length2: 3.0,
        drSender: 12,
        drReceiver: 12
      },
      flanking: [
        {
          flankingTypeSender: VBAConstructionType.HBD,
          flankingTypeReceiver: VBAConstructionType.HBD,
          claddingSender: CladdingType.DoubleGypsum,
          claddingReceiver: CladdingType.DoubleGypsum,
          couplingLength: 4.0,
          rwSender: 40,
          rwReceiver: 40,
          drwSender: 8,
          drwReceiver: 8,
          dnfwSender: 26,
          dnfwReceiver: 26
        }
      ]
    };

    const results = await calculator.calculateBuilding(params);
    expect(results).toBeDefined();
    expect(results.separating.rw).toBe(38);
  });

  it('Mixed construction system calculation', async () => {
    const calculator = new AcousticCalculator();
    const params: VBACalculationParameters = {
      configuration: {
        constructionType: ConstructionType.MassTimber,
        elementType: ElementType.Floor,
        roomConfiguration: RoomConfiguration.WithoutOffset,
        standard: AcousticStandard.ISO12354
      },
      separating: {
        elementType: VBAConstructionType.MHD_HBV,
        rw: 54,
        rsw: 48,
        lnw: 65,
        elementMass: 350,
        screedType: ScreedType.DryScreed,
        area: 25.0,
        length1: 5.0,
        length2: 5.0,
        drEstrich: 16,
        dlUnterdecke: 12
      },
      flanking: [
        {
          flankingTypeSender: VBAConstructionType.MW,
          flankingTypeReceiver: VBAConstructionType.MHW,
          claddingSender: CladdingType.SingleGypsum,
          claddingReceiver: CladdingType.DoubleGypsum,
          couplingLength: 5.0,
          rwSender: 56,
          rwReceiver: 46,
          drwSender: 0,
          drwReceiver: 8
        },
        {
          flankingTypeSender: VBAConstructionType.HSTW,
          flankingTypeReceiver: VBAConstructionType.MW,
          claddingSender: CladdingType.FireResistantSingle,
          claddingReceiver: CladdingType.SingleGypsum,
          couplingLength: 3.5,
          rwSender: 41,
          rwReceiver: 54,
          drwSender: 10,
          drwReceiver: 3,
          dnfwSender: 27,
          dnfwReceiver: 0
        }
      ]
    };

    const results = await calculator.calculateBuilding(params);
    expect(results).toBeDefined();
    expect(results.flanking.length).toBe(2);
    expect(results.separating.rw).toBe(54);
  });

  it('Flanking-only scenario (empty flanking array)', async () => {
    const calculator = new AcousticCalculator();
    const params: VBACalculationParameters = {
      configuration: {
        constructionType: ConstructionType.Solid,
        elementType: ElementType.Floor,
        roomConfiguration: RoomConfiguration.WithoutOffset,
        standard: AcousticStandard.DIN4109
      },
      separating: {
        elementType: VBAConstructionType.SBD,
        rw: 55,
        lnw: 75,
        elementMass: 420,
        screedType: ScreedType.CementOnMineralFiber,
        area: 12.0,
        length1: 3.0,
        length2: 4.0,
        drEstrich: 20,
        dlUnterdecke: 10
      },
      flanking: []
    };

    const results = await calculator.calculateBuilding(params);
    expect(results).toBeDefined();
    expect(Array.isArray(results.flanking)).toBe(true);
    expect(results.flanking.length).toBe(0);
  });

  it('Many flanking paths stress test', async () => {
    const calculator = new AcousticCalculator();
    const flankingPaths = new Array(6).fill(0).map((_, i) => ({
      flankingTypeSender: VBAConstructionType.MW,
      flankingTypeReceiver: VBAConstructionType.MHW,
      claddingSender: CladdingType.SingleGypsum,
      claddingReceiver: CladdingType.DoubleGypsum,
      couplingLength: 4 + i * 0.5,
      rwSender: 50 - i,
      rwReceiver: 46,
      drwSender: 0 + i,
      drwReceiver: 4
    }));

    const params: VBACalculationParameters = {
      configuration: {
        constructionType: ConstructionType.Solid,
        elementType: ElementType.Floor,
        roomConfiguration: RoomConfiguration.WithoutOffset,
        standard: AcousticStandard.ISO12354
      },
      separating: {
        elementType: VBAConstructionType.MHD_HBV,
        rw: 54,
        lnw: 68,
        elementMass: 300,
        screedType: ScreedType.DryScreed,
        area: 25.0,
        length1: 5.0,
        length2: 5.0,
        drEstrich: 16,
        dlUnterdecke: 10
      },
      flanking: flankingPaths
    };

    const results = await calculator.calculateBuilding(params);
    expect(results).toBeDefined();
    expect(results.flanking.length).toBe(6);
  });
});
