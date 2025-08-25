import { 
    BuildingElement, 
    AcousticParameters, 
    ConstructionCategory,
    ElementType 
} from '../models/AcousticTypes';

/**
 * Input Validation System - Complete VBA checkdata implementation
 * Based on VBA checkdata_Trennwand, checkdata_Trenndecke, checkdata_Flanke functions
 */

export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}

/**
 * Validates separating wall elements - VBA checkdata_Trennwand logic
 */
export function validateSeparatingWall(element: BuildingElement): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    
    // VBA: Wall type validation
    if (!element.type || element.type !== ElementType.Wall) {
        errors.push({
            field: 'type',
            message: 'Wall type is required',
            severity: 'error'
        });
    }
    
    // VBA: Basic Rw validation
    if (!element.Rw || element.Rw <= 0) {
        errors.push({
            field: 'Rw',
            message: 'Sound reduction index Rw must be positive',
            severity: 'error'
        });
    }
    
    // VBA: Mass validation for specific construction types
    if (element.constructionType === ConstructionCategory.Massivbau || 
        element.constructionType === ConstructionCategory.Massivholzbau) {
        if (!element.massPerArea || element.massPerArea <= 0) {
            errors.push({
                field: 'massPerArea',
                message: 'Element mass is required for solid and mass timber construction',
                severity: 'error'
            });
        }
    }
    
    // VBA: Area validation
    if (!element.area || element.area <= 0) {
        errors.push({
            field: 'area',
            message: 'Element area must be positive',
            severity: 'error'
        });
    }
    
    // Physics-based validation
    if (element.Rw && element.Rw > 80) {
        warnings.push({
            field: 'Rw',
            message: 'Very high Rw value (>80 dB) - please verify',
            severity: 'warning'
        });
    }
    
    if (element.massPerArea && element.massPerArea > 1000) {
        warnings.push({
            field: 'massPerArea',
            message: 'Very high mass per area (>1000 kg/m²) - please verify',
            severity: 'warning'
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validates separating floor elements - VBA checkdata_Trenndecke logic
 */
export function validateSeparatingFloor(element: BuildingElement, acousticParams?: AcousticParameters): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    
    // VBA: Floor type validation
    if (!element.type || element.type !== ElementType.Floor) {
        errors.push({
            field: 'type',
            message: 'Floor type is required',
            severity: 'error'
        });
    }
    
    // VBA: Basic Rw validation
    if (!element.Rw || element.Rw <= 0) {
        errors.push({
            field: 'Rw',
            message: 'Sound reduction index Rw must be positive',
            severity: 'error'
        });
    }
    
    // VBA: Impact sound validation for floors
    if (!acousticParams?.lnw || acousticParams.lnw <= 0) {
        errors.push({
            field: 'lnw',
            message: 'Impact sound level Lnw is required for floors',
            severity: 'error'
        });
    }
    
    // VBA: Mass validation for mass timber floors
    if (element.constructionType === ConstructionCategory.Massivholzbau) {
        if (!element.massPerArea || element.massPerArea <= 0) {
            errors.push({
                field: 'massPerArea',
                message: 'Element mass is required for mass timber floors',
                severity: 'error'
            });
        }
    }
    
    // VBA: Area validation
    if (!element.area || element.area <= 0) {
        errors.push({
            field: 'area',
            message: 'Floor area must be positive',
            severity: 'error'
        });
    }
    
    // Physics-based validation for floors
    if (acousticParams?.lnw && acousticParams.lnw > 100) {
        warnings.push({
            field: 'lnw',
            message: 'Very high impact sound level (>100 dB) - please verify',
            severity: 'warning'
        });
    }
    
    if (element.Rw && element.Rw < 30) {
        warnings.push({
            field: 'Rw',
            message: 'Low sound reduction for floor (< 30 dB) - please verify',
            severity: 'warning'
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validates flanking elements - VBA checkdata_Flanke logic
 */
export function validateFlankingElement(element: BuildingElement, couplingLength?: number): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    
    // VBA: Element type validation
    if (!element.type) {
        errors.push({
            field: 'type',
            message: 'Flanking element type is required',
            severity: 'error'
        });
    }
    
    // VBA: Construction category validation
    if (!element.constructionType) {
        errors.push({
            field: 'constructionType',
            message: 'Construction category is required for flanking elements',
            severity: 'error'
        });
    }
    
    // VBA: Basic Rw validation
    if (!element.Rw || element.Rw <= 0) {
        errors.push({
            field: 'Rw',
            message: 'Sound reduction index Rw must be positive',
            severity: 'error'
        });
    }
    
    // VBA: Mass validation for solid construction
    if (element.constructionType === ConstructionCategory.Massivbau) {
        if (!element.massPerArea || element.massPerArea <= 0) {
            errors.push({
                field: 'massPerArea',
                message: 'Mass per area is required for solid flanking elements',
                severity: 'error'
            });
        }
    }
    
    // VBA: Area validation
    if (!element.area || element.area <= 0) {
        errors.push({
            field: 'area',
            message: 'Flanking element area must be positive',
            severity: 'error'
        });
    }
    
    // VBA: Coupling length validation
    if (couplingLength !== undefined && couplingLength <= 0) {
        errors.push({
            field: 'couplingLength',
            message: 'Coupling length must be positive',
            severity: 'error'
        });
    }
    
    // Physics-based validation
    if (element.massPerArea && element.massPerArea < 50 && element.constructionType === ConstructionCategory.Massivbau) {
        warnings.push({
            field: 'massPerArea',
            message: 'Low mass for solid construction (<50 kg/m²) - please verify',
            severity: 'warning'
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validates complete building configuration - VBA Bauteilueberpruefung logic
 */
export function validateBuildingConfiguration(params: {
    separatingElement: BuildingElement;
    flankingElements: BuildingElement[];
    acousticParams?: AcousticParameters;
    couplingLengths?: number[];
}): ValidationResult {
    const { separatingElement, flankingElements, acousticParams, couplingLengths } = params;
    
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];
    
    // Validate separating element
    let separatingValidation: ValidationResult;
    if (separatingElement.type === ElementType.Floor) {
        separatingValidation = validateSeparatingFloor(separatingElement, acousticParams);
    } else {
        separatingValidation = validateSeparatingWall(separatingElement);
    }
    
    allErrors.push(...separatingValidation.errors);
    allWarnings.push(...separatingValidation.warnings);
    
    // Validate flanking elements
    flankingElements.forEach((flankingElement, index) => {
        const couplingLength = couplingLengths ? couplingLengths[index] : undefined;
        const flankingValidation = validateFlankingElement(flankingElement, couplingLength);
        
        // Add element index to field names for clarity
        flankingValidation.errors.forEach(error => {
            allErrors.push({
                ...error,
                field: `flanking[${index}].${error.field}`,
                message: `Flanking element ${index + 1}: ${error.message}`
            });
        });
        
        flankingValidation.warnings.forEach(warning => {
            allWarnings.push({
                ...warning,
                field: `flanking[${index}].${warning.field}`,
                message: `Flanking element ${index + 1}: ${warning.message}`
            });
        });
    });
    
    // VBA: Check minimum number of flanking elements
    if (flankingElements.length === 0) {
        allErrors.push({
            field: 'flankingElements',
            message: 'At least one flanking element is required',
            severity: 'error'
        });
    }
    
    // VBA: Check maximum number of flanking elements (4 in VBA)
    if (flankingElements.length > 4) {
        allWarnings.push({
            field: 'flankingElements',
            message: 'More than 4 flanking elements - calculation complexity may increase',
            severity: 'warning'
        });
    }
    
    return {
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings
    };
}

/**
 * Comprehensive input validator class
 */
export class BuildingElementValidator {
    
    /**
     * Validate any building element based on its type
     */
    validate(element: BuildingElement, acousticParams?: AcousticParameters, couplingLength?: number): ValidationResult {
        switch (element.type) {
            case ElementType.Floor:
                return validateSeparatingFloor(element, acousticParams);
            case ElementType.Wall:
                return validateSeparatingWall(element);
            default:
                return validateFlankingElement(element, couplingLength);
        }
    }
    
    /**
     * Validate complete building configuration
     */
    validateBuilding(params: {
        separatingElement: BuildingElement;
        flankingElements: BuildingElement[];
        acousticParams?: AcousticParameters;
        couplingLengths?: number[];
    }): ValidationResult {
        return validateBuildingConfiguration(params);
    }
    
    /**
     * Check if validation result has critical errors
     */
    hasCriticalErrors(validation: ValidationResult): boolean {
        return validation.errors.length > 0;
    }
    
    /**
     * Get formatted error message for display - VBA WarningMessage logic
     */
    getErrorMessage(validation: ValidationResult): string {
        if (validation.errors.length === 0) {
            return '';
        }
        
        const errorMessages = validation.errors.map(error => `• ${error.message}`).join('\n');
        return `Data incomplete!\n${errorMessages}`;
    }
    
    /**
     * Get formatted warning message for display
     */
    getWarningMessage(validation: ValidationResult): string {
        if (validation.warnings.length === 0) {
            return '';
        }
        
        const warningMessages = validation.warnings.map(warning => `• ${warning.message}`).join('\n');
        return `Warnings:\n${warningMessages}`;
    }
}
