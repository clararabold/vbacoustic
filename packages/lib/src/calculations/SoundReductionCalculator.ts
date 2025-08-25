/**
 * Sound Reduction Index (Rw) Calculator
 * Implements exact VBA formulas from the acoustic calculation software
 * Based on calc_Massivbau_single.vba and calc_holzbau_single.vba
 */

import { log10, validatePositive, roundToOneDecimal } from '../utils/MathUtils';
import { MaterialType, ConstructionType, ConstructionCategory, Material } from '../models/AcousticTypes';

/**
 * Timber construction sub-types based on VBA implementation
 */
export enum TimberConstructionType {
    Heavy = 'heavy',           // VBA: Rw_HB - mass timber (Massivholz)
    Flexible = 'flexible',     // VBA: Rw_biegeweich - flexible construction
    Loaded = 'loaded'          // VBA: Rw_beschwert - loaded construction
}

/**
 * Calculates sound reduction index (Rw) for solid construction (Massivbau)
 * Based on exact VBA formulas from calc_Massivbau_single.vba RwBauteil function
 */
export function calculateRwSolidConstruction(surfaceMass: number, materialType: MaterialType): number {
    validatePositive(surfaceMass, 'surfaceMass');
    
    let rw: number;
    
    switch (materialType) {
        case MaterialType.Concrete:
        case MaterialType.Brick:
        case MaterialType.Masonry:
            // VBA: If Material = SB_KS_MZ Or Material = "Beton" Then RwBauteil = 30.9 * Log10(M) - 22.2
            rw = 30.9 * log10(surfaceMass) - 22.2;
            break;
            
        case MaterialType.LightweightConcrete:
            // VBA: ElseIf Material = LEICHTB Then RwBauteil = 30.9 * Log10(M) - 20.2
            rw = 30.9 * log10(surfaceMass) - 20.2;
            break;
            
        case MaterialType.AeratedConcrete:
            if (surfaceMass < 150) {
                // VBA: ElseIf Material = PORENB And M < 150 Then RwBauteil = 32.6 * Log10(M) - 22.5
                rw = 32.6 * log10(surfaceMass) - 22.5;
            } else {
                // VBA: ElseIf Material = PORENB And M >= 150 Then RwBauteil = 26.1 * Log10(M) - 8.4
                rw = 26.1 * log10(surfaceMass) - 8.4;
            }
            break;
            
        default:
            // Default to concrete formula for unknown solid materials
            rw = 30.9 * log10(surfaceMass) - 22.2;
            break;
    }
    
    return roundToOneDecimal(rw);
}

/**
 * Calculates sound reduction index (Rw) for timber construction (Holzbau)
 * Based on exact VBA formulas from calc_holzbau_single.vba
 */
export function calculateRwTimberConstruction(componentMass: number, constructionType: TimberConstructionType): number {
    validatePositive(componentMass, 'componentMass');
    
    let rw: number;
    
    switch (constructionType) {
        case TimberConstructionType.Heavy:
            // VBA: Public Function Rw_HB(m_Bauteil As Double) As Double
            // VBA: Rw_HB = 25 * Log10(m_Bauteil) - 7
            rw = 25 * log10(componentMass) - 7;
            break;
            
        case TimberConstructionType.Flexible:
            // VBA: Public Function Rw_biegeweich(m_Bauteil As Double) As Double
            // VBA: Rw_biegeweich = 20 * Log10(m_Bauteil) + 12
            rw = 20 * log10(componentMass) + 12;
            break;
            
        case TimberConstructionType.Loaded:
            // VBA: Public Function Rw_beschwert(m_Bauteil As Double) As Double
            // VBA: Rw_beschwert = 20 * Log10(m_Bauteil) + 10
            rw = 20 * log10(componentMass) + 10;
            break;
            
        default:
            throw new Error(`Invalid timber construction type: ${constructionType}`);
    }
    
    return roundToOneDecimal(rw);
}

/**
 * Main Rw calculation function that routes to appropriate method
 * Based on exact VBA logic from RwBauteil function
 */
export function calculateRw(material: Material): number {
    switch (material.constructionType) {
        case ConstructionType.Solid:
            return calculateRwSolidConstruction(material.surfaceMass, material.type);
            
        case ConstructionType.MassTimber:
            // VBA: ElseIf Bauweise = "Massivholzbau" And (Material = MHD Or Material = MHW) Then RwBauteil = Rw_HB(M)
            return calculateRwTimberConstruction(material.surfaceMass, TimberConstructionType.Heavy);
            
        case ConstructionType.Lightweight:
            // For lightweight construction, determine if flexible or loaded
            // For lightweight construction, determine if flexible or loaded
            // This would typically come from additional element properties
            // VBA logic would check specific material types here
            return calculateRwTimberConstruction(material.surfaceMass, TimberConstructionType.Flexible);
            
        default:
            throw new Error(`Unsupported construction type: ${material.constructionType}`);
    }
}
