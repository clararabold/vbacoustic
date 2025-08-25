import { describe, it, expect } from 'vitest';
import {
  AdditionalLayer,
  calculateResonanceFrequency,
  calculatePrewallImprovement,
  calculateAdditionalShellImprovement,
  combineLaterImprovements,
  calculateLayerImprovement
} from '../src/calculations/LayerImprovementCalculator';

describe('LayerImprovementCalculator', () => {
  it('calculateResonanceFrequency for solid connection', () => {
    const layer: AdditionalLayer = { mass: 50, isSolidConnection: true };
    const f0 = calculateResonanceFrequency(layer, 200, 0.05);
    expect(f0).toBeGreaterThan(0);
  });

  it('calculateResonanceFrequency for resilient connection', () => {
    const layer: AdditionalLayer = { mass: 50, dynamicStiffness: 100, isSolidConnection: false };
    const f0 = calculateResonanceFrequency(layer, 200);
    expect(f0).toBeGreaterThan(0);
  });

  it('calculatePrewallImprovement returns 0 for invalid input and valid for valid input', () => {
    const invalid = calculatePrewallImprovement({ baseMass: 0, prewallMass: 10, baseRw: 40 });
    expect(invalid).toBe(0);

    const valid = calculatePrewallImprovement({ cavityThickness: 0.05, baseMass: 200, prewallMass: 20, baseRw: 40 });
    expect(typeof valid).toBe('number');
  });

  it('calculateAdditionalShellImprovement works for valid f0', () => {
    const drw = calculateAdditionalShellImprovement(100, 50);
    expect(drw).toBeGreaterThanOrEqual(0);
  });

  it('combineLaterImprovements combines correctly', () => {
    const combined = combineLaterImprovements(4, 6);
    expect(combined).toBeGreaterThanOrEqual(6);
  });

  it('calculateLayerImprovement path', () => {
    const layer: AdditionalLayer = { mass: 40, dynamicStiffness: 4, isSolidConnection: false };
    const drw = calculateLayerImprovement(layer, 200, 45);
    expect(typeof drw).toBe('number');
  });
});
