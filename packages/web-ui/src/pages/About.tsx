import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="prose prose-lg max-w-7xl">
        <h1 className="pt-6 mb-0">{t('about.title')}</h1>

        <p className="mt-0">
          {t('about.description')}
        </p>

        <h2 className="pt-6 mb-0">{t('about.supportedStandards')}</h2>
        <ul className="mt-0">
          <li><strong>DIN 4109</strong> - {t('about.din4109Desc')}</li>
          <li><strong>ISO 12354</strong> - {t('about.iso12354Desc')}</li>
        </ul>

        <h2 className="pt-6 mb-0">{t('about.technicalImplementation')}</h2>
        <p className="mt-0">
          {t('about.technicalDesc')}
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-8">
          <h3 className="text-blue-900 font-semibold mb-0">Getting Started</h3>
          <p className="text-blue-800 mt-0">
            To begin using the calculator, navigate to the Calculator page and follow the 
            step-by-step wizard to input your building element properties and calculation parameters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
