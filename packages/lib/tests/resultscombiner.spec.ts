import { describe, it, expect } from 'vitest';
import { combineSoundReductionResults, combineImpactSoundResults, combineAcousticResults, createFlankingPath } from '../src/calculations/ResultsCombiner';
import { AcousticParameters, FlankingPath } from '../src/models/AcousticTypes';

describe('ResultsCombiner', () => {
  it('combines sound reduction with no flanking paths', () => {
    const result = combineSoundReductionResults(50, []);
    expect(result).toBeCloseTo(50, 1);
  });

  it('combines sound reduction with flanking paths', () => {
    const paths: FlankingPath[] = [
      createFlankingPath('Ff', 40, true),
      createFlankingPath('Ff', 45, true)
    ];
    const result = combineSoundReductionResults(50, paths);
    expect(result).toBeLessThan(50);
  });

  it('combines impact sound results with and without flanking', () => {
    const lnNoFlanking = combineImpactSoundResults(70, []);
    expect(lnNoFlanking).toBeCloseTo(70, 1);

    const paths: FlankingPath[] = [createFlankingPath('DFf', 65, true)];
    const lnWith = combineImpactSoundResults(70, paths);
    expect(lnWith).toBeGreaterThan(70);
  });

  it('combineAcousticResults preserves c50 and ctr50 and handles impact sound arrays', () => {
    const separating: AcousticParameters = { rw: 55, lnw: 72, c50: 3, ctr50: -2 };
    const flankingSound: FlankingPath[] = [createFlankingPath('Ff', 45, true)];
    const flankingImpact: FlankingPath[] = [createFlankingPath('DFf', 60, true)];

    const combined = combineAcousticResults(separating, flankingSound, flankingImpact);
    expect(combined.rw).toBeDefined();
    expect(combined.lnw).toBeDefined();
    expect(combined.c50).toBe(3);
    expect(combined.ctr50).toBe(-2);
  });
});
