import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CalculationStep = {
  ElementType: 'element-type',
  ElementDetails: 'element-details', 
  FlankingElements: 'flanking-elements',
  Parameters: 'parameters',
  Results: 'results'
} as const;

type CalculationStepType = typeof CalculationStep[keyof typeof CalculationStep];

const Calculator = () => {
  const [currentStep, setCurrentStep] = useState<CalculationStepType>(CalculationStep.ElementType);
  
  const steps = [
    { id: CalculationStep.ElementType, title: 'Element Type', description: 'Select construction type' },
    { id: CalculationStep.ElementDetails, title: 'Element Details', description: 'Configure element properties' },
    { id: CalculationStep.FlankingElements, title: 'Flanking Elements', description: 'Add flanking elements' },
    { id: CalculationStep.Parameters, title: 'Parameters', description: 'Set calculation parameters' },
    { id: CalculationStep.Results, title: 'Results', description: 'View calculation results' }
  ];

  const handleNext = () => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]!.id);
    }
  };

  const handlePrevious = () => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]!.id);
    }
  };

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case CalculationStep.ElementType:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Select Construction Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Wall', 'Floor', 'Ceiling'].map((type) => (
                <button
                  key={type}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200"
                >
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-900">{type}</h4>
                    <p className="text-sm text-gray-500 mt-2">
                      Configure {type.toLowerCase()} acoustic properties
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case CalculationStep.ElementDetails:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Element Configuration</h3>
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Construction Category</label>
                  <select className="form-select">
                    <option>Massivbau (Solid Construction)</option>
                    <option>Massivholzbau (Mass Timber)</option>
                    <option>Leichtbau (Lightweight)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Material Type</label>
                  <select className="form-select">
                    <option>Concrete</option>
                    <option>Masonry</option>
                    <option>Mass Timber</option>
                    <option>Lightweight Concrete</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Thickness (mm)</label>
                  <input type="number" className="form-input" placeholder="Enter thickness" />
                </div>
                <div className="form-group">
                  <label className="form-label">Surface Mass (kg/m²)</label>
                  <input type="number" className="form-input" placeholder="Enter surface mass" />
                </div>
              </div>
            </div>
          </div>
        );

      case CalculationStep.FlankingElements:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Flanking Elements</h3>
            <div className="card">
              <p className="text-gray-600 mb-4">
                Add flanking elements that connect to the separating element for accurate acoustic calculations.
              </p>
              <button className="btn-secondary">
                + Add Flanking Element
              </button>
            </div>
          </div>
        );

      case CalculationStep.Parameters:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Calculation Parameters</h3>
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Standard</label>
                  <select className="form-select">
                    <option>DIN 4109</option>
                    <option>ISO 12354</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Separating Area (m²)</label>
                  <input type="number" className="form-input" defaultValue="10" />
                </div>
              </div>
            </div>
          </div>
        );

      case CalculationStep.Results:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Calculation Results</h3>
            <div className="card">
              <p className="text-gray-600">
                Results will be displayed here after completing the calculation.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      index <= currentStepIndex
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 h-0.5 bg-gray-200" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Calculator;
