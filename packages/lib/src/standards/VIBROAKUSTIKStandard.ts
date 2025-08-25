import { 
    AcousticStandard, 
    StandardType, 
    CalculationMethod, 
    StandardLimits, 
    StandardValidationResult, 
    StandardDeviation,
    ElementType,
    BuildingClass,
    JunctionType,
    ConstructionTypeStandard,
    TimberType,
    JunctionStiffness,
    InstallationQuality
} from './AcousticStandard';

/**
 * VIBROAKUSTIK Standard for Timber Construction
 * Austrian/German specialist standard for wooden building acoustics
 * Focuses on timber-specific acoustic phenomena and calculation methods
 */
export class VIBROAKUSTIKStandard extends AcousticStandard {
    
    constructor() {
        super(StandardType.VIBROAKUSTIK, CalculationMethod.EXPERIMENTAL, '2019');
    }

    /**
     * VIBROAKUSTIK timber-specific limits and requirements
     */
    getLimits(elementType: ElementType, buildingClass: BuildingClass = BuildingClass.STANDARD): StandardLimits {
        const timberLimits = this.getTimberSpecificLimits();
        
        if (!timberLimits[elementType]) {
            throw new Error(`Element type '${elementType}' not defined in VIBROAKUSTIK timber standard`);
        }

        const elementLimits = timberLimits[elementType][buildingClass] || timberLimits[elementType][BuildingClass.STANDARD];
        
        return {
            minRw: elementLimits.Rw,
            maxLnw: elementLimits.Lnw,
            frequencyRange: { min: 50, max: 5000 },  // Extended for timber analysis
            uncertainty: 3.0  // Higher uncertainty for timber constructions
        };
    }

    /**
     * Timber-specific validation including vibration analysis
     */
    validateResults(results: any): StandardValidationResult {
        const deviations: StandardDeviation[] = [];
        
        // Check timber-specific parameters
        if (results.timber) {
            // Check for low-frequency timber resonances
            if (results.timber.resonanceFrequency && results.timber.resonanceFrequency < 60) {
                deviations.push({
                    parameter: 'Timber resonance frequency',
                    required: 60,
                    actual: results.timber.resonanceFrequency,
                    deviation: results.timber.resonanceFrequency - 60,
                    severity: 'warning'
                });
            }

            // Check beam spacing for acoustic optimization
            if (results.timber.beamSpacing && results.timber.beamSpacing > 625) {
                deviations.push({
                    parameter: 'Timber beam spacing',
                    required: 625,
                    actual: results.timber.beamSpacing,
                    deviation: results.timber.beamSpacing - 625,
                    severity: 'warning'
                });
            }

            // Validate CLT thickness requirements
            if (results.timber.cltThickness && results.timber.cltThickness < 100) {
                deviations.push({
                    parameter: 'CLT panel thickness',
                    required: 100,
                    actual: results.timber.cltThickness,
                    deviation: results.timber.cltThickness - 100,
                    severity: 'error'
                });
            }
        }

        // Standard acoustic validation
        if (results.Rw) {
            const limits = this.getLimits(ElementType.TIMBER_WALL);
            if (results.Rw < limits.minRw) {
                deviations.push({
                    parameter: 'Timber wall Rw',
                    required: limits.minRw,
                    actual: results.Rw,
                    deviation: results.Rw - limits.minRw,
                    severity: 'error'
                });
            }
        }

        return {
            isCompliant: deviations.length === 0,
            deviations,
            recommendedActions: this.getTimberRecommendations(deviations, results),
            standard: this.type,
            method: this.method
        };
    }

    /**
     * Apply timber-specific acoustic corrections
     */
    applyStandardCorrections(baseValue: number, context: any): number {
        let correctedValue = baseValue;

        // Timber construction type corrections
        if (context.timberType) {
            correctedValue += this.getTimberTypeCorrection(context.timberType);
        }

        // Junction stiffness corrections for timber
        if (context.junctionStiffness) {
            correctedValue += this.getStiffnessCorrection(context.junctionStiffness);
        }

        // Cavity resonance corrections
        if (context.cavityDepth && context.cavityDepth < 100) {
            correctedValue -= 3.0; // Penalty for shallow cavities in timber construction
        }

        // Installation quality correction for timber
        if (context.installationQuality) {
            correctedValue += this.getInstallationQualityCorrection(context.installationQuality);
        }

        return correctedValue;
    }

    /**
     * VIBROAKUSTIK timber junction attenuation values
     */
    getJunctionAttenuation(junctionType: JunctionType, masses: number[]): number {
        const timberJunctions: Record<JunctionType, number> = {
            [JunctionType.CLT_CLT_RIGID]: 4.2,           // CLT to CLT rigid connection
            [JunctionType.CLT_CLT_FLEXIBLE]: 7.8,        // CLT to CLT with damping layer  
            [JunctionType.CLT_FRAME_RIGID]: 6.5,         // CLT to timber frame rigid
            [JunctionType.CLT_FRAME_FLEXIBLE]: 9.2,      // CLT to timber frame flexible
            [JunctionType.FRAME_FRAME_RIGID]: 8.7,       // Frame to frame rigid
            [JunctionType.FRAME_FRAME_FLEXIBLE]: 12.4,   // Frame to frame flexible
            [JunctionType.TIMBER_CONCRETE]: 5.8,         // Timber to concrete/masonry
            [JunctionType.TIMBER_STEEL]: 8.1,            // Timber to steel
            [JunctionType.RIGID_RIGID]: 8.7,
            [JunctionType.RIGID_LIGHTWEIGHT]: 8.7,
            [JunctionType.LIGHTWEIGHT_LIGHTWEIGHT]: 12.4,
            [JunctionType.CROSS_RIGID]: 8.7,
            [JunctionType.CROSS_FLEXIBLE]: 12.4,
            [JunctionType.TEE_RIGID]: 8.7,
            [JunctionType.TEE_FLEXIBLE]: 12.4,
            [JunctionType.CORNER_RIGID]: 8.7,
            [JunctionType.CORNER_FLEXIBLE]: 12.4
        };

        // Determine junction type based on context
        const classifiedType = this.classifyTimberJunction(junctionType, masses);
        return timberJunctions[classifiedType as JunctionType] || 6.5;
    }

    /**
     * Check timber construction support
     */
    isConstructionSupported(constructionType: ConstructionTypeStandard): boolean {
        const supportedTimberTypes = [
            ConstructionTypeStandard.CLT_SOLID,                    // Cross-laminated timber solid
            ConstructionTypeStandard.CLT_CAVITY,                   // CLT with cavity insulation
            ConstructionTypeStandard.TIMBER_FRAME_LIGHT,           // Light timber frame
            ConstructionTypeStandard.TIMBER_FRAME_HEAVY,           // Heavy timber frame
            ConstructionTypeStandard.GLULAM_CONSTRUCTION,          // Glue-laminated timber
            ConstructionTypeStandard.TIMBER_CONCRETE_COMPOSITE,    // Timber-concrete composite
            ConstructionTypeStandard.MASSIVE_TIMBER,               // Massive timber construction
            ConstructionTypeStandard.TIMBER_HYBRID                 // Hybrid timber systems
        ];
        
        return supportedTimberTypes.includes(constructionType);
    }

    /**
     * Get timber construction type correction
     */
    private getTimberTypeCorrection(timberType: TimberType): number {
        const corrections: Record<TimberType, number> = {
            [TimberType.CLT]: 2.0,              // CLT panels - good performance
            [TimberType.GLULAM]: 1.5,           // Glue-laminated timber
            [TimberType.SOLID_TIMBER]: 1.0,     // Solid timber elements
            [TimberType.ENGINEERED_TIMBER]: 2.5, // Engineered timber products
            [TimberType.TIMBER_FRAME]: 0.0      // Standard timber frame (baseline)
        };
        
        return corrections[timberType] || 0.0;
    }

    /**
     * Get junction stiffness correction for timber
     */
    private getStiffnessCorrection(stiffness: JunctionStiffness): number {
        const stiffnessCorrections: Record<JunctionStiffness, number> = {
            [JunctionStiffness.RIGID]: -2.0,           // Rigid connections reduce performance
            [JunctionStiffness.SEMI_RIGID]: 0.0,       // Semi-rigid (baseline)
            [JunctionStiffness.FLEXIBLE]: 3.0,         // Flexible connections improve performance
            [JunctionStiffness.DAMPED]: 5.0            // Damped flexible connections
        };
        
        return stiffnessCorrections[stiffness] || 0.0;
    }

    /**
     * Get installation quality correction
     */
    private getInstallationQualityCorrection(quality: InstallationQuality): number {
        const qualityCorrections: Record<InstallationQuality, number> = {
            [InstallationQuality.POOR]: -5.0,            // Poor installation
            [InstallationQuality.AVERAGE]: 0.0,          // Average quality (baseline)
            [InstallationQuality.GOOD]: 2.0,             // Good installation
            [InstallationQuality.EXCELLENT]: 4.0         // Excellent craftsmanship
        };
        
        return qualityCorrections[quality] || 0.0;
    }

    /**
     * Classify timber junction type
     */
    private classifyTimberJunction(junctionType: JunctionType, masses: number[]): JunctionType {
        // Simplified classification - in practice would be more complex
        const avgMass = masses.reduce((a, b) => a + b, 0) / masses.length;
        
        if (avgMass > 300) {
            return JunctionType.CLT_CLT_RIGID;       // Heavy timber elements
        } else if (avgMass > 150) {
            return JunctionType.CLT_FRAME_RIGID;     // Medium mass elements
        } else {
            return JunctionType.FRAME_FRAME_FLEXIBLE; // Light frame construction
        }
    }

    /**
     * Timber-specific limits for different elements
     */
    private getTimberSpecificLimits(): any {
        return {
            [ElementType.TIMBER_WALL]: {
                [BuildingClass.STANDARD]: { Rw: 48, Lnw: null },      // CLT wall standard
                [BuildingClass.INCREASED]: { Rw: 55, Lnw: null },     // Enhanced CLT
                [BuildingClass.HIGH]: { Rw: 62, Lnw: null }           // Premium timber wall
            },
            [ElementType.TIMBER_FLOOR]: {
                [BuildingClass.STANDARD]: { Rw: 50, Lnw: 58 },       // CLT floor standard
                [BuildingClass.INCREASED]: { Rw: 57, Lnw: 51 },      // Enhanced CLT floor
                [BuildingClass.HIGH]: { Rw: 64, Lnw: 44 }            // Premium timber floor
            },
            [ElementType.TIMBER_FRAME_WALL]: {
                [BuildingClass.STANDARD]: { Rw: 45, Lnw: null },      // Frame wall standard
                [BuildingClass.INCREASED]: { Rw: 52, Lnw: null },     // Enhanced frame
                [BuildingClass.HIGH]: { Rw: 58, Lnw: null }           // Premium frame wall
            },
            [ElementType.TIMBER_FRAME_FLOOR]: {
                [BuildingClass.STANDARD]: { Rw: 48, Lnw: 62 },       // Frame floor standard  
                [BuildingClass.INCREASED]: { Rw: 55, Lnw: 55 },      // Enhanced frame floor
                [BuildingClass.HIGH]: { Rw: 62, Lnw: 48 }            // Premium frame floor
            }
        };
    }

    /**
     * Generate timber-specific recommendations
     */
    private getTimberRecommendations(deviations: StandardDeviation[], results: any): string[] {
        const recommendations: string[] = [];

        // Timber-specific recommendations
        for (const deviation of deviations) {
            if (deviation.parameter.includes('resonance')) {
                recommendations.push('Consider increasing structural stiffness or adding damping to reduce resonance effects');
            }
            
            if (deviation.parameter.includes('beam spacing')) {
                recommendations.push('Reduce beam spacing to improve acoustic performance and structural stiffness');
            }
            
            if (deviation.parameter.includes('CLT')) {
                recommendations.push('Increase CLT panel thickness or consider double-wall construction');
            }
            
            if (deviation.parameter.includes('Rw')) {
                const deficit = Math.abs(deviation.deviation);
                if (deficit <= 5) {
                    recommendations.push('Consider additional mass layers or cavity insulation for timber elements');
                } else {
                    recommendations.push('Fundamental timber construction redesign required - consider CLT upgrade or composite systems');
                }
            }
        }

        // General timber construction advice
        if (results.timber) {
            recommendations.push('Ensure proper sealing of all timber joints and connections');
            recommendations.push('Consider resilient layers at timber-to-masonry interfaces');
            recommendations.push('Validate installation quality through on-site acoustic testing');
        }

        return recommendations;
    }
}
