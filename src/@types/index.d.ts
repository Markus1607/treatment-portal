import { supportedCtryCodes } from 'utils/constants';

export type SunscreenList = {
  id: string;
  value: string;
  label: string;
}[];

export type graphIdType = {
  solarRadiation: string;
  solar: string;
  temp: string;
  precipitation: string;
};

export type PositionType = {
  lat: number;
  lon: number;
};

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  instName: string;
  instId: string;
  loginUsed?: boolean;
  termsOfUseAccepted: boolean;
  staffType: 'STAFF' | 'ADMIN';
};

export type SessionSummaryModalDataType = {
  lat: number;
  lon: number;
  sessionID: string;
  patientID: string;
  isTreatmentReadyToBegin: boolean;
  treatmentModalTitleDate: string;
  treatmentTime: string;
  sessionType: string;
  rescheduleRequired: boolean;
  sunscreen: string;
  forecastDuration: string;
  ppixDose: string;
  erthemalDose: string;
  erythemalDosePercentage: string | number;
  weatherCondition: string;
  suitability: string;
  temperature: string | number;
  chanceOfRain: string;
  uvIndex: string | number;
  preStartTime: number;
  estimatedEndTime: number;
  estimatedEndTimeHour: string;
  unsuitableReasons: string[];
};

export type selectedCountryType = (typeof supportedCtryCodes)[number];

declare module 'react-pdf/dist/esm/entry.webpack';
