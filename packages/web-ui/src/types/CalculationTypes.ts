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
  spanWidth: number;        // m - span width
  
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
  position: 'top' | 'bottom' | 'left' | 'right'; // For walls
  elementType: ElementType; // Use library enum directly
  
  // Dimensions and properties
  thickness: number;
  length: number;
  material: string; // Add material property for UI forms
  
  // Junction details
  junctionType: 'rigid' | 'elastic' | 'isolated';
  connectionDetails: string;
  
  // Acoustic properties
  vibrationReductionIndex?: number; // Kij values
}

export interface BuildingContext {
  // Building type and usage
  buildingType: 'residential' | 'office' | 'educational' | 'healthcare';
  usageCategory: string;
  
  // Requirements
  requiredAirborneInsulation?: number; // dB
  requiredImpactInsulation?: number;   // dB
  
  // Environmental factors
  temperature?: number;     // °C
  humidity?: number;       // %
}

export interface CalculationParameters {
  // Frequency range
  frequencyRange: '100-3150' | '50-5000';
  
  // Calculation options
  includeFlankingTransmission: boolean;
  includeStructuralResonances: boolean;
  
  // Safety factors
  safetyMargin?: number; // dB
  
  // Measurement conditions (from frmBaumessung)
  measurementData?: {
    airborneInsulation?: number;
    impactInsulation?: number;
    measurementStandard: 'iso140' | 'iso16283';
  };
}

export interface CalculationInput {
  project: ProjectConfiguration;
  building: BuildingContext;
  element: WallConfiguration | CeilingConfiguration;
  parameters: CalculationParameters;
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
