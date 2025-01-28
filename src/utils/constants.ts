import * as routes from 'routes';

export const authRoutes = [
  routes.staff,
  routes.profile,
  routes.protocol,
  routes.help,
  routes.patients,
  routes.monitoring,
  routes.institutions,
  routes.submitFeedback,
  routes.systemInfo,
  routes.termOfUse,
];

export const colors = {
  blue: {
    dark: '#1e477f',
    DEFAULT: '#005392',
    lighter: '#4da0e6',
    navy: '#013258',
    faded: '#dfeaf3',
  },
  black: {
    DEFAULT: '#303c45',
    light: '#696f83',
    lighter: '#89959f',
  },
  dashboard: '#f4f8fb',
  gray: {
    DEFAULT: '#c1cad1',
    light: '#d9E4ee',
    lightest: '#f7f9fc',
  },
  warning: {
    DEFAULT: '#ec3d40',
    lighter: '#f4e1e4',
  },
  orange: {
    DEFAULT: '#fe991d',
    smartPDT: '#f2971b',
  },
};

export const isDevEnv = import.meta.env.DEV;
export const isProdEnv = import.meta.env.PROD;

//* Edit all three CONSTANTS below when expanding language support
export const supportedCtryCodes = ['GB', 'ES', 'IT', 'DE'];
export const supportedLanguages = ['en', 'es', 'it', 'de'] as const;
export const customCtryLabels = {
  GB: 'English',
  IT: 'Italiano',
  ES: 'Español',
  DE: 'Deutsch',
};
