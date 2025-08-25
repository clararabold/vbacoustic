/**
 * K1/K2 Correction Factors Calculator
 * Based on VBA clsFlankenbauteil.vba calcK1 and calcK2 functions
 * Implements exact VBA lookup tables and correction logic
 */

import { 
    ElementType, 
    FlankingPathType,
    ScreedType,
    CladdingType
} from '../../models/AcousticTypes';
import { max_ } from '../../utils/VBAUtils';

/**
 * Floor construction types from VBA constants
 */
export enum FloorConstructionType {
    // Holzbalkendecken (Timber beam floors)
    HBD_ABH_2GK = 'HBD_ABH_2GK',           // Holzbalkendecke mit Abh. + 2 x GK
    HBD_ABH_GK = 'HBD_ABH_GK',             // Holzbalkendecke mit FS + 1 x GK
    HBD_OFFEN = 'HBD_OFFEN',               // Holzbalkendecke offen
    HBD_L_GK = 'HBD_L_GK',                 // Holzbalkendecke mit Lattung + GK
    
    // Massivholzdecken (Mass timber floors)
    MHD = 'MHD',                           // Massivholzdecke
    MHD_UD = 'MHD_UD',                     // Massivholzdecke mit Unterdecke
    MHD_RIPPEN_KASTEN = 'MHD_RIPPEN_KASTEN', // Massivholzdecke Rippen/Kasten
    MHD_HBV = 'MHD_HBV'                    // Massivholzdecke mit HBV
}

/**
 * Wall cladding types from VBA constants
 */
export enum WallCladdingType {
    HWST_GK = 'HWST_GK',                   // Holzwerkstoffplatte + Gipskarton
    GF = 'GF',                             // Gipsfaser
    MHW = 'MHW',                           // Massivholzwand
    HWST = 'HWST'                          // Holzwerkstoffplatte
}

/**
 * Screed types from VBA constants
 */
export enum ScreedConstructionType {
    ZE_MF = 'ZE_MF',                       // Zementestrich auf Mineralfaser
    ZE_WF = 'ZE_WF',                       // Zementestrich auf Holzfaser
    TE = 'TE'                              // Trockenestrich
}

/**
 * K1/K2 Calculator - VBA clsFlankenbauteil implementation
 */
export class K1K2Calculator {
    
    /**
     * Calculate K1 correction factor for Df path
     * VBA calcK1 function implementation
     */
    calculateK1(floorType: FloorConstructionType, claddingType: WallCladdingType): number {
        
        if (floorType === FloorConstructionType.HBD_ABH_2GK) {
            // "Holzbalkendecke mit Abh. + 2 x GK"
            switch (claddingType) {
                case WallCladdingType.HWST_GK:
                    return 6;
                case WallCladdingType.GF:
                    return 7;
                case WallCladdingType.MHW:
                case WallCladdingType.HWST:
                    return 9;
                default:
                    return 0;
            }
        }
        
        if (floorType === FloorConstructionType.HBD_ABH_GK) {
            // "Holzbalkendecke mit FS + 1 x GK"
            switch (claddingType) {
                case WallCladdingType.HWST_GK:
                    return 3;
                case WallCladdingType.GF:
                    return 4;
                case WallCladdingType.MHW:
                case WallCladdingType.HWST:
                    return 5;
                default:
                    return 0;
            }
        }
        
        if (floorType === FloorConstructionType.HBD_OFFEN ||
            floorType === FloorConstructionType.HBD_L_GK ||
            floorType === FloorConstructionType.MHD ||
            floorType === FloorConstructionType.MHD_UD ||
            floorType === FloorConstructionType.MHD_RIPPEN_KASTEN ||
            floorType === FloorConstructionType.MHD_HBV) {
            // alle Deckentypen ohne (oder mit starrer) Unterdecke
            switch (claddingType) {
                case WallCladdingType.HWST_GK:
                case WallCladdingType.GF:
                    return 1;
                case WallCladdingType.MHW:
                case WallCladdingType.HWST:
                    return 4;
                default:
                    return 0;
            }
        }
        
        // Unknown floor type
        return 1000; // VBA error value
    }
    
    /**
     * Calculate K2 correction factor for DFf path
     * VBA calcK2 function with complete lookup table
     */
    calculateK2(lnw: number, k1: number, claddingType: WallCladdingType, screedType: ScreedConstructionType): number {
        
        // VBA K2 lookup table - exact implementation
        const k2Matrix = [
            // Row 0: ZE_WF (Zementestrich auf Holzfaser)
            [10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            // Row 1: ZE_MF (Zementestrich auf Mineralfaser)  
            [6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            // Row 2: TE (Trockenestrich)
            [6, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            // Row 3: ZE_WF for MHW/HWST
            [11, 10, 10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0],
            // Row 4: ZE_MF for MHW/HWST
            [10, 10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0],
            // Row 5: TE for MHW/HWST
            [8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
        ];
        
        // Calculate column index - VBA logic
        let col = Math.floor(lnw) + k1 - 35;
        col = Math.max(0, Math.min(21, col)); // Clamp to valid range
        
        // Determine row index based on cladding and screed type
        let row: number;
        
        switch (claddingType) {
            case WallCladdingType.HWST_GK:
            case WallCladdingType.GF:
                switch (screedType) {
                    case ScreedConstructionType.ZE_MF:
                        row = 1; // "Zementestrich auf Mineralfaser"
                        break;
                    case ScreedConstructionType.ZE_WF:
                        row = 0; // "Zementestrich auf Holzfaser"
                        break;
                    case ScreedConstructionType.TE:
                        row = 2; // "Trockenestrich"
                        break;
                    default:
                        row = 1;
                }
                break;
                
            case WallCladdingType.MHW:
            case WallCladdingType.HWST:
                switch (screedType) {
                    case ScreedConstructionType.ZE_MF:
                        row = 4; // "Zementestrich auf Mineralfaser"
                        break;
                    case ScreedConstructionType.ZE_WF:
                        row = 3; // "Zementestrich auf Holzfaser"
                        break;
                    case ScreedConstructionType.TE:
                        row = 5; // "Trockenestrich"
                        break;
                    default:
                        row = 3;
                }
                break;
                
            default:
                row = 1;
        }
        
        // Return value from lookup table
        return k2Matrix[row][col];
    }
    
    /**
     * Calculate impact sound flanking transmission - VBA Lnijw_Flanke logic
     */
    calculateImpactSoundFlanking(params: {
        floorType: FloorConstructionType;
        screedType: ScreedConstructionType;
        lnw: number;
        deltaLUnderCeiling: number;
        sendingRoomArea: number;
        couplingLength: number;
        sendingCladdingType: WallCladdingType;
        receivingCladdingType: WallCladdingType;
        sendingDRw: number;
        receivingDRw: number;
        sendingRw: number;
        receivingRw: number;
        kFf: number;
        kDf: number;
        isMassTimber: boolean;
    }): { lnDfw: number; lnDFfw: number; k1: number; k2: number } {
        
        const {
            floorType, screedType, lnw, deltaLUnderCeiling, sendingRoomArea, couplingLength,
            sendingCladdingType, receivingCladdingType, sendingDRw, receivingDRw,
            sendingRw, receivingRw, kFf, kDf, isMassTimber
        } = params;
        
        let adjustedLnw = lnw;
        
        // For floors with suspended ceilings, remove ceiling effect for Df path  
        if (floorType === FloorConstructionType.MHD_UD) {
            adjustedLnw = lnw + deltaLUnderCeiling;
        }
        
        // Calculate K1 for Df path
        const k1 = this.calculateK1(floorType, receivingCladdingType);
        
        // Calculate K2 for DFf path  
        const k2 = this.calculateK2(lnw, k1, sendingCladdingType, screedType);
        
        // Calculate DRijw improvements for flanking paths
        let drFlanking_Df: number;
        let drFlanking_DFf: number;
        
        if (isMassTimber) {
            // Mass timber calculations
            drFlanking_Df = receivingDRw / 2 + max_((receivingRw - 63) / 2, 0); // Assuming Rw_HB(63) = 63
            drFlanking_DFf = receivingDRw / 2 + sendingDRw / 2 + 
                            max_((sendingRw - 63) / 2, 0) + 
                            max_((receivingRw - 63) / 2, 0);
        } else {
            // Lightweight construction
            drFlanking_Df = receivingDRw / 2;
            drFlanking_DFf = receivingDRw / 2 + sendingDRw / 2;
        }
        
        // Calculate LnDfw (Df path)
        const lnDfw = 10 * Math.log10(
            Math.pow(10, 0.1 * (adjustedLnw + k1)) - Math.pow(10, 0.1 * adjustedLnw)
        ) - 10 * Math.log10(sendingRoomArea / couplingLength) - drFlanking_Df;
        
        // Calculate LnDFfw (DFf path) - depends on construction and screed type
        let lnDFfw: number;
        
        if (isMassTimber) {
            // Mass timber base values by screed type
            switch (screedType) {
                case ScreedConstructionType.ZE_MF: // Zementestrich auf Mineralfaser
                    lnDFfw = 45;
                    break;
                case ScreedConstructionType.ZE_WF: // Zementestrich auf Holzfaser  
                    lnDFfw = 46;
                    break;
                case ScreedConstructionType.TE: // Trockenestrich
                    lnDFfw = 42;
                    break;
                default:
                    lnDFfw = 45;
            }
        } else {
            // Lightweight construction base values
            if (sendingCladdingType === WallCladdingType.HWST_GK || 
                sendingCladdingType === WallCladdingType.GF) {
                switch (screedType) {
                    case ScreedConstructionType.ZE_MF:
                        lnDFfw = 40;
                        break;
                    case ScreedConstructionType.ZE_WF:
                        lnDFfw = 44;
                        break;
                    case ScreedConstructionType.TE:
                        lnDFfw = 38;
                        break;
                    default:
                        lnDFfw = 40;
                }
            } else if (sendingCladdingType === WallCladdingType.HWST) {
                switch (screedType) {
                    case ScreedConstructionType.ZE_MF:
                        lnDFfw = 45;
                        break;
                    case ScreedConstructionType.ZE_WF:
                        lnDFfw = 46;
                        break;
                    case ScreedConstructionType.TE:
                        lnDFfw = 42;
                        break;
                    default:
                        lnDFfw = 45;
                }
            } else {
                lnDFfw = 1000; // Error value for wrong cladding
            }
        }
        
        // Apply corrections to DFf path
        lnDFfw = lnDFfw - 10 * Math.log10(sendingRoomArea / couplingLength) - drFlanking_DFf;
        
        return {
            lnDfw: Math.round(lnDfw * 10) / 10,
            lnDFfw: Math.round(lnDFfw * 10) / 10,
            k1: k1,
            k2: k2
        };
    }
    
    /**
     * Convert TypeScript enums to VBA enum strings for compatibility
     */
    static mapToVBAEnums(params: {
        screedType?: ScreedType;
        claddingType?: CladdingType;
    }): { screedTypeVBA?: ScreedConstructionType; claddingTypeVBA?: WallCladdingType } {
        
        let screedTypeVBA: ScreedConstructionType | undefined;
        let claddingTypeVBA: WallCladdingType | undefined;
        
        // Map screed types
        if (params.screedType) {
            switch (params.screedType) {
                case ScreedType.CementOnMineralFiber:
                    screedTypeVBA = ScreedConstructionType.ZE_MF;
                    break;
                case ScreedType.CementOnWoodFiber:
                    screedTypeVBA = ScreedConstructionType.ZE_WF;
                    break;
                case ScreedType.DryScreed:
                    screedTypeVBA = ScreedConstructionType.TE;
                    break;
            }
        }
        
        // Map cladding types
        if (params.claddingType) {
            switch (params.claddingType) {
                case CladdingType.WoodBoardPlusGK:
                    claddingTypeVBA = WallCladdingType.HWST_GK;
                    break;
                case CladdingType.GypsusFiber:
                    claddingTypeVBA = WallCladdingType.GF;
                    break;
                case CladdingType.WoodBoardOnly:
                    claddingTypeVBA = WallCladdingType.HWST;
                    break;
                case CladdingType.MassTimber:
                    claddingTypeVBA = WallCladdingType.MHW;
                    break;
            }
        }
        
        return { screedTypeVBA, claddingTypeVBA };
    }
}

// Backward compatibility exports (aliased to match deleted K1K2Calculator)
export const FloorType = FloorConstructionType;
export const WallCladding = WallCladdingType;  
export const ScreedConfiguration = ScreedConstructionType;

// Functional exports matching the old K1K2Calculator interface
export function calculateK1Factor(floorType: FloorConstructionType, wallCladding: WallCladdingType): number {
    const calculator = new K1K2Calculator();
    return calculator.calculateK1(floorType, wallCladding);
}

export function calculateK2Factor(lnw: number, k1: number, wallCladding: WallCladdingType, screedConfig: ScreedConstructionType): number {
    const calculator = new K1K2Calculator();
    return calculator.calculateK2(lnw, k1, wallCladding, screedConfig);
}

// Class alias for compatibility
export const K1K2ImpactCalculator = K1K2Calculator;
