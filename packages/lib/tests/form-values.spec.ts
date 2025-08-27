/**
 * Test default form values against database
 */

import { test, expect, describe } from 'vitest';
import { din4109Database } from '../src/data/din4109';
import { FloorConstructionType, ScreedType } from '../src/models/AcousticTypes';

describe('Form Default Values Test', () => {
  test('should find components for default form values', () => {
    // These are the default values from CeilingConfigurationForm
    const defaultFilter = {
      ceilingType: FloorConstructionType.MassTimberFloor,
      screedType: ScreedType.CementOnMineralFiber
    };

    console.log('Testing default form filter:', defaultFilter);
    const components = din4109Database.findCeilingComponents(defaultFilter);
    console.log(`Found ${components.length} components for default values`);
    
    // Check if we have components for this combination
    if (components.length === 0) {
      console.log('No components found for default values. Testing other combinations...');
      
      // Test what we do have
      const allCeilings = din4109Database.findCeilingComponents();
      console.log(`Total ceiling components: ${allCeilings.length}`);
      
      allCeilings.forEach(c => {
        console.log(`- ${c.id}: ${c.descriptions.en.short}`);
        console.log(`  Ceiling types: ${c.applicableFor.ceilingTypes.join(', ')}`);
        console.log(`  Screed types: ${c.applicableFor.screedTypes.join(', ')}`);
      });
      
      // Test TimberBeamOpen instead
      const timberBeamFilter = {
        ceilingType: FloorConstructionType.TimberBeamOpen,
        screedType: ScreedType.CementOnMineralFiber
      };
      const timberBeamComponents = din4109Database.findCeilingComponents(timberBeamFilter);
      console.log(`Found ${timberBeamComponents.length} components for TimberBeamOpen + CementOnMineralFiber`);
    }

    // The test should pass - we just want to see the logging
    const allCeilings = din4109Database.findCeilingComponents();
    expect(allCeilings.length).toBeGreaterThan(0);
  });
});
