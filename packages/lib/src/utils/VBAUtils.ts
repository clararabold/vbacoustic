/**
 * Utility Functions - Complete VBA global_function_variables implementation
 * Provides VBA compatibility functions and acoustic calculation helpers
 */

/**
 * VBA-compatible max function - handles variable arguments
 */
export function max_(...values: number[]): number {
    if (values.length === 0) {
        throw new Error('max_ function requires at least one argument');
    }
    return Math.max(...values.filter(v => !isNaN(v)));
}

/**
 * VBA-compatible min function - handles variable arguments  
 */
export function min_(...values: number[]): number {
    if (values.length === 0) {
        throw new Error('min_ function requires at least one argument');
    }
    return Math.min(...values.filter(v => !isNaN(v)));
}

/**
 * VBA Round function - rounds to specified decimal places
 * Different from JavaScript Math.round which only rounds to integers
 */
export function roundVBA(value: number, decimalPlaces: number = 0): number {
    if (isNaN(value)) return value;
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
}

/**
 * VBA-compatible logarithm base 10
 */
export function log10(value: number): number {
    if (value <= 0) {
        throw new Error('Logarithm of non-positive number');
    }
    return Math.log10(value);
}

/**
 * VBA-compatible power function
 */
export function pow(base: number, exponent: number): number {
    return Math.pow(base, exponent);
}

/**
 * VBA-compatible absolute value
 */
export function abs(value: number): number {
    return Math.abs(value);
}

/**
 * Energy sum calculation - frequently used in acoustic calculations
 * Formula: 10 * log10(sum(10^(Li/10))) where Li are levels in dB
 */
export function energySum(...levels: number[]): number {
    if (levels.length === 0) return 0;
    
    const validLevels = levels.filter(level => !isNaN(level) && isFinite(level));
    if (validLevels.length === 0) return 0;
    
    const energyTerms = validLevels.map(level => pow(10, level / 10));
    const totalEnergy = energyTerms.reduce((sum, energy) => sum + energy, 0);
    
    return 10 * log10(totalEnergy);
}

/**
 * Energy difference calculation - for sound reduction combinations
 * Formula: 10 * log10(10^(L1/10) - 10^(L2/10))
 */
export function energyDifference(level1: number, level2: number): number {
    if (isNaN(level1) || isNaN(level2)) {
        throw new Error('Invalid input values for energy difference');
    }
    
    const energy1 = pow(10, level1 / 10);
    const energy2 = pow(10, level2 / 10);
    
    if (energy1 <= energy2) {
        // Cannot have negative energy difference in acoustic calculations
        return 0;
    }
    
    return 10 * log10(energy1 - energy2);
}

/**
 * Convert linear value to dB
 */
export function toDecibel(linearValue: number): number {
    if (linearValue <= 0) {
        throw new Error('Cannot convert non-positive value to decibel');
    }
    return 10 * log10(linearValue);
}

/**
 * Convert dB value to linear
 */
export function fromDecibel(decibelValue: number): number {
    return pow(10, decibelValue / 10);
}

/**
 * Mass-based sound reduction calculation - VBA standard formula
 * Rw = 25 * log10(m) - 7  [dB]
 */
export function calculateRwFromMass(massPerArea: number): number {
    if (massPerArea <= 0) {
        throw new Error('Mass per area must be positive');
    }
    return 25 * log10(massPerArea) - 7;
}

/**
 * Check if value is within valid range for acoustic parameters
 */
export function isValidAcousticValue(value: number, min: number = 0, max: number = 200): boolean {
    return !isNaN(value) && isFinite(value) && value >= min && value <= max;
}

/**
 * Clamp value to valid acoustic range
 */
export function clampAcousticValue(value: number, min: number = 0, max: number = 200): number {
    if (isNaN(value) || !isFinite(value)) {
        return min;
    }
    return max_(min_(value, max), min);
}

/**
 * Safe division with protection against division by zero
 */
export function safeDivision(numerator: number, denominator: number, defaultValue: number = 0): number {
    if (denominator === 0 || isNaN(denominator)) {
        return defaultValue;
    }
    return numerator / denominator;
}

/**
 * Array utility functions
 */
export class ArrayUtils {
    /**
     * Get maximum value from array, filtering out invalid values
     */
    static max(values: number[]): number {
        const validValues = values.filter(v => isValidAcousticValue(v));
        if (validValues.length === 0) {
            throw new Error('No valid values in array');
        }
        return Math.max(...validValues);
    }
    
    /**
     * Get minimum value from array, filtering out invalid values
     */
    static min(values: number[]): number {
        const validValues = values.filter(v => isValidAcousticValue(v));
        if (validValues.length === 0) {
            throw new Error('No valid values in array');
        }
        return Math.min(...validValues);
    }
    
    /**
     * Calculate energy sum of array values
     */
    static energySum(values: number[]): number {
        const validValues = values.filter(v => isValidAcousticValue(v));
        return energySum(...validValues);
    }
}

/**
 * Formatting utilities for acoustic values
 */
export class AcousticFormatter {
    /**
     * Format acoustic value to standard precision (1 decimal place)
     */
    static formatValue(value: number): string {
        if (isNaN(value) || !isFinite(value)) {
            return '---';
        }
        return roundVBA(value, 1).toFixed(1);
    }
    
    /**
     * Format mass value (kg/m²) to standard precision
     */
    static formatMass(massPerArea: number): string {
        if (isNaN(massPerArea) || !isFinite(massPerArea)) {
            return '---';
        }
        return roundVBA(massPerArea, 0).toString();
    }
    
    /**
     * Format area value (m²) to standard precision
     */
    static formatArea(area: number): string {
        if (isNaN(area) || !isFinite(area)) {
            return '---';
        }
        return roundVBA(area, 1).toFixed(1);
    }
    
    /**
     * Format thickness value (mm) to standard precision
     */
    static formatThickness(thickness: number): string {
        if (isNaN(thickness) || !isFinite(thickness)) {
            return '---';
        }
        // Convert from m to mm and round to integer
        return roundVBA(thickness * 1000, 0).toString();
    }
}

/**
 * VBA-compatible string functions
 */
export class StringUtils {
    /**
     * VBA-compatible string comparison (case-insensitive)
     */
    static equalsIgnoreCase(str1: string, str2: string): boolean {
        return str1.toLowerCase() === str2.toLowerCase();
    }
    
    /**
     * VBA-compatible string contains check
     */
    static contains(str: string, substring: string): boolean {
        return str.toLowerCase().includes(substring.toLowerCase());
    }
    
    /**
     * Format validation error message in VBA style
     */
    static formatError(message: string): string {
        return `Fehler: ${message}`;
    }
    
    /**
     * Format validation warning message in VBA style  
     */
    static formatWarning(message: string): string {
        return `Warnung: ${message}`;
    }
}

/**
 * Mathematical constants used in acoustic calculations
 */
export const AcousticConstants = {
    /** Reference sound pressure [Pa] */
    REFERENCE_SOUND_PRESSURE: 2e-5,
    
    /** Reference impedance for air [kg/(m²·s)] */
    AIR_IMPEDANCE: 415,
    
    /** Speed of sound in air at 20°C [m/s] */
    SPEED_OF_SOUND: 343,
    
    /** Standard frequency for weighting [Hz] */
    REFERENCE_FREQUENCY: 500,
    
    /** Minimum valid acoustic value [dB] */
    MIN_ACOUSTIC_VALUE: 0,
    
    /** Maximum valid acoustic value [dB] */
    MAX_ACOUSTIC_VALUE: 200,
    
    /** Precision for acoustic calculations [decimal places] */
    ACOUSTIC_PRECISION: 1
} as const;
