import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CalculationParameters, ProjectConfiguration } from '../../types';
import { StandardType } from '@vbacoustic/lib/src/standards/AcousticStandard';

interface CalculationParametersFormProps {
  onSubmit: (data: CalculationParameters) => void;
  onPrev?: () => void;
  defaultValues?: Partial<CalculationParameters>;
  projectConfig?: ProjectConfiguration;
}

/**
 * Calculation Parameters Form - simplified to only show parameters actually used in calculations
 * Based on VBA analysis: most parameters are for UI/validation, not core calculations
 * For DIN 4109: flanking transmission is not applicable (VBA comment: "Berechnung nach DIN 4109 nicht möglich")
 */
export const CalculationParametersForm: React.FC<CalculationParametersFormProps> = ({
  onSubmit,
  onPrev,
  defaultValues,
  projectConfig
}) => {
  const { t } = useTranslation();
  
  // DIN 4109 doesn't support flanking transmission calculations
  const isDIN4109 = projectConfig?.calculationStandard === StandardType.DIN4109;
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CalculationParameters>({
    defaultValues: {
      // Essential calculation parameters - only what VBA actually uses
      includeFlankingTransmission: isDIN4109 ? false : (defaultValues?.includeFlankingTransmission ?? true),
      safetyMargin: 0,
      
      ...defaultValues
    }
  });

  const includeFlankingTransmission = watch('includeFlankingTransmission');
  
  // Always show at least basic calculation settings

  return (
    <div>
      <form id="calculation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Essential Calculation Settings - Only what VBA actually uses */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">{t('calculationParams.calculationMethod')}</h3>
        
        <div className="space-y-4">
          {/* Flanking transmission - only available for ISO 12354, not DIN 4109 */}
          {!isDIN4109 && (
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
          )}
          
          {/* Show info message for DIN 4109 */}
          {isDIN4109 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>{t('calculationParams.din4109Note')}:</strong> {t('calculationParams.din4109FlankingNote')}
              </p>
            </div>
          )}
          {includeFlankingTransmission && (
            <p className="text-xs text-gray-500 ml-7">
              {t('calculationParams.flankingTransmissionNote')}
            </p>
          )}

          {/* Optional: Safety margin for results (post-processing only) */}
          {includeFlankingTransmission && (
            <div className="form-group max-w-xs">
              <label className="form-label">{t('calculationParams.safetyMargin')} ({t('calculationParams.optional')})</label>
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
          )}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">{t('calculationParams.calculationInfo')}</h4>
          <p className="text-sm text-blue-800">
            {includeFlankingTransmission 
              ? t('calculationParams.iso12354Mode') 
              : t('calculationParams.din4109Mode')}
          </p>
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
