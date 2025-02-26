import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import APP_TRANSLATIONS_EN from 'translations/en/application.json';
import COMMON_TRANSLATIONS_EN from 'translations/en/common.json';
import APP_TRANSLATIONS_ES from 'translations/es/application.json';
import COMMON_TRANSLATIONS_ES from 'translations/es/common.json';

i18next
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        ns: ['app', 'common'],
        defaultNS: 'app',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        resources: {
            en: {
                app: APP_TRANSLATIONS_EN,
                common: COMMON_TRANSLATIONS_EN
            },
            es: {
                app: APP_TRANSLATIONS_ES,
                common: COMMON_TRANSLATIONS_ES
            }
        }
    });
