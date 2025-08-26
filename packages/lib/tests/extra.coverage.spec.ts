import { describe, it, expect } from 'vitest';
import {
    K1K2Calculator,
    FloorConstructionType,
    WallCladdingType,
    ScreedConstructionType,
    calculateK2Factor
} from '../src/calculations/flanking/K1K2Calculator';
import { AirborneFlankingCalculator, VBAConstructionType, JunctionOffsetType } from '../src/calculations/flanking/AirborneFlankingCalculator';
import {
    calculateMassTimberJunctionAttenuation,
    MassTimberJunctionType,
    MassTimberStandard,
    TransmissionDirection
} from '../src/calculations/MassTimberCalculator';
import {
    validateBuildingConfiguration,
    validateSeparatingWall,
    validateFlankingElement,
    BuildingElementValidator
} from '../src/validation/BuildingElementValidator';
import { ElementType, ConstructionType } from '../src/models/AcousticTypes';

describe('Extra coverage tests - K1K2, AirborneFlanking, MassTimber, Validator', () => {
    const kcalc = new K1K2Calculator();
    const af = new AirborneFlankingCalculator();
    const validator = new BuildingElementValidator();

    it('K1K2 calculateK2 covers different rows and clamped columns', () => {
        // MHW/HWST rows (3,4,5)
        const vRow3 = kcalc.calculateK2(20, 5, WallCladdingType.MHW, ScreedConstructionType.ZE_WF); // row 3
        const vRow4 = kcalc.calculateK2(40, 6, WallCladdingType.MHW, ScreedConstructionType.ZE_MF); // row 4
        const vRow5 = kcalc.calculateK2(70, 4, WallCladdingType.MHW, ScreedConstructionType.TE);    // row 5
        expect(Number.isFinite(vRow3)).toBeTruthy();
        expect(Number.isFinite(vRow4)).toBeTruthy();
        expect(Number.isFinite(vRow5)).toBeTruthy();

        // HWST_GK/GF rows (0,1,2) and column clamping
        const lowCol = kcalc.calculateK2(5, 1, WallCladdingType.HWST_GK, ScreedConstructionType.ZE_WF); // likely col -> 0
        const midCol = kcalc.calculateK2(50, 0, WallCladdingType.GF, ScreedConstructionType.ZE_MF);    // mid column
        const highCol = kcalc.calculateK2(200, 20, WallCladdingType.GF, ScreedConstructionType.TE);    // clamped to max col
        expect(Number.isFinite(lowCol)).toBeTruthy();
        expect(Number.isFinite(midCol)).toBeTruthy();
        expect(Number.isFinite(highCol)).toBeTruthy();

        // functional wrapper equality
        const wrapper = calculateK2Factor(50, 5, WallCladdingType.GF, ScreedConstructionType.ZE_MF);
        expect(Number.isFinite(wrapper)).toBeTruthy();
    });

    it('AirborneFlanking handles DIN4109 shortcut and junction offsets', () => {
        // DIN4109 returns zeros for mass timber floor branch
        const dinParams = {
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
            isDIN4109: true
        };
        const dinRes = af.calculateFlankingTransmission(dinParams as any);
        expect(dinRes.rFfw).toBe(0);
        expect(dinRes.rDfw).toBe(0);
        expect(dinRes.rFdw).toBe(0);

        // Wall with junction offset INNEN and AUSSEN branches
        const paramsBase = {
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
            isDIN4109: false
        };

        const resInnen = af.calculateFlankingTransmission({ ...paramsBase, junctionOffset: JunctionOffsetType.WAND_LINKS_INNEN } as any);
        const resAussen = af.calculateFlankingTransmission({ ...paramsBase, junctionOffset: JunctionOffsetType.WAND_RECHTS_AUSSEN } as any);
        expect(Number.isFinite(resInnen.rFfw)).toBeTruthy();
        expect(Number.isFinite(resAussen.rFfw)).toBeTruthy();
    });

    it('MassTimber junction branches for various types and standards', () => {
        const tElasticBoth = calculateMassTimberJunctionAttenuation({
            junctionType: MassTimberJunctionType.T_JOINT_ELASTIC_BOTH,
            standard: MassTimberStandard.DIN4109_33,
            flankingPath: 'Ff' as any,
            transmissionDirection: TransmissionDirection.VERTICAL as any,
            flankingMass: 80,
            separatingMass: 320
        });
        expect(typeof tElasticBoth).toBe('number');

        const xElasticTop = calculateMassTimberJunctionAttenuation({
            junctionType: MassTimberJunctionType.X_JOINT_ELASTIC_TOP,
            standard: MassTimberStandard.DIN_EN_ISO12354,
            flankingPath: 'Fd' as any,
            transmissionDirection: TransmissionDirection.VERTICAL as any,
            flankingMass: 120,
            separatingMass: 240
        });
        expect(typeof xElasticTop).toBe('number');
    });

    it('Validator covers >4 flanking elements warning and Rw/mass warnings', () => {
        const separating: any = {
            id: 's1', type: ElementType.Wall, Rw: 90, area: 10, massPerArea: 1500, constructionType: ConstructionType.Solid, material: 'concrete', couplingLength: 0
        };
        const flanks = new Array(5).fill(0).map((_, i) => ({ id: 'f'+i, type: ElementType.Wall, Rw: 45, area: 5, massPerArea: 100, constructionType: ConstructionType.Solid, material: 'concrete', couplingLength: 1 }));
        const res = validateBuildingConfiguration({ separatingElement: separating, flankingElements: flanks as any });
        expect(res.warnings.length).toBeGreaterThanOrEqual(1);
        // individual validators
        const wallVal = validateSeparatingWall(separating);
        expect(wallVal.warnings.some(w => w.field === 'Rw' || w.field === 'massPerArea')).toBeTruthy();

        const badFlank: any = { id: 'flx', /* missing type */ Rw: 30, area: 0, massPerArea: 10, constructionType: ConstructionType.Solid, material: 'concrete' };
        const fval = validateFlankingElement(badFlank, 0);
        expect(fval.errors.some(e => e.field === 'type' || e.field === 'area' || e.field === 'couplingLength')).toBeTruthy();

        const be = validator.validate(separating);
        // Separating has warnings but no critical errors in this fixture
        expect(validator.hasCriticalErrors(be)).toBeFalsy();
        expect(typeof validator.getWarningMessage(be)).toBe('string');
    });
});
