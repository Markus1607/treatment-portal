import {
  getDateFromUnix,
  formatTimeSeconds,
  getTimeFromUnix,
  getLabelFromKey,
  getUVIndexText,
  getFinishedReason,
  isTreatmentDeclined,
} from '~/utils/functions';
import {
  yesNo,
  prodrug,
  emollient,
  yesNoBool,
  diseaseTypeTitle,
  treatmentPreference,
  expectedLocationOptions,
  sessionTypeToLocationSource,
  diseasesTypes,
} from '~/utils/options';
import moment from 'moment';
import { isNumber } from 'lodash';
import { CompletedSessionReport, Report, Session } from './api.types';
import { isTreatmentReadyToBegin } from '~/pages/Schedule/components/Calendar/Modals/api/format';

const SIXTY_SECONDS = 60;
const PPIX_DIVISOR = 10_000;
const ERYTHEMA_DIVISOR = 0.001;

export const formatSessionCardInfo = (data: Session) => {
  return {
    sessionUid: data.uid,
    sessionState: data.state,
    finishedReason: data.finished_reason,
    diseaseTreated: getLabelFromKey(data.disease.uid, diseasesTypes()),
    diseaseTitle: getLabelFromKey(data.disease.uid, diseaseTypeTitle()),
    scheduledDate: getDateFromUnix(data.scheduled_start_time, 'Do MMM YYYY'),
    sessionStartTime: `${getDateFromUnix(
      data.start_time ? data.start_time : data.scheduled_start_time,
      'Do MMM YYYY'
    )}, ${getTimeFromUnix(
      data.start_time ? data.start_time : data.scheduled_start_time
    )}`,
    estimatedEndTime: `${getDateFromUnix(
      data.expected_end_time,
      'Do MMM YYYY'
    )}, ${getTimeFromUnix(data.expected_end_time)}`,
    actualEndTime: data.end_time
      ? `${getDateFromUnix(data.end_time, 'Do MMM YYYY')}, ${getTimeFromUnix(
          data.end_time
        )}`
      : null,
    rescheduleReason: data.reschedule_reason,
    lastUpdateTime: data.last_update_time
      ? getTimeFromUnix(data.last_update_time)
      : '-',
    pauseDuration: data.pause_duration
      ? formatTimeSeconds(data.pause_duration)
      : '-',
    pauseStartTime: data.pause_start_time,
    sessionAddress: data.settings.address,
    addressSource: getLabelFromKey(
      data.settings.source,
      expectedLocationOptions()
    ),
    coordinates: {
      lat: data.settings.lat,
      lng: data.settings.lon,
    },
    sessionType: getLabelFromKey(
      data.settings.session_type,
      treatmentPreference()
    ),
    sessionTypeRaw: data.settings.session_type,
    isTreatmentOverdue: moment
      .unix(data.scheduled_start_time)
      .isBefore(moment(), 'day'),
    isTreatmentDeclined: isTreatmentDeclined({
      accepted: data.accepted,
      treatment_status: data.state,
      reschedule_reason: data.reschedule_reason,
    }),
    isTreatmentReadyToBegin: isTreatmentReadyToBegin(data.scheduled_start_time),
  };
};

export type FormatSessionCardInfoType = ReturnType<
  typeof formatSessionCardInfo
>;

export function formatSessionStepsInfo(data: Report['steps']) {
  return {
    emollient1: data.emollient_1,
    emollient2: data.emollient_2,
    emollient3: data.emollient_3,
    sunscreen: data.sunscreen,
    alcohol: data.alcohol,
    sponged: data.sponged,
    prodrugApplied: data.prodrug_applied,
    pdtExposure: data.exposure,
    lesionWashed: data.lesion_washed,
    pictureTaken: data.picture_taken_2,
    disposeProdrug: data.prodrug_disposed,
    sessionType: getLabelFromKey(data.session_type, treatmentPreference()),
    sessionTypeRaw: data.session_type,
    treatmentEnvironment: '-',
    expectedLocation: data.expected_location,
    prodrug: getLabelFromKey(data.prodrug, prodrug()),
    maxDuration: data.max_duration,
    minDuration: data.min_duration,
    indoorTimeAllowed: data.indoor_time_allowed,
    maxPpixDose: data.max_ppix_dose,
    minPpixDose: data.min_ppix_dose,
    minDLI: data.min_dli,
    maxDLI: data.max_dli,
    emollient: getLabelFromKey(data.emollient, yesNo()),
    alcoholApplied: data.alcohol
      ? getLabelFromKey(data.alcohol, yesNoBool())
      : 'None',
    sunscreenApplied: data.sunscreen_uid,
  };
}

export type SessionStepsDataType = ReturnType<typeof formatSessionStepsInfo>;

export function formatOngoingSessionReport(
  data: Report['scientific_report'],
  pauseStartTime: number | null
) {
  return {
    startTime: isNumber(data.start_time)
      ? getDateFromUnix(data.start_time, 'HH:mm')
      : '-',
    ppixPercent: Math.round(data.ppix_percent * 10) / 10,
    erythemaPercent: Math.round(data.erythema_percent * 10) / 10,
    expectedLocation: data.address,
    avgTemp: data.avg_temp || '-',
    sunscreenApplied: data.sunscreen_uid === 'none' ? null : data.sunscreen_uid,
    accumulatedGraph:
      data.erythema && data.ppix
        ? formatGraphData(data.ppix, PPIX_DIVISOR, data.erythema, 1)
        : [],
    irradianceGraph:
      data.ppix_irr && data.erythema_irr
        ? formatGraphData(data.ppix_irr, 1, data.erythema_irr, ERYTHEMA_DIVISOR)
        : [],
    pauseDuration: isNumber(data.pause_duration)
      ? calculatePauseDuration(data.pause_duration, pauseStartTime)
      : formatTimeSeconds(0),
    treatmentDuration: isNumber(data.exposure_time)
      ? Math.round(data.exposure_time / SIXTY_SECONDS)
      : 0,
    actualPDTDuration: isNumber(data.exposure_time)
      ? Math.round(
          (data.exposure_time -
            (data.pause_duration ? data.pause_duration : 0)) /
            SIXTY_SECONDS
        )
      : 0,
    uvIndex: isNumber(data.uv_index) ? getUVIndexText(data.uv_index) : null,
    burnTimeRemaining:
      isNumber(data.erythema_remaining_time) && data.erythema_percent < 100
        ? data.erythema_remaining_time > 0
          ? formatTimeSeconds(data.erythema_remaining_time)
          : data.erythema_remaining_time
        : -1,
    ppixDoseTimeRemaining:
      isNumber(data.ppix_remaining_time) && data.ppix_percent < 100
        ? data.ppix_remaining_time > 0
          ? formatTimeSeconds(data.ppix_remaining_time)
          : data.ppix_remaining_time
        : -1,

    minProtocolDurationRemaining:
      isNumber(data.min_exposure_time) && isNumber(data.exposure_time)
        ? formatTimeSeconds(
            Math.max(0, data.min_exposure_time - data.exposure_time)
          )
        : null,
    pauseTimePercentage:
      (isNumber(data.pause_duration) || data.pause_duration === null) &&
      isNumber(data.indoor_time_allowed)
        ? (data.pause_duration ? data.pause_duration : 0) /
          data.indoor_time_allowed
        : 0,
    protocolTimePercentage:
      isNumber(data.exposure_time) && isNumber(data.min_exposure_time)
        ? data.exposure_time / data.min_exposure_time
        : 0,
  };
}

export function calculatePauseDuration(
  pauseDuration: number,
  pauseStartTime: number | null
) {
  //* When treatment is paused, pause duration is added to the ongoing time
  if (isNumber(pauseStartTime) && isNumber(pauseDuration)) {
    const timeElapsed = Math.round(
      moment().diff(moment.unix(pauseStartTime), 'seconds', true) +
        pauseDuration
    );
    return formatTimeSeconds(timeElapsed);
  } else {
    //* When it resumes just use the pause duration from api response
    return isNumber(pauseDuration) ? formatTimeSeconds(pauseDuration) : '-';
  }
}

export type OngoingSessionReportDataType = ReturnType<
  typeof formatOngoingSessionReport
>;

function formatGraphData(
  ppixData: Array<number>[],
  ppixDivisor: number,
  erythemaData: Array<number>[],
  erythemaDivisor: number
) {
  return ppixData.map((item, index) => ({
    date: isNumber(item[0]) ? item[0] * 1000 : index * 900 * 1000,
    irr_ppix: isNumber(item[1])
      ? Math.round((item[1] / ppixDivisor) * 10) / 10
      : 0,
    irr_ery: isNumber(erythemaData[index][1])
      ? Math.round((erythemaData[index][1] / erythemaDivisor) * 10) / 10
      : 0,
  }));
}

export type GraphDataType = ReturnType<typeof formatGraphData>[0];

export function formatCompletedSessionReport(
  data: CompletedSessionReport['scientific_report'] &
    CompletedSessionReport['session']
) {
  const doseFractionCap = 120;
  return {
    startTime: isNumber(data.start_time)
      ? getDateFromUnix(data.start_time, 'HH:mm')
      : '-',
    endTime: isNumber(data.end_time)
      ? getDateFromUnix(data.end_time, 'HH:mm')
      : '-',
    sessionTypeRaw: data.session_type,
    coordinates: {
      lat: data.lat,
      lng: data.lon,
    },
    duration: isNumber(data.duration) ? formatTimeSeconds(data.duration) : '-',
    plannedStartTime: isNumber(data.scheduled_start_time)
      ? getDateFromUnix(data.scheduled_start_time, 'HH:mm')
      : '-',
    sunscreen: data.sunscreen_uid === 'none' ? null : data.sunscreen_uid,
    address: data.address,
    avgTemp: isNumber(data.avg_temp) ? Math.round(data.avg_temp) + 'ºC' : '-',
    uvIndex: isNumber(data.uv_index)
      ? getUVIndexText(Math.round(data.uv_index))
      : '-',
    minPpix: data?.min_ppix_dose / PPIX_DIVISOR || '-',
    burnDose: isNumber(data.erythema_dose)
      ? Math.round(data.erythema_dose * 10) / 10
      : '-',
    ppixDose: isNumber(data.ppix_dose)
      ? Math.floor((data.ppix_dose / PPIX_DIVISOR) * 10) / 10
      : '-',
    burnDosePercentage: isNumber(data.erythema_dose_percent)
      ? Math.min(doseFractionCap, Math.round(data.erythema_dose_percent))
      : '-',
    pdtDosePercentage: isNumber(data.ppix_dose_percent)
      ? Math.min(doseFractionCap, Math.round(data.ppix_dose_percent))
      : 0,
    accumulatedGraph:
      data.erythema && data.ppix
        ? formatGraphData(data.ppix, PPIX_DIVISOR, data.erythema, 1)
        : [],
    irradianceGraph:
      data.ppix_irr && data.erythema_irr
        ? formatGraphData(data.ppix_irr, 1, data.erythema_irr, ERYTHEMA_DIVISOR)
        : [],
  };
}

export type CompletedSessionReportDataType = ReturnType<
  typeof formatCompletedSessionReport
>;

export const formatCompletedProtocolAdherence = (
  data: CompletedSessionReport['protocol_adherence']
) => {
  return {
    expectedIndoorTime: isNumber(data.expected_indoor_time)
      ? Math.round(data.expected_indoor_time / SIXTY_SECONDS)
      : '-',
    actualIndoorTime: isNumber(data.actual_indoor_time)
      ? Math.round(data.actual_indoor_time / SIXTY_SECONDS)
      : '-',
    adherenceIndoorTime: data.adherence_indoor_time,
    expectedPdtDose: isNumber(data.expected_pdt_dose)
      ? Math.round((data.expected_pdt_dose / PPIX_DIVISOR) * 10) / 10 + ' J/cm²'
      : '-',
    actualPdtDose: isNumber(data.actual_ppix_dose)
      ? Math.floor((data.actual_ppix_dose / PPIX_DIVISOR) * 10) / 10 + ' J/cm²'
      : '-',
    adherencePdtDose: data.adherence_ppix_dose,
    expectedAvgTemp: isNumber(data.expected_avg_temp)
      ? Math.round(data.expected_avg_temp) + '°C'
      : '-',
    actualAvgTemp: isNumber(data.actual_mean_temp)
      ? Math.round(data.actual_mean_temp) + '°C'
      : '-',
    adherenceAvgTemp: data.adherence_mean_temp,
    expectedSunscreen: data.expected_sunscreen_applied,
    actualSunscreen: data.actual_sunscreen_applied,
    adherenceSunscreen: data.adherence_sunscreen_applied,
    expectedEmollient: data.expected_emollient_applied,
    actualEmollient: data.actual_emollient_applied,
    adherenceEmollient: data.adherence_emollient_applied,
    expectedAlcohol: data.expected_alcohol_applied,
    actualAlcohol: data.actual_alcohol_applied,
    adherenceAlcohol: data.adherence_alcohol_applied,
  };
};

export type CompletedProtocolAdherenceDataType = ReturnType<
  typeof formatCompletedProtocolAdherence
>;

export function formatCompletedSessionInfo(
  data: CompletedSessionReport['session']
) {
  return {
    sessionID: data.session_uid,
    sessionDate: data.start_time
      ? getDateFromUnix(data.start_time, 'DD-MM-YYYY')
      : '-',
    address: data.estimated_address ? data.estimated_address : '-',
    sessionStatus: getFinishedReason(data.finished_reason),
    preparatoryEmollient: data.prep_emollient
      ? getLabelFromKey(data.prep_emollient, emollient())
      : '-',
    prodrug: data.prodrug ? getLabelFromKey(data.prodrug, prodrug()) : '-',
    session_type:
      getLabelFromKey(data.session_type, treatmentPreference()) || '-',
    sessionTypeRaw: data.session_type,
    coordinates: {
      lat: data.lat,
      lng: data.lon,
    },
    locationSource: getLabelFromKey(
      data.session_type,
      sessionTypeToLocationSource()
    ),
    location: data.estimated_address ? data.estimated_address : '-',
    lat: data.lat,
    lon: data.lon,
    plannedStartTime: data.scheduled_start_time
      ? getDateFromUnix(data.scheduled_start_time, 'H:mm')
      : '-',
    startTime: data.start_time ? getDateFromUnix(data.start_time, 'H:mm') : '-',
    endTime: data.end_time ? getDateFromUnix(data.end_time, 'H:mm') : '-',
    duration: data.duration ? formatTimeSeconds(data.duration) : '-',
    avgTemp: isNumber(data.avg_temp) ? Math.round(data.avg_temp) + '°C' : '-',
    ppixDose: isNumber(data.ppix_dose)
      ? Math.floor((data.ppix_dose / PPIX_DIVISOR) * 10) / 10 + ' J/cm²'
      : '-',
    avgPpixIrradiance: isNumber(data.mean_ppix_irradiance)
      ? Math.round(data.mean_ppix_irradiance) + ' W/m²'
      : '-',
    sunscreen: data.sunscreen_uid === 'none' ? null : data.sunscreen_uid,
    pain: isNumber(data.pain) ? data.pain : '-',
    patientComments: data.patient_comments ? data.patient_comments : '-',
    clinicalPercentage: isNumber(data.clinical_percent)
      ? data.clinical_percent + '%'
      : '-',
    // clinicalOutcome: isNumber(data.clinical_outcome)
    //   ? getLabelFromKey(data.clinical_outcome, clinicalOutcome())
    //   : '-',
    treatmentInterrupted: data.interrupted ? 'Yes' : 'No',
    erythemaReaction: data.skin_reactions
      ? getLabelFromKey(data.skin_reactions, yesNo())
      : '-',
    oedemaReaction: data.redness ? getLabelFromKey(data.redness, yesNo()) : '-',
    otherSkinReactions: isNumber(data.skin_reactions)
      ? getLabelFromKey(data.skin_reactions, yesNo())
      : '-',
    clinicalComments: data.clinical_comments ? data.clinical_comments : '-',
  };
}

export type CompletedSessionInfoDataType = ReturnType<
  typeof formatCompletedSessionInfo
>;
