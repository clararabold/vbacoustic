import { 
    ConstructionCategory,
    JunctionDirection,
    JunctionConnection,
    ElementType,
    FlankingPathType
} from '../../models/AcousticTypes';

/**
 * Junction Type Definitions and Properties
 * Based on exact VBA junction classification system
 */

export enum JunctionType {
    TJoint = 't_joint',
    XJoint = 'x_joint',
    ElasticTJoint = 'elastic_t_joint',
    ElasticXJoint = 'elastic_x_joint',
    SeparatedJoint = 'separated_joint',
    InterruptedJoint = 'interrupted_joint'
}

export enum TransmissionDirection {
    Vertical = 'vertical',
    Horizontal = 'horizontal'
}

export enum ConstructionConnection {
    Continuous = 'continuous',
    Separated = 'separated',
    Interrupted = 'interrupted',
    Elastic = 'elastic'
}

/**
 * Junction properties for calculation
 */
export interface Junction {
    type: JunctionType;
    constructionType: ConstructionCategory;
    direction: TransmissionDirection;
    connection: ConstructionConnection;
    elasticImprovement?: number; // Additional dB for elastic connections
}

/**
 * Junction calculation parameters
 */
export interface JunctionCalculationParams {
    massRatio: number;  // M = log10(ms/mf) - mass ratio of connecting elements
    pathType: FlankingPathType;
    junction: Junction;
    separatingMass: number;
    flankingMass: number;
}

/**
 * Attenuation values for all flanking paths at a junction
 */
export interface JunctionAttenuation {
    [FlankingPathType.Ff]: number;
    [FlankingPathType.Fd]: number;
    [FlankingPathType.Df]: number;
}
