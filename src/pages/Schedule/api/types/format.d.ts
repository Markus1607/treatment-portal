import { SessionStateOptions } from '~/pages/Patients/components/PatientSchedule/api/query.d';

export type defaultNaturalDPDTValuesType = {
  diseaseTypeUid?: string;
  sessionUid: string;
  protocolSelected: string;
  patientID: string;
  sessionType: string | null;
  expectedLocation: {
    source: string;
    address: string;
    lat: string | number;
    lng: string | number;
    otherAddress?: string;
    otherAddressLat?: string | number;
    otherAddressLng?: string | number;
  };
  prodrug: string;
  sunscreenRequired: string;
  sunscreenTypeUid: string;
  fractionalLaser: string;
  microNeeding: string;
  protocolDetails: {
    scrapingLesions: string;
    minDuration: string | number;
    maxDuration: string | number;
    accIndoorTime: string | number;
    ppixDose: string | number;
    minTemp: string | number;
    maxTemp: string | number;
    minDrugLight: string | number;
    maxDrugLight: string | number;
    emollient: string;
    alcohol: string;
  };
};

export type formatCustomStartTimeType = defaultNaturalDPDTValuesType & {
  customTime: number;
};

export type formatGetCalendarType = defaultNaturalDPDTValuesType & {
  month: number;
};

export type defaultArtificialDPDTValuesType = {
  protocolSelected: string | number;
  patientID: string;
  lampType: string;
  prodrug: string;
  microNeeding: string;
  fractionalLaser: string;
  lampProtocol: string;
  lightColour: number[];
  lightIntensity: string | number;
  treatmentMode: string | number;
  treatmentDose: string | number;
  timeCalculated: string | number;
  incubationTime: string | number;
  exposureTime: string | number;
  blueLightExposureTime: string | number;
  yellowLightExposureTime: string | number;
  redLightExposureTime: string | number;
};

export type defaultConventionalPDTValueType = {
  protocolSelected: string | number;
  patientID: string | number;
  lampType: string;
  prodrug: string;
  microNeeding: string;
  fractionalLaser: string;
  treatmentDose: string | number;
  timeCalculated: string | number;
};

export type BookedEventType = {
  id: string;
  sessionId: string;
  isBackgroundEvent: boolean;
  scheduledStateTime: number;
  sessionState: SessionStateOptions;
  start: Date;
  end: Date | null;
  isOverdueToday: boolean;
  isTreatmentInThePast: boolean;
  isTreatmentDeclined: boolean;
  rescheduleRequired: boolean;
  firstEventStartDate?: Date;
  LastEventStartDate?: Date;
  color?: string;
  forecastIcon?: string;
  suitability?: number;
  text?: string;
};
export interface ChartDataType {
  irr_ery: number;
  irr_ppix: number;
  precipitation: number;
  temperature: number;
  date: number;
  erythemalDoseSunscreen?: number;
  erythemalDose?: number;
  ppixDoseSunscreen?: number;
  ppixDose?: number;
  formattedDate?: string;
}

export type BookedArtificialPDTSessionType = {
  patientID: number;
  sessionType?: number;
  start?: Date;
  end?: Date;
  title?: string;
  protocolSelected: string;
  lampType: string;
  prodrug: string;
  microNeeding: string;
  fractionalLaser: string;
  lampProtocol: string;
  lightColour: number;
  lightIntensity: string;
  treatmentMode: string;
  treatmentDose: string;
  timeCalculated: string;
  incubationTime: string;
  exposureTime: string;
  blueLightExposureTime: string;
  yellowLightExposureTime: string;
  redLightExposureTime: string;
};

export type BookedConventionalPDTSessionType = {
  patientID: number;
  sessionType: number;
  start: Date;
  end: Date;
  title: string;
  protocolSelected: string;
  lampType: string;
  prodrug: string;
  microNeeding: string;
  fractionalLaser: string;
  treatmentDose: string;
  timeCalculated: string;
};

export type eventDataType = { start: Date; end: Date; title: string };
