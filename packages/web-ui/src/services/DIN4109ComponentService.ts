import { 
  din4109Database,
  DIN4109CeilingComponent, 
  DIN4109FlankingComponent, 
  DIN4109ComponentFilter 
} from '@vbacoustic/lib/src/data/din4109';
import { FloorConstructionType, ScreedType } from '@vbacoustic/lib/src/models/AcousticTypes';

export class DIN4109ComponentService {
  
  /**
   * Get filtered ceiling components based on current ceiling and screed configuration
   * Mirrors the VBA logic from decken.vba UserForm_Initialize()
   */
  static getApplicableCeilingComponents(filter: DIN4109ComponentFilter): DIN4109CeilingComponent[] {
    return din4109Database.findCeilingComponents(filter);
  }

  /**
   * Get filtered flanking components based on flanking type
   * Mirrors the VBA logic from flanken.vba UserForm_Initialize()
   */
  static getApplicableFlankingComponents(flankingType?: string): DIN4109FlankingComponent[] {
    const filter: DIN4109ComponentFilter = {};
    // TODO: Add flanking type filtering when flanking types are properly defined
    return din4109Database.findFlankingComponents(filter);
  }

  /**
   * Get component by ID for both ceiling and flanking components
   */
  static getComponentById(id: string): DIN4109CeilingComponent | DIN4109FlankingComponent | null {
    const component = din4109Database.getComponentById(id);
    // Filter out wall components for the UI service
    if (component && ('lnw' in component || 'dnfw' in component)) {
      return component as DIN4109CeilingComponent | DIN4109FlankingComponent;
    }
    return null;
  }

  /**
   * Check if any components are available for the given configuration
   * Used to determine if the picker should be shown
   */
  static hasApplicableComponents(filter: DIN4109ComponentFilter): boolean {
    const components = this.getApplicableCeilingComponents(filter);
    return components.length > 0;
  }

  /**
   * Get the table mapping based on ceiling type and screed type
   * Mirrors the VBA table selection logic
   */
  static getApplicableTableNumbers(ceilingType: FloorConstructionType, screedType: ScreedType): number[] {
    const filter: DIN4109ComponentFilter = {
      ceilingType,
      screedType
    };
    const components = din4109Database.findCeilingComponents(filter);
    const tableNumbersSet = new Set<number>();
    components.forEach(c => tableNumbersSet.add(c.tableNumber));
    const tableNumbers = Array.from(tableNumbersSet);
    return tableNumbers.sort();
  }

  /**
   * Get flanking wall types available in DIN 4109-33
   */
  static getAvailableFlankingTypes(): Array<{id: string, label: string}> {
    return [
      { id: 'steel-stud', label: 'Steel Stud Walls (Metallständerwände)' },
      { id: 'timber-stud', label: 'Timber Stud Walls (Holzständerwände)' },
      { id: 'timber-beam', label: 'Timber Beam Ceilings (Holzbalkendecken)' }
    ];
  }

  /**
   * Get database statistics for debugging
   */
  static getDatabaseStats() {
    return din4109Database.getDatabaseStats();
  }

  /**
   * Get all available tables in the database
   */
  static getAllTables(): number[] {
    return din4109Database.getAllTables();
  }

  /**
   * Get table description
   */
  static getTableDescription(tableNumber: number): string | null {
    return din4109Database.getTableDescription(tableNumber);
  }
}
