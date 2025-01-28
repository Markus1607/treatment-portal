import {
  SessionTypeEnums,
  DiseasesTypeEnums,
  ExpectedLocationEnums,
} from '~/utils/options.d';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';
import { weatherIcons } from 'utils/icons';
import { isEmpty, map, includes, isNumber } from 'lodash';
import {
  Icon,
  Data,
  Colour,
  DataSlot,
  DataWeather,
  CalendarData,
} from './types/calendar';
import type {
  BookedEventType,
  formatGetCalendarType,
  formatCustomStartTimeType,
  defaultNaturalDPDTValuesType,
} from './types/format';
import { SessionStateEnums } from '~/pages/Patients/components/PatientSchedule/api/query.d';

//* Natural DPDT form fields
export const defaultNaturalDPDTValues: defaultNaturalDPDTValuesType = {
  diseaseTypeUid: DiseasesTypeEnums.AK,
  sessionUid: '',
  protocolSelected: '',
  patientID: '',
  sessionType: SessionTypeEnums.FullyAssisted,
  expectedLocation: {
    address: '',
    lat: '',
    lng: '',
    source: ExpectedLocationEnums.Clinic,
    otherAddress: '',
    otherAddressLat: '',
    otherAddressLng: '',
  },
  prodrug: '',
  sunscreenRequired: '',
  sunscreenTypeUid: '',
  microNeeding: '',
  fractionalLaser: '',
  protocolDetails: {
    scrapingLesions: '',
    minDuration: '',
    maxDuration: '',
    accIndoorTime: '',
    ppixDose: '',
    minTemp: '',
    maxTemp: '',
    minDrugLight: '',
    maxDrugLight: '',
    emollient: '',
    alcohol: '',
  },
};

//* Artficial DPDT form fields
export const defaultArtificialDPDTValues = {
  protocolSelected: '1',
  patientID: '',
  lampType: 'multilite',
  prodrug: 'ppix_prodrug',
  microNeeding: 'false',
  fractionalLaser: 'false',
  lampProtocol: '1',
  lightColour: [1, 2, 3],
  lightIntensity: '1',
  treatmentMode: '1',
  treatmentDose: '90',
  timeCalculated: '',
  incubationTime: '',
  exposureTime: '',
  blueLightExposureTime: '',
  yellowLightExposureTime: '',
  redLightExposureTime: '',
};

//* Conventional PDT form fields
export const defaultConventionalPDTValues = {
  protocolSelected: '1',
  patientID: '',
  lampType: '1',
  prodrug: 'ppix_prodrug',
  microNeeding: 'false',
  fractionalLaser: 'false',
  treatmentDose: '90',
  timeCalculated: '',
};

export const defaultCombinedPDTValues = {
  protocolSelected: '',
  patientID: '',
  lampType: '',
  prodrug: '',
  microNeeding: '',
  fractionalLaser: '',
};

//* Heliotherapy form fields
export const defaultHelioTherapyValues = {
  protocolSelected: '',
  patientID: '',
  startDate: '',
  endate: '',
  numberOfDaysPerWeek: '',
  timeIntervalBtwDays: '',
  isSunscreenRequired: '',
};

export const initialCalendarData = {
  days: {},
  fortnights: [],
  slots: {},
  timezone: '',
  weather: {},
  ppix100: null,
  ery100: null,
  lat: null,
  lon: null,
};

export const formatGetCalendar = (obj: formatGetCalendarType) => {
  return {
    months: obj.month || 0,
    settings: {
      sunscreen_uid:
        obj.sunscreenRequired === 'no' ? null : obj.sunscreenTypeUid,
      min_dli: isNumber(Number(obj.protocolDetails.minDrugLight))
        ? Number(obj.protocolDetails.minDrugLight) * 60
        : 0,
      max_dli: isNumber(Number(obj.protocolDetails.maxDrugLight))
        ? Number(obj.protocolDetails.maxDrugLight) * 60
        : 0,
      min_temp: isNumber(Number(obj.protocolDetails.minTemp))
        ? Number(obj.protocolDetails.minTemp)
        : 0,
      max_temp: isNumber(Number(obj.protocolDetails.maxTemp))
        ? Number(obj.protocolDetails.maxTemp)
        : 0,
      min_ppix_dose: isNumber(Number(obj.protocolDetails.ppixDose))
        ? Number(obj.protocolDetails.ppixDose) * 10000
        : 3 * 10000,
      min_exposure_time: isNumber(Number(obj.protocolDetails.minDuration))
        ? Number(obj.protocolDetails.minDuration) * 60
        : 1 * 60,
      max_exposure_time: isNumber(Number(obj.protocolDetails.maxDuration))
        ? Number(obj.protocolDetails.maxDuration) * 60
        : 1 * 60,
      indoor_time_allowed: isNumber(Number(obj.protocolDetails.accIndoorTime))
        ? Number(obj.protocolDetails.accIndoorTime) * 60
        : 0,
      lat: parseFloat(`${obj.expectedLocation.lat}`),
      lon: parseFloat(`${obj.expectedLocation.lng}`),
    },
  };
};

export type PutCalendarDataType = ReturnType<typeof formatGetCalendar>;

export const formatCustomStartTime = (obj: formatCustomStartTimeType) => {
  return {
    start_time: obj.customTime,
    settings: {
      sunscreen_uid:
        obj.sunscreenRequired === 'no' ? null : obj.sunscreenTypeUid,
      min_dli: isNumber(Number(obj.protocolDetails.minDrugLight))
        ? Number(obj.protocolDetails.minDrugLight) * 60
        : 0,
      max_dli: isNumber(Number(obj.protocolDetails.maxDrugLight))
        ? Number(obj.protocolDetails.maxDrugLight) * 60
        : 0,
      min_temp: isNumber(Number(obj.protocolDetails.minTemp))
        ? Number(obj.protocolDetails.minTemp)
        : 0,
      max_temp: isNumber(Number(obj.protocolDetails.maxTemp))
        ? Number(obj.protocolDetails.maxTemp)
        : 0,
      min_ppix_dose: isNumber(Number(obj.protocolDetails.ppixDose))
        ? Number(obj.protocolDetails.ppixDose) * 10000
        : 3 * 10000,
      min_exposure_time: isNumber(Number(obj.protocolDetails.minDuration))
        ? Number(obj.protocolDetails.minDuration) * 60
        : 1 * 60,
      max_exposure_time: isNumber(Number(obj.protocolDetails.maxDuration))
        ? Number(obj.protocolDetails.maxDuration) * 60
        : 1 * 60,
      indoor_time_allowed: isNumber(Number(obj.protocolDetails.accIndoorTime))
        ? Number(obj.protocolDetails.accIndoorTime) * 60
        : 0,
      lat: parseFloat(`${obj.expectedLocation.lat}`),
      lon: parseFloat(`${obj.expectedLocation.lng}`),
    },
  };
};

export type PutCustomCalendarDataType = ReturnType<
  typeof formatCustomStartTime
>;

export const formatEvents = (
  days: CalendarData['days'],
  fortnights: CalendarData['fortnights'],
  timezone: string,
  bookedEvent?: BookedEventType | null | undefined
) => {
  const allEvents = [];
  if (!isEmpty(days) && !isEmpty(fortnights)) {
    /**
     * * First seven days of forecast
     */
    const allDays = Object.keys(days);
    const startDate = moment
      .unix(Number(allDays[0]))
      .tz(timezone)
      .format('YYYY-MM-DD HH:mm');
    const endDate = moment
      .unix(Number(allDays[allDays.length - 1]))
      .tz(timezone)
      .format('YYYY-MM-DD HH:mm');
    const firstEventStartDate = moment(startDate, 'YYYY-MM-DD');
    const LastEventStartDate = moment(endDate, 'YYYY-MM-DD');

    map(days, (info, keys) => {
      const day = moment
        .unix(Number(keys))
        .tz(timezone)
        .format('YYYY-MM-DD HH:mm');
      if (moment(day).isBetween(startDate, endDate, 'day', '[]')) {
        if (
          bookedEvent &&
          moment(day).isSame(moment(bookedEvent.start).tz(timezone), 'day')
        ) {
          allEvents.push({
            ...bookedEvent,
            forecastIcon: getForecastIcon(info.icon),
          });
        } else {
          allEvents.push({
            id: uuidv4(),
            firstEventStartDate,
            LastEventStartDate,
            isBookedEvent: false,
            isBackgroundEvent: true,
            color: getDayColor(info.colour),
            start: moment(day).format(),
            end: moment(day).format(),
            forecastIcon: getForecastIcon(info.icon),
            suitability: Math.round(info.suitability_index * 100),
          });
        }
      }
    });

    /**
     * * Following weeks after first week
     */
    fortnights.forEach((_, index, arr) => {
      const startDate = moment.utc(arr?.[index]?.start_date, 'YYYY-MM-DD');
      const endDate = moment.utc(arr?.[index]?.end_date, 'YYYY-MM-DD');

      const endOfFirstWeek = moment
        .unix(Number(allDays[allDays.length - 1]))
        .tz(timezone)
        .format('YYYY-MM-DD HH:mm');
      const startOfAvg = moment
        .unix(Number(allDays[allDays.length - 1]))
        .tz(timezone)
        .add(1, 'days')
        .format('YYYY-MM-DD HH:mm');
      const avgColor = Object.values(arr?.[index]?.data.days)?.[0].colour;

      if (startDate && endDate) {
        while (startDate.isBefore(endDate, 'day')) {
          if (
            bookedEvent &&
            moment(bookedEvent.start).isSameOrAfter(startOfAvg) &&
            startDate.isSame(moment(bookedEvent.start).tz(timezone), 'day')
          ) {
            allEvents.push(bookedEvent);
          } else {
            if (moment(startDate).isAfter(endOfFirstWeek)) {
              allEvents.push({
                id: uuidv4(),
                firstEventStartDate,
                LastEventStartDate,
                start: startDate.format(),
                end: startDate.format(),
                isBackgroundEvent: true,
                text: getAverageText(avgColor),
                color: getAverageColor(avgColor),
              });
            }
          }
          startDate.add(1, 'days');
        }
      }
    });
  }

  /**
   * * All other future request
   */
  if (isEmpty(days) && !isEmpty(fortnights)) {
    fortnights.forEach((_, index, arr) => {
      const startDate = moment.utc(arr?.[index]?.start_date, 'YYYY-MM-DD');
      const endDate = moment.utc(arr?.[index]?.end_date, 'YYYY-MM-DD');
      const avgColor = Object.values(arr?.[index]?.data.days)?.[0].colour;

      if (startDate && endDate) {
        while (startDate.isBefore(endDate, 'day')) {
          if (
            bookedEvent &&
            startDate.isSame(moment(bookedEvent.start).tz(timezone), 'day')
          ) {
            allEvents.push(bookedEvent);
          } else {
            allEvents.push({
              id: uuidv4(),
              start: startDate.format(),
              end: startDate.format(),
              isBackgroundEvent: true,
              text: getAverageText(avgColor),
              color: getAverageColor(avgColor),
            });
          }
          startDate.add(1, 'days');
        }
      }
    });
  }

  //* Overdue events
  if (
    bookedEvent &&
    bookedEvent.sessionState !== SessionStateEnums.COMPLETED &&
    moment
      .tz(bookedEvent.start, timezone)
      .isBefore(moment().tz(timezone), 'day')
  ) {
    allEvents.push(bookedEvent);
  }

  //======== FINAL RESULTS =================//
  return allEvents;
};

export const formatSelectedDayInfo = (
  selectedDate: Date,
  schedulingData: CalendarData
) => {
  const { slots, weather, days, fortnights, ery100, ppix100, timezone } =
    schedulingData;
  /**
   * * First two weeks
   */
  if (!isEmpty(days) && !isEmpty(fortnights)) {
    /**
     * * First seven days
     */
    const allDays = Object.keys(days);
    const startDate = moment
      .unix(Number(allDays[0]))
      .tz(timezone)
      .format('YYYY-MM-DD HH:mm');
    const endDate = moment
      .unix(Number(allDays[allDays.length - 1]))
      .tz(timezone)
      .format('YYYY-MM-DD HH:mm');

    if (moment(selectedDate).isBetween(startDate, endDate, 'day', '[]')) {
      const timeSlots: Data['slots'] = Object.keys(slots)
        .filter((key) => {
          const time = moment
            .unix(Number(key))
            .tz(timezone)
            .format('YYYY-MM-DD HH:mm');
          return moment(time).isSame(moment(selectedDate), 'day');
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: slots[key],
          };
        }, {});

      const weatherInfo: Data['weather'] = Object.keys(weather)
        .filter((key) => {
          const time = moment
            .unix(Number(key))
            .tz(timezone)
            .format('YYYY-MM-DD HH:mm');
          return moment(time).isSame(moment(selectedDate), 'day');
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: weather[key],
          };
        }, {});

      return {
        date: formatSelectedDate(selectedDate),
        ery100,
        ppix100,
        timezone,
        timeSlots,
        weatherInfo,
      };
    } else {
      /**
       * * Last two weeks
       */
      let timeSlots: Data['slots'] = {};
      let weatherInfo: Data['weather'] = {};

      fortnights.forEach((value, index, arr) => {
        const startDate = moment.utc(arr?.[index]?.start_date, 'YYYY-MM-DD');
        const endDate = moment.utc(arr?.[index]?.end_date, 'YYYY-MM-DD');
        if (
          endDate &&
          startDate &&
          moment
            .tz(selectedDate, timezone)
            .isBetween(startDate, endDate, 'day', '[]')
        ) {
          timeSlots = value?.data.slots;
          weatherInfo = value?.data.weather;
        }
      });

      return {
        date: formatSelectedDate(selectedDate),
        ery100,
        ppix100,
        timezone,
        timeSlots,
        weatherInfo,
      };
    }
  }

  /**
   * * All other future selected days
   */
  if (isEmpty(days) && !isEmpty(fortnights)) {
    let timeSlots: Data['slots'] = {};
    let weatherInfo: Data['weather'] = {};

    fortnights.forEach((value, index, arr) => {
      const startDate = moment.utc(arr?.[index]?.start_date, 'YYYY-MM-DD');
      const endDate = moment.utc(arr?.[index]?.end_date, 'YYYY-MM-DD');
      if (
        endDate &&
        startDate &&
        moment
          .tz(selectedDate, timezone)
          .isBetween(startDate, endDate, 'day', '[]')
      ) {
        timeSlots = value?.data.slots;
        weatherInfo = value?.data.weather;
      }
    });

    return {
      date: formatSelectedDate(selectedDate),
      ery100,
      ppix100,
      timezone,
      timeSlots,
      weatherInfo,
    };
  }
};

export type SelectedDayInfoType = {
  date: string;
  ery100: number | null;
  ppix100: number | null;
  timezone: string;
  timeSlots: {
    [key: string]: DataSlot;
  };
  weatherInfo: {
    [key: string]: DataWeather;
  };
};

/**
 * * Non exported functions below
 */

function getForecastIcon(icon: Icon) {
  if (includes(['cloud'], icon)) {
    return weatherIcons.cloud;
  } else if (includes(['cloud_sun'], icon)) {
    return weatherIcons.cloud_sun;
  } else if (includes(['rain'], icon)) {
    return weatherIcons.rain;
  } else {
    return weatherIcons.sun;
  }
}

function formatSelectedDate(selectedDate: Date) {
  return selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : '-';
}

function getDayColor(color: Colour) {
  switch (color) {
    case 'red':
      return 'bg-warning';
    case 'amber':
      return 'bg-SmartPDTorange';
    case 'green':
      return 'bg-green-forecast';
    default:
      return 'bg-dashboard';
  }
}

function getAverageColor(color: Colour) {
  switch (color) {
    case 'red':
      return 'text-warning bg-red-100';
    case 'amber':
      return 'text-SmartPDTorange bg-yellow-100';
    case 'green':
      return 'text-green bg-[#F0FBED]';
    default:
      return 'text-black-light bg-dashboard';
  }
}

function getAverageText(color: Colour) {
  switch (color) {
    case 'red':
      return 'Avg_unsuitable';
    case 'amber':
      return 'Possible';
    case 'green':
      return 'Possible';
    default:
      return 'Avg_unsuitable';
  }
}

export const getInitialCalendarDate = (hasBookedTreatment: boolean) => {
  const startOfNextMonth = moment().add(1, 'M').startOf('month').toDate();
  const finalMonthWeekStartDate = moment().endOf('month').startOf('isoWeek');
  const finalMonthWeekEndDate = moment().endOf('month').endOf('isoWeek');
  if (
    !hasBookedTreatment &&
    moment().isBetween(
      finalMonthWeekStartDate,
      finalMonthWeekEndDate,
      'day',
      '[]'
    )
  ) {
    return startOfNextMonth;
  } else {
    return new Date();
  }
};

export const setCalendarDateWithBookedEvent = (
  date: Date,
  initialCalendarDate: Date
) => {
  if (!date) return;
  const bookedDate = new Date(date);
  if (moment(bookedDate).isAfter(moment(initialCalendarDate), 'day')) {
    return bookedDate;
  } else {
    return initialCalendarDate;
  }
};
