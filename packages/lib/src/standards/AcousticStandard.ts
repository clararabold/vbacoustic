/**
 * Acoustic calculation standards interface
 * Provides unified interface for different calculation standards
 */

export enum StandardType {
    DIN4109 = 'DIN4109',
    ISO12354 = 'ISO12354', 
    VIBROAKUSTIK = 'VIBROAKUSTIK'
}

export enum CalculationMethod {
    SIMPLIFIED = 'simplified',
    DETAILED = 'detailed',
    EXPERIMENTAL = 'experimental'
}

export enum ElementType {
    SEPARATING_WALL = 'separating_wall',
    SEPARATING_FLOOR = 'separating_floor', 
    EXTERIOR_WALL = 'exterior_wall',
    INTERIOR_WALL = 'interior_wall',
    TIMBER_WALL = 'timber_wall',
    TIMBER_FLOOR = 'timber_floor',
    TIMBER_FRAME_WALL = 'timber_frame_wall',
    TIMBER_FRAME_FLOOR = 'timber_frame_floor'
}

export enum BuildingClass {
    STANDARD = 'standard',
    INCREASED = 'increased',
    HIGH = 'high'
}

export enum JunctionType {
    RIGID_RIGID = 'rigid_rigid',
    RIGID_LIGHTWEIGHT = 'rigid_lightweight', 
    LIGHTWEIGHT_LIGHTWEIGHT = 'lightweight_lightweight',
    CROSS_RIGID = 'cross_rigid',
    CROSS_FLEXIBLE = 'cross_flexible',
    TEE_RIGID = 'tee_rigid',
    TEE_FLEXIBLE = 'tee_flexible',
    CORNER_RIGID = 'corner_rigid',
    CORNER_FLEXIBLE = 'corner_flexible',
    CLT_CLT_RIGID = 'clt_clt_rigid',
    CLT_CLT_FLEXIBLE = 'clt_clt_flexible',
    CLT_FRAME_RIGID = 'clt_frame_rigid',
    CLT_FRAME_FLEXIBLE = 'clt_frame_flexible',
    FRAME_FRAME_RIGID = 'frame_frame_rigid',
    FRAME_FRAME_FLEXIBLE = 'frame_frame_flexible',
    TIMBER_CONCRETE = 'timber_concrete',
    TIMBER_STEEL = 'timber_steel'
}

export enum ConstructionTypeStandard {
    MASSIVBAU_BETON = 'massivbau_beton',
    MASSIVBAU_ZIEGEL = 'massivbau_ziegel',
    MASSIVBAU_KALKSANDSTEIN = 'massivbau_kalksandstein',
    HOLZBAU_MASSIV = 'holzbau_massiv',
    HOLZBAU_RAHMEN = 'holzbau_rahmen',
    STAHLBAU_SANDWICH = 'stahlbau_sandwich',
    CONCRETE_MONOLITHIC = 'concrete_monolithic',
    CONCRETE_SANDWICH = 'concrete_sandwich',
    MASONRY_SINGLE = 'masonry_single',
    MASONRY_DOUBLE = 'masonry_double',
    TIMBER_FRAME = 'timber_frame',
    TIMBER_MASSIVE = 'timber_massive',
    STEEL_FRAME = 'steel_frame',
    MIXED_CONSTRUCTION = 'mixed_construction',
    CLT_SOLID = 'clt_solid',
    CLT_CAVITY = 'clt_cavity',
    TIMBER_FRAME_LIGHT = 'timber_frame_light',
    TIMBER_FRAME_HEAVY = 'timber_frame_heavy',
    GLULAM_CONSTRUCTION = 'glulam_construction',
    TIMBER_CONCRETE_COMPOSITE = 'timber_concrete_composite',
    MASSIVE_TIMBER = 'massive_timber',
    TIMBER_HYBRID = 'timber_hybrid',
    LIGHTWEIGHT_CONSTRUCTION = 'lightweight_construction'
}

export enum TimberType {
    CLT = 'clt',
    GLULAM = 'glulam',
    SOLID_TIMBER = 'solid_timber',
    ENGINEERED_TIMBER = 'engineered_timber',
    TIMBER_FRAME = 'timber_frame'
}

export enum JunctionStiffness {
    RIGID = 'rigid',
    SEMI_RIGID = 'semi_rigid',
    FLEXIBLE = 'flexible',
    DAMPED = 'damped'
}

export enum InstallationQuality {
    POOR = 'poor',
    AVERAGE = 'average',
    GOOD = 'good',
    EXCELLENT = 'excellent'
}

export interface StandardLimits {
    minRw: number;           // Minimum required sound reduction [dB]
    maxLnw: number;          // Maximum allowed impact sound [dB]
    frequencyRange: {
        min: number;         // Minimum frequency [Hz]
        max: number;         // Maximum frequency [Hz]
    };
    uncertainty?: number;    // Calculation uncertainty [dB]
}

export interface StandardValidationResult {
    isCompliant: boolean;
    deviations: StandardDeviation[];
    recommendedActions?: string[];
    standard: StandardType;
    method: CalculationMethod;
}

export interface StandardDeviation {
    parameter: string;
    required: number;
    actual: number;
    deviation: number;
    severity: 'warning' | 'error' | 'critical';
}

/**
 * Abstract base class for acoustic calculation standards
 */
export abstract class AcousticStandard {
    public readonly type: StandardType;
    public readonly method: CalculationMethod;
    public readonly version: string;

    constructor(type: StandardType, method: CalculationMethod, version: string) {
        this.type = type;
        this.method = method;
        this.version = version;
    }

    /**
     * Get standard-specific limits for building elements
     */
    abstract getLimits(elementType: ElementType, buildingClass?: BuildingClass): StandardLimits;

    /**
     * Validate calculation results against standard requirements
     */
    abstract validateResults(results: any): StandardValidationResult;

    /**
     * Apply standard-specific corrections to calculations
     */
    abstract applyStandardCorrections(baseValue: number, context: any): number;

    /**
     * Get junction attenuation values according to standard
     */
    abstract getJunctionAttenuation(junctionType: JunctionType, masses: number[]): number;

    /**
     * Check if construction method is supported by this standard
     */
    abstract isConstructionSupported(constructionType: ConstructionTypeStandard): boolean;
}
