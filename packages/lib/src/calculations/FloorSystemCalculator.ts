import { 
    BuildingElement, 
    AcousticParameters, 
    ConstructionCategory,
    ElementType,
    MaterialType,
    Material
} from '../models/AcousticTypes';
import { log10, roundToOneDecimal } from '../utils/MathUtils';
import { 
    ScreedType, 
    CeilingConfiguration,
    calculateFloatingFloorImprovement,
    calculateCeilingAdjustment,
    ImpactSoundCalculator
} from './ImpactSoundCalculator';

/**
 * Floor System Calculator - Complete VBA clsTrenndecke implementation
 * Handles separating floors with air and impact sound transmission
 */

export enum FloorSystemType {
    // Timber floor types from VBA
    HBD_ABH_2GK = 'hbd_abh_2gk',       // Holzbalkendecke mit Abh. + 2 x GK
    HBD_ABH_GK = 'hbd_abh_gk',         // Holzbalkendecke mit FS + 1 x GK
    HBD_OFFEN = 'hbd_offen',           // Holzbalkendecke offen
    HBD_L_GK = 'hbd_l_gk',             // Holzbalkendecke mit Lattung + GK
    
    // Mass timber floor types
    MHD = 'mhd',                       // Massivholzdecke
    MHD_UD = 'mhd_ud',                 // Massivholzdecke mit Unterdecke
    MHD_HBV = 'mhd_hbv',               // MHD Holzbalkenverbund
    MHD_RIPPEN_KASTEN = 'mhd_rippen_kasten', // MHD Rippen-/Kastenträger
    
    // Concrete floors
    CONCRETE_SLAB = 'concrete_slab',    // Betondecke
    HOLLOW_CORE = 'hollow_core'         // Hohlkörperdecke
}

export enum LoadingType {
    NONE = 'none',                      // ohne Beschwerung
    GRAVEL = 'gravel',                  // Kies
    SCREED = 'screed'                   // Estrich
}

export interface FloorSystemParams {
    systemType: FloorSystemType;
    loadingType: LoadingType;
    
    // Basic acoustic properties
    baseRw: number;                     // Rw raw floor [dB]
    baseLnw: number;                    // Lnw raw floor [dB]
    baseMass?: number;                  // Element mass [kg/m²] - for mass timber
    
    // Floating floor system
    screedType?: ScreedType;
    screedThickness?: number;           // [m]
    screedMass?: number;               // [kg/m²]
    
    // Suspended ceiling
    hasSuspendedCeiling: boolean;
    ceilingImprovement?: number;        // DRw ceiling improvement [dB]
    ceilingImpactImprovement?: number;  // DLw ceiling improvement [dB]
    
    // Floor area for calculations
    floorArea: number;                  // [m²]
}

export interface FloorSystemResults {
    // Basic values
    baseRw: number;
    baseLnw: number;
    
    // Improvements
    screedImprovement: number;         // DRw from floating floor
    impactImprovement: number;         // DLw from floating floor
    ceilingImprovement: number;        // DRw from suspended ceiling
    ceilingImpactImprovement: number;  // DLw from suspended ceiling
    
    // Final values
    finalRw: number;                   // Rw including all improvements
    finalLnw: number;                  // L'nw including all improvements
    
    // Combined results with flanking (to be calculated separately)
    combinedRw?: number;               // R'w including flanking
    combinedLnw?: number;              // L'nw including flanking
}

/**
 * Complete Floor System Calculator - VBA clsTrenndecke implementation
 */
export class FloorSystemCalculator {
    private impactCalculator: ImpactSoundCalculator;
    
    constructor() {
        this.impactCalculator = new ImpactSoundCalculator();
    }
    
    /**
     * Validate input data - VBA checkdata_Trenndecke logic
     */
    private validateInput(params: FloorSystemParams): void {
        if (!params.systemType) {
            throw new Error('Floor system type is required');
        }
        
        if (params.baseRw <= 0) {
            throw new Error('Base Rw must be positive');
        }
        
        if (params.baseLnw <= 0) {
            throw new Error('Base Lnw must be positive');
        }
        
        // Mass timber floors need element mass and Rsw
        const massTimberTypes = [
            FloorSystemType.MHD, 
            FloorSystemType.MHD_UD, 
            FloorSystemType.MHD_HBV, 
            FloorSystemType.MHD_RIPPEN_KASTEN
        ];
        
        if (massTimberTypes.includes(params.systemType)) {
            if (!params.baseMass || params.baseMass <= 0) {
                throw new Error('Element mass is required for mass timber floors');
            }
        }
        
        if (params.floorArea <= 0) {
            throw new Error('Floor area must be positive');
        }
    }
    
    /**
     * Calculate complete floor system performance
     */
    calculateFloorSystem(params: FloorSystemParams): FloorSystemResults {
        this.validateInput(params);
        
        let currentRw = params.baseRw;
        let currentLnw = params.baseLnw;
        
        // Initialize improvements
        let screedImprovement = 0;
        let impactImprovement = 0;
        let ceilingImprovement = params.ceilingImprovement || 0;
        let ceilingImpactImprovement = params.ceilingImpactImprovement || 0;
        
        // Calculate floating floor improvements
        if (params.screedType && params.screedThickness && params.screedMass) {
            try {
                impactImprovement = calculateFloatingFloorImprovement({
                    screedThickness: params.screedThickness,
                    screedMass: params.screedMass,
                    screedType: params.screedType
                });
                
                // Impact improvement reduces Lnw
                currentLnw = params.baseLnw - impactImprovement;
            } catch (error) {
                console.warn('Floating floor calculation failed:', error);
            }
        }
        
        // Apply ceiling improvements
        currentRw += ceilingImprovement;
        currentLnw -= ceilingImpactImprovement; // Improvement reduces Lnw
        
        // Calculate VBA-style improvement data
        // VBA: m_DREstrich = m_Rw - m_Rsw - m_DRUnterdecke
        // This represents the screed contribution to sound reduction
        screedImprovement = currentRw - params.baseRw - ceilingImprovement;
        
        return {
            baseRw: params.baseRw,
            baseLnw: params.baseLnw,
            screedImprovement: roundToOneDecimal(screedImprovement),
            impactImprovement: roundToOneDecimal(impactImprovement),
            ceilingImprovement: roundToOneDecimal(ceilingImprovement),
            ceilingImpactImprovement: roundToOneDecimal(ceilingImpactImprovement),
            finalRw: roundToOneDecimal(currentRw),
            finalLnw: roundToOneDecimal(Math.max(0, currentLnw)) // Minimum 0 dB
        };
    }
    
    /**
     * Calculate combined results with flanking transmission - VBA implementation
     * VBA: RStrichw_Trenndecke(arrRijw As Variant)
     */
    calculateCombinedAirborneSound(
        directRw: number, 
        flankingRijw: number[]
    ): number {
        // VBA: m_RStrichw = 10 ^ (-0.1 * m_Rw)
        let combinedTransmission = Math.pow(10, -0.1 * directRw);
        
        // VBA: For Each Rijw In arrRijw
        //      If Rijw > 0 Then m_RStrichw = m_RStrichw + 10 ^ (-0.1 * CDbl(Rijw))
        for (const rijw of flankingRijw) {
            if (rijw > 0) {
                combinedTransmission += Math.pow(10, -0.1 * rijw);
            }
        }
        
        // VBA: m_RStrichw = -10 * Log10(m_RStrichw)
        const combinedRw = -10 * log10(combinedTransmission);
        
        return roundToOneDecimal(combinedRw);
    }
    
    /**
     * Calculate combined impact sound results with flanking - VBA implementation
     * VBA: Lstrichnw_Trenndecke(arrLnijw As Variant)
     */
    calculateCombinedImpactSound(
        directLnw: number,
        flankingLnijw: number[]
    ): number {
        // VBA: m_LStrichnw = 10 ^ (0.1 * m_Lnw)
        let combinedTransmission = Math.pow(10, 0.1 * directLnw);
        
        // VBA: For Each Lnijw In arrLnijw
        //      If IsNumeric(Lnijw) Then m_LStrichnw = m_LStrichnw + 10 ^ (0.1 * CDbl(Lnijw))
        for (const lnijw of flankingLnijw) {
            if (typeof lnijw === 'number' && !isNaN(lnijw)) {
                combinedTransmission += Math.pow(10, 0.1 * lnijw);
            }
        }
        
        // VBA: m_LStrichnw = 10 * Log10(m_LStrichnw)
        const combinedLnw = 10 * log10(combinedTransmission);
        
        return roundToOneDecimal(combinedLnw);
    }
    
    /**
     * Create BuildingElement from floor system parameters
     */
    createFloorElement(params: FloorSystemParams, results: FloorSystemResults): BuildingElement {
        let category: ConstructionCategory;
        
        // Determine construction category based on floor type
        if (params.systemType.startsWith('mhd')) {
            category = ConstructionCategory.Massivholzbau;
        } else if (params.systemType.startsWith('hbd')) {
            category = ConstructionCategory.Leichtbau;
        } else {
            category = ConstructionCategory.Massivbau;
        }
        
        const material: Material = {
            type: MaterialType.MassTimber,
            surfaceMass: params.baseMass || 0,
            constructionType: category === ConstructionCategory.Massivbau ? 
                              'solid' as any : 
                              category === ConstructionCategory.Massivholzbau ? 
                              'mass_timber' as any : 
                              'lightweight' as any
        };
        
        const acousticParams: AcousticParameters = {
            rw: results.finalRw,
            lnw: results.finalLnw
        };
        
        return {
            id: `floor_${params.systemType}`,
            type: ElementType.Floor,
            material: material,
            area: params.floorArea,
            Rw: results.finalRw,
            massPerArea: params.baseMass || 0,
            constructionType: category,
            acousticParams: acousticParams
        };
    }
}
