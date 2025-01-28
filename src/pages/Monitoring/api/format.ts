import {
  formatTimeSeconds,
  getDateFromUnix,
  getLabelFromKey,
  getLabelFromID,
  getUVIndexText,
  getDurationFromUnix,
} from 'utils/functions';
import { SunscreenList } from '@types';
import { yesNo, prodrug, yesNoBool, treatmentPreference } from 'utils/options';
import { isNumber, isBoolean } from 'lodash';
import {
  SessionSteps,
  ScientificReport,
  OngoingSessionsDataType,
  AllOngoingSessionsDataType,
} from './api.d';

export function formattedMonitoringData(
  session: OngoingSessionsDataType,
  sunscreenList: SunscreenList
) {
  return {
    max: session.date_time_slot * 1000,
    startTime: isNumber(session.exact_start_time)
      ? getDateFromUnix(session.exact_start_time, 'HH:mm')
      : '-',
    sessionType: session.session_type,
    estimatedEndTime:
      session.pdt_end_time > 0
        ? getDateFromUnix(session.pdt_end_time, 'HH:mm')
        : session.pdt_end_time,
    pdt_end_time: session.pdt_end_time,
    location: session.estimated_address ? session.estimated_address : '-',
    lat: session.lat,
    lon: session.lon,
    preTreatmentSteps: isBoolean(session.pre_treatment_complete)
      ? session.pre_treatment_complete
      : false,
    treatmentStatus: isNumber(session.treatment_status)
      ? session.treatment_status
      : 0,
    patientID: session.patient_id ? session.patient_id : -1,
    sunscreen: getLabelFromID(session.sunscreen_uid, sunscreenList),
    rescheduled: isNumber(session.rescheduled)
      ? getLabelFromKey(session.rescheduled, yesNo())
      : '-',
    sessionID: session.id,
    ppixPercent: isNumber(session.pdt_percent)
      ? Math.floor(session.pdt_percent)
      : 0,
    burnPercent: isNumber(session.burn_percent)
      ? Math.floor(session.burn_percent)
      : 0,
    plannedStartTime: isNumber(session.date_time_slot)
      ? getDateFromUnix(session.date_time_slot, 'HH:mm')
      : '-',
    plannedDuration:
      isNumber(session.estimated_end_time) &&
      isNumber(session.exact_start_time) &&
      session.estimated_end_time > session.exact_start_time
        ? getDurationFromUnix(
            session.exact_start_time,
            session.estimated_end_time
          )
        : null,
    avgTemp: isNumber(session.avg_temp) ? Math.round(session.avg_temp) : null,
    dateTimeSlot: isNumber(session.date_time_slot)
      ? session.date_time_slot
      : null,
    paused: isNumber(session.paused) ? session.paused === 1 : false,
  };
}

export type MonitoringDataType = ReturnType<typeof formattedMonitoringData>;

export function formatMonitoringData(
  data: AllOngoingSessionsDataType,
  sunscreenList: SunscreenList
) {
  return data.map((session) => formattedMonitoringData(session, sunscreenList));
}

export function formatReport(data: ScientificReport) {
  return {
    accumulatedGraph:
      data.erythema_graph && data.ppix_graph
        ? formatGraphData(data.ppix_graph, 10000, data.erythema_graph, 1)
        : [],
    irradianceGraph:
      data.irradiance_graph && data.erythema_irradiance_graph
        ? formatGraphData(
            data.irradiance_graph,
            1,
            data.erythema_irradiance_graph,
            0.001
          )
        : [],
    pauseDuration: isNumber(data.pause_duration)
      ? formatTimeSeconds(data.pause_duration)
      : null,
    treatmentDuration: isNumber(data.treatment_elapsed)
      ? Math.round(data.treatment_elapsed / 60)
      : null,
    actualPDTDuration:
      isNumber(data.pause_duration) && isNumber(data.treatment_elapsed)
        ? Math.round((data.treatment_elapsed - data.pause_duration) / 60)
        : null,
    uvIndex: isNumber(data.uv_index) ? getUVIndexText(data.uv_index) : null,
    burnTimeRemaining:
      isNumber(data.erythema_remaining) && data.erythema_dose_percent < 100
        ? data.erythema_remaining > 0
          ? formatTimeSeconds(data.erythema_remaining)
          : data.erythema_remaining
        : -1,
    ppixDoseTimeRemaining:
      isNumber(data.treatment_remaining) && data.pdt_dose_percent < 100
        ? data.treatment_remaining > 0
          ? formatTimeSeconds(data.treatment_remaining)
          : data.treatment_remaining
        : -1,

    minProtocolDurationRemaining:
      isNumber(data.min_duration) && isNumber(data.treatment_elapsed)
        ? formatTimeSeconds(
            Math.max(0, data.min_duration * 60 - data.treatment_elapsed)
          )
        : null,
    pauseTimePercentage:
      isNumber(data.pause_duration) && isNumber(data.indoor_time_allowed)
        ? data.pause_duration / data.indoor_time_allowed
        : 0,
    protocolTimePercentage:
      isNumber(data.treatment_elapsed) && isNumber(data.min_duration)
        ? data.treatment_elapsed / (data.min_duration * 60)
        : 0,
  };
}

export type SessionReportDataType = ReturnType<typeof formatReport>;

function formatGraphData(
  ppixData: number[][],
  ppixDivisor: number,
  erythemaData: number[][],
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

export function formatSessionInfo(
  data: SessionSteps,
  sunscreenList: SunscreenList
) {
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
    pictureTaken: data.post_session_photo,
    disposeProdrug: data.dispose_prodrug,
    sessionType: getLabelFromKey(data.session_type, treatmentPreference()),
    sessionTypeRaw: data.session_type,
    treatmentEnvironment: data.treatment_environment,
    expectedLocation: data.expected_location,
    prodrug: getLabelFromKey(data.prodrug, prodrug()),
    prodrugQuantity: data.prodrug_quantity,
    maxDuration: data.max_duration,
    minDuration: data.min_duration,
    indoorTimeAllowed: data.indoor_time_allowed,
    maxPpixDose: data.maximum_ppix_dose,
    minPpixDose: data.min_ppix_dose,
    minDLI: data.min_dli,
    maxDLI: data.max_dli,
    emollient:
      data.emollient > 1 ? getLabelFromKey(data.emollient, yesNoBool()) : false,
    alcoholApplied: getLabelFromKey(data.alcohol ? data.alcohol : 0, yesNo()),
    sunscreenApplied: getLabelFromID(data.sunscreen_uid, sunscreenList),
  };
}

export type SessionInfoDataType = ReturnType<typeof formatSessionInfo>;

export type FormattedOngoingSessionDataType = MonitoringDataType & {
  report?: null | SessionReportDataType;
  sessionInfo?: null | SessionInfoDataType;
  lastUpdated?: string;
};
