import { isEmpty } from 'lodash';
import type {
  ArtflPDT,
  NatDyPDT,
  DiseasesType,
  NATDYPDTSettings,
  ARTFLPDTSettings,
  naturalDPDTDefaultValuesType,
  artificialDPDTDefaultValuesType,
} from './api.d';
import { TFunction } from 'react-i18next';
import { DiseasesTypeOptions } from '~/utils/options.d';
import { getPredefinedProtocolLabel } from '~/utils/functions';
import { diseaseProtocolsPredefined } from '~/utils/options';

//* Natural DPDT fields
export const naturalDPDTDefaultValues: naturalDPDTDefaultValuesType = {
  id: '',
  protocolName: '',
  diseaseTypeUid: '',
  protocolDescription: '',
  microNeeding: '',
  fractionalLaser: '',
  sunscreenRequired: '',
  scrapingLesions: '',
  prodrug: '',
  minDuration: '',
  maxDuration: '',
  accIndoorTime: '',
  ppixDose: '',
  minTemp: '',
  maxTemp: '',
  minDrugLight: '',
  maxDrugLight: '',
  emollient: '',
  sunscreenType: '',
  alcohol: '',
};

export const isPredefinedProtocol = (data: NatDyPDT | ArtflPDT) =>
  data.preset === true;

export const formatNaturalDPDTProtocol = ({
  data,
  diseaseTypeUid,
}: {
  data: NatDyPDT[];
  diseaseTypeUid: DiseasesTypeOptions;
}) => {
  return data
    .filter((field) => field.disease.uid === diseaseTypeUid)
    .map((field) => ({
      id: field.uid,
      protocolName: isPredefinedProtocol(field)
        ? getPredefinedProtocolLabel(
            field.disease.uid,
            diseaseProtocolsPredefined()
          )
        : field.name,
      makeDefault: field.default,
      diseaseTypeUid: field.disease.uid,
      isPredefinedProtocol: isPredefinedProtocol(field),
    }));
};

export const formatDiseasesList = (data: DiseasesType[]) => {
  return data.map((field) => ({
    uid: field.uid,
    diseaseName: field.name,
  }));
};

export const formatNaturalPDTProtocolDetails = (data: NATDYPDTSettings) => {
  return {
    id: data.uid,
    protocolName: isPredefinedProtocol(data)
      ? getPredefinedProtocolLabel(
          data.disease.uid,
          diseaseProtocolsPredefined()
        )
      : data.name,
    diseaseTypeUid: data.disease.uid,
    protocolDescription: isPredefinedProtocol(data)
      ? diseaseProtocolsPredefined()[0].description
      : data.description,
    isPredefinedProtocol: isPredefinedProtocol(data),
    microNeeding: String(data.settings.micro_needing),
    fractionalLaser: String(data.settings.frac_laser),
    sunscreenRequired: data.settings.sunscreen_req,
    scrapingLesions: String(data.settings.skin_lesion_scraping),
    prodrug: data.settings.prodrug,
    minDuration: data.settings.min_exposure_time / 60,
    maxDuration: data.settings.max_exposure_time / 60,
    accIndoorTime: data.settings.indoor_time_allowed / 60,
    ppixDose: Math.round(data.settings.min_ppix_dose / 10000),
    minTemp: data.settings.min_temp,
    maxTemp: data.settings.max_temp,
    minDrugLight: data.settings.min_dli / 60,
    maxDrugLight: data.settings.max_dli / 60,
    emollient: data.settings.emollient,
    sunscreenType: isPredefinedProtocol(data)
      ? 'galact50'
      : data.settings.sunscreen_uid, //TODO: Temp fix, discuss with BE team to get this corrected
    alcohol: String(data.settings.alcohol),
  };
};

export const formatBENaturalDPDTProtocol = (
  data: naturalDPDTDefaultValuesType
) => {
  return {
    name: data.protocolName,
    disease_uid: data.diseaseTypeUid,
    description: data.protocolDescription,
    settings: {
      min_exposure_time: Number(data.minDuration) * 60,
      max_exposure_time: Number(data.maxDuration) * 60,
      indoor_time_allowed: Number(data.accIndoorTime) * 60,
      min_ppix_dose: Number(data.ppixDose) * 10000,
      min_temp: Number(data.minTemp),
      max_temp: Number(data.maxTemp),
      min_dli: Number(data.minDrugLight) * 60,
      max_dli: Number(data.maxDrugLight) * 60,
      emollient: data.emollient,
      alcohol: data.alcohol === 'true',
      prodrug: data.prodrug,
      sunscreen_req: data.sunscreenRequired,
      sunscreen_uid:
        data.sunscreenRequired !== 'no' ? data.sunscreenType : 'none',
      frac_laser: data.fractionalLaser === 'true',
      micro_needing: data.microNeeding === 'true',
      skin_lesion_scraping: data.scrapingLesions === 'true',
    },
  };
};

export type naturalDPDTProtocolBEDataType = ReturnType<
  typeof formatBENaturalDPDTProtocol
>;

export type naturalDPDTProtocolBEDataPutType = Omit<
  naturalDPDTProtocolBEDataType,
  'disease_uid'
>;

//* Artificial DPDT fields
export const artificialDPDTDefaultValues: artificialDPDTDefaultValuesType = {
  id: '',
  protocolName: '',
  protocolDescription: '',
  emollient: '',
  alcohol: '',
  microNeeding: '',
  fractionalLaser: '',
  scrapingLesions: '',
  lampType: '',
  prodrug: '',
  minDrugLight: '',
  maxDrugLight: '',
  ppixDose: '',
};

//* TODO: Add the right type from BE
export const formatArtificialDPDTProtocol = (
  data: ArtflPDT[],
  t: TFunction
) => {
  return data.map((field) => ({
    id: field.uid,
    protocolName: isEmpty(field.stm_uid)
      ? t('european-guidelines-for-artificial-pdt-title')
      : field.name,
    makeDefault: field.default,
    isPredefinedProtocol: isPredefinedProtocol(field),
  }));
};

export const formatArtificialPDTProtocolDetails = (
  data: ARTFLPDTSettings,
  t: TFunction
) => ({
  id: data.uid,
  protocolName: isEmpty(data.stm_uid)
    ? t('european-guidelines-for-artificial-pdt-title')
    : data.name,
  protocolDescription: data.description,
  isPredefinedProtocol: isPredefinedProtocol(data),
  microNeeding: String(data.settings.micro_needing),
  fractionalLaser: String(data.settings.frac_laser),
  scrapingLesions: String(data.settings.skin_lesion_scraping),
  prodrug: data.settings.prodrug,
  minDrugLight: data.settings.min_dli / 60,
  maxDrugLight: data.settings.max_dli / 60,
  ppixDose: Math.round(data.settings.min_ppix_dose / 10000),
  emollient: data.settings.emollient,
  alcohol: String(data.settings.alcohol),
  lampType: data.settings.lamp_type,
});

export const formatBEArtificialDPDTProtocol = (
  data: artificialDPDTDefaultValuesType
) => {
  return {
    name: data.protocolName,
    description: data.protocolDescription,
    settings: {
      min_dli: Number(data.minDrugLight) * 60,
      max_dli: Number(data.maxDrugLight) * 60,
      min_ppix_dose: Number(data.ppixDose) * 10000,
      emollient: data.emollient,
      alcohol: data.alcohol === 'true',
      prodrug: data.prodrug,
      frac_laser: data.fractionalLaser === 'true',
      micro_needing: data.microNeeding === 'true',
      skin_lesion_scraping: data.scrapingLesions === 'true',
      lamp_type: data.lampType,
    },
  };
};

export type artificialDPDTProtocolBEDataType = ReturnType<
  typeof formatBEArtificialDPDTProtocol
>;

//* Conventional DPDT fields
export const conventionalDPDTDefaultValues = {
  protocolName: '',
  protocolDescription: '',
  emollient: '',
  alcohol: '',
  microNeeding: '',
  fractionalLaser: '',
  scrapingLesions: '',
  lampType: '',
  prodrug: '',
  prodrugDuration: '',
  photodynamicDiagnosis: '',
  ppixDose: '',
};

//* TODO: Add the right type from BE
export const formatConventionalDPDTProtocol = () => {};

export const formatPostConventionalDPDTProtocol = () => {};
