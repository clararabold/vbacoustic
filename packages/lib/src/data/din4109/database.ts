/**
 * DIN 4109-33 Component Database
 * Comprehensive database implementation for DIN 4109-33:2016-07 component catalog
 * 
 * This database provides access to all standardized construction components
 * for acoustic calculations according to DIN 4109-33 standard.
 */

import { 
  DIN4109Database, 
  DIN4109ComponentFilter, 
  DIN4109WallComponent, 
  DIN4109CeilingComponent, 
  DIN4109FlankingComponent 
} from './types';

import { 
  DIN4109_WALL_COMPONENTS, 
  getWallTableDescription 
} from './walls';

import { 
  DIN4109_CEILING_COMPONENTS, 
  getCeilingTableDescription 
} from './ceilings';

import { 
  DIN4109_FLANKING_COMPONENTS, 
  getFlankingTableDescription 
} from './flanking';

/**
 * Main database class providing access to all DIN 4109-33 components
 */
export class DIN4109ComponentDatabase implements DIN4109Database {

  /**
   * Find wall components matching the given filter criteria
   */
  findWallComponents(filter?: DIN4109ComponentFilter): DIN4109WallComponent[] {
    let components = [...DIN4109_WALL_COMPONENTS];

    if (!filter) {
      return components;
    }

    // Filter by wall type
    if (filter.wallType) {
      components = components.filter(c => 
        c.applicableFor.wallTypes.includes(filter.wallType!)
      );
    }

    // Filter by cladding type
    if (filter.claddingType) {
      components = components.filter(c => 
        c.applicableFor.claddingTypes?.includes(filter.claddingType!)
      );
    }

    // Filter by Rw range
    if (filter.minRw !== undefined) {
      components = components.filter(c => c.rw >= filter.minRw!);
    }
    if (filter.maxRw !== undefined) {
      components = components.filter(c => c.rw <= filter.maxRw!);
    }

    // Filter by mass range
    if (filter.minMass !== undefined) {
      components = components.filter(c => c.mass !== undefined && c.mass >= filter.minMass!);
    }
    if (filter.maxMass !== undefined) {
      components = components.filter(c => c.mass !== undefined && c.mass <= filter.maxMass!);
    }

    // Filter by thickness range
    if (filter.minThickness !== undefined) {
      components = components.filter(c => c.thickness !== undefined && c.thickness >= filter.minThickness!);
    }
    if (filter.maxThickness !== undefined) {
      components = components.filter(c => c.thickness !== undefined && c.thickness <= filter.maxThickness!);
    }

    // Filter by table numbers
    if (filter.tableNumbers && filter.tableNumbers.length > 0) {
      components = components.filter(c => filter.tableNumbers!.includes(c.tableNumber));
    }

    return components;
  }

  /**
   * Find ceiling components matching the given filter criteria
   */
  findCeilingComponents(filter?: DIN4109ComponentFilter): DIN4109CeilingComponent[] {
    let components = [...DIN4109_CEILING_COMPONENTS];

    if (!filter) {
      return components;
    }

    // Filter by ceiling type
    if (filter.ceilingType) {
      components = components.filter(c => 
        c.applicableFor.ceilingTypes.includes(filter.ceilingType!)
      );
    }

    // Filter by screed type
    if (filter.screedType) {
      components = components.filter(c => 
        c.applicableFor.screedTypes.includes(filter.screedType!)
      );
    }

    // Filter by Rw range
    if (filter.minRw !== undefined) {
      components = components.filter(c => c.rw >= filter.minRw!);
    }
    if (filter.maxRw !== undefined) {
      components = components.filter(c => c.rw <= filter.maxRw!);
    }

    // Filter by Lnw range
    if (filter.minLnw !== undefined) {
      components = components.filter(c => c.lnw >= filter.minLnw!);
    }
    if (filter.maxLnw !== undefined) {
      components = components.filter(c => c.lnw <= filter.maxLnw!);
    }

    // Filter by mass range
    if (filter.minMass !== undefined) {
      components = components.filter(c => c.mass !== undefined && c.mass >= filter.minMass!);
    }
    if (filter.maxMass !== undefined) {
      components = components.filter(c => c.mass !== undefined && c.mass <= filter.maxMass!);
    }

    // Filter by thickness range
    if (filter.minThickness !== undefined) {
      components = components.filter(c => c.thickness !== undefined && c.thickness >= filter.minThickness!);
    }
    if (filter.maxThickness !== undefined) {
      components = components.filter(c => c.thickness !== undefined && c.thickness <= filter.maxThickness!);
    }

    // Filter by table numbers
    if (filter.tableNumbers && filter.tableNumbers.length > 0) {
      components = components.filter(c => filter.tableNumbers!.includes(c.tableNumber));
    }

    return components;
  }

  /**
   * Find flanking components matching the given filter criteria
   */
  findFlankingComponents(filter?: DIN4109ComponentFilter): DIN4109FlankingComponent[] {
    let components = [...DIN4109_FLANKING_COMPONENTS];

    if (!filter) {
      return components;
    }

    // Filter by Dnfw range
    if (filter.minDnfw !== undefined) {
      components = components.filter(c => c.dnfw >= filter.minDnfw!);
    }
    if (filter.maxDnfw !== undefined) {
      components = components.filter(c => c.dnfw <= filter.maxDnfw!);
    }

    // Filter by mass range
    if (filter.minMass !== undefined) {
      components = components.filter(c => c.mass !== undefined && c.mass >= filter.minMass!);
    }
    if (filter.maxMass !== undefined) {
      components = components.filter(c => c.mass !== undefined && c.mass <= filter.maxMass!);
    }

    // Filter by thickness range
    if (filter.minThickness !== undefined) {
      components = components.filter(c => c.thickness !== undefined && c.thickness >= filter.minThickness!);
    }
    if (filter.maxThickness !== undefined) {
      components = components.filter(c => c.thickness !== undefined && c.thickness <= filter.maxThickness!);
    }

    // Filter by table numbers
    if (filter.tableNumbers && filter.tableNumbers.length > 0) {
      components = components.filter(c => filter.tableNumbers!.includes(c.tableNumber));
    }

    return components;
  }

  /**
   * Get a specific component by its ID
   */
  getComponentById(id: string): DIN4109WallComponent | DIN4109CeilingComponent | DIN4109FlankingComponent | null {
    // Search in walls
    const wallComponent = DIN4109_WALL_COMPONENTS.find(c => c.id === id);
    if (wallComponent) return wallComponent;

    // Search in ceilings
    const ceilingComponent = DIN4109_CEILING_COMPONENTS.find(c => c.id === id);
    if (ceilingComponent) return ceilingComponent;

    // Search in flanking
    const flankingComponent = DIN4109_FLANKING_COMPONENTS.find(c => c.id === id);
    if (flankingComponent) return flankingComponent;

    return null;
  }

  /**
   * Get all available table numbers in the database
   */
  getAllTables(): number[] {
    const tableNumbers = new Set<number>();

    // Add wall table numbers
    DIN4109_WALL_COMPONENTS.forEach(c => tableNumbers.add(c.tableNumber));
    
    // Add ceiling table numbers
    DIN4109_CEILING_COMPONENTS.forEach(c => tableNumbers.add(c.tableNumber));
    
    // Add flanking table numbers
    DIN4109_FLANKING_COMPONENTS.forEach(c => tableNumbers.add(c.tableNumber));

    return Array.from(tableNumbers).sort((a, b) => a - b);
  }

  /**
   * Get description for a specific table number in a specific language
   */
  getTableDescription(tableNumber: number, language: 'de' | 'en' = 'en'): string | null {
    // Try wall tables first
    let description = getWallTableDescription(tableNumber);
    if (description) return language === 'de' ? description.de : description.en;

    // Try ceiling tables
    description = getCeilingTableDescription(tableNumber);
    if (description) return language === 'de' ? description.de : description.en;

    // Try flanking tables
    description = getFlankingTableDescription(tableNumber);
    if (description) return language === 'de' ? description.de : description.en;

    return null;
  }

  /**
   * Get all components of a specific table
   */
  getComponentsByTable(tableNumber: number): (DIN4109WallComponent | DIN4109CeilingComponent | DIN4109FlankingComponent)[] {
    const components: (DIN4109WallComponent | DIN4109CeilingComponent | DIN4109FlankingComponent)[] = [];

    // Add matching walls
    components.push(...DIN4109_WALL_COMPONENTS.filter(c => c.tableNumber === tableNumber));
    
    // Add matching ceilings
    components.push(...DIN4109_CEILING_COMPONENTS.filter(c => c.tableNumber === tableNumber));
    
    // Add matching flanking
    components.push(...DIN4109_FLANKING_COMPONENTS.filter(c => c.tableNumber === tableNumber));

    return components.sort((a, b) => a.rowNumber - b.rowNumber);
  }

  /**
   * Get statistics about the database
   */
  getDatabaseStats(): {
    totalComponents: number;
    wallComponents: number;
    ceilingComponents: number;
    flankingComponents: number;
    tables: number;
    tableRange: { min: number; max: number };
  } {
    const tables = this.getAllTables();
    
    return {
      totalComponents: DIN4109_WALL_COMPONENTS.length + DIN4109_CEILING_COMPONENTS.length + DIN4109_FLANKING_COMPONENTS.length,
      wallComponents: DIN4109_WALL_COMPONENTS.length,
      ceilingComponents: DIN4109_CEILING_COMPONENTS.length,
      flankingComponents: DIN4109_FLANKING_COMPONENTS.length,
      tables: tables.length,
      tableRange: {
        min: Math.min(...tables),
        max: Math.max(...tables)
      }
    };
  }

  /**
   * Validate component ID format
   */
  static isValidComponentId(id: string): boolean {
    // Component IDs follow pattern: T{tableNumber}.{rowNumber}
    return /^T\d+\.\d+$/.test(id);
  }

  /**
   * Parse component ID to extract table and row numbers
   */
  static parseComponentId(id: string): { tableNumber: number; rowNumber: number } | null {
    const match = id.match(/^T(\d+)\.(\d+)$/);
    if (!match || !match[1] || !match[2]) return null;

    return {
      tableNumber: parseInt(match[1], 10),
      rowNumber: parseInt(match[2], 10)
    };
  }
}

/**
 * Default instance of the database for easy access
 */
export const din4109Database = new DIN4109ComponentDatabase();

/**
 * Export all component arrays for direct access if needed
 */
export {
  DIN4109_WALL_COMPONENTS,
  DIN4109_CEILING_COMPONENTS,
  DIN4109_FLANKING_COMPONENTS
};

/**
 * Export table description functions
 */
export {
  getWallTableDescription,
  getCeilingTableDescription,
  getFlankingTableDescription
};
