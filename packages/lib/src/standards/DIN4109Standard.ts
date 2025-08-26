import { 
    AcousticStandard, 
    StandardType, 
    StandardLimits, 
    StandardValidationResult, 
    StandardDeviation,
    ElementType,
    BuildingClass,
    JunctionType,
    ConstructionTypeStandard
} from './AcousticStandard';

/**
 * DIN 4109 - Schallschutz im Hochbau
 * German standard for sound insulation in buildings
 * Implementation of simplified calculation method
 */
export class DIN4109Standard extends AcousticStandard {
    
    constructor() {
        super(StandardType.DIN4109, '2018-01');
    }

    /**
     * DIN 4109 sound insulation requirements based on building class
     */
    getLimits(elementType: ElementType, buildingClass: BuildingClass = BuildingClass.STANDARD): StandardLimits {
        const limits = this.getDIN4109Limits();
        
        if (!limits[elementType]) {
            throw new Error(`Element type '${elementType}' not defined in DIN 4109`);
        }

        const elementLimits = limits[elementType][buildingClass] || limits[elementType][BuildingClass.STANDARD];
        
        return {
            minRw: elementLimits.Rw,
            maxLnw: elementLimits.Lnw,
            frequencyRange: { min: 100, max: 3150 },
            uncertainty: 2.0  // DIN 4109 calculation uncertainty
        };
    }

    /**
     * Validate results against DIN 4109 requirements
     */
    validateResults(results: any): StandardValidationResult {
        const deviations: StandardDeviation[] = [];
        
        // Check separating walls
        if (results.walls) {
            for (const wall of results.walls) {
                const limits = this.getLimits(ElementType.SEPARATING_WALL, wall.buildingClass);
                if (wall.Rw < limits.minRw) {
                    deviations.push({
                        parameter: `Wall Rw (${wall.name})`,
                        required: limits.minRw,
                        actual: wall.Rw,
                        deviation: wall.Rw - limits.minRw,
                        severity: wall.Rw < limits.minRw - 5 ? 'critical' : 'error'
                    });
                }
            }
        }

        // Check floors for impact sound
        if (results.floors) {
            for (const floor of results.floors) {
                const limits = this.getLimits(ElementType.SEPARATING_FLOOR, floor.buildingClass);
                if (floor.Lnw > limits.maxLnw) {
                    deviations.push({
                        parameter: `Floor L'n,w (${floor.name})`,
                        required: limits.maxLnw,
                        actual: floor.Lnw,
                        deviation: floor.Lnw - limits.maxLnw,
                        severity: floor.Lnw > limits.maxLnw + 5 ? 'critical' : 'error'
                    });
                }
            }
        }

        return {
            isCompliant: deviations.length === 0,
            deviations,
            recommendedActions: this.getRecommendations(deviations),
            standard: this.type
        };
    }

    /**
     * Apply DIN 4109 specific corrections
     */
    applyStandardCorrections(baseValue: number, context: any): number {
        let correctedValue = baseValue;

        // Apply safety margin for DIN 4109
        if (context.applySafetyMargin) {
            correctedValue -= 2.0;  // 2 dB safety margin
        }

        // Apply laboratory-to-field correction
        if (context.fieldCorrection) {
            correctedValue -= 5.0;  // Field installation reduction
        }

        return correctedValue;
    }

    /**
     * DIN 4109 junction attenuation values (simplified approach)
     */
    getJunctionAttenuation(junctionType: JunctionType, masses: number[]): number {
        const junctionAttenuations: Record<JunctionType, number> = {
            [JunctionType.RIGID_RIGID]: 5.7,      // Two rigid elements
            [JunctionType.RIGID_LIGHTWEIGHT]: 8.7,  // Rigid + lightweight
            [JunctionType.LIGHTWEIGHT_LIGHTWEIGHT]: 10.8,  // Two lightweight elements
            [JunctionType.CROSS_RIGID]: 5.7,
            [JunctionType.CROSS_FLEXIBLE]: 8.7,
            [JunctionType.TEE_RIGID]: 8.7,
            [JunctionType.TEE_FLEXIBLE]: 12.2,
            [JunctionType.CORNER_RIGID]: 5.7,
            [JunctionType.CORNER_FLEXIBLE]: 8.7,
            [JunctionType.CLT_CLT_RIGID]: 5.7,
            [JunctionType.CLT_CLT_FLEXIBLE]: 8.7,
            [JunctionType.CLT_FRAME_RIGID]: 8.7,
            [JunctionType.CLT_FRAME_FLEXIBLE]: 12.2,
            [JunctionType.FRAME_FRAME_RIGID]: 8.7,
            [JunctionType.FRAME_FRAME_FLEXIBLE]: 12.2,
            [JunctionType.TIMBER_CONCRETE]: 5.7,
            [JunctionType.TIMBER_STEEL]: 8.7
        };

        // Classify junction based on element masses
        const avgMass = masses.reduce((a, b) => a + b, 0) / masses.length;
        let classifiedType = junctionType; // Use provided junction type as default
        
        if (avgMass < 150) {
            classifiedType = JunctionType.LIGHTWEIGHT_LIGHTWEIGHT;
        } else if (masses.some(m => m < 150)) {
            classifiedType = JunctionType.RIGID_LIGHTWEIGHT;
        }

        return junctionAttenuations[classifiedType] || 5.7;
    }

    /**
     * Check if construction is supported by DIN 4109
     */
    isConstructionSupported(constructionType: ConstructionTypeStandard): boolean {
        const supportedTypes = [
            ConstructionTypeStandard.MASSIVBAU_BETON,
            ConstructionTypeStandard.MASSIVBAU_ZIEGEL, 
            ConstructionTypeStandard.MASSIVBAU_KALKSANDSTEIN,
            ConstructionTypeStandard.HOLZBAU_MASSIV,
            ConstructionTypeStandard.HOLZBAU_RAHMEN,
            ConstructionTypeStandard.STAHLBAU_SANDWICH
        ];
        
        return supportedTypes.includes(constructionType);
    }

    /**
     * DIN 4109 limit values for different elements and building classes
     */
    private getDIN4109Limits(): any {
        return {
            [ElementType.SEPARATING_WALL]: {
                [BuildingClass.STANDARD]: { Rw: 53, Lnw: null },
                [BuildingClass.INCREASED]: { Rw: 57, Lnw: null },
                [BuildingClass.HIGH]: { Rw: 67, Lnw: null }
            },
            [ElementType.SEPARATING_FLOOR]: {
                [BuildingClass.STANDARD]: { Rw: 54, Lnw: 53 },
                [BuildingClass.INCREASED]: { Rw: 57, Lnw: 46 },
                [BuildingClass.HIGH]: { Rw: 67, Lnw: 37 }
            },
            [ElementType.EXTERIOR_WALL]: {
                [BuildingClass.STANDARD]: { Rw: 35, Lnw: null },  // Varies by location
                [BuildingClass.INCREASED]: { Rw: 40, Lnw: null },
                [BuildingClass.HIGH]: { Rw: 50, Lnw: null }
            },
            [ElementType.INTERIOR_WALL]: {
                [BuildingClass.STANDARD]: { Rw: 42, Lnw: null },
                [BuildingClass.INCREASED]: { Rw: 47, Lnw: null },
                [BuildingClass.HIGH]: { Rw: 57, Lnw: null }
            }
        };
    }

    /**
     * Generate recommendations based on compliance deviations
     */
    private getRecommendations(deviations: StandardDeviation[]): string[] {
        const recommendations: string[] = [];

        for (const deviation of deviations) {
            if (deviation.parameter.includes('Rw')) {
                const deficit = Math.abs(deviation.deviation);
                if (deficit <= 3) {
                    recommendations.push(`Increase mass or improve air tightness for ${deviation.parameter}`);
                } else if (deficit <= 6) {
                    recommendations.push(`Consider double-leaf construction or additional insulation for ${deviation.parameter}`);
                } else {
                    recommendations.push(`Fundamental redesign required for ${deviation.parameter} - consider professional consultation`);
                }
            }
            
            if (deviation.parameter.includes("L'n,w")) {
                const excess = deviation.deviation;
                if (excess <= 3) {
                    recommendations.push(`Add floating floor or improve floor covering for ${deviation.parameter}`);
                } else if (excess <= 6) {
                    recommendations.push(`Implement suspended ceiling with insulation for ${deviation.parameter}`);
                } else {
                    recommendations.push(`Consider complete floor system redesign for ${deviation.parameter}`);
                }
            }
        }

        return recommendations;
    }
}
