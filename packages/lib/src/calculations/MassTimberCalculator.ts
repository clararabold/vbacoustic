import { log10, roundToOneDecimal } from '../utils/MathUtils';
import { ConstructionType, FlankingPathType } from '../models/AcousticTypes';

/**
 * Mass Timber Sound Reduction Calculator - Complete VBA Holzbau implementation
 * Based on calc_holzbau_single.vba functions
 */

export enum MassTimberType {
    HEAVY_TIMBER = 'heavy_timber',         // Massivholz (standard case)
    FLEXIBLE = 'flexible',                 // Biegeweich
    LOADED = 'loaded'                      // Beschwert (mit Schüttung)
}

/**
 * Calculate sound reduction for mass timber construction - VBA Rw_HB function
 * VBA: Rw_HB = 25 * Log10(m_Bauteil) - 7
 */
export function calculateMassTimberRw(surfaceMass: number, timberType: MassTimberType = MassTimberType.HEAVY_TIMBER): number {
    if (surfaceMass <= 0) {
        throw new Error('Surface mass must be positive');
    }
    
    let rw: number;
    
    switch (timberType) {
        case MassTimberType.HEAVY_TIMBER:
            // VBA: Rw_HB = 25 * Log10(m_Bauteil) - 7
            rw = 25 * log10(surfaceMass) - 7;
            break;
            
        case MassTimberType.FLEXIBLE:
            // VBA: Rw_biegeweich = 20 * Log10(m_Bauteil) + 12
            rw = 20 * log10(surfaceMass) + 12;
            break;
            
        case MassTimberType.LOADED:
            // VBA: Rw_beschwert = 20 * Log10(m_Bauteil) + 10
            rw = 20 * log10(surfaceMass) + 10;
            break;
            
        default:
            throw new Error(`Unsupported mass timber type: ${timberType}`);
    }
    
    return roundToOneDecimal(rw);
}

/**
 * Calculate combined layer improvement - VBA calcDRijw function
 * VBA: calcDRijw = max_(DRiw, DRjw) + 0.5 * min_(DRiw, DRjw)
 */
export function calculateCombinedLayerImprovement(DRiw: number, DRjw: number): number {
    if (DRiw > 0 || DRjw > 0) {
        // Positive improvements
        return Math.max(DRiw, DRjw) + 0.5 * Math.min(DRiw, DRjw);
    } else {
        // Negative improvements (deteriorations)  
        return -Math.max(Math.abs(DRiw), Math.abs(DRjw)) - 0.5 * Math.min(Math.abs(DRiw), Math.abs(DRjw));
    }
}

/**
 * Mass timber junction types from VBA
 */
export enum MassTimberJunctionType {
    T_JOINT = 't_joint',                           // T_STOSS
    T_JOINT_ELASTIC_TOP = 't_joint_elastic_top',   // T_STOSS_ELAST_OBEN
    T_JOINT_ELASTIC_BOTH = 't_joint_elastic_both', // T_STOSS_ELAST_OBEN_UNTEN
    X_JOINT = 'x_joint',                           // X_STOSS
    X_JOINT_ELASTIC_TOP = 'x_joint_elastic_top',   // X_STOSS_ELAST_OBEN
    X_JOINT_ELASTIC_BOTH = 'x_joint_elastic_both', // X_STOSS_ELAST_OBEN_UNTEN
    T_JOINT_FLOOR_CONTINUOUS = 't_joint_floor_continuous', // T-Stoss, flankierende Decke durchlaufend
    X_JOINT_FLOOR_CONTINUOUS = 'x_joint_floor_continuous'  // X-Stoss, flankierende Decke durchlaufend
}

export enum MassTimberStandard {
    DIN4109_33 = 'DIN4109_33',
    DIN_EN_ISO12354 = 'DIN_EN_ISO12354'
}

export enum TransmissionDirection {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal'
}

/**
 * Calculate mass timber junction attenuation - VBA Kij_HB function
 * Complete implementation of the VBA Kij_HB function from calc_holzbau_single.vba
 */
export function calculateMassTimberJunctionAttenuation(params: {
    junctionType: MassTimberJunctionType;
    standard: MassTimberStandard;
    flankingPath: FlankingPathType;
    transmissionDirection: TransmissionDirection;
    flankingMass: number;
    separatingMass: number;
}): number {
    const { junctionType, standard, flankingPath, transmissionDirection, flankingMass, separatingMass } = params;
    
    // Calculate logarithmic mass ratio - VBA: M = Log10(m_s / m_f)
    let M = 0;
    if (separatingMass > 0 && flankingMass > 0) {
        M = log10(separatingMass / flankingMass);
    }
    
    let kij = 0;
    
    if (transmissionDirection === TransmissionDirection.VERTICAL) {
        
        switch (junctionType) {
            case MassTimberJunctionType.T_JOINT:
                if (standard === MassTimberStandard.DIN_EN_ISO12354) {
                    switch (flankingPath) {
                        case FlankingPathType.Ff: kij = 22; break;
                        case FlankingPathType.Fd: 
                        case FlankingPathType.Df: kij = 15; break;
                    }
                } else {
                    switch (flankingPath) {
                        case FlankingPathType.Ff: kij = standard === MassTimberStandard.DIN4109_33 ? 
                                       21 + 4 * M + 3 * M * M : 21; break;
                        case FlankingPathType.Fd:
                        case FlankingPathType.Df: kij = standard === MassTimberStandard.DIN4109_33 ? 
                                       12 + 14 * M * M : 14; break;
                    }
                }
                break;
                
            case MassTimberJunctionType.T_JOINT_ELASTIC_TOP:
                switch (flankingPath) {
                    case FlankingPathType.Ff: 
                        kij = (standard === MassTimberStandard.DIN4109_33 ? 
                               21 + 4 * M + 3 * M * M : 21) + 5; 
                        break;
                    case FlankingPathType.Fd: 
                        kij = (standard === MassTimberStandard.DIN4109_33 ? 
                               12 + 14 * M * M : 14) + 5; 
                        break;
                    case FlankingPathType.Df: 
                        kij = standard === MassTimberStandard.DIN4109_33 ? 
                              12 + 14 * M * M : 14; 
                        break;
                }
                break;
                
            case MassTimberJunctionType.T_JOINT_ELASTIC_BOTH:
                switch (flankingPath) {
                    case FlankingPathType.Ff: 
                        kij = (standard === MassTimberStandard.DIN4109_33 ? 
                               21 + 4 * M + 3 * M * M : 21) + 10; 
                        break;
                    case FlankingPathType.Fd:
                    case FlankingPathType.Df: 
                        kij = (standard === MassTimberStandard.DIN4109_33 ? 
                               12 + 14 * M * M : 14) + 5; 
                        break;
                }
                break;
                
            case MassTimberJunctionType.X_JOINT:
                if (standard === MassTimberStandard.DIN_EN_ISO12354) {
                    switch (flankingPath) {
                        case FlankingPathType.Ff: kij = 23; break;
                        case FlankingPathType.Fd:
                        case FlankingPathType.Df: kij = 18; break;
                    }
                } else {
                    switch (flankingPath) {
                        case FlankingPathType.Ff: kij = standard === MassTimberStandard.DIN4109_33 ? 
                                       21 + 4 * M + 3 * M * M : 21; break;
                        case FlankingPathType.Fd:
                        case FlankingPathType.Df: kij = standard === MassTimberStandard.DIN4109_33 ? 
                                       12 + 14 * M * M : 14; break;
                    }
                }
                break;
                
            case MassTimberJunctionType.X_JOINT_ELASTIC_TOP:
                switch (flankingPath) {
                    case FlankingPathType.Ff: 
                        kij = (standard === MassTimberStandard.DIN4109_33 ? 
                               21 + 4 * M + 3 * M * M : 21) + 5; 
                        break;
                    case FlankingPathType.Fd: 
                        kij = (standard === MassTimberStandard.DIN4109_33 ? 
                               12 + 14 * M * M : 14) + 5; 
                        break;
                    case FlankingPathType.Df: 
                        kij = standard === MassTimberStandard.DIN4109_33 ? 
                              12 + 14 * M * M : 14; 
                        break;
                }
                break;
                
            case MassTimberJunctionType.X_JOINT_ELASTIC_BOTH:
                switch (flankingPath) {
                    case FlankingPathType.Ff: 
                        kij = (standard === MassTimberStandard.DIN4109_33 ? 
                               21 + 4 * M + 3 * M * M : 21) + 10; 
                        break;
                    case FlankingPathType.Fd:
                    case FlankingPathType.Df: 
                        kij = (standard === MassTimberStandard.DIN4109_33 ? 
                               12 + 14 * M * M : 14) + 5; 
                        break;
                }
                break;
        }
        
    } else if (transmissionDirection === TransmissionDirection.HORIZONTAL) {
        
        // Horizontal transmission (flankierende Decke)
        switch (junctionType) {
            case MassTimberJunctionType.X_JOINT_FLOOR_CONTINUOUS:
                if (standard === MassTimberStandard.DIN_EN_ISO12354) {
                    switch (flankingPath) {
                        case FlankingPathType.Ff: kij = 10 + 10 * M; break;
                        case FlankingPathType.Fd:
                        case FlankingPathType.Df: kij = 18; break;
                    }
                }
                break;
                
            case MassTimberJunctionType.T_JOINT_FLOOR_CONTINUOUS:
                switch (flankingPath) {
                    case FlankingPathType.Ff: kij = 3; break;
                    case FlankingPathType.Fd:
                    case FlankingPathType.Df: kij = standard === MassTimberStandard.DIN4109_33 ? 
                                   12 + 14 * M * M : 14; break;
                }
                break;
        }
    }
    
    return roundToOneDecimal(kij);
}

/**
 * Mass Timber Calculator - Main class
 */
export class MassTimberCalculator {
    
    /**
     * Calculate sound reduction for mass timber elements
     */
    calculateSoundReduction(surfaceMass: number, timberType: MassTimberType = MassTimberType.HEAVY_TIMBER): number {
        return calculateMassTimberRw(surfaceMass, timberType);
    }
    
    /**
     * Calculate junction attenuation for mass timber junctions
     */
    calculateJunctionAttenuation(params: {
        junctionType: MassTimberJunctionType;
        standard: MassTimberStandard;
        flankingPath: FlankingPathType;
        transmissionDirection: TransmissionDirection;
        flankingMass: number;
        separatingMass: number;
    }): number {
        return calculateMassTimberJunctionAttenuation(params);
    }
    
    /**
     * Calculate combined improvements from multiple layers
     */
    calculateCombinedImprovement(DRiw: number, DRjw: number): number {
        return roundToOneDecimal(calculateCombinedLayerImprovement(DRiw, DRjw));
    }
    
    /**
     * Validate mass timber construction parameters
     */
    validateParameters(params: {
        surfaceMass: number;
        timberType: MassTimberType;
        junctionType?: MassTimberJunctionType;
        standard?: MassTimberStandard;
    }): boolean {
        if (params.surfaceMass <= 0) {
            throw new Error('Surface mass must be positive');
        }
        
        if (params.surfaceMass < 30) {
            console.warn('Very low surface mass for mass timber construction (<30 kg/m²)');
        }
        
        if (params.surfaceMass > 500) {
            console.warn('Very high surface mass for mass timber construction (>500 kg/m²)');
        }
        
        return true;
    }
}
