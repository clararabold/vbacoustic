/**
 * Mathematical utility functions for acoustic calculations
 * Implements VBA-compatible mathematical operations
 */

/**
 * Base 10 logarithm - VBA compatible implementation
 * VBA: Log10 = Log(X) / Log(10)
 */
export function log10(x: number): number {
    if (x <= 0) {
        throw new Error("Logarithm argument must be positive");
    }
    return Math.log(x) / Math.log(10);
}

/**
 * VBA-style rounding to specified decimal places
 */
export function roundToDecimalPlaces(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Round to 1 decimal place (standard for acoustic results)
 */
export function roundToOneDecimal(value: number): number {
    return roundToDecimalPlaces(value, 1);
}

/**
 * Validate that a number is positive
 */
export function validatePositive(value: number, paramName: string): void {
    if (value <= 0) {
        throw new Error(`${paramName} must be greater than 0, got ${value}`);
    }
}

/**
 * Validate that a frequency is within acceptable range (20-200 Hz)
 */
export function validateFrequencyRange(frequency: number): void {
    if (frequency < 20 || frequency > 200) {
        throw new Error(`Frequency f0 = ${frequency} Hz is not valid (must be 20-200 Hz)`);
    }
}

/**
 * Clamp value between minimum and maximum
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
