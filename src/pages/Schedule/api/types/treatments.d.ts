export interface IBookedTreatments {
  alcohol: number | null;
  allowed_indoor_minutes: number;
  avg_temp: null;
  burn_end_time: null;
  confirmed: 0 | 1 | null;
  date_time_slot: number;
  emollient: number;
  estimated_address: string;
  estimated_end_time: number;
  exact_start_time: null;
  exposure_type: number;
  id: number;
  last_dose_update: null;
  lat: number;
  lon: number;
  max_dli: number;
  max_ppix_dose: number;
  max_temp: number;
  max_treatment_minutes: number;
  max_utci: number;
  min_dli: number;
  min_ppix_dose: number;
  min_temp: number;
  min_treatment_minutes: number;
  min_utci: number;
  newest_dose_id: null;
  patient_id: number;
  pause_duration: number;
  pause_start: null | number;
  paused: null;
  pdt_end_time: null;
  pretreatment_start: number;
  pro_drug: number;
  pro_drug_dose: number;
  reschedule_reason: null;
  rescheduled: number;
  session_type: SessionTypes;
  treatment_status: 1;
  utci: null | number;
  uv_index: null | number;
  sunscreen_uid: string;
}

export type SessionTypes = 'fully_assisted' | 'self_applied' | 'assisted';

export interface IOngingTreatments extends IBookedTreatments {
  avg_temp: number;
  burn_end_time: number;
  exact_start_time: number;
  last_dose_update: number;
  newest_dose_id: number;
  pdt_end_time: number;
  treatment_status: 2;
}

export interface IFinishedTreatment extends IBookedTreatments {
  avg_temp: number;
  burn_dose: number;
  burn_irradiance: number;
  burn_percent: number;
  exact_end_time: number;
  exact_start_time: number;
  finished_reason: string;
  lesion_classification: number;
  lesion_locations: string;
  newest_dose_id: number;
  'non-adherence_reason': number[];
  number_lesions: number;
  pdt_dose: number;
  pdt_percent: number;
  ppix_irradiance: number;
  protocol_adherence: number;
  session_duration: number;
  session_id: number;
  time_stamp: number;
  treatment_status: 3;
}

export type BookedAndOngoingTreatments = [
  IBookedTreatments | IOngingTreatments,
];

export type AllTreatmentsType = [
  IBookedTreatments | IOngingTreatments | IFinishedTreatment,
];

export type SelectedTreatmentType = {
  sessionID: number;
  patientID: number;
  rawDate: number;
  location: string;
  treatmentModalTitleDate: string;
  lat: number;
  lon: number;
  sunscreen: string;
  sessionType: string;
  treatmentStarted: boolean;
  sessionType: string;
  treatmentTime: string;
  start: Date;
  end: Date;
  startTime: string;
  endTime: string;
  isConfirmed: boolean;
  isOngoing: boolean;
  rescheduleRequired: boolean;
  isTreatmentReadyToBegin: boolean;
  sessionInfo: SessionInfo;
  forecastDuration: string;
  ppixDose: string;
  erthemalDose: string;
  erythemalDosePercentage: string;
  weatherCondition: string;
  temperature: string;
  chanceOfRain: string;
  uvIndex: string;
  suitability: string;
};

export interface SessionInfo {
  alcohol: number;
  allowed_indoor_minutes: number;
  avg_temp: null | number;
  burn_end_time: null | number;
  confirmed: null | number;
  date_time_slot: number;
  emollient: number;
  estimated_address: string;
  estimated_end_time: number;
  exact_start_time: null;
  exposure_type: number;
  id: number;
  last_dose_update: null | number;
  lat: number;
  lon: number;
  max_dli: number;
  max_ppix_dose: number;
  max_temp: number;
  max_treatment_minutes: number;
  max_utci: number;
  min_dli: number;
  min_ppix_dose: number;
  min_temp: number;
  min_treatment_minutes: number;
  min_utci: number;
  newest_dose_id: null | number;
  patient_id: number;
  pause_duration: number;
  pause_start: null | number;
  paused: null | number;
  pdt_end_time: null | number;
  pretreatment_start: number;
  pro_drug: number;
  pro_drug_dose: number;
  rescheduled: number;
  session_type: string;
  sunscreen_uid: string;
  treatment_status: number;
  utci: null | number;
  uv_index: null | number;
}
