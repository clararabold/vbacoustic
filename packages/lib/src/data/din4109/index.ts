/**
 * DIN 4109-33 Component Database
 * Main export module for DIN 4109-33:2016-07 component catalog
 */

// Export the main database class and default instance
export { 
  DIN4109ComponentDatabase, 
  din4109Database 
} from './database';

// Export all type definitions
export type {
  DIN4109BaseComponent,
  DIN4109WallComponent,
  DIN4109CeilingComponent,
  DIN4109FlankingComponent,
  DIN4109Layer,
  DIN4109Description,
  DIN4109ComponentFilter,
  DIN4109Database
} from './types';

// Export component arrays for direct access
export {
  DIN4109_WALL_COMPONENTS,
  DIN4109_CEILING_COMPONENTS,
  DIN4109_FLANKING_COMPONENTS
} from './database';

// Export table description functions
export {
  getWallTableDescription,
  getCeilingTableDescription,
  getFlankingTableDescription
} from './database';
