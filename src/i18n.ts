import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { getStorageValue } from 'utils/functions';
import LanguageDetector from 'i18next-browser-languagedetector';
import { isDevEnv, supportedLanguages } from 'utils/constants';

const selectedCountry = getStorageValue('ctryCode', 'GB');
const lang = selectedCountry === 'GB' ? 'en' : selectedCountry.toLowerCase();

i18n
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // lng: lang,
    fallbackLng: lang,
    debug: isDevEnv ? true : false,
    nonExplicitSupportedLngs: true,
    supportedLngs: supportedLanguages,
  });

export default i18n;
