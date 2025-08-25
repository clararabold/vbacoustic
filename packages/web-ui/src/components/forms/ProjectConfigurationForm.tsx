import React from 'react';
import { useForm } from 'react-hook-form';
import { ProjectConfiguration } from '../../types';
import { getSampleConfiguration } from '../../data/sampleConfigurations';
import { ElementType } from '@vbacoustic/lib/src/models/AcousticTypes';
import { StandardType } from '@vbacoustic/lib/src/standards/AcousticStandard';

interface ProjectConfigurationFormProps {
  onSubmit: (data: ProjectConfiguration) => void;
  defaultValues?: Partial<ProjectConfiguration>;
}

/**
 * Main project configuration form - mirrors frmVBAcoustic.vba main dialog
 * This is the equivalent of the "Programmsteuerung" section
 */
export const ProjectConfigurationForm: React.FC<ProjectConfigurationFormProps> = ({
  onSubmit,
  defaultValues
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjectConfiguration>({
    defaultValues: {
      inputMode: 'manual',
      constructionMethod: 'holzbau',
      elementType: ElementType.Wall,
      calculationStandard: StandardType.ISO12354,
      calculationType: 'single-value',
      ...defaultValues
    }
  });

  const elementType = watch('elementType');
  const calculationStandard = watch('calculationStandard');

  const loadSampleConfiguration = () => {
    const sample = getSampleConfiguration(0);
    if (sample?.project) {
      setValue('inputMode', sample.project.inputMode);
      setValue('constructionMethod', sample.project.constructionMethod);
      setValue('elementType', sample.project.elementType);
      setValue('calculationStandard', sample.project.calculationStandard);
      setValue('calculationType', sample.project.calculationType);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Project Configuration</h3>
          <button
            type="button"
            onClick={loadSampleConfiguration}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Load Sample Configuration
          </button>
        </div>
        
        {/* Building Input Mode - mirrors "Gebäudeeingabe" */}
        <div className="space-y-4 mb-8">
          <h4 className="text-md font-medium text-gray-800">Building Input Mode</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="manual"
                {...register('inputMode', { required: 'Input mode is required' })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">Manual Input</div>
                <div className="text-sm text-gray-500">Enter building elements manually</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
              <input
                type="radio"
                value="ifc"
                {...register('inputMode')}
                disabled
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">IFC Import</div>
                <div className="text-sm text-gray-500">Import from IFC file (coming soon)</div>
              </div>
            </label>
          </div>
        </div>

        {/* Construction Method - mirrors "Bauweise" */}
        <div className="space-y-4 mb-8">
          <h4 className="text-md font-medium text-gray-800">Construction Method</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="holzbau"
                {...register('constructionMethod', { required: 'Construction method is required' })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">Holzbau</div>
                <div className="text-sm text-gray-500">Timber construction</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
              <input
                type="radio"
                value="massivbau"
                {...register('constructionMethod')}
                disabled
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">Massivbau</div>
                <div className="text-sm text-gray-500">Solid construction (coming soon)</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
              <input
                type="radio"
                value="leichtbau"
                {...register('constructionMethod')}
                disabled
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">Leichtbau</div>
                <div className="text-sm text-gray-500">Lightweight construction (coming soon)</div>
              </div>
            </label>
          </div>
        </div>

        {/* Element Type - mirrors "Trennbauteil" */}
        <div className="space-y-4 mb-8">
          <h4 className="text-md font-medium text-gray-800">Element Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={ElementType.Wall}
                {...register('elementType', { required: 'Element type is required' })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">Separating Wall</div>
                <div className="text-sm text-gray-500">Trennwand analysis</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={ElementType.Ceiling}
                {...register('elementType')}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">Separating Ceiling</div>
                <div className="text-sm text-gray-500">Trenndecke analysis</div>
              </div>
            </label>
          </div>
        </div>

        {/* Calculation Standard - mirrors "Berechnungsmethode" */}
        <div className="space-y-4 mb-8">
          <h4 className="text-md font-medium text-gray-800">Calculation Standard</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={StandardType.ISO12354}
                {...register('calculationStandard', { required: 'Calculation standard is required' })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">ISO 12354</div>
                <div className="text-sm text-gray-500">Single-value calculation according to ISO 12354</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={StandardType.DIN4109}
                {...register('calculationStandard')}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">DIN 4109</div>
                <div className="text-sm text-gray-500">Single-value calculation according to DIN 4109</div>
              </div>
            </label>
          </div>
        </div>

        {/* Calculation Type */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Calculation Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="single-value"
                {...register('calculationType', { required: 'Calculation type is required' })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">Single Value</div>
                <div className="text-sm text-gray-500">Weighted sound reduction index</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
              <input
                type="radio"
                value="frequency-dependent"
                {...register('calculationType')}
                disabled
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">Frequency Dependent</div>
                <div className="text-sm text-gray-500">Third-octave analysis (coming soon)</div>
              </div>
            </label>
          </div>
        </div>

        {/* Visual indicator for selected element type */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Selected Configuration: <span className="font-medium">
              {elementType === ElementType.Wall ? 'Wall' : 'Ceiling'} · 
              {calculationStandard === StandardType.ISO12354 ? ' ISO 12354' : ' DIN 4109'}
            </span>
          </div>
        </div>

        {/* Error messages */}
        {Object.keys(errors).length > 0 && (
          <div className="alert-error">
            <p className="font-medium">Please complete all required fields:</p>
            <ul className="list-disc list-inside mt-2">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key} className="text-sm">{error?.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Continue to Element Configuration
        </button>
      </div>
    </form>
  );
};
