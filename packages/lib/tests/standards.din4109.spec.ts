import { describe, it, expect } from 'vitest';
import { DIN4109Standard } from '../src/standards/DIN4109Standard';
import { ElementType, BuildingClass, JunctionType, ConstructionTypeStandard } from '../src/standards/AcousticStandard';

describe('DIN4109Standard - focused tests', () => {
    const std = new DIN4109Standard();

    it('getLimits returns DIN4109 limits for separating wall and floor', () => {
        // Test wall limits for different building classes
        const wallLimitsStandard = std.getLimits(ElementType.SEPARATING_WALL, BuildingClass.STANDARD);
        expect(wallLimitsStandard.minRw).toBe(53); // DIN 4109 standard requirement
        expect(wallLimitsStandard.maxLnw).toBeNull(); // Walls don't have Lnw limits
        expect(typeof wallLimitsStandard.minRw).toBe('number');
        
        const wallLimitsHigh = std.getLimits(ElementType.SEPARATING_WALL, BuildingClass.HIGH);
        expect(wallLimitsHigh.minRw).toBe(67); // Higher requirement for high class
        expect(wallLimitsHigh.minRw).toBeGreaterThan(wallLimitsStandard.minRw);
        
        const wallLimitsIncreased = std.getLimits(ElementType.SEPARATING_WALL, BuildingClass.INCREASED);
        expect(wallLimitsIncreased.minRw).toBe(57); // Increased class requirement
        expect(wallLimitsIncreased.minRw).toBeGreaterThan(wallLimitsStandard.minRw);
        
        // Test floor limits for different building classes
        const floorLimitsStandard = std.getLimits(ElementType.SEPARATING_FLOOR, BuildingClass.STANDARD);
        expect(floorLimitsStandard.minRw).toBe(54); // DIN 4109 floor Rw requirement
        expect(floorLimitsStandard.maxLnw).toBe(53); // DIN 4109 floor L'n,w requirement
        expect(typeof floorLimitsStandard.maxLnw).toBe('number');
        
        const floorLimitsHigh = std.getLimits(ElementType.SEPARATING_FLOOR, BuildingClass.HIGH);
        expect(floorLimitsHigh.minRw).toBe(67);
        expect(floorLimitsHigh.maxLnw).toBe(37); // Stricter limit for high class
        expect(floorLimitsHigh.maxLnw).toBeLessThan(floorLimitsStandard.maxLnw!);
        
        const floorLimitsIncreased = std.getLimits(ElementType.SEPARATING_FLOOR, BuildingClass.INCREASED);
        expect(floorLimitsIncreased.minRw).toBe(57);
        expect(floorLimitsIncreased.maxLnw).toBe(46); // Between standard and high
        expect(floorLimitsIncreased.maxLnw).toBeLessThan(floorLimitsStandard.maxLnw!);
        
        // Test other element types
        const exteriorWallLimits = std.getLimits(ElementType.EXTERIOR_WALL, BuildingClass.STANDARD);
        expect(exteriorWallLimits.minRw).toBeGreaterThan(0);
        expect(typeof exteriorWallLimits.minRw).toBe('number');
    });

    it('validateResults reports wall and floor deviations', () => {
        // Test results that fail DIN4109 requirements
        const failingResults: any = {
            walls: [ 
                { name: 'Wall-1', buildingClass: BuildingClass.STANDARD, Rw: 40, elementType: ElementType.SEPARATING_WALL }, // Below DIN limit of 53
                { name: 'Wall-2', buildingClass: BuildingClass.HIGH, Rw: 50, elementType: ElementType.SEPARATING_WALL } // Below DIN high limit of 55
            ],
            floors: [ 
                { name: 'Floor-1', buildingClass: BuildingClass.STANDARD, Rw: 45, Lnw: 80, elementType: ElementType.SEPARATING_FLOOR }, // Rw too low, Lnw too high
                { name: 'Floor-2', buildingClass: BuildingClass.HIGH, Rw: 60, Lnw: 55, elementType: ElementType.SEPARATING_FLOOR } // Lnw too high for high class
            ]
        };

        const validation = std.validateResults(failingResults);
        expect(validation.isCompliant).toBe(false);
        expect(Array.isArray(validation.deviations)).toBe(true);
        expect(validation.deviations.length).toBeGreaterThanOrEqual(4); // Should have multiple deviations
        
        // Check that all deviations have proper structure
        validation.deviations.forEach(deviation => {
            expect(typeof deviation.parameter).toBe('string');
            expect(typeof deviation.actual).toBe('number');
            expect(typeof deviation.required).toBe('number');
            expect(typeof deviation.deviation).toBe('number');
            expect(['warning', 'error', 'critical']).toContain(deviation.severity);
        });
        
        // Verify specific deviation types are caught
        const parameters = validation.deviations.map(d => d.parameter);
        expect(parameters.some(p => p.includes('Wall Rw'))).toBe(true);
        expect(parameters.some(p => p.includes("L'n,w") || p.includes('Lnw'))).toBe(true);
        
        // Test compliant results
        const passingResults: any = {
            walls: [ 
                { name: 'Good-Wall-1', buildingClass: BuildingClass.STANDARD, Rw: 55, elementType: ElementType.SEPARATING_WALL },
                { name: 'Good-Wall-2', buildingClass: BuildingClass.HIGH, Rw: 70, elementType: ElementType.SEPARATING_WALL }
            ],
            floors: [ 
                { name: 'Good-Floor-1', buildingClass: BuildingClass.STANDARD, Rw: 56, Lnw: 50, elementType: ElementType.SEPARATING_FLOOR },
                { name: 'Good-Floor-2', buildingClass: BuildingClass.HIGH, Rw: 70, Lnw: 35, elementType: ElementType.SEPARATING_FLOOR }
            ]
        };

        const passingValidation = std.validateResults(passingResults);
        expect(passingValidation.isCompliant).toBe(true);
        expect(passingValidation.deviations.length).toBe(0);
        
        // Test mixed results
        const mixedResults: any = {
            walls: [ 
                { name: 'Good-Wall', buildingClass: BuildingClass.STANDARD, Rw: 55, elementType: ElementType.SEPARATING_WALL },
                { name: 'Bad-Wall', buildingClass: BuildingClass.STANDARD, Rw: 45, elementType: ElementType.SEPARATING_WALL }
            ],
            floors: [ 
                { name: 'Good-Floor', buildingClass: BuildingClass.STANDARD, Rw: 56, Lnw: 50, elementType: ElementType.SEPARATING_FLOOR }
            ]
        };

        const mixedValidation = std.validateResults(mixedResults);
        expect(mixedValidation.isCompliant).toBe(false);
        expect(mixedValidation.deviations.length).toBe(1); // Only one failing wall
        expect(mixedValidation.deviations[0].parameter).toContain('Wall'); // Should be wall-related deviation
    });

    it('applyStandardCorrections applies safety and field corrections', () => {
        const base = 60;
        
        // Test individual corrections
        const safetyOnly = std.applyStandardCorrections(base, { applySafetyMargin: true });
        expect(safetyOnly).toBe(base - 2); // DIN4109 safety margin is -2 dB
        expect(typeof safetyOnly).toBe('number');
        
        const fieldOnly = std.applyStandardCorrections(base, { fieldCorrection: true });
        expect(fieldOnly).toBe(base - 5); // DIN4109 field correction is -5 dB
        expect(typeof fieldOnly).toBe('number');
        
        // Test combined corrections
        const combined = std.applyStandardCorrections(base, { applySafetyMargin: true, fieldCorrection: true });
        expect(combined).toBe(base - 7); // -2 + -5 = -7 dB total
        
        // Test no corrections
        const unchanged = std.applyStandardCorrections(base, {});
        expect(unchanged).toBe(base);
        
        // Test with different base values
        const highBase = 80;
        const highWithSafety = std.applyStandardCorrections(highBase, { applySafetyMargin: true });
        expect(highWithSafety).toBe(78);
        
        const lowBase = 30;
        const lowWithField = std.applyStandardCorrections(lowBase, { fieldCorrection: true });
        expect(lowWithField).toBe(25);
        
        // Test edge cases
        const zeroBase = std.applyStandardCorrections(0, { applySafetyMargin: true, fieldCorrection: true });
        expect(zeroBase).toBe(-7);
        
        const negativeBase = std.applyStandardCorrections(-10, { applySafetyMargin: true });
        expect(negativeBase).toBe(-12);
        
        // Test very high values
        const veryHighBase = 100;
        const veryHighCorrected = std.applyStandardCorrections(veryHighBase, { fieldCorrection: true });
        expect(veryHighCorrected).toBe(95);
        
        // Test with additional correction options if available
        const withUncertainty = std.applyStandardCorrections(base, { uncertaintyCorrection: true });
        expect(typeof withUncertainty).toBe('number');
        expect(withUncertainty).toBeLessThanOrEqual(base); // Should not increase value
    });

    it('getJunctionAttenuation classifies based on masses', () => {
        // Test with light masses (< 150 kg/m²)
        const lightMasses = [50, 100];
        const attLight = std.getJunctionAttenuation(JunctionType.RIGID_RIGID as any, lightMasses);
        expect(typeof attLight).toBe('number');
        expect(attLight).toBeGreaterThanOrEqual(0);
        expect(attLight).toBeLessThanOrEqual(50); // Reasonable upper limit
        
        // Test with medium masses (150-300 kg/m²)
        const mediumMasses = [200, 250];
        const attMedium = std.getJunctionAttenuation(JunctionType.RIGID_RIGID as any, mediumMasses);
        expect(typeof attMedium).toBe('number');
        expect(attMedium).toBeGreaterThanOrEqual(0);
        expect(attMedium).toBeLessThanOrEqual(50);
        
        // Test with heavy masses (> 300 kg/m²)
        const heavyMasses = [400, 500];
        const attHeavy = std.getJunctionAttenuation(JunctionType.RIGID_RIGID as any, heavyMasses);
        expect(typeof attHeavy).toBe('number');
        expect(attHeavy).toBeGreaterThanOrEqual(0);
        expect(attHeavy).toBeLessThanOrEqual(12.2); // DIN4109 specific upper limit for heavy masses
        
        // Test different junction types
        const attLightweight = std.getJunctionAttenuation(JunctionType.LIGHTWEIGHT_LIGHTWEIGHT as any, mediumMasses);
        expect(typeof attLightweight).toBe('number');
        expect(attLightweight).toBeGreaterThanOrEqual(0);
        
        const attCross = std.getJunctionAttenuation(JunctionType.CROSS_RIGID as any, mediumMasses);
        expect(typeof attCross).toBe('number');
        expect(attCross).toBeGreaterThanOrEqual(0);
        
        // Test mass dependency relationships
        const veryLightMasses = [30, 40];
        const veryHeavyMasses = [800, 1000];
        
        const attVeryLight = std.getJunctionAttenuation(JunctionType.RIGID_RIGID as any, veryLightMasses);
        const attVeryHeavy = std.getJunctionAttenuation(JunctionType.RIGID_RIGID as any, veryHeavyMasses);
        
        expect(typeof attVeryLight).toBe('number');
        expect(typeof attVeryHeavy).toBe('number');
        
        // Verify reasonable ranges for all cases
        [attLight, attMedium, attHeavy, attLightweight, attCross, attVeryLight, attVeryHeavy].forEach(att => {
            expect(att).toBeGreaterThanOrEqual(0);
            expect(att).toBeLessThanOrEqual(50);
        });
        
        // Test asymmetric masses
        const asymmetricMasses = [100, 400];
        const attAsymmetric = std.getJunctionAttenuation(JunctionType.RIGID_RIGID as any, asymmetricMasses);
        expect(typeof attAsymmetric).toBe('number');
        expect(attAsymmetric).toBeGreaterThanOrEqual(0);
        
        // Test edge cases
        const minMasses = [1, 1];
        const attMin = std.getJunctionAttenuation(JunctionType.RIGID_RIGID as any, minMasses);
        expect(typeof attMin).toBe('number');
        expect(attMin).toBeGreaterThanOrEqual(0);
    });

    it('isConstructionSupported returns expected booleans', () => {
        // Test supported constructions for DIN4109 (traditional German construction types only)
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_BETON)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_ZIEGEL)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_KALKSANDSTEIN)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.HOLZBAU_MASSIV)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.HOLZBAU_RAHMEN)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.STAHLBAU_SANDWICH)).toBe(true);
        
        // Test unsupported constructions (all modern/international construction types)
        expect(std.isConstructionSupported(ConstructionTypeStandard.MIXED_CONSTRUCTION)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CONCRETE_MONOLITHIC)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CONCRETE_SANDWICH)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASONRY_SINGLE)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASONRY_DOUBLE)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.STEEL_FRAME)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CLT_SOLID)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CLT_CAVITY)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVE_TIMBER)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_CONCRETE_COMPOSITE)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.LIGHTWEIGHT_CONSTRUCTION)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME_LIGHT)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME_HEAVY)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.GLULAM_CONSTRUCTION)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_HYBRID)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_MASSIVE)).toBe(false);
        
        // Verify all return values are boolean
        Object.values(ConstructionTypeStandard).forEach(constructionType => {
            const result = std.isConstructionSupported(constructionType);
            expect(typeof result).toBe('boolean');
        });
    });
});
