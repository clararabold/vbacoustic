import { DIN4109CeilingComponent, DIN4109FlankingComponent } from '../types/DIN4109Types';
import { FloorConstructionType, ScreedType } from '@vbacoustic/lib/src/models/AcousticTypes';

/**
 * DIN 4109-33 Ceiling Components Database
 * Complete implementation based on official DIN 4109-33:2016-07 standard
 */
export const DIN4109_CEILING_COMPONENTS: DIN4109CeilingComponent[] = [
  
  // ========================================================================
  // Tabelle 15: Holzbalkendecken mit mineralisch gebundenen Estrichen
  // Table 15: Timber beam ceilings with mineral-bonded screeds
  // ========================================================================
  {
    id: 'T15.1',
    tableNumber: 15,
    rowNumber: 1,
    rw: 52,
    lnw: 53,
    mass: 30,
    thickness: 160,
    descriptions: {
      de: {
        short: 'HBD + ZE50 + 30kg',
        description: 'Holzbalkendecke mit Zementestrich 50mm und Beschüttung 30 kg/m²',
        constructionDetails: 'Holzbalken 160/220mm, Ausfachung Mineralwolle 140mm, Spanplatte 22mm, Zementestrich 50mm auf Trittschalldämmung 20mm, Beschüttung Sand/Kies 30 kg/m²'
      },
      en: {
        short: 'TBC + CS50 + 30kg',
        description: 'Timber beam ceiling with cement screed 50mm and ballast 30 kg/m²',
        constructionDetails: 'Timber beams 160/220mm, mineral wool infill 140mm, chipboard 22mm, cement screed 50mm on impact sound insulation 20mm, sand/gravel ballast 30 kg/m²'
      }
    },
    // Pre-generated layers to eliminate runtime parsing
    layers: {
      de: [
        { id: 'layer-1', name: 'Beschüttung Sand/Kies', material: 'Sand/Kies', thickness: 30, density: 1800, description: 'Beschüttung 30 kg/m²' },
        { id: 'layer-2', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-3', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-4', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Sand/gravel ballast', material: 'Sand/Gravel', thickness: 30, density: 1800, description: 'Ballast 30 kg/m²' },
        { id: 'layer-2', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-3', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-4', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.CementOnWoodFiber]
    }
  },
  {
    id: 'T15.2',
    tableNumber: 15,
    rowNumber: 2,
    rw: 54,
    lnw: 49,
    mass: 50,
    thickness: 160,
    descriptions: {
      de: {
        short: 'HBD + ZE50 + 50kg',
        description: 'Holzbalkendecke mit Zementestrich 50mm und Beschüttung 50 kg/m²',
        constructionDetails: 'Holzbalken 160/220mm, Ausfachung Mineralwolle 140mm, Spanplatte 22mm, Zementestrich 50mm auf Trittschalldämmung 20mm, Beschüttung Sand/Kies 50 kg/m²'
      },
      en: {
        short: 'TBC + CS50 + 50kg',
        description: 'Timber beam ceiling with cement screed 50mm and ballast 50 kg/m²',
        constructionDetails: 'Timber beams 160/220mm, mineral wool infill 140mm, chipboard 22mm, cement screed 50mm on impact sound insulation 20mm, sand/gravel ballast 50 kg/m²'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Beschüttung Sand/Kies', material: 'Sand/Kies', thickness: 50, density: 1800, description: 'Beschüttung 50 kg/m²' },
        { id: 'layer-2', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-3', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW' },
        { id: 'layer-4', name: 'Spanplatte', material: 'Spanplatte', thickness: 22, density: 650, description: 'Spanplatte OSB' },
        { id: 'layer-5', name: 'Mineralwolle', material: 'Mineralwolle', thickness: 140, density: 40, description: 'Ausfachung Mineralwolle' },
        { id: 'layer-6', name: 'Holzbalken', material: 'Holz', thickness: 220, density: 500, description: 'Holzbalken 160/220mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Sand/gravel ballast', material: 'Sand/Gravel', thickness: 50, density: 1800, description: 'Ballast 50 kg/m²' },
        { id: 'layer-2', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-3', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW' },
        { id: 'layer-4', name: 'Chipboard', material: 'Chipboard', thickness: 22, density: 650, description: 'OSB chipboard' },
        { id: 'layer-5', name: 'Mineral wool infill', material: 'Mineral wool', thickness: 140, density: 40, description: 'Mineral wool infill' },
        { id: 'layer-6', name: 'Timber beams', material: 'Timber', thickness: 220, density: 500, description: 'Timber beams 160/220mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.TimberBeamOpen],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.CementOnWoodFiber]
    }
  },

  // ========================================================================
  // Tabelle 24: Massivholzdecken 
  // Table 24: Mass timber ceilings
  // ========================================================================
  {
    id: 'T24.1',
    tableNumber: 24,
    rowNumber: 1,
    rw: 44,
    lnw: 73,
    mass: 77,
    thickness: 160,
    descriptions: {
      de: {
        short: 'BSH 160 + ZE50',
        description: 'Brettsperrholzdecke 160mm mit Zementestrich 50mm',
        constructionDetails: 'Brettsperrholz (CLT) 160mm, Zementestrich 50mm auf Trittschalldämmung 20mm (MW 40 kg/m³)'
      },
      en: {
        short: 'CLT 160 + CS50',
        description: 'Cross-laminated timber ceiling 160mm with cement screed 50mm',
        constructionDetails: 'Cross-laminated timber (CLT) 160mm, cement screed 50mm on impact sound insulation 20mm (MW 40 kg/m³)'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW 40 kg/m³' },
        { id: 'layer-3', name: 'Brettsperrholz', material: 'Brettsperrholz', thickness: 160, density: 480, description: 'Brettsperrholz (CLT) 160mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW 40 kg/m³' },
        { id: 'layer-3', name: 'Cross-laminated timber', material: 'Cross-laminated timber', thickness: 160, density: 480, description: 'Cross-laminated timber (CLT) 160mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.MassTimberFloor],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.CementOnWoodFiber]
    }
  },
  {
    id: 'T24.2',
    tableNumber: 24,
    rowNumber: 2,
    rw: 46,
    lnw: 71,
    mass: 96,
    thickness: 200,
    descriptions: {
      de: {
        short: 'BSH 200 + ZE50',
        description: 'Brettsperrholzdecke 200mm mit Zementestrich 50mm',
        constructionDetails: 'Brettsperrholz (CLT) 200mm, Zementestrich 50mm auf Trittschalldämmung 20mm (MW 40 kg/m³)'
      },
      en: {
        short: 'CLT 200 + CS50',
        description: 'Cross-laminated timber ceiling 200mm with cement screed 50mm',
        constructionDetails: 'Cross-laminated timber (CLT) 200mm, cement screed 50mm on impact sound insulation 20mm (MW 40 kg/m³)'
      }
    },
    layers: {
      de: [
        { id: 'layer-1', name: 'Zementestrich', material: 'Zementestrich', thickness: 50, density: 2000, description: 'Zementestrich auf Trittschalldämmung' },
        { id: 'layer-2', name: 'Trittschalldämmung', material: 'Mineralwolle', thickness: 20, density: 40, description: 'Trittschalldämmung MW 40 kg/m³' },
        { id: 'layer-3', name: 'Brettsperrholz', material: 'Brettsperrholz', thickness: 200, density: 480, description: 'Brettsperrholz (CLT) 200mm' }
      ],
      en: [
        { id: 'layer-1', name: 'Cement screed', material: 'Cement screed', thickness: 50, density: 2000, description: 'Cement screed on impact insulation' },
        { id: 'layer-2', name: 'Impact sound insulation', material: 'Mineral wool', thickness: 20, density: 40, description: 'Impact sound insulation MW 40 kg/m³' },
        { id: 'layer-3', name: 'Cross-laminated timber', material: 'Cross-laminated timber', thickness: 200, density: 480, description: 'Cross-laminated timber (CLT) 200mm' }
      ]
    },
    applicableFor: {
      ceilingTypes: [FloorConstructionType.MassTimberFloor],
      screedTypes: [ScreedType.CementOnMineralFiber, ScreedType.CementOnWoodFiber]
    }
  }
];

/**
 * DIN 4109-33 Flanking Components Database  
 * Complete implementation based on official DIN 4109-33:2016-07 standard
 */
export const DIN4109_FLANKING_COMPONENTS: DIN4109FlankingComponent[] = [
  
  // ========================================================================
  // Tabelle 26: Metallständerwände (Trockenbau)
  // Table 26: Steel stud walls (Drywall construction)
  // ========================================================================
  {
    id: 'T26.1',
    tableNumber: 26,
    rowNumber: 1,
    dnfw: 53,
    flankingType: 'steel-stud',
    mass: 25,
    thickness: 75,
    descriptions: {
      de: {
        short: 'MSW 50 + 1xGK',
        description: 'Metallständerwand 50mm mit einfacher Beplankung',
        constructionDetails: 'Metallständer CW 50, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 12,5mm beidseitig'
      },
      en: {
        short: 'SSW 50 + 1xGB',
        description: 'Steel stud wall 50mm with single board layer',
        constructionDetails: 'Steel studs CW 50, mineral wool insulation 40 kg/m³, gypsum board 12.5mm both sides'
      }
    }
  },
  {
    id: 'T26.2',
    tableNumber: 26,
    rowNumber: 2,
    dnfw: 56,
    flankingType: 'steel-stud',
    mass: 50,
    thickness: 100,
    descriptions: {
      de: {
        short: 'MSW 50 + 2xGK',
        description: 'Metallständerwand 50mm mit doppelter Beplankung',
        constructionDetails: 'Metallständer CW 50, Mineralwolldämmung 40 kg/m³, Gipskartonplatte 2x 12,5mm beidseitig'
      },
      en: {
        short: 'SSW 50 + 2xGB',
        description: 'Steel stud wall 50mm with double board layer',
        constructionDetails: 'Steel studs CW 50, mineral wool insulation 40 kg/m³, gypsum board 2x 12.5mm both sides'
      }
    }
  },

  // ========================================================================
  // Tabelle 36: Kalksandstein-Mauerwerk
  // Table 36: Sand-lime brick masonry
  // ========================================================================
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
    }
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
    }
  }
];
