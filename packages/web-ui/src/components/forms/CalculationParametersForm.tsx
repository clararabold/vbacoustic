import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CalculationParameters, BuildingContext } from '../../types';

interface CalculationParametersFormProps {
  onSubmit: (data: CalculationParameters & BuildingContext) => void;
  onPrev?: () => void;
  defaultValues?: Partial<CalculationParameters & BuildingContext>;
}

/**
 * Calculation Parameters Form - defines measurement conditions, building context, and calculation settings
 * This mirrors the final configuration step from the VBA forms before performing calculations
 */
export const CalculationParametersForm: React.FC<CalculationParametersFormProps> = ({
  onSubmit,
  onPrev,
  defaultValues
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CalculationParameters & BuildingContext>({
    defaultValues: {
      // Calculation parameters
      frequencyRange: '100-3150',
      includeFlankingTransmission: true,
      includeStructuralResonances: false,
      safetyMargin: 0,
      
      // Building context
      buildingType: 'residential',
      usageCategory: 'living',
      requiredAirborneInsulation: 55,
      requiredImpactInsulation: 53,
      temperature: 20,
      humidity: 50,
      
      ...defaultValues
    }
  });

  const buildingType = watch('buildingType');
  const includeFlankingTransmission = watch('includeFlankingTransmission');

  const getBuildingTypeOptions = () => {
    const options = {
      residential: [
        { value: 'living', label: t('calculationParams.livingAreas') },
        { value: 'sleeping', label: t('calculationParams.sleepingAreas') },
        { value: 'kitchen', label: t('calculationParams.kitchenDining') },
        { value: 'bathroom', label: t('calculationParams.bathroomWC') }
      ],
      office: [
        { value: 'open-office', label: t('calculationParams.openOffice') },
        { value: 'meeting-room', label: t('calculationParams.meetingRoom') },
        { value: 'private-office', label: t('calculationParams.privateOffice') },
        { value: 'corridor', label: t('calculationParams.corridor') }
      ],
      educational: [
        { value: 'classroom', label: t('calculationParams.classroom') },
        { value: 'lecture-hall', label: t('calculationParams.lectureHall') },
        { value: 'library', label: t('calculationParams.library') },
        { value: 'laboratory', label: t('calculationParams.laboratory') }
      ],
      healthcare: [
        { value: 'patient-room', label: t('calculationParams.patientRoom') },
        { value: 'operating-room', label: t('calculationParams.operatingRoom') },
        { value: 'waiting-area', label: t('calculationParams.waitingArea') },
        { value: 'treatment-room', label: t('calculationParams.treatmentRoom') }
      ]
    };
    return options[buildingType as keyof typeof options] || [];
  };

  const getRequiredInsulationValues = (buildingType: string, usageCategory: string) => {
    // Simplified DIN 4109 requirements
    const requirements = {
      residential: {
        living: { airborne: 55, impact: 53 },
        sleeping: { airborne: 57, impact: 50 },
        kitchen: { airborne: 52, impact: 53 },
        bathroom: { airborne: 52, impact: 53 }
      },
      office: {
        'open-office': { airborne: 47, impact: 57 },
        'meeting-room': { airborne: 52, impact: 53 },
        'private-office': { airborne: 47, impact: 57 },
        corridor: { airborne: 42, impact: 62 }
      },
      educational: {
        classroom: { airborne: 52, impact: 53 },
        'lecture-hall': { airborne: 57, impact: 50 },
        library: { airborne: 57, impact: 50 },
        laboratory: { airborne: 52, impact: 53 }
      },
      healthcare: {
        'patient-room': { airborne: 57, impact: 50 },
        'operating-room': { airborne: 62, impact: 45 },
        'waiting-area': { airborne: 52, impact: 53 },
        'treatment-room': { airborne: 57, impact: 50 }
      }
    };

    const typeReqs = requirements[buildingType as keyof typeof requirements];
    if (!typeReqs) return { airborne: 55, impact: 53 };
    
    return typeReqs[usageCategory as keyof typeof typeReqs] || { airborne: 55, impact: 53 };
  };

  return (
    <div>
      <form id="calculation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Building Context */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('calculationParams.buildingContext')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">{t('calculationParams.buildingType')}</label>
            <select 
              {...register('buildingType', { required: t('calculationParams.errors.buildingTypeRequired') })}
              className="form-select"
            >
              <option value="residential">{t('calculationParams.residential')}</option>
              <option value="office">{t('calculationParams.office')}</option>
              <option value="educational">{t('calculationParams.educational')}</option>
              <option value="healthcare">{t('calculationParams.healthcare')}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('calculationParams.usageCategory')}</label>
            <select 
              {...register('usageCategory', { required: t('calculationParams.errors.usageCategoryRequired') })}
              className="form-select"
            >
              {getBuildingTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Acoustic Requirements */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('calculationParams.acousticRequirements')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">
              {t('calculationParams.requiredAirborneInsulation')}
            </label>
            <input
              type="number"
              step="1"
              min="30"
              max="70"
              {...register('requiredAirborneInsulation', { 
                required: t('calculationParams.errors.airborneInsulationRequired'),
                min: { value: 30, message: t('calculationParams.errors.airborneInsulationMin') },
                max: { value: 70, message: t('calculationParams.errors.airborneInsulationMax') }
              })}
              className="form-input"
              placeholder="55"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('calculationParams.standardRequirement')}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              {t('calculationParams.requiredImpactInsulation')}
            </label>
            <input
              type="number"
              step="1"
              min="40"
              max="65"
              {...register('requiredImpactInsulation', { 
                required: t('calculationParams.errors.impactInsulationRequired'),
                min: { value: 40, message: t('calculationParams.errors.impactInsulationMin') },
                max: { value: 65, message: t('calculationParams.errors.impactInsulationMax') }
              })}
              className="form-input"
              placeholder="53"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('calculationParams.maxImpactSoundLevel')}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">{t('calculationParams.din4109Reference')}</h4>
          <p className="text-sm text-blue-800">
            {t('calculationParams.din4109RefText', {
              buildingType: t(`calculationParams.${buildingType}`),
              usageCategory: getBuildingTypeOptions().find(opt => opt.value === watch('usageCategory'))?.label?.toLowerCase()
            })}
            <br />
            • {t('calculationParams.airborne')}: {getRequiredInsulationValues(buildingType, watch('usageCategory')).airborne} dB
            <br />
            • {t('calculationParams.impact')}: {getRequiredInsulationValues(buildingType, watch('usageCategory')).impact} dB
          </p>
        </div>
      </div>

      {/* Calculation Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('calculationParams.calculationSettings')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">{t('calculationParams.frequencyRange')}</label>
            <select 
              {...register('frequencyRange', { required: t('calculationParams.errors.frequencyRangeRequired') })}
              className="form-select"
            >
              <option value="100-3150">{t('calculationParams.standardRange')}</option>
              <option value="50-5000">{t('calculationParams.extendedRange')}</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {t('calculationParams.frequencyRangeNote')}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">{t('calculationParams.safetyMargin')}</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              {...register('safetyMargin', { 
                min: { value: 0, message: t('calculationParams.errors.safetyMarginMin') },
                max: { value: 10, message: t('calculationParams.errors.safetyMarginMax') }
              })}
              className="form-input"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('calculationParams.safetyMarginNote')}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeFlankingTransmission"
              {...register('includeFlankingTransmission')}
              className="h-4 w-4 text-primary-600 rounded"
            />
            <label htmlFor="includeFlankingTransmission" className="text-sm font-medium text-gray-700">
              {t('calculationParams.includeFlankingTransmission')}
            </label>
          </div>
          {includeFlankingTransmission && (
            <p className="text-xs text-gray-500 ml-7">
              {t('calculationParams.flankingTransmissionNote')}
            </p>
          )}

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeStructuralResonances"
              {...register('includeStructuralResonances')}
              className="h-4 w-4 text-primary-600 rounded"
            />
            <label htmlFor="includeStructuralResonances" className="text-sm font-medium text-gray-700">
              {t('calculationParams.includeStructuralResonances')}
            </label>
          </div>
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('calculationParams.environmentalConditions')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">{t('calculationParams.temperature')}</label>
            <input
              type="number"
              step="1"
              min="15"
              max="30"
              {...register('temperature', { 
                min: { value: 15, message: t('calculationParams.errors.temperatureMin') },
                max: { value: 30, message: t('calculationParams.errors.temperatureMax') }
              })}
              className="form-input"
              placeholder="20"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('calculationParams.humidity')}</label>
            <input
              type="number"
              step="5"
              min="30"
              max="80"
              {...register('humidity', { 
                min: { value: 30, message: t('calculationParams.errors.humidityMin') },
                max: { value: 80, message: t('calculationParams.errors.humidityMax') }
              })}
              className="form-input"
              placeholder="50"
            />
          </div>
        </div>
      </div>

      {/* Measurement Data (Optional) */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('calculationParams.measurementData')}</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t('calculationParams.measurementDataNote')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">{t('calculationParams.measuredAirborneInsulation')}</label>
              <input
                type="number"
                step="0.1"
                {...register('measurementData.airborneInsulation')}
                className="form-input"
                placeholder={t('calculationParams.optional')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('calculationParams.measuredImpactInsulation')}</label>
              <input
                type="number"
                step="0.1"
                {...register('measurementData.impactInsulation')}
                className="form-input"
                placeholder={t('calculationParams.optional')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('calculationParams.measurementStandard')}</label>
              <select 
                {...register('measurementData.measurementStandard')}
                className="form-select"
              >
                <option value="">{t('calculationParams.selectStandard')}</option>
                <option value="iso140">{t('calculationParams.iso140')}</option>
                <option value="iso16283">{t('calculationParams.iso16283')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="alert-error">
          <p className="font-medium">{t('calculationParams.errorSummary')}</p>
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
            className="btn-secondary"
            onClick={onPrev}
          >
            {t('calculationParams.backToElementConfig')}
          </button>
          <button type="submit" form="calculation-form" className="btn-primary">
            {t('calculationParams.calculateAcousticPerformance')}
          </button>
        </div>
      </div>
    </div>
  );
};
