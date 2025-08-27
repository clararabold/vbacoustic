/**
 * Type definitions for DIN 4109-33 construction component database
 * Based on DIN 4109-33:2016-07 - Schallschutz im Hochbau - Daten für die rechnerischen Nachweise des Schallschutzes (Bauteilkatalog)
 */

import { FloorConstructionType, ScreedType, WallConstructionType, CladdingType } from '../../models/AcousticTypes';

/**
 * Material layer definition for construction components
 */
export interface DIN4109Layer {
    id: string;
    name: string;
    material: string;
    thickness: number;  // mm
    density: number;    // kg/m³
    description: string;
}

/**
 * Multilingual descriptions for components
 */
export interface DIN4109Description {
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
}

/**
 * Base interface for all DIN 4109-33 components
 */
export interface DIN4109BaseComponent {
    id: string;
    tableNumber: number;
    rowNumber: number;
    mass?: number;          // kg/m²
    thickness?: number;     // mm
    descriptions: DIN4109Description;
    layers: {
        de: DIN4109Layer[];
        en: DIN4109Layer[];
    };
    source: string;  // Reference to DIN 4109-33:2016-07 table and row
}

/**
 * Wall component from DIN 4109-33 tables
 */
export interface DIN4109WallComponent extends DIN4109BaseComponent {
    rw: number;  // Weighted sound reduction index (dB)
    applicableFor: {
        wallTypes: WallConstructionType[];
        claddingTypes?: CladdingType[];
    };
}

/**
 * Ceiling/floor component from DIN 4109-33 tables
 */
export interface DIN4109CeilingComponent extends DIN4109BaseComponent {
    rw: number;   // Weighted sound reduction index (dB)
    lnw: number;  // Weighted normalized impact sound pressure level (dB)
    applicableFor: {
        ceilingTypes: FloorConstructionType[];
        screedTypes: ScreedType[];
    };
}

/**
 * Flanking component from DIN 4109-33 tables
 */
export interface DIN4109FlankingComponent extends DIN4109BaseComponent {
    dnfw: number;        // Weighted flanking sound reduction index (dB)
    flankingType: string;
}

/**
 * Component filter for database queries
 */
export interface DIN4109ComponentFilter {
    // Construction type filters
    wallType?: WallConstructionType;
    ceilingType?: FloorConstructionType;
    screedType?: ScreedType;
    claddingType?: CladdingType;
    
    // Performance filters
    minRw?: number;
    maxRw?: number;
    minLnw?: number;
    maxLnw?: number;
    minDnfw?: number;
    maxDnfw?: number;
    
    // Physical property filters
    minMass?: number;
    maxMass?: number;
    minThickness?: number;
    maxThickness?: number;
    
    // Table filters
    tableNumbers?: number[];
}

/**
 * Component selection result
 */
export interface DIN4109ComponentSelection {
    component: DIN4109WallComponent | DIN4109CeilingComponent | DIN4109FlankingComponent;
    applicableValues: {
        rw?: number;
        lnw?: number;
        dnfw?: number;
        mass?: number;
    };
}

/**
 * Database query interface
 */
export interface DIN4109Database {
    findWallComponents(filter?: DIN4109ComponentFilter): DIN4109WallComponent[];
    findCeilingComponents(filter?: DIN4109ComponentFilter): DIN4109CeilingComponent[];
    findFlankingComponents(filter?: DIN4109ComponentFilter): DIN4109FlankingComponent[];
    getComponentById(id: string): DIN4109WallComponent | DIN4109CeilingComponent | DIN4109FlankingComponent | null;
    getAllTables(): number[];
    getTableDescription(tableNumber: number): string | null;
}
