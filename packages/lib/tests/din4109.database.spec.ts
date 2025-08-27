/**
 * Test for DIN 4109 database functionality
 */

import { test, expect, describe } from 'vitest';
import { din4109Database } from '../src/data/din4109';
import { FloorConstructionType, ScreedType } from '../src/models/AcousticTypes';

describe('DIN 4109 Database Integration', () => {
  test('should have database with components', () => {
    const stats = din4109Database.getDatabaseStats();
    
    expect(stats.totalComponents).toBeGreaterThan(0);
    expect(stats.ceilingComponents).toBeGreaterThan(0);
    expect(stats.wallComponents).toBeGreaterThan(0);
    expect(stats.flankingComponents).toBeGreaterThan(0);
    expect(stats.tables).toBeGreaterThan(0);
    
    console.log('Database stats:', stats);
  });

  test('should filter ceiling components correctly', () => {
    const filter = {
      ceilingType: FloorConstructionType.TimberBeamOpen,
      screedType: ScreedType.CementOnMineralFiber
    };

    const components = din4109Database.findCeilingComponents(filter);
    
    expect(Array.isArray(components)).toBe(true);
    console.log(`Found ${components.length} ceiling components with filter:`, filter);
    
    // Each component should match the filter
    components.forEach(component => {
      expect(component.applicableFor.ceilingTypes).toContain(filter.ceilingType);
      expect(component.applicableFor.screedTypes).toContain(filter.screedType);
      expect(component.rw).toBeGreaterThan(0);
      expect(component.lnw).toBeGreaterThan(0);
      expect(component.descriptions.en.short).toBeTruthy();
      expect(component.descriptions.de.short).toBeTruthy();
    });
  });

  test('should get all tables and descriptions', () => {
    const tables = din4109Database.getAllTables();
    
    expect(Array.isArray(tables)).toBe(true);
    expect(tables.length).toBeGreaterThan(0);
    
    console.log('Available tables:', tables);
    
    // Test table descriptions
    tables.slice(0, 3).forEach(tableNum => {
      const description = din4109Database.getTableDescription(tableNum);
      expect(description).toBeTruthy();
      console.log(`Table ${tableNum}: ${description}`);
    });
  });

  test('should find components by ID', () => {
    // Get first ceiling component
    const allCeilings = din4109Database.findCeilingComponents();
    expect(allCeilings.length).toBeGreaterThan(0);
    
    const firstCeiling = allCeilings[0];
    const foundComponent = din4109Database.getComponentById(firstCeiling.id);
    
    expect(foundComponent).toBeTruthy();
    expect(foundComponent?.id).toBe(firstCeiling.id);
    
    console.log(`Found component by ID ${firstCeiling.id}:`, foundComponent?.descriptions.en.short);
  });

  test('should have valid component structure', () => {
    const allCeilings = din4109Database.findCeilingComponents();
    const ceiling = allCeilings[0];
    
    expect(ceiling).toBeTruthy();
    expect(ceiling.id).toBeTruthy();
    expect(ceiling.tableNumber).toBeGreaterThan(0);
    expect(ceiling.rowNumber).toBeGreaterThan(0);
    expect(ceiling.rw).toBeGreaterThan(0);
    expect(ceiling.lnw).toBeGreaterThan(0);
    
    // Check descriptions
    expect(ceiling.descriptions.en.short).toBeTruthy();
    expect(ceiling.descriptions.de.short).toBeTruthy();
    expect(ceiling.descriptions.en.description).toBeTruthy();
    expect(ceiling.descriptions.de.description).toBeTruthy();
    
    // Check layers
    expect(Array.isArray(ceiling.layers.en)).toBe(true);
    expect(Array.isArray(ceiling.layers.de)).toBe(true);
    expect(ceiling.layers.en.length).toBeGreaterThan(0);
    expect(ceiling.layers.de.length).toBeGreaterThan(0);
    
    // Check applicability
    expect(Array.isArray(ceiling.applicableFor.ceilingTypes)).toBe(true);
    expect(Array.isArray(ceiling.applicableFor.screedTypes)).toBe(true);
    
    console.log('Sample ceiling component:', {
      id: ceiling.id,
      short: ceiling.descriptions.en.short,
      rw: ceiling.rw,
      lnw: ceiling.lnw,
      layerCount: ceiling.layers.en.length
    });
  });
});
