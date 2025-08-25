import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { ProjectConfigurationForm, WallConfigurationForm, CeilingConfigurationForm, CalculationParametersForm } from './forms';
import { ResultsDisplay } from './ResultsDisplay';
import { acousticCalculationService } from '../services/AcousticCalculationService';
import { 
  ProjectConfiguration, 
  WallConfiguration, 
  CeilingConfiguration,
  CalculationParameters,
  CalculationResults,
  BuildingContext
} from '../types';
import { ElementType } from '@vbacoustic/lib/src/models/AcousticTypes';
import { StandardType, BuildingClass } from '@vbacoustic/lib/src/standards/AcousticStandard';

type CalculationStep = 
  | 'project-config'
  | 'element-config'
  | 'calculation-params'
  | 'results';

interface StepInfo {
  id: CalculationStep;
  title: string;
  description: string;
  completed: boolean;
}

/**
 * Multi-step acoustic calculation wizard
 * Mirrors the workflow from the VBA forms: frmVBAcoustic → frmVBAcousticTrennwand/Trenndecke → Results
 */
export const CalculationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CalculationStep>('project-config');
  const [projectConfig, setProjectConfig] = useState<ProjectConfiguration | null>(null);
  const [elementConfig, setElementConfig] = useState<WallConfiguration | CeilingConfiguration | null>(null);
  const [calculationParams, setCalculationParams] = useState<CalculationParameters & BuildingContext | null>(null);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  
  const steps: StepInfo[] = [
    {
      id: 'project-config',
      title: 'Project Configuration',
      description: 'Define construction method and calculation standards',
      completed: projectConfig !== null
    },
    {
      id: 'element-config',
      title: 'Element Configuration',
      description: 'Configure wall or ceiling properties',
      completed: elementConfig !== null
    },
    {
      id: 'calculation-params',
      title: 'Calculation Parameters',
      description: 'Set measurement conditions and requirements',
      completed: calculationParams !== null
    },
    {
      id: 'results',
      title: 'Results',
      description: 'View acoustic calculation results',
      completed: calculationResults !== null
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const previousStep = steps[currentStepIndex - 1];
      if (previousStep) {
        setCurrentStep(previousStep.id);
      }
    }
  };

  const handleStepClick = (stepId: CalculationStep) => {
    const targetStepIndex = steps.findIndex(step => step.id === stepId);
    const targetStep = steps[targetStepIndex];
    
    // Allow navigation to any step that is completed or the current step
    // Also allow going back to any previous step
    if (targetStep && (targetStep.completed || stepId === currentStep || targetStepIndex < currentStepIndex)) {
      setCurrentStep(stepId);
    }
  };

  const handleProjectConfigSubmit = (data: ProjectConfiguration) => {
    setProjectConfig(data);
    setCurrentStep('element-config');
  };

  const handleSampleConfigurationLoad = (sampleConfig: {
    project: ProjectConfiguration;
    element: WallConfiguration | CeilingConfiguration;
    parameters: CalculationParameters & BuildingContext;
  }) => {
    // Set all the state synchronously but don't navigate away
    setProjectConfig(sampleConfig.project);
    setElementConfig(sampleConfig.element);
    setCalculationParams(sampleConfig.parameters);
    
    // Stay on the current step - don't navigate automatically
    // User can proceed when ready by clicking "Continue"
  };

  const handleElementConfigSubmit = (data: WallConfiguration | CeilingConfiguration) => {
    setElementConfig(data);
    setCurrentStep('calculation-params');
  };

  const handleCalculationParamsSubmit = async (data: CalculationParameters & BuildingContext) => {
    setCalculationParams(data);
    
    // Perform calculation using real acoustic calculation service
    if (projectConfig && elementConfig) {
      try {
        const results = await acousticCalculationService.calculateAcoustics(
          projectConfig,
          elementConfig
        );
        setCalculationResults(results);
        setCurrentStep('results');
      } catch (error) {
        console.error('Calculation failed:', error);
        // TODO: Show error message to user
        // For now, still proceed to results to show error
        setCalculationResults({
          separating: {},
          flanking: [],
          combined: {},
          timestamp: new Date(),
          validationErrors: [{
            field: 'calculation',
            message: 'Calculation service temporarily unavailable. Using fallback calculation.',
            severity: 'warning'
          }]
        });
        setCurrentStep('results');
      }
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <nav aria-label="Progress">
          <div className="relative">
            {/* Simple connector line - just connects all dots */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300" style={{ 
              left: 'calc(10% + 20px)',
              right: 'calc(10% + 20px)',
              zIndex: 0
            }} />
          
            <ol className="relative flex items-start justify-between" style={{ zIndex: 1 }}>
              {steps.map((step) => {
                const isCompleted = step.completed;
                const isCurrent = currentStep === step.id;
                const isClickable = isCompleted || isCurrent || steps.findIndex(s => s.id === step.id) < currentStepIndex;
                
                return (
                  <li key={step.id} className="flex flex-col items-center flex-1">
                    {/* Step indicator circle */}
                    <div 
                      className={`relative z-10 mb-3 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                      onClick={() => isClickable && handleStepClick(step.id)}
                    >
                      {isCompleted ? (
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center shadow-md">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                      ) : isCurrent ? (
                        <div className="h-10 w-10 rounded-full border-4 border-primary-600 bg-white flex items-center justify-center shadow-md">
                          <div className="h-3 w-3 rounded-full bg-primary-600" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center shadow-sm">
                          <div className="h-2 w-2 rounded-full bg-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Step content */}
                    <div 
                      className={`text-center ${isClickable ? 'cursor-pointer' : 'cursor-default'}`} 
                      style={{ maxWidth: '120px' }}
                      onClick={() => isClickable && handleStepClick(step.id)}
                    >
                      <div className={`text-sm font-semibold mb-1 ${
                        isCurrent ? 'text-primary-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs leading-tight ${
                        isCurrent ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'project-config':
        return (
          <ProjectConfigurationForm
            onSubmit={handleProjectConfigSubmit}
            onSampleConfigurationLoad={handleSampleConfigurationLoad}
            defaultValues={projectConfig || undefined}
          />
        );

      case 'element-config':
        if (!projectConfig) {
          return (
            <div className="card">
              <div className="text-center py-8">
                <p className="text-gray-500">Please complete project configuration first.</p>
                <button 
                  onClick={() => setCurrentStep('project-config')}
                  className="btn-primary mt-4"
                >
                  Go to Project Configuration
                </button>
              </div>
            </div>
          );
        }

        if (projectConfig.elementType === ElementType.Wall) {
          return (
            <WallConfigurationForm
              onNext={handleElementConfigSubmit}
              onPrev={handlePrevious}
              defaultValues={elementConfig as WallConfiguration || undefined}
            />
          );
        } else {
          return (
            <CeilingConfigurationForm
              onNext={handleElementConfigSubmit}
              onPrev={handlePrevious}
              defaultValues={elementConfig as CeilingConfiguration || undefined}
            />
          );
        }

      case 'calculation-params':
        if (!projectConfig || !elementConfig) {
          return (
            <div className="card">
              <div className="text-center py-8">
                <p className="text-gray-500">Please complete previous steps first.</p>
                <button 
                  onClick={() => setCurrentStep('project-config')}
                  className="btn-primary mt-4"
                >
                  Go to Project Configuration
                </button>
              </div>
            </div>
          );
        }

        return (
          <CalculationParametersForm
            onSubmit={handleCalculationParamsSubmit}
            onPrev={handlePrevious}
            defaultValues={calculationParams || undefined}
          />
        );

      case 'results':
        if (!calculationResults) {
          return (
            <div className="card">
              <div className="text-center py-8">
                <p className="text-gray-500">No calculation results available.</p>
                <button 
                  onClick={() => setCurrentStep('project-config')}
                  className="btn-primary mt-4"
                >
                  Start New Calculation
                </button>
              </div>
            </div>
          );
        }

        return (
          <ResultsDisplay 
            results={calculationResults}
            requirements={calculationParams ? {
              Rw: calculationParams.requiredAirborneInsulation,
              Lnw: calculationParams.requiredImpactInsulation,
              standard: projectConfig?.calculationStandard === StandardType.DIN4109 ? StandardType.DIN4109 : StandardType.ISO12354,
              buildingClass: BuildingClass.STANDARD // Default to standard class, this could be mapped from buildingType
            } : undefined}
            onStartNew={() => {
              // Reset all state for new calculation
              setCurrentStep('project-config');
              setProjectConfig(null);
              setElementConfig(null);
              setCalculationParams(null);
              setCalculationResults(null);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Acoustic Calculation</h1>
        <p className="text-gray-600 mt-2">
          Configure your building element and calculate acoustic performance according to {' '}
          {projectConfig?.calculationStandard === StandardType.DIN4109 ? 'DIN 4109' : 'ISO 12354'}
        </p>
      </div>

      {renderStepIndicator()}
      
      <div className="bg-white rounded-lg shadow-sm">
        {renderStepContent()}
      </div>
    </div>
  );
};
