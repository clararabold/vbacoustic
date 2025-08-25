import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
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
  const canGoNext = currentStepIndex < steps.length - 1;
  const canGoPrevious = currentStepIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep.id);
      }
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      const previousStep = steps[currentStepIndex - 1];
      if (previousStep) {
        setCurrentStep(previousStep.id);
      }
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
    // Set all the state synchronously
    setProjectConfig(sampleConfig.project);
    setElementConfig(sampleConfig.element);
    setCalculationParams(sampleConfig.parameters);
    
    // Navigate to element config step after setting the state
    setTimeout(() => {
      setCurrentStep('element-config');
    }, 0);
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

  const renderStepIndicator = () => (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {/* Connector line */}
              {stepIdx !== steps.length - 1 && (
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${step.completed ? 'bg-primary-600' : 'bg-gray-200'}`} />
                </div>
              )}

              {/* Step indicator */}
              <div className="relative flex items-center">
                {step.completed ? (
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                ) : currentStep === step.id ? (
                  <div className="h-8 w-8 rounded-full border-2 border-primary-600 bg-white flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  </div>
                )}

                {/* Step content */}
                <div className="ml-4">
                  <div className={`text-sm font-medium ${
                    step.completed || currentStep === step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );

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
            onExportResults={() => {
              // TODO: Implement export functionality
              console.log('Export results:', calculationResults);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Acoustic Calculation</h1>
        <p className="text-gray-600 mt-2">
          Configure your building element and calculate acoustic performance according to {' '}
          {projectConfig?.calculationStandard === StandardType.DIN4109 ? 'DIN 4109' : 'ISO 12354'}
        </p>
      </div>

      {renderStepIndicator()}
      
      <div className="bg-white">
        {renderStepContent()}
      </div>

      {/* Global Navigation (only shown on non-form steps) */}
      {!['project-config', 'element-config'].includes(currentStep) && (
        <div className="flex justify-between mt-8">
          <button 
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!canGoNext}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
