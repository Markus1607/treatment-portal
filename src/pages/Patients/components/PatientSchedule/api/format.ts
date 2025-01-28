import moment from 'moment';
import {
  Session,
  SessionDetailsResponseType,
  SessionStateEnums,
} from './query.d';
import { isNumber } from 'lodash';
import { getPpixDose, setFieldValue } from 'utils/dataFormats';
import {
  isEndTimeValid,
  isTreatmentOverdue,
  isTreatmentDeclined,
} from 'utils/functions';
import { ProtocolTypeEnums } from 'pages/Protocol/api/api.d';
import { LocationSourceEnums } from 'pages/Schedule/api/types/enums.d';

export function formatGetTreatment(arr: Session[]) {
  const lastItem = arr.findLast(
    (item) =>
      item.state !== SessionStateEnums.COMPLETED &&
      item.treatment_type === ProtocolTypeEnums.NATDYPDT
  );

  const eventData = lastItem && {
    id: lastItem.uid,
    sessionId: lastItem.uid,
    isBackgroundEvent: false,
    scheduledStateTime: lastItem.scheduled_start_time,
    sessionState: lastItem.state,
    start: lastItem.start_time
      ? moment.unix(lastItem.start_time).toDate()
      : moment.unix(lastItem.scheduled_start_time).toDate(),
    end: isEndTimeValid(
      lastItem.expected_end_time,
      lastItem.scheduled_start_time
    )
      ? moment.unix(lastItem.expected_end_time).toDate()
      : lastItem.state === SessionStateEnums.RUNNING
      ? lastItem.last_update_time
        ? moment.unix(lastItem.last_update_time).toDate()
        : null
      : moment.unix(lastItem.scheduled_start_time).toDate(),
    isOverdueToday:
      moment.unix(lastItem.scheduled_start_time).isSame(moment(), 'day') &&
      isTreatmentOverdue({
        date_time_slot: lastItem.scheduled_start_time,
        treatment_status: lastItem.state,
      }),
    isTreatmentInThePast: moment
      .unix(lastItem.scheduled_start_time)
      .isBefore(moment(), 'day'),
    isTreatmentDeclined: isTreatmentDeclined({
      accepted: lastItem.accepted,
      treatment_status: lastItem.state,
      reschedule_reason: lastItem.reschedule_reason,
    }),
    rescheduleRequired: isTreatmentOverdue({
      date_time_slot: lastItem.scheduled_start_time,
      treatment_status: lastItem.state,
    }),
  };

  return { eventData };
}

export type TreatmentDataType = ReturnType<typeof formatGetTreatment>;

export const formatNatPDTSessionDetails = (
  sessionDetails: SessionDetailsResponseType['session']
) => {
  const isCustomLocation = sessionDetails.settings.source === 'custom';

  return {
    diseaseTypeUid: sessionDetails.disease.uid,
    protocolSelected: sessionDetails.settings.prt_uid,
    sessionUid: sessionDetails.uid,
    sessionType: sessionDetails.settings.session_type,
    expectedLocation: {
      lat: sessionDetails.settings.lat,
      lng: sessionDetails.settings.lon,
      address: sessionDetails.settings.address,
      source: sessionDetails.settings.source || LocationSourceEnums.Clinic,
      otherAddress: isCustomLocation ? sessionDetails.settings.address : '',
      otherAddressLat: isCustomLocation ? sessionDetails.settings.lat : '',
      otherAddressLng: isCustomLocation ? sessionDetails.settings.lon : '',
    },
    prodrug: sessionDetails.settings.prodrug,
    sunscreenRequired: sessionDetails.settings.sunscreen_req,
    sunscreenTypeUid: sessionDetails.settings.sunscreen_uid,
    microNeeding: String(sessionDetails.settings.micro_needing),
    fractionalLaser: String(sessionDetails.settings.frac_laser),
    protocolDetails: {
      scrapingLesions: String(sessionDetails.settings.skin_lesion_scraping),
      minDuration: Math.round(sessionDetails.settings.min_exposure_time / 60),
      maxDuration: Math.round(sessionDetails.settings.max_exposure_time / 60),
      accIndoorTime: isNumber(sessionDetails.settings.indoor_time_allowed)
        ? Math.round(sessionDetails.settings.indoor_time_allowed) === 0
          ? 0
          : sessionDetails.settings.indoor_time_allowed / 60
        : '',
      ppixDose: getPpixDose(sessionDetails.settings.min_ppix_dose),
      maxTemp: setFieldValue(sessionDetails.settings.max_temp),
      minTemp: setFieldValue(sessionDetails.settings.min_temp),
      minDrugLight: isNumber(sessionDetails.settings.min_dli)
        ? sessionDetails.settings.min_dli === 0
          ? 0
          : sessionDetails.settings.min_dli / 60
        : '',
      maxDrugLight: isNumber(sessionDetails.settings.max_dli)
        ? sessionDetails.settings.max_dli === 0
          ? 0
          : sessionDetails.settings.max_dli / 60
        : '',
      emollient: sessionDetails.settings.emollient,
      alcohol: String(sessionDetails.settings.alcohol),
    },
  };
};

export type NatPDTSessionDetailsType = ReturnType<
  typeof formatNatPDTSessionDetails
>;
