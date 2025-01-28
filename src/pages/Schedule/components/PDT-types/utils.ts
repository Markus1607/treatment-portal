import moment from 'moment';
import { isNumber } from 'lodash';
import { NATDYPDTSettings, NatDyPDT } from 'pages/Protocol/api/api.d';
import { isPredefinedProtocol } from '~/pages/Protocol/api/format';
import { DiseasesTypeOptions } from '~/utils/options.d';
import { getPredefinedProtocolLabel } from '~/utils/functions';
import { diseaseProtocolsPredefined } from '~/utils/options';

//* Data reference from https://sihealth.atlassian.net/browse/SPDTDEV-40
export const gmeLampMatrix = {
  '1': [0.54, 0.9, 1.38, 1.8, 2.26],
  '2': [1.56, 1.86, 2.16, 2.58, 3],
  '3': [0.72, 0.9, 0.96, 1.08, 1.2],
  '1,2': [2.1, 2.82, 3.6, 4.5, 5.4],
  '1,3': [1.08, 1.56, 2.16, 2.64, 3.24],
  '2,3': [2.28, 2.52, 2.82, 3.12, 3.48],
  '1,2,3': [1.8, 2.16, 2.56, 3, 3.42],
};

export type lightColorType = keyof typeof gmeLampMatrix;

export const calcGMETreatmentMinutes = (
  lightColor: lightColorType,
  lightIntensity: number,
  treatmentDose: number
) => {
  if (!lightColor.length || !isNumber(lightIntensity)) return 0;
  return Math.round(treatmentDose / gmeLampMatrix[lightColor][lightIntensity]);
};

interface TimeSlot {
  start: string;
  end: string;
}

export function generateTimeSlots({
  date,
  interval,
}: {
  date: string;
  interval: number | undefined;
}): TimeSlot[] {
  if (!date || !isNumber(interval)) return [];
  const today = moment().startOf('day');
  const selectedDate = moment(date, 'DD/MM/YYYY').startOf('day');

  const startTime = selectedDate.isSame(today)
    ? moment()
    : moment().set({ hour: 6, minute: 0, second: 0, millisecond: 0 });

  const endTime = moment().set({
    hour: 22,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const timeSlots: TimeSlot[] = [];
  const currentTime = startTime.clone();

  while (currentTime.isSameOrBefore(endTime)) {
    const slotStart = currentTime.format('HH:mm');
    const slotEnd = currentTime.add(interval, 'minutes').format('HH:mm');
    timeSlots.push({ start: slotStart, end: slotEnd });
  }

  return timeSlots;
}

export const getTimeInterval = (value: number, calculatedInterval: number) => {
  switch (value) {
    case 1:
      return calculatedInterval;
    case 2:
      return 35;
    case 3:
      return 80;
  }
};

export const formatSessionDate = (sessionDay: string, sessionTime: string) => {
  return moment(`${sessionDay} ${sessionTime}`, 'DD/MM/YYYY HH:mm').toDate();
};

export const getNatPDTList = ({
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
      value: field.uid,
      label: isPredefinedProtocol(field)
        ? getPredefinedProtocolLabel(
            field.disease.uid,
            diseaseProtocolsPredefined()
          )
        : field.name,
      isDefault: field.default,
    }));
};

export type NatPDTOptionType = ReturnType<typeof getNatPDTList>[number];

export type NatPDTListType = ReturnType<typeof getNatPDTList>;

export const setNatPDTProtocolDetails = (data: NATDYPDTSettings) => {
  const isEuroPDT = isPredefinedProtocol(data);
  return {
    prodrug: data.settings.prodrug,
    sunscreenRequired: data.settings.sunscreen_req,
    sunscreenTypeUid: isEuroPDT ? 'galact50' : data.settings.sunscreen_uid, //TODO: Temp fix, discuss with BE team to get this corrected
    microNeeding: data.settings.micro_needing === true ? 'true' : 'false',
    fractionalLaser: data.settings.frac_laser === true ? 'true' : 'false',
    protocolDetails: {
      scrapingLesions:
        data.settings.skin_lesion_scraping === true ? 'true' : 'false',
      minDuration: data.settings.min_exposure_time / 60,
      maxDuration: data.settings.max_exposure_time / 60,
      accIndoorTime: data.settings.indoor_time_allowed / 60,
      ppixDose: data.settings.min_ppix_dose / 10000,
      minTemp: data.settings.min_temp,
      maxTemp: data.settings.max_temp,
      minDrugLight: data.settings.min_dli / 60,
      maxDrugLight: data.settings.max_dli / 60,
      emollient: data.settings.emollient,
      alcohol: data.settings.alcohol === true ? 'true' : 'false',
    },
  };
};
