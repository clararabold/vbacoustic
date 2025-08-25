import { useTranslation } from 'react-i18next';

const Results = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('results.title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('results.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Results */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('results.acousticPerformance')}</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-700">{t('results.weightedSoundReduction')}</span>
              <span className="text-lg font-semibold text-gray-900">-- dB</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-700">Spectrum Adaptation C</span>
              <span className="text-lg font-semibold text-gray-900">-- dB</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-700">Spectrum Adaptation Ctr</span>
              <span className="text-lg font-semibold text-gray-900">-- dB</span>
            </div>
          </div>
        </div>

        {/* Flanking Analysis */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Flanking Transmission</h2>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              No flanking elements configured. Add flanking elements for complete analysis.
            </div>
          </div>
        </div>

        {/* Standards Compliance */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('results.standardsCompliance')}</h2>
          <div className="space-y-3">
            <div className="alert-warning">
              <p className="text-sm">
                {t('results.completeCalculation')}
              </p>
            </div>
          </div>
        </div>

        {/* Frequency Analysis */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('results.frequencyAnalysis')}</h2>
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">{t('results.frequencyChartPlaceholder')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
