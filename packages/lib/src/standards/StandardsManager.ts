import { DIN4109Standard } from './DIN4109Standard';
import { ISO12354Standard } from './ISO12354Standard';
import { VIBROAKUSTIKStandard } from './VIBROAKUSTIKStandard';
import { 
    AcousticStandard, 
    StandardType, 
    StandardValidationResult,
    ElementType,
    BuildingClass,
    JunctionType,
    ConstructionTypeStandard
} from './AcousticStandard';

/**
 * Factory and registry for acoustic calculation standards
 * Provides unified access to different acoustic standards and their implementations
 */
export class StandardsManager {
    private standards: Map<StandardType, AcousticStandard> = new Map();

    constructor() {
        this.initializeStandards();
    }

    /**
     * Initialize all supported standards
     */
    private initializeStandards(): void {
        this.standards.set(StandardType.DIN4109, new DIN4109Standard());
        this.standards.set(StandardType.ISO12354, new ISO12354Standard());
        this.standards.set(StandardType.VIBROAKUSTIK, new VIBROAKUSTIKStandard());
    }

    /**
     * Get a specific standard implementation
     */
    getStandard(type: StandardType): AcousticStandard {
        const standard = this.standards.get(type);
        if (!standard) {
            throw new Error(`Standard ${type} is not supported`);
        }
        return standard;
    }

    /**
     * Get all available standards
     */
    getAvailableStandards(): StandardType[] {
        return Array.from(this.standards.keys());
    }

    /**
     * Validate results against multiple standards
     */
    validateAgainstMultipleStandards(
        results: any, 
        standardTypes: StandardType[],
        elementType: ElementType = ElementType.SEPARATING_WALL,
        buildingClass: BuildingClass = BuildingClass.STANDARD
    ): Map<StandardType, StandardValidationResult> {
        const validationResults = new Map<StandardType, StandardValidationResult>();

        for (const standardType of standardTypes) {
            try {
                const standard = this.getStandard(standardType);
                const validation = standard.validateResults(results);
                validationResults.set(standardType, validation);
            } catch (error) {
                // Create error result for failed validation
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                validationResults.set(standardType, {
                    isCompliant: false,
                    deviations: [{
                        parameter: 'Standard validation',
                        required: 0,
                        actual: 0,
                        deviation: 0,
                        severity: 'critical'
                    }],
                    recommendedActions: [`Failed to validate against ${standardType}: ${errorMessage}`],
                    standard: standardType
                });
            }
        }

        return validationResults;
    }

    /**
     * Get recommended standard based on construction type and location
     */
    getRecommendedStandard(constructionType: ConstructionTypeStandard, location?: string): StandardType {
        // Simple recommendation logic - in practice this would be more sophisticated
        if (location?.toLowerCase().includes('germany') || location?.toLowerCase().includes('austria')) {
            if (constructionType === ConstructionTypeStandard.CLT_SOLID || 
                constructionType === ConstructionTypeStandard.CLT_CAVITY ||
                constructionType === ConstructionTypeStandard.TIMBER_FRAME ||
                constructionType === ConstructionTypeStandard.TIMBER_MASSIVE ||
                constructionType === ConstructionTypeStandard.HOLZBAU_MASSIV ||
                constructionType === ConstructionTypeStandard.HOLZBAU_RAHMEN) {
                return StandardType.VIBROAKUSTIK;
            }
            return StandardType.DIN4109;
        }

        // International or detailed analysis
        if (constructionType === ConstructionTypeStandard.MIXED_CONSTRUCTION) {
            return StandardType.ISO12354;
        }

        // Default to DIN 4109 for simplicity
        return StandardType.DIN4109;
    }

    /**
     * Compare limits across different standards
     */
    compareLimitsAcrossStandards(
        elementType: ElementType, 
        buildingClass: BuildingClass = BuildingClass.STANDARD
    ): Map<StandardType, { minRw: number; maxLnw: number | null; uncertainty: number }> {
        const limitsComparison = new Map();

        this.standards.forEach((standard, standardType) => {
            try {
                // Try to get a matching construction type for this element
                const constructionType = this.getConstructionTypeForElement(elementType);
                
                if (standard.isConstructionSupported(constructionType)) {
                    const limits = standard.getLimits(elementType, buildingClass);
                    limitsComparison.set(standardType, {
                        minRw: limits.minRw,
                        maxLnw: limits.maxLnw,
                        uncertainty: limits.uncertainty || 0
                    });
                }
            } catch (error) {
                // Skip standards that don't support this element type
                return;
            }
        });

        return limitsComparison;
    }

    /**
     * Get junction attenuation comparison across standards
     */
    compareJunctionAttenuations(
        junctionType: JunctionType,
        masses: number[]
    ): Map<StandardType, number> {
        const attenuations = new Map<StandardType, number>();

        this.standards.forEach((standard, standardType) => {
            try {
                const attenuation = standard.getJunctionAttenuation(junctionType, masses);
                attenuations.set(standardType, attenuation);
            } catch (error) {
                // Skip standards that can't calculate this junction type
                return;
            }
        });

        return attenuations;
    }

    /**
     * Apply corrections from a specific standard
     */
    applyStandardCorrections(
        standardType: StandardType,
        baseValue: number,
        context: any
    ): number {
        const standard = this.getStandard(standardType);
        return standard.applyStandardCorrections(baseValue, context);
    }

    /**
     * Check if a construction type is supported by any standard
     */
    isConstructionSupported(constructionType: ConstructionTypeStandard): StandardType[] {
        const supportingStandards: StandardType[] = [];

        this.standards.forEach((standard, standardType) => {
            if (standard.isConstructionSupported(constructionType)) {
                supportingStandards.push(standardType);
            }
        });

        return supportingStandards;
    }

    /**
     * Get comprehensive analysis across all applicable standards
     */
    getComprehensiveAnalysis(
        results: any,
        constructionType: ConstructionTypeStandard,
        elementType: ElementType = ElementType.SEPARATING_WALL,
        buildingClass: BuildingClass = BuildingClass.STANDARD
    ): {
        supportingStandards: StandardType[];
        validationResults: Map<StandardType, StandardValidationResult>;
        limitsComparison: Map<StandardType, any>;
        recommendedStandard: StandardType;
        summary: {
            overallCompliant: boolean;
            mostRestrictive: StandardType | null;
            leastRestrictive: StandardType | null;
            averageUncertainty: number;
        };
    } {
        const supportingStandards = this.isConstructionSupported(constructionType);
        const validationResults = this.validateAgainstMultipleStandards(results, supportingStandards, elementType, buildingClass);
        const limitsComparison = this.compareLimitsAcrossStandards(elementType, buildingClass);
        const recommendedStandard = this.getRecommendedStandard(constructionType);

        // Calculate summary statistics
        const compliantStandards = Array.from(validationResults.values()).filter(v => v.isCompliant).length;
        const overallCompliant = compliantStandards === supportingStandards.length;

        let mostRestrictive: StandardType | null = null;
        let leastRestrictive: StandardType | null = null;
        let highestMinRw = -Infinity;
        let lowestMinRw = Infinity;
        let totalUncertainty = 0;
        let uncertaintyCount = 0;

        limitsComparison.forEach((limits, standardType) => {
            if (limits.minRw > highestMinRw) {
                highestMinRw = limits.minRw;
                mostRestrictive = standardType;
            }
            if (limits.minRw < lowestMinRw) {
                lowestMinRw = limits.minRw;
                leastRestrictive = standardType;
            }
            if (limits.uncertainty) {
                totalUncertainty += limits.uncertainty;
                uncertaintyCount++;
            }
        });

        return {
            supportingStandards,
            validationResults,
            limitsComparison,
            recommendedStandard,
            summary: {
                overallCompliant,
                mostRestrictive,
                leastRestrictive,
                averageUncertainty: uncertaintyCount > 0 ? totalUncertainty / uncertaintyCount : 0
            }
        };
    }

    /**
     * Get construction type for element (helper method)
     */
    private getConstructionTypeForElement(elementType: ElementType): ConstructionTypeStandard {
        switch (elementType) {
            case ElementType.TIMBER_WALL:
            case ElementType.TIMBER_FLOOR:
            case ElementType.TIMBER_FRAME_WALL:
            case ElementType.TIMBER_FRAME_FLOOR:
                return ConstructionTypeStandard.TIMBER_FRAME;
            default:
                return ConstructionTypeStandard.MASONRY_SINGLE;
        }
    }

}
