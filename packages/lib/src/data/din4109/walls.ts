/**
 * DIN 4109-33 Wall Components Database
 * Based on DIN 4109-33:2016-07 - Tabellen 2-8 (Metal stud walls, timber frame walls, mass timber walls)
 * 
 * Data extracted from VBA legacy implementation and DIN 4109-33:2016-07 standard
 */

import { WallConstructionType, CladdingType } from '../../models/AcousticTypes';
import { DIN4109WallComponent, DIN4109TableDescription } from './types';

/**
 * Table 2: Metal stud walls (Metallständerwände)
 * CW = C-Wandständer (C-shaped wall studs)
 * MW = Mineralwolle (Mineral wool)
 * GP = Gipskartonplatte (Gypsum board)
 */
export const DIN4109_TABLE_2_METAL_STUD_WALLS: DIN4109WallComponent[] = [
  {
    id: 'T2.1',
    tableNumber: 2,
    rowNumber: 1,
    rw: 41,
    mass: 25,
    thickness: 75,
    descriptions: {
      de: {
        short: 'CW 50 + MW 40 + 1×GP 12,5',
        description: 'Metallständerwand CW 50 mit Mineralwolle 40 kg/m³ und einfacher Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 50mm, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'CW 50 + MW 40 + 1×GB 12.5',
        description: 'Metal stud wall CW 50 with mineral wool 40 kg/m³ and single gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 50mm, mineral wool insulation 40 kg/m³, gypsum board 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 50, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 50, density: 7800, description: 'C-Wandständer CW 50' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 50, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 50, density: 7800, description: 'C-shaped wall studs CW 50' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 1'
  },
  {
    id: 'T2.2',
    tableNumber: 2,
    rowNumber: 2,
    rw: 42,
    mass: 27,
    thickness: 100,
    descriptions: {
      de: {
        short: 'CW 75 + MW 60 + 1×GP 12,5',
        description: 'Metallständerwand CW 75 mit Mineralwolle 60 kg/m³ und einfacher Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 75mm, Mineralwolldämmung 60 kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'CW 75 + MW 60 + 1×GB 12.5',
        description: 'Metal stud wall CW 75 with mineral wool 60 kg/m³ and single gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 75mm, mineral wool insulation 60 kg/m³, gypsum board 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 75, density: 60, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 75, density: 7800, description: 'C-Wandständer CW 75' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 75, density: 60, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 75, density: 7800, description: 'C-shaped wall studs CW 75' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 2'
  },
  {
    id: 'T2.3',
    tableNumber: 2,
    rowNumber: 3,
    rw: 43,
    mass: 29,
    thickness: 125,
    descriptions: {
      de: {
        short: 'CW 100 + MW 40 + 1×GP 12,5',
        description: 'Metallständerwand CW 100 mit Mineralwolle 40 kg/m³ und einfacher Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 100mm, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'CW 100 + MW 40 + 1×GB 12.5',
        description: 'Metal stud wall CW 100 with mineral wool 40 kg/m³ and single gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 100mm, mineral wool insulation 40 kg/m³, gypsum board 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 3'
  },
  {
    id: 'T2.4',
    tableNumber: 2,
    rowNumber: 4,
    rw: 44,
    mass: 31,
    thickness: 125,
    descriptions: {
      de: {
        short: 'CW 100 + MW 60 + 1×GP 12,5',
        description: 'Metallständerwand CW 100 mit Mineralwolle 60 kg/m³ und einfacher Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 100mm, Mineralwolldämmung 60 kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'CW 100 + MW 60 + 1×GB 12.5',
        description: 'Metal stud wall CW 100 with mineral wool 60 kg/m³ and single gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 100mm, mineral wool insulation 60 kg/m³, gypsum board 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 60, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 60, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 4'
  },
  {
    id: 'T2.5',
    tableNumber: 2,
    rowNumber: 5,
    rw: 45,
    mass: 33,
    thickness: 125,
    descriptions: {
      de: {
        short: 'CW 100 + MW 80 + 1×GP 12,5',
        description: 'Metallständerwand CW 100 mit Mineralwolle 80 kg/m³ und einfacher Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 100mm, Mineralwolldämmung 80 kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'CW 100 + MW 80 + 1×GB 12.5',
        description: 'Metal stud wall CW 100 with mineral wool 80 kg/m³ and single gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 100mm, mineral wool insulation 80 kg/m³, gypsum board 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 80, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 80, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 5'
  },
  {
    id: 'T2.6',
    tableNumber: 2,
    rowNumber: 6,
    rw: 48,
    mass: 50,
    thickness: 75,
    descriptions: {
      de: {
        short: 'CW 50 + MW 40 + 2×GP 12,5',
        description: 'Metallständerwand CW 50 mit Mineralwolle 40 kg/m³ und doppelter Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 50mm, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'CW 50 + MW 40 + 2×GB 12.5',
        description: 'Metal stud wall CW 50 with mineral wool 40 kg/m³ and double gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 50mm, mineral wool insulation 40 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 50, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 50, density: 7800, description: 'C-Wandständer CW 50' },
        { id: 'layer-5', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-6', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 50, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 50, density: 7800, description: 'C-shaped wall studs CW 50' },
        { id: 'layer-5', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-6', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 6'
  },
  {
    id: 'T2.7',
    tableNumber: 2,
    rowNumber: 7,
    rw: 48,
    mass: 52,
    thickness: 100,
    descriptions: {
      de: {
        short: 'CW 75 + MW 40 + 2×GP 12,5',
        description: 'Metallständerwand CW 75 mit Mineralwolle 40 kg/m³ und doppelter Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 75mm, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'CW 75 + MW 40 + 2×GB 12.5',
        description: 'Metal stud wall CW 75 with mineral wool 40 kg/m³ and double gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 75mm, mineral wool insulation 40 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 75, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 75, density: 7800, description: 'C-Wandständer CW 75' },
        { id: 'layer-5', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-6', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 75, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 75, density: 7800, description: 'C-shaped wall studs CW 75' },
        { id: 'layer-5', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-6', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 7'
  },
  {
    id: 'T2.8',
    tableNumber: 2,
    rowNumber: 8,
    rw: 51,
    mass: 54,
    thickness: 100,
    descriptions: {
      de: {
        short: 'CW 75 + MW 60 + 2×GP 12,5',
        description: 'Metallständerwand CW 75 mit Mineralwolle 60 kg/m³ und doppelter Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 75mm, Mineralwolldämmung 60 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'CW 75 + MW 60 + 2×GB 12.5',
        description: 'Metal stud wall CW 75 with mineral wool 60 kg/m³ and double gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 75mm, mineral wool insulation 60 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 75, density: 60, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 75, density: 7800, description: 'C-Wandständer CW 75' },
        { id: 'layer-5', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-6', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 75, density: 60, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 75, density: 7800, description: 'C-shaped wall studs CW 75' },
        { id: 'layer-5', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-6', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 8'
  },
  {
    id: 'T2.9',
    tableNumber: 2,
    rowNumber: 9,
    rw: 49,
    mass: 54,
    thickness: 125,
    descriptions: {
      de: {
        short: 'CW 100 + MW 40 + 2×GP 12,5',
        description: 'Metallständerwand CW 100 mit Mineralwolle 40 kg/m³ und doppelter Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 100mm, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'CW 100 + MW 40 + 2×GB 12.5',
        description: 'Metal stud wall CW 100 with mineral wool 40 kg/m³ and double gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 100mm, mineral wool insulation 40 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-5', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-6', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-5', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-6', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 9'
  },
  {
    id: 'T2.10',
    tableNumber: 2,
    rowNumber: 10,
    rw: 51,
    mass: 56,
    thickness: 125,
    descriptions: {
      de: {
        short: 'CW 100 + MW 60 + 2×GP 12,5',
        description: 'Metallständerwand CW 100 mit Mineralwolle 60 kg/m³ und doppelter Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 100mm, Mineralwolldämmung 60 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'CW 100 + MW 60 + 2×GB 12.5',
        description: 'Metal stud wall CW 100 with mineral wool 60 kg/m³ and double gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 100mm, mineral wool insulation 60 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 60, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 60, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 10'
  },
  {
    id: 'T2.11',
    tableNumber: 2,
    rowNumber: 11,
    rw: 52,
    mass: 58,
    thickness: 125,
    descriptions: {
      de: {
        short: 'CW 100 + MW 80 + 2×GP 12,5',
        description: 'Metallständerwand CW 100 mit Mineralwolle 80 kg/m³ und doppelter Gipskartonbeplankung',
        constructionDetails: 'C-Wandständer CW 100mm, Mineralwolldämmung 80 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'CW 100 + MW 80 + 2×GB 12.5',
        description: 'Metal stud wall CW 100 with mineral wool 80 kg/m³ and double gypsum board cladding',
        constructionDetails: 'C-shaped wall studs CW 100mm, mineral wool insulation 80 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 80, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 80, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStud],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 11'
  },
  {
    id: 'T2.12',
    tableNumber: 2,
    rowNumber: 12,
    rw: 60,
    mass: 120,
    thickness: 125,
    descriptions: {
      de: {
        short: 'Doppelständer CW 50+50 + MW 40 + 2×GP 12,5 + Hohlraum 5mm',
        description: 'Doppelständer-Metallständerwand mit 5mm Hohlraum zwischen den Ständerprofilen',
        constructionDetails: 'Doppelständer CW 50+50mm mit 5mm Hohlraum, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'Double stud CW 50+50 + MW 40 + 2×GB 12.5 + 5mm cavity',
        description: 'Double stud metal wall with 5mm cavity between stud profiles',
        constructionDetails: 'Double stud CW 50+50mm with 5mm cavity, mineral wool insulation 40 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 50, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 50, density: 7800, description: 'C-Wandständer CW 50' },
        { id: 'layer-5', name: 'Hohlraum', material: 'Luft', thickness: 5, density: 1.2, description: 'Hohlraum zwischen Doppelständern' },
        { id: 'layer-6', name: 'CW-Ständer', material: 'Stahl', thickness: 50, density: 7800, description: 'C-Wandständer CW 50' },
        { id: 'layer-7', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 50, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-8', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-9', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 50, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 50, density: 7800, description: 'C-shaped wall studs CW 50' },
        { id: 'layer-5', name: 'Air cavity', material: 'Air', thickness: 5, density: 1.2, description: 'Air cavity between double studs' },
        { id: 'layer-6', name: 'CW studs', material: 'Steel', thickness: 50, density: 7800, description: 'C-shaped wall studs CW 50' },
        { id: 'layer-7', name: 'Mineral wool', material: 'Mineral wool', thickness: 50, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-8', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-9', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStudDouble],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 12'
  },
  {
    id: 'T2.13',
    tableNumber: 2,
    rowNumber: 13,
    rw: 61,
    mass: 136,
    thickness: 225,
    descriptions: {
      de: {
        short: 'Doppelständer CW 100+100 + MW 80 + 2×GP 12,5 + Hohlraum 5mm',
        description: 'Doppelständer-Metallständerwand mit 5mm Hohlraum zwischen den Ständerprofilen',
        constructionDetails: 'Doppelständer CW 100+100mm mit 5mm Hohlraum, Mineralwolldämmung 80 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'Double stud CW 100+100 + MW 80 + 2×GB 12.5 + 5mm cavity',
        description: 'Double stud metal wall with 5mm cavity between stud profiles',
        constructionDetails: 'Double stud CW 100+100mm with 5mm cavity, mineral wool insulation 80 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 80, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-5', name: 'Hohlraum', material: 'Luft', thickness: 5, density: 1.2, description: 'Hohlraum zwischen Doppelständern' },
        { id: 'layer-6', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-7', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 80, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-8', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-9', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 80, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-5', name: 'Air cavity', material: 'Air', thickness: 5, density: 1.2, description: 'Air cavity between double studs' },
        { id: 'layer-6', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-7', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 80, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-8', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-9', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MetalStudDouble],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 2, Zeile 13'
  }
];

/**
 * Table 3: Interior walls in timber frame construction without installation layer
 */
export const DIN4109_TABLE_3_TIMBER_FRAME_NO_INSTALLATION: DIN4109WallComponent[] = [
  {
    id: 'T3.1',
    tableNumber: 3,
    rowNumber: 1,
    rw: 45,
    mass: 40,
    thickness: 125,
    descriptions: {
      de: {
        short: 'HSW 100 + MW 40 + 1xGP 12,5',
        description: 'Holzständerwand 100mm mit Mineralwolle 40kg/m³ und einfacher Gipskartonbeplankung',
        constructionDetails: 'Holzständer 100mm, Mineralwolldämmung 40kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'TFW 100 + MW 40 + 1xGB 12.5',
        description: 'Timber frame wall 100mm with mineral wool 40kg/m³ and single gypsum board cladding',
        constructionDetails: 'Timber frame 100mm, mineral wool insulation 40kg/m³, gypsum board 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 40, description: 'Mineralwolldämmung zwischen Holzständern' },
        { id: 'layer-3', name: 'Holzständer', material: 'Holz', thickness: 100, density: 500, description: 'Holzständer 100mm' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 40, description: 'Mineral wool insulation between timber frames' },
        { id: 'layer-3', name: 'Timber frame', material: 'Timber', thickness: 100, density: 500, description: 'Timber frame 100mm' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.TimberFrame],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 3, Zeile 1'
  }
];

/**
 * Table 4: Interior walls in timber frame construction with installation layer
 */
export const DIN4109_TABLE_4_TIMBER_FRAME_WITH_INSTALLATION: DIN4109WallComponent[] = [
  {
    id: 'T4.1',
    tableNumber: 4,
    rowNumber: 1,
    rw: 54,
    mass: 65,
    thickness: 175,
    descriptions: {
      de: {
        short: 'HSW 100 + MW 40 + 1xGP 12,5 + Inst.-Ebene 50mm',
        description: 'Holzständerwand 100mm mit Mineralwolle 40kg/m³ und einfacher Gipskartonbeplankung, mit 50mm Installationsebene',
        constructionDetails: 'Holzständer 100mm, Mineralwolldämmung 40kg/m³, Gipskartonplatte 12,5mm beidseitig, raumseitig 50mm Installationsebene mit 12,5mm Gipskartonplatte'
      },
      en: {
        short: 'TFW 100 + MW 40 + 1xGB 12.5 + Inst. Layer 50mm',
        description: 'Timber frame wall 100mm with mineral wool 40kg/m³ and single gypsum board cladding, with 50mm installation layer',
        constructionDetails: 'Timber frame 100mm, mineral wool insulation 40kg/m³, gypsum board 12.5mm both sides, room-side 50mm installation layer with 12.5mm gypsum board'
      }
    },
    layers: { de: [], en: [] },
    applicableFor: {
      wallTypes: [WallConstructionType.TimberFrame],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 4, Zeile 1'
  }
];

/**
 * Table 5: Building separation walls in timber frame construction
 */
export const DIN4109_TABLE_5_TIMBER_FRAME_SEPARATION_WALLS: DIN4109WallComponent[] = [
    {
    id: 'T5.1',
    tableNumber: 5,
    rowNumber: 1,
    rw: 70,
    mass: 120,
    thickness: 270,
    descriptions: {
      de: {
        short: 'Doppel-HSW 100 + MW 40 + 2xGP 12,5 + 50mm Hohlraum',
        description: 'Doppelte Holzständerwand 100mm mit Mineralwolle 40kg/m³ und doppelter Gipskartonbeplankung, mit 50mm Hohlraum',
        constructionDetails: '2x Holzständerwand (100mm Ständer, MW 40kg/m³, 2x12,5mm GP), 50mm Hohlraum dazwischen'
      },
      en: {
        short: 'Double TFW 100 + MW 40 + 2xGB 12.5 + 50mm cavity',
        description: 'Double timber frame wall 100mm with mineral wool 40kg/m³ and double gypsum board cladding, with 50mm cavity',
        constructionDetails: '2x Timber frame wall (100mm studs, MW 40kg/m³, 2x12.5mm GB), 50mm cavity in between'
      }
    },
    layers: { de: [], en: [] },
    applicableFor: {
      wallTypes: [WallConstructionType.TimberFrame],
      claddingTypes: [CladdingType.DoubleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 5, Zeile 1'
  }
];

/**
 * Table 6: Exterior walls in timber frame construction without room-side installation layer
 */
export const DIN4109_TABLE_6_TIMBER_FRAME_EXTERIOR_NO_INSTALLATION: DIN4109WallComponent[] = [
  {
    id: 'T6.1',
    tableNumber: 6,
    rowNumber: 1,
    rw: 48,
    mass: 50,
    thickness: 188,
    descriptions: {
      de: {
        short: 'HSW 160 + MW 40 + 1xGP 12,5 + Holzfassade',
        description: 'Holzständer-Außenwand 160mm mit Mineralwolle 40kg/m³, raumseitig 1x12,5mm GP, außenseitig Holzfassade',
        constructionDetails: 'Holzständer 160mm, MW 40kg/m³, raumseitig 12,5mm GP, außenseitig 16mm Holzwerkstoffplatte und Holzfassade'
      },
      en: {
        short: 'TFW 160 + MW 40 + 1xGB 12.5 + Timber facade',
        description: 'Timber frame exterior wall 160mm with mineral wool 40kg/m³, room-side 1x12.5mm GB, exterior timber facade',
        constructionDetails: 'Timber frame 160mm, MW 40kg/m³, room-side 12.5mm GB, exterior 16mm wood-based panel and timber facade'
      }
    },
    layers: { de: [], en: [] },
    applicableFor: {
      wallTypes: [WallConstructionType.TimberFrame],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 6, Zeile 1'
  }
];

/**
 * Table 7: Exterior walls in timber frame construction with room-side installation layer
 */
export const DIN4109_TABLE_7_TIMBER_FRAME_EXTERIOR_WITH_INSTALLATION: DIN4109WallComponent[] = [
    {
    id: 'T7.1',
    tableNumber: 7,
    rowNumber: 1,
    rw: 52,
    mass: 65,
    thickness: 238,
    descriptions: {
      de: {
        short: 'HSW 160 + MW 40 + Inst.-Ebene 50mm + 1xGP 12,5 + Holzfassade',
        description: 'Holzständer-Außenwand 160mm mit 50mm Installationsebene, raumseitig 1x12,5mm GP, außenseitig Holzfassade',
        constructionDetails: 'Holzständer 160mm, MW 40kg/m³, raumseitig 50mm Installationsebene mit 12,5mm GP, außenseitig 16mm Holzwerkstoffplatte und Holzfassade'
      },
      en: {
        short: 'TFW 160 + MW 40 + Inst. Layer 50mm + 1xGB 12.5 + Timber facade',
        description: 'Timber frame exterior wall 160mm with 50mm installation layer, room-side 1x12.5mm GB, exterior timber facade',
        constructionDetails: 'Timber frame 160mm, MW 40kg/m³, room-side 50mm installation layer with 12.5mm GB, exterior 16mm wood-based panel and timber facade'
      }
    },
    layers: { de: [], en: [] },
    applicableFor: {
      wallTypes: [WallConstructionType.TimberFrame],
      claddingTypes: [CladdingType.SingleGypsum]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 7, Zeile 1'
  }
];

/**
 * Table 8: Mass timber walls (Massivholzwände)
 */
export const DIN4109_TABLE_8_MASS_TIMBER_WALLS: DIN4109WallComponent[] = [
  {
    id: 'T8.1',
    tableNumber: 8,
    rowNumber: 1,
    rw: 35,
    mass: 50,
    thickness: 100,
    descriptions: {
      de: {
        short: 'MHW 100',
        description: 'Massivholzwand 100mm',
        constructionDetails: 'Massivholzwand (BSP, MHM, etc.), d=100mm, m\' ≥ 50 kg/m²'
      },
      en: {
        short: 'MTW 100',
        description: 'Mass timber wall 100mm',
        constructionDetails: 'Mass timber wall (CLT, MHM, etc.), d=100mm, m\' ≥ 50 kg/m²'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Massivholz', material: 'Holz', thickness: 100, density: 500, description: 'Massivholzwand' }
      ],
      en: [
        { id: 'layer-1', name: 'Mass timber', material: 'Timber', thickness: 100, density: 500, description: 'Mass timber wall' }
      ]
    },
    applicableFor: {
      wallTypes: [WallConstructionType.MassTimberWall],
      claddingTypes: [CladdingType.MassTimber]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 8, Zeile 1'
  }
];

/**
 * All wall components from DIN 4109-33 tables
 */
export const DIN4109_WALL_COMPONENTS: DIN4109WallComponent[] = [
  ...DIN4109_TABLE_2_METAL_STUD_WALLS,
  ...DIN4109_TABLE_3_TIMBER_FRAME_NO_INSTALLATION,
  ...DIN4109_TABLE_4_TIMBER_FRAME_WITH_INSTALLATION,
  ...DIN4109_TABLE_5_TIMBER_FRAME_SEPARATION_WALLS,
  ...DIN4109_TABLE_6_TIMBER_FRAME_EXTERIOR_NO_INSTALLATION,
  ...DIN4109_TABLE_7_TIMBER_FRAME_EXTERIOR_WITH_INSTALLATION,
  ...DIN4109_TABLE_8_MASS_TIMBER_WALLS
];

/**
 * Get table description by table number with multilingual support
 */
export function getWallTableDescription(tableNumber: number): DIN4109TableDescription | null {
  const descriptions: Record<number, DIN4109TableDescription> = {
    2: {
      de: 'Metallständerwände',
      en: 'Metal stud walls'
    },
    3: {
      de: 'Innenwände in Holzrahmenbauweise ohne Installationsebene',
      en: 'Interior walls in timber frame construction without installation layer'
    },
    4: {
      de: 'Innenwände in Holzrahmenbauweise mit Installationsebene', 
      en: 'Interior walls in timber frame construction with installation layer'
    },
    5: {
      de: 'Gebäudetrennwände in Holzrahmenbauweise',
      en: 'Building separation walls in timber frame construction'
    },
    6: {
      de: 'Außenwände in Holzrahmenbauweise ohne raumseitige Installationsebene',
      en: 'Exterior walls in timber frame construction without room-side installation layer'
    },
    7: {
      de: 'Außenwände in Holzrahmenbauweise mit raumseitige Installationsebene',
      en: 'Exterior walls in timber frame construction with room-side installation layer'
    },
    8: {
      de: 'Massivholzwände',
      en: 'Mass timber walls'
    }
  };
  return descriptions[tableNumber] || null;
}
