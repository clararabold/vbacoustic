import { 
    BuildingElement, 
    AcousticParameters, 
    FlankingPath,
    CalculationResults,
    ElementType
} from '../models/AcousticTypes';
import { MassTimberCalculator } from './MassTimberCalculator';
import { BuildingElementValidator, ValidationResult } from '../validation/BuildingElementValidator';
import { roundVBA } from '../utils/VBAUtils';

/**
 * Wall Element Calculator - VBA clsTrennwand implementation
 * Manages all wall acoustic calculations including flanking transmission
 */
export class WallElementCalculator {
    private validator = new BuildingElementValidator();
    private massTimber = new MassTimberCalculator();
    
    /**
     * Calculate complete acoustic performance for separating wall
     * VBA RStrichw_Trennwand logic
     */
    calculateWallPerformance(params: {
        separatingWall: BuildingElement;
        flankingElements: BuildingElement[];
        flankingResults?: FlankingPath[];
        isDiagonal?: boolean;
    }): CalculationResults {
        const { separatingWall, flankingElements, flankingResults, isDiagonal = false } = params;
        
        // Input validation - VBA checkdata_Trennwand
        const validation = this.validator.validateBuilding({
            separatingElement: separatingWall,
            flankingElements: flankingElements
        });
        
        if (!validation.isValid) {
            throw new Error(`Wall validation failed: ${this.validator.getErrorMessage(validation)}`);
        }
        
        // Calculate direct transmission - VBA logic
        let directTransmission: number;
        if (isDiagonal) {
            // Diagonal room arrangement - no direct transmission
            directTransmission = 0;
        } else {
            // Standard room arrangement
            directTransmission = Math.pow(10, -0.1 * separatingWall.Rw);
        }
        
        // Calculate flanking transmission - VBA logic
        let flankingTransmission = 0;
        if (flankingResults) {
            for (const path of flankingResults) {
                if (path.transmissionValue > 0 && path.isActive) {
                    flankingTransmission += Math.pow(10, -0.1 * path.transmissionValue);
                }
            }
        }
        
        // Combine transmissions - VBA RStrichw calculation
        const totalTransmission = directTransmission + flankingTransmission;
        const combinedRw = totalTransmission > 0 ? -10 * Math.log10(totalTransmission) : separatingWall.Rw;
        
        // Prepare results
        const separatingParams: AcousticParameters = {
            rw: separatingWall.Rw,
            c50: separatingWall.acousticParams?.c50,
            ctr50: separatingWall.acousticParams?.ctr50
        };
        
        const combinedParams: AcousticParameters = {
            rw: roundVBA(combinedRw, 1),
            c50: separatingWall.acousticParams?.c50,
            ctr50: separatingWall.acousticParams?.ctr50
        };
        
        return {
            separating: separatingParams,
            flanking: flankingResults || [],
            combined: combinedParams,
            timestamp: new Date(),
            validationErrors: validation.warnings.map(w => ({
                field: 'validation',
                message: w.message,
                severity: 'warning' as const
            }))
        };
    }
}

/**
 * Building Acoustic Calculator - Main VBA application logic
 * Completes Phase 1 & 2 of VBA to TypeScript conversion
 */
export class BuildingAcousticCalculator {
    private wallCalculator = new WallElementCalculator();
    private validator = new BuildingElementValidator();
    
    /**
     * Calculate acoustic performance - unified VBA logic
     */
    calculate(params: {
        separatingElement: BuildingElement;
        flankingElements: BuildingElement[];
        acousticParams?: AcousticParameters;
        isDiagonal?: boolean;
    }): CalculationResults {
        const { separatingElement, flankingElements, acousticParams, isDiagonal } = params;
        
        // Complete VBA validation implementation
        const validation = this.validator.validateBuilding({
            separatingElement,
            flankingElements,
            acousticParams
        });
        
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${this.validator.getErrorMessage(validation)}`);
        }
        
        // Use wall calculator for complete VBA compatibility
        return this.wallCalculator.calculateWallPerformance({
            separatingWall: separatingElement,
            flankingElements,
            isDiagonal
        });
    }
}
