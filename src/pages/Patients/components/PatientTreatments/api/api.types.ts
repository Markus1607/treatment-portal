import { DiseasesType, ProtocolTypeEnums } from '~/pages/Protocol/api/api.d';
import { SessionStateOptions } from '../../PatientSchedule/api/query.d';
import {
  ProdrugOptions,
  EmollientOptions,
  SessionTypeOptions,
  FinishedReasonsOptions,
  ExpectedLocationOptions,
} from '~/utils/options.d';

//* All NatDypdt Treatments
export type AllNatDypdTreatments = {
  sessions: Session[];
};

export type Session = {
  uid: string;
  accepted: null | boolean;
  end_time: null | number;
  expected_end_time: number;
  finished_reason: FinishedReasonsOptions | null;
  last_update_time: null | number;
  pause_duration: null | number;
  pause_start_time: null | number;
  scheduled_start_time: number;
  reschedule_reason: null | string;
  start_time: null | number;
  state: SessionStateOptions;
  treatment_type: ProtocolTypeEnums.NATDYPDT;
  disease: DiseasesType;
  settings: {
    lat: number;
    lon: number;
    address: string;
    source: ExpectedLocationOptions;
    session_type: SessionTypeOptions;
  };
};

//* Ongoing Session Report
export type OngoingSessionReport = {
  report: Report;
};

export type Report = {
  steps: Steps;
  scientific_report: ScientificReport;
};

export type ScientificReport = {
  address: string;
  start_time: number;
  ppix_remaining_time: number;
  ppix: Array<number[]>;
  erythema: Array<number[]>;
  ppix_percent: number;
  erythema_percent: number;
  exposure_time: number;
  erythema_remaining_time: number;
  sunscreen_uid: string;
  avg_temp: number;
  uv_index: number;
  comfort_index: null | number;
  pause_duration: null | number;
  min_exposure_time: number;
  indoor_time_allowed: number;
  ppix_irr: Array<number[]>;
  erythema_irr: Array<number[]>;
};

export type Steps = {
  session_type: SessionTypeOptions;
  expected_location: string;
  prodrug: ProdrugOptions;
  min_duration: number;
  max_duration: number;
  indoor_time_allowed: number;
  min_ppix_dose: number;
  max_ppix_dose: number;
  min_temp: number;
  max_temp: number;
  min_dli: number;
  max_dli: number;
  emollient: EmollientOptions;
  alcohol: null | boolean;
  sunscreen_uid: string;
  pause_duration: null | number;
  emollient_1: null | number;
  emollient_2: null | number;
  emollient_3: null | number;
  picture_taken_1: null | number;
  sunscreen: null | number;
  sponged: null | number;
  prodrug_applied: null | number;
  exposure: null | number;
  lesion_washed: null | number;
  prodrug_disposed: null | number;
  picture_taken_2: null | number;
};

//* Progress report response data type
export type ProgressReportDataType = {
  progress: Progress;
};

export type Progress = {
  scheduled_start_time: number;
  expected_end_time: number;
  accepted: boolean;
  reschedule_reason: null | string;
  start_time: number;
  end_time: number | null;
  state: string;
  pause_start_time: number | null;
  pause_duration: number | null;
  last_update_time: number;
  finished_reason: string | null;
  treatment_type: string;
  settings: Settings;
  doses: Doses;
};

export type Doses = {
  time_stamp: number;
  ppix: number;
  ppix_percent: number;
  ppix_irr: number;
  erythema: number;
  erythema_percent: number;
  erythema_irr: number;
};

export type Settings = {
  lat: number;
  lon: number;
  source: string;
  address: string;
  session_type: string;
  alcohol: boolean;
  prodrug: string;
  emollient: string;
  frac_laser: boolean;
  micro_needing: boolean;
  sunscreen_req: string;
  sunscreen_uid: string;
  skin_lesion_scraping: boolean;
  min_dli: number;
  max_dli: number;
  min_temp: number;
  max_temp: number;
  min_utci: number;
  max_utci: number;
  min_ppix_dose: number;
  max_ppix_dose: number;
  min_exposure_time: number;
  max_exposure_time: number;
  indoor_time_allowed: number;
  prt_uid: string;
};

//* Completed Session Report response data type
export type CompletedTreatmentReportType = {
  report: CompletedSessionReport;
};

export type CompletedSessionReport = {
  steps: Steps;
  session: CompletedSessionInfo;
  protocol_adherence: ProtocolAdherence;
  scientific_report: CompletedScientificReport;
};

export type ProtocolAdherence = {
  expected_indoor_time: number;
  expected_pdt_dose: number;
  expected_avg_temp: number;
  expected_emollient_applied: string;
  expected_alcohol_applied: boolean;
  expected_sunscreen_applied: string;
  actual_indoor_time: null | number;
  actual_ppix_dose: number;
  actual_mean_temp: number;
  adherence_indoor_time: boolean;
  adherence_ppix_dose: boolean;
  adherence_mean_temp: boolean;
  actual_emollient_applied: null | string;
  actual_alcohol_applied: null | string;
  actual_sunscreen_applied: null | string;
  adherence_emollient_applied: null | boolean;
  adherence_alcohol_applied: null | boolean;
  adherence_sunscreen_applied: null | boolean;
};

export type CompletedSessionInfo = {
  session_uid: string;
  lat: number;
  lon: number;
  estimated_address: string;
  prodrug: string;
  prep_emollient: string;
  prodrug_dose: number;
  session_type: SessionTypeOptions;
  scheduled_start_time: number;
  start_time: number;
  end_time: number;
  duration: number;
  avg_temp: number;
  sunscreen_uid: string;
  patient_uid: string;
  finished_reason: FinishedReasonsOptions;
  clinical_percent: null | number;
  clinical_outcome: null | string;
  clinical_comments: null | string;
  grading_response: null | string;
  lesion_rate: null | number;
  new_cancers: null | boolean;
  other_session_recommended: null | boolean;
  redness: null | boolean;
  redness_duration: null | number;
  swelling: null | boolean;
  swelling_duration: null | number;
  crusting: null | boolean;
  crusting_duration: null | number;
  skin_reactions: null | string;
  skin_reactions_comments: null | string;
  patient_comments: null | string;
  pain: null | number;
  indoor_time: null | number;
  interrupted: null | boolean;
  mean_ppix_irradiance: number;
  ppix_dose: number;
};

export type CompletedScientificReport = {
  address: string;
  start_time: number;
  duration: number;
  scheduled_start_time: number;
  expected_end_time: number;
  ppix_dose: number;
  ppix_dose_percent: number;
  erythema_dose: number;
  erythema_dose_percent: number;
  min_ppix_dose: number;
  med: number;
  sunscreen_uid: string;
  avg_temp: number;
  uv_index: number;
  comfort_index: null;
  ppix: Array<number[]>;
  ppix_irr: Array<number[]>;
  erythema: Array<number[]>;
  erythema_irr: Array<number[]>;
};

export type GenerateCertificatePostResponse = {
  status: 'Generating' | 'Uploading' | 'Converting' | 'Completed' | 'Failed';
  blank_akasi: boolean;
};

export type GetCertificateResponse = Blob;

export enum PdfGenerationErrors {
  'PDF_DOES_NOT_EXIST' = 80101,
  'GENERATION_INCOMPLETE' = 80100,
  'CONVERSION_FAILURE' = 80007,
  'DOCUMENT_RENDERING_ERROR' = 80005,
}
