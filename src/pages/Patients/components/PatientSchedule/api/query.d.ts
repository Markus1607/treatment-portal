import { SessionTypeOptions } from '~/utils/options';
import { DiseasesType, ProtocolTypeOptions } from '~/pages/Protocol/api/api.d';

export type AllTreatments = {
  sessions: Session[];
};

export type Session = {
  uid: string;
  accepted: null | boolean;
  end_time: null | number;
  expected_end_time: number;
  finished_reason: null | string;
  last_update_time: null | number;
  pause_duration: null | number;
  pause_start_time: null | number;
  scheduled_start_time: number;
  reschedule_reason: null | string;
  start_time: null | number;
  state: SessionStateOptions;
  treatment_type: ProtocolTypeOptions;
};

export enum SessionStateEnums {
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  COMPLETED = 'finished',
  PAUSED = 'paused',
}

export type SessionStateOptions = `${SessionStateEnums}`;

export type Settings = {
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
  lat: number;
  lon: number;
  source: string;
  address: string;
  prt_uid: string;
  session_type: SessionTypeOptions;
};

export type SessionDetailsResponseType = {
  session: Session & {
    disease: DiseasesType;
    settings: Settings;
  };
};
