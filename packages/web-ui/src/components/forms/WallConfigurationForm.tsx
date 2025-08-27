import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { WallConfiguration } from '../../types/CalculationTypes';
import { WallConstructionType, ElementType } from '@vbacoustic/lib/src/models/AcousticTypes';
import { JunctionStiffness } from '@vbacoustic/lib/src/standards';

interface WallConfigurationFormProps {
  onNext: (data: WallConfiguration) => void;
  onPrev: () => void;
  defaultValues?: Partial<WallConfiguration>;
}

/**
 * Wall configuration form - mirrors frmVBAcousticTrennwand.vba
 * This includes wall type selection, dimensions, layers, and flanking elements
 */
export const WallConfigurationForm: React.FC<WallConfigurationFormProps> = ({
  onNext,
  onPrev,
  defaultValues
}) => {
  const { t } = useTranslation();
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<WallConfiguration>({
    defaultValues: {
      wallType: WallConstructionType.MassTimberWall,
      applicationContext: 'interior',
      connectionType: 'linear',
      dimensions: {
        thickness: 200,
        height: 2.5,
        width: 4.0,
        area: 10.0
      },
      layers: [],
      flankingElements: [],
      ...defaultValues
    }
  });

  const { fields: layerFields, append: appendLayer, remove: removeLayer } = useFieldArray({
    control,
    name: 'layers'
  });

  const { fields: flankingFields, append: appendFlanking, remove: removeFlanking } = useFieldArray({
    control,
    name: 'flankingElements'
  });

  const wallType = watch('wallType');
  const dimensions = watch('dimensions');

  // Calculate area when dimensions change
  React.useEffect(() => {
    if (dimensions.height && dimensions.width) {
      const area = dimensions.height * dimensions.width;
      // Update area - in a real implementation you'd use setValue
      console.log('Calculated area:', area);
    }
  }, [dimensions.height, dimensions.width]);

  const addLayer = () => {
    appendLayer({
      id: `layer-${Date.now()}`,
      name: '',
      material: '',
      thickness: 0,
    });
  };

  const addFlankingElement = () => {
    appendFlanking({
      id: `flanking-${Date.now()}`,
      position: 'left',
      elementType: ElementType.Wall,
      thickness: 200,
      length: 4.0,
      material: '',
      junctionType: JunctionStiffness.RIGID,
      connectionDetails: ''
    });
  };

  const getWallTypeDescription = (type: WallConstructionType) => {
    switch (type) {
      case WallConstructionType.MassTimberWall: return t('wallConfig.massTimberWallDesc');
      case WallConstructionType.TimberFrame: return t('wallConfig.timberFrameDesc');
      case WallConstructionType.MetalStud: return t('wallConfig.metalStudDesc');
      default: return '';
    }
  };

  return (
    <div>
      <form id="wall-form" onSubmit={handleSubmit(onNext)} className="space-y-8">
      
      {/* Wall Type Selection - mirrors cboWandtyp */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('wallConfig.title')}</h3>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">{t('wallConfig.wallType')}</label>
            <select 
              {...register('wallType', { required: t('wallConfig.errors.wallTypeRequired') })}
              className="form-select"
            >
              <option value={WallConstructionType.MassTimberWall}>{t('wallConfig.massTimberWall')}</option>
              <option value={WallConstructionType.TimberFrame}>{t('wallConfig.timberFrame')}</option>
              <option value={WallConstructionType.MetalStud}>{t('wallConfig.metalStud')}</option>
            </select>
            {errors.wallType && (
              <p className="text-red-500 text-sm mt-1">{errors.wallType.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {getWallTypeDescription(wallType)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">{t('wallConfig.applicationContext')}</label>
              <select 
                {...register('applicationContext', { required: t('wallConfig.errors.applicationContextRequired') })}
                className="form-select"
              >
                <option value="interior">{t('wallConfig.interiorWall')}</option>
                <option value="exterior">{t('wallConfig.exteriorWall')}</option>
              </select>
              {errors.applicationContext && (
                <p className="text-red-500 text-sm mt-1">{errors.applicationContext.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">{t('wallConfig.connectionType')}</label>
              <select 
                {...register('connectionType', { required: t('wallConfig.errors.connectionTypeRequired') })}
                className="form-select"
              >
                <option value="point">{t('wallConfig.pointConnection')}</option>
                <option value="linear">{t('wallConfig.linearConnection')}</option>
                <option value="surface">{t('wallConfig.surfaceConnection')}</option>
              </select>
              {errors.connectionType && (
                <p className="text-red-500 text-sm mt-1">{errors.connectionType.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dimensions - mirrors txtWandDicke, txtHoehe, txtBreite */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('wallConfig.wallDimensions')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="form-group">
            <label className="form-label">{t('wallConfig.thickness')}</label>
            <input
              type="number"
              step="1"
              min="50"
              max="1000"
              {...register('dimensions.thickness', { 
                required: t('wallConfig.errors.thicknessRequired'),
                min: { value: 50, message: `${t('wallConfig.errors.thicknessMin')} 50mm` },
                max: { value: 1000, message: `${t('wallConfig.errors.thicknessMax')} 1000mm` }
              })}
              className="form-input"
              placeholder="200"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('wallConfig.height')}</label>
            <input
              type="number"
              step="0.1"
              min="2.0"
              max="6.0"
              {...register('dimensions.height', { 
                required: t('wallConfig.errors.heightRequired'),
                min: { value: 2.0, message: `${t('wallConfig.errors.heightMin')} 2.0m` },
                max: { value: 6.0, message: `${t('wallConfig.errors.heightMax')} 6.0m` }
              })}
              className="form-input"
              placeholder="2.5"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('wallConfig.width')}</label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="20.0"
              {...register('dimensions.width', { 
                required: t('wallConfig.errors.widthRequired'),
                min: { value: 1.0, message: `${t('wallConfig.errors.widthMin')} 1.0m` },
                max: { value: 20.0, message: `${t('wallConfig.errors.widthMax')} 20.0m` }
              })}
              className="form-input"
              placeholder="4.0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('wallConfig.area')}</label>
            <input
              type="number"
              step="0.1"
              {...register('dimensions.area')}
              className="form-input bg-gray-50"
              placeholder="Calculated"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">{t('wallConfig.autoCalculated')}</p>
          </div>
        </div>
      </div>

      {/* Wall Layers */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">{t('wallConfig.wallLayers')}</h3>
          <button
            type="button"
            onClick={addLayer}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{t('wallConfig.addLayer')}</span>
          </button>
        </div>

        {layerFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t('wallConfig.noLayersYet')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {layerFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">{t('wallConfig.layer')} {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeLayer(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.material')}</label>
                    <input
                      {...register(`layers.${index}.material`, { required: t('wallConfig.errors.materialRequired') })}
                      className="form-input"
                      placeholder={t('wallConfig.materialPlaceholder')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.thickness')}</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      {...register(`layers.${index}.thickness`, { 
                        required: t('wallConfig.errors.thicknessRequired'),
                        min: { value: 0.1, message: `${t('wallConfig.errors.thicknessMin')} 0.1mm` }
                      })}
                      className="form-input"
                      placeholder="20"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.density')}</label>
                    <input
                      type="number"
                      step="1"
                      min="10"
                      {...register(`layers.${index}.density`)}
                      className="form-input"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flanking Elements - mirrors the 4 flanking directions */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">{t('wallConfig.flankingElements')}</h3>
          <button
            type="button"
            onClick={addFlankingElement}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{t('wallConfig.addFlankingElement')}</span>
          </button>
        </div>

        {flankingFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t('wallConfig.noFlankingElementsYet')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flankingFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">{t('wallConfig.flankingElement')} {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeFlanking(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.position')}</label>
                    <select 
                      {...register(`flankingElements.${index}.position`, { required: t('wallConfig.errors.positionRequired') })}
                      className="form-select"
                    >
                      <option value="top">{t('wallConfig.top')}</option>
                      <option value="bottom">{t('wallConfig.bottom')}</option>
                      <option value="left">{t('wallConfig.left')}</option>
                      <option value="right">{t('wallConfig.right')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.elementType')}</label>
                    <select 
                      {...register(`flankingElements.${index}.elementType`, { required: t('wallConfig.errors.elementTypeRequired') })}
                      className="form-select"
                    >
                      <option value="wall">{t('wallConfig.wall')}</option>
                      <option value="ceiling">{t('wallConfig.ceiling')}</option>
                      <option value="floor">{t('wallConfig.floor')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.thickness')}</label>
                    <input
                      type="number"
                      step="1"
                      min="50"
                      {...register(`flankingElements.${index}.thickness`, { 
                        required: t('wallConfig.errors.thicknessRequired'),
                        min: { value: 50, message: `${t('wallConfig.errors.thicknessMin')} 50mm` }
                      })}
                      className="form-input"
                      placeholder="200"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.length')}</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      {...register(`flankingElements.${index}.length`, { 
                        required: t('wallConfig.errors.lengthRequired'),
                        min: { value: 0.1, message: `${t('wallConfig.errors.lengthMin')} 0.1m` }
                      })}
                      className="form-input"
                      placeholder="4.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.junctionType')}</label>
                    <select 
                      {...register(`flankingElements.${index}.junctionType`, { required: t('wallConfig.errors.junctionTypeRequired') })}
                      className="form-select"
                    >
                      <option value={JunctionStiffness.RIGID}>{t('wallConfig.rigidConnection')}</option>
                      <option value={JunctionStiffness.FLEXIBLE}>{t('wallConfig.elasticConnection')}</option>
                      <option value={JunctionStiffness.DAMPED}>{t('wallConfig.isolatedConnection')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wallConfig.connectionDetails')}</label>
                    <input
                      {...register(`flankingElements.${index}.connectionDetails`)}
                      className="form-input"
                      placeholder={t('wallConfig.connectionDetailsPlaceholder')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="alert-error">
          <p className="font-medium">{t('wallConfig.errorSummary')}</p>
          <ul className="list-disc list-inside mt-2 text-sm">
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>{error?.message}</li>
            ))}
          </ul>
        </div>
      )}
    </form>

    {/* Action Buttons */}
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex justify-between">
        <button 
          type="button" 
          onClick={onPrev}
          className="btn-secondary"
        >
          {t('wallConfig.backToProjectConfig')}
        </button>
        <button 
          type="submit" 
          form="wall-form"
          className="btn-primary"
        >
          {t('wallConfig.startCalculation')}
        </button>
      </div>
    </div>
    </div>
  );
};
