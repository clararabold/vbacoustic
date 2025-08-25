import { useForm, useFieldArray } from 'react-hook-form';
import { CeilingConfiguration } from '../../types/CalculationTypes';
import { 
  FloorConstructionType, 
  ScreedType,
  CladdingType,
  ElementType 
} from '@vbacoustic/lib/src/models/AcousticTypes';
import { JunctionStiffness } from '@vbacoustic/lib/src/standards/AcousticStandard';

interface CeilingConfigurationFormProps {
  onNext: (data: CeilingConfiguration) => void;
  onPrev: () => void;
  defaultValues?: Partial<CeilingConfiguration>;
}

export function CeilingConfigurationForm({ onNext, onPrev, defaultValues }: CeilingConfigurationFormProps) {
  const { register, control, watch, handleSubmit, formState: { errors } } = useForm<CeilingConfiguration>({
    defaultValues: {
      ceilingType: FloorConstructionType.MassTimberFloor,
      thickness: 160,
      spanWidth: 4.0,
      estrichType: ScreedType.CementOnMineralFiber,
      estrichThickness: 50,
      layers: [],
      flankingElements: [],
      ...defaultValues
    }
  });

  const { fields: layers, append: addLayer, remove: removeLayer } = useFieldArray({
    control,
    name: 'layers'
  });

  const { fields: flankingElements, append: addFlankingElement, remove: removeFlankingElement } = useFieldArray({
    control,
    name: 'flankingElements'
  });

  const ceilingType = watch('ceilingType');
  const showEstrich = [
    FloorConstructionType.MassTimberFloor, 
    FloorConstructionType.MassTimberWithCeiling, 
    FloorConstructionType.MassTimberRibbed, 
    FloorConstructionType.TimberConcreteComposite
  ].includes(ceilingType);
  const showUnderdecke = ceilingType === FloorConstructionType.MassTimberWithCeiling;

  const onSubmit = (data: CeilingConfiguration) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Deckenkonfiguration</h2>
        
        <form id="ceiling-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Ceiling Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Deckensystem</label>
            <div className="space-y-2">
              {[
                { value: FloorConstructionType.TimberBeamOpen, label: 'Offene Holzbalkendecke' },
                { value: FloorConstructionType.TimberBeamWithBattensGK, label: 'Holzbalkendecke mit Lattung + GK' },
                { value: FloorConstructionType.TimberBeamWithCeilingGK, label: 'Holzbalkendecke mit Abh./FS + 1 x GK' },
                { value: FloorConstructionType.TimberBeamWithCeiling2GK, label: 'Holzbalkendecke mit Abh./FS + 2 x GK' },
                { value: FloorConstructionType.MassTimberFloor, label: 'Massivholzdecke' },
                { value: FloorConstructionType.MassTimberWithCeiling, label: 'Massivholzdecke mit Unterdecke' },
                { value: FloorConstructionType.MassTimberRibbed, label: 'Rippen-/Kastenelementdecke' },
                { value: FloorConstructionType.TimberConcreteComposite, label: 'Holz-Beton-Verbunddecke' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    {...register('ceilingType', { required: 'Bitte wählen Sie ein Deckensystem' })}
                    className="mr-2"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.ceilingType && (
              <p className="text-red-500 text-sm mt-1">{errors.ceilingType.message}</p>
            )}
          </div>

          {/* Basic Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deckendicke [mm]
              </label>
              <input
                type="number"
                {...register('thickness', { 
                  required: 'Dicke ist erforderlich',
                  min: { value: 10, message: 'Mindestdicke: 10 mm' },
                  max: { value: 1000, message: 'Maximaldicke: 1000 mm' }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
                step="1"
              />
              {errors.thickness && (
                <p className="text-red-500 text-sm mt-1">{errors.thickness.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spannweite [m]
              </label>
              <input
                type="number"
                {...register('spanWidth', { 
                  required: 'Spannweite ist erforderlich',
                  min: { value: 1.0, message: 'Mindestspannweite: 1.0 m' },
                  max: { value: 20.0, message: 'Maximalspannweite: 20.0 m' }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
                step="0.1"
              />
              {errors.spanWidth && (
                <p className="text-red-500 text-sm mt-1">{errors.spanWidth.message}</p>
              )}
            </div>
          </div>

          {/* Estrich Configuration */}
          {showEstrich && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Estrich</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Estrichart</label>
                <div className="space-y-2">
                  {[
                    { value: ScreedType.CementOnMineralFiber, label: 'Zementestrich auf Mineralfaser' },
                    { value: ScreedType.CementOnWoodFiber, label: 'Zementestrich auf Holzfaser' },
                    { value: ScreedType.DryScreed, label: 'Trockenestrich' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        value={option.value}
                        {...register('estrichType')}
                        className="mr-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estrichdicke [mm]
                </label>
                <input
                  type="number"
                  {...register('estrichThickness', { 
                    min: { value: 10, message: 'Mindestdicke: 10 mm' },
                    max: { value: 200, message: 'Maximaldicke: 200 mm' }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  step="1"
                />
                {errors.estrichThickness && (
                  <p className="text-red-500 text-sm mt-1">{errors.estrichThickness.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Unterdecke Configuration */}
          {showUnderdecke && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Unterdecke</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hohlraumhöhe [mm]
                  </label>
                  <input
                    type="number"
                    {...register('cavityHeight', { 
                      min: { value: 10, message: 'Mindesthöhe: 10 mm' },
                      max: { value: 500, message: 'Maximalhöhe: 500 mm' }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    step="1"
                  />
                  {errors.cavityHeight && (
                    <p className="text-red-500 text-sm mt-1">{errors.cavityHeight.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unterdeckentyp
                  </label>
                  <select
                    {...register('underCeilingType')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Bitte wählen</option>
                    <option value={CladdingType.WoodBoardPlusGK}>Holzwerkstoffplatte + GKP</option>
                    <option value={CladdingType.GypsusFiber}>Gipsfaser</option>
                    <option value={CladdingType.WoodBoardOnly}>Holzwerkstoffplatte</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Layer Configuration */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Schichten</h3>
              <button
                type="button"
                onClick={() => addLayer({
                  id: `layer-${Date.now()}`,
                  name: '',
                  thickness: 0,
                  material: '',
                  density: 0
                })}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Schicht hinzufügen
              </button>
            </div>

            <div className="space-y-3">
              {layers.map((layer, index) => (
                <div key={layer.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <label className="block text-xs text-gray-600 mb-1">Name</label>
                    <input
                      {...register(`layers.${index}.name`, { required: 'Name erforderlich' })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="Schichtname"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Dicke [mm]</label>
                    <input
                      type="number"
                      {...register(`layers.${index}.thickness`, { 
                        required: 'Dicke erforderlich',
                        min: { value: 1, message: 'Min: 1 mm' }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      step="0.1"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-gray-600 mb-1">Material</label>
                    <input
                      {...register(`layers.${index}.material`, { required: 'Material erforderlich' })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="Materialbezeichnung"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-gray-600 mb-1">Dichte [kg/m³]</label>
                    <input
                      type="number"
                      {...register(`layers.${index}.density`, { 
                        required: 'Dichte erforderlich',
                        min: { value: 1, message: 'Min: 1 kg/m³' }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      step="1"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeLayer(index)}
                      className="w-full p-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      title="Schicht entfernen"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flanking Elements */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Flankenelemente</h3>
              <button
                type="button"
                onClick={() => addFlankingElement({ 
                  id: `flanking-${Date.now()}`,
                  elementType: ElementType.Wall, 
                  thickness: 0, 
                  length: 4.0,
                  material: '', 
                  position: 'left',
                  junctionType: JunctionStiffness.RIGID,
                  connectionDetails: ''
                })}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Element hinzufügen
              </button>
            </div>

            <div className="space-y-3">
              {flankingElements.map((element, index) => (
                <div key={element.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Typ</label>
                    <select
                      {...register(`flankingElements.${index}.elementType`)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="wall">Wand</option>
                      <option value="ceiling">Decke</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Dicke [mm]</label>
                    <input
                      type="number"
                      {...register(`flankingElements.${index}.thickness`, { 
                        required: 'Dicke erforderlich',
                        min: { value: 1, message: 'Min: 1 mm' }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      step="1"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-xs text-gray-600 mb-1">Material</label>
                    <input
                      {...register(`flankingElements.${index}.material`, { required: 'Material erforderlich' })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="Materialbezeichnung"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Position</label>
                    <select
                      {...register(`flankingElements.${index}.position`)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="left">Links</option>
                      <option value="right">Rechts</option>
                      <option value="front">Vorne</option>
                      <option value="back">Hinten</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeFlankingElement(index)}
                      className="w-full p-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      title="Element entfernen"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
        
        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Zurück
            </button>
            <button
              type="submit"
              form="ceiling-form"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Weiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
