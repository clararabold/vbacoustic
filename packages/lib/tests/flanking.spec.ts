import { describe, it, expect } from 'vitest';
import {
  AirborneFlankingCalculator,
  VBAConstructionType,
  JunctionOffsetType,
  mapConstructionType,
} from '../src/calculations/flanking/AirborneFlankingCalculator';
import { AdvancedFlankingCalculator } from '../src/calculations/flanking/AdvancedFlankingCalculator';
import { ElementType, ConstructionCategory } from '../src/models/AcousticTypes';
import { MaterialType, ConstructionType } from '../src/models/AcousticTypes';
import { JunctionDirection, JunctionConnection } from '../src/models/AcousticTypes';

describe('Flanking Calculations - Comprehensive Tests', () => {
  describe('AirborneFlankingCalculator - Basic Tests', () => {
    const calc = new AirborneFlankingCalculator();

    it('calculates mass timber flanking paths', () => {
      const params = {
        separatingElementType: 'floor',
        separatingConstruction: VBAConstructionType.MHD,
        separatingRw: 48,
        separatingRsw: 42,
        separatingDRw_sender: 0,
        separatingDRw_receiver: 0,
        separatingArea: 20.25,
        separatingCouplingLength: 4.5,
        flankingTypeSender: VBAConstructionType.MHW,
        flankingTypeReceiver: VBAConstructionType.MHW,
        flankingRwSender: 44,
        flankingRwReceiver: 44,
        flankingDRwSender: 6,
        flankingDRwReceiver: 6,
        flankingDnfwSender: undefined,
        flankingCouplingLength: 4.5,
        kFf: 21,
        kDf: 14,
        kFd: 14,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params);
      expect(res.rFfw).toBeGreaterThan(0);
    });

    it('calculates lightweight flanking paths', () => {
      const params = {
        separatingElementType: 'floor',
        separatingConstruction: VBAConstructionType.SBD,
        separatingRw: 55,
        separatingRsw: 55,
        separatingDRw_sender: 0,
        separatingDRw_receiver: 0,
        separatingArea: 16,
        separatingCouplingLength: 4,
        flankingTypeSender: VBAConstructionType.HSTW,
        flankingTypeReceiver: VBAConstructionType.HSTW,
        flankingRwSender: 38,
        flankingRwReceiver: 38,
        flankingDRwSender: 6,
        flankingDRwReceiver: 6,
        flankingDnfwSender: 24,
        flankingCouplingLength: 4,
        kFf: 10,
        kDf: 10,
        kFd: 10,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params);
      expect(res.rFfw).toBeGreaterThanOrEqual(0);
    });

    it('mass timber floor path produces numeric Rijw values and combined flanking', () => {
      const params = {
        separatingElementType: 'floor' as any,
        separatingConstruction: VBAConstructionType.MHD,
        separatingRw: 60,
        separatingRsw: 58,
        separatingDRw_sender: 2,
        separatingDRw_receiver: 1,
        separatingArea: 40,
        separatingCouplingLength: 4,
        flankingTypeSender: VBAConstructionType.MHW,
        flankingTypeReceiver: VBAConstructionType.MHW,
        flankingRwSender: 55,
        flankingRwReceiver: 52,
        flankingDRwSender: 3,
        flankingDRwReceiver: 2,
        flankingDnfwSender: undefined,
        flankingCouplingLength: 2,
        kFf: 0,
        kDf: 0,
        kFd: 0,
        junctionOffset: undefined,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params as any);
      expect(typeof res.rFfw).toBe('number');
      expect(typeof res.rDfw).toBe('number');
      expect(typeof res.rFdw).toBe('number');

      const combined = calc.calculateCombinedFlanking([res, res]);
      expect(typeof combined).toBe('number');
    });

    it('lightweight floor branch returns lightweight rFfw and zero other paths', () => {
      const params = {
        separatingElementType: 'floor' as any,
        separatingConstruction: VBAConstructionType.MHD,
        separatingRw: 45,
        separatingRsw: 44,
        separatingDRw_sender: 0,
        separatingDRw_receiver: 0,
        separatingArea: 30,
        separatingCouplingLength: 3,
        flankingTypeSender: VBAConstructionType.HSTW,
        flankingTypeReceiver: VBAConstructionType.HSTW,
        flankingRwSender: 35,
        flankingRwReceiver: 34,
        flankingDRwSender: 0,
        flankingDRwReceiver: 0,
        flankingDnfwSender: 60,
        flankingCouplingLength: 3,
        kFf: 0,
        kDf: 0,
        kFd: 0,
        junctionOffset: undefined,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params as any);
      expect(res.rFfw).toBeGreaterThan(0);
      expect(res.rDfw).toBe(0);
      expect(res.rFdw).toBe(0);
    });
  });

  describe('AirborneFlankingCalculator - Wall Separating Elements', () => {
    const calc = new AirborneFlankingCalculator();

    it('wall separating element with junction offset adjusts paths', () => {
      const params = {
        separatingElementType: 'wall' as any,
        separatingConstruction: VBAConstructionType.MHW,
        separatingRw: 55,
        separatingRsw: 54,
        separatingDRw_sender: 1,
        separatingDRw_receiver: 1,
        separatingArea: 20,
        separatingCouplingLength: 2,
        flankingTypeSender: VBAConstructionType.MW,
        flankingTypeReceiver: VBAConstructionType.MW,
        flankingRwSender: 50,
        flankingRwReceiver: 48,
        flankingDRwSender: 1,
        flankingDRwReceiver: 1,
        flankingDnfwSender: undefined,
        flankingCouplingLength: 2,
        kFf: 0,
        kDf: 0,
        kFd: 0,
        junctionOffset: JunctionOffsetType.WAND_LINKS_AUSSEN,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params as any);
      expect(Number.isFinite(res.rFfw)).toBeTruthy();
      expect(Number.isFinite(res.rDfw)).toBeTruthy();
      expect(Number.isFinite(res.rFdw)).toBeTruthy();

      const analysis = calc.getPathAnalysis([res]);
      expect(analysis).toHaveProperty('ffTotal');
      expect(analysis).toHaveProperty('combinedTotal');
    });

    it('wall separating element lightweight without junctionOffset computes rFfw via dnfw branch', () => {
      const params = {
        separatingElementType: ElementType.Wall,
        separatingConstruction: VBAConstructionType.MW,
        separatingRw: 55,
        separatingRsw: 53,
        separatingDRw_sender: 2,
        separatingDRw_receiver: 1,
        separatingArea: 20,
        separatingCouplingLength: 2,
        flankingTypeSender: VBAConstructionType.HSTW,
        flankingTypeReceiver: VBAConstructionType.HSTW,
        flankingRwSender: 42,
        flankingRwReceiver: 44,
        flankingDRwSender: 1,
        flankingDRwReceiver: 1,
        flankingDnfwSender: 8,
        flankingCouplingLength: 2,
        kFf: 0,
        kDf: 0,
        kFd: 0,
        junctionOffset: undefined,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params);
      expect(res.rFfw).toBeGreaterThan(0);
      expect(res.rDfw).toBe(0);
      expect(res.rFdw).toBe(0);
    });

    it('wall solid flanking but separating not mass timber produces zeros for Df/Fd', () => {
      const params = {
        separatingElementType: ElementType.Wall,
        separatingConstruction: VBAConstructionType.MW,
        separatingRw: 58,
        separatingRsw: 56,
        separatingDRw_sender: 2,
        separatingDRw_receiver: 2,
        separatingArea: 30,
        separatingCouplingLength: 3,
        flankingTypeSender: VBAConstructionType.MW,
        flankingTypeReceiver: VBAConstructionType.MW,
        flankingRwSender: 50,
        flankingRwReceiver: 52,
        flankingDRwSender: 1,
        flankingDRwReceiver: 1,
        flankingDnfwSender: undefined,
        flankingCouplingLength: 2,
        kFf: 0,
        kDf: 1,
        kFd: 2,
        junctionOffset: undefined,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params);
      expect(res.rDfw).toBe(0);
      expect(res.rFdw).toBe(0);
    });
  });

  describe('AirborneFlankingCalculator - Floor Separating Elements', () => {
    const calc = new AirborneFlankingCalculator();

    it('floor separating element with lightweight flanking uses flankingDnfwSender branch', () => {
      const params = {
        separatingElementType: ElementType.Floor,
        separatingConstruction: VBAConstructionType.SBD,
        separatingRw: 50,
        separatingRsw: 48,
        separatingDRw_sender: 2,
        separatingDRw_receiver: 1,
        separatingArea: 25,
        separatingCouplingLength: 2,
        flankingTypeSender: VBAConstructionType.HSTW,
        flankingTypeReceiver: VBAConstructionType.HSTW,
        flankingRwSender: 40,
        flankingRwReceiver: 38,
        flankingDRwSender: 1,
        flankingDRwReceiver: 1,
        flankingDnfwSender: 12,
        flankingCouplingLength: 1,
        kFf: 0,
        kDf: 0,
        kFd: 0,
        junctionOffset: undefined,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params);
      expect(res.rFfw).toBeGreaterThan(0);
      expect(res.rDfw).toBe(0);
      expect(res.rFdw).toBe(0);
    });

    it('floor mass timber DIN4109 shortcut returns zeros', () => {
      const p = {
        separatingElementType: ElementType.Floor,
        separatingConstruction: VBAConstructionType.MHD,
        separatingRw: 60,
        separatingRsw: 58,
        separatingDRw_sender: 2,
        separatingDRw_receiver: 1,
        separatingArea: 40,
        separatingCouplingLength: 4,
        flankingTypeSender: VBAConstructionType.MHW,
        flankingTypeReceiver: VBAConstructionType.MHW,
        flankingRwSender: 55,
        flankingRwReceiver: 52,
        flankingDRwSender: 3,
        flankingDRwReceiver: 2,
        flankingDnfwSender: undefined,
        flankingCouplingLength: 2,
        kFf: 0,
        kDf: 0,
        kFd: 0,
        junctionOffset: undefined,
        isDIN4109: true,
      } as any;

      const res = calc.calculateFlankingTransmission(p);
      expect(res.rFfw).toBe(0);
      expect(res.rDfw).toBe(0);
      expect(res.rFdw).toBe(0);
    });
  });

  describe('AirborneFlankingCalculator - Junction Offset Tests', () => {
    const calc = new AirborneFlankingCalculator();

    it('junction offset permutations: outer/inner reassignments and checks', () => {
      const paramsOuter = {
        separatingElementType: ElementType.Wall,
        separatingConstruction: VBAConstructionType.MW,
        separatingRw: 55,
        separatingRsw: 53,
        separatingDRw_sender: 2,
        separatingDRw_receiver: 1,
        separatingArea: 30,
        separatingCouplingLength: 3,
        flankingTypeSender: VBAConstructionType.MW,
        flankingTypeReceiver: VBAConstructionType.MW,
        flankingRwSender: 45,
        flankingRwReceiver: 46,
        flankingDRwSender: 1,
        flankingDRwReceiver: 2,
        flankingDnfwSender: undefined,
        flankingCouplingLength: 2,
        kFf: 0,
        kDf: 0,
        kFd: 0,
        junctionOffset: JunctionOffsetType.WAND_LINKS_AUSSEN,
        isDIN4109: false,
      } as any;

      const resOuter = calc.calculateFlankingTransmission(paramsOuter);
      expect(resOuter.rFfw).toBe(resOuter.rFdw);
      expect(resOuter.rDfw).toBeGreaterThan(0);

      const paramsInner = { ...paramsOuter, junctionOffset: JunctionOffsetType.WAND_LINKS_INNEN } as any;
      const resInner = calc.calculateFlankingTransmission(paramsInner);
      expect(resInner.rFfw).toBe(resInner.rDfw);
      expect(resInner.rFdw).toBeGreaterThan(0);
    });

    it('additional edge branches: outer offset with MHW separating and reassignment checks', () => {
      const params = {
        separatingElementType: ElementType.Wall,
        separatingConstruction: VBAConstructionType.MHW,
        separatingRw: 58,
        separatingRsw: 56,
        separatingDRw_sender: 2,
        separatingDRw_receiver: 2,
        separatingArea: 30,
        separatingCouplingLength: 3,
        flankingTypeSender: VBAConstructionType.MHW,
        flankingTypeReceiver: VBAConstructionType.MHW,
        flankingRwSender: 50,
        flankingRwReceiver: 52,
        flankingDRwSender: 1,
        flankingDRwReceiver: 1,
        flankingDnfwSender: undefined,
        flankingCouplingLength: 2,
        kFf: 0,
        kDf: 1,
        kFd: 2,
        junctionOffset: JunctionOffsetType.WAND_RECHTS_AUSSEN,
        isDIN4109: false,
      } as any;

      const res = calc.calculateFlankingTransmission(params);
      expect(res.rDfw).toBeGreaterThan(0);
      expect(res.rFfw === res.rFdw || Number.isFinite(res.rFfw)).toBeTruthy();
    });
  });

  describe('AirborneFlankingCalculator - Utility Functions', () => {
    const calc = new AirborneFlankingCalculator();

    it('mapConstructionType maps combinations correctly for floor and wall', () => {
      expect(mapConstructionType(ConstructionCategory.Massivbau, ElementType.Floor)).toBe(VBAConstructionType.SBD);
      expect(mapConstructionType(ConstructionCategory.Massivholzbau, ElementType.Floor)).toBe(VBAConstructionType.MHD);
      expect(mapConstructionType(ConstructionCategory.Leichtbau, ElementType.Wall)).toBe(VBAConstructionType.HSTW);
    });

    it('mapConstructionType maps categories to VBAConstructionType', () => {
      const mapped = mapConstructionType(ConstructionCategory.Massivbau, ElementType.Wall);
      expect(typeof mapped).toBe('string');
    });

    it('airborne flanking combined helper behaviors for empty/zero arrays and analysis', () => {
      const zeroArr = [{ rFfw: 0, rDfw: 0, rFdw: 0 }];
      expect(calc.calculateCombinedFlanking(zeroArr as any)).toBe(0);
      expect(calc.calculateCombinedFlanking([] as any)).toBe(0);

      const arr = [
        { rFfw: 50, rDfw: 0, rFdw: 60 },
        { rFfw: 0, rDfw: 55, rFdw: 0 },
        { rFfw: 0, rDfw: 0, rFdw: 0 },
      ];
      const combined = calc.calculateCombinedFlanking(arr as any);
      expect(typeof combined).toBe('number');
      expect(combined).toBeGreaterThan(0);

      const analysis = calc.getPathAnalysis(arr as any);
      expect(typeof analysis.ffTotal).toBe('number');
      expect(typeof analysis.dfTotal).toBe('number');
      expect(typeof analysis.fdTotal).toBe('number');
      expect(typeof analysis.combinedTotal).toBe('number');
    });
  });

  describe('AdvancedFlankingCalculator', () => {
    it('calculates all paths and aggregates', () => {
      const calc = new AdvancedFlankingCalculator();
      const separating = { id: 'sep1', type: ElementType.Floor, area: 16, length: 4, Rw: 54, massPerArea: 300, constructionType: ConstructionCategory.Massivbau, material: { type: MaterialType.Concrete, surfaceMass: 300, constructionType: ConstructionType.Solid } } as any;
      const flanking = [{ element: { id: 'fl1', type: ElementType.Wall, area: 12, length: 3, Rw: 46, massPerArea: 200, constructionType: ConstructionCategory.Massivbau, material: { type: MaterialType.Masonry, surfaceMass: 200, constructionType: ConstructionType.Solid } }, junctions: [{ type: 't_joint' as any, direction: JunctionDirection.Vertical, connection: JunctionConnection.Continuous }] }];

      const res = calc.calculateAllPaths({ separatingElement: separating, flankingElements: flanking });
      expect(res.airborne.Ff_paths.length).toBe(1);
      expect(res.airborne.total_flanking).toBeDefined();
    });
  });
});
