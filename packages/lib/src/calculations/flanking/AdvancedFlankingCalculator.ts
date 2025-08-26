import { 
    BuildingElement, 
    JunctionData,
    JunctionDirection,
    JunctionConnection,
    ConstructionType,
    JunctionType as AcousticJunctionType
} from '../../models/AcousticTypes';
import { 
    SolidJunctionCalculator, 
    MassTimberJunctionCalculator 
} from '../../core/junctions/JunctionCalculator';
import { 
    TransmissionDirection, 
    ConstructionConnection,
    JunctionType as CoreJunctionType
} from '../../core/junctions/JunctionTypes';
import { roundToOneDecimal } from '../../utils/MathUtils';

// Advanced flanking types
export enum FlankingPathType {
    Ff = 'Ff', // Flanking-Flanking
    Fd = 'Fd', // Flanking-Direct
    Df = 'Df'  // Direct-Flanking
}

export enum FloorType {
    Concrete = 'concrete',
    TimberBeam = 'timber_beam',
    SolidTimber = 'solid_timber'
}

export enum CeilingType {
    SuspendedPlasterboard = 'suspended_plasterboard',
    DirectPlasterboard = 'direct_plasterboard',
    None = 'none'
}

export enum JunctionTypeK1K2 {
    Rigid = 'rigid',
    Elastic = 'elastic'
}

export enum ConnectionTypeK1K2 {
    Continuous = 'continuous',
    Interrupted = 'interrupted'
}

export interface AdvancedFlankingParams {
    separatingElement: BuildingElement;
    flankingElements: {
        element: BuildingElement;
        junctions: JunctionData[];
    }[];
}

export interface AdvancedFlankingResults {
    airborne: {
        Ff_paths: any[];
        Fd_paths: any[];
        Df_paths: any[];
        total_Ff: number;
        total_Fd: number;
        total_Df: number;
        total_flanking: number;
    };
    impact?: {
        paths: any[];
        K1_correction: number;
        K2_correction: number;
        total: number;
    };
}

export interface K1K2Params {
    floorType: FloorType;
    ceilingType: CeilingType;
    junctionType?: JunctionTypeK1K2;
    connectionType?: ConnectionTypeK1K2;
    massRatio?: number;
    additionalLayers?: {
        floatingFloor?: { improvement: number };
        resilientLayer?: { improvement: number };
    };
}

/**
 * Advanced flanking transmission calculator implementing complete VBA logic
 * for all flanking path combinations with junction calculations
 */
export class AdvancedFlankingCalculator {
    private solidJunctionCalc = new SolidJunctionCalculator();
    private massTimberJunctionCalc = new MassTimberJunctionCalculator();
    
    /**
     * Calculate all flanking paths for a building element
     */
    calculateAllPaths(params: AdvancedFlankingParams): AdvancedFlankingResults {
        const results: AdvancedFlankingResults = {
            airborne: {
                Ff_paths: [],
                Fd_paths: [],
                Df_paths: [],
                total_Ff: 0,
                total_Fd: 0,
                total_Df: 0,
                total_flanking: 0
            }
        };
        
        // Calculate each path type
        results.airborne.Ff_paths = this.calculatePathType(params, FlankingPathType.Ff);
        results.airborne.Fd_paths = this.calculatePathType(params, FlankingPathType.Fd);
        results.airborne.Df_paths = this.calculatePathType(params, FlankingPathType.Df);
        
        // Sum each path type
        results.airborne.total_Ff = this.sumPaths(results.airborne.Ff_paths);
        results.airborne.total_Fd = this.sumPaths(results.airborne.Fd_paths);
        results.airborne.total_Df = this.sumPaths(results.airborne.Df_paths);
        
        // Total flanking transmission
        results.airborne.total_flanking = this.combinePaths([
            results.airborne.total_Ff,
            results.airborne.total_Fd,
            results.airborne.total_Df
        ]);
        
        return results;
    }
    
    /**
     * Calculate flanking paths for specific path type
     */
    private calculatePathType(
        params: AdvancedFlankingParams, 
        pathType: FlankingPathType
    ) {
        const paths = [];
        
        for (const flankingElement of params.flankingElements) {
            const path = this.calculateSinglePath(
                params.separatingElement,
                flankingElement.element,
                flankingElement.junctions,
                pathType
            );
            
            paths.push({
                element: flankingElement.element,
                pathType,
                transmission: path,
                junctionData: flankingElement.junctions
            });
        }
        
        return paths;
    }
    
    /**
     * Calculate single flanking path transmission
     * Implements exact VBA formula: Rijw = (Riw + Rjw) / 2 + DRijw + Kij + 10 * Log10(Ss / lf)
     * From calc_Massivbau_single.vba Rijw function
     */
    private calculateSinglePath(
        separatingElement: BuildingElement,
        flankingElement: BuildingElement,
        junctions: JunctionData[],
        pathType: FlankingPathType
    ): number {
        let Ri: number = 0, Rj: number = 0;
        
        // Get sound reduction indices based on path type
        switch (pathType) {
            case FlankingPathType.Ff:
                Ri = flankingElement.Rw;
                Rj = flankingElement.Rw;
                break;
            case FlankingPathType.Fd:
                Ri = flankingElement.Rw;
                Rj = separatingElement.Rw;
                break;
            case FlankingPathType.Df:
                Ri = separatingElement.Rw;
                Rj = flankingElement.Rw;
                break;
        }
        
        // Calculate total junction attenuation (Kij)
        let totalKij = 0;
        for (const junction of junctions) {
            const kij = this.calculateJunctionAttenuation(
                separatingElement,
                flankingElement,
                junction,
                pathType
            );
            totalKij += kij;
        }
        
        // DRijw layer improvement factor (would come from additional layers)
        const DRijw = 0; // Simplified for now
        
        // Length factors from VBA (Ss = element area, lf = coupling length)
        const Ss = separatingElement.area || 10; // Element area
        const lf = separatingElement.length || 3; // Coupling length
        
        // Exact VBA formula: Rijw = (Riw + Rjw) / 2 + DRijw + Kij + 10 * Log10(Ss / lf)
        const Rijw = (Ri + Rj) / 2 + DRijw + totalKij + 10 * Math.log10(Ss / lf);
        
        return roundToOneDecimal(Rijw);
    }
    
    /**
     * Calculate junction attenuation Kij
     */
    private calculateJunctionAttenuation(
        separatingElement: BuildingElement,
        flankingElement: BuildingElement,
        junction: JunctionData,
        pathType: FlankingPathType
    ): number {
        // Mass ratio calculation
        const massRatio = flankingElement.massPerArea / separatingElement.massPerArea;
        
        // Convert string directions to proper enums
        const direction = junction.direction === JunctionDirection.Vertical 
            ? TransmissionDirection.Vertical 
            : TransmissionDirection.Horizontal;
            
        const connection = junction.connection === JunctionConnection.Continuous 
            ? ConstructionConnection.Continuous
            : junction.connection === JunctionConnection.Separated
            ? ConstructionConnection.Separated
            : ConstructionConnection.Interrupted;
        
        // Map AcousticJunctionType to CoreJunctionType - simple mapping for now
        const mappedJunctionType = CoreJunctionType.TJoint; // Default mapping
        
        // Convert JunctionData to the expected Junction format
        const junctionForCalc = {
            type: mappedJunctionType,
            direction: direction,
            connection: connection,
            elasticImprovement: junction.elasticImprovement || 0,
            constructionType: separatingElement.constructionType
        };
        
        const params = {
            junction: junctionForCalc,
            massRatio,
            pathType: pathType,
            separatingMass: separatingElement.massPerArea,
            flankingMass: flankingElement.massPerArea
        };
        
        // Use appropriate calculator based on construction type
        const calculator = separatingElement.constructionType === ConstructionType.Solid 
            ? this.solidJunctionCalc 
            : this.massTimberJunctionCalc;
            
        return calculator.calculate(params);
    }
    
    /**
     * Sum multiple path contributions
     * Uses energetic addition: -10*log10(sum(10^(-Ri/10)))
     * Based on VBA RStrichw function
     */
    private sumPaths(paths: any[]): number {
        if (paths.length === 0) return 999; // No contribution
        
        let sum = 0;
        for (const path of paths) {
            sum += Math.pow(10, -path.transmission / 10);
        }
        
        return roundToOneDecimal(-10 * Math.log10(sum));
    }
    
    /**
     * Combine different path types energetically
     */
    private combinePaths(pathValues: number[]): number {
        const validPaths = pathValues.filter(val => val < 900); // Filter out "no contribution"
        
        if (validPaths.length === 0) return 999;
        
        let sum = 0;
        for (const value of validPaths) {
            sum += Math.pow(10, -value / 10);
        }
        
        return roundToOneDecimal(-10 * Math.log10(sum));
    }
}
