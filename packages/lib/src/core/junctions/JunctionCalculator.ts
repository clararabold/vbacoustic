/**
 * Complete Junction Calculator
 * Implements exact VBA junction attenuation matrices and formulas
 */

import { log10, clamp, roundToOneDecimal } from '../../utils/MathUtils';
import { 
    Junction, 
    JunctionType, 
    JunctionCalculationParams, 
    JunctionAttenuation,
    TransmissionDirection,
    ConstructionConnection
} from './JunctionTypes';
import { FlankingPathType, ConstructionCategory } from '../../models/AcousticTypes';

/**
 * Solid Construction Junction Calculator
 * Implements exact VBA formulas from junction calculation matrices
 */
export class SolidJunctionCalculator {
    
    /**
     * Calculate Kij for solid construction T-joints
     * VBA implementation from junction matrices
     */
    calculateTJointKij(massRatio: number, pathType: FlankingPathType): number {
        const M = massRatio;
        
        switch (pathType) {
            case FlankingPathType.Ff:
                // VBA: Ff path T-joint formulas
                if (M < 0.215) {
                    return 5.7 + 14.1 * M + 5.7 * M * M;
                } else {
                    return 8 + 6.8 * M;
                }
                
            case FlankingPathType.Fd:
            case FlankingPathType.Df:
                // VBA: Fd/Df path T-joint formula
                return 4.7 + 5.7 * M * M;
                
            default:
                throw new Error(`Unsupported path type for T-joint: ${pathType}`);
        }
    }
    
    /**
     * Calculate Kij for solid construction X-joints
     * VBA implementation from junction matrices
     */
    calculateXJointKij(massRatio: number, pathType: FlankingPathType): number {
        const M = massRatio;
        
        switch (pathType) {
            case FlankingPathType.Ff:
                // VBA: Ff path X-joint formulas
                if (M < 0.182) {
                    return 8.7 + 17.1 * M + 5.7 * M * M;
                } else {
                    return 9.6 + 11 * M;
                }
                
            case FlankingPathType.Fd:
            case FlankingPathType.Df:
                // VBA: Fd/Df path X-joint formula
                return 5.7 + 15.4 * M * M;
                
            default:
                throw new Error(`Unsupported path type for X-joint: ${pathType}`);
        }
    }
    
    /**
     * Calculate junction attenuation for solid construction
     */
    calculate(params: JunctionCalculationParams): number {
        let kij: number;
        
        switch (params.junction.type) {
            case JunctionType.TJoint:
                kij = this.calculateTJointKij(params.massRatio, params.pathType);
                break;
                
            case JunctionType.XJoint:
                kij = this.calculateXJointKij(params.massRatio, params.pathType);
                break;
                
            case JunctionType.ElasticTJoint:
                kij = this.calculateTJointKij(params.massRatio, params.pathType);
                kij += params.junction.elasticImprovement || 5; // Typical 5 dB improvement
                break;
                
            case JunctionType.ElasticXJoint:
                kij = this.calculateXJointKij(params.massRatio, params.pathType);
                kij += params.junction.elasticImprovement || 5; // Typical 5 dB improvement
                break;
                
            default:
                throw new Error(`Unsupported junction type for solid construction: ${params.junction.type}`);
        }
        
        return roundToOneDecimal(kij);
    }
}

/**
 * Mass Timber Junction Calculator
 * Implements exact VBA mass timber junction matrices from DIN 4109-33
 */
export class MassTimberJunctionCalculator {
    
    /**
     * Mass timber T-joint matrices (VBA DIN 4109-33 implementation)
     */
    private readonly tJointMatrices: Record<string, any> = {
        vertical: {
            [FlankingPathType.Ff]: {
                continuous: (M: number) => 21 + 4 * M + 3 * M * M,
                separated: (M: number) => 26 + 4 * M + 3 * M * M,
                interrupted: (M: number) => 28 + 4 * M + 3 * M * M
            },
            [FlankingPathType.Fd]: {
                continuous: (M: number) => 12 + 14 * M * M,
                separated: (M: number) => 17 + 14 * M * M,
                interrupted: (M: number) => 19 + 14 * M * M
            },
            [FlankingPathType.Df]: {
                continuous: (M: number) => 12 + 14 * M * M,
                separated: (M: number) => 17 + 14 * M * M,
                interrupted: (M: number) => 19 + 14 * M * M
            }
        },
        horizontal: {
            [FlankingPathType.Ff]: {
                continuous: (M: number) => 18 + 6 * M + 2 * M * M,
                separated: (M: number) => 23 + 6 * M + 2 * M * M,
                interrupted: (M: number) => 25 + 6 * M + 2 * M * M
            },
            [FlankingPathType.Fd]: {
                continuous: (M: number) => 10 + 12 * M * M,
                separated: (M: number) => 15 + 12 * M * M,
                interrupted: (M: number) => 17 + 12 * M * M
            },
            [FlankingPathType.Df]: {
                continuous: (M: number) => 10 + 12 * M * M,
                separated: (M: number) => 15 + 12 * M * M,
                interrupted: (M: number) => 17 + 12 * M * M
            }
        }
    };
    
    /**
     * Mass timber X-joint matrices (VBA DIN 4109-33 implementation)
     */
    private readonly xJointMatrices: Record<string, any> = {
        vertical: {
            [FlankingPathType.Ff]: {
                continuous: (M: number) => 23 + 6 * M + 2 * M * M,
                separated: (M: number) => 28 + 6 * M + 2 * M * M,
                interrupted: (M: number) => 30 + 6 * M + 2 * M * M
            },
            [FlankingPathType.Fd]: {
                continuous: (M: number) => 15 + 12 * M * M,
                separated: (M: number) => 20 + 12 * M * M,
                interrupted: (M: number) => 22 + 12 * M * M
            },
            [FlankingPathType.Df]: {
                continuous: (M: number) => 15 + 12 * M * M,
                separated: (M: number) => 20 + 12 * M * M,
                interrupted: (M: number) => 22 + 12 * M * M
            }
        },
        horizontal: {
            [FlankingPathType.Ff]: {
                continuous: (M: number) => 20 + 8 * M + M * M,
                separated: (M: number) => 25 + 8 * M + M * M,
                interrupted: (M: number) => 27 + 8 * M + M * M
            },
            [FlankingPathType.Fd]: {
                continuous: (M: number) => 12 + 10 * M * M,
                separated: (M: number) => 17 + 10 * M * M,
                interrupted: (M: number) => 19 + 10 * M * M
            },
            [FlankingPathType.Df]: {
                continuous: (M: number) => 12 + 10 * M * M,
                separated: (M: number) => 17 + 10 * M * M,
                interrupted: (M: number) => 19 + 10 * M * M
            }
        }
    };
    
    /**
     * Calculate junction attenuation for mass timber construction
     */
    calculate(params: JunctionCalculationParams): number {
        const M = params.massRatio;
        const pathType = params.pathType;
        const direction = params.junction.direction as 'vertical' | 'horizontal';
        const connection = params.junction.connection as 'continuous' | 'separated' | 'interrupted';
        
        let kij: number;
        let matrix: any;
        
        switch (params.junction.type) {
            case JunctionType.TJoint:
            case JunctionType.ElasticTJoint:
                matrix = this.tJointMatrices[direction]?.[pathType];
                break;
                
            case JunctionType.XJoint:
            case JunctionType.ElasticXJoint:
                matrix = this.xJointMatrices[direction]?.[pathType];
                break;
                
            default:
                throw new Error(`Unsupported junction type for mass timber: ${params.junction.type}`);
        }
        
        if (!matrix || !matrix[connection]) {
            throw new Error(`Unsupported connection type: ${connection} for ${direction} ${pathType}`);
        }
        
        kij = matrix[connection](M);
        
        // Add elastic improvement if applicable
        if (params.junction.type === JunctionType.ElasticTJoint || 
            params.junction.type === JunctionType.ElasticXJoint) {
            kij += params.junction.elasticImprovement || 8; // Typical 8 dB for mass timber elastic
        }
        
        return roundToOneDecimal(kij);
    }
}

/**
 * Complete Junction Calculator
 * Routes to appropriate calculator based on construction type
 */
export class JunctionCalculator {
    private solidCalculator = new SolidJunctionCalculator();
    private massTimberCalculator = new MassTimberJunctionCalculator();
    
    /**
     * Calculate junction attenuation for all flanking paths
     */
    calculateAllPaths(
        senderMass: number,
        receiverMass: number,
        separatingMass: number,
        junction: Junction
    ): JunctionAttenuation {
        const massRatio = log10(senderMass / receiverMass);
        
        const baseParams: JunctionCalculationParams = {
            massRatio: massRatio,
            pathType: FlankingPathType.Ff, // Will be overridden
            junction: junction,
            separatingMass: separatingMass,
            flankingMass: senderMass
        };
        
        // Calculate for all paths
        const Ff = this.calculateSinglePath({ ...baseParams, pathType: FlankingPathType.Ff });
        const Fd = this.calculateSinglePath({ ...baseParams, pathType: FlankingPathType.Fd });
        const Df = this.calculateSinglePath({ ...baseParams, pathType: FlankingPathType.Df });
        
        return { Ff, Fd, Df };
    }
    
    /**
     * Calculate junction attenuation for single path
     */
    calculateSinglePath(params: JunctionCalculationParams): number {
        switch (params.junction.constructionType) {
            case ConstructionCategory.Massivbau:
                return this.solidCalculator.calculate(params);
                
            case ConstructionCategory.Massivholzbau:
                return this.massTimberCalculator.calculate(params);
                
            case ConstructionCategory.Leichtbau:
                // Lightweight construction uses different approach (measured Dnfw values)
                // Return basic approximation for Phase 2
                return 5; // Placeholder - will be enhanced in later phases
                
            default:
                throw new Error(`Unsupported construction type: ${params.junction.constructionType}`);
        }
    }
}
