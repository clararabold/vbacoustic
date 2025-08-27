import { FloorConstructionType, ScreedType } from '@vbacoustic/lib/src/models/AcousticTypes';

export interface LayerDefinition {
  id: string;
  name: string;
  material: string;
  thickness: number;
  density: number;
  description: string;
}

export interface DIN4109CeilingComponent {
  id: string;
  tableNumber: number;
  rowNumber: number;
  rw: number;
  lnw: number;
  mass?: number;
  thickness?: number;
  // Bilingual support
  descriptions: {
    de: {
      short: string;
      description: string;
      constructionDetails: string;
    };
    en: {
      short: string;
      description: string;
      constructionDetails: string;
    };
  };
  // Pre-generated layers to eliminate runtime parsing
  layers: {
    de: LayerDefinition[];
    en: LayerDefinition[];
  };
  applicableFor: {
    ceilingTypes: FloorConstructionType[];
    screedTypes: ScreedType[];
  };
}

export interface DIN4109FlankingComponent {
  id: string;
  tableNumber: number;
  rowNumber: number;
  dnfw: number;
  flankingType: string;
  mass?: number;
  thickness?: number;
  // Bilingual support
  descriptions: {
    de: {
      short: string;
      description: string;
      constructionDetails: string;
    };
    en: {
      short: string;
      description: string;
      constructionDetails: string;
    };
  };
}

export interface DIN4109ComponentFilter {
  ceilingType?: FloorConstructionType;
  screedType?: ScreedType;
  minMass?: number;
  maxMass?: number;
  minThickness?: number;
  maxThickness?: number;
}

/**
 * Component selection result
 */
export interface DIN4109ComponentSelection {
  component: DIN4109CeilingComponent | DIN4109FlankingComponent;
  applicableValues: {
    rw?: number;
    lnw?: number;
    dnfw?: number;
    mass?: number;
  };
}
