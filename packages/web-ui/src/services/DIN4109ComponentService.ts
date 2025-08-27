import { DIN4109CeilingComponent, DIN4109FlankingComponent, DIN4109ComponentFilter } from '../types/DIN4109Types';
import { DIN4109_CEILING_COMPONENTS, DIN4109_FLANKING_COMPONENTS } from '../data/DIN4109Database';
import { FloorConstructionType, ScreedType } from '@vbacoustic/lib/src/models/AcousticTypes';

export class DIN4109ComponentService {
  
  /**
   * Get filtered ceiling components based on current ceiling and screed configuration
   * Mirrors the VBA logic from decken.vba UserForm_Initialize()
   */
  static getApplicableCeilingComponents(filter: DIN4109ComponentFilter): DIN4109CeilingComponent[] {
    return DIN4109_CEILING_COMPONENTS.filter(component => {
      // Check if component is applicable for the current ceiling type
      if (filter.ceilingType && !component.applicableFor.ceilingTypes.includes(filter.ceilingType)) {
        return false;
      }
      
      // Check if component is applicable for the current screed type
      if (filter.screedType && !component.applicableFor.screedTypes.includes(filter.screedType)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Get filtered flanking components based on flanking type
   * Mirrors the VBA logic from flanken.vba UserForm_Initialize()
   */
  static getApplicableFlankingComponents(flankingType?: string): DIN4109FlankingComponent[] {
    if (!flankingType) {
      return DIN4109_FLANKING_COMPONENTS;
    }
    
    return DIN4109_FLANKING_COMPONENTS.filter(component => 
      component.flankingType === flankingType
    );
  }

  /**
   * Get component by ID for both ceiling and flanking components
   */
  static getComponentById(id: string): DIN4109CeilingComponent | DIN4109FlankingComponent | null {
    const ceilingComponent = DIN4109_CEILING_COMPONENTS.find(c => c.id === id);
    if (ceilingComponent) return ceilingComponent;
    
    const flankingComponent = DIN4109_FLANKING_COMPONENTS.find(c => c.id === id);
    if (flankingComponent) return flankingComponent;
    
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
    const tableMap: Record<string, number[]> = {
      // Open timber beam ceiling
      [`${FloorConstructionType.TimberBeamOpen}_${ScreedType.CementOnMineralFiber}`]: [15],
      [`${FloorConstructionType.TimberBeamOpen}_${ScreedType.CementOnWoodFiber}`]: [15],
      [`${FloorConstructionType.TimberBeamOpen}_${ScreedType.DryScreed}`]: [16],
      
      // Timber beam with battens
      [`${FloorConstructionType.TimberBeamWithBattensGK}_${ScreedType.CementOnMineralFiber}`]: [17, 18],
      [`${FloorConstructionType.TimberBeamWithBattensGK}_${ScreedType.CementOnWoodFiber}`]: [17, 18],
      [`${FloorConstructionType.TimberBeamWithBattensGK}_${ScreedType.DryScreed}`]: [19],
      
      // Timber beam with suspended ceiling
      [`${FloorConstructionType.TimberBeamWithCeilingGK}_${ScreedType.CementOnMineralFiber}`]: [20, 21],
      [`${FloorConstructionType.TimberBeamWithCeilingGK}_${ScreedType.CementOnWoodFiber}`]: [20, 21],
      [`${FloorConstructionType.TimberBeamWithCeilingGK}_${ScreedType.DryScreed}`]: [22, 23],
      
      // Mass timber floor
      [`${FloorConstructionType.MassTimberFloor}_${ScreedType.CementOnMineralFiber}`]: [24, 25],
      [`${FloorConstructionType.MassTimberFloor}_${ScreedType.CementOnWoodFiber}`]: [24, 25],
    };

    const key = `${ceilingType}_${screedType}`;
    return tableMap[key] || [];
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
}
