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
 * ISO 12354 - Building acoustics - Estimation of acoustic performance in buildings from the performance of elements
 * International standard for detailed acoustic calculations
 * Implementation of detailed calculation method with frequency-dependent analysis
 */
export class ISO12354Standard extends AcousticStandard {
    
    constructor() {
        super(StandardType.ISO12354, '2017');
    }

    /**
     * ISO 12354 provides calculation methods but not specific limits
     * Limits should be defined by national standards or building codes
     */
    getLimits(elementType: ElementType, buildingClass: BuildingClass = BuildingClass.STANDARD): StandardLimits {
        // ISO 12354 doesn't specify limits - these are examples based on common practice
        const exampleLimits = this.getExampleLimits();
        
        if (!exampleLimits[elementType]) {
            throw new Error(`Element type '${elementType}' not defined for ISO 12354 calculation`);
        }

        const elementLimits = exampleLimits[elementType][buildingClass] || exampleLimits[elementType][BuildingClass.STANDARD];
        
        return {
            minRw: elementLimits.Rw,
            maxLnw: elementLimits.Lnw,
            frequencyRange: { min: 50, max: 5000 },  // Extended frequency range
            uncertainty: 1.5  // More precise calculation method
        };
    }

    /**
     * Detailed validation using frequency-dependent analysis
     */
    validateResults(results: any): StandardValidationResult {
        const deviations: StandardDeviation[] = [];
        
        // Frequency-dependent validation
        if (results.frequencyData) {
            const frequencies = [125, 250, 500, 1000, 2000, 4000];
            
            for (const freq of frequencies) {
                const freqData = results.frequencyData[freq];
                if (freqData) {
                    // Check for frequency-dependent compliance
                    const minRequired = this.getFrequencyLimits(freq);
                    if (freqData.R < minRequired.minR) {
                        deviations.push({
                            parameter: `Sound reduction at ${freq} Hz`,
                            required: minRequired.minR,
                            actual: freqData.R,
                            deviation: freqData.R - minRequired.minR,
                            severity: freqData.R < minRequired.minR - 3 ? 'critical' : 'error'
                        });
                    }
                }
            }
        }

        // Single-number validation as fallback
        if (results.singleNumber) {
            const limits = this.getLimits(ElementType.SEPARATING_WALL);
            if (results.singleNumber.Rw < limits.minRw) {
                deviations.push({
                    parameter: 'Weighted sound reduction Rw',
                    required: limits.minRw,
                    actual: results.singleNumber.Rw,
                    deviation: results.singleNumber.Rw - limits.minRw,
                    severity: 'error'
                });
            }
        }

        return {
            isCompliant: deviations.length === 0,
            deviations,
            recommendedActions: this.getDetailedRecommendations(deviations, results),
            standard: this.type
        };
    }

    /**
     * ISO 12354 applies detailed corrections based on element properties
     */
    applyStandardCorrections(baseValue: number, context: any): number {
        let correctedValue = baseValue;

        // Apply flanking transmission corrections
        if (context.flankingTransmission) {
            const flankingCorrection = this.calculateFlankingCorrection(context.flankingTransmission);
            correctedValue = this.combineLogarithmicValues([correctedValue, flankingCorrection]);
        }

        // Apply junction corrections based on detailed geometry
        if (context.junctionGeometry) {
            const junctionCorrection = this.calculateJunctionCorrection(context.junctionGeometry);
            correctedValue += junctionCorrection;
        }

        // Apply frequency-dependent corrections
        if (context.frequencyCorrections) {
            correctedValue = this.applyFrequencyCorrections(correctedValue, context.frequencyCorrections);
        }

        return correctedValue;
    }

    /**
     * ISO 12354 detailed junction attenuation calculation
     */
    getJunctionAttenuation(junctionType: JunctionType, masses: number[]): number {
        // Detailed calculation based on ISO 12354-1 Annex E
        const baseAttenuation = this.getBaseJunctionAttenuation(junctionType);
        const massCorrection = this.calculateMassCorrection(masses);
        
        return baseAttenuation + massCorrection;
    }

    /**
     * ISO 12354 supports detailed analysis of various construction types
     */
    isConstructionSupported(constructionType: ConstructionTypeStandard): boolean {
        const supportedTypes = [
            ConstructionTypeStandard.CONCRETE_MONOLITHIC,
            ConstructionTypeStandard.CONCRETE_SANDWICH,
            ConstructionTypeStandard.MASONRY_SINGLE,
            ConstructionTypeStandard.MASONRY_DOUBLE,
            ConstructionTypeStandard.TIMBER_FRAME,
            ConstructionTypeStandard.TIMBER_MASSIVE,
            ConstructionTypeStandard.STEEL_FRAME,
            ConstructionTypeStandard.MIXED_CONSTRUCTION
        ];
        
        return supportedTypes.includes(constructionType);
    }

    /**
     * Calculate flanking transmission correction
     */
    private calculateFlankingCorrection(flankingData: any): number {
        // Simplified flanking calculation - in practice this would be much more complex
        let totalFlanking = 0;
        
        if (flankingData.paths) {
            for (const path of flankingData.paths) {
                const pathContribution = path.Rw - path.Kij;
                totalFlanking += Math.pow(10, -pathContribution / 10);
            }
        }
        
        return totalFlanking > 0 ? -10 * Math.log10(totalFlanking) : 0;
    }

    /**
     * Calculate junction geometry correction
     */
    private calculateJunctionCorrection(geometry: any): number {
        // Simplified geometry correction
        let correction = 0;
        
        if (geometry.angle && geometry.angle !== 90) {
            correction += (90 - geometry.angle) * 0.1; // Approximate angle correction
        }
        
        if (geometry.thickness) {
            correction += Math.log10(geometry.thickness / 200) * 5; // Thickness correction
        }
        
        return correction;
    }

    /**
     * Apply frequency-dependent corrections
     */
    private applyFrequencyCorrections(baseValue: number, corrections: any): number {
        // This would apply detailed frequency corrections in practice
        return baseValue + (corrections.averageCorrection || 0);
    }

    /**
     * Base junction attenuation values from ISO 12354
     */
    private getBaseJunctionAttenuation(junctionType: JunctionType): number {
        const baseAttenuations: Record<JunctionType, number> = {
            [JunctionType.CROSS_RIGID]: 5.7,
            [JunctionType.CROSS_FLEXIBLE]: 8.7,
            [JunctionType.TEE_RIGID]: 8.7,
            [JunctionType.TEE_FLEXIBLE]: 12.2,
            [JunctionType.CORNER_RIGID]: 5.7,
            [JunctionType.CORNER_FLEXIBLE]: 8.7,
            [JunctionType.RIGID_RIGID]: 5.7,
            [JunctionType.RIGID_LIGHTWEIGHT]: 8.7,
            [JunctionType.LIGHTWEIGHT_LIGHTWEIGHT]: 10.8,
            [JunctionType.CLT_CLT_RIGID]: 5.7,
            [JunctionType.CLT_CLT_FLEXIBLE]: 8.7,
            [JunctionType.CLT_FRAME_RIGID]: 8.7,
            [JunctionType.CLT_FRAME_FLEXIBLE]: 12.2,
            [JunctionType.FRAME_FRAME_RIGID]: 8.7,
            [JunctionType.FRAME_FRAME_FLEXIBLE]: 12.2,
            [JunctionType.TIMBER_CONCRETE]: 5.7,
            [JunctionType.TIMBER_STEEL]: 8.7
        };
        
        return baseAttenuations[junctionType] || 5.7;
    }

    /**
     * Calculate mass-dependent correction
     */
    private calculateMassCorrection(masses: number[]): number {
        if (masses.length < 2) return 0;
        
        const mass1 = masses[0];
        const mass2 = masses[1];
        const massRatio = Math.max(mass1, mass2) / Math.min(mass1, mass2);
        
        // ISO 12354 mass correction formula (simplified)
        return Math.min(5, Math.log10(massRatio) * 10);
    }

    /**
     * Combine logarithmic values (sound levels)
     */
    private combineLogarithmicValues(values: number[]): number {
        const sum = values.reduce((total, value) => total + Math.pow(10, -value / 10), 0);
        return -10 * Math.log10(sum);
    }

    /**
     * Get frequency-specific limits
     */
    private getFrequencyLimits(frequency: number): { minR: number } {
        // Example frequency-dependent limits
        const limits: Record<number, number> = {
            125: 30,
            250: 35,
            500: 40,
            1000: 45,
            2000: 50,
            4000: 55
        };
        
        return { minR: limits[frequency] || 40 };
    }

    /**
     * Example limits for ISO 12354 calculations
     */
    private getExampleLimits(): any {
        return {
            [ElementType.SEPARATING_WALL]: {
                [BuildingClass.STANDARD]: { Rw: 50, Lnw: null },
                [BuildingClass.HIGH]: { Rw: 60, Lnw: null }
            },
            [ElementType.SEPARATING_FLOOR]: {
                [BuildingClass.STANDARD]: { Rw: 50, Lnw: 55 },
                [BuildingClass.HIGH]: { Rw: 60, Lnw: 45 }
            }
        };
    }

    /**
     * Generate detailed recommendations based on ISO 12354 analysis
     */
    private getDetailedRecommendations(deviations: StandardDeviation[], results: any): string[] {
        const recommendations: string[] = [];

        // Frequency-specific recommendations
        const lowFreqIssues = deviations.filter(d => d.parameter.includes('125 Hz') || d.parameter.includes('250 Hz'));
        const highFreqIssues = deviations.filter(d => d.parameter.includes('2000 Hz') || d.parameter.includes('4000 Hz'));

        if (lowFreqIssues.length > 0) {
            recommendations.push('Low frequency performance issues detected - consider increasing mass or cavity depth');
        }

        if (highFreqIssues.length > 0) {
            recommendations.push('High frequency performance issues detected - check air tightness and connection details');
        }

        // Flanking-specific recommendations
        if (results.flankingAnalysis) {
            recommendations.push('Consider detailed flanking path analysis per ISO 12354-1 for optimization');
        }

        return recommendations;
    }
}
