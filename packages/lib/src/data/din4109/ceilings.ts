/**
 * DIN 4109-33 Ceiling/Floor Components Database
 * Based on DIN 4109-33:2016-07 - Tabellen 15-25 (Timber beam ceilings, mass timber ceilings)
 * 
 * Data extracted from VBA legacy implementation and DIN 4109-33:2016-07 standard
 */

import { FloorConstructionType, ScreedType } from '../../models/AcousticTypes';
import { DIN4109CeilingComponent } from './types';

/**
 * Table 15: Timber beam ceilings with mineral-bonded screeds and raw ceiling ballast
 * (Holzbalkendecken mit mineralisch gebundenen Estrichen und Rohdeckenbeschwerung)
 */
export const DIN4109_TABLE_15_TIMBER_BEAM_CEMENT_SCREED: DIN4109CeilingComponent[] = [
  {
    id: 'T15.1',
    tableNumber: 15,
    rowNumber: 1,
    rw: 70,
    lnw: 47,
    mass: 180,
    thickness: 280,
    descriptions: {
      de: {
        short: 'HBD + ZE 50 + Beschwerung',
        description: 'Holzbalkendecke mit Zementestrich 50mm und Rohdeckenbeschwerung',
        constructionDetails: 'Holzbalken 160/220mm, Ausfachung Mineralwolle 140mm, Spanplatte 22mm, Zementestrich 50mm auf Trittschalldämmung 20mm, Rohdeckenbeschwerung'
      },
      en: {
        short: 'TBC + CS 50 + ballast',
        description: 'Timber beam ceiling with cement screed 50mm and raw ceiling ballast',
        constructionDetails: 'Timber beams 160/220mm, mineral wool infill 140mm, chipboard 22mm, cement screed 50mm on impact sound insulation 20mm, raw ceiling ballast'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 30, density: 1800, description: 'Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 30, density: 1800, description: 'Raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.CementOnMineralFiber]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 15, Zeile 1'
  },
  {
    id: 'T15.2',
    tableNumber: 15,
    rowNumber: 2,
    rw: 67,
    lnw: 50,
    mass: 160,
    thickness: 280,
    descriptions: {
      de: {
        short: 'HBD + ZE 50 + leichtere Beschwerung',
        description: 'Holzbalkendecke mit Zementestrich 50mm und leichterer Rohdeckenbeschwerung',
        constructionDetails: 'Holzbalken 160/220mm, Ausfachung Mineralwolle 140mm, Spanplatte 22mm, Zementestrich 50mm auf Trittschalldämmung 20mm, reduzierte Rohdeckenbeschwerung'
      },
      en: {
        short: 'TBC + CS 50 + lighter ballast',
        description: 'Timber beam ceiling with cement screed 50mm and lighter raw ceiling ballast',
        constructionDetails: 'Timber beams 160/220mm, mineral wool infill 140mm, chipboard 22mm, cement screed 50mm on impact sound insulation 20mm, reduced raw ceiling ballast'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 20, density: 1800, description: 'Reduzierte Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 20, density: 1800, description: 'Reduced raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.CementOnMineralFiber]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 15, Zeile 2'
  }
];

/**
 * Table 16: Timber beam ceilings with dry screeds and raw ceiling ballast
 * (Holzbalkendecken mit Fertigteilestrichen und Rohdeckenbeschwerung)
 */
export const DIN4109_TABLE_16_TIMBER_BEAM_DRY_SCREED: DIN4109CeilingComponent[] = [
  {
    id: 'T16.1',
    tableNumber: 16,
    rowNumber: 1,
    rw: 65,
    lnw: 54,
    mass: 150,
    thickness: 280,
    descriptions: {
      de: {
        short: 'HBD + TE + Beschwerung',
        description: 'Holzbalkendecke mit Trockenestrich und Rohdeckenbeschwerung',
        constructionDetails: 'Holzbalken 160/220mm, Ausfachung Mineralwolle 140mm, Spanplatte 22mm, Trockenestrich auf Trittschalldämmung 20mm, Rohdeckenbeschwerung'
      },
      en: {
        short: 'TBC + DS + ballast',
        description: 'Timber beam ceiling with dry screed and raw ceiling ballast',
        constructionDetails: 'Timber beams 160/220mm, mineral wool infill 140mm, chipboard 22mm, dry screed on impact sound insulation 20mm, raw ceiling ballast'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Trockenestrich', material: 'Trockenestrich', thickness: 40, density: 1200, description: 'Trockenestrich-Elemente' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 30, density: 1800, description: 'Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Dry screed', material: 'Dry screed', thickness: 40, density: 1200, description: 'Dry screed elements' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 30, density: 1800, description: 'Raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.DryScreed]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 16, Zeile 1'
  },
  {
    id: 'T16.2',
    tableNumber: 16,
    rowNumber: 2,
    rw: 64,
    lnw: 57,
    mass: 130,
    thickness: 280,
    descriptions: {
      de: {
        short: 'HBD + TE + leichtere Beschwerung',
        description: 'Holzbalkendecke mit Trockenestrich und leichterer Rohdeckenbeschwerung',
        constructionDetails: 'Holzbalken 160/220mm, Ausfachung Mineralwolle 140mm, Spanplatte 22mm, Trockenestrich auf Trittschalldämmung 20mm, reduzierte Rohdeckenbeschwerung'
      },
      en: {
        short: 'TBC + DS + lighter ballast',
        description: 'Timber beam ceiling with dry screed and lighter raw ceiling ballast',
        constructionDetails: 'Timber beams 160/220mm, mineral wool infill 140mm, chipboard 22mm, dry screed on impact sound insulation 20mm, reduced raw ceiling ballast'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Trockenestrich', material: 'Trockenestrich', thickness: 40, density: 1200, description: 'Trockenestrich-Elemente' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 20, density: 1800, description: 'Reduzierte Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Dry screed', material: 'Dry screed', thickness: 40, density: 1200, description: 'Dry screed elements' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 20, density: 1800, description: 'Reduced raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.DryScreed]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 16, Zeile 2'
  }
];

/**
 * Table 17-18: Timber beam ceilings with screeds and suspended ceilings on battens
 * (Holzbalkendecken mit Estrichen und Unterdecken an Lattung)
 */
export const DIN4109_TABLE_17_18_TIMBER_BEAM_BATTENS: DIN4109CeilingComponent[] = [
  {
    id: 'T17.1',
    tableNumber: 17,
    rowNumber: 1,
    rw: 63,
    lnw: 54,
    descriptions: {
      de: {
        short: 'HBD + ZE + GK-Lattung',
        description: 'Holzbalkendecke mit Zementestrich und Gipskarton-Unterdecke an Lattung',
        constructionDetails: 'Holzbalken, Ausfachung Mineralwolle, Zementestrich, Unterdecke aus Gipskartonplatten an Lattung'
      },
      en: {
        short: 'TBC + CS + GB suspended batten',
        description: 'Timber beam ceiling with cement screed and gypsum board suspended ceiling on battens',
        constructionDetails: 'Timber beams, mineral wool infill, cement screed, suspended ceiling of gypsum boards on battens'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-5', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' },
        { id: 'layer-6', name: 'Hohlraum', material: 'Luft', thickness: 50, density: 1.2, description: 'Hohlraum über Unterdecke' },
        { id: 'layer-7', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte an Lattung' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-5', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' },
        { id: 'layer-6', name: 'Air cavity', material: 'Air', thickness: 50, density: 1.2, description: 'Air cavity above suspended ceiling' },
        { id: 'layer-7', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board on battens' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithBattensGK],
      screedTypes: [ScreedType.CementOnMineralFiber]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 17, Zeile 1'
  },
  {
    id: 'T18.1',
    tableNumber: 18,
    rowNumber: 1,
    rw: 65,
    lnw: 48,
    descriptions: {
      de: {
        short: 'HBD + ZE + GK-Lattung + Beschwerung',
        description: 'Holzbalkendecke mit Zementestrich, Gipskarton-Unterdecke an Lattung und Beschwerung',
        constructionDetails: 'Holzbalken, Ausfachung Mineralwolle, Rohdeckenbeschwerung, Zementestrich, Unterdecke aus Gipskartonplatten an Lattung'
      },
      en: {
        short: 'TBC + CS + GB suspended batten + ballast',
        description: 'Timber beam ceiling with cement screed, gypsum board suspended ceiling on battens and ballast',
        constructionDetails: 'Timber beams, mineral wool infill, raw ceiling ballast, cement screed, suspended ceiling of gypsum boards on battens'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 30, density: 1800, description: 'Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' },
        { id: 'layer-7', name: 'Hohlraum', material: 'Luft', thickness: 50, density: 1.2, description: 'Hohlraum über Unterdecke' },
        { id: 'layer-8', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte an Lattung' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 30, density: 1800, description: 'Raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' },
        { id: 'layer-7', name: 'Air cavity', material: 'Air', thickness: 50, density: 1.2, description: 'Air cavity above suspended ceiling' },
        { id: 'layer-8', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board on battens' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithBattensGK],
      screedTypes: [ScreedType.CementOnMineralFiber]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 18, Zeile 1'
  },
  {
    id: 'T18.2',
    tableNumber: 18,
    rowNumber: 2,
    rw: 67,
    lnw: 46,
    descriptions: {
      de: {
        short: 'HBD + ZE + GK-Lattung + mehr Beschwerung',
        description: 'Holzbalkendecke mit Zementestrich, Gipskarton-Unterdecke an Lattung und erhöhter Beschwerung',
        constructionDetails: 'Holzbalken, Ausfachung Mineralwolle, erhöhte Rohdeckenbeschwerung, Zementestrich, Unterdecke aus Gipskartonplatten an Lattung'
      },
      en: {
        short: 'TBC + CS + GB suspended batten + more ballast',
        description: 'Timber beam ceiling with cement screed, gypsum board suspended ceiling on battens and increased ballast',
        constructionDetails: 'Timber beams, mineral wool infill, increased raw ceiling ballast, cement screed, suspended ceiling of gypsum boards on battens'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 50, density: 1800, description: 'Erhöhte Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' },
        { id: 'layer-7', name: 'Hohlraum', material: 'Luft', thickness: 50, density: 1.2, description: 'Hohlraum über Unterdecke' },
        { id: 'layer-8', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte an Lattung' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 50, density: 1800, description: 'Increased raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' },
        { id: 'layer-7', name: 'Air cavity', material: 'Air', thickness: 50, density: 1.2, description: 'Air cavity above suspended ceiling' },
        { id: 'layer-8', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board on battens' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithBattensGK],
      screedTypes: [ScreedType.CementOnMineralFiber]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 18, Zeile 2'
  },
  {
    id: 'T18.3',
    tableNumber: 18,
    rowNumber: 3,
    rw: 67,
    lnw: 51,
    descriptions: {
      de: {
        short: 'HBD + ZE + GK-Lattung + mittlere Beschwerung',
        description: 'Holzbalkendecke mit Zementestrich, Gipskarton-Unterdecke an Lattung und mittlerer Beschwerung',
        constructionDetails: 'Holzbalken, Ausfachung Mineralwolle, mittlere Rohdeckenbeschwerung, Zementestrich, Unterdecke aus Gipskartonplatten an Lattung'
      },
      en: {
        short: 'TBC + CS + GB suspended batten + medium ballast',
        description: 'Timber beam ceiling with cement screed, gypsum board suspended ceiling on battens and medium ballast',
        constructionDetails: 'Timber beams, mineral wool infill, medium raw ceiling ballast, cement screed, suspended ceiling of gypsum boards on battens'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 40, density: 1800, description: 'Mittlere Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' },
        { id: 'layer-7', name: 'Hohlraum', material: 'Luft', thickness: 50, density: 1.2, description: 'Hohlraum über Unterdecke' },
        { id: 'layer-8', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte an Lattung' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 40, density: 1800, description: 'Medium raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' },
        { id: 'layer-7', name: 'Air cavity', material: 'Air', thickness: 50, density: 1.2, description: 'Air cavity above suspended ceiling' },
        { id: 'layer-8', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board on battens' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithBattensGK],
      screedTypes: [ScreedType.CementOnMineralFiber]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 18, Zeile 3'
  }
];

/**
 * Table 19: Timber beam ceilings with dry screeds and suspended ceilings on battens
 * (Holzbalkendecken mit Fertigteilestrichen und Unterdecken an Lattung)
 */
export const DIN4109_TABLE_19_TIMBER_BEAM_DRY_BATTENS: DIN4109CeilingComponent[] = [
  {
    id: 'T19.1',
    tableNumber: 19,
    rowNumber: 1,
    rw: 61,
    lnw: 55,
    descriptions: {
      de: {
        short: 'HBD + TE + GK-Lattung',
        description: 'Holzbalkendecke mit Trockenestrich und Gipskarton-Unterdecke an Lattung',
        constructionDetails: 'Holzbalken, Ausfachung Mineralwolle, Trockenestrich, Unterdecke aus Gipskartonplatten an Lattung'
      },
      en: {
        short: 'TBC + DS + GB suspended batten',
        description: 'Timber beam ceiling with dry screed and gypsum board suspended ceiling on battens',
        constructionDetails: 'Timber beams, mineral wool infill, dry screed, suspended ceiling of gypsum boards on battens'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Trockenestrich', material: 'Trockenestrich', thickness: 40, density: 1200, description: 'Trockenestrich-Elemente' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-5', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' },
        { id: 'layer-6', name: 'Hohlraum', material: 'Luft', thickness: 50, density: 1.2, description: 'Hohlraum über Unterdecke' },
        { id: 'layer-7', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte an Lattung' }
      ],
      en: [
        { id: 'layer-1', name: 'Dry screed', material: 'Dry screed', thickness: 40, density: 1200, description: 'Dry screed elements' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-5', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' },
        { id: 'layer-6', name: 'Air cavity', material: 'Air', thickness: 50, density: 1.2, description: 'Air cavity above suspended ceiling' },
        { id: 'layer-7', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board on battens' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithBattensGK],
      screedTypes: [ScreedType.DryScreed]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 19, Zeile 1'
  }
];

/**
 * All ceiling components from DIN 4109-33 tables
 */
export const DIN4109_CEILING_COMPONENTS: DIN4109CeilingComponent[] = [
  ...DIN4109_TABLE_15_TIMBER_BEAM_CEMENT_SCREED,
  ...DIN4109_TABLE_16_TIMBER_BEAM_DRY_SCREED,
  ...DIN4109_TABLE_17_18_TIMBER_BEAM_BATTENS,
  ...DIN4109_TABLE_19_TIMBER_BEAM_DRY_BATTENS
  // TODO: Add Tables 20-25 (More suspended ceilings, mass timber ceilings)
];

/**
 * Get table description by table number
 */
export function getCeilingTableDescription(tableNumber: number): string | null {
  const descriptions: Record<number, string> = {
    15: 'Holzbalkendecken mit mineralisch gebundenen Estrichen und Rohdeckenbeschwerung (Timber beam ceilings with mineral-bonded screeds and raw ceiling ballast)',
    16: 'Holzbalkendecken mit Fertigteilestrichen und Rohdeckenbeschwerung (Timber beam ceilings with dry screeds and raw ceiling ballast)',
    17: 'Holzbalkendecken mit Zementestrichen und Unterdecken an Lattung - leichte Ausführung (Timber beam ceilings with cement screeds and suspended ceilings on battens - light version)',
    18: 'Holzbalkendecken mit Zementestrichen und Unterdecken an Lattung - schwere Ausführung (Timber beam ceilings with cement screeds and suspended ceilings on battens - heavy version)',
    19: 'Holzbalkendecken mit Fertigteilestrichen und Unterdecken an Lattung (Timber beam ceilings with dry screeds and suspended ceilings on battens)',
    20: 'Holzbalkendecken mit Zementestrichen und abgehängten Unterdecken - leichte Ausführung (Timber beam ceilings with cement screeds and suspended ceilings - light version)',
    21: 'Holzbalkendecken mit Zementestrichen und abgehängten Unterdecken - schwere Ausführung (Timber beam ceilings with cement screeds and suspended ceilings - heavy version)',
    22: 'Holzbalkendecken mit Fertigteilestrichen und abgehängten Unterdecken - leichte Ausführung (Timber beam ceilings with dry screeds and suspended ceilings - light version)',
    23: 'Holzbalkendecken mit Fertigteilestrichen und abgehängten Unterdecken - schwere Ausführung (Timber beam ceilings with dry screeds and suspended ceilings - heavy version)',
    24: 'Massivholzdecken mit Zementestrichen - leichte Ausführung (Mass timber ceilings with cement screeds - light version)',
    25: 'Massivholzdecken mit Zementestrichen - schwere Ausführung (Mass timber ceilings with cement screeds - heavy version)'
  };
  return descriptions[tableNumber] || null;
}
