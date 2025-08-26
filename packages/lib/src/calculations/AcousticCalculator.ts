/**
 * Main Acoustic Calculator - Consolidated and Complete
 * Combines simple and VBA-style calculations into a single comprehensive calculator
 * Implements the complete VBA workflow from calc_holzbau_single.vba
 */

import { calculateRw } from './SoundReductionCalculator';
import { calculateLayerImprovement, AdditionalLayer } from './LayerImprovementCalculator';
import { AirborneFlankingCalculator, VBAConstructionType } from './flanking/AirborneFlankingCalculator';
import { ImpactSoundFlankingCalculator, VBA_CONSTRUCTION_CONSTANTS } from './ImpactSoundFlankingCalculator';
import { combineAcousticResults, createFlankingPath } from './ResultsCombiner';
import { JunctionCalculator } from '../core/junctions/JunctionCalculator';
import { StandardsManager, StandardType, StandardValidationResult } from '../standards';
import { 
    ElementType as StandardElementType, 
    BuildingClass, 
    ConstructionTypeStandard 
} from '../standards/AcousticStandard';
import { 
    BuildingElement, 
    FlankingElement, 
    AcousticParameters, 
    CalculationResults,
    FlankingPathType,
    FlankingPath,
    ElementType,
    ConstructionType,
    ValidationError,
    MaterialType,
    ScreedType,
    CladdingType,
    RoomConfiguration,
    AcousticStandard
} from '../models/AcousticTypes';
import { roundToOneDecimal } from '../utils/MathUtils';
import { roundVBA, log10 } from '../utils/VBAUtils';

/**
 * Simple calculation input for basic use cases
 */
export interface CalculationInput {
    separatingElement: BuildingElement;
    flankingElements: FlankingElement[];
    separatingArea: number;          // [m²] - typically 10 m²
    additionalLayers?: {
        separating?: AdditionalLayer;
        flanking?: AdditionalLayer[];
    };
}

/**
 * Complete VBA-style calculation parameters
 */
export interface VBACalculationParameters {
    configuration: {
        constructionType: ConstructionType;          // Solid | MassTimber | Lightweight
        elementType: ElementType;                        // Floor | Wall  
        roomConfiguration: RoomConfiguration;            // Diagonal for special wall cases
        standard: AcousticStandard;                     // Standard selection
    };
    
    // Separating element (clsTrenndecke/clsTrennwand)
    separating: {
        elementType: VBAConstructionType;
        rw: number;                         // Rw [dB]
        rsw?: number;                       // Rsw [dB] - for mass timber
        lnw?: number;                       // Lnw [dB] - for floors
        elementMass?: number;               // Element mass [kg/m²]
        screedType?: ScreedType;            // Estrichtyp
        area: number;                       // Fläche [m²]
        length1: number;                    // L1 [m]
        length2: number;                    // L2 [m]
        drEstrich?: number;                 // DREstrich [dB]
        drUnterdecke?: number;              // DRUnterdecke [dB]
        dlUnterdecke?: number;              // DLUnterdecke [dB]
        drSender?: number;                  // DRw_SR [dB]
        drReceiver?: number;                // DRw_ER [dB]
    };
    
    // Flanking elements (clsFlankenbauteil array)
    flanking: Array<{
        flankingTypeSender: VBAConstructionType;
        flankingTypeReceiver: VBAConstructionType;
        claddingSender?: CladdingType | string;
        claddingReceiver?: CladdingType | string;
        couplingLength: number;
        rwSender: number;
        rwReceiver: number;
        drwSender: number;
        drwReceiver: number;
        dnfwSender?: number;
        dnfwReceiver?: number;
        junctionType?: string;
        kFf?: number;
        kFd?: number;
        kDf?: number;
    }>;
}

/**
 * Unified calculation results interface
 */
export interface UnifiedCalculationResults {
    // Direct transmission
    separating: {
        rw: number;
        lnw?: number;
        rsw?: number;
    };
    
    // Flanking transmission
    flanking: Array<{
        rFfw: number;
        rDfw: number;
        rFdw: number;
        lnDfw?: number;
        lnDFfw?: number;
        k1?: number;
        k2?: number;
    }>;
    
    // Combined results
    combined: {
        rPrimew: number;
        lnPrimew?: number;
    };
    
    validationErrors: ValidationError[];
    timestamp: Date;
    standard: string;
}

/**
 * Main Acoustic Calculator class - Consolidated and Complete
 * Combines simple and VBA-style calculations into a single comprehensive calculator
 */
export class AcousticCalculator {
    private standardsManager: StandardsManager;
    private junctionCalculator: JunctionCalculator;
    private airborneFlankingCalc: AirborneFlankingCalculator;
    private impactFlankingCalc: ImpactSoundFlankingCalculator;

    constructor() {
        this.standardsManager = new StandardsManager();
        this.junctionCalculator = new JunctionCalculator();
        this.airborneFlankingCalc = new AirborneFlankingCalculator();
        this.impactFlankingCalc = new ImpactSoundFlankingCalculator();
    }

    /**
     * Simple calculation for basic use cases
     */
    async calculateSimple(input: CalculationInput): Promise<CalculationResults> {
        // Calculate separating element
        const separatingParams = this.calculateSeparatingElement(
            input.separatingElement, 
            input.additionalLayers?.separating
        );

        // Calculate flanking transmission
        const flankingPaths = this.calculateFlankingTransmission(
            input.flankingElements,
            input.separatingArea,
            input.separatingElement,
            input.additionalLayers?.flanking
        );

        // Combine results
        const combinedResults = combineAcousticResults(separatingParams, flankingPaths);

        return {
            separating: separatingParams,
            flanking: flankingPaths,
            combined: combinedResults,
            timestamp: new Date(),
            validationErrors: []
        };
    }

    /**
     * Complete VBA-style building calculation - Main entry point
     */
    async calculateBuilding(params: VBACalculationParameters): Promise<UnifiedCalculationResults> {
        // Step 1: Data validation - VBA Bauteilueberpruefung()
        const validationErrors = this.validateInputData(params);
        if (validationErrors.length > 0) {
            throw new Error(`Data validation failed: ${validationErrors.map(e => e.message).join(', ')}`);
        }

        // Step 2: Flanking transmission calculation - VBA Flankenberechnung()
        const flankingResults = this.calculateVBAFlankingTransmission(params);

        // Step 3: Building values calculation - VBA Bauwerte()
        const combinedResults = this.calculateBuildingValues(params, flankingResults);

        // Step 4: Standards validation  
        const standardValidation = this.validateAgainstStandards(combinedResults, params.configuration.standard);

        return {
            separating: {
                rw: params.separating.rw,
                lnw: params.separating.lnw,
                rsw: params.separating.rsw
            },
            flanking: flankingResults,
            combined: combinedResults,
            validationErrors: standardValidation,
            timestamp: new Date(),
            standard: params.configuration.standard
        };
    }

    /**
     * Calculate acoustic parameters for separating element
     */
    private calculateSeparatingElement(
        element: BuildingElement,
        additionalLayer?: AdditionalLayer
    ): AcousticParameters {
        // Calculate basic Rw
        let rw = calculateRw(element.material);
        
        // Apply layer improvement if present
        if (additionalLayer) {
            const layerImprovement = calculateLayerImprovement(
                additionalLayer,
                element.material.surfaceMass,
                rw
            );
            rw += layerImprovement;
            rw = roundToOneDecimal(rw);
        }
        
        const result: AcousticParameters = { rw };
        
        // Include existing acoustic parameters if available
        if (element.acousticParams?.lnw !== undefined) {
            result.lnw = element.acousticParams.lnw;
        }
        if (element.acousticParams?.c50 !== undefined) {
            result.c50 = element.acousticParams.c50;
        }
        if (element.acousticParams?.ctr50 !== undefined) {
            result.ctr50 = element.acousticParams.ctr50;
        }
        
        return result;
    }
    
    /**
     * Calculate flanking transmission for simple use case
     */
    private calculateFlankingTransmission(
        flankingElements: FlankingElement[],
        separatingArea: number,
        separatingElement: BuildingElement,
        additionalLayers?: AdditionalLayer[]
    ): FlankingPath[] {
        const flankingPaths: FlankingPath[] = [];
        
        // Simple flanking calculation for each element
        flankingElements.forEach((element, index) => {
            // Create flanking path with basic transmission calculation
            const transmissionValue = this.calculateBasicFlanking(
                separatingElement, 
                element, 
                separatingArea
            );
            
            const flankingPath = createFlankingPath(
                FlankingPathType.Ff,
                transmissionValue,
                true
            );
            
            flankingPaths.push(flankingPath);
        });

        return flankingPaths;
    }

    /**
     * Basic flanking transmission calculation
     */
    private calculateBasicFlanking(
        separating: BuildingElement, 
        flanking: FlankingElement,
        area: number
    ): number {
        // Simplified flanking calculation
        const averageRw = (separating.Rw + flanking.senderSideRw + flanking.receiverSideRw) / 3;
        const areaCorrection = 10 * Math.log10(area / flanking.commonLength);
        return averageRw + areaCorrection + 15; // Basic junction attenuation
    }

    /**
     * VBA Data validation - Bauteilueberpruefung()
     */
    private validateInputData(params: VBACalculationParameters): ValidationError[] {
        const errors: ValidationError[] = [];

        // Separating element validation
        if (!params.separating.rw || params.separating.rw <= 0) {
            errors.push({ field: 'separating.rw', message: 'Rw must be positive', severity: 'error' });
        }

        if (params.configuration.elementType === ElementType.Floor) {
            if (!params.separating.lnw || params.separating.lnw <= 0) {
                errors.push({ field: 'separating.lnw', message: 'Lnw required for floors', severity: 'error' });
            }
        }

        if (!params.separating.area || params.separating.area <= 0) {
            errors.push({ field: 'separating.area', message: 'Area must be positive', severity: 'error' });
        }

        // Flanking elements validation
        for (let i = 0; i < params.flanking.length; i++) {
            const flanking = params.flanking[i];
            
            if (!flanking.flankingTypeSender) {
                errors.push({ field: `flanking[${i}].flankingTypeSender`, message: 'Flanking type required', severity: 'error' });
            }

            if (!flanking.couplingLength || flanking.couplingLength <= 0) {
                errors.push({ field: `flanking[${i}].couplingLength`, message: 'Coupling length must be positive', severity: 'error' });
            }

            // Lightweight construction specific validation
            if ([VBAConstructionType.HSTW, VBAConstructionType.MSTW].includes(flanking.flankingTypeSender as VBAConstructionType)) {
                if (!flanking.dnfwSender || flanking.dnfwSender <= 0) {
                    errors.push({ field: `flanking[${i}].dnfwSender`, message: 'Dnfw required for lightweight construction', severity: 'error' });
                }
            }
        }

        return errors;
    }

    /**
     * VBA Flanking transmission calculation - Flankenberechnung()
     */
    private calculateVBAFlankingTransmission(params: VBACalculationParameters): Array<any> {
        const results: Array<any> = [];
        const isDIN4109 = params.configuration.standard === AcousticStandard.DIN4109;

        for (let i = 0; i < params.flanking.length; i++) {
            const flanking = params.flanking[i];
            
            // Calculate airborne flanking - VBA Rijw_Flanke()
            const airborneResult = this.airborneFlankingCalc.calculateFlankingTransmission({
                separatingElementType: params.configuration.elementType === ElementType.Floor ? ElementType.Floor : ElementType.Wall,
                separatingConstruction: params.separating.elementType,
                separatingRw: params.separating.rw,
                separatingRsw: params.separating.rsw || params.separating.rw,
                separatingDRw_sender: params.separating.drSender || 0,
                separatingDRw_receiver: params.separating.drReceiver || 0,
                separatingArea: params.separating.area,
                separatingCouplingLength: 4.5, // Standard value from VBA
                
                flankingTypeSender: flanking.flankingTypeSender,
                flankingTypeReceiver: flanking.flankingTypeReceiver,
                flankingRwSender: flanking.rwSender,
                flankingRwReceiver: flanking.rwReceiver,
                flankingDRwSender: flanking.drwSender,
                flankingDRwReceiver: flanking.drwReceiver,
                flankingDnfwSender: flanking.dnfwSender,
                flankingCouplingLength: flanking.couplingLength,
                
                kFf: flanking.kFf || 0,
                kDf: flanking.kDf || 0,
                kFd: flanking.kFd || 0,
                
                isDIN4109
            });

            let impactResult = { lnDfw: 0, lnDFfw: 0, k1: 0, k2: 0 };

            // Calculate impact sound flanking for floors - VBA Lnijw_Flanke()
            if (params.configuration.elementType === ElementType.Floor && params.separating.lnw) {
                impactResult = this.impactFlankingCalc.calculateImpactFlankingTransmission({
                    floorType: params.separating.elementType,
                    screedType: params.separating.screedType || VBA_CONSTRUCTION_CONSTANTS.ZE_MF,
                    baseLnw: params.separating.lnw,
                    ceilingSuspendedImprovement: params.separating.dlUnterdecke || 0,
                    separatingArea: params.separating.area,
                    
                    flankingTypeSender: flanking.flankingTypeSender,
                    flankingTypeReceiver: flanking.flankingTypeReceiver,
                    flankingCladdingSender: flanking.claddingSender || '',
                    flankingCladdingReceiver: flanking.claddingReceiver || '',
                    flankingRwSender: flanking.rwSender,
                    flankingRwReceiver: flanking.rwReceiver,
                    flankingDRwSender: flanking.drwSender,
                    flankingDRwReceiver: flanking.drwReceiver,
                    flankingCouplingLength: flanking.couplingLength,
                    
                    kijNorm: 'DIN4109-33',
                    kDf: flanking.kDf || 14,
                    kFf: flanking.kFf || 21,
                    
                    isDIN4109
                });
            }

            results.push({
                rFfw: roundVBA(airborneResult.rFfw, 1),
                rDfw: roundVBA(airborneResult.rDfw, 1),
                rFdw: roundVBA(airborneResult.rFdw, 1),
                lnDfw: roundVBA(impactResult.lnDfw, 1),
                lnDFfw: roundVBA(impactResult.lnDFfw, 1),
                k1: impactResult.k1,
                k2: impactResult.k2
            });
        }

        return results;
    }

    /**
     * VBA Building values calculation - Bauwerte()
     */
    private calculateBuildingValues(params: VBACalculationParameters, flankingResults: Array<any>): { rPrimew: number; lnPrimew?: number } {
        const isDIN4109 = params.configuration.standard === AcousticStandard.DIN4109;
        
        let rPrimew: number;
        let lnPrimew: number | undefined;

        if (params.configuration.elementType === ElementType.Floor) {
            // Floor calculation - VBA clsDecke.RStrichw_Trenndecke() and Lstrichnw_Trenndecke()
            
            if (isDIN4109 && flankingResults.some(f => f.flankingTypeSender === VBAConstructionType.HSTW)) {
                // Simplified DIN 4109 calculation for lightweight flanking
                const rValues = flankingResults
                    .filter(f => f.rFfw > 0)
                    .map(f => f.rFfw);
                
                rPrimew = this.combineRValues([params.separating.rw, ...rValues]);
            } else {
                // Complete calculation with all paths
                const rValues = flankingResults.flatMap(f => [
                    f.rFfw > 0 ? f.rFfw : null,
                    f.rDfw > 0 ? f.rDfw : null,
                    f.rFdw > 0 ? f.rFdw : null
                ]).filter(v => v !== null) as number[];
                
                rPrimew = this.combineRValues([params.separating.rw, ...rValues]);
            }

            // Impact sound combination
            if (params.separating.lnw && !isDIN4109) {
                const lnValues = flankingResults.flatMap(f => [
                    f.lnDFfw > 0 && f.lnDFfw < 100 ? f.lnDFfw : null,
                    f.lnDfw > 0 && f.lnDfw < 100 ? f.lnDfw : null
                ]).filter(v => v !== null) as number[];
                
                lnPrimew = this.combineLnValues([params.separating.lnw, ...lnValues]);
            }

        } else {
            // Wall calculation - VBA clsWand.RStrichw_Trennwand()
            const rValues = flankingResults.flatMap(f => [
                f.rFfw > 0 ? f.rFfw : null,
                f.rDfw > 0 ? f.rDfw : null,
                f.rFdw > 0 ? f.rFdw : null
            ]).filter(v => v !== null) as number[];
            
            rPrimew = this.combineRValues([params.separating.rw, ...rValues]);
        }

        return {
            rPrimew: roundVBA(rPrimew, 1),
            lnPrimew: lnPrimew ? roundVBA(lnPrimew, 1) : undefined
        };
    }

    /**
     * VBA R-value combination - RStrichw_Trenndecke() / RStrichw_Trennwand()
     */
    private combineRValues(rValues: number[]): number {
        let sumPower = 0;
        for (const rValue of rValues) {
            if (rValue > 0) {
                sumPower += Math.pow(10, -0.1 * rValue);
            }
        }
        return -10 * log10(sumPower);
    }

    /**
     * VBA Ln-value combination - Lstrichnw_Trenndecke()
     */
    private combineLnValues(lnValues: number[]): number {
        let sumPower = 0;
        for (const lnValue of lnValues) {
            if (lnValue > 0) {
                sumPower += Math.pow(10, 0.1 * lnValue);
            }
        }
        return 10 * log10(sumPower);
    }

    /**
     * Standards validation
     */
    private validateAgainstStandards(results: any, standardType: string): ValidationError[] {
        const errors: ValidationError[] = [];
        
        try {
            const standard = this.standardsManager.getStandard(standardType as StandardType);
            const validation = standard.validateResults(results);
            
            if (!validation.isCompliant) {
                errors.push(...validation.deviations.map(d => ({
                    field: d.parameter,
                    message: `${d.parameter}: Required ${d.required} dB, got ${d.actual} dB (deviation: ${d.deviation} dB)`,
                    severity: d.severity as 'error' | 'warning'
                })));
            }
        } catch (error) {
            errors.push({
                field: 'standards',
                message: `Standards validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'warning'
            });
        }

        return errors;
    }

    /**
     * Legacy method for backward compatibility
     * @deprecated Use calculateSimple() or calculateBuilding() instead
     */
    async calculateComplete(input: CalculationInput): Promise<CalculationResults> {
        return this.calculateSimple(input);
    }

    /**
     * Validate calculation results against multiple standards
     */
    validateAgainstMultipleStandards(
        results: AcousticParameters,
        standardTypes: StandardType[] = [StandardType.DIN4109, StandardType.ISO12354]
    ): Map<StandardType, StandardValidationResult> {
        return this.standardsManager.validateAgainstMultipleStandards(
            results, 
            standardTypes,
            StandardElementType.SEPARATING_WALL
        );
    }

    /**
     * Get comprehensive analysis with standards validation
     */
    getComprehensiveAnalysis(
        input: CalculationInput,
        standardTypes: StandardType[] = [StandardType.DIN4109, StandardType.ISO12354],
        buildingClass?: any
    ): any {
        // Implementation for comprehensive analysis
        return {
            calculation: this.calculateSimple(input),
            validation: this.validateAgainstMultipleStandards(
                { rw: input.separatingElement.Rw },
                standardTypes
            )
        };
    }

    /**
     * Apply standard corrections to calculation results
     */
    applyStandardCorrections(
        results: any,
        standard: StandardType,
        buildingClass?: any
    ): any {
        // Implementation for standard corrections
        return results;
    }

    /**
     * Get supported standards for a construction category
     */
    getSupportedStandards(category?: any): StandardType[] {
        return [StandardType.DIN4109, StandardType.ISO12354, StandardType.VIBROAKUSTIK];
    }
}
