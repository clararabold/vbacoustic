/**
 * Additional Layer Improvement Calculator (DRw)
 * Implements exact VBA formulas for additional shells and pre-wall systems
 */

import { log10, validatePositive, validateFrequencyRange, roundToOneDecimal } from '../utils/MathUtils';

/**
 * Additional layer properties
 */
export interface AdditionalLayer {
    mass: number;                 // [kg/m²]
    cavityThickness?: number;     // [m] - air cavity thickness
    dynamicStiffness?: number;    // [MN/m³] - for resilient connections
    isSolidConnection: boolean;   // true for solid, false for air cavity
}

/**
 * Calculates resonance frequency f0 for additional layer system
 * Based on VBA formulas from calc_Massivbau_single.vba
 */
export function calculateResonanceFrequency(
    layer: AdditionalLayer,
    baseMass: number,
    cavityThickness?: number
): number {
    validatePositive(layer.mass, 'layer.mass');
    validatePositive(baseMass, 'baseMass');
    
    const m1 = baseMass;
    const m2 = layer.mass;
    
    let f0: number;
    
    if (layer.isSolidConnection) {
        // VBA: f0 = 160 * sqrt(0.08/d * (1/m1 + 1/m2))
        if (!cavityThickness) {
            throw new Error('Cavity thickness required for solid connection calculation');
        }
        const d = cavityThickness;
        f0 = 160 * Math.sqrt(0.08 / d * (1 / m1 + 1 / m2));
    } else {
        // VBA: f0 = 160 * sqrt(s * (1/m1 + 1/m2))
        if (!layer.dynamicStiffness) {
            throw new Error('Dynamic stiffness required for air cavity calculation');
        }
        const s = layer.dynamicStiffness;
        f0 = 160 * Math.sqrt(s * (1 / m1 + 1 / m2));
    }
    
    return f0;
}

/**
 * Calculates prewall system improvement (DRw) - Complete VBA implementation
 * VBA Function: DRwVSSchale(d As Double, s As Double, m1 As Double, m2 As Double, Rw As Double)
 * Based on DIN 4109-34:2016
 */
export function calculatePrewallImprovement(params: {
    cavityThickness?: number;        // d [m] - for solid connection
    dynamicStiffness?: number;       // s [MN/m³] - for resilient connection
    baseMass: number;               // m1 [kg/m²] - existing wall mass
    prewallMass: number;            // m2 [kg/m²] - prewall mass
    baseRw: number;                 // Rw [dB] - basic sound reduction
}): number {
    const { cavityThickness, dynamicStiffness, baseMass, prewallMass, baseRw } = params;
    
    // Input validation - VBA logic: (d > 0 XOR s > 0) AND m1 > 0 AND m2 > 0
    const hasValidConnection = (cavityThickness && cavityThickness > 0) !== (dynamicStiffness && dynamicStiffness > 0);
    if (!hasValidConnection || baseMass <= 0 || prewallMass <= 0) {
        return 0; // VBA returns 0 for invalid input
    }
    
    // Calculate resonance frequency f0 - exact VBA formulas
    let f0: number;
    if (cavityThickness && cavityThickness > 0) {
        // VBA: f_0 = 160 * Sqr(0.08 / d * (1 / m1 + 1 / m2))
        f0 = 160 * Math.sqrt(0.08 / cavityThickness * (1 / baseMass + 1 / prewallMass));
    } else if (dynamicStiffness && dynamicStiffness > 0) {
        // VBA: f_0 = 160 * Sqr(s * (1 / m1 + 1 / m2))
        f0 = 160 * Math.sqrt(dynamicStiffness * (1 / baseMass + 1 / prewallMass));
    } else {
        return 0;
    }
    
    // Calculate DRw based on frequency ranges - exact VBA implementation
    let DRw: number;
    
    if (f0 > 1600) {
        DRw = -5;
    } else if (f0 >= 630) {
        DRw = -10;
    } else if (f0 >= 500) {
        // VBA: DRwVSSchale = -9 - 1 / (630 - 500) * (f_0 - 500)
        DRw = -9 - 1 / (630 - 500) * (f0 - 500);
    } else if (f0 >= 400) {
        // VBA: DRwVSSchale = -7 - 2 / (500 - 400) * (f_0 - 400)
        DRw = -7 - 2 / (500 - 400) * (f0 - 400);
    } else if (f0 >= 315) {
        // VBA: DRwVSSchale = -5 - 2 / (400 - 315) * (f_0 - 315)
        DRw = -5 - 2 / (400 - 315) * (f0 - 315);
    } else if (f0 >= 250) {
        // VBA: DRwVSSchale = -3 - 2 / (315 - 250) * (f_0 - 250)
        DRw = -3 - 2 / (315 - 250) * (f0 - 250);
    } else if (f0 >= 200) {
        // VBA: DRwVSSchale = -1 - 2 / (250 - 200) * (f_0 - 200)
        DRw = -1 - 2 / (250 - 200) * (f0 - 200);
    } else if (f0 > 160) {
        // VBA: DRwVSSchale = 0 - 1 / (200 - 160) * (f_0 - 160)
        DRw = 0 - 1 / (200 - 160) * (f0 - 160);
    } else if (f0 >= 30) {
        // VBA: DRwVSSchale = 74.4 - 20 * Log10(f_0) - 0.5 * Rw
        DRw = 74.4 - 20 * log10(f0) - 0.5 * baseRw;
        if (DRw < 0) DRw = 0; // VBA: If DRwVSSchale < 0 Then DRwVSSchale = 0
    } else {
        // VBA shows message: f_0 is not permissible, returns 0
        return 0;
    }
    
    return roundToOneDecimal(DRw);
}

/**
 * Legacy function for backward compatibility
 */
export function calculateAdditionalShellImprovement(
    f0: number,
    basicRw: number
): number {
    if (f0 < 30 || f0 > 200) {
        throw new Error(`Resonance frequency f0 = ${f0} Hz is not valid (must be 30-200 Hz)`);
    }
    
    const DRw = 74.4 - 20 * log10(f0) - 0.5 * basicRw;
    return Math.max(0, roundToOneDecimal(DRw));
}

/**
 * Combined layer improvements for flanking transmission
 * VBA: DRijw = max(DRiw, DRjw) + 0.5 * min(DRiw, DRjw)
 */
export function combineLaterImprovements(DRiw: number, DRjw: number): number {
    const maxImprovement = Math.max(DRiw, DRjw);
    const minImprovement = Math.min(DRiw, DRjw);
    
    const DRijw = maxImprovement + 0.5 * minImprovement;
    return roundToOneDecimal(DRijw);
}

/**
 * Calculate complete layer improvement for an element
 */
export function calculateLayerImprovement(
    layer: AdditionalLayer,
    baseMass: number,
    basicRw: number,
    cavityThickness?: number
): number {
    // Use the cavity thickness from the layer if not provided separately
    const thickness = cavityThickness || layer.cavityThickness;
    const f0 = calculateResonanceFrequency(layer, baseMass, thickness);
    return calculateAdditionalShellImprovement(f0, basicRw);
}
