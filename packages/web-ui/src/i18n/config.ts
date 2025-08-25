import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import deTranslations from './locales/de.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  de: {
    translation: deTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de', // Default to German since this is primarily for German market
    debug: process.env.NODE_ENV === 'development',
    
    // Save missing translations for development
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: function(lng, _ns, key, _fallbackValue) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: [${lng}] ${key}`);
      }
    },

    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
