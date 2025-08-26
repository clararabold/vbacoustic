import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ProjectConfiguration, WallConfiguration, CeilingConfiguration, CalculationParameters, BuildingContext } from '../../types';
import { getSampleConfiguration } from '../../data/sampleConfigurations';
import { ElementType } from '@vbacoustic/lib/src/models/AcousticTypes';
import { StandardType } from '@vbacoustic/lib/src/standards/AcousticStandard';

interface ProjectConfigurationFormProps {
  onSubmit: (data: ProjectConfiguration) => void;
  onSampleConfigurationLoad?: (sampleConfig: {
    project: ProjectConfiguration;
    element: WallConfiguration | CeilingConfiguration;
    parameters: CalculationParameters & BuildingContext;
  }) => void;
  defaultValues?: Partial<ProjectConfiguration>;
}

/**
 * Main project configuration form - mirrors frmVBAcoustic.vba main dialog
 * This is the equivalent of the "Programmsteuerung" section
 */
export const ProjectConfigurationForm: React.FC<ProjectConfigurationFormProps> = ({
  onSubmit,
  onSampleConfigurationLoad,
  defaultValues
}) => {
  const { t } = useTranslation();
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
    if (sample?.project && sample?.element && sample?.parameters) {
      if (onSampleConfigurationLoad) {
        // If we have the sample configuration load handler, use it to load the complete config
        onSampleConfigurationLoad(sample as {
          project: ProjectConfiguration;
          element: WallConfiguration | CeilingConfiguration;
          parameters: CalculationParameters & BuildingContext;
        });
      } else {
        // Fallback to just loading project config
        setValue('inputMode', sample.project.inputMode);
        setValue('constructionMethod', sample.project.constructionMethod);
        setValue('elementType', sample.project.elementType);
        setValue('calculationStandard', sample.project.calculationStandard);
        setValue('calculationType', sample.project.calculationType);
      }
    }
  };

  return (
    <div>
      <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">{t('projectConfig.title')}</h3>
          <button
            type="button"
            onClick={loadSampleConfiguration}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {t('projectConfig.loadSampleConfiguration')}
          </button>
        </div>
        
        {/* Building Input Mode - mirrors "Gebäudeeingabe" */}
        <div className="space-y-4 mb-8">
          <h4 className="text-md font-medium text-gray-800">{t('projectConfig.buildingInputMode')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="manual"
                {...register('inputMode', { required: t('projectConfig.errors.inputModeRequired') })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">{t('projectConfig.manualInput')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.manualInputDesc')}</div>
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
                <div className="font-medium">{t('projectConfig.ifcImport')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.ifcImportDesc')}</div>
              </div>
            </label>
          </div>
          {errors.inputMode && (
            <p className="text-red-500 text-sm mt-1">{errors.inputMode.message}</p>
          )}
        </div>

        {/* Construction Method - mirrors "Bauweise" */}
        <div className="space-y-4 mb-8">
          <h4 className="text-md font-medium text-gray-800">{t('projectConfig.constructionMethod')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="holzbau"
                {...register('constructionMethod', { required: t('projectConfig.errors.constructionMethodRequired') })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">{t('projectConfig.holzbau')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.holzbauDesc')}</div>
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
                <div className="font-medium">{t('projectConfig.massivbau')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.massivbauDesc')}</div>
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
                <div className="font-medium">{t('projectConfig.leichtbau')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.leichtbauDesc')}</div>
              </div>
            </label>
          </div>
          {errors.constructionMethod && (
            <p className="text-red-500 text-sm mt-1">{errors.constructionMethod.message}</p>
          )}
        </div>

        {/* Element Type - mirrors "Trennbauteil" */}
        <div className="space-y-4 mb-8">
          <h4 className="text-md font-medium text-gray-800">{t('projectConfig.elementType')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={ElementType.Wall}
                {...register('elementType', { required: t('projectConfig.errors.elementTypeRequired') })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">{t('projectConfig.separatingWall')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.separatingWallDesc')}</div>
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
                <div className="font-medium">{t('projectConfig.separatingCeiling')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.separatingCeilingDesc')}</div>
              </div>
            </label>
          </div>
          {errors.elementType && (
            <p className="text-red-500 text-sm mt-1">{errors.elementType.message}</p>
          )}
        </div>

        {/* Calculation Standard - mirrors "Berechnungsmethode" */}
        <div className="space-y-4 mb-8">
          <h4 className="text-md font-medium text-gray-800">{t('projectConfig.calculationStandard')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={StandardType.ISO12354}
                {...register('calculationStandard', { required: t('projectConfig.errors.standardRequired') })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">{t('projectConfig.iso12354')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.iso12354Desc')}</div>
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
                <div className="font-medium">{t('projectConfig.din4109')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.din4109Desc')}</div>
              </div>
            </label>
          </div>
          {errors.calculationStandard && (
            <p className="text-red-500 text-sm mt-1">{errors.calculationStandard.message}</p>
          )}
        </div>

        {/* Calculation Type */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">{t('projectConfig.calculationType')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="single-value"
                {...register('calculationType', { required: t('projectConfig.errors.calculationTypeRequired') })}
                className="text-primary-600"
              />
              <div>
                <div className="font-medium">{t('projectConfig.singleValue')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.singleValueDesc')}</div>
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
                <div className="font-medium">{t('projectConfig.frequencySpectrum')}</div>
                <div className="text-sm text-gray-500">{t('projectConfig.frequencySpectrumDesc')}</div>
              </div>
            </label>
          </div>
          {errors.calculationType && (
            <p className="text-red-500 text-sm mt-1">{errors.calculationType.message}</p>
          )}
        </div>
      </div>
      </form>
      
      {/* Button area with gray background */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-end">
          <button type="submit" form="project-form" className="btn-primary">
            {t('projectConfig.continueToElementConfig')}
          </button>
        </div>
      </div>
    </div>
  );
};
