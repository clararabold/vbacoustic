import { describe, it, expect } from 'vitest';
import { ISO12354Standard } from '../src/standards/ISO12354Standard';
import { ElementType, JunctionType, ConstructionTypeStandard, BuildingClass } from '../src/standards/AcousticStandard';

describe('ISO12354Standard - focused tests', () => {
    const std = new ISO12354Standard();

    it('getLimits returns example limits and throws for unsupported element', () => {
        // Test supported elements with comprehensive validation
        const wallLimits = std.getLimits(ElementType.SEPARATING_WALL);
        expect(wallLimits.minRw).toBe(50);
        expect(wallLimits.maxLnw).toBeNull(); // Walls don't have Lnw limits
        expect(wallLimits.frequencyRange.min).toBe(50); // ISO 12354 frequency range
        expect(wallLimits.frequencyRange.max).toBe(5000);
        expect(wallLimits.uncertainty).toBe(1.5); // ISO 12354 uncertainty
        expect(typeof wallLimits.minRw).toBe('number');
        expect(typeof wallLimits.uncertainty).toBe('number');
        
        const floorLimits = std.getLimits(ElementType.SEPARATING_FLOOR);
        expect(floorLimits.minRw).toBe(50);
        expect(floorLimits.maxLnw).toBe(55); // ISO 12354 floor limit
        expect(floorLimits.frequencyRange.min).toBe(50);
        expect(floorLimits.frequencyRange.max).toBe(5000);
        expect(floorLimits.uncertainty).toBe(1.5);
        expect(typeof floorLimits.maxLnw).toBe('number');
        
        // Test unsupported elements throw errors
        expect(() => std.getLimits(ElementType.EXTERIOR_WALL)).toThrow();
        expect(() => std.getLimits(ElementType.EXTERIOR_WALL)).toThrow(/not defined for ISO 12354/);
        
        // Test with different building classes (if supported)
        const wallLimitsHigh = std.getLimits(ElementType.SEPARATING_WALL, BuildingClass.HIGH);
        expect(typeof wallLimitsHigh.minRw).toBe('number');
        expect(wallLimitsHigh.frequencyRange.min).toBe(50);
        
        const wallLimitsIncreased = std.getLimits(ElementType.SEPARATING_WALL, BuildingClass.INCREASED);
        expect(typeof wallLimitsIncreased.minRw).toBe('number');
        expect(wallLimitsIncreased.frequencyRange.max).toBe(5000);
    });

    it('validateResults detects frequency and single-number deviations', () => {
        // Test with failing results that violate ISO 12354 requirements
        const failingResults = {
            frequencyData: {
                125: { R: 25 }, // Too low for 125 Hz
                250: { R: 30 }, // Too low for 250 Hz
                500: { R: 35 }, // Too low for 500 Hz
                1000: { R: 40 }, // Too low for 1000 Hz
                2000: { R: 42 } // Too low for 2000 Hz
            },
            singleNumber: { Rw: 40 } // Below ISO 12354 limit of 50
        };

        const validation = std.validateResults(failingResults as any);
        expect(validation.isCompliant).toBe(false);
        expect(Array.isArray(validation.deviations)).toBe(true);
        expect(validation.deviations.length).toBeGreaterThanOrEqual(1);
        
        // Validate deviation structure
        validation.deviations.forEach(deviation => {
            expect(typeof deviation.parameter).toBe('string');
            expect(typeof deviation.actual).toBe('number');
            expect(typeof deviation.required).toBe('number');
            expect(typeof deviation.deviation).toBe('number');
            expect(['warning', 'error', 'critical']).toContain(deviation.severity);
        });
        
        // Check for frequency-specific deviations
        const parameters = validation.deviations.map(d => d.parameter);
        expect(parameters.some(p => p.includes('125'))).toBe(true);
        expect(parameters.some(p => p.includes('Weighted sound reduction') || p.includes('Weighted') || p.includes('Rw'))).toBe(true);
        
        // Test with passing results
        const passingResults = {
            frequencyData: {
                125: { R: 45 },
                250: { R: 48 },
                500: { R: 52 },
                1000: { R: 55 },
                2000: { R: 58 }
            },
            singleNumber: { Rw: 52 } // Above ISO 12354 limit
        };

        const passingValidation = std.validateResults(passingResults as any);
        expect(passingValidation.isCompliant).toBe(true);
        expect(passingValidation.deviations.length).toBe(0);
        
        // Test with mixed results
        const mixedResults = {
            frequencyData: {
                125: { R: 50 }, // Good
                250: { R: 20 }, // Bad
                500: { R: 52 }  // Good
            },
            singleNumber: { Rw: 52 } // Good
        };

        const mixedValidation = std.validateResults(mixedResults as any);
        expect(mixedValidation.isCompliant).toBe(false);
        expect(mixedValidation.deviations.length).toBeGreaterThan(0);
        expect(mixedValidation.deviations.length).toBeLessThan(validation.deviations.length); // Fewer deviations than all-failing
    });

    it('applyStandardCorrections combines flanking, junction and frequency corrections', () => {
        const baseRw = 50;
        
        // Test with comprehensive correction context
        const fullContext = {
            flankingTransmission: { 
                paths: [
                    { Rw: 50, Kij: 2 },
                    { Rw: 48, Kij: 3 },
                    { Rw: 52, Kij: 1.5 }
                ]
            },
            junctionGeometry: { 
                angle: 60, 
                thickness: 300,
                length: 2500,
                area: 12.5
            },
            frequencyCorrections: { 
                averageCorrection: 1.2,
                C50: -2,
                C5000: -8,
                Ctr: -5
            }
        };

        const correctedFull = std.applyStandardCorrections(baseRw, fullContext as any);
        expect(typeof correctedFull).toBe('number');
        expect(!Number.isNaN(correctedFull)).toBe(true);
        expect(correctedFull).toBeGreaterThan(0); // Should remain positive
        expect(correctedFull).toBeLessThan(100); // Should be reasonable
        
        // Test with minimal context
        const minimalContext = {
            flankingTransmission: { paths: [{ Rw: 50, Kij: 2 }] }
        };
        
        const correctedMinimal = std.applyStandardCorrections(baseRw, minimalContext as any);
        expect(typeof correctedMinimal).toBe('number');
        expect(!Number.isNaN(correctedMinimal)).toBe(true);
        
        // Test with empty context
        const correctedEmpty = std.applyStandardCorrections(baseRw, {} as any);
        expect(typeof correctedEmpty).toBe('number');
        expect(!Number.isNaN(correctedEmpty)).toBe(true);
        
        // Test with different base values
        const highBase = 70;
        const correctedHigh = std.applyStandardCorrections(highBase, fullContext as any);
        expect(typeof correctedHigh).toBe('number');
        expect(!Number.isNaN(correctedHigh)).toBe(true);
        
        const lowBase = 30;
        const correctedLow = std.applyStandardCorrections(lowBase, fullContext as any);
        expect(typeof correctedLow).toBe('number');
        expect(!Number.isNaN(correctedLow)).toBe(true);
        
        // Test junction geometry variations
        const differentJunctionContext = {
            junctionGeometry: { 
                angle: 90, 
                thickness: 200,
                length: 3000
            },
            frequencyCorrections: { averageCorrection: 2.5 }
        };
        
        const correctedDifferentJunction = std.applyStandardCorrections(baseRw, differentJunctionContext as any);
        expect(typeof correctedDifferentJunction).toBe('number');
        expect(!Number.isNaN(correctedDifferentJunction)).toBe(true);
        
        // Test that corrections actually modify the value (when context is provided)
        if (Object.keys(fullContext).length > 0) {
            expect(correctedFull).not.toBe(baseRw); // Should be different from base when corrections applied
        }
    });

    it('getJunctionAttenuation applies mass correction up to a cap', () => {
        // Test the specific case mentioned in original test
        const attSpecific = std.getJunctionAttenuation(JunctionType.RIGID_RIGID, [100, 400]);
        // baseAttenuation 5.7 + massCorrection capped at 5 => ~10.7
        expect(Math.abs(attSpecific - 10.7)).toBeLessThan(0.01);
        
        // Test symmetric masses (should use base attenuation)
        const attSymmetric = std.getJunctionAttenuation(JunctionType.RIGID_RIGID, [200, 200]);
        expect(attSymmetric).toBe(5.7); // Base attenuation for RIGID_RIGID
        
        // Test different junction types with various mass combinations
        const attLightweight = std.getJunctionAttenuation(JunctionType.LIGHTWEIGHT_LIGHTWEIGHT, [50, 50]);
        expect(Math.abs(attLightweight - 10.8)).toBeLessThan(0.01); // Expected value from debug
        expect(typeof attLightweight).toBe('number');
        
        // Test different mass ranges
        const lightMasses = [80, 120];
        const attLight = std.getJunctionAttenuation(JunctionType.RIGID_RIGID, lightMasses);
        expect(typeof attLight).toBe('number');
        expect(attLight).toBeGreaterThanOrEqual(0);
        expect(attLight).toBeLessThanOrEqual(50); // Reasonable upper bound
        
        const heavyMasses = [500, 600];
        const attHeavy = std.getJunctionAttenuation(JunctionType.RIGID_RIGID, heavyMasses);
        expect(typeof attHeavy).toBe('number');
        expect(attHeavy).toBeGreaterThanOrEqual(0);
        expect(attHeavy).toBeLessThanOrEqual(50);
        
        // Test asymmetric masses to verify mass correction calculation
        const asymmetricMasses1 = [100, 300];
        const asymmetricMasses2 = [300, 100];
        const attAsym1 = std.getJunctionAttenuation(JunctionType.RIGID_RIGID, asymmetricMasses1);
        const attAsym2 = std.getJunctionAttenuation(JunctionType.RIGID_RIGID, asymmetricMasses2);
        expect(attAsym1).toBe(attAsym2); // Should be symmetric
        
        // Test cross junction types
        const attCrossRigid = std.getJunctionAttenuation(JunctionType.CROSS_RIGID, [200, 250]);
        expect(typeof attCrossRigid).toBe('number');
        expect(attCrossRigid).toBeGreaterThanOrEqual(0);
        
        const attCrossFlexible = std.getJunctionAttenuation(JunctionType.CROSS_FLEXIBLE, [150, 200]);
        expect(typeof attCrossFlexible).toBe('number');
        expect(attCrossFlexible).toBeGreaterThanOrEqual(0);
        
        // Test edge cases
        const veryLightMasses = [20, 30];
        const attVeryLight = std.getJunctionAttenuation(JunctionType.RIGID_RIGID, veryLightMasses);
        expect(typeof attVeryLight).toBe('number');
        expect(attVeryLight).toBeGreaterThanOrEqual(0);
        
        const veryHeavyMasses = [800, 1000];
        const attVeryHeavy = std.getJunctionAttenuation(JunctionType.RIGID_RIGID, veryHeavyMasses);
        expect(typeof attVeryHeavy).toBe('number');
        expect(attVeryHeavy).toBeGreaterThanOrEqual(0);
        
        // Verify all attenuation values are finite and positive
        [attSpecific, attSymmetric, attLightweight, attLight, attHeavy, attAsym1, 
         attCrossRigid, attCrossFlexible, attVeryLight, attVeryHeavy].forEach(att => {
            expect(Number.isFinite(att)).toBe(true);
            expect(att).toBeGreaterThanOrEqual(0);
        });
    });

    it('isConstructionSupported returns true for supported and false otherwise', () => {
        // Test supported constructions for ISO 12354 (international/modern types)
        expect(std.isConstructionSupported(ConstructionTypeStandard.CONCRETE_MONOLITHIC)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CONCRETE_SANDWICH)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASONRY_SINGLE)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASONRY_DOUBLE)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_MASSIVE)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.STEEL_FRAME)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MIXED_CONSTRUCTION)).toBe(true);
        
        // Test unsupported constructions (German-specific DIN types)
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_BETON)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_ZIEGEL)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_KALKSANDSTEIN)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.HOLZBAU_MASSIV)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.HOLZBAU_RAHMEN)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.STAHLBAU_SANDWICH)).toBe(false);
        
        // Test modern CLT and specialized constructions (not in ISO 12354 scope)
        expect(std.isConstructionSupported(ConstructionTypeStandard.CLT_SOLID)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CLT_CAVITY)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVE_TIMBER)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_CONCRETE_COMPOSITE)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.LIGHTWEIGHT_CONSTRUCTION)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME_LIGHT)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME_HEAVY)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.GLULAM_CONSTRUCTION)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_HYBRID)).toBe(false);
        
        // Verify all return values are boolean
        Object.values(ConstructionTypeStandard).forEach(constructionType => {
            const result = std.isConstructionSupported(constructionType);
            expect(typeof result).toBe('boolean');
        });
        
        // Count supported vs unsupported to verify reasonable distribution
        const allConstructionTypes = Object.values(ConstructionTypeStandard);
        const supportedCount = allConstructionTypes.filter(type => std.isConstructionSupported(type)).length;
        const unsupportedCount = allConstructionTypes.length - supportedCount;
        
        expect(supportedCount).toBeGreaterThan(0); // Should support some constructions
        expect(unsupportedCount).toBeGreaterThan(0); // Should reject some constructions
        expect(supportedCount).toBe(8); // Expected count based on debug output
        
        // Test that ISO 12354 supports international standard construction types
        const internationalTypes = [
            ConstructionTypeStandard.CONCRETE_MONOLITHIC,
            ConstructionTypeStandard.CONCRETE_SANDWICH,
            ConstructionTypeStandard.MASONRY_SINGLE,
            ConstructionTypeStandard.TIMBER_FRAME,
            ConstructionTypeStandard.STEEL_FRAME
        ];
        
        internationalTypes.forEach(type => {
            expect(std.isConstructionSupported(type)).toBe(true);
        });
    });
});
