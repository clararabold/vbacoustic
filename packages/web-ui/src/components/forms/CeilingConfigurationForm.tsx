import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        <h2 className="text-xl font-semibold mb-4">{t('ceilingConfig.title')}</h2>
        
        <form id="ceiling-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Ceiling Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('ceilingConfig.ceilingSystem')}</label>
            <div className="space-y-2">
              {[
                { value: FloorConstructionType.TimberBeamOpen, label: t('ceilingConfig.timberBeamOpen') },
                { value: FloorConstructionType.TimberBeamWithBattensGK, label: t('ceilingConfig.timberBeamWithBattensGK') },
                { value: FloorConstructionType.TimberBeamWithCeilingGK, label: t('ceilingConfig.timberBeamWithCeilingGK') },
                { value: FloorConstructionType.TimberBeamWithCeiling2GK, label: t('ceilingConfig.timberBeamWithCeiling2GK') },
                { value: FloorConstructionType.MassTimberFloor, label: t('ceilingConfig.massTimberFloor') },
                { value: FloorConstructionType.MassTimberWithCeiling, label: t('ceilingConfig.massTimberWithCeiling') },
                { value: FloorConstructionType.MassTimberRibbed, label: t('ceilingConfig.massTimberRibbed') },
                { value: FloorConstructionType.TimberConcreteComposite, label: t('ceilingConfig.timberConcreteComposite') }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    {...register('ceilingType', { required: t('ceilingConfig.errors.ceilingTypeRequired') })}
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
                {t('ceilingConfig.thickness')} {t('ceilingConfig.thicknessUnit')}
              </label>
              <input
                type="number"
                {...register('thickness', { 
                  required: t('ceilingConfig.errors.thicknessRequired'),
                  min: { value: 10, message: t('ceilingConfig.errors.thicknessMin') },
                  max: { value: 1000, message: t('ceilingConfig.errors.thicknessMax') }
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
                {t('ceilingConfig.spanWidth')} {t('ceilingConfig.spanWidthUnit')}
              </label>
              <input
                type="number"
                {...register('spanWidth', { 
                  required: t('ceilingConfig.errors.spanWidthRequired'),
                  min: { value: 1.0, message: t('ceilingConfig.errors.spanWidthMin') },
                  max: { value: 20.0, message: t('ceilingConfig.errors.spanWidthMax') }
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
              <h3 className="text-lg font-medium mb-4">{t('ceilingConfig.estrich')}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('ceilingConfig.estrichType')}</label>
                <div className="space-y-2">
                  {[
                    { value: ScreedType.CementOnMineralFiber, label: t('ceilingConfig.cementOnMineralFiber') },
                    { value: ScreedType.CementOnWoodFiber, label: t('ceilingConfig.cementOnWoodFiber') },
                    { value: ScreedType.DryScreed, label: t('ceilingConfig.dryScreed') }
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
                  {t('ceilingConfig.estrichThickness')} {t('ceilingConfig.thicknessUnit')}
                </label>
                <input
                  type="number"
                  {...register('estrichThickness', { 
                    min: { value: 10, message: t('ceilingConfig.errors.estrichThicknessMin') },
                    max: { value: 200, message: t('ceilingConfig.errors.estrichThicknessMax') }
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
              <h3 className="text-lg font-medium mb-4">{t('ceilingConfig.unterdecke')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ceilingConfig.cavityHeight')} {t('ceilingConfig.thicknessUnit')}
                  </label>
                  <input
                    type="number"
                    {...register('cavityHeight', { 
                      min: { value: 10, message: t('ceilingConfig.errors.cavityHeightMin') },
                      max: { value: 500, message: t('ceilingConfig.errors.cavityHeightMax') }
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
                    {t('ceilingConfig.underCeilingType')}
                  </label>
                  <select
                    {...register('underCeilingType')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">{t('ceilingConfig.selectOption')}</option>
                    <option value={CladdingType.WoodBoardPlusGK}>{t('ceilingConfig.woodBoardPlusGK')}</option>
                    <option value={CladdingType.GypsusFiber}>{t('ceilingConfig.gypsusFiber')}</option>
                    <option value={CladdingType.WoodBoardOnly}>{t('ceilingConfig.woodBoardOnly')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Layer Configuration */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('ceilingConfig.layers')}</h3>
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
                {t('ceilingConfig.addLayer')}
              </button>
            </div>

            <div className="space-y-3">
              {layers.map((layer, index) => (
                <div key={layer.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <label className="block text-xs text-gray-600 mb-1">{t('ceilingConfig.layerName')}</label>
                    <input
                      {...register(`layers.${index}.name`, { required: t('ceilingConfig.errors.nameRequired') })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder={t('ceilingConfig.layerName')}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">{t('ceilingConfig.layerThickness')}</label>
                    <input
                      type="number"
                      {...register(`layers.${index}.thickness`, { 
                        required: t('ceilingConfig.errors.layerThicknessRequired'),
                        min: { value: 1, message: t('ceilingConfig.errors.layerThicknessMin') }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      step="0.1"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-gray-600 mb-1">{t('ceilingConfig.layerMaterial')}</label>
                    <input
                      {...register(`layers.${index}.material`, { required: t('ceilingConfig.errors.materialRequired') })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder={t('ceilingConfig.materialDesignation')}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-gray-600 mb-1">{t('ceilingConfig.layerDensity')}</label>
                    <input
                      type="number"
                      {...register(`layers.${index}.density`, { 
                        required: t('ceilingConfig.errors.densityRequired'),
                        min: { value: 1, message: t('ceilingConfig.errors.densityMin') }
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
                      title={t('ceilingConfig.removeLayer')}
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
              <h3 className="text-lg font-medium">{t('ceilingConfig.flankingElements')}</h3>
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
                {t('ceilingConfig.addElement')}
              </button>
            </div>

            <div className="space-y-3">
              {flankingElements.map((element, index) => (
                <div key={element.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">{t('ceilingConfig.elementType')}</label>
                    <select
                      {...register(`flankingElements.${index}.elementType`)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="wall">{t('wallConfig.wall')}</option>
                      <option value="ceiling">{t('wallConfig.ceiling')}</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">{t('ceilingConfig.elementThickness')}</label>
                    <input
                      type="number"
                      {...register(`flankingElements.${index}.thickness`, { 
                        required: t('ceilingConfig.errors.elementThicknessRequired'),
                        min: { value: 1, message: t('ceilingConfig.errors.elementThicknessMin') }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      step="1"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-xs text-gray-600 mb-1">{t('ceilingConfig.elementMaterial')}</label>
                    <input
                      {...register(`flankingElements.${index}.material`, { required: t('ceilingConfig.errors.materialRequired') })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder={t('ceilingConfig.materialDesignation')}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">{t('ceilingConfig.elementPosition')}</label>
                    <select
                      {...register(`flankingElements.${index}.position`)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="left">{t('ceilingConfig.positionLeft')}</option>
                      <option value="right">{t('ceilingConfig.positionRight')}</option>
                      <option value="front">{t('ceilingConfig.positionFront')}</option>
                      <option value="back">{t('ceilingConfig.positionBack')}</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeFlankingElement(index)}
                      className="w-full p-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      title={t('ceilingConfig.removeElement')}
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
              {t('ceilingConfig.back')}
            </button>
            <button
              type="submit"
              form="ceiling-form"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('ceilingConfig.continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
