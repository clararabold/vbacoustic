import { 
  WallConstructionType, 
  FloorConstructionType, 
  ScreedType, 
  CladdingType,
  FlankingPathType,
  ElementType
} from '@vbacoustic/lib/src/models/AcousticTypes';
import { StandardType } from '@vbacoustic/lib/src/standards/AcousticStandard';

export interface ProjectConfiguration {
  // From frmVBAcoustic main form
  inputMode: 'manual' | 'ifc';
  constructionMethod: 'holzbau' | 'massivbau' | 'leichtbau';
  elementType: ElementType; // Use library enum directly
  calculationStandard: StandardType;
}

export interface ElementDimensions {
  thickness: number; // mm
  height: number;    // m
  width: number;     // m
  length?: number;   // m (for ceilings)
  area: number;      // m²
}

export interface WallConfiguration {
  // From frmVBAcousticTrennwand
  wallType: WallConstructionType; // Use library enum directly
  applicationContext: 'interior' | 'exterior';
  connectionType: 'point' | 'linear' | 'surface';
  
  // Direct dimension properties for easier access
  thickness: number; // mm
  height: number;    // m
  length: number;    // m
  
  dimensions: ElementDimensions;
  
  // Layer composition
  layers: ElementLayer[];
  
  // Flanking elements (4 sides for walls)
  flankingElements: FlankingElement[];
}

export interface CeilingConfiguration {
  // From frmVBAcousticTrenndecke - ceiling system types  
  ceilingType: FloorConstructionType; // Use library enum directly
  
  // Basic dimensions
  thickness: number;        // mm - ceiling thickness
  
  // Room dimensions (from VBA txtL1, txtL2 and chkRechteckraum)
  roomLength: number;       // m - L1 from VBA
  roomWidth: number;        // m - L2 from VBA
  isRectangularRoom: boolean; // chkRechteckraum from VBA
  customArea?: number;      // m² - for non-rectangular rooms (txtSDecke from VBA)
  
  // Estrich configuration (for solid timber ceilings)
  estrichType?: ScreedType; // Use library enum directly
  estrichThickness?: number;  // mm
  
  // Suspended ceiling configuration (for MHD_UD)
  cavityHeight?: number;      // mm - cavity height
  underCeilingType?: CladdingType; // Use library enum directly
  
  // Layer composition
  layers: ElementLayer[];
  
  // Flanking elements (surrounding walls)
  flankingElements: FlankingElement[];
}

export interface ElementLayer {
  id: string;
  name: string;             // Display name for the layer
  material: string;
  thickness: number;        // mm
  density?: number;         // kg/m³
  elasticModulus?: number;  // N/mm²
  poissonRatio?: number;
  lossFactorStructural?: number;
  
  // Acoustic properties
  soundReductionIndex?: number; // dB
  impactSoundImprovement?: number; // dB
}

export interface FlankingElement {
  id: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back'; // For walls around ceiling
  elementType: ElementType; // Use library enum directly - always Wall for ceilings
  
  // VBA-style wall type selection (HSTW, MHW, MSTW, MW)
  wallType?: WallConstructionType; // Wall construction type (timber frame, mass timber, metal stud, masonry)
  claddingType?: string; // Wall cladding/planking type (GF, HWST_GK, HWST)
  
  // Dimensions and properties
  thickness: number;
  length: number;
  material: string; // Add material property for UI forms
  
  // VBA-style acoustic properties  
  rw?: number; // Sound reduction index
  dnfw?: number; // Flanking sound reduction (for lightweight walls)
  mass?: number; // Surface mass kg/m²
  
  // Junction details (VBA: Stoßstelle)
  junctionType: 'rigid' | 'elastic' | 'isolated';
  connectionDetails: string;
  
  // Junction coupling parameters (VBA: Kij values)
  kFf?: number; // Flanking-to-flanking vibration coupling
  kDf?: number; // Direct-to-flanking vibration coupling  
  kFd?: number; // Flanking-to-direct vibration coupling
  
  // Acoustic properties
  vibrationReductionIndex?: number; // Kij values
}

// Building context - REMOVED: Not used in actual calculations, only for UI display
// export interface BuildingContext {
//   buildingType: 'residential' | 'office' | 'educational' | 'healthcare';
//   usageCategory: string;
//   requiredAirborneInsulation?: number; // dB
//   requiredImpactInsulation?: number;   // dB
// }

export interface CalculationParameters {
  // Essential calculation parameters - only what VBA actually uses
  includeFlankingTransmission: boolean;  // Controls DIN 4109 vs ISO 12354 mode
  
  // Optional parameters
  safetyMargin?: number; // dB - applied to final results only
  
  // Removed parameters not used in VBA calculations:
  // - frequencyRange: VBA only has single-value calculations
  // - includeStructuralResonances: Not clearly used in VBA
  // - measurementData: Only for validation comparison
}

export interface CalculationInput {
  project: ProjectConfiguration;
  element: WallConfiguration | CeilingConfiguration;
  parameters: CalculationParameters;
  // Removed: building context not needed for calculations
}

// Re-export acoustic calculation result types for consistency
export interface AcousticParameters {
  Rw?: number;          // Sound reduction index [dB]
  C?: number;           // Spectrum adaptation term C [dB]
  Ctr?: number;         // Spectrum adaptation term Ctr [dB]
  Lnw?: number;         // Impact sound level [dB]
  CI?: number;          // Impact sound spectrum adaptation term [dB]
}

export interface FlankingPath {
  id: string;
  pathType: FlankingPathType;  // Use library enum directly
  transmissionValue: number;              // R'w or L'n,w value [dB]
  isActive: boolean;                      // Whether path contributes to result
  description: string;                    // Human readable description
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface CalculationResults {
  separating: AcousticParameters;     // Direct transmission
  flanking: FlankingPath[];           // Flanking transmission paths  
  combined: AcousticParameters;       // R'w combined results
  timestamp: Date;
  validationErrors?: ValidationError[];
}
