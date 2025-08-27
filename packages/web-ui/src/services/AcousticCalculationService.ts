import { AcousticCalculator } from '@vbacoustic/lib/src/calculations/AcousticCalculator';
import { 
  BuildingElement, 
  FlankingElement, 
  ElementType,
  ConstructionType,
  MaterialType,
  WallConstructionType,
  FloorConstructionType,
  FlankingPathType
} from '@vbacoustic/lib/src/models/AcousticTypes';

import { 
  ProjectConfiguration, 
  WallConfiguration, 
  CeilingConfiguration,
  CalculationResults 
} from '../types/CalculationTypes';

/**
 * Service layer that converts web-ui form data to library calculation input
 * and executes acoustic calculations using the real calculation engine
 */
export class AcousticCalculationService {
  private calculator: AcousticCalculator;

  constructor() {
    this.calculator = new AcousticCalculator();
  }

  /**
   * Convert web form configuration to library BuildingElement
   */
  private convertToBuildingElement(
    projectConfig: ProjectConfiguration,
    elementConfig: WallConfiguration | CeilingConfiguration
  ): BuildingElement {
    const isWall = projectConfig.elementType === ElementType.Wall;
    
    if (isWall && 'wallType' in elementConfig) {
      // Convert wall configuration
      return {
        id: 'separating-wall',
        type: ElementType.Wall,
        material: {
          type: MaterialType.MassTimber, // Default, could be enhanced
          surfaceMass: this.calculateMass(elementConfig.layers),
          thickness: elementConfig.thickness,
          constructionType: this.mapWallTypeToConstructionType(elementConfig.wallType)
        },
        area: elementConfig.length * elementConfig.height,
        length: elementConfig.length,
        Rw: this.estimateRw(elementConfig),
        massPerArea: this.calculateMass(elementConfig.layers),
        constructionType: this.mapWallTypeToConstructionType(elementConfig.wallType),
        acousticParams: {
          rw: this.estimateRw(elementConfig)
        }
      };
    } else if (!isWall && 'ceilingType' in elementConfig) {
      // Convert ceiling configuration
      // Calculate area based on VBA logic (txtL1 * txtL2 for rectangular, or custom area)
      const calculatedArea = elementConfig.isRectangularRoom 
        ? elementConfig.roomLength * elementConfig.roomWidth
        : (elementConfig.customArea || 16.0); // Default to 16m² if no custom area

      return {
        id: 'separating-ceiling',
        type: ElementType.Ceiling,
        material: {
          type: MaterialType.MassTimber, // Default, could be enhanced
          surfaceMass: this.calculateMass(elementConfig.layers),
          thickness: elementConfig.thickness,
          constructionType: this.mapCeilingTypeToConstructionType(elementConfig.ceilingType)
        },
        area: calculatedArea,
        length: elementConfig.roomLength, // Use room length instead of spanWidth
        Rw: this.estimateRw(elementConfig),
        massPerArea: this.calculateMass(elementConfig.layers),
        constructionType: this.mapCeilingTypeToConstructionType(elementConfig.ceilingType),
        acousticParams: {
          rw: this.estimateRw(elementConfig),
          lnw: this.estimateLnw(elementConfig)
        }
      };
    }
    
    throw new Error('Invalid element configuration');
  }

  /**
   * Convert flanking elements from form data
   */
  private convertFlankingElements(
    elementConfig: WallConfiguration | CeilingConfiguration
  ): FlankingElement[] {
    return elementConfig.flankingElements.map((flanking, index) => ({
      id: `flanking-${index}`,
      type: flanking.elementType === ElementType.Wall ? ElementType.Wall : ElementType.Ceiling,
      material: {
        type: MaterialType.MassTimber,
        surfaceMass: flanking.thickness * 500 / 1000,
        thickness: flanking.thickness,
        constructionType: ConstructionType.MassTimber
      },
      area: 3.0 * 2.5,
      length: 3.0,
      Rw: this.estimateFlankingRw(flanking.thickness, flanking.material),
      massPerArea: flanking.thickness * 500 / 1000,
      constructionType: ConstructionType.MassTimber,
      
      // FlankingElement specific properties
      commonLength: 3.0,
      senderSideRw: this.estimateFlankingRw(flanking.thickness, flanking.material),
      receiverSideRw: this.estimateFlankingRw(flanking.thickness, flanking.material)
    }));
  }

  /**
   * Map wall types to library construction types
   */
  private mapWallTypeToConstructionType(wallType: WallConstructionType): ConstructionType {
    switch (wallType) {
      case WallConstructionType.MassTimberWall:
      case WallConstructionType.MassTimberElement:
        return ConstructionType.MassTimber;
      case WallConstructionType.TimberFrame:
      case WallConstructionType.MetalStud:
        return ConstructionType.Lightweight;
      default: 
        return ConstructionType.MassTimber;
    }
  }

  /**
   * Map ceiling types to library construction types
   */
  private mapCeilingTypeToConstructionType(ceilingType: FloorConstructionType): ConstructionType {
    switch (ceilingType) {
      case FloorConstructionType.MassTimberFloor:
      case FloorConstructionType.MassTimberWithCeiling:
      case FloorConstructionType.MassTimberRibbed:
      case FloorConstructionType.TimberConcreteComposite:
        return ConstructionType.MassTimber;
      case FloorConstructionType.TimberBeamOpen:
      case FloorConstructionType.TimberBeamWithBattensGK:
      case FloorConstructionType.TimberBeamWithCeilingGK:
      case FloorConstructionType.TimberBeamWithCeiling2GK:
        return ConstructionType.Lightweight;
      default:
        return ConstructionType.MassTimber;
    }
  }

  /**
   * Calculate total mass from layers
   */
  private calculateMass(layers: Array<{ thickness: number; density?: number }>): number {
    return layers.reduce((total, layer) => {
      const density = layer.density || 500; // kg/m³ default
      const thickness = layer.thickness / 1000; // convert mm to m
      return total + (density * thickness);
    }, 0);
  }

  /**
   * Estimate sound reduction index from configuration
   */
  private estimateRw(elementConfig: WallConfiguration | CeilingConfiguration): number {
    const mass = this.calculateMass(elementConfig.layers);
    const thickness = elementConfig.thickness;
    
    // Basic mass law estimation: Rw ≈ 20*log10(mass) + 20*log10(frequency) - 48
    // Using 500 Hz as reference frequency
    const baseRw = 20 * Math.log10(Math.max(mass, 10)) + 20 * Math.log10(500) - 48;
    
    // Add thickness bonus
    const thicknessBonus = Math.max(0, (thickness - 100) / 50);
    
    return Math.max(30, Math.min(70, baseRw + thicknessBonus));
  }

  /**
   * Estimate impact sound level for ceilings
   */
  private estimateLnw(elementConfig: CeilingConfiguration): number {
    const mass = this.calculateMass(elementConfig.layers);
    
    // Basic estimation: heavier = better impact sound insulation
    let baseLnw = 80 - 10 * Math.log10(Math.max(mass, 50));
    
    // Estrich improvement
    if (elementConfig.estrichType && elementConfig.estrichThickness) {
      baseLnw -= Math.min(15, elementConfig.estrichThickness / 5);
    }
    
    return Math.max(45, Math.min(85, baseLnw));
  }

  /**
   * Estimate flanking element Rw
   */
  private estimateFlankingRw(thickness: number, material: string): number {
    // Simple thickness-based estimation
    const baseRw = 35 + thickness / 10;
    
    // Material bonus
    let materialBonus = 0;
    if (material.toLowerCase().includes('massiv')) materialBonus = 5;
    if (material.toLowerCase().includes('beton')) materialBonus = 8;
    
    return Math.max(30, Math.min(65, baseRw + materialBonus));
  }

  /**
   * Main calculation method - converts form data and executes calculation
   */
  async calculateAcoustics(
    projectConfig: ProjectConfiguration,
    elementConfig: WallConfiguration | CeilingConfiguration,
  ): Promise<CalculationResults> {
    try {
      // Convert form data to library input
      const separatingElement = this.convertToBuildingElement(projectConfig, elementConfig);
      const flankingElements = this.convertFlankingElements(elementConfig);
      
      // Prepare calculation input
      const calculationInput = {
        separatingElement,
        flankingElements,
        separatingArea: 10.0 // Standard 10 m² area
      };

      // Execute calculation using the real acoustic library
      const libResults = await this.calculator.calculateSimple(calculationInput);

      // Convert library results to web-ui format
      const webResults: CalculationResults = {
        separating: {
          Rw: libResults.separating.rw,
          C: libResults.separating.c50 || 0,
          Ctr: libResults.separating.ctr50 || 0,
          Lnw: libResults.separating.lnw || 0,
          CI: 0 // Not in library interface
        },
        flanking: libResults.flanking.map(path => ({
          id: `path-${path.path}`,
          pathType: path.path as any, // Direct mapping
          transmissionValue: path.transmissionValue,
          isActive: path.isActive,
          description: this.getFlankingPathDescription(path.path)
        })),
        combined: {
          Rw: libResults.combined.rw,
          C: libResults.combined.c50 || 0,
          Ctr: libResults.combined.ctr50 || 0,
          Lnw: libResults.combined.lnw || 0,
          CI: 0 // Not in library interface
        },
        timestamp: libResults.timestamp,
        validationErrors: libResults.validationErrors?.map(err => ({
          field: err.field,
          message: err.message,
          severity: err.severity
        }))
      };

      return webResults;

    } catch (error) {
      console.error('Calculation failed:', error);
      
      // Return error result
      return {
        separating: {},
        flanking: [],
        combined: {},
        timestamp: new Date(),
        validationErrors: [{
          field: 'calculation',
          message: `Calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        }]
      };
    }
  }

  /**
   * Get human-readable description for flanking path types
   */
  private getFlankingPathDescription(pathType: FlankingPathType): string {
    switch (pathType) {
      case FlankingPathType.Ff: return 'Flanke → Flanke (Wandübertragung)';
      case FlankingPathType.Fd: return 'Flanke → Direkt (Deckenübertragung)';
      case FlankingPathType.Df: return 'Direkt → Flanke (Wandeinleitung)';
      case FlankingPathType.DFf: return 'Direkt → Flanke → Flanke (Doppelübertragung)';
      default: return 'Unbekannter Übertragungsweg';
    }
  }
}

// Export singleton instance
export const acousticCalculationService = new AcousticCalculationService();
