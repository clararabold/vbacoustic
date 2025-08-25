import { log10, roundToOneDecimal } from '../utils/MathUtils';

/**
 * Impact Sound Calculator - Complete VBA implementation
 * Handles floating floor improvements (DLw) and ceiling adjustments
 */

export enum ScreedType {
    CEMENT_MINERAL_FIBER = 'cement_mineral_fiber',  // Zementestrich auf Mineralfaser
    CEMENT_WOOD_FIBER = 'cement_wood_fiber',        // Zementestrich auf Holzfaser  
    GUSSASPHALT = 'gussasphalt',                    // Gussasphalt-, Fertigteilestrich
    DRY_SCREED = 'dry_screed'                       // Trockenestrich
}

export enum CeilingConfiguration {
    WITHOUT_SUSPENDED = 'without_suspended',         // ohne Unterdecke
    WITH_SUSPENDED = 'with_suspended'               // mit Unterdecke
}

export interface FloatingFloorParams {
    screedThickness: number;     // s [m]
    screedMass: number;         // M [kg/m²] 
    screedType: ScreedType;
}

export interface CeilingAdjustmentParams {
    baseLnw: number;            // Base impact sound level [dB]
    separatingMass: number;     // ms - mass of separating element [kg/m²]
    flankingMass: number;       // mfm - mass of flanking element [kg/m²]
    ceilingConfig: CeilingConfiguration;
}

/**
 * Calculate floating floor improvement (DLw) - Exact VBA implementation
 * VBA Function: DLw(s As Double, M As Double, Estrichtyp As String)
 */
export function calculateFloatingFloorImprovement(params: FloatingFloorParams): number {
    const { screedThickness, screedMass, screedType } = params;
    
    if (screedThickness <= 0 || screedMass <= 0) {
        throw new Error('Screed thickness and mass must be positive');
    }
    
    let DLw: number;
    
    switch (screedType) {
        case ScreedType.CEMENT_MINERAL_FIBER:
        case ScreedType.CEMENT_WOOD_FIBER:
            // VBA: DLw = 13 * Log10(M) - 14.2 * Log10(s) + 20.8
            DLw = 13 * log10(screedMass) - 14.2 * log10(screedThickness) + 20.8;
            break;
            
        case ScreedType.GUSSASPHALT:
        case ScreedType.DRY_SCREED:
            // VBA: DLw = (-0.21 * M - 5.45) * Log10(s) + 0.46 * M + 23.8
            DLw = (-0.21 * screedMass - 5.45) * log10(screedThickness) + 0.46 * screedMass + 23.8;
            break;
            
        default:
            throw new Error(`Unsupported screed type: ${screedType}`);
    }
    
    return roundToOneDecimal(Math.max(0, DLw)); // Minimum 0 dB improvement
}

/**
 * Calculate ceiling adjustment for impact sound - Exact VBA implementation  
 * VBA Function: Lstrichnw(Lnw As Double, ms As Double, mfm As Double, Unterdecke As String)
 */
export function calculateCeilingAdjustment(params: CeilingAdjustmentParams): number {
    const { baseLnw, separatingMass, flankingMass, ceilingConfig } = params;
    
    if (baseLnw <= 0 || separatingMass <= 0 || flankingMass <= 0) {
        throw new Error('All mass values and base Lnw must be positive');
    }
    
    let adjustedLnw: number;
    
    if (ceilingConfig === CeilingConfiguration.WITHOUT_SUSPENDED) {
        // ohne Unterdecke
        if (flankingMass > separatingMass) {
            adjustedLnw = baseLnw;
        } else {
            // VBA: Lstrichnw = Lnw + 0.6 + 5.5 * Log10(ms / mfm)
            adjustedLnw = baseLnw + 0.6 + 5.5 * log10(separatingMass / flankingMass);
        }
    } else {
        // mit Unterdecke
        if (flankingMass > separatingMass) {
            adjustedLnw = baseLnw;
        } else {
            // VBA: Lstrichnw = Lnw - 5.3 + 10.2 * Log10(ms / mfm)
            adjustedLnw = baseLnw - 5.3 + 10.2 * log10(separatingMass / flankingMass);
        }
    }
    
    return roundToOneDecimal(adjustedLnw);
}

/**
 * Combined impact sound calculator
 */
export class ImpactSoundCalculator {
    
    /**
     * Calculate complete impact sound performance including floating floor and ceiling adjustments
     */
    calculateImpactSound(
        baseLnw: number,
        floatingFloor?: FloatingFloorParams,
        ceilingAdjustment?: CeilingAdjustmentParams
    ): {
        baseLnw: number;
        floatingFloorImprovement: number;
        adjustedLnw: number;
        finalLnw: number;
    } {
        let currentLnw = baseLnw;
        let floatingFloorImprovement = 0;
        let adjustedLnw = baseLnw;
        
        // Apply floating floor improvement
        if (floatingFloor) {
            floatingFloorImprovement = calculateFloatingFloorImprovement(floatingFloor);
            currentLnw = baseLnw - floatingFloorImprovement; // Improvement reduces Lnw
        }
        
        // Apply ceiling adjustment
        if (ceilingAdjustment) {
            const adjustmentParams = {
                ...ceilingAdjustment,
                baseLnw: currentLnw
            };
            adjustedLnw = calculateCeilingAdjustment(adjustmentParams);
            currentLnw = adjustedLnw;
        }
        
        return {
            baseLnw: baseLnw,
            floatingFloorImprovement: floatingFloorImprovement,
            adjustedLnw: adjustedLnw,
            finalLnw: roundToOneDecimal(currentLnw)
        };
    }
}
