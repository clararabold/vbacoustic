import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
      case WallConstructionType.MassTimberWall: return 'Massivholzwand (Mass Timber Wall)';
      case WallConstructionType.TimberFrame: return 'Holzständerwand (Timber Stud Wall)';
      case WallConstructionType.MetalStud: return 'Metallständerwand (Metal Stud Wall)';
      default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      
      {/* Wall Type Selection - mirrors cboWandtyp */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Wall Type Configuration</h3>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Wall Type (Wandtyp)</label>
            <select 
              {...register('wallType', { required: 'Wall type is required' })}
              className="form-select"
            >
              <option value={WallConstructionType.MassTimberWall}>MHW - Massivholzwand (Mass Timber Wall)</option>
              <option value={WallConstructionType.TimberFrame}>HSTW - Holzständerwand (Timber Stud Wall)</option>
              <option value={WallConstructionType.MetalStud}>MSTW - Metallständerwand (Metal Stud Wall)</option>
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
              <label className="form-label">Application Context</label>
              <select 
                {...register('applicationContext', { required: 'Application context is required' })}
                className="form-select"
              >
                <option value="interior">Interior Wall</option>
                <option value="exterior">Exterior Wall</option>
              </select>
              {errors.applicationContext && (
                <p className="text-red-500 text-sm mt-1">{errors.applicationContext.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Connection Type</label>
              <select 
                {...register('connectionType', { required: 'Connection type is required' })}
                className="form-select"
              >
                <option value="point">Point Connection</option>
                <option value="linear">Linear Connection</option>
                <option value="surface">Surface Connection</option>
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
        <h3 className="text-lg font-medium text-gray-900 mb-6">Wall Dimensions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="form-group">
            <label className="form-label">Thickness (mm)</label>
            <input
              type="number"
              step="1"
              min="50"
              max="1000"
              {...register('dimensions.thickness', { 
                required: 'Thickness is required',
                min: { value: 50, message: 'Minimum thickness is 50mm' },
                max: { value: 1000, message: 'Maximum thickness is 1000mm' }
              })}
              className="form-input"
              placeholder="200"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Height (m)</label>
            <input
              type="number"
              step="0.1"
              min="2.0"
              max="6.0"
              {...register('dimensions.height', { 
                required: 'Height is required',
                min: { value: 2.0, message: 'Minimum height is 2.0m' },
                max: { value: 6.0, message: 'Maximum height is 6.0m' }
              })}
              className="form-input"
              placeholder="2.5"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Width (m)</label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="20.0"
              {...register('dimensions.width', { 
                required: 'Width is required',
                min: { value: 1.0, message: 'Minimum width is 1.0m' },
                max: { value: 20.0, message: 'Maximum width is 20.0m' }
              })}
              className="form-input"
              placeholder="4.0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Area (m²)</label>
            <input
              type="number"
              step="0.1"
              {...register('dimensions.area')}
              className="form-input bg-gray-50"
              placeholder="Calculated"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Auto-calculated from height × width</p>
          </div>
        </div>
      </div>

      {/* Wall Layers */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Wall Layers</h3>
          <button
            type="button"
            onClick={addLayer}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Layer</span>
          </button>
        </div>

        {layerFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No layers added yet. Click "Add Layer" to start building your wall composition.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {layerFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">Layer {index + 1}</h4>
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
                    <label className="form-label">Material</label>
                    <input
                      {...register(`layers.${index}.material`, { required: 'Material is required' })}
                      className="form-input"
                      placeholder="e.g., CLT, Gypsum board"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Thickness (mm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      {...register(`layers.${index}.thickness`, { 
                        required: 'Thickness is required',
                        min: { value: 0.1, message: 'Minimum thickness is 0.1mm' }
                      })}
                      className="form-input"
                      placeholder="20"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Density (kg/m³)</label>
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
          <h3 className="text-lg font-medium text-gray-900">Flanking Elements</h3>
          <button
            type="button"
            onClick={addFlankingElement}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Flanking Element</span>
          </button>
        </div>

        {flankingFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No flanking elements added yet. Add surrounding structural elements for transmission path analysis.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flankingFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">Flanking Element {index + 1}</h4>
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
                    <label className="form-label">Position</label>
                    <select 
                      {...register(`flankingElements.${index}.position`, { required: 'Position is required' })}
                      className="form-select"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Element Type</label>
                    <select 
                      {...register(`flankingElements.${index}.elementType`, { required: 'Element type is required' })}
                      className="form-select"
                    >
                      <option value="wall">Wall</option>
                      <option value="ceiling">Ceiling</option>
                      <option value="floor">Floor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Thickness (mm)</label>
                    <input
                      type="number"
                      step="1"
                      min="50"
                      {...register(`flankingElements.${index}.thickness`, { 
                        required: 'Thickness is required',
                        min: { value: 50, message: 'Minimum thickness is 50mm' }
                      })}
                      className="form-input"
                      placeholder="200"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Length (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      {...register(`flankingElements.${index}.length`, { 
                        required: 'Length is required',
                        min: { value: 0.1, message: 'Minimum length is 0.1m' }
                      })}
                      className="form-input"
                      placeholder="4.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-group">
                    <label className="form-label">Junction Type</label>
                    <select 
                      {...register(`flankingElements.${index}.junctionType`, { required: 'Junction type is required' })}
                      className="form-select"
                    >
                      <option value={JunctionStiffness.RIGID}>Rigid Connection</option>
                      <option value={JunctionStiffness.FLEXIBLE}>Elastic Connection</option>
                      <option value={JunctionStiffness.DAMPED}>Isolated Connection</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Connection Details</label>
                    <input
                      {...register(`flankingElements.${index}.connectionDetails`)}
                      className="form-input"
                      placeholder="Description of connection method"
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
          <p className="font-medium">Please correct the following errors:</p>
          <ul className="list-disc list-inside mt-2 text-sm">
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>{error?.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button 
          type="button" 
          onClick={onPrev}
          className="btn-secondary"
        >
          Back to Project Configuration
        </button>
        <button type="submit" className="btn-primary">
          Continue to Calculation Parameters
        </button>
      </div>
    </form>
  );
};
