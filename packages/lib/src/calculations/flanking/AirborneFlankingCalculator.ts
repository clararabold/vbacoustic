/**
 * Airborne Sound Flanking Calculator - VBA Rijw_Flanke implementation
 * Implements exact VBA logic from clsFlankenbauteil.vba for all flanking paths
 */

import { 
    FlankingPathType,
    ElementType,
    ConstructionType
} from '../../models/AcousticTypes';
import { log10, max_, roundVBA } from '../../utils/VBAUtils';
import { calculateCombinedLayerImprovement } from '../MassTimberCalculator';
import { 
    FloorConstructionType,
    WallCladdingType,
    ScreedConstructionType
} from './K1K2Calculator';

/**
 * Construction types from VBA constants
 */
export enum VBAConstructionType {
    // Floor types
    MHD = 'MHD',                           // Massivholzdecke
    MHD_UD = 'MHD_UD',                     // Massivholzdecke mit Unterdecke  
    MHD_HBV = 'MHD_HBV',                   // Massivholzdecke mit HBV
    MHD_RIPPEN_KASTEN = 'MHD_RIPPEN_KASTEN', // Massivholzdecke Rippen/Kasten
    
    // Wall types - solid construction
    SBD = 'SBD',                           // Stahlbetondecke
    SB_FlACHD = 'SB_FLACHD',              // Stahlbeton-Flachdecke
    MW = 'MW',                             // Mauerwerk
    
    // Wall types - mass timber
    MHW = 'MHW',                           // Massivholzwand
    MHE = 'MHE',                           // Massivholzelement
    MH_FLACHD = 'MH_FLACHD',              // Massivholz-Flachdecke als Wand
    
    // Wall types - lightweight
    HSTW = 'HSTW',                         // Holzständerwand
    MSTW = 'MSTW',                         // Metallständerwand
    HBD = 'HBD',                           // Holzbalkendecke als Wand
    HB_FLACHD = 'HB_FLACHD',              // Holzbalken-Flachdecke
    SP_STEILD = 'SP_STEILD'                // Sparren-Steildach
}

/**
 * Junction offset types from VBA constants
 */
export enum JunctionOffsetType {
    WAND_LINKS_AUSSEN = 'WAND_LINKS_AUSSEN',
    WAND_RECHTS_AUSSEN = 'WAND_RECHTS_AUSSEN', 
    WAND_LINKS_INNEN = 'WAND_LINKS_INNEN',
    WAND_RECHTS_INNEN = 'WAND_RECHTS_INNEN'
}

/**
 * Airborne sound flanking calculator
 */
export class AirborneFlankingCalculator {
    
    /**
     * Calculate all airborne flanking transmission paths - VBA Rijw_Flanke implementation
     */
    calculateFlankingTransmission(params: {
        separatingElementType: ElementType;
        separatingConstruction: VBAConstructionType;
        separatingRw: number;
        separatingRsw: number;
        separatingDRw_sender: number;
        separatingDRw_receiver: number;
        separatingArea: number;
        separatingCouplingLength: number;
        
        // Flanking element properties
        flankingTypeSender: VBAConstructionType;
        flankingTypeReceiver: VBAConstructionType;
        flankingRwSender: number;
        flankingRwReceiver: number;
        flankingDRwSender: number;
        flankingDRwReceiver: number;
        flankingDnfwSender?: number; // For lightweight construction
        flankingCouplingLength: number;
        
        // Junction properties
        kFf: number;
        kDf: number;
        kFd: number;
        junctionOffset?: JunctionOffsetType;
        
        // Building configuration
        isDIN4109: boolean;
        
    }): { rFfw: number; rDfw: number; rFdw: number } {
        
        const {
            separatingElementType, separatingConstruction, separatingRw, separatingRsw,
            separatingDRw_sender, separatingDRw_receiver, separatingArea, separatingCouplingLength,
            flankingTypeSender, flankingTypeReceiver, flankingRwSender, flankingRwReceiver,
            flankingDRwSender, flankingDRwReceiver, flankingDnfwSender, flankingCouplingLength,
            kFf, kDf, kFd, junctionOffset, isDIN4109
        } = params;
        
        let rFfw = 0; // Ff path (flanking-to-flanking)
        let rDfw = 0; // Df path (direct-to-flanking) 
        let rFdw = 0; // Fd path (flanking-to-direct)
        
        ///////////////////////////////////////////////////////////////////////
        // FLOOR SEPARATING ELEMENT (VBA: optDecke = True And optHolzbau = True)
        ///////////////////////////////////////////////////////////////////////
        if (separatingElementType === ElementType.Floor) {
            
            // Mass timber flanking elements (MHW, MHE)
            if ((flankingTypeSender === VBAConstructionType.MHW && flankingTypeReceiver === VBAConstructionType.MHW) ||
                (flankingTypeSender === VBAConstructionType.MHE && flankingTypeReceiver === VBAConstructionType.MHE)) {
                
                if (isDIN4109) {
                    return { rFfw: 0, rDfw: 0, rFdw: 0 }; // VBA: Exit Sub - DIN 4109 not possible
                }
                
                // Ff path calculation
                const drFf = calculateCombinedLayerImprovement(flankingDRwSender, flankingDRwReceiver);
                rFfw = (flankingRwReceiver + flankingRwSender) / 2 + drFf + kFf + 
                       10 * log10(separatingArea / flankingCouplingLength);
                
                // Df and Fd paths for mass timber floors
                if (separatingConstruction === VBAConstructionType.MHD ||
                    separatingConstruction === VBAConstructionType.MHD_UD ||
                    separatingConstruction === VBAConstructionType.MHD_HBV ||
                    separatingConstruction === VBAConstructionType.MHD_RIPPEN_KASTEN) {
                    
                    // Df path
                    const drDf = calculateCombinedLayerImprovement(separatingDRw_sender, flankingDRwReceiver);
                    rDfw = (separatingRsw + flankingRwReceiver) / 2 + drDf + kDf + 
                           10 * log10(separatingArea / flankingCouplingLength);
                    
                    // Fd path  
                    const drFd = calculateCombinedLayerImprovement(flankingDRwSender, separatingDRw_receiver);
                    rFdw = (flankingRwSender + separatingRsw) / 2 + drFd + kFd + 
                           10 * log10(separatingArea / flankingCouplingLength);
                } else {
                    rDfw = 0;
                    rFdw = 0;
                }
                
            } else {
                // Lightweight flanking elements
                const drFf = calculateCombinedLayerImprovement(flankingDRwSender, flankingDRwReceiver);
                rFfw = (flankingDnfwSender || 0) + 10 * log10(separatingArea / 10) + 
                       10 * log10(separatingCouplingLength / flankingCouplingLength) + drFf;
                rDfw = 0;
                rFdw = 0;
            }
            
        ///////////////////////////////////////////////////////////////////////
        // WALL SEPARATING ELEMENT (VBA: optWand = True And optHolzbau = True)  
        ///////////////////////////////////////////////////////////////////////
        } else if (separatingElementType === ElementType.Wall) {
            
            // Solid or mass timber flanking elements
            if (this.isSolidOrMassTimber(flankingTypeSender)) {
                
                const drFf = calculateCombinedLayerImprovement(flankingDRwSender, flankingDRwReceiver);
                rFfw = (flankingRwReceiver + flankingRwSender) / 2 + drFf + kFf + 
                       10 * log10(separatingArea / flankingCouplingLength);
                
                // Additional paths for mass timber separating walls
                if (separatingConstruction === VBAConstructionType.MHW && 
                    this.isMassTimber(flankingTypeSender)) {
                    
                    // Df path
                    const drDf = calculateCombinedLayerImprovement(separatingDRw_sender, flankingDRwReceiver);
                    rDfw = (separatingRsw + flankingRwReceiver) / 2 + drDf + kDf + 
                           10 * log10(separatingArea / flankingCouplingLength);
                    
                    // Fd path
                    const drFd = calculateCombinedLayerImprovement(flankingDRwSender, separatingDRw_receiver);
                    rFdw = (flankingRwSender + separatingRsw) / 2 + drFd + kFd + 
                           10 * log10(separatingArea / flankingCouplingLength);
                } else {
                    rDfw = 0;
                    rFdw = 0;
                }
                
            } else {
                // Lightweight flanking elements
                if (!junctionOffset) { // No junction offset
                    const drFf = calculateCombinedLayerImprovement(flankingDRwSender, flankingDRwReceiver);
                    rFfw = (flankingDnfwSender || 0) + 10 * log10(separatingArea / 10) + 
                           10 * log10(separatingCouplingLength / flankingCouplingLength) + drFf;
                } else {
                    rFfw = 0;
                }
                rDfw = 0;
                rFdw = 0;
            }
            
            // Handle junction offset cases - VBA offset logic
            if (junctionOffset === JunctionOffsetType.WAND_LINKS_AUSSEN ||
                junctionOffset === JunctionOffsetType.WAND_RECHTS_AUSSEN) {
                
                rFfw = rFdw; // Reassign Fd to Ff
                const drOffset = calculateCombinedLayerImprovement(separatingDRw_sender, separatingDRw_receiver);
                rDfw = separatingRw + kDf + 10 * log10(separatingArea / flankingCouplingLength);
                
            } else if (junctionOffset === JunctionOffsetType.WAND_LINKS_INNEN ||
                      junctionOffset === JunctionOffsetType.WAND_RECHTS_INNEN) {
                
                rFfw = rDfw; // Reassign Df to Ff  
                const drOffset = calculateCombinedLayerImprovement(separatingDRw_sender, separatingDRw_receiver);
                rFdw = separatingRw + kFd + 10 * log10(separatingArea / flankingCouplingLength);
            }
        }
        
        return {
            rFfw: roundVBA(rFfw, 1),
            rDfw: roundVBA(rDfw, 1),
            rFdw: roundVBA(rFdw, 1)
        };
    }
    
    /**
     * Check if flanking type is solid or mass timber
     */
    private isSolidOrMassTimber(flankingType: VBAConstructionType): boolean {
        return flankingType === VBAConstructionType.SBD ||
               flankingType === VBAConstructionType.MHD ||
               flankingType === VBAConstructionType.SB_FlACHD ||
               flankingType === VBAConstructionType.MH_FLACHD ||
               flankingType === VBAConstructionType.MHW ||
               flankingType === VBAConstructionType.MW;
    }
    
    /**
     * Check if flanking type is mass timber
     */
    private isMassTimber(flankingType: VBAConstructionType): boolean {
        return flankingType === VBAConstructionType.MHD ||
               flankingType === VBAConstructionType.MH_FLACHD ||
               flankingType === VBAConstructionType.MHW;
    }
    
    /**
     * Calculate combined flanking transmission for all paths
     */
    calculateCombinedFlanking(rijwValues: { rFfw: number; rDfw: number; rFdw: number }[]): number {
        let totalTransmission = 0;
        
        for (const rijw of rijwValues) {
            // Sum all active paths
            if (rijw.rFfw > 0) {
                totalTransmission += Math.pow(10, -0.1 * rijw.rFfw);
            }
            if (rijw.rDfw > 0) {
                totalTransmission += Math.pow(10, -0.1 * rijw.rDfw);
            }
            if (rijw.rFdw > 0) {
                totalTransmission += Math.pow(10, -0.1 * rijw.rFdw);
            }
        }
        
        if (totalTransmission === 0) {
            return 0;
        }
        
        return roundVBA(-10 * log10(totalTransmission), 1);
    }
    
    /**
     * Get path-specific transmission values for analysis
     */
    getPathAnalysis(rijwValues: { rFfw: number; rDfw: number; rFdw: number }[]): {
        ffTotal: number;
        dfTotal: number; 
        fdTotal: number;
        combinedTotal: number;
    } {
        let ffTransmission = 0;
        let dfTransmission = 0;
        let fdTransmission = 0;
        
        for (const rijw of rijwValues) {
            if (rijw.rFfw > 0) {
                ffTransmission += Math.pow(10, -0.1 * rijw.rFfw);
            }
            if (rijw.rDfw > 0) {
                dfTransmission += Math.pow(10, -0.1 * rijw.rDfw);
            }
            if (rijw.rFdw > 0) {
                fdTransmission += Math.pow(10, -0.1 * rijw.rFdw);
            }
        }
        
        const ffTotal = ffTransmission > 0 ? roundVBA(-10 * log10(ffTransmission), 1) : 0;
        const dfTotal = dfTransmission > 0 ? roundVBA(-10 * log10(dfTransmission), 1) : 0;
        const fdTotal = fdTransmission > 0 ? roundVBA(-10 * log10(fdTransmission), 1) : 0;
        
        const combinedTransmission = ffTransmission + dfTransmission + fdTransmission;
        const combinedTotal = combinedTransmission > 0 ? roundVBA(-10 * log10(combinedTransmission), 1) : 0;
        
        return { ffTotal, dfTotal, fdTotal, combinedTotal };
    }
}

/**
 * Helper function to map construction types
 */
export function mapConstructionType(constructionType: ConstructionType, elementType: ElementType): VBAConstructionType {
    
    if (elementType === ElementType.Floor) {
        switch (constructionType) {
            case ConstructionType.Solid:
                return VBAConstructionType.SBD;
            case ConstructionType.MassTimber:
                return VBAConstructionType.MHD;
            case ConstructionType.Lightweight:
                return VBAConstructionType.HBD;
            default:
                return VBAConstructionType.MHD;
        }
    } else {
        switch (constructionType) {
            case ConstructionType.Solid:
                return VBAConstructionType.MW;
            case ConstructionType.MassTimber:
                return VBAConstructionType.MHW;
            case ConstructionType.Lightweight:
                return VBAConstructionType.HSTW;
            default:
                return VBAConstructionType.MHW;
        }
    }
}
