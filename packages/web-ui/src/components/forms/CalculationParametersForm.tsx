import React from 'react';
import { useForm } from 'react-hook-form';
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
        { value: 'living', label: 'Living Areas' },
        { value: 'sleeping', label: 'Sleeping Areas' },
        { value: 'kitchen', label: 'Kitchen/Dining' },
        { value: 'bathroom', label: 'Bathroom/WC' }
      ],
      office: [
        { value: 'open-office', label: 'Open Office' },
        { value: 'meeting-room', label: 'Meeting Room' },
        { value: 'private-office', label: 'Private Office' },
        { value: 'corridor', label: 'Corridor' }
      ],
      educational: [
        { value: 'classroom', label: 'Classroom' },
        { value: 'lecture-hall', label: 'Lecture Hall' },
        { value: 'library', label: 'Library' },
        { value: 'laboratory', label: 'Laboratory' }
      ],
      healthcare: [
        { value: 'patient-room', label: 'Patient Room' },
        { value: 'operating-room', label: 'Operating Room' },
        { value: 'waiting-area', label: 'Waiting Area' },
        { value: 'treatment-room', label: 'Treatment Room' }
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
        <h3 className="text-lg font-medium text-gray-900 mb-6">Building Context</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Building Type</label>
            <select 
              {...register('buildingType', { required: 'Building type is required' })}
              className="form-select"
            >
              <option value="residential">Residential</option>
              <option value="office">Office</option>
              <option value="educational">Educational</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Usage Category</label>
            <select 
              {...register('usageCategory', { required: 'Usage category is required' })}
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
        <h3 className="text-lg font-medium text-gray-900 mb-6">Acoustic Requirements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">
              Required Airborne Sound Insulation (DnT,w) [dB]
            </label>
            <input
              type="number"
              step="1"
              min="30"
              max="70"
              {...register('requiredAirborneInsulation', { 
                required: 'Airborne insulation requirement is required',
                min: { value: 30, message: 'Minimum value is 30 dB' },
                max: { value: 70, message: 'Maximum value is 70 dB' }
              })}
              className="form-input"
              placeholder="55"
            />
            <p className="text-xs text-gray-500 mt-1">
              Standard requirement for selected usage type
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Required Impact Sound Insulation (L'nT,w) [dB]
            </label>
            <input
              type="number"
              step="1"
              min="40"
              max="65"
              {...register('requiredImpactInsulation', { 
                required: 'Impact insulation requirement is required',
                min: { value: 40, message: 'Minimum value is 40 dB' },
                max: { value: 65, message: 'Maximum value is 65 dB' }
              })}
              className="form-input"
              placeholder="53"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum allowed impact sound level
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">DIN 4109 Reference Values</h4>
          <p className="text-sm text-blue-800">
            For {buildingType} buildings with {getBuildingTypeOptions().find(opt => opt.value === watch('usageCategory'))?.label.toLowerCase()} usage:
            <br />
            • Airborne: {getRequiredInsulationValues(buildingType, watch('usageCategory')).airborne} dB
            • Impact: {getRequiredInsulationValues(buildingType, watch('usageCategory')).impact} dB
          </p>
        </div>
      </div>

      {/* Calculation Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Calculation Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Frequency Range</label>
            <select 
              {...register('frequencyRange', { required: 'Frequency range is required' })}
              className="form-select"
            >
              <option value="100-3150">100 - 3150 Hz (Standard)</option>
              <option value="50-5000">50 - 5000 Hz (Extended)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Standard range covers most building acoustics applications
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Safety Margin [dB]</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              {...register('safetyMargin', { 
                min: { value: 0, message: 'Minimum safety margin is 0 dB' },
                max: { value: 10, message: 'Maximum safety margin is 10 dB' }
              })}
              className="form-input"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Additional margin for calculation uncertainty
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
              Include Flanking Transmission
            </label>
          </div>
          {includeFlankingTransmission && (
            <p className="text-xs text-gray-500 ml-7">
              Calculates sound transmission through flanking elements according to ISO 12354
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
              Include Structural Resonances
            </label>
          </div>
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Environmental Conditions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Temperature [°C]</label>
            <input
              type="number"
              step="1"
              min="15"
              max="30"
              {...register('temperature', { 
                min: { value: 15, message: 'Minimum temperature is 15°C' },
                max: { value: 30, message: 'Maximum temperature is 30°C' }
              })}
              className="form-input"
              placeholder="20"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Relative Humidity [%]</label>
            <input
              type="number"
              step="5"
              min="30"
              max="80"
              {...register('humidity', { 
                min: { value: 30, message: 'Minimum humidity is 30%' },
                max: { value: 80, message: 'Maximum humidity is 80%' }
              })}
              className="form-input"
              placeholder="50"
            />
          </div>
        </div>
      </div>

      {/* Measurement Data (Optional) */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Measurement Data (Optional)</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            If you have measurement data available, you can input it here for comparison with calculated values.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">Measured Airborne Insulation [dB]</label>
              <input
                type="number"
                step="0.1"
                {...register('measurementData.airborneInsulation')}
                className="form-input"
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Measured Impact Insulation [dB]</label>
              <input
                type="number"
                step="0.1"
                {...register('measurementData.impactInsulation')}
                className="form-input"
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Measurement Standard</label>
              <select 
                {...register('measurementData.measurementStandard')}
                className="form-select"
              >
                <option value="">Select standard</option>
                <option value="iso140">ISO 140 (Laboratory)</option>
                <option value="iso16283">ISO 16283 (Field)</option>
              </select>
            </div>
          </div>
        </div>
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
      </form>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onPrev}
          >
            Back to Element Configuration
          </button>
          <button type="submit" form="calculation-form" className="btn-primary">
            Calculate Acoustic Performance
          </button>
        </div>
      </div>
    </div>
  );
};
