import { describe, it, expect } from 'vitest';
import { calculateRwSolidConstruction, calculateRwTimberConstruction, calculateRw, TimberConstructionType } from '../src/calculations/SoundReductionCalculator';
import { MaterialType, ConstructionType } from '../src/models/AcousticTypes';

describe('SoundReductionCalculator', () => {
  it('calculates solid construction Rw for concrete and aerated cases', () => {
    const rwConcrete = calculateRwSolidConstruction(300, MaterialType.Concrete);
    expect(rwConcrete).toBeGreaterThan(0);
    const rwAeratedLow = calculateRwSolidConstruction(100, MaterialType.AeratedConcrete);
    expect(rwAeratedLow).toBeGreaterThan(0);
    const rwAeratedHigh = calculateRwSolidConstruction(200, MaterialType.AeratedConcrete);
    expect(rwAeratedHigh).toBeGreaterThan(0);
  });

  it('calculates timber construction Rw based on type', () => {
    expect(calculateRwTimberConstruction(100, TimberConstructionType.Heavy)).toBeGreaterThan(0);
    expect(calculateRwTimberConstruction(50, TimberConstructionType.Flexible)).toBeGreaterThan(0);
    expect(calculateRwTimberConstruction(50, TimberConstructionType.Loaded)).toBeGreaterThan(0);
  });

  it('routes to correct calculateRw based on material construction type', () => {
    const material: any = { constructionType: ConstructionType.Solid, surfaceMass: 300, type: MaterialType.Concrete };
    expect(calculateRw(material)).toBeGreaterThan(0);

    const timber: any = { constructionType: ConstructionType.MassTimber, surfaceMass: 80 };
    expect(calculateRw(timber)).toBeGreaterThan(0);
  });
});
