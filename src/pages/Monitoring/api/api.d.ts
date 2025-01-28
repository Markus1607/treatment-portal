import { SessionTypeOptions } from 'utils/options.d';

export type OngoingSessionsDataType = {
  avg_temp: number;
  burn_dose: number;
  burn_irradiance: number;
  burn_percent: number;
  confirmed: null | number;
  date_time_slot: number;
  emollient: number;
  estimated_address: string;
  estimated_end_time: number;
  exact_start_time: number;
  exposure_type: number;
  id: string;
  lat: number;
  lon: number;
  max_utci: number;
  min_utci: number;
  patient_id: number;
  paused: null | number;
  pdt_dose: number;
  pdt_end_time: number;
  pdt_percent: number;
  ppix_irradiance: number;
  pre_treatment_complete: boolean;
  pro_drug: number;
  pro_drug_dose: number;
  rescheduled: number;
  session_id: string;
  session_type: SessionTypeOptions;
  sunscreen_uid: string;
  time_stamp: number;
  treatment_status: 2;
};

export type AllOngoingSessionsDataType = OngoingSessionsDataType[];

export type OngoingSessionReportType = {
  scientific_report: ScientificReport;
  session_steps: SessionSteps;
};

export type ScientificReport = {
  address: string;
  avg_temp: number;
  comfort_index: null | number;
  erythema_dose: number;
  erythema_dose_percent: number;
  erythema_graph: Array<number[]>;
  erythema_irradiance_graph: Array<number[]>;
  erythema_remaining: number;
  exposure_start_time: number;
  indoor_time_allowed: number;
  irradiance_graph: Array<number[]>;
  min_duration: number;
  pause_duration: number;
  pdt_dose_percent: number;
  ppix_dose: number;
  ppix_graph: Array<number[]>;
  sunscreen: number;
  treatment_elapsed: number;
  treatment_remaining: number;
  uv_index: number;
};

export type SessionSteps = {
  alcohol: null | number;
  dispose_prodrug: null | number;
  emollient: number;
  emollient_1: null | number;
  emollient_2: null | number;
  emollient_3: null | number;
  expected_location: string;
  exposure: null | number;
  indoor_time_allowed: number;
  lesion_washed: null;
  max_dli: number;
  max_duration: number;
  max_temp: number;
  maximum_ppix_dose: number;
  min_dli: number;
  min_duration: number;
  min_ppix_dose: number;
  min_temp: number;
  pause_duration: number;
  post_session_photo: null | string;
  pre_session_photo: null | string;
  prodrug: string;
  prodrug_applied: null | number;
  prodrug_quantity: number;
  session_type: SessionTypeOptions;
  sponged: null | number;
  sunscreen: null | number;
  sunscreen_uid: string;
  treatment_environment: number;
};

export type AddressDatatype = {
  address: string;
  id: number;
};
