import { 
  ProjectConfiguration, 
  WallConfiguration, 
  CeilingConfiguration, 
  CalculationParameters,
  BuildingContext
} from '../types/CalculationTypes';
import { 
  WallConstructionType, 
  FloorConstructionType,
  ScreedType,
  CladdingType,
  ElementType,
  MaterialType
} from '@vbacoustic/lib/src/models/AcousticTypes';
import { StandardType, JunctionStiffness } from '@vbacoustic/lib/src/standards/AcousticStandard';

/**
 * Sample configurations for testing and demonstration
 */

export const sampleProjectConfigurations: ProjectConfiguration[] = [
  {
    inputMode: 'manual',
    constructionMethod: 'holzbau',
    elementType: ElementType.Wall,
    calculationStandard: StandardType.DIN4109
  },
  {
    inputMode: 'manual',
    constructionMethod: 'holzbau',
    elementType: ElementType.Ceiling,
    calculationStandard: StandardType.DIN4109
  },
  {
    inputMode: 'manual',
    constructionMethod: 'massivbau',
    elementType: ElementType.Wall,
    calculationStandard: StandardType.ISO12354
  }
];

export const sampleWallConfigurations: WallConfiguration[] = [
  {
    wallType: WallConstructionType.MassTimberWall,
    applicationContext: 'interior',
    connectionType: 'surface',
    thickness: 160,
    height: 2.8,
    length: 4.0,
    dimensions: {
      thickness: 160,
      height: 2.8,
      width: 4.0,
      area: 11.2
    },
    layers: [
      { 
        id: 'layer-1',
        name: 'Gipskartonplatte', 
        thickness: 12.5, 
        material: 'Gipskarton GKB', 
        density: 800 
      },
      { 
        id: 'layer-2',
        name: 'Mineralwolle', 
        thickness: 140, 
        material: 'Steinwolle WLG 035', 
        density: 35 
      },
      { 
        id: 'layer-3',
        name: 'Massivholz', 
        thickness: 160, 
        material: MaterialType.MassTimber, 
        density: 470 
      },
      { 
        id: 'layer-4',
        name: 'Gipskartonplatte', 
        thickness: 12.5, 
        material: 'Gipskarton GKB', 
        density: 800 
      }
    ],
    flankingElements: [
      {
        id: 'flanking-1',
        elementType: ElementType.Ceiling,
        thickness: 200,
        length: 4.0,
        material: 'Stahlbetondecke',
        position: 'top',
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      },
      {
        id: 'flanking-2',
        elementType: ElementType.Wall,
        thickness: 240,
        length: 4.0,
        material: 'Außenwand gedämmt',
        position: 'left',
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      },
      {
        id: 'flanking-3',
        elementType: ElementType.Wall,
        thickness: 240,
        length: 4.0,
        material: 'Außenwand gedämmt',
        position: 'right',
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      }
    ]
  },
  {
    wallType: WallConstructionType.TimberFrame,
    applicationContext: 'interior',
    connectionType: 'surface',
    thickness: 180,
    height: 2.8,
    length: 3.5,
    dimensions: {
      thickness: 180,
      height: 2.8,
      width: 3.5,
      area: 9.8
    },
    layers: [
      {
        id: 'layer-gipskartonplatte',
        name: 'Gipskartonplatte', 
        thickness: 15, 
        material: 'Gipskarton GKF', 
        density: 900 
      },
      {
        id: 'layer-holzst-nder-d-mmung',
        name: 'Holzständer + Dämmung', 
        thickness: 140, 
        material: 'Holzständer 60/140 + Zellulose', 
        density: 120 
      },
      {
        id: 'layer-osb-platte',
        name: 'OSB-Platte', 
        thickness: 18, 
        material: 'OSB/3', 
        density: 650 
      },
      {
        id: 'layer-gipskartonplatte',
        name: 'Gipskartonplatte', 
        thickness: 15, 
        material: 'Gipskarton GKF', 
        density: 900 
      }
    ],
    flankingElements: [
      {
        id: 'flanking-zje3nwbds',
        elementType: ElementType.Ceiling,
        thickness: 180,
        material: 'Massivholzdecke',
        position: 'top',
        length: 4.0,
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      },
      {
        id: 'flanking-dhge57rrb',
        elementType: ElementType.Wall,
        thickness: 180,
        material: 'Holzständerwand',
        position: 'left',
        length: 4.0,
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      }
    ]
  }
];

export const sampleCeilingConfigurations: CeilingConfiguration[] = [
  {
    ceilingType: FloorConstructionType.MassTimberFloor,
    thickness: 160,
    spanWidth: 4.5,
    estrichType: ScreedType.CementOnMineralFiber,
    estrichThickness: 60,
    layers: [
      {
        id: 'layer-zementestrich',
        name: 'Zementestrich', 
        thickness: 60, 
        material: 'Zementestrich CT-C25-F4', 
        density: 2000 
      },
      {
        id: 'layer-trittschalld-mmung',
        name: 'Trittschalldämmung', 
        thickness: 30, 
        material: 'Mineralfaser MW-T', 
        density: 150 
      },
      {
        id: 'layer-massivholzdecke',
        name: 'Massivholzdecke', 
        thickness: 160, 
        material: MaterialType.MassTimber, 
        density: 470 
      }
    ],
    flankingElements: [
      {
        id: 'flanking-kkgk6u063',
        elementType: ElementType.Wall,
        thickness: 160,
        material: 'Massivholzwand',
        position: 'left',
        length: 4.0,
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      },
      {
        id: 'flanking-b8nflam9l',
        elementType: ElementType.Wall,
        thickness: 160,
        material: 'Massivholzwand',
        position: 'right',
        length: 4.0,
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      },
      {
        id: 'flanking-hd6w6uwaw',
        elementType: ElementType.Wall,
        thickness: 240,
        material: 'Außenwand gedämmt',
        position: 'left',
        length: 4.0,
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      },
      {
        id: 'flanking-7e4isx6ip',
        elementType: ElementType.Wall,
        thickness: 240,
        material: 'Außenwand gedämmt',
        position: 'right',
        length: 4.0,
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      }
    ]
  },
  {
    ceilingType: FloorConstructionType.MassTimberWithCeiling,
    thickness: 140,
    spanWidth: 3.8,
    cavityHeight: 50,
    underCeilingType: CladdingType.WoodBoardPlusGK,
    layers: [
      {
        id: 'layer-trockenestrich',
        name: 'Trockenestrich', 
        thickness: 40, 
        material: 'Gipsfaser-Trockenestrich', 
        density: 1150 
      },
      {
        id: 'layer-trittschalld-mmung',
        name: 'Trittschalldämmung', 
        thickness: 20, 
        material: 'Holzfaser-Dämmplatte', 
        density: 270 
      },
      {
        id: 'layer-massivholzdecke',
        name: 'Massivholzdecke', 
        thickness: 140, 
        material: 'Brettsperrholz BSP', 
        density: 470 
      },
      {
        id: 'layer-luftschicht',
        name: 'Luftschicht', 
        thickness: 50, 
        material: 'Hohlraum', 
        density: 1 
      },
      {
        id: 'layer-unterdecke',
        name: 'Unterdecke', 
        thickness: 25, 
        material: 'OSB + Gipskarton', 
        density: 720 
      }
    ],
    flankingElements: [
      {
        id: 'flanking-4psw3ai96',
        elementType: ElementType.Wall,
        thickness: 140,
        material: 'Innenwand Massivholz',
        position: 'left',
        length: 4.0,
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      },
      {
        id: 'flanking-rtr9gkmdz',
        elementType: ElementType.Wall,
        thickness: 140,
        material: 'Innenwand Massivholz',
        position: 'right',
        length: 4.0,
        junctionType: JunctionStiffness.RIGID,
        connectionDetails: 'Standard rigid connection'
      }
    ]
  }
];

export const sampleCalculationParameters: (CalculationParameters & BuildingContext)[] = [
  {
    // Calculation Parameters
    frequencyRange: '100-3150',
    includeFlankingTransmission: true,
    includeStructuralResonances: false,
    safetyMargin: 2,
    measurementData: {
      airborneInsulation: 55,
      impactInsulation: 53,
      measurementStandard: 'iso140'
    },
    
    // Building Context
    buildingType: 'residential',
    usageCategory: 'living',
    requiredAirborneInsulation: 53,
    requiredImpactInsulation: 53,
    temperature: 20,
    humidity: 50
  },
  {
    // Calculation Parameters
    frequencyRange: '100-3150',
    includeFlankingTransmission: true,
    includeStructuralResonances: true,
    safetyMargin: 3,
    
    // Building Context
    buildingType: 'office',
    usageCategory: 'open-office',
    requiredAirborneInsulation: 47,
    requiredImpactInsulation: 57,
    temperature: 22,
    humidity: 45
  },
  {
    // Calculation Parameters
    frequencyRange: '50-5000',
    includeFlankingTransmission: true,
    includeStructuralResonances: true,
    safetyMargin: 5,
    
    // Building Context
    buildingType: 'educational',
    usageCategory: 'classroom',
    requiredAirborneInsulation: 50,
    requiredImpactInsulation: 50,
    temperature: 21,
    humidity: 48
  }
];

/**
 * Helper function to get a complete sample configuration
 */
export function getSampleConfiguration(index: number = 0) {
  const projectIndex = Math.min(index, sampleProjectConfigurations.length - 1);
  const project = sampleProjectConfigurations[projectIndex];
  
  if (!project) {
    throw new Error('No sample project configuration available');
  }
  
  const element = project.elementType === ElementType.Wall 
    ? sampleWallConfigurations[Math.min(index, sampleWallConfigurations.length - 1)]
    : sampleCeilingConfigurations[Math.min(index, sampleCeilingConfigurations.length - 1)];
    
  const parameters = sampleCalculationParameters[Math.min(index, sampleCalculationParameters.length - 1)];
  
  return {
    project,
    element,
    parameters
  };
}

/**
 * Get sample configuration for a specific building type
 */
export function getSampleByBuildingType(buildingType: 'residential' | 'office' | 'educational') {
  const paramIndex = sampleCalculationParameters.findIndex(p => p.buildingType === buildingType);
  return getSampleConfiguration(paramIndex >= 0 ? paramIndex : 0);
}
