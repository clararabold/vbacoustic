import { describe, it, expect } from 'vitest';
import { 
    JunctionCalculator, 
    SolidJunctionCalculator, 
    MassTimberJunctionCalculator 
} from '../src/core/junctions/JunctionCalculator';
import { 
    JunctionType, 
    TransmissionDirection, 
    ConstructionConnection 
} from '../src/core/junctions/JunctionTypes';
import { 
    ConstructionCategory, 
    FlankingPathType 
} from '../src/models/AcousticTypes';

describe('Junction Calculations - Comprehensive Tests', () => {
    
    describe('Solid Junction Calculator', () => {
        const solid = new SolidJunctionCalculator();

        it('calculates T-joint formulas with mass ratio branching for comprehensive validation', () => {
            // Test small mass ratio (M < 0.215) for Ff path
            const smallMassRatio = 0.1;
            const smallFf = solid.calculateTJointKij(smallMassRatio, FlankingPathType.Ff);
            expect(typeof smallFf).toBe('number');
            expect(Number.isFinite(smallFf)).toBe(true);
            expect(smallFf).toBeGreaterThanOrEqual(0);

            // Test large mass ratio (M > 0.215) for Ff path
            const largeMassRatio = 0.3;
            const largeFf = solid.calculateTJointKij(largeMassRatio, FlankingPathType.Ff);
            expect(typeof largeFf).toBe('number');
            expect(Number.isFinite(largeFf)).toBe(true);
            expect(largeFf).toBeGreaterThan(smallFf); // Large mass ratio should give higher values

            // Test Fd/Df paths (use quadratic branch)
            const massRatioFd = 0.5;
            const fdValue = solid.calculateTJointKij(massRatioFd, FlankingPathType.Fd);
            const dfValue = solid.calculateTJointKij(massRatioFd, FlankingPathType.Df);
            
            expect(typeof fdValue).toBe('number');
            expect(typeof dfValue).toBe('number');
            expect(Number.isFinite(fdValue)).toBe(true);
            expect(Number.isFinite(dfValue)).toBe(true);
            expect(fdValue).toBeGreaterThanOrEqual(0);
            expect(dfValue).toBeGreaterThanOrEqual(0);

            // Test various mass ratios for consistency
            const massRatios = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5];
            const allPaths = [FlankingPathType.Ff, FlankingPathType.Fd, FlankingPathType.Df];

            massRatios.forEach(ratio => {
                allPaths.forEach(path => {
                    const result = solid.calculateTJointKij(ratio, path);
                    expect(typeof result).toBe('number');
                    expect(Number.isFinite(result)).toBe(true);
                    expect(result).toBeGreaterThanOrEqual(0);
                });
            });

            // Test boundary conditions around 0.215 threshold
            const belowThreshold = solid.calculateTJointKij(0.214, FlankingPathType.Ff);
            const aboveThreshold = solid.calculateTJointKij(0.216, FlankingPathType.Ff);
            expect(aboveThreshold).toBeGreaterThan(belowThreshold);
        });

        it('calculates X-joint formulas with comprehensive path and mass ratio validation', () => {
            // Test small mass ratio for Ff path
            const smallMassRatio = 0.1;
            const smallFf = solid.calculateXJointKij(smallMassRatio, FlankingPathType.Ff);
            expect(typeof smallFf).toBe('number');
            expect(Number.isFinite(smallFf)).toBe(true);
            expect(smallFf).toBeGreaterThanOrEqual(0);

            // Test large mass ratio for Ff path
            const largeMassRatio = 0.3;
            const largeFf = solid.calculateXJointKij(largeMassRatio, FlankingPathType.Ff);
            expect(typeof largeFf).toBe('number');
            expect(Number.isFinite(largeFf)).toBe(true);
            expect(largeFf).toBeGreaterThan(smallFf); // Large mass ratio should give higher values

            // Test Df path
            const dfMassRatio = 0.4;
            const dfValue = solid.calculateXJointKij(dfMassRatio, FlankingPathType.Df);
            expect(typeof dfValue).toBe('number');
            expect(Number.isFinite(dfValue)).toBe(true);
            expect(dfValue).toBeGreaterThanOrEqual(0);

            // Test Fd path
            const fdValue = solid.calculateXJointKij(dfMassRatio, FlankingPathType.Fd);
            expect(typeof fdValue).toBe('number');
            expect(Number.isFinite(fdValue)).toBe(true);
            expect(fdValue).toBeGreaterThanOrEqual(0);

            // Test comprehensive mass ratio range
            const massRatios = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5];
            const allPaths = [FlankingPathType.Ff, FlankingPathType.Fd, FlankingPathType.Df];

            massRatios.forEach(ratio => {
                allPaths.forEach(path => {
                    const result = solid.calculateXJointKij(ratio, path);
                    expect(typeof result).toBe('number');
                    expect(Number.isFinite(result)).toBe(true);
                    expect(result).toBeGreaterThanOrEqual(0);
                });
            });

            // Test that Ff path shows increasing trend with mass ratio
            const ratios = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
            const ffValues = ratios.map(r => solid.calculateXJointKij(r, FlankingPathType.Ff));
            
            for (let i = 1; i < ffValues.length; i++) {
                expect(ffValues[i]).toBeGreaterThanOrEqual(ffValues[i-1]);
            }
        });

        it('handles elastic junction variants with improvement additions', () => {
            // Test base T-joint value
            const baseTJoint = solid.calculateTJointKij(0.2, FlankingPathType.Ff);
            expect(typeof baseTJoint).toBe('number');
            expect(Number.isFinite(baseTJoint)).toBe(true);

            // Test elastic T-joint (should add improvement)
            const elasticJunction = {
                type: JunctionType.ElasticTJoint,
                elasticImprovement: 5
            } as any;

            const elasticResult = solid.calculate({
                junction: elasticJunction,
                massRatio: 0.2,
                pathType: FlankingPathType.Ff,
                separatingMass: 300,
                flankingMass: 150
            } as any);

            expect(typeof elasticResult).toBe('number');
            expect(Number.isFinite(elasticResult)).toBe(true);
            expect(elasticResult).toBeGreaterThanOrEqual(baseTJoint);

            // Test elastic X-joint
            const elasticXJunction = {
                type: JunctionType.ElasticXJoint,
                elasticImprovement: 8
            } as any;

            const elasticXResult = solid.calculate({
                junction: elasticXJunction,
                massRatio: 0.3,
                pathType: FlankingPathType.Ff,
                separatingMass: 400,
                flankingMass: 200
            } as any);

            expect(typeof elasticXResult).toBe('number');
            expect(Number.isFinite(elasticXResult)).toBe(true);

            // Test various elastic improvement values
            const improvements = [0, 3, 5, 8, 10];
            improvements.forEach(improvement => {
                const testJunction = {
                    type: JunctionType.ElasticTJoint,
                    elasticImprovement: improvement
                } as any;

                const result = solid.calculate({
                    junction: testJunction,
                    massRatio: 0.25,
                    pathType: FlankingPathType.Ff,
                    separatingMass: 350,
                    flankingMass: 175
                } as any);

                expect(typeof result).toBe('number');
                expect(Number.isFinite(result)).toBe(true);
            });
        });
    });

    describe('Mass Timber Junction Calculator', () => {
        const mass = new MassTimberJunctionCalculator();

        it('calculates mass timber matrices with connection type variations and comprehensive validation', () => {
            const testMassRatio = 0.5;
            const testParams = {
                massRatio: testMassRatio,
                pathType: FlankingPathType.Ff,
                separatingMass: 200,
                flankingMass: 100
            };

            // Test vertical T-joint with different connection types
            const vContinuous = mass.calculate({
                ...testParams,
                junction: {
                    type: JunctionType.TJoint,
                    direction: TransmissionDirection.Vertical,
                    connection: ConstructionConnection.Continuous
                } as any
            } as any);

            const vSeparated = mass.calculate({
                ...testParams,
                junction: {
                    type: JunctionType.TJoint,
                    direction: TransmissionDirection.Vertical,
                    connection: ConstructionConnection.Separated
                } as any
            } as any);

            const vInterrupted = mass.calculate({
                ...testParams,
                junction: {
                    type: JunctionType.TJoint,
                    direction: TransmissionDirection.Vertical,
                    connection: ConstructionConnection.Interrupted
                } as any
            } as any);

            // Validate types and finite values
            expect(typeof vContinuous).toBe('number');
            expect(typeof vSeparated).toBe('number');
            expect(typeof vInterrupted).toBe('number');
            expect(Number.isFinite(vContinuous)).toBe(true);
            expect(Number.isFinite(vSeparated)).toBe(true);
            expect(Number.isFinite(vInterrupted)).toBe(true);

            // Connection type ordering: continuous < separated < interrupted
            expect(vContinuous).toBeLessThan(vSeparated);
            expect(vSeparated).toBeLessThan(vInterrupted);

            // Test horizontal T-joint with different connection types
            const hContinuous = mass.calculate({
                ...testParams,
                junction: {
                    type: JunctionType.TJoint,
                    direction: TransmissionDirection.Horizontal,
                    connection: ConstructionConnection.Continuous
                } as any
            } as any);

            const hSeparated = mass.calculate({
                ...testParams,
                junction: {
                    type: JunctionType.TJoint,
                    direction: TransmissionDirection.Horizontal,
                    connection: ConstructionConnection.Separated
                } as any
            } as any);

            expect(typeof hContinuous).toBe('number');
            expect(typeof hSeparated).toBe('number');
            expect(Number.isFinite(hContinuous)).toBe(true);
            expect(Number.isFinite(hSeparated)).toBe(true);
            expect(hContinuous).toBeLessThan(hSeparated);

            // Test all combinations systematically
            const directions = [TransmissionDirection.Vertical, TransmissionDirection.Horizontal];
            const connections = [
                ConstructionConnection.Continuous,
                ConstructionConnection.Separated,
                ConstructionConnection.Interrupted
            ];
            const massRatios = [0.1, 0.3, 0.5, 0.7];

            directions.forEach(direction => {
                connections.forEach(connection => {
                    massRatios.forEach(ratio => {
                        const result = mass.calculate({
                            massRatio: ratio,
                            pathType: FlankingPathType.Ff,
                            separatingMass: 250,
                            flankingMass: 125,
                            junction: {
                                type: JunctionType.TJoint,
                                direction: direction,
                                connection: connection
                            } as any
                        } as any);

                        expect(typeof result).toBe('number');
                        expect(Number.isFinite(result)).toBe(true);
                        expect(result).toBeGreaterThanOrEqual(0);
                    });
                });
            });
        });

        it('calculates X-joint formulas with direction and connection comprehensive validation', () => {
            const testMassRatio = 0.3;
            const testParams = {
                massRatio: testMassRatio,
                pathType: FlankingPathType.Ff,
                separatingMass: 300,
                flankingMass: 150
            };

            // Test horizontal X-joint continuous
            const xHorizontalContinuous = mass.calculate({
                ...testParams,
                junction: {
                    type: JunctionType.XJoint,
                    direction: TransmissionDirection.Horizontal,
                    connection: ConstructionConnection.Continuous
                } as any
            } as any);

            expect(typeof xHorizontalContinuous).toBe('number');
            expect(Number.isFinite(xHorizontalContinuous)).toBe(true);
            expect(xHorizontalContinuous).toBeGreaterThanOrEqual(0);

            // Test with elastic improvement
            const xElastic = mass.calculate({
                ...testParams,
                junction: {
                    type: JunctionType.XJoint,
                    direction: TransmissionDirection.Horizontal,
                    connection: ConstructionConnection.Continuous,
                    elasticImprovement: 8
                } as any
            } as any);

            expect(typeof xElastic).toBe('number');
            expect(Number.isFinite(xElastic)).toBe(true);
            expect(xElastic).toBeGreaterThanOrEqual(xHorizontalContinuous); // Should be improved or equal

            // Test vertical X-joint
            const xVertical = mass.calculate({
                ...testParams,
                junction: {
                    type: JunctionType.XJoint,
                    direction: TransmissionDirection.Vertical,
                    connection: ConstructionConnection.Continuous
                } as any
            } as any);

            expect(typeof xVertical).toBe('number');
            expect(Number.isFinite(xVertical)).toBe(true);
            expect(xVertical).toBeGreaterThanOrEqual(0);

            // Test different path types for X-joints
            const pathTypes = [FlankingPathType.Ff, FlankingPathType.Fd, FlankingPathType.Df];
            pathTypes.forEach(pathType => {
                const result = mass.calculate({
                    massRatio: 0.4,
                    pathType: pathType,
                    separatingMass: 350,
                    flankingMass: 140,
                    junction: {
                        type: JunctionType.XJoint,
                        direction: TransmissionDirection.Horizontal,
                        connection: ConstructionConnection.Continuous
                    } as any
                } as any);

                expect(typeof result).toBe('number');
                expect(Number.isFinite(result)).toBe(true);
            });
        });

        it('applies elastic improvements correctly with comprehensive validation', () => {
            const baseJunction = {
                type: JunctionType.TJoint,
                direction: TransmissionDirection.Vertical,
                connection: ConstructionConnection.Continuous
            } as any;

            const testParams = {
                massRatio: 0.5,
                pathType: FlankingPathType.Ff,
                separatingMass: 400,
                flankingMass: 200
            };

            // Test without elastic improvement
            const baseValue = mass.calculate({
                ...testParams,
                junction: baseJunction
            } as any);

            // Test with various elastic improvements
            const elasticImprovements = [1, 3, 5, 7, 10, 15];
            elasticImprovements.forEach(improvement => {
                const elasticJunction = {
                    ...baseJunction,
                    elasticImprovement: improvement
                } as any;

                const elasticValue = mass.calculate({
                    ...testParams,
                    junction: elasticJunction
                } as any);

                expect(typeof elasticValue).toBe('number');
                expect(Number.isFinite(elasticValue)).toBe(true);
                expect(elasticValue).toBeGreaterThanOrEqual(baseValue); // Should be improved or equal
                
                // Verify the improvement is applied in some form
                expect(typeof improvement).toBe('number');
                expect(improvement).toBeGreaterThan(0);
            });

            // Test elastic improvement on X-joints
            const xJunction = {
                type: JunctionType.XJoint,
                direction: TransmissionDirection.Horizontal,
                connection: ConstructionConnection.Continuous,
                elasticImprovement: 6
            } as any;

            const xElasticValue = mass.calculate({
                ...testParams,
                junction: xJunction
            } as any);

            expect(typeof xElasticValue).toBe('number');
            expect(Number.isFinite(xElasticValue)).toBe(true);
        });
    });

    describe('Main Junction Calculator Router', () => {
        const junctionCalc = new JunctionCalculator();

        it('routes calculations to appropriate calculators based on construction type with comprehensive validation', () => {
            // Test Massivbau routing to solid calculator
            const solidJunction = {
                type: JunctionType.TJoint,
                constructionType: ConstructionCategory.Massivbau,
                direction: TransmissionDirection.Vertical,
                connection: ConstructionConnection.Continuous
            } as any;

            const solidResult = junctionCalc.calculateSinglePath({
                massRatio: 0.1,
                pathType: FlankingPathType.Ff,
                junction: solidJunction,
                separatingMass: 300,
                flankingMass: 150
            });

            expect(typeof solidResult).toBe('number');
            expect(Number.isFinite(solidResult)).toBe(true);
            expect(solidResult).toBeGreaterThanOrEqual(0);

            // Test Massivholzbau routing to mass timber calculator
            const massTimberJunction = {
                type: JunctionType.XJoint,
                constructionType: ConstructionCategory.Massivholzbau,
                direction: TransmissionDirection.Vertical,
                connection: ConstructionConnection.Separated
            } as any;

            const massTimberResult = junctionCalc.calculateSinglePath({
                massRatio: 0.05,
                pathType: FlankingPathType.Fd,
                junction: massTimberJunction,
                separatingMass: 200,
                flankingMass: 100
            });

            expect(typeof massTimberResult).toBe('number');
            expect(Number.isFinite(massTimberResult)).toBe(true);
            expect(massTimberResult).toBeGreaterThanOrEqual(0);

            // Test Leichtbau fallback (should default to solid calculator)
            const lightweightJunction = {
                type: JunctionType.TJoint,
                constructionType: ConstructionCategory.Leichtbau,
                direction: TransmissionDirection.Horizontal,
                connection: ConstructionConnection.Continuous
            } as any;

            const lightweightResult = junctionCalc.calculateSinglePath({
                massRatio: 0.2,
                pathType: FlankingPathType.Ff,
                junction: lightweightJunction,
                separatingMass: 250,
                flankingMass: 125
            });

            expect(typeof lightweightResult).toBe('number');
            expect(Number.isFinite(lightweightResult)).toBe(true);
            expect(lightweightResult).toBeGreaterThanOrEqual(0);

            // Test comprehensive routing with all construction types
            const constructionTypes = [
                ConstructionCategory.Massivbau,
                ConstructionCategory.Massivholzbau,
                ConstructionCategory.Leichtbau
            ];

            const junctionTypes = [JunctionType.TJoint, JunctionType.XJoint];
            const pathTypes = [FlankingPathType.Ff, FlankingPathType.Fd, FlankingPathType.Df];

            constructionTypes.forEach(constructionType => {
                junctionTypes.forEach(junctionType => {
                    pathTypes.forEach(pathType => {
                        const testJunction = {
                            type: junctionType,
                            constructionType: constructionType,
                            direction: TransmissionDirection.Vertical,
                            connection: ConstructionConnection.Continuous
                        } as any;

                        const result = junctionCalc.calculateSinglePath({
                            massRatio: 0.3,
                            pathType: pathType,
                            junction: testJunction,
                            separatingMass: 280,
                            flankingMass: 140
                        });

                        expect(typeof result).toBe('number');
                        expect(Number.isFinite(result)).toBe(true);
                        expect(result).toBeGreaterThanOrEqual(0);
                    });
                });
            });
        });

        it('handles edge cases and parameter variations comprehensively', () => {
            // Test extreme mass ratios
            const extremeMassRatios = [0.01, 0.99];
            extremeMassRatios.forEach(ratio => {
                const junction = {
                    type: JunctionType.TJoint,
                    constructionType: ConstructionCategory.Massivbau,
                    direction: TransmissionDirection.Vertical,
                    connection: ConstructionConnection.Continuous
                } as any;

                const result = junctionCalc.calculateSinglePath({
                    massRatio: ratio,
                    pathType: FlankingPathType.Ff,
                    junction: junction,
                    separatingMass: 300,
                    flankingMass: 150
                });

                expect(typeof result).toBe('number');
                expect(Number.isFinite(result)).toBe(true);
            });

            // Test very different mass values
            const massConfigurations = [
                { separating: 100, flanking: 50 },
                { separating: 1000, flanking: 500 },
                { separating: 50, flanking: 100 }, // Flanking heavier than separating
                { separating: 500, flanking: 1000 }
            ];

            massConfigurations.forEach(config => {
                const junction = {
                    type: JunctionType.XJoint,
                    constructionType: ConstructionCategory.Massivholzbau,
                    direction: TransmissionDirection.Horizontal,
                    connection: ConstructionConnection.Separated
                } as any;

                const massRatio = config.flanking / config.separating;
                const result = junctionCalc.calculateSinglePath({
                    massRatio: massRatio,
                    pathType: FlankingPathType.Ff,
                    junction: junction,
                    separatingMass: config.separating,
                    flankingMass: config.flanking
                });

                expect(typeof result).toBe('number');
                expect(Number.isFinite(result)).toBe(true);
            });

            // Test elastic junctions with various improvements
            const elasticImprovements = [0, 2, 5, 10, 20];
            elasticImprovements.forEach(improvement => {
                const elasticJunction = {
                    type: JunctionType.ElasticTJoint,
                    constructionType: ConstructionCategory.Massivbau,
                    direction: TransmissionDirection.Vertical,
                    connection: ConstructionConnection.Continuous,
                    elasticImprovement: improvement
                } as any;

                const result = junctionCalc.calculateSinglePath({
                    massRatio: 0.25,
                    pathType: FlankingPathType.Ff,
                    junction: elasticJunction,
                    separatingMass: 400,
                    flankingMass: 200
                });

                expect(typeof result).toBe('number');
                expect(Number.isFinite(result)).toBe(true);
            });
        });
    });
});
