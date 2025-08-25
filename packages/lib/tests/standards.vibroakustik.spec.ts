import { describe, it, expect } from 'vitest';
import { VIBROAKUSTIKStandard } from '../src/standards/VIBROAKUSTIKStandard';
import { ElementType, JunctionType, ConstructionTypeStandard, TimberType, JunctionStiffness, InstallationQuality, BuildingClass } from '../src/standards/AcousticStandard';

describe('VIBROAKUSTIKStandard - focused tests', () => {
    const std = new VIBROAKUSTIKStandard();

    it('getLimits returns timber limits and throws for unsupported element', () => {
        // Test supported timber elements with comprehensive validation
        const timberWallLimits = std.getLimits(ElementType.TIMBER_WALL);
        expect(timberWallLimits.minRw).toBe(48); // Vibroakustik timber wall requirement
        expect(timberWallLimits.maxLnw).toBeNull(); // Walls don't have Lnw limits
        expect(timberWallLimits.frequencyRange.min).toBe(50); // Vibroakustik frequency range
        expect(timberWallLimits.frequencyRange.max).toBe(5000);
        expect(timberWallLimits.uncertainty).toBe(3); // Vibroakustik higher uncertainty for timber
        expect(typeof timberWallLimits.minRw).toBe('number');
        expect(typeof timberWallLimits.uncertainty).toBe('number');
        
        const timberFloorLimits = std.getLimits(ElementType.TIMBER_FLOOR);
        expect(timberFloorLimits.minRw).toBe(50); // Vibroakustik timber floor Rw requirement
        expect(timberFloorLimits.maxLnw).toBe(58); // Vibroakustik timber floor L'n,w requirement
        expect(timberFloorLimits.frequencyRange.min).toBe(50);
        expect(timberFloorLimits.frequencyRange.max).toBe(5000);
        expect(timberFloorLimits.uncertainty).toBe(3);
        expect(typeof timberFloorLimits.maxLnw).toBe('number');
        
        // Test with different building classes
        const timberWallHigh = std.getLimits(ElementType.TIMBER_WALL, BuildingClass.HIGH);
        expect(typeof timberWallHigh.minRw).toBe('number');
        expect(timberWallHigh.frequencyRange.min).toBe(50);
        
        const timberFloorIncreased = std.getLimits(ElementType.TIMBER_FLOOR, BuildingClass.INCREASED);
        expect(typeof timberFloorIncreased.minRw).toBe('number');
        expect(typeof timberFloorIncreased.maxLnw).toBe('number');
        
        // Test unsupported elements throw errors
        expect(() => std.getLimits(ElementType.SEPARATING_WALL)).toThrow();
        expect(() => std.getLimits(ElementType.SEPARATING_WALL)).toThrow(/not defined in VIBROAKUSTIK/);
        
        expect(() => std.getLimits(ElementType.SEPARATING_FLOOR)).toThrow();
        expect(() => std.getLimits(ElementType.EXTERIOR_WALL)).toThrow();
        expect(() => std.getLimits(ElementType.INTERIOR_WALL)).toThrow();
        
        // Test timber frame variants if supported
        try {
            const timberFrameWallLimits = std.getLimits(ElementType.TIMBER_FRAME_WALL);
            expect(typeof timberFrameWallLimits.minRw).toBe('number');
            expect(timberFrameWallLimits.uncertainty).toBe(3);
        } catch (e) {
            // If not supported, should throw appropriate error
            expect(e.message).toContain('VIBROAKUSTIK');
        }
        
        try {
            const timberFrameFloorLimits = std.getLimits(ElementType.TIMBER_FRAME_FLOOR);
            expect(typeof timberFrameFloorLimits.minRw).toBe('number');
            expect(typeof timberFrameFloorLimits.maxLnw).toBe('number');
        } catch (e) {
            expect(e.message).toContain('VIBROAKUSTIK');
        }
    });

    it('validateResults reports timber parameter deviations', () => {
        // Test with failing timber parameters
        const failingResults = { 
            timber: { 
                resonanceFrequency: 50,  // Too low (usually should be >60-80 Hz)
                beamSpacing: 700,        // Too wide (usually should be <600 mm)
                cltThickness: 90         // Too thin (usually should be >120 mm)
            }, 
            Rw: 40  // Below Vibroakustik limit of 48
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
        
        // Check for specific timber parameter deviations
        const parameters = validation.deviations.map(d => d.parameter);
        expect(parameters).toContain('Timber resonance frequency');
        expect(parameters).toContain('Timber beam spacing');
        expect(parameters).toContain('CLT panel thickness');
        
        // Test with passing timber parameters
        const passingResults = { 
            timber: { 
                resonanceFrequency: 85,  // Good frequency
                beamSpacing: 400,        // Good spacing
                cltThickness: 140,       // Good thickness
                dampingRatio: 0.02,      // Good damping
                connectionStiffness: 1500 // Good connection
            }, 
            Rw: 52  // Above Vibroakustik limit
        };
        
        const passingValidation = std.validateResults(passingResults as any);
        expect(passingValidation.isCompliant).toBe(true);
        expect(passingValidation.deviations.length).toBe(0);
        
        // Test with mixed results
        const mixedResults = { 
            timber: { 
                resonanceFrequency: 75,  // Good
                beamSpacing: 650,        // Bad - too wide
                cltThickness: 160        // Good
            }, 
            Rw: 50  // Good
        };
        
        const mixedValidation = std.validateResults(mixedResults as any);
        expect(mixedValidation.isCompliant).toBe(false);
        expect(mixedValidation.deviations.length).toBe(1); // Only beam spacing issue
        expect(mixedValidation.deviations[0].parameter).toBe('Timber beam spacing');
        
        // Test without timber data (should still check Rw)
        const noTimberResults = { Rw: 45 }; // Below limit
        const noTimberValidation = std.validateResults(noTimberResults as any);
        expect(noTimberValidation.isCompliant).toBe(false);
        expect(noTimberValidation.deviations.length).toBeGreaterThan(0);
    });

    it('applyStandardCorrections uses timber type, stiffness, cavity and installation corrections', () => {
        const baseRw = 45;
        
        // Test with comprehensive timber correction context
        const fullContext = { 
            timberType: TimberType.CLT, 
            junctionStiffness: JunctionStiffness.FLEXIBLE, 
            cavityDepth: 50, 
            installationQuality: InstallationQuality.GOOD,
            dampingMaterial: true,
            connectionType: 'mechanical',
            surfaceMass: 180
        };
        
        const correctedFull = std.applyStandardCorrections(baseRw, fullContext as any);
        expect(typeof correctedFull).toBe('number');
        expect(!Number.isNaN(correctedFull)).toBe(true);
        expect(correctedFull).toBeLessThan(baseRw + 10); // Should not increase dramatically
        expect(correctedFull).toBeGreaterThan(baseRw - 15); // Should not decrease dramatically
        
        // Test with different timber types
        const solidTimberContext = { 
            timberType: TimberType.SOLID_TIMBER, 
            junctionStiffness: JunctionStiffness.RIGID,
            installationQuality: InstallationQuality.EXCELLENT
        };
        
        const correctedSolid = std.applyStandardCorrections(baseRw, solidTimberContext as any);
        expect(typeof correctedSolid).toBe('number');
        expect(!Number.isNaN(correctedSolid)).toBe(true);
        
        // Test with poor installation quality
        const poorContext = { 
            timberType: TimberType.GLULAM, 
            junctionStiffness: JunctionStiffness.FLEXIBLE, 
            cavityDepth: 100,
            installationQuality: InstallationQuality.POOR
        };
        
        const correctedPoor = std.applyStandardCorrections(baseRw, poorContext as any);
        expect(typeof correctedPoor).toBe('number');
        expect(correctedPoor).toBeLessThan(correctedFull); // Poor quality should give worse result
        
        // Test with different cavity depths
        const shallowCavityContext = { 
            timberType: TimberType.CLT, 
            cavityDepth: 25,
            installationQuality: InstallationQuality.GOOD
        };
        
        const deepCavityContext = { 
            timberType: TimberType.CLT, 
            cavityDepth: 150,
            installationQuality: InstallationQuality.GOOD
        };
        
        const correctedShallow = std.applyStandardCorrections(baseRw, shallowCavityContext as any);
        const correctedDeep = std.applyStandardCorrections(baseRw, deepCavityContext as any);
        
        expect(typeof correctedShallow).toBe('number');
        expect(typeof correctedDeep).toBe('number');
        expect(correctedDeep).not.toBe(correctedShallow); // Different cavity depths should give different results
        
        // Test with different junction stiffnesses
        const rigidContext = { 
            timberType: TimberType.CLT, 
            junctionStiffness: JunctionStiffness.RIGID
        };
        
        const flexibleContext = { 
            timberType: TimberType.CLT, 
            junctionStiffness: JunctionStiffness.FLEXIBLE
        };
        
        const correctedRigid = std.applyStandardCorrections(baseRw, rigidContext as any);
        const correctedFlexible = std.applyStandardCorrections(baseRw, flexibleContext as any);
        
        expect(correctedRigid).not.toBe(correctedFlexible); // Different stiffnesses should give different results
        
        // Test with minimal context
        const minimalContext = { timberType: TimberType.CLT };
        const correctedMinimal = std.applyStandardCorrections(baseRw, minimalContext as any);
        expect(typeof correctedMinimal).toBe('number');
        
        // Test with empty context
        const correctedEmpty = std.applyStandardCorrections(baseRw, {} as any);
        expect(typeof correctedEmpty).toBe('number');
        
        // All results should be finite and reasonable
        [correctedFull, correctedSolid, correctedPoor, correctedShallow, correctedDeep, 
         correctedRigid, correctedFlexible, correctedMinimal, correctedEmpty].forEach(result => {
            expect(Number.isFinite(result)).toBe(true);
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(100);
        });
    });

    it('getJunctionAttenuation classifies junctions by mass and returns expected values', () => {
        // Test specific expected values from debug output
        const cltCltRigid = std.getJunctionAttenuation(JunctionType.CLT_CLT_RIGID, [400, 500]);
        expect(cltCltRigid).toBeCloseTo(4.2, 1);
        
        const frameFrameFlexible = std.getJunctionAttenuation(JunctionType.FRAME_FRAME_FLEXIBLE, [50, 60]);
        expect(frameFrameFlexible).toBeCloseTo(12.4, 1);
        
        const cltFrameRigid = std.getJunctionAttenuation(JunctionType.CLT_FRAME_RIGID, [300, 100]);
        expect(cltFrameRigid).toBeCloseTo(6.5, 1);
        
        // Test different mass combinations for CLT junctions
        const cltCltFlexible = std.getJunctionAttenuation(JunctionType.CLT_CLT_FLEXIBLE, [200, 250]);
        expect(typeof cltCltFlexible).toBe('number');
        expect(cltCltFlexible).toBeGreaterThanOrEqual(0);
        expect(cltCltFlexible).toBeLessThanOrEqual(20); // Reasonable upper bound for timber
        
        // Test frame junctions with different configurations
        const frameFrameRigid = std.getJunctionAttenuation(JunctionType.FRAME_FRAME_RIGID, [80, 90]);
        expect(typeof frameFrameRigid).toBe('number');
        expect(frameFrameRigid).toBeGreaterThanOrEqual(0);
        
        // Test mixed CLT-frame junctions
        const cltFrameFlexible = std.getJunctionAttenuation(JunctionType.CLT_FRAME_FLEXIBLE, [350, 70]);
        expect(typeof cltFrameFlexible).toBe('number');
        expect(cltFrameFlexible).toBeGreaterThanOrEqual(0);
        
        // Test mass dependency for timber constructions
        const lightTimberMasses = [60, 80];   // Light frame construction
        const heavyTimberMasses = [400, 500]; // Heavy CLT construction
        
        const attLight = std.getJunctionAttenuation(JunctionType.CLT_CLT_RIGID, lightTimberMasses);
        const attHeavy = std.getJunctionAttenuation(JunctionType.CLT_CLT_RIGID, heavyTimberMasses);
        
        expect(typeof attLight).toBe('number');
        expect(typeof attHeavy).toBe('number');
        expect(attLight).not.toBe(attHeavy); // Different masses should give different results
        
        // Test symmetry
        const masses1 = [300, 150];
        const masses2 = [150, 300];
        const att1 = std.getJunctionAttenuation(JunctionType.CLT_FRAME_RIGID, masses1);
        const att2 = std.getJunctionAttenuation(JunctionType.CLT_FRAME_RIGID, masses2);
        expect(att1).toBe(att2); // Should be symmetric
        
        // Test edge cases for timber construction
        const veryLightMasses = [30, 40];   // Very light frame
        const veryHeavyMasses = [600, 800]; // Very heavy CLT panels
        
        const attVeryLight = std.getJunctionAttenuation(JunctionType.FRAME_FRAME_FLEXIBLE, veryLightMasses);
        const attVeryHeavy = std.getJunctionAttenuation(JunctionType.CLT_CLT_RIGID, veryHeavyMasses);
        
        expect(typeof attVeryLight).toBe('number');
        expect(typeof attVeryHeavy).toBe('number');
        expect(attVeryLight).toBeGreaterThanOrEqual(0);
        expect(attVeryHeavy).toBeGreaterThanOrEqual(0);
        
        // Test all junction types return finite positive values
        const testMasses = [200, 250];
        const junctionTypes = [
            JunctionType.CLT_CLT_RIGID,
            JunctionType.CLT_CLT_FLEXIBLE,
            JunctionType.CLT_FRAME_RIGID,
            JunctionType.CLT_FRAME_FLEXIBLE,
            JunctionType.FRAME_FRAME_RIGID,
            JunctionType.FRAME_FRAME_FLEXIBLE
        ];
        
        junctionTypes.forEach(junctionType => {
            const attenuation = std.getJunctionAttenuation(junctionType, testMasses);
            expect(Number.isFinite(attenuation)).toBe(true);
            expect(attenuation).toBeGreaterThanOrEqual(0);
            expect(attenuation).toBeLessThanOrEqual(25); // Reasonable range for timber junctions
        });
    });

    it('isConstructionSupported returns true for supported timber types', () => {
        // Test supported timber constructions for Vibroakustik (timber-specific standard)
        expect(std.isConstructionSupported(ConstructionTypeStandard.CLT_SOLID)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CLT_CAVITY)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME_LIGHT)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME_HEAVY)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.GLULAM_CONSTRUCTION)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_CONCRETE_COMPOSITE)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVE_TIMBER)).toBe(true);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_HYBRID)).toBe(true);
        
        // Test unsupported constructions (non-timber types)
        expect(std.isConstructionSupported(ConstructionTypeStandard.MIXED_CONSTRUCTION)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CONCRETE_MONOLITHIC)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.CONCRETE_SANDWICH)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASONRY_SINGLE)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASONRY_DOUBLE)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.STEEL_FRAME)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.LIGHTWEIGHT_CONSTRUCTION)).toBe(false);
        
        // Test traditional German construction types (not supported by Vibroakustik)
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_BETON)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_ZIEGEL)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.MASSIVBAU_KALKSANDSTEIN)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.HOLZBAU_MASSIV)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.HOLZBAU_RAHMEN)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.STAHLBAU_SANDWICH)).toBe(false);
        
        // Test generic timber types that might not be specifically in Vibroakustik scope
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_FRAME)).toBe(false);
        expect(std.isConstructionSupported(ConstructionTypeStandard.TIMBER_MASSIVE)).toBe(false);
        
        // Verify all return values are boolean
        Object.values(ConstructionTypeStandard).forEach(constructionType => {
            const result = std.isConstructionSupported(constructionType);
            expect(typeof result).toBe('boolean');
        });
        
        // Count supported vs unsupported to verify reasonable distribution
        const allConstructionTypes = Object.values(ConstructionTypeStandard);
        const supportedCount = allConstructionTypes.filter(type => std.isConstructionSupported(type)).length;
        const unsupportedCount = allConstructionTypes.length - supportedCount;
        
        expect(supportedCount).toBeGreaterThan(0); // Should support some timber constructions
        expect(unsupportedCount).toBeGreaterThan(0); // Should reject non-timber constructions
        expect(supportedCount).toBe(8); // Expected count based on debug output (timber-specific types)
        
        // Test that Vibroakustik supports advanced timber construction types
        const advancedTimberTypes = [
            ConstructionTypeStandard.CLT_SOLID,
            ConstructionTypeStandard.CLT_CAVITY,
            ConstructionTypeStandard.MASSIVE_TIMBER,
            ConstructionTypeStandard.TIMBER_CONCRETE_COMPOSITE,
            ConstructionTypeStandard.TIMBER_HYBRID
        ];
        
        advancedTimberTypes.forEach(type => {
            expect(std.isConstructionSupported(type)).toBe(true);
        });
        
        // Test that traditional masonry/concrete constructions are not supported
        const massiveConstructionTypes = [
            ConstructionTypeStandard.CONCRETE_MONOLITHIC,
            ConstructionTypeStandard.MASONRY_SINGLE,
            ConstructionTypeStandard.MASSIVBAU_BETON,
            ConstructionTypeStandard.STEEL_FRAME
        ];
        
        massiveConstructionTypes.forEach(type => {
            expect(std.isConstructionSupported(type)).toBe(false);
        });
    });

    it('getTimberRecommendations returns general suggestions when timber results provided', () => {
        // Test with multiple timber-specific deviations
        const timberDeviations = [
            { parameter: 'Timber resonance frequency', deviation: -10, actual: 50, required: 60, severity: 'error' as const },
            { parameter: 'Timber beam spacing', deviation: 100, actual: 700, required: 600, severity: 'warning' as const },
            { parameter: 'CLT panel thickness', deviation: -30, actual: 90, required: 120, severity: 'critical' as const }
        ];
        
        const timberResults = { 
            timber: { 
                resonanceFrequency: 50, 
                beamSpacing: 700, 
                cltThickness: 90,
                dampingRatio: 0.01,
                connectionStiffness: 800
            },
            Rw: 42
        };
        
        const recommendations = (std as any).getTimberRecommendations(timberDeviations, timberResults);
        expect(Array.isArray(recommendations)).toBe(true);
        expect(recommendations.length).toBeGreaterThan(0);
        
        // Validate recommendation structure
        recommendations.forEach(recommendation => {
            expect(typeof recommendation).toBe('string');
            expect(recommendation.length).toBeGreaterThan(0);
        });
        
        // Test with frequency-specific deviations
        const frequencyDeviations = [
            { parameter: 'Timber resonance frequency', deviation: -15, actual: 45, required: 60, severity: 'error' as const }
        ];
        
        const frequencyRecs = (std as any).getTimberRecommendations(frequencyDeviations, timberResults);
        expect(Array.isArray(frequencyRecs)).toBe(true);
        expect(frequencyRecs.length).toBeGreaterThan(0);
        expect(frequencyRecs.some(rec => rec.toLowerCase().includes('frequency') || rec.toLowerCase().includes('resonance'))).toBe(true);
        
        // Test with spacing-specific deviations
        const spacingDeviations = [
            { parameter: 'Timber beam spacing', deviation: 150, actual: 750, required: 600, severity: 'warning' as const }
        ];
        
        const spacingRecs = (std as any).getTimberRecommendations(spacingDeviations, timberResults);
        expect(Array.isArray(spacingRecs)).toBe(true);
        expect(spacingRecs.length).toBeGreaterThan(0);
        expect(spacingRecs.some(rec => rec.toLowerCase().includes('spacing') || rec.toLowerCase().includes('beam'))).toBe(true);
        
        // Test with thickness-specific deviations
        const thicknessDeviations = [
            { parameter: 'CLT panel thickness', deviation: -40, actual: 80, required: 120, severity: 'critical' as const }
        ];
        
        const thicknessRecs = (std as any).getTimberRecommendations(thicknessDeviations, timberResults);
        expect(Array.isArray(thicknessRecs)).toBe(true);
        expect(thicknessRecs.length).toBeGreaterThan(0);
        expect(thicknessRecs.some(rec => rec.toLowerCase().includes('thickness') || rec.toLowerCase().includes('clt'))).toBe(true);
        
        // Test with no timber data
        const noTimberResults = { Rw: 42 };
        const noTimberRecs = (std as any).getTimberRecommendations(timberDeviations, noTimberResults);
        expect(Array.isArray(noTimberRecs)).toBe(true);
        // Should still provide general recommendations even without specific timber data
        
        // Test with empty deviations
        const emptyRecs = (std as any).getTimberRecommendations([], timberResults);
        expect(Array.isArray(emptyRecs)).toBe(true);
        
        // Test with mixed severity levels
        const mixedDeviations = [
            { parameter: 'Timber resonance frequency', deviation: -5, actual: 55, required: 60, severity: 'warning' as const },
            { parameter: 'CLT panel thickness', deviation: -50, actual: 70, required: 120, severity: 'critical' as const }
        ];
        
        const mixedRecs = (std as any).getTimberRecommendations(mixedDeviations, timberResults);
        expect(Array.isArray(mixedRecs)).toBe(true);
        expect(mixedRecs.length).toBeGreaterThan(0);
        
        // Verify that different deviation types produce different recommendations
        expect(frequencyRecs).not.toEqual(spacingRecs);
        expect(spacingRecs).not.toEqual(thicknessRecs);
        
        // Test that all recommendations are meaningful strings
        const allRecs = [...recommendations, ...frequencyRecs, ...spacingRecs, ...thicknessRecs, ...mixedRecs];
        allRecs.forEach(rec => {
            expect(typeof rec).toBe('string');
            expect(rec.trim().length).toBeGreaterThan(10); // Should be meaningful, not just short phrases
        });
    });
});
