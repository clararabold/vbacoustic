/**
 * Results Combination Calculator
 * Implements exact VBA logarithmic addition formulas for combining transmission paths
 */

import { log10, roundToOneDecimal } from '../utils/MathUtils';
import { AcousticParameters, FlankingPath } from '../models/AcousticTypes';

/**
 * Combines sound reduction results using VBA logarithmic addition
 * VBA: RStrichw = sum of (10^(-0.1 * Rijw)) for all paths
 * VBA: RStrichw = -10 * Log10(RStrichw)
 */
export function combineSoundReductionResults(
    directRw: number,
    flankingPaths: FlankingPath[]
): number {
    // Start with direct transmission
    let sum = Math.pow(10, -0.1 * directRw);
    
    // Add all active flanking paths
    for (const path of flankingPaths) {
        if (path.isActive) {
            sum += Math.pow(10, -0.1 * path.transmissionValue);
        }
    }
    
    // VBA: RStrichw = -10 * Log10(RStrichw)
    const combinedRw = -10 * log10(sum);
    
    return roundToOneDecimal(combinedRw);
}

/**
 * Combines impact sound results using VBA logarithmic addition
 * VBA: LStrichnw = sum of (10^(0.1 * LnDijw)) for all paths
 * VBA: LStrichnw = 10 * Log10(LStrichnw)
 */
export function combineImpactSoundResults(
    directLnw: number,
    flankingPaths: FlankingPath[]
): number {
    // Start with direct transmission
    let sum = Math.pow(10, 0.1 * directLnw);
    
    // Add all active flanking paths
    for (const path of flankingPaths) {
        if (path.isActive) {
            sum += Math.pow(10, 0.1 * path.transmissionValue);
        }
    }
    
    // VBA: LStrichnw = 10 * Log10(LStrichnw)
    const combinedLnw = 10 * log10(sum);
    
    return roundToOneDecimal(combinedLnw);
}

/**
 * Combines complete acoustic parameters
 */
export function combineAcousticResults(
    separating: AcousticParameters,
    flankingSoundReduction: FlankingPath[],
    flankingImpactSound: FlankingPath[] = []
): AcousticParameters {
    const combinedResults: AcousticParameters = {
        rw: combineSoundReductionResults(separating.rw, flankingSoundReduction)
    };
    
    // Include impact sound if available
    if (separating.lnw !== undefined && flankingImpactSound.length > 0) {
        combinedResults.lnw = combineImpactSoundResults(separating.lnw, flankingImpactSound);
    } else if (separating.lnw !== undefined) {
        combinedResults.lnw = separating.lnw; // No flanking impact sound
    }
    
    // Preserve spectrum adaptation terms (not affected by flanking in Phase 1)
    if (separating.c50 !== undefined) {
        combinedResults.c50 = separating.c50;
    }
    if (separating.ctr50 !== undefined) {
        combinedResults.ctr50 = separating.ctr50;
    }
    
    return combinedResults;
}

/**
 * Utility function to create flanking path result
 */
export function createFlankingPath(
    pathType: string,
    transmissionValue: number,
    isActive: boolean = true
): FlankingPath {
    return {
        path: pathType as any, // Type assertion for Phase 1 simplification
        transmissionValue: roundToOneDecimal(transmissionValue),
        isActive: isActive
    };
}
