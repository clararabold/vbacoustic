import { CheckCircle, AlertTriangle, XCircle, Download, Calculator, Info } from 'lucide-react';
import { 
  CalculationResults
} from '../types/CalculationTypes';
import { StandardType, BuildingClass } from '@vbacoustic/lib/src/standards/AcousticStandard';

interface RequirementCheck {
  parameter: string;
  required: number;
  actual: number;
  unit: string;
  passed: boolean;
  margin: number;
}

interface ResultsDisplayProps {
  results: CalculationResults;
  requirements?: {
    Rw?: number;
    Lnw?: number;
    standard: StandardType;
    buildingClass?: BuildingClass;
  };
  onStartNew?: () => void;
  onExportResults?: () => void;
}

export function ResultsDisplay({ 
  results, 
  requirements, 
  onStartNew, 
  onExportResults 
}: ResultsDisplayProps) {
  
  // Calculate requirement compliance
  const requirementChecks: RequirementCheck[] = [];
  
  if (requirements?.Rw && results.combined.Rw) {
    requirementChecks.push({
      parameter: 'Luftschalldämmung R\'w',
      required: requirements.Rw,
      actual: results.combined.Rw,
      unit: 'dB',
      passed: results.combined.Rw >= requirements.Rw,
      margin: results.combined.Rw - requirements.Rw
    });
  }
  
  if (requirements?.Lnw && results.combined.Lnw) {
    requirementChecks.push({
      parameter: 'Trittschalldämmung L\'n,w',
      required: requirements.Lnw,
      actual: results.combined.Lnw,
      unit: 'dB',
      passed: results.combined.Lnw <= requirements.Lnw,
      margin: requirements.Lnw - results.combined.Lnw
    });
  }

  const hasErrors = results.validationErrors?.some(e => e.severity === 'error');
  const hasWarnings = results.validationErrors?.some(e => e.severity === 'warning');
  const allRequirementsPassed = requirementChecks.every(check => check.passed);

  return (
    <div className="space-y-6">
      {/* Header with Overall Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Berechnungsergebnisse</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {results.timestamp.toLocaleString('de-DE')}
            </span>
            {allRequirementsPassed && !hasErrors ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="font-medium">Anforderungen erfüllt</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" />
                <span className="font-medium">Anforderungen nicht erfüllt</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Airborne Sound Insulation */}
          {results.combined.Rw && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Luftschalldämmung</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.combined.Rw.toFixed(1)} dB
                  </p>
                  <p className="text-xs text-blue-700">R'w</p>
                </div>
                <Calculator className="h-8 w-8 text-blue-400" />
              </div>
              {results.combined.C && (
                <p className="text-xs text-blue-600 mt-1">
                  C = {results.combined.C > 0 ? '+' : ''}{results.combined.C.toFixed(1)} dB
                </p>
              )}
            </div>
          )}

          {/* Impact Sound Insulation */}
          {results.combined.Lnw && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900">Trittschalldämmung</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.combined.Lnw.toFixed(1)} dB
                  </p>
                  <p className="text-xs text-purple-700">L'n,w</p>
                </div>
                <Calculator className="h-8 w-8 text-purple-400" />
              </div>
              {results.combined.CI && (
                <p className="text-xs text-purple-600 mt-1">
                  CI = {results.combined.CI > 0 ? '+' : ''}{results.combined.CI.toFixed(1)} dB
                </p>
              )}
            </div>
          )}

          {/* Flanking Transmission Count */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Nebenwege</p>
                <p className="text-2xl font-bold text-gray-600">
                  {results.flanking.filter(p => p.isActive).length}
                </p>
                <p className="text-xs text-gray-700">aktive Pfade</p>
              </div>
              <Info className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Compliance */}
      {requirementChecks.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Anforderungsvergleich ({requirements?.standard})</h3>
          <div className="space-y-3">
            {requirementChecks.map((check, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  check.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center">
                  {check.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{check.parameter}</p>
                    <p className="text-sm text-gray-600">
                      Anforderung: {check.parameter.includes('Trittschall') ? '≤' : '≥'} {check.required} {check.unit}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${check.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {check.actual.toFixed(1)} {check.unit}
                  </p>
                  <p className={`text-sm ${check.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {check.margin > 0 ? '+' : ''}{check.margin.toFixed(1)} {check.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Results Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Direct Transmission */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Direkter Übertragungsweg</h3>
          <div className="space-y-3">
            {results.separating.Rw && (
              <div className="flex justify-between">
                <span className="text-gray-600">Schalldämmmaß Rw:</span>
                <span className="font-medium">{results.separating.Rw.toFixed(1)} dB</span>
              </div>
            )}
            {results.separating.Lnw && (
              <div className="flex justify-between">
                <span className="text-gray-600">Trittschallpegel L'n,w:</span>
                <span className="font-medium">{results.separating.Lnw.toFixed(1)} dB</span>
              </div>
            )}
            {results.separating.C && (
              <div className="flex justify-between">
                <span className="text-gray-600">Spektrum-Anpassungswert C:</span>
                <span className="font-medium">
                  {results.separating.C > 0 ? '+' : ''}{results.separating.C.toFixed(1)} dB
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Flanking Transmission */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Flankenübertragung</h3>
          <div className="space-y-2">
            {results.flanking.filter(p => p.isActive).length === 0 ? (
              <p className="text-gray-500 italic">Keine aktiven Nebenwege</p>
            ) : (
              results.flanking
                .filter(p => p.isActive)
                .map((path) => (
                  <div key={path.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <span className="font-medium text-sm">{path.pathType}</span>
                      <p className="text-xs text-gray-600">{path.description}</p>
                    </div>
                    <span className="font-medium">{path.transmissionValue.toFixed(1)} dB</span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      {(hasErrors || hasWarnings) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Validierung</h3>
          <div className="space-y-2">
            {results.validationErrors?.map((error, index) => (
              <div 
                key={index}
                className={`flex items-start p-3 rounded-lg ${
                  error.severity === 'error' 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                {error.severity === 'error' ? (
                  <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${
                    error.severity === 'error' ? 'text-red-900' : 'text-yellow-900'
                  }`}>
                    {error.field}
                  </p>
                  <p className={`text-sm ${
                    error.severity === 'error' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {error.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            {onStartNew && (
              <button
                onClick={onStartNew}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Neue Berechnung
              </button>
            )}
            {onExportResults && (
              <button
                onClick={onExportResults}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Ergebnisse exportieren
              </button>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Berechnung nach {requirements?.standard || StandardType.DIN4109}</p>
            {requirements?.buildingClass && (
              <p>Gebäudeklasse: {requirements.buildingClass}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
