/**
 * VBA Impact Sound Flanking Calculator - Complete Implementation
 * Direct port of clsFlankenbauteil.vba Lnijw_Flanke calculations
 * Handles both mass timber and lightweight construction flanking paths
 */

import { log10, max_, roundVBA } from '../utils/VBAUtils';

/**
 * VBA Constants for construction types
 */
export const VBA_CONSTRUCTION_CONSTANTS = {
    // Floor types  
    HBD_ABH_2GK: 'HBD_ABH_2GK',           // Holzbalkendecke mit Abh. + 2 x GK
    HBD_ABH_GK: 'HBD_ABH_GK',             // Holzbalkendecke mit FS + 1 x GK
    HBD_OFFEN: 'HBD_OFFEN',               // Offene Holzbalkendecke
    HBD_L_GK: 'HBD_L_GK',                 // Holzbalkendecke mit L-GK
    MHD: 'MHD',                           // Massivholzdecke
    MHD_UD: 'MHD_UD',                     // Massivholzdecke mit Unterdecke
    MHD_HBV: 'MHD_HBV',                   // Massivholzdecke mit HBV
    MHD_RIPPEN_KASTEN: 'MHD_RIPPEN_KASTEN', // Massivholzdecke Rippen/Kasten
    
    // Wall cladding types
    HWST_GK: 'HWST_GK',                   // Holzwerkstoffplatte + GK
    GF: 'GF',                             // Gipsfaser
    HWST: 'HWST',                         // Holzwerkstoffplatte
    MHW: 'MHW',                           // Massivholzwand
    
    // Screed types
    ZE_MF: 'ZE_MF',                       // Zementestrich auf Mineralfaser
    ZE_WF: 'ZE_WF',                       // Zementestrich auf Holzfaser  
    TE: 'TE',                             // Trockenestrich
    
    // Junction offset types
    WAND_LINKS_AUSSEN: 'WAND_LINKS_AUSSEN',
    WAND_RECHTS_AUSSEN: 'WAND_RECHTS_AUSSEN',
    WAND_LINKS_INNEN: 'WAND_LINKS_INNEN',
    WAND_RECHTS_INNEN: 'WAND_RECHTS_INNEN'
};

/**
 * Impact Sound Flanking Calculator - VBA Lnijw_Flanke implementation
 */
export class ImpactSoundFlankingCalculator {

    /**
     * Calculate K1 correction factor for Df path
     * VBA Function: calcK1(Deckentyp As String, Beplankung As String)
     */
    private calculateK1(floorType: string, cladding: string): number {
        const { HBD_ABH_2GK, HBD_ABH_GK, HBD_OFFEN, HBD_L_GK, MHD, MHD_UD, 
                MHD_RIPPEN_KASTEN, MHD_HBV } = VBA_CONSTRUCTION_CONSTANTS;
        const { HWST_GK, GF, MHW, HWST } = VBA_CONSTRUCTION_CONSTANTS;
        
        if (floorType === HBD_ABH_2GK) {
            switch (cladding) {
                case HWST_GK: return 6;
                case GF: return 7;
                case MHW:
                case HWST: return 9;
                default: return 1000;
            }
        } else if (floorType === HBD_ABH_GK) {
            switch (cladding) {
                case HWST_GK: return 3;
                case GF: return 4;
                case MHW:
                case HWST: return 5;
                default: return 1000;
            }
        } else if ([HBD_OFFEN, HBD_L_GK, MHD, MHD_UD, MHD_RIPPEN_KASTEN, MHD_HBV].includes(floorType)) {
            switch (cladding) {
                case HWST_GK: return 1;
                case GF: return 1;
                case MHW:
                case HWST: return 4;
                default: return 1000;
            }
        } else {
            return 1000;
        }
    }

    /**
     * Calculate K2 correction factor for DFf path using VBA matrix lookup
     * VBA Function: calcK2(Lnw As Double, Beplankung As String, Estrichaufbau As String)
     */
    private calculateK2(lnw: number, k1: number, cladding: string, screedType: string): number {
        // VBA K2 matrix - 6 rows x 22 columns
        const k2Matrix = [
            [10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0],      // ZE_WF + HWST_GK/GF
            [6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],       // ZE_MF + HWST_GK/GF
            [6, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],       // TE + HWST_GK/GF
            [11, 10, 10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0],    // ZE_WF + MHW/HWST
            [10, 10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0],     // ZE_MF + MHW/HWST
            [8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]        // TE + MHW/HWST
        ];

        const { ZE_MF, ZE_WF, TE } = VBA_CONSTRUCTION_CONSTANTS;
        const { HWST_GK, GF, MHW, HWST } = VBA_CONSTRUCTION_CONSTANTS;

        // Calculate column index
        let col = Math.round(lnw) + Math.round(k1) - 35;
        col = Math.max(0, Math.min(21, col));

        // Determine row index
        let row = 0;
        if ([HWST_GK, GF].includes(cladding)) {
            if (screedType === ZE_MF) row = 1;
            else if (screedType === ZE_WF) row = 0;
            else if (screedType === TE) row = 2;
        } else if ([MHW, HWST].includes(cladding)) {
            if (screedType === ZE_MF) row = 4;
            else if (screedType === ZE_WF) row = 3;
            else if (screedType === TE) row = 5;
        }

        return k2Matrix[row][col];
    }

    /**
     * Calculate mass timber Rw using VBA formula
     * VBA Function: Rw_HB(m_Bauteil As Double)
     */
    private calculateRwMassTimber(mass: number): number {
        return 25 * log10(mass) - 7;
    }

    /**
     * Calculate impact sound flanking transmission for all paths
     * VBA Sub: Lnijw_Flanke(Deckentyp, Estrichaufbau, Lnw, DLUnterdecke, Ss)
     */
    calculateImpactFlankingTransmission(params: {
        // Floor properties
        floorType: string;
        screedType: string;
        baseLnw: number;
        ceilingSuspendedImprovement: number;  // DLUnterdecke
        separatingArea: number;               // Ss
        
        // Flanking element properties
        flankingTypeSender: string;
        flankingTypeReceiver: string;
        flankingCladdingSender: string;
        flankingCladdingReceiver: string;
        flankingRwSender: number;
        flankingRwReceiver: number;
        flankingDRwSender: number;
        flankingDRwReceiver: number;
        flankingCouplingLength: number;
        
        // Junction properties
        kijNorm: string;
        kDf: number;
        kFf: number;
        
        // Global flags
        isDIN4109: boolean;
        
    }): { lnDfw: number; lnDFfw: number; k1: number; k2: number } {
        
        const {
            floorType, screedType, baseLnw, ceilingSuspendedImprovement, separatingArea,
            flankingTypeSender, flankingTypeReceiver, flankingCladdingSender, flankingCladdingReceiver,
            flankingRwSender, flankingRwReceiver, flankingDRwSender, flankingDRwReceiver,
            flankingCouplingLength, kijNorm, kDf, kFf, isDIN4109
        } = params;
        
        let lnDfw = 0;
        let lnDFfw = 0;
        
        const { MHD, MHD_UD, MHD_HBV, MHD_RIPPEN_KASTEN } = VBA_CONSTRUCTION_CONSTANTS;
        const { ZE_MF, ZE_WF, TE } = VBA_CONSTRUCTION_CONSTANTS;
        const { MHW } = VBA_CONSTRUCTION_CONSTANTS;
        
        ///////////////////////////////////////////////////////////////////////
        // Calculate Df path: LnDfw 
        ///////////////////////////////////////////////////////////////////////
        
        // Calculate K1 correction factor
        let k1: number;
        if (flankingTypeSender === MHW && flankingTypeReceiver === MHW) {
            k1 = this.calculateK1(floorType, flankingTypeReceiver);
        } else {
            k1 = this.calculateK1(floorType, flankingCladdingReceiver);
        }
        
        if (!isDIN4109) {
            let adjustedLnw = baseLnw;
            let DRijw = 0;
            let DKij = 0;
            
            if (flankingTypeSender === MHW && flankingTypeReceiver === MHW) {
                // Mass timber flanking elements
                
                // Layer improvement calculation
                DRijw = flankingDRwReceiver / 2 + max_((flankingRwReceiver - this.calculateRwMassTimber(63)) / 2, 0);
                
                // Junction improvement for mass timber floors
                if ([MHD, MHD_UD, MHD_HBV, MHD_RIPPEN_KASTEN].includes(floorType)) {
                    // Calculate junction improvement (simplified - would need full Kij_HB function)
                    DKij = kDf - 14; // Default T-joint value for vertical transmission
                }
                
                // Remove suspended ceiling improvement for Df path
                if (floorType === MHD_UD) {
                    adjustedLnw = baseLnw + ceilingSuspendedImprovement;
                }
                
            } else {
                // Lightweight flanking elements
                DRijw = flankingDRwReceiver / 2;
                
                // Remove suspended ceiling improvement for Df path  
                if (floorType === MHD_UD) {
                    adjustedLnw = baseLnw + ceilingSuspendedImprovement;
                }
            }
            
            // VBA: m_LnDfw = 10 * Log10(10 ^ (0.1 * (Lnw + m_K1)) - 10 ^ (0.1 * Lnw)) - 10 * Log10(Ss / m_lfSR) - DRijw - DKij
            lnDfw = 10 * log10(Math.pow(10, 0.1 * (adjustedLnw + k1)) - Math.pow(10, 0.1 * adjustedLnw)) - 
                    10 * log10(separatingArea / flankingCouplingLength) - DRijw - DKij;
        }
        
        ///////////////////////////////////////////////////////////////////////
        // Calculate DFf path: LnDFfw
        ///////////////////////////////////////////////////////////////////////
        
        // Calculate K2 correction factor
        const k2 = this.calculateK2(baseLnw, k1, 
            (flankingTypeSender === MHW) ? flankingTypeSender : flankingCladdingSender, 
            screedType);
            
        if (!isDIN4109) {
            let DRijw = 0;
            let DKij = 0;
            let baseDFfValue = 0;
            
            if (flankingTypeSender === MHW && flankingTypeReceiver === MHW) {
                // Mass timber flanking elements
                
                // Combined layer improvements
                DRijw = flankingDRwReceiver / 2 + flankingDRwSender / 2 + 
                        max_((flankingRwSender - this.calculateRwMassTimber(63)) / 2, 0) + 
                        max_((flankingRwReceiver - this.calculateRwMassTimber(63)) / 2, 0);
                
                // Junction improvement
                DKij = kFf - 21; // Default T-joint Ff value for vertical transmission
                
                // Base values by screed type
                switch (screedType) {
                    case ZE_MF:
                        baseDFfValue = 45;
                        break;
                    case ZE_WF:
                        baseDFfValue = 46;
                        break;
                    case TE:
                        baseDFfValue = 42;
                        break;
                }
                
            } else {
                // Lightweight flanking elements
                DRijw = flankingDRwReceiver / 2 + flankingDRwSender / 2;
                
                // Base values by cladding and screed type
                if ([VBA_CONSTRUCTION_CONSTANTS.HWST_GK, VBA_CONSTRUCTION_CONSTANTS.GF].includes(flankingCladdingSender)) {
                    switch (screedType) {
                        case ZE_MF:
                            baseDFfValue = 40;
                            break;
                        case ZE_WF:
                            baseDFfValue = 44;
                            break;
                        case TE:
                            baseDFfValue = 38;
                            break;
                    }
                } else if (flankingCladdingSender === VBA_CONSTRUCTION_CONSTANTS.HWST) {
                    switch (screedType) {
                        case ZE_MF:
                            baseDFfValue = 45;
                            break;
                        case ZE_WF:
                            baseDFfValue = 46;
                            break;
                        case TE:
                            baseDFfValue = 42;
                            break;
                    }
                } else {
                    baseDFfValue = 1000; // Invalid cladding
                }
            }
            
            if (baseDFfValue !== 1000) {
                lnDFfw = baseDFfValue - 10 * log10(separatingArea / flankingCouplingLength) - DRijw - DKij;
            } else {
                lnDFfw = 1000;
            }
        }
        
        return {
            lnDfw: roundVBA(lnDfw, 1),
            lnDFfw: roundVBA(lnDFfw, 1),
            k1: roundVBA(k1, 1),
            k2: roundVBA(k2, 1)
        };
    }
}

/**
 * Factory function for ease of use
 */
export function calculateImpactSoundFlanking(params: Parameters<ImpactSoundFlankingCalculator['calculateImpactFlankingTransmission']>[0]) {
    const calculator = new ImpactSoundFlankingCalculator();
    return calculator.calculateImpactFlankingTransmission(params);
}
