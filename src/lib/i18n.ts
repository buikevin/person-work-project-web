import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translation files
import viCommon from '../locales/vi/common.json';
import viUser from '../locales/vi/user.json';
import viDashboard from '../locales/vi/dashboard.json';
import viProjects from '../locales/vi/projects.json';
import viEmail from '../locales/vi/email.json';
import viChat from '../locales/vi/chat.json';

import enCommon from '../locales/en/common.json';
import enUser from '../locales/en/user.json';
import enDashboard from '../locales/en/dashboard.json';
import enProjects from '../locales/en/projects.json';
import enEmail from '../locales/en/email.json';
import enChat from '../locales/en/chat.json';

const resources = {
  vi: {
    common: viCommon,
    user: viUser,
    dashboard: viDashboard,
    projects: viProjects,
    email: viEmail,
    chat: viChat,
  },
  en: {
    common: enCommon,
    user: enUser,
    dashboard: enDashboard,
    projects: enProjects,
    email: enEmail,
    chat: enChat,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'vi', // get from localStorage or default to 'vi'
    fallbackLng: 'en',
    debug: false,

    // Namespace configuration
    ns: ['common', 'user', 'dashboard', 'projects', 'email', 'chat'],
    defaultNS: 'common',

    keySeparator: '.',
    nsSeparator: ':',

    interpolation: {
      escapeValue: false,
    },

    // React specific configuration
    react: {
      useSuspense: false,
    },
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
