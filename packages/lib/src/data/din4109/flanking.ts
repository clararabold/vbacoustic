/**
 * DIN 4109-33 Flanking Components Database
 * Based on DIN 4109-33:2016-07 - Tabellen 26-36 (Flanking elements for sound transmission calculations)
 * 
 * Data extracted from VBA legacy implementation and DIN 4109-33:2016-07 standard
 */

import { DIN4109FlankingComponent } from './types';

/**
 * Table 26: Flanking metal stud walls (Flankierende Metallständerwände)
 */
export const DIN4109_TABLE_26_FLANKING_METAL_STUD: DIN4109FlankingComponent[] = [
  {
    id: 'T26.1',
    tableNumber: 26,
    rowNumber: 1,
    dnfw: 53,
    flankingType: 'metal-stud',
    mass: 25,
    thickness: 75,
    descriptions: {
      de: {
        short: 'MSW 50 + 1×GK',
        description: 'Metallständerwand 50mm mit einfacher Beplankung',
        constructionDetails: 'Metallständer CW 50, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'SSW 50 + 1×GB',
        description: 'Steel stud wall 50mm with single board layer',
        constructionDetails: 'Steel studs CW 50, mineral wool insulation 40 kg/m³, gypsum board 12.5mm both sides'
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
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 1'
  },
  {
    id: 'T26.2',
    tableNumber: 26,
    rowNumber: 2,
    dnfw: 56,
    flankingType: 'metal-stud',
    mass: 50,
    thickness: 75,
    descriptions: {
      de: {
        short: 'MSW 50 + 2×GK',
        description: 'Metallständerwand 50mm mit doppelter Beplankung',
        constructionDetails: 'Metallständer CW 50, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'SSW 50 + 2×GB',
        description: 'Steel stud wall 50mm with double board layer',
        constructionDetails: 'Steel studs CW 50, mineral wool insulation 40 kg/m³, gypsum board 2× 12.5mm both sides'
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
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 2'
  },
  {
    id: 'T26.3',
    tableNumber: 26,
    rowNumber: 3,
    dnfw: 55,
    flankingType: 'metal-stud',
    mass: 33,
    thickness: 125,
    descriptions: {
      de: {
        short: 'MSW 100 + MW 80 + 1×GK',
        description: 'Metallständerwand 100mm mit Mineralwolle 80 kg/m³ und einfacher Beplankung',
        constructionDetails: 'Metallständer CW 100, Mineralwolldämmung 80 kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'SSW 100 + MW 80 + 1×GB',
        description: 'Steel stud wall 100mm with mineral wool 80 kg/m³ and single board layer',
        constructionDetails: 'Steel studs CW 100, mineral wool insulation 80 kg/m³, gypsum board 12.5mm both sides'
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
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 3'
  },
  {
    id: 'T26.4',
    tableNumber: 26,
    rowNumber: 4,
    dnfw: 59,
    flankingType: 'metal-stud',
    mass: 58,
    thickness: 125,
    descriptions: {
      de: {
        short: 'MSW 100 + MW 80 + 2×GK',
        description: 'Metallständerwand 100mm mit Mineralwolle 80 kg/m³ und doppelter Beplankung',
        constructionDetails: 'Metallständer CW 100, Mineralwolldämmung 80 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig'
      },
      en: {
        short: 'SSW 100 + MW 80 + 2×GB',
        description: 'Steel stud wall 100mm with mineral wool 80 kg/m³ and double board layer',
        constructionDetails: 'Steel studs CW 100, mineral wool insulation 80 kg/m³, gypsum board 2× 12.5mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 80, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-5', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage' },
        { id: 'layer-6', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 80, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-5', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer' },
        { id: 'layer-6', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 4'
  },
  {
    id: 'T26.5',
    tableNumber: 26,
    rowNumber: 5,
    dnfw: 57,
    flankingType: 'metal-stud-separated',
    mass: 25,
    thickness: 75,
    descriptions: {
      de: {
        short: 'MSW 50 + 1×GK getrennt',
        description: 'Metallständerwand 50mm mit einfacher Beplankung, getrennte Befestigung',
        constructionDetails: 'Metallständer CW 50, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 12,5mm beidseitig, getrennte Befestigung der Beplankung'
      },
      en: {
        short: 'SSW 50 + 1×GB separated',
        description: 'Steel stud wall 50mm with single board layer, separated fastening',
        constructionDetails: 'Steel studs CW 50, mineral wool insulation 40 kg/m³, gypsum board 12.5mm both sides, separated fastening of boards'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm getrennt befestigt' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 50, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 50, density: 7800, description: 'C-Wandständer CW 50' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm getrennt befestigt' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm separately fastened' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 50, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 50, density: 7800, description: 'C-shaped wall studs CW 50' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm separately fastened' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 5'
  },
  {
    id: 'T26.6',
    tableNumber: 26,
    rowNumber: 6,
    dnfw: 60,
    flankingType: 'metal-stud-separated',
    mass: 50,
    thickness: 75,
    descriptions: {
      de: {
        short: 'MSW 50 + 2×GK getrennt',
        description: 'Metallständerwand 50mm mit doppelter Beplankung, getrennte Befestigung',
        constructionDetails: 'Metallständer CW 50, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig, getrennte Befestigung der Beplankung'
      },
      en: {
        short: 'SSW 50 + 2×GB separated',
        description: 'Steel stud wall 50mm with double board layer, separated fastening',
        constructionDetails: 'Steel studs CW 50, mineral wool insulation 40 kg/m³, gypsum board 2× 12.5mm both sides, separated fastening of boards'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage getrennt befestigt' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage getrennt befestigt' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 50, density: 40, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 50, density: 7800, description: 'C-Wandständer CW 50' },
        { id: 'layer-5', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage getrennt befestigt' },
        { id: 'layer-6', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage getrennt befestigt' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer separately fastened' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer separately fastened' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 50, density: 40, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 50, density: 7800, description: 'C-shaped wall studs CW 50' },
        { id: 'layer-5', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer separately fastened' },
        { id: 'layer-6', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer separately fastened' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 6'
  },
  {
    id: 'T26.7',
    tableNumber: 26,
    rowNumber: 7,
    dnfw: 59,
    flankingType: 'metal-stud-separated',
    mass: 33,
    thickness: 125,
    descriptions: {
      de: {
        short: 'MSW 100 + MW 80 + 1×GK getrennt',
        description: 'Metallständerwand 100mm mit Mineralwolle 80 kg/m³ und einfacher Beplankung, getrennte Befestigung',
        constructionDetails: 'Metallständer CW 100, Mineralwolldämmung 80 kg/m³, Gipskartonplatte 12,5mm beidseitig, getrennte Befestigung der Beplankung'
      },
      en: {
        short: 'SSW 100 + MW 80 + 1×GB separated',
        description: 'Steel stud wall 100mm with mineral wool 80 kg/m³ and single board layer, separated fastening',
        constructionDetails: 'Steel studs CW 100, mineral wool insulation 80 kg/m³, gypsum board 12.5mm both sides, separated fastening of boards'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm getrennt befestigt' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 80, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-4', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm getrennt befestigt' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm separately fastened' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 80, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-4', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm separately fastened' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 7'
  },
  {
    id: 'T26.8',
    tableNumber: 26,
    rowNumber: 8,
    dnfw: 61,
    flankingType: 'metal-stud-separated',
    mass: 58,
    thickness: 125,
    descriptions: {
      de: {
        short: 'MSW 100 + MW 80 + 2×GK getrennt',
        description: 'Metallständerwand 100mm mit Mineralwolle 80 kg/m³ und doppelter Beplankung, getrennte Befestigung',
        constructionDetails: 'Metallständer CW 100, Mineralwolldämmung 80 kg/m³, Gipskartonplatte 2× 12,5mm beidseitig, getrennte Befestigung der Beplankung'
      },
      en: {
        short: 'SSW 100 + MW 80 + 2×GB separated',
        description: 'Steel stud wall 100mm with mineral wool 80 kg/m³ and double board layer, separated fastening',
        constructionDetails: 'Steel studs CW 100, mineral wool insulation 80 kg/m³, gypsum board 2× 12.5mm both sides, separated fastening of boards'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage getrennt befestigt' },
        { id: 'layer-2', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage getrennt befestigt' },
        { id: 'layer-3', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 80, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-4', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-5', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm innere Lage getrennt befestigt' },
        { id: 'layer-6', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm äußere Lage getrennt befestigt' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer separately fastened' },
        { id: 'layer-2', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer separately fastened' },
        { id: 'layer-3', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 80, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-4', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-5', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm inner layer separately fastened' },
        { id: 'layer-6', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm outer layer separately fastened' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 8'
  },
  {
    id: 'T26.9',
    tableNumber: 26,
    rowNumber: 9,
    dnfw: 65,
    flankingType: 'metal-stud-corner-profile',
    mass: 33,
    thickness: 125,
    descriptions: {
      de: {
        short: 'MSW 100 + MW 80 + 1×GK + Inneneckprofil',
        description: 'Metallständerwand 100mm mit Mineralwolle 80 kg/m³, einfacher Beplankung und Inneneckprofil',
        constructionDetails: 'Metallständer CW 100, Mineralwolldämmung 80 kg/m³, Gipskartonplatte 12,5mm beidseitig, Inneneckprofil zur Entkopplung'
      },
      en: {
        short: 'SSW 100 + MW 80 + 1×GB + corner profile',
        description: 'Steel stud wall 100mm with mineral wool 80 kg/m³, single board layer and internal corner profile',
        constructionDetails: 'Steel studs CW 100, mineral wool insulation 80 kg/m³, gypsum board 12.5mm both sides, internal corner profile for decoupling'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm mit Inneneckprofil' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 100, density: 80, description: 'Mineralwolldämmung zwischen CW-Ständern' },
        { id: 'layer-3', name: 'CW-Ständer', material: 'Stahl', thickness: 100, density: 7800, description: 'C-Wandständer CW 100' },
        { id: 'layer-4', name: 'Inneneckprofil', material: 'Stahl', thickness: 2, density: 7800, description: 'Inneneckprofil zur Entkopplung' },
        { id: 'layer-5', name: 'Gipskartonplatte', material: 'Gipskarton', thickness: 12.5, density: 900, description: 'Gipskartonplatte 12,5mm mit Inneneckprofil' }
      ],
      en: [
        { id: 'layer-1', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm with corner profile' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 100, density: 80, description: 'Mineral wool insulation between CW studs' },
        { id: 'layer-3', name: 'CW studs', material: 'Steel', thickness: 100, density: 7800, description: 'C-shaped wall studs CW 100' },
        { id: 'layer-4', name: 'Corner profile', material: 'Steel', thickness: 2, density: 7800, description: 'Internal corner profile for decoupling' },
        { id: 'layer-5', name: 'Gypsum board', material: 'Gypsum', thickness: 12.5, density: 900, description: 'Gypsum board 12.5mm with corner profile' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 26, Zeile 9'
  }
];

/**
 * Table 27: Flanking timber stud walls (Flankierende Holzständerwände)
 */
export const DIN4109_TABLE_27_FLANKING_TIMBER_STUD: DIN4109FlankingComponent[] = [
  {
    id: 'T27.1',
    tableNumber: 27,
    rowNumber: 1,
    dnfw: 53,
    flankingType: 'timber-stud',
    mass: 65,
    thickness: 186,
    descriptions: {
      de: {
        short: 'HSW 160 + MW 160 + OSB 13',
        description: 'Holzständerwand 160mm mit Mineralwolle 160 kg/m³ und OSB-Beplankung 13mm',
        constructionDetails: 'Holzständer 160mm, Mineralwolldämmung 160 kg/m³, OSB-Platte 13mm beidseitig'
      },
      en: {
        short: 'TSW 160 + MW 160 + OSB 13',
        description: 'Timber stud wall 160mm with mineral wool 160 kg/m³ and OSB cladding 13mm',
        constructionDetails: 'Timber studs 160mm, mineral wool insulation 160 kg/m³, OSB board 13mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'OSB-Platte', material: 'OSB', thickness: 13, density: 650, description: 'OSB-Platte 13mm' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 160, density: 160, description: 'Mineralwolldämmung zwischen Holzständern' },
        { id: 'layer-3', name: 'Holzständer', material: 'Holz', thickness: 160, density: 500, description: 'Holzständer 160mm' },
        { id: 'layer-4', name: 'OSB-Platte', material: 'OSB', thickness: 13, density: 650, description: 'OSB-Platte 13mm' }
      ],
      en: [
        { id: 'layer-1', name: 'OSB board', material: 'OSB', thickness: 13, density: 650, description: 'OSB board 13mm' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 160, density: 160, description: 'Mineral wool insulation between timber studs' },
        { id: 'layer-3', name: 'Timber studs', material: 'Timber', thickness: 160, density: 500, description: 'Timber studs 160mm' },
        { id: 'layer-4', name: 'OSB board', material: 'OSB', thickness: 13, density: 650, description: 'OSB board 13mm' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 27, Zeile 1'
  },
  {
    id: 'T27.2',
    tableNumber: 27,
    rowNumber: 2,
    dnfw: 58,
    flankingType: 'timber-stud-separated',
    mass: 65,
    thickness: 186,
    descriptions: {
      de: {
        short: 'HSW 160 + MW 160 + OSB 13 getrennt',
        description: 'Holzständerwand 160mm mit Mineralwolle 160 kg/m³ und OSB-Beplankung 13mm, getrennte Befestigung',
        constructionDetails: 'Holzständer 160mm, Mineralwolldämmung 160 kg/m³, OSB-Platte 13mm beidseitig, getrennte Befestigung der Beplankung'
      },
      en: {
        short: 'TSW 160 + MW 160 + OSB 13 separated',
        description: 'Timber stud wall 160mm with mineral wool 160 kg/m³ and OSB cladding 13mm, separated fastening',
        constructionDetails: 'Timber studs 160mm, mineral wool insulation 160 kg/m³, OSB board 13mm both sides, separated fastening of cladding'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'OSB-Platte', material: 'OSB', thickness: 13, density: 650, description: 'OSB-Platte 13mm getrennt befestigt' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 160, density: 160, description: 'Mineralwolldämmung zwischen Holzständern' },
        { id: 'layer-3', name: 'Holzständer', material: 'Holz', thickness: 160, density: 500, description: 'Holzständer 160mm' },
        { id: 'layer-4', name: 'OSB-Platte', material: 'OSB', thickness: 13, density: 650, description: 'OSB-Platte 13mm getrennt befestigt' }
      ],
      en: [
        { id: 'layer-1', name: 'OSB board', material: 'OSB', thickness: 13, density: 650, description: 'OSB board 13mm separately fastened' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 160, density: 160, description: 'Mineral wool insulation between timber studs' },
        { id: 'layer-3', name: 'Timber studs', material: 'Timber', thickness: 160, density: 500, description: 'Timber studs 160mm' },
        { id: 'layer-4', name: 'OSB board', material: 'OSB', thickness: 13, density: 650, description: 'OSB board 13mm separately fastened' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 27, Zeile 2'
  },
  {
    id: 'T27.3',
    tableNumber: 27,
    rowNumber: 3,
    dnfw: 68,
    flankingType: 'timber-stud-wall-elements-separated',
    mass: 65,
    thickness: 186,
    descriptions: {
      de: {
        short: 'HSW 160 + MW 160 + OSB 13 Wandelemente getrennt',
        description: 'Holzständerwand 160mm mit Mineralwolle 160 kg/m³ und OSB-Beplankung 13mm, getrennte Wandelemente',
        constructionDetails: 'Holzständer 160mm, Mineralwolldämmung 160 kg/m³, OSB-Platte 13mm beidseitig, getrennte Wandelemente ohne durchgehende Verbindung'
      },
      en: {
        short: 'TSW 160 + MW 160 + OSB 13 wall elements separated',
        description: 'Timber stud wall 160mm with mineral wool 160 kg/m³ and OSB cladding 13mm, separated wall elements',
        constructionDetails: 'Timber studs 160mm, mineral wool insulation 160 kg/m³, OSB board 13mm both sides, separated wall elements without continuous connection'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'OSB-Platte', material: 'OSB', thickness: 13, density: 650, description: 'OSB-Platte 13mm getrennt ausgeführt' },
        { id: 'layer-2', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 160, density: 160, description: 'Mineralwolldämmung zwischen Holzständern' },
        { id: 'layer-3', name: 'Holzständer', material: 'Holz', thickness: 160, density: 500, description: 'Holzständer 160mm getrennt' },
        { id: 'layer-4', name: 'OSB-Platte', material: 'OSB', thickness: 13, density: 650, description: 'OSB-Platte 13mm getrennt ausgeführt' }
      ],
      en: [
        { id: 'layer-1', name: 'OSB board', material: 'OSB', thickness: 13, density: 650, description: 'OSB board 13mm separated construction' },
        { id: 'layer-2', name: 'Mineral wool', material: 'Mineral wool', thickness: 160, density: 160, description: 'Mineral wool insulation between timber studs' },
        { id: 'layer-3', name: 'Timber studs', material: 'Timber', thickness: 160, density: 500, description: 'Timber studs 160mm separated' },
        { id: 'layer-4', name: 'OSB board', material: 'OSB', thickness: 13, density: 650, description: 'OSB board 13mm separated construction' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 27, Zeile 3'
  }
];

/**
 * Table 36: Sand-lime brick masonry (Kalksandstein-Mauerwerk)
 */
export const DIN4109_TABLE_36_SAND_LIME_BRICK: DIN4109FlankingComponent[] = [
  {
    id: 'T36.1',
    tableNumber: 36,
    rowNumber: 1,
    dnfw: 58,
    flankingType: 'masonry',
    mass: 315,
    thickness: 175,
    descriptions: {
      de: {
        short: 'KS 175',
        description: 'Kalksandstein-Mauerwerk 175mm',
        constructionDetails: 'Kalksandstein-Planblöcke KS20-1,8, 175mm, Dünnbettmörtel, Kalkzementputz 15mm beidseitig'
      },
      en: {
        short: 'SM 175',
        description: 'Sand-lime brick masonry 175mm',
        constructionDetails: 'Sand-lime brick blocks KS20-1.8, 175mm, thin-bed mortar, lime-cement plaster 15mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Kalkzementputz', material: 'Putz', thickness: 15, density: 1800, description: 'Kalkzementputz 15mm' },
        { id: 'layer-2', name: 'Kalksandstein', material: 'Kalksandstein', thickness: 175, density: 1800, description: 'Kalksandstein-Planblöcke KS20-1,8' },
        { id: 'layer-3', name: 'Kalkzementputz', material: 'Putz', thickness: 15, density: 1800, description: 'Kalkzementputz 15mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Lime-cement plaster', material: 'Plaster', thickness: 15, density: 1800, description: 'Lime-cement plaster 15mm' },
        { id: 'layer-2', name: 'Sand-lime brick', material: 'Sand-lime brick', thickness: 175, density: 1800, description: 'Sand-lime brick blocks KS20-1.8' },
        { id: 'layer-3', name: 'Lime-cement plaster', material: 'Plaster', thickness: 15, density: 1800, description: 'Lime-cement plaster 15mm' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 36, Zeile 1'
  },
  {
    id: 'T36.2',
    tableNumber: 36,
    rowNumber: 2,
    dnfw: 61,
    flankingType: 'masonry',
    mass: 432,
    thickness: 240,
    descriptions: {
      de: {
        short: 'KS 240',
        description: 'Kalksandstein-Mauerwerk 240mm',
        constructionDetails: 'Kalksandstein-Planblöcke KS20-1,8, 240mm, Dünnbettmörtel, Kalkzementputz 15mm beidseitig'
      },
      en: {
        short: 'SM 240',
        description: 'Sand-lime brick masonry 240mm',
        constructionDetails: 'Sand-lime brick blocks KS20-1.8, 240mm, thin-bed mortar, lime-cement plaster 15mm both sides'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Kalkzementputz', material: 'Putz', thickness: 15, density: 1800, description: 'Kalkzementputz 15mm' },
        { id: 'layer-2', name: 'Kalksandstein', material: 'Kalksandstein', thickness: 240, density: 1800, description: 'Kalksandstein-Planblöcke KS20-1,8' },
        { id: 'layer-3', name: 'Kalkzementputz', material: 'Putz', thickness: 15, density: 1800, description: 'Kalkzementputz 15mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Lime-cement plaster', material: 'Plaster', thickness: 15, density: 1800, description: 'Lime-cement plaster 15mm' },
        { id: 'layer-2', name: 'Sand-lime brick', material: 'Sand-lime brick', thickness: 240, density: 1800, description: 'Sand-lime brick blocks KS20-1.8' },
        { id: 'layer-3', name: 'Lime-cement plaster', material: 'Plaster', thickness: 15, density: 1800, description: 'Lime-cement plaster 15mm' }
      ]
    },
    source: 'DIN 4109-33:2016-07, Tabelle 36, Zeile 2'
  }
];

/**
 * All flanking components from DIN 4109-33 tables
 */
export const DIN4109_FLANKING_COMPONENTS: DIN4109FlankingComponent[] = [
  ...DIN4109_TABLE_26_FLANKING_METAL_STUD,
  ...DIN4109_TABLE_27_FLANKING_TIMBER_STUD,
  ...DIN4109_TABLE_36_SAND_LIME_BRICK
  // TODO: Add Table 28 if it exists separately from 27
];

/**
 * Get table description by table number
 */
export function getFlankingTableDescription(tableNumber: number): string | null {
  const descriptions: Record<number, string> = {
    26: 'Flankierende Metallständerwände (Flanking metal stud walls)',
    27: 'Flankierende Holzständerwände (Flanking timber stud walls)',
    28: 'Flankierende Holzständerwände - weitere Ausführungen (Flanking timber stud walls - additional versions)',
    36: 'Kalksandstein-Mauerwerk (Sand-lime brick masonry)'
  };
  return descriptions[tableNumber] || null;
}
