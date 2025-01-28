import {
  ProdrugOptions,
  EmollientOptions,
  SunscreenRequiredOptions,
  DiseasesTypeOptions,
} from 'utils/options.d';
import { conventionalDPDTDefaultValues } from './format';

export type naturalDPDTDefaultValuesType = {
  id: string;
  diseaseTypeUid: string;
  protocolName: string;
  sunscreenRequired: string;
  protocolDescription: string;
  microNeeding: string | boolean;
  fractionalLaser: string | boolean;
  scrapingLesions: string | boolean;
  prodrug: string;
  minDuration: string | number;
  maxDuration: string | number;
  alcohol: string | boolean;
  accIndoorTime: string | number;
  ppixDose: string | number;
  minTemp: string | number;
  maxTemp: string | number;
  minDrugLight: string | number;
  maxDrugLight: string | number;
  emollient: string | boolean;
  sunscreenType: string;
};

export type artificialDPDTDefaultValuesType = {
  id: string;
  protocolName: string;
  protocolDescription: string;
  emollient: string;
  alcohol: string;
  microNeeding: string;
  fractionalLaser: string;
  scrapingLesions: string;
  lampType: string;
  prodrug: string;
  minDrugLight: string | number;
  maxDrugLight: string | number;
  ppixDose: string | number;
};

export type conventionalDPDTDefaultValuesType =
  typeof conventionalDPDTDefaultValues;

export type AllProtocolsResponseType = {
  protocols: (NatDyPDT | ArtflPDT)[];
};

export type DiseasesType = {
  name: string;
  uid: DiseasesTypeOptions;
  disease_metadata: null;
};

export type NatDyPDT = {
  uid: string;
  name: string;
  stm_uid: string;
  default: boolean;
  description: string;
  preset: boolean;
  treatment_type: ProtocolTypeEnums.NATDYPDT;
  disease: DiseasesType;
};

export type NATDYPDTSettings = NatDyPDT & {
  settings: {
    alcohol: boolean;
    emollient: EmollientOptions;
    frac_laser: boolean;
    indoor_time_allowed: number;
    max_dli: number;
    max_exposure_time: number;
    max_ppix_dose: number;
    max_temp: number;
    max_utci: number;
    micro_needing: boolean;
    min_dli: number;
    min_exposure_time: number;
    min_ppix_dose: number;
    min_temp: number;
    min_utci: number;
    prodrug: ProdrugOptions;
    sunscreen_uid: string;
    skin_lesion_scraping: boolean;
    sunscreen_req: SunscreenRequiredOptions;
  };
};

export type ArtflPDT = {
  uid: string;
  name: string;
  stm_uid: string;
  default: boolean;
  description: string;
  preset: boolean;
  treatment_type: ProtocolTypeEnums.ARTFLPDT;
  disease: DiseasesType;
};

export type ARTFLPDTSettings = ArtflPDT & {
  settings: {
    alcohol: boolean;
    emollient: string;
    frac_laser: boolean;
    lamp_type: string;
    max_dli: number;
    max_ppix_dose: number;
    micro_needing: boolean;
    min_dli: number;
    min_ppix_dose: number;
    prodrug: string;
    skin_lesion_scraping: boolean;
  };
};

export enum ProtocolTypeEnums {
  NATDYPDT = 'natdypdt',
  ARTFLPDT = 'artdypdt',
}

export type ProtocolTypeOptions = `${ProtocolTypeEnums}`;

export type DiseaseListResponseType = {
  diseases: Array<DiseasesType>;
};
