/**
 * DIN 4109-33 Ceiling/Floor Components Database
 * Based on DIN 4109-33:2016-07 - Tabellen 15-25 (Timber beam ceilings, mass timber ceilings)
 * 
 * Data extracted from VBA legacy implementation and DIN 4109-33:2016-07 standard
 */

import { FloorConstructionType, ScreedType } from '../../models/AcousticTypes';
import { DIN4109CeilingComponent, DIN4109TableDescription } from './types';

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
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.Gussasphalt]
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
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.Gussasphalt]
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

export const DIN4109_TABLE_17_TIMBER_BEAM_MASTIC_ASPHALT: DIN4109CeilingComponent[] = [
  {
    id: 'T17.1',
    tableNumber: 17,
    rowNumber: 1,
    rw: 71,
    lnw: 46,
    mass: 200,
    thickness: 280,
    descriptions: {
      de: {
        short: 'HBD + GA 50 + Beschwerung',
        description: 'Holzbalkendecke mit Gussasphaltestrich 50mm und Rohdeckenbeschwerung',
        constructionDetails: 'Holzbalken ≥ 160/220mm, Ausfachung Mineralwolle ≥ 140mm (40 kg/m³), Spanplatte ≥ 22mm, Gussasphaltestrich 50mm auf Trittschalldämmung 20mm, Rohdeckenbeschwerung 30mm'
      },
      en: {
        short: 'TBC + MA 50 + ballast',
        description: 'Timber beam ceiling with mastic asphalt screed 50mm and raw ceiling ballast',
        constructionDetails: 'Timber beams ≥ 160/220mm, mineral wool infill ≥ 140mm (40 kg/m³), chipboard ≥ 22mm, mastic asphalt screed 50mm on impact sound insulation 20mm, raw ceiling ballast 30mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gussasphaltestrich', material: 'Gussasphalt', thickness: 50, density: 2200, description: 'Gussasphaltestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 30, density: 1800, description: 'Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken ≥ 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Mastic asphalt screed', material: 'Mastic asphalt', thickness: 50, density: 2200, description: 'Mastic asphalt screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 30, density: 1800, description: 'Raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams ≥ 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.Gussasphalt]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 17, Zeile 1'
  },
  {
    id: 'T17.2',
    tableNumber: 17,
    rowNumber: 2,
    rw: 68,
    lnw: 49,
    mass: 180,
    thickness: 280,
    descriptions: {
      de: {
        short: 'HBD + GA 50 + leichtere Beschwerung',
        description: 'Holzbalkendecke mit Gussasphaltestrich 50mm und leichterer Rohdeckenbeschwerung',
        constructionDetails: 'Holzbalken ≥ 160/220mm, Ausfachung Mineralwolle ≥ 140mm (40 kg/m³), Spanplatte ≥ 22mm, Gussasphaltestrich 50mm auf Trittschalldämmung 20mm, reduzierte Rohdeckenbeschwerung 20mm'
      },
      en: {
        short: 'TBC + MA 50 + lighter ballast',
        description: 'Timber beam ceiling with mastic asphalt screed 50mm and lighter raw ceiling ballast',
        constructionDetails: 'Timber beams ≥ 160/220mm, mineral wool infill ≥ 140mm (40 kg/m³), chipboard ≥ 22mm, mastic asphalt screed 50mm on impact sound insulation 20mm, reduced raw ceiling ballast 20mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gussasphaltestrich', material: 'Gussasphalt', thickness: 50, density: 2200, description: 'Gussasphaltestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-4', name: 'Rohdeckenbeschwerung', material: 'Sand/Kies', thickness: 20, density: 1800, description: 'Reduzierte Rohdeckenbeschwerung' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken ≥ 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Mastic asphalt screed', material: 'Mastic asphalt', thickness: 50, density: 2200, description: 'Mastic asphalt screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-4', name: 'Raw ceiling ballast', material: 'Sand/Gravel', thickness: 20, density: 1800, description: 'Reduced raw ceiling ballast' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams ≥ 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.Gussasphalt]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 17, Zeile 2'
  }
];

export const DIN4109_TABLE_18_TIMBER_BEAM_RESILIENT_CHANNELS: DIN4109CeilingComponent[] = [
  {
    id: 'T18.1',
    tableNumber: 18,
    rowNumber: 1,
    rw: 63,
    lnw: 53,
    mass: 100,
    thickness: 280,
    descriptions: {
      de: {
        short: 'HBD + Lattung + GK',
        description: 'Holzbalkendecke mit Unterdecke an Lattung und Gipskarton',
        constructionDetails: 'Holzbalken ≥ 160/220mm, Ausfachung Mineralwolle ≥ 100mm (40 kg/m³), Lattung 30/50mm, Gipskartonplatte 12.5mm'
      },
      en: {
        short: 'TBC + Battens + PB',
        description: 'Timber beam ceiling with sub-ceiling on battens and plasterboard',
        constructionDetails: 'Timber beams ≥ 160/220mm, mineral wool infill ≥ 100mm (40 kg/m³), battens 30/50mm, plasterboard 12.5mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 750, description: 'Gipskartonplatte' },
        { id: 'layer-2', name: 'Lattung', material: 'Holz', thickness: 30, density: 500, description: 'Lattung 30/50mm' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-4', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken ≥ 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Plasterboard', material: 'Plasterboard', thickness: 12.5, density: 750, description: 'Plasterboard' },
        { id: 'layer-2', name: 'Battens', material: 'Timber', thickness: 30, density: 500, description: 'Battens 30/50mm' },
        { id: 'layer-3', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 100, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-4', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams ≥ 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithBattensGK],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.Gussasphalt]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 18, Zeile 1'
  }
];

export const DIN4109_TABLE_19_TIMBER_BEAM_SUSPENDED_CEILING: DIN4109CeilingComponent[] = [
  {
    id: 'T19.1',
    tableNumber: 19,
    rowNumber: 1,
    rw: 72,
    lnw: 45,
    mass: 120,
    thickness: 350,
    descriptions: {
      de: {
        short: 'HBD + abgehängte Decke + GK',
        description: 'Holzbalkendecke mit abgehängter Unterdecke und Gipskarton',
        constructionDetails: 'Holzbalken ≥ 160/220mm, Ausfachung Mineralwolle ≥ 100mm (40 kg/m³), abgehängte Decke (≥ 100mm), Gipskartonplatte 12.5mm'
      },
      en: {
        short: 'TBC + suspended ceiling + PB',
        description: 'Timber beam ceiling with suspended sub-ceiling and plasterboard',
        constructionDetails: 'Timber beams ≥ 160/220mm, mineral wool infill ≥ 100mm (40 kg/m³), suspended ceiling (≥ 100mm), plasterboard 12.5mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 750, description: 'Gipskartonplatte' },
        { id: 'layer-2', name: 'Luftschicht', material: 'Luft', thickness: 100, density: 1.2, description: 'Abgehängte Decke' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-4', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken ≥ 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Plasterboard', material: 'Plasterboard', thickness: 12.5, density: 750, description: 'Plasterboard' },
        { id: 'layer-2', name: 'Air gap', material: 'Air', thickness: 100, density: 1.2, description: 'Suspended ceiling' },
        { id: 'layer-3', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 100, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-4', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams ≥ 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithBattensGK],
      screedTypes: [ScreedType.DryScreed]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 19, Zeile 1'
  },
  {
    id: 'T19.2',
    tableNumber: 19,
    rowNumber: 2,
    rw: 75,
    lnw: 42,
    mass: 130,
    thickness: 350,
    descriptions: {
      de: {
        short: 'HBD + abgehängte Decke + 2xGK',
        description: 'Holzbalkendecke mit abgehängter Unterdecke und doppelter Gipskartonbeplankung',
        constructionDetails: 'Holzbalken ≥ 160/220mm, Ausfachung Mineralwolle ≥ 100mm (40 kg/m³), abgehängte Decke (≥ 100mm), 2x Gipskartonplatte 12.5mm'
      },
      en: {
        short: 'TBC + suspended ceiling + 2xPB',
        description: 'Timber beam ceiling with suspended sub-ceiling and double plasterboard cladding',
        constructionDetails: 'Timber beams ≥ 160/220mm, mineral wool infill ≥ 100mm (40 kg/m³), suspended ceiling (≥ 100mm), 2x plasterboard 12.5mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 25, density: 750, description: '2x Gipskartonplatte 12.5mm' },
        { id: 'layer-2', name: 'Luftschicht', material: 'Luft', thickness: 100, density: 1.2, description: 'Abgehängte Decke' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-4', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken ≥ 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Plasterboard', material: 'Plasterboard', thickness: 25, density: 750, description: '2x plasterboard 12.5mm' },
        { id: 'layer-2', name: 'Air gap', material: 'Air', thickness: 100, density: 1.2, description: 'Suspended ceiling' },
        { id: 'layer-3', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 100, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-4', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams ≥ 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithBattensGK],
      screedTypes: [ScreedType.DryScreed]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 19, Zeile 2'
  }
];

export const DIN4109_TABLE_20_TIMBER_BEAM_EXPOSED: DIN4109CeilingComponent[] = [
  {
    id: 'T20.1',
    tableNumber: 20,
    rowNumber: 1,
    rw: 55,
    lnw: 65,
    mass: 150,
    thickness: 220,
    descriptions: {
      de: {
        short: 'HBD sichtbar',
        description: 'Holzbalkendecke mit sichtbarer Balkenlage',
        constructionDetails: 'Sichtbare Holzbalkenlage ≥ 160/220mm, Dielenboden 28mm'
      },
      en: {
        short: 'TBC exposed',
        description: 'Timber beam ceiling with exposed beams',
        constructionDetails: 'Exposed timber beams ≥ 160/220mm, floorboards 28mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Dielenboden', material: 'Holz', thickness: 28, density: 500, description: 'Dielenboden' },
        { id: 'layer-2', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken ≥ 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Floorboards', material: 'Timber', thickness: 28, density: 500, description: 'Floorboards' },
        { id: 'layer-2', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams ≥ 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.CementOnMineralFiber]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 20, Zeile 1'
  }
];

export const DIN4109_TABLE_21_MASS_TIMBER_CEMENT_SCREED: DIN4109CeilingComponent[] = [
  {
    id: 'T21.1',
    tableNumber: 21,
    rowNumber: 1,
    rw: 78,
    lnw: 48,
    mass: 250,
    thickness: 220,
    descriptions: {
      de: {
        short: 'MHD + ZE 80',
        description: 'Massivholzdecke mit Zementestrich 80mm',
        constructionDetails: 'Massivholzdecke (BSP/DHV) ≥ 140mm (m\' ≥ 70 kg/m²), Zementestrich 80mm auf Trittschalldämmung 30mm'
      },
      en: {
        short: 'MTC + CS 80',
        description: 'Mass timber ceiling with cement screed 80mm',
        constructionDetails: 'Mass timber ceiling (CLT/DLT) ≥ 140mm (m\' ≥ 70 kg/m²), cement screed 80mm on impact sound insulation 30mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 80, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 30, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Massivholzdecke', material: 'Holz', thickness: 140, density: 500, description: 'Massivholzdecke (BSP/DHV) ≥ 140mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 80, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 30, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Mass timber ceiling', material: 'Timber', thickness: 140, density: 500, description: 'Mass timber ceiling (CLT/DLT) ≥ 140mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithCeilingGK, FloorConstructionType.TimberBeamWithCeiling2GK],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.Gussasphalt]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 21, Zeile 1'
  }
];

export const DIN4109_TABLE_22_MASS_TIMBER_DRY_SCREED: DIN4109CeilingComponent[] = [
  {
    id: 'T22.1',
    tableNumber: 22,
    rowNumber: 1,
    rw: 75,
    lnw: 51,
    mass: 180,
    thickness: 200,
    descriptions: {
      de: {
        short: 'MHD + TE',
        description: 'Massivholzdecke mit Trockenestrich',
        constructionDetails: 'Massivholzdecke (BSP/DHV) ≥ 140mm (m\' ≥ 70 kg/m²), Trockenestrich ≥ 25mm auf Trittschalldämmung 30mm'
      },
      en: {
        short: 'MTC + DS',
        description: 'Mass timber ceiling with dry screed',
        constructionDetails: 'Mass timber ceiling (CLT/DLT) ≥ 140mm (m\' ≥ 70 kg/m²), dry screed ≥ 25mm on impact sound insulation 30mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Trockenestrich', material: 'Trockenestrich', thickness: 25, density: 1200, description: 'Trockenestrich-Elemente' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 30, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Massivholzdecke', material: 'Holz', thickness: 140, density: 500, description: 'Massivholzdecke (BSP/DHV) ≥ 140mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Dry screed', material: 'Dry screed', thickness: 25, density: 1200, description: 'Dry screed elements' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 30, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Mass timber ceiling', material: 'Timber', thickness: 140, density: 500, description: 'Mass timber ceiling (CLT/DLT) ≥ 140mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithCeilingGK, FloorConstructionType.TimberBeamWithCeiling2GK],
      screedTypes: [ScreedType.DryScreed]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 22, Zeile 1'
  }
];

export const DIN4109_TABLE_23_MASS_TIMBER_MASTIC_ASPHALT: DIN4109CeilingComponent[] = [
  {
    id: 'T23.1',
    tableNumber: 23,
    rowNumber: 1,
    rw: 79,
    lnw: 47,
    mass: 270,
    thickness: 220,
    descriptions: {
      de: {
        short: 'MHD + GA 50',
        description: 'Massivholzdecke mit Gussasphaltestrich 50mm',
        constructionDetails: 'Massivholzdecke (BSP/DHV) ≥ 140mm (m\' ≥ 70 kg/m²), Gussasphaltestrich 50mm auf Trittschalldämmung 30mm'
      },
      en: {
        short: 'MTC + MA 50',
        description: 'Mass timber ceiling with mastic asphalt screed 50mm',
        constructionDetails: 'Mass timber ceiling (CLT/DLT) ≥ 140mm (m\' ≥ 70 kg/m²), mastic asphalt screed 50mm on impact sound insulation 30mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gussasphaltestrich', material: 'Gussasphalt', thickness: 50, density: 2200, description: 'Gussasphaltestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 30, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-3', name: 'Massivholzdecke', material: 'Holz', thickness: 140, density: 500, description: 'Massivholzdecke (BSP/DHV) ≥ 140mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Mastic asphalt screed', material: 'Mastic asphalt', thickness: 50, density: 2200, description: 'Mastic asphalt screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 30, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-3', name: 'Mass timber ceiling', material: 'Timber', thickness: 140, density: 500, description: 'Mass timber ceiling (CLT/DLT) ≥ 140mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamWithCeilingGK, FloorConstructionType.TimberBeamWithCeiling2GK],
      screedTypes: [ScreedType.DryScreed]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 23, Zeile 1'
  }
];

export const DIN4109_TABLE_24_MASS_TIMBER_SUSPENDED_CEILING: DIN4109CeilingComponent[] = [
  {
    id: 'T24.1',
    tableNumber: 24,
    rowNumber: 1,
    rw: 80,
    lnw: 45,
    mass: 150,
    thickness: 320,
    descriptions: {
      de: {
        short: 'MHD + abgehängte Decke + 2xGK',
        description: 'Massivholzdecke mit abgehängter Unterdecke und doppelter Gipskartonbeplankung',
        constructionDetails: 'Massivholzdecke (BSP/DHV) ≥ 140mm (m\' ≥ 70 kg/m²), abgehängte Decke (≥ 100mm), 2x Gipskartonplatte 12.5mm'
      },
      en: {
        short: 'MTC + suspended ceiling + 2xPB',
        description: 'Mass timber ceiling with suspended sub-ceiling and double plasterboard cladding',
        constructionDetails: 'Mass timber ceiling (CLT/DLT) ≥ 140mm (m\' ≥ 70 kg/m²), suspended ceiling (≥ 100mm), 2x plasterboard 12.5mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 25, density: 750, description: '2x Gipskartonplatte 12.5mm' },
        { id: 'layer-2', name: 'Luftschicht', material: 'Luft', thickness: 100, density: 1.2, description: 'Abgehängte Decke' },
        { id: 'layer-3', name: 'Massivholzdecke', material: 'Holz', thickness: 140, density: 500, description: 'Massivholzdecke (BSP/DHV) ≥ 140mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Plasterboard', material: 'Plasterboard', thickness: 25, density: 750, description: '2x plasterboard 12.5mm' },
        { id: 'layer-2', name: 'Air gap', material: 'Air', thickness: 100, density: 1.2, description: 'Suspended ceiling' },
        { id: 'layer-3', name: 'Mass timber ceiling', material: 'Timber', thickness: 140, density: 500, description: 'Mass timber ceiling (CLT/DLT) ≥ 140mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.MassTimberFloor],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.Gussasphalt]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 24, Zeile 1'
  }
];

export const DIN4109_TABLE_25_TIMBER_CONCRETE_COMPOSITE: DIN4109CeilingComponent[] = [
  {
    id: 'T25.1',
    tableNumber: 25,
    rowNumber: 1,
    rw: 82,
    lnw: 46,
    mass: 450,
    thickness: 260,
    descriptions: {
      de: {
        short: 'HBV-Decke',
        description: 'Holz-Beton-Verbunddecke',
        constructionDetails: 'Holz-Beton-Verbunddecke, Beton ≥ 100mm, Holzbalken ≥ 160mm'
      },
      en: {
        short: 'TCC floor',
        description: 'Timber-concrete composite floor',
        constructionDetails: 'Timber-concrete composite floor, concrete ≥ 100mm, timber beams ≥ 160mm'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Beton', material: 'Beton', thickness: 100, density: 2400, description: 'Betonschicht' },
        { id: 'layer-2', name: 'Holzbalken', material: 'Holz', thickness: 160, density: 500, description: 'Holzbalken' }
      ],
      en: [
        { id: 'layer-1', name: 'Concrete', material: 'Concrete', thickness: 100, density: 2400, description: 'Concrete layer' },
        { id: 'layer-2', name: 'Timber beams', material: 'Timber', thickness: 160, density: 500, description: 'Timber beams' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.MassTimberFloor],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.Gussasphalt]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 25, Zeile 1'
  }
];

export const DIN4109_TABLE_26_REINFORCED_CONCRETE: DIN4109CeilingComponent[] = [
  {
    id: 'T26.1',
    tableNumber: 26,
    rowNumber: 1,
    rw: 55,
    lnw: 75,
    mass: 350,
    thickness: 160,
    descriptions: {
      de: {
        short: 'Stahlbetondecke 160mm',
        description: 'Stahlbetondecke 160mm',
        constructionDetails: 'Stahlbetondecke, d = 160mm, m\' ≥ 350 kg/m²'
      },
      en: {
        short: 'Reinforced concrete 160mm',
        description: 'Reinforced concrete ceiling 160mm',
        constructionDetails: 'Reinforced concrete ceiling, d = 160mm, m\' ≥ 350 kg/m²'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Stahlbeton', material: 'Beton', thickness: 160, density: 2200, description: 'Stahlbetondecke' }
      ],
      en: [
        { id: 'layer-1', name: 'Reinforced concrete', material: 'Concrete', thickness: 160, density: 2200, description: 'Reinforced concrete ceiling' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.ReinforcedConcrete],
      screedTypes: []
    },
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 1'
  }
];

/**
 * Combined array of all DIN 4109 ceiling components
 */
export const DIN4109_CEILING_COMPONENTS: DIN4109CeilingComponent[] = [
  ...DIN4109_TABLE_15_TIMBER_BEAM_CEMENT_SCREED,
  ...DIN4109_TABLE_16_TIMBER_BEAM_DRY_SCREED,
  ...DIN4109_TABLE_17_TIMBER_BEAM_MASTIC_ASPHALT,
  ...DIN4109_TABLE_18_TIMBER_BEAM_RESILIENT_CHANNELS,
  ...DIN4109_TABLE_19_TIMBER_BEAM_SUSPENDED_CEILING,
  ...DIN4109_TABLE_20_TIMBER_BEAM_EXPOSED,
  ...DIN4109_TABLE_21_MASS_TIMBER_CEMENT_SCREED,
  ...DIN4109_TABLE_22_MASS_TIMBER_DRY_SCREED,
  ...DIN4109_TABLE_23_MASS_TIMBER_MASTIC_ASPHALT,
  ...DIN4109_TABLE_24_MASS_TIMBER_SUSPENDED_CEILING,
  ...DIN4109_TABLE_25_TIMBER_CONCRETE_COMPOSITE,
  ...DIN4109_TABLE_26_REINFORCED_CONCRETE
];

/**
 * Descriptions for each ceiling component table
 */
const ceilingTableDescriptions: Record<number, DIN4109TableDescription> = {
  15: { de: 'Holzbalkendecken mit mineralisch gebundenen Estrichen und Rohdeckenbeschwerung', en: 'Timber beam ceilings with mineral-bonded screeds and raw ceiling ballast' },
  16: { de: 'Holzbalkendecken mit Trockenestrichen und Rohdeckenbeschwerung', en: 'Timber beam ceilings with dry screeds and raw ceiling ballast' },
  17: { de: 'Holzbalkendecken mit Gussasphaltestrichen und Rohdeckenbeschwerung', en: 'Timber beam ceilings with mastic asphalt screeds and raw ceiling ballast' },
  18: { de: 'Holzbalkendecken mit Unterdecke an Lattung', en: 'Timber beam ceilings with sub-ceiling on battens' },
  19: { de: 'Holzbalkendecken mit abgehängter Unterdecke', en: 'Timber beam ceilings with suspended sub-ceiling' },
  20: { de: 'Holzbalkendecken ohne Unterdecke (Sichtbalkendecke)', en: 'Timber beam ceilings without sub-ceiling (exposed beams)' },
  21: { de: 'Massivholzdecken mit mineralisch gebundenen Estrichen', en: 'Mass timber ceilings with mineral-bonded screeds' },
  22: { de: 'Massivholzdecken mit Trockenestrichen', en: 'Mass timber ceilings with dry screeds' },
  23: { de: 'Massivholzdecken mit Gussasphaltestrichen', en: 'Mass timber ceilings with mastic asphalt screeds' },
  24: { de: 'Massivholzdecken mit abgehängter Unterdecke', en: 'Mass timber ceilings with suspended sub-ceiling' },
  25: { de: 'Holz-Beton-Verbunddecken', en: 'Timber-concrete composite floors' },
  26: { de: 'Stahlbetondecken', en: 'Reinforced concrete ceilings' }
};

/**
 * Get the description for a specific ceiling component table
 */
export function getCeilingTableDescription(tableNumber: number): DIN4109TableDescription | undefined {
  return ceilingTableDescriptions[tableNumber];
}
