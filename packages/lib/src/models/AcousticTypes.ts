/**
 * Core type definitions for acoustic calculations
 * Based on VBA implementation analysis
 */

export enum MaterialType {
    // Concrete types - VBA: SB_KS_MZ, LEICHTB, PORENB
    Concrete = 'concrete',                                  // SB_KS_MZ "Beton, KS-Stein, Mauerziegel"
    Masonry = 'masonry',
    Brick = 'brick', 
    LightweightConcrete = 'lightweight_concrete',           // LEICHTB "Leichtbeton"
    AeratedConcrete = 'aerated_concrete',                   // PORENB "Porenbeton"
    
    // Timber types
    MassTimber = 'mass_timber',                             // For MHD, MHW, MHE types
    TimberFrame = 'timber_frame',                           // For HSTW, HBD types
    MetalStud = 'metal_stud'                                // For MSTW types
}

export enum ConstructionType {
    Solid = 'solid',              // Massivbau - concrete, masonry
    MassTimber = 'mass_timber',   // Massivholzbau - MHD, MHW, MHE
    Lightweight = 'lightweight'   // Leichtbau - HSTW, MSTW, HBD
}

/**
 * Construction categories based on VBA implementation
 * Separate categories for each distinct construction type
 */
export enum ConstructionCategory {
    Massivbau = 'massivbau',           // VBA: "Massivbau" - solid construction (concrete, masonry)
    Massivholzbau = 'massivholzbau',   // VBA: Mass timber construction (MHD, MHW, MHE)
    Leichtbau = 'leichtbau'            // VBA: Lightweight construction (HBD, HSTW, MSTW)
}

/**
 * Junction direction enum from VBA
 */
export enum JunctionDirection {
    Vertical = 'vertical',
    Horizontal = 'horizontal'
}

/**
 * Junction connection types from VBA
 */
export enum JunctionConnection {
    Continuous = 'continuous',
    Separated = 'separated',
    Interrupted = 'interrupted'
}

export enum ElementType {
    Floor = 'floor',
    Wall = 'wall',
    Ceiling = 'ceiling'
}

export enum FlankingPathType {
    Ff = 'Ff',    // Direct flanking (wall to wall via floor)
    Fd = 'Fd',    // Floor to flanking (wall to floor via wall)
    Df = 'Df',    // Flanking to floor (floor to wall via floor)
    DFf = 'DFf'   // Double flanking (not implemented in VBA)
}

export enum ScreedType {
    CementOnMineralFiber = 'cement_mineral_fiber',  // VBA: ZE_MF "Zementestrich auf Mineralfaser"
    CementOnWoodFiber = 'cement_wood_fiber',        // VBA: ZE_WF "Zementestrich auf Holzfaser" 
    DryScreed = 'dry_screed',                       // VBA: TE "Trockenestrich"
    Gussasphalt = 'gussasphalt'
}

export enum CladdingType {
    WoodBoardPlusGK = 'wood_board_gk',              // VBA: HWST_GK "Holzwerkstoffplatte + GKP"
    GypsusFiber = 'gypsum_fiber',                   // VBA: GF "Gipsfaser"
    WoodBoardOnly = 'wood_board_only',              // VBA: HWST "Holzwerkstoffplatte"
    MassTimber = 'mass_timber',
    SingleGypsum = 'single_gypsum',                 // 1x Gipskarton
    DoubleGypsum = 'double_gypsum',                 // 2x Gipskarton
    FireResistantSingle = 'fire_resistant_single',  // 1x Gipskarton-Feuerschutz
    FireResistantDouble = 'fire_resistant_double',  // 2x Gipskarton-Feuerschutz
    OSB = 'osb',                                    // OSB-Platte
    Chipboard = 'chipboard'                         // Spanplatte
}

/**
 * Floor construction types from VBA
 */
export enum FloorConstructionType {
    // Timber beam floors - VBA: HBD variants
    TimberBeamOpen = 'timber_beam_open',                    // HBD_OFFEN
    TimberBeamWithBattensGK = 'timber_beam_battens_gk',     // HBD_L_GK  
    TimberBeamWithCeilingGK = 'timber_beam_ceiling_gk',     // HBD_ABH_GK
    TimberBeamWithCeiling2GK = 'timber_beam_ceiling_2gk',   // HBD_ABH_2GK
    
    // Mass timber floors - VBA: MHD variants
    MassTimberFloor = 'mass_timber_floor',                  // MHD "Massivholzdecke"
    MassTimberWithCeiling = 'mass_timber_ceiling',          // MHD_UD "mit Unterdecke"
    MassTimberRibbed = 'mass_timber_ribbed',                // MHD_RIPPEN_KASTEN
    TimberConcreteComposite = 'timber_concrete_composite',   // MHD_HBV "Holz-Beton-Verbunddecke"
    
    // Concrete floors
    ReinforcedConcrete = 'reinforced_concrete'              // SBD "Stahlbetondecke"
}

/**
 * Wall construction types from VBA  
 */
export enum WallConstructionType {
    // Solid construction - VBA: MW, SBD variants
    Masonry = 'masonry',                                    // MW "Massivwand"
    ReinforcedConcrete = 'reinforced_concrete',             // SBD
    
    // Mass timber - VBA: MHW, MHE variants
    MassTimberWall = 'mass_timber_wall',                    // MHW "Massivholzwand"
    MassTimberElement = 'mass_timber_element',              // MHE "Massivholzelement"
    MassTimberElementGravel = 'mass_timber_element_gravel', // MHE_SPLITT
    TimberConcreteElement = 'timber_concrete_element',       // MHE_HBV "HBV-Element"
    
    // Lightweight - VBA: HSTW, MSTW
    TimberFrame = 'timber_frame',                           // HSTW "Holztafel-/Holzständerwand"
    MetalStud = 'metal_stud',                               // MSTW "Metallständerwand"
    
    // Roof types
    ConcreteFlat = 'concrete_flat',                         // SB_FLACHD "Stahlbeton-Flachdach"
    MassTimberFlat = 'mass_timber_flat',                    // MH_FLACHD "Massivholz-Flachdach"
    TimberBeamFlat = 'timber_beam_flat',                    // HB_FLACHD "Balkenlage-Flachdach"
    RafterPitch = 'rafter_pitch'                            // SP_STEILD "Sparren-Steildach"
}

/**
 * Room configuration from VBA
 */
export enum RoomConfiguration {
    WithoutOffset = 'without_offset',                       // OHNE_VERSATZ "Räume mit geringem Versatz"
    WithOffset = 'with_offset',                             // MIT_VERSATZ "Räume mit Versatz > 0,5 m"
    Diagonal = 'diagonal'                                   // DIAGONAL "Räume diagonal versetzt"
}

/**
 * Construction standards from VBA
 */
export enum AcousticStandard {
    DIN4109 = 'din4109',                                    // DIN4109_32, DIN4109_33
    ISO12354 = 'iso12354',                                  // DIN_EN_ISO12354  
    Vibroakustik = 'vibroakustik'                           // VIBROAKUSTIK
}

export enum JunctionType {
    // Vertical sound transmission (Floor/Wall) - VBA: T_STOSS variants
    TJoint = 't_joint',                                     // T_STOSS
    TJointElasticTop = 't_joint_elastic_top',              // T_STOSS_ELAST_OBEN
    TJointElasticBoth = 't_joint_elastic_both',            // T_STOSS_ELAST_OBEN_UNTEN
    XJoint = 'x_joint',                                     // X_STOSS
    XJointElasticTop = 'x_joint_elastic_top',              // X_STOSS_ELAST_OBEN
    XJointElasticBoth = 'x_joint_elastic_both',            // X_STOSS_ELAST_OBEN_UNTEN
    
    // Horizontal sound transmission (Wall/Wall) - VBA: T_STOSS/X_STOSS variants
    TJointContinuous = 't_joint_continuous',                // T_STOSS_DURCHLAUFEND
    TJointSeparated = 't_joint_separated',                  // T_STOSS_GETRENNT
    TJointWallFullySeparated = 't_joint_wall_fully_sep',   // T_STOSS_WAND_VOLL_GETRENNT
    TJointFloorFullySeparated = 't_joint_floor_fully_sep', // T_STOSS_DECKE_VOLL_GETRENNT
    TJointInterrupted = 't_joint_interrupted',              // T_STOSS_UNTERBROCHEN
    XJointContinuous = 'x_joint_continuous',                // X_STOSS_DURCHLAUFEND
    XJointSeparated = 'x_joint_separated',                  // X_STOSS_GETRENNT
    XJointInterrupted = 'x_joint_interrupted'               // X_STOSS_UNTERBROCHEN
}

/**
 * Junction offset types from VBA
 */
export enum JunctionOffset {
    LeftWallOutward = 'left_wall_outward',                  // WAND_LINKS_AUSSEN
    LeftWallInward = 'left_wall_inward',                    // WAND_LINKS_INNEN
    RightWallOutward = 'right_wall_outward',                // WAND_RECHTS_AUSSEN
    RightWallInward = 'right_wall_inward'                   // WAND_RECHTS_INNEN
}

/**
 * Basic acoustic parameters
 */
export interface AcousticParameters {
    rw: number;                    // Weighted sound reduction index [dB]
    lnw?: number;                  // Normalized impact sound pressure level [dB]
    c50?: number;                  // Spectrum adaptation term [dB]
    ctr50?: number;                // Traffic spectrum adaptation term [dB]
}

/**
 * Material properties for calculations
 */
export interface Material {
    type: MaterialType;
    surfaceMass: number;          // [kg/m²]
    thickness?: number;           // [mm]
    constructionType: ConstructionType;
}

/**
 * Junction data for flanking calculations
 */
export interface JunctionData {
    type: JunctionType;
    direction: JunctionDirection;
    connection?: JunctionConnection;
    elasticImprovement?: number;  // dB improvement for elastic junctions
}

/**
 * Building element definition
 */
export interface BuildingElement {
    id: string;
    type: ElementType;
    material: Material;
    area: number;                 // [m²]
    length?: number;              // [m] - element length
    Rw: number;                   // Weighted sound reduction index [dB]
    massPerArea: number;          // [kg/m²] - surface mass
    constructionType: ConstructionCategory; // Construction type from VBA
    acousticParams?: AcousticParameters;
}

/**
 * Flanking element with connection details
 */
export interface FlankingElement extends BuildingElement {
    commonLength: number;         // [m] - coupling length with separating element
    senderSideRw: number;        // Sound reduction of sender side [dB]
    receiverSideRw: number;      // Sound reduction of receiver side [dB]
}

/**
 * Flanking path calculation result
 */
export interface FlankingPath {
    path: FlankingPathType;
    transmissionValue: number;    // Rijw [dB]
    isActive: boolean;
}

/**
 * Complete calculation results
 */
export interface CalculationResults {
    separating: AcousticParameters;     // Direct transmission
    flanking: FlankingPath[];           // Flanking transmission paths
    combined: AcousticParameters;       // R'w combined results
    timestamp: Date;
    validationErrors?: ValidationError[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning';
}
