import moment from 'moment';
import i18next from 'i18next';
import 'utils/imports/moment-lang';
import type { Row } from 'react-table';
import { finishedReason } from './options';
import { matchSorter } from 'match-sorter';
import { RemoveCookieType } from 'AppProvider';
import { supportedLanguages } from './constants';
import {
  SessionStateEnums,
  SessionStateOptions,
} from '~/pages/Patients/components/PatientSchedule/api/query.d';
import { FinishedReasonsOptions } from './options.d';

const t = i18next?.t.bind(i18next);

export type PlaceResult = google.maps.places.PlaceResult;
export type PlacesResultsType = { results: PlaceResult[] };

export function getStorageValue<T>(key: string, defaultValue: T) {
  // getting stored value
  try {
    const saved = localStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial || defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function fuzzyTextFilterFn<T extends object>(
  rows: Row<T>[],
  _id: string[],
  filterValue: string
) {
  return matchSorter(rows, filterValue, {
    keys: [(row) => row?.values?.id[0]],
  });
}

export const getUserLanguage = () => {
  const storedLng = localStorage.getItem('i18nextLng')?.slice(0, 2) || 'en';
  return supportedLanguages.find((supLang) => supLang === storedLng) || 'en';
};

export function getCurrentHour() {
  const date = new Date();
  date.setMinutes(0);
  date.toDateString();
  return date;
}

export const getLabelFromKey = (
  value: string | number | boolean,
  options: { value: number | string | boolean; label: string }[]
) => {
  return options.find((option) => value === option.value)?.label || '-';
};

export const getPredefinedProtocolLabel = (
  value: string,
  options: { value: string; label: string }[]
) => {
  return options.find((option) => value === option.value)?.label || '-';
};

export const getFinishedReason = (value: FinishedReasonsOptions) => {
  const options = finishedReason();
  return (
    options.find((option) => value === option.value)?.label || t('unknown')
  );
};

export const getLabelFromID = (
  id: string | number,
  options: { id: string | number; label: string }[]
) => {
  return options.find((option) => id === option.id)?.label || '-';
};

export const getISODateFormat = (value: Date) => {
  return Math.round(moment(value).valueOf() / 1000);
};

export const getYearFromDate = (value: Date) => {
  return Number(moment(value).format('YYYY'));
};

export const isValidUnixDate = (unix: number) => {
  return moment.unix(unix).isValid();
};

export const getDateFromUnix = (
  unix: number,
  format: string = 'DD-MM-YYYY'
) => {
  const lang = getUserLanguage();
  const dateisValid = unix && moment(unix, 'X', true).isValid();
  return dateisValid ? moment.unix(unix).locale(lang).format(format) : '-';
};

export const getTimeFromUnix = (unix: number) => {
  const dateisValid = unix && moment(unix, 'X', true).isValid();
  return dateisValid ? moment.unix(unix).format('HH:mm') : '-';
};

export const getDateFromIsoDateFormat = (value: string, format: string) => {
  return moment(value, format).format('DD-MM-YYYY');
};

export const getStringDateFormat = (unix: number) => {
  const dateisValid = unix && moment(unix, 'X', true).isValid();
  return dateisValid ? moment.unix(unix).toDate() : '';
};

export const formatStringDate = (
  date: string,
  formatFrom: string,
  formatTo?: string
) => {
  return moment(date, formatFrom).format(formatTo || 'DD-MM-YYYY');
};

export const getTimes = (unix: number) => {
  const dateisValid = unix && moment(unix, 'X', true).isValid();
  return dateisValid ? moment.unix(unix).toDate() : 'N/A';
};

export const getTimeStampFromYear = (value: number) => {
  if (value && Number(value) >= 1000 && Number(value) <= 9999) {
    return new Date(value, 10, 11);
  }
  return null;
};

export function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

export function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}
export const getDurationFromUnix = (unixStart: number, unixEnd: number) => {
  const start = moment.unix(unixStart);
  const end = moment.unix(unixEnd);
  return end.diff(start, 'minutes');
};

export const getUVIndexText = (uvIndex: number) => {
  switch (true) {
    case uvIndex >= 11:
      return '11+ ' + t('option.uv_index.extreme');
    case uvIndex >= 8:
      return '8-10 ' + t('option.uv_index.very_high');
    case uvIndex >= 6:
      return '6-7 ' + t('option.uv_index.high');
    case uvIndex >= 3:
      return '3-5 ' + t('option.uv_index.moderate');
    case uvIndex >= 0:
      return '0-2 ' + t('option.uv_index.low');
    default:
      return '-';
  }
};

export const formatTimeSeconds = (seconds: number) => {
  const hours = seconds / 3600;
  const roundedHours = Math.floor(seconds / 3600);
  const minutes = Math.floor((hours - roundedHours) * 60);
  return `${roundedHours}h ${minutes}m`;
};

export const isTreatmentOverdue = (treatment: {
  date_time_slot: number;
  treatment_status: SessionStateOptions;
}) => {
  const { treatment_status, date_time_slot } = treatment;
  return date_time_slot &&
    treatment_status === SessionStateEnums.SCHEDULED &&
    moment.unix(date_time_slot).isBefore(moment(), 'day')
    ? true
    : false;
};

export const isUnixTimePastCurrentTime = (unix: number) => {
  return moment.unix(unix).isBefore(moment());
};

export const isTreatmentDeclined = (treatment: {
  accepted: null | boolean;
  treatment_status: SessionStateOptions;
  reschedule_reason: null | string;
}) => {
  const { treatment_status, accepted } = treatment;
  return treatment_status === SessionStateEnums.SCHEDULED &&
    accepted === false &&
    treatment.reschedule_reason
    ? true
    : false;
};

export const userLogoutCleanUp = (removeCookie: RemoveCookieType) => {
  try {
    localStorage.clear();
    removeCookie('user', { path: '/' });
  } catch (error) {
    console.error(error);
  }
};

export const geocodeFetch = (lat: number, lon: number) => {
  const language = getUserLanguage();
  const key = import.meta.env.REACT_APP_ADDRESS_API;
  return import('geocoder' as any).then(
    (geocode) =>
      new Promise<{ err: Error } | PlacesResultsType>((resolve, reject) =>
        geocode.reverseGeocode(
          lat,
          lon,
          (err: Error, data: PlacesResultsType) =>
            err ? reject(err) : resolve(data),
          { language, key }
        )
      )
  );
};

export const extractUserAddress = (data: PlacesResultsType) => {
  const streetAddress = data?.results?.find(
    (address) => address.types?.includes('street_address')
  )?.formatted_address;
  const postalTownAddress = data?.results.find(
    (address) => address.types?.includes('postal_town')
  )?.formatted_address;
  const politicalAddress = data?.results.find(
    (address) =>
      address?.types?.includes('political') &&
      !address.types.includes('neighborhood')
  )?.formatted_address;

  const address =
    streetAddress ||
    postalTownAddress ||
    politicalAddress ||
    data?.results[0]?.formatted_address;
  return address;
};

export const getUserLocation = (data: PlacesResultsType) => {
  const streetAddress = data?.results?.find(
    (address) => address.types?.includes('street_address')
  )?.formatted_address;
  const postalTownAddress = data?.results.find(
    (address) => address.types?.includes('postal_town')
  )?.formatted_address;
  const politicalAddress = data?.results.find(
    (address) =>
      address.types?.includes('political') &&
      !address.types?.includes('neighborhood')
  )?.formatted_address;

  const result =
    streetAddress ||
    postalTownAddress ||
    politicalAddress ||
    data?.results[0]?.formatted_address;

  const getPlaceId = (result: string) => {
    return data?.results.find(
      (address) => address?.formatted_address === result
    )?.place_id;
  };

  return {
    address: result,
    placeId: result && getPlaceId(result),
  };
};

export const getLocationAdherence = (
  data: PlacesResultsType,
  expectedLocation: string
) => {
  if (!data?.results) return false;
  for (const result of data?.results || []) {
    const expectedLoc = expectedLocation.split(' ');
    const actualLoc = result?.formatted_address?.split(' ');
    return expectedLoc.some((text) => actualLoc && actualLoc.includes(text));
  }
};

export const getUserAddressLanguage = () => {
  const lang = localStorage.getItem('i18nextLng');
  return lang === 'en' ? 'en-GB' : lang;
};

export type weatherIconType = 'sun' | 'cloud_sun' | 'cloud' | 'rain';

export function getWeatherIcon(value: weatherIconType) {
  switch (value) {
    case 'sun':
      return t('Sunny');
    case 'cloud_sun':
    case 'cloud':
      return t('Cloudy');
    case 'rain':
      return t('Rainy');
    default:
      return value;
  }
}

export function formatTime(time: number | string) {
  time = Number(time);
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);

  const hDisplay =
    h > 0 ? h + (h === 1 ? ` ${t('hr')} ` : ` ${t('hrs')} `) : '';
  const mDisplay =
    m > 0
      ? m + (m === 1 ? ` ${t('min')}` : ` ${t('mins')}`)
      : h <= 1
      ? ''
      : m + ` ${t('mins')}`;
  return hDisplay + mDisplay + (m === 0 && h < 1 ? `0 ${t('min')}` : '');
}

export function convertToPercentage(value: string | number): number;
export function convertToPercentage(
  value: string | number,
  showUnit?: boolean
): string;
export function convertToPercentage(
  value: string | number,
  showUnit?: boolean
) {
  return showUnit
    ? Math.round(Number(value) * 100) + ' %'
    : Math.round(Number(value) * 100);
}

export const round = (value: number, precision: number) => {
  return value.toFixed(precision || 0);
};

export const calculateAverage = (min: number, max: number) => {
  if (min === max) return Math.round(min);
  return Math.round((min + max) / 2);
};

export const isEndTimeValid = (endTime: number, startTime: number) => {
  if (!endTime || !startTime) return false;
  return (
    moment.unix(endTime).isValid() &&
    moment.unix(endTime).isSameOrAfter(moment.unix(startTime))
  );
};

//* Strips out loading and error location state text
export const getUserLocationText = () => {
  try {
    const locationText = localStorage.getItem('location');
    if (
      locationText === t('Dashboard.Loading') ||
      locationText === t('Dashboard.error_fetching_location')
    ) {
      return '';
    }
    return locationText?.split(',')[0] || '';
  } catch (err) {
    console.error(err);
    return '';
  }
};

export function getTimeSuitability(color: string) {
  switch (color) {
    case 'red':
      return t('Scheduling.modal.low');
    case 'amber':
      return t('Scheduling.modal.medium');
    case 'green':
      return t('Scheduling.modal.high');
    default:
      return t('Scheduling.modal.low');
  }
}

export function getTimeSuitabilityBgColor(value: string) {
  switch (value) {
    case t('Scheduling.modal.low'):
      return 'bg-warning';
    case t('Scheduling.modal.medium'):
      return 'bg-SmartPDTorange';
    case t('Scheduling.modal.high'):
      return 'bg-green-forecast';
    default:
      return 'bg-green-forecast';
  }
}
