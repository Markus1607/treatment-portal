import _ from 'lodash';
import moment from 'moment-timezone';
import i18next from 'i18next';
import { SelectedDayInfoType } from 'pages/Schedule/api/format';
import { Slots } from 'pages/Schedule/api/types/custom-start-time';
import { ChartDataType } from 'pages/Schedule/api/types/format';
import {
  round,
  formatTime,
  getWeatherIcon,
  getDateFromUnix,
  getTimeSuitability,
  convertToPercentage,
} from 'utils/functions';

const t = i18next?.t.bind(i18next);

export const confirmDetailsInitState = {
  unixDateTime: 0,
  rescheduled: false,
  patientID: '',
  location: '',
  date: '',
  preStartTime: '',
  startTime: '',
  endTime: '',
  sessionType: '',
  beginTreatmentData: {
    lat: null,
    lon: null,
    sessionId: null,
  },
};

export const formatGraphData = (
  selectedDayData: SelectedDayInfoType,
  timezone: string,
  hideWithoutSunscreen: boolean
) => {
  const ten_thousand = 10000;
  if (!selectedDayData?.weatherInfo)
    return {
      date: '',
      chartData: [],
    };

  const chartData: ChartDataType[] = Object.entries(
    selectedDayData.weatherInfo
  ).map(([date, data]) => ({
    formattedDate: selectedDayData.date,
    date: Number(date) * 1000 + timezoneUnixOffset(date, timezone),
    temperature: _.isNumber(data.Temperature)
      ? Math.round(data.Temperature)
      : 0,
    irr_ppix:
      _.isNumber(data.irr_ppix) || _.isNumber(data.irr_ppix_ss)
        ? Math.round(
            (hideWithoutSunscreen ? data.irr_ppix_ss : data.irr_ppix) * 10
          ) / 10
        : 0,
    irr_ery:
      _.isNumber(data.irr_ery) || _.isNumber(data.irr_ery_ss)
        ? Math.round(
            (hideWithoutSunscreen ? data.irr_ery_ss : data.irr_ery) *
              ten_thousand
          ) / 10
        : 0,
    precipitation: _.isNumber(data.Precipitation)
      ? convertToPercentage(data.Precipitation)
      : 0,
  }));

  const timeSlotData = Object.entries(selectedDayData.timeSlots).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, data]) => ({
      erythemalDoseSunscreen: convertToPercentage(
        data.dose_ery_frac_ss_default
      ),
      erythemalDose: convertToPercentage(data.dose_ery_frac_default),
      ppixDoseSunscreen: convertToPercentage(data.dose_ppix_frac_ss_default),
      ppixDose: convertToPercentage(data.dose_ppix_frac_default),
    })
  );

  const date = getDateFromUnix(Number(chartData?.[0]?.date));

  chartData.forEach((time, index) => {
    if (selectedDayData?.timeSlots) {
      Object.assign(time, timeSlotData[index]);
    }
  });

  return { chartData, date, formattedDate: chartData[0]?.formattedDate };
};

export const isTreatmentTimeOverdue = (
  treatmentTime: string | number,
  timezone: string
) => {
  const overDueTime = moment.unix(Number(treatmentTime)).tz(timezone);
  return moment(overDueTime).isSameOrBefore(moment(), 'minute');
};

export const formatSessionTimes = (
  timeSlots: Slots,
  timezone: string,
  hideWithoutSunscreen: boolean
) => {
  const isPreTreatmentTimeValid = (time: string) =>
    moment(time, 'YYYY-MM-DDTHH:mm:ssZ')
      .tz(timezone)
      .isSameOrAfter(moment.tz(timezone), 'minute');

  const formatTime = (time: string) =>
    //string time format 2024-02-16T17:17:50+00:00
    moment(time, 'YYYY-MM-DDTHH:mm:ssZ').tz(timezone).format('HH:mm');

  const formatUnixTime = (time: number | string) =>
    moment.unix(Number(time)).tz(timezone).format('HH:mm');

  const formatHour = (time: number | string) =>
    moment.unix(Number(time)).tz(timezone).format('HH');

  return Object.entries(timeSlots)
    .filter(([keys]) => !excludedTime.includes(formatHour(keys)))
    .filter(([, data]) => isPreTreatmentTimeValid(data?.pretreatment_start))
    .map(([unix, data]) => {
      const preStartTime = formatTime(data.pretreatment_start ?? '');
      const estEndTime = hideWithoutSunscreen
        ? formatTime(data.end_ss)
        : formatTime(data.end);
      return {
        unix,
        unixStartTime: Number(unix),
        unixEndTime: hideWithoutSunscreen ? data.end_ss : data.end,
        suitability: getTimeSuitability(data.colour),
        startTime: formatUnixTime(unix),
        preStartTime,
        estEndTime,
      };
    })
    .filter((data) => data.unixEndTime !== 'NaT');
};

export const formatCustomSessionTime = (
  timeSlots: Slots,
  timezone: string,
  hideWithoutSunscreen: boolean
) => {
  const results = _.map(timeSlots, (data, keys) => ({
    unix: keys,
    unixStartTime: Number(keys),
    unixEndTime: hideWithoutSunscreen ? data.end_ss : data.end,
    suitability: getTimeSuitability(data.colour),
    preStartTime: data.pretreatment_start
      ? moment(data.pretreatment_start).tz(timezone).format('HH:mm')
      : '',
    startTime: moment.unix(Number(keys)).tz(timezone).format('HH:mm'),
    estEndTime:
      data?.end_ss !== 'NaT'
        ? moment(data.end_ss).tz(timezone).format('HH:mm')
        : t('pdt_unachievable'),
    estEndTimeWithoutSunscreen:
      data.end !== 'NaT'
        ? moment(data.end).tz(timezone).format('HH:mm')
        : t('pdt_unachievable'),
  }));
  return results;
};

export const getUnixTime = (
  selectedDay: string,
  selectedHour: string,
  timezone?: string
) => {
  const timeZone = timezone || moment.tz.guess();
  const offset = moment().tz(timeZone).utcOffset();
  return moment
    .tz(`${selectedDay} ${selectedHour}`, 'DD/MM/YYYY HH:mm', timeZone)
    .utcOffset(-offset)
    .unix();
};

export const getCustomTimeUnix = (
  selectedDay: string,
  selectedHour: string,
  timezone: string
) => {
  return moment
    .tz(`${selectedDay} ${selectedHour}`, 'DD/MM/YYYY HH:mm', timezone)
    .unix();
};

export const getSessionDetails = (
  selectedDate: string,
  timeSlots: Slots,
  timezone: string
) => {
  const ten_thousand = 10000;
  const results = _(timeSlots)
    .filter((_a, keys) => keys === selectedDate)
    .map((data) => ({
      preStartTime: data.pretreatment_start
        ? moment(data.pretreatment_start).tz(timezone).format('HH:mm')
        : '',
      isPretreatmentOverdue: isTreatmentTimeOverdue(
        data.pretreatment_start,
        timezone
      ),
      forecastDuration: _.isNumber(data.tottime_ss)
        ? formatTime(data.tottime_ss)
        : t('pdt_unachievable'),
      forecastDurationNoSunscreen:
        data.tottime !== '' ? formatTime(data.tottime) : t('pdt_unachievable'),
      precipitation: _.isNumber(data.precipitation)
        ? convertToPercentage(data.precipitation, true)
        : '-',
      temperature: {
        min: data.temperature_min
          ? Number(data.temperature_min).toFixed(1) + '°C'
          : '-',
        max: data.temperature_max
          ? Number(data.temperature_max).toFixed(1) + '°C'
          : '-',
      },
      uvIndex: {
        min: data.uvindex_min ? Number(data.uvindex_min).toFixed(2) : '0',
        max: data.uvindex_max ? Number(data.uvindex_max).toFixed(2) : '0',
      },
      icon: getWeatherIcon(data?.icon) || '',
      erythemalDose: _.isNumber(data.dose_ery_ss)
        ? round(data.dose_ery_ss, 1) + ' J/m²'
        : null,
      erythemalDoseNoSunscreen: _.isNumber(data.dose_ery)
        ? round(data.dose_ery, 1) + ' J/m²'
        : null,
      erythemalDoseFraction:
        convertToPercentage(data.dose_ery_frac_ss, true) || '-',
      erythemalDoseFractionNoSunscreen:
        convertToPercentage(data.dose_ery_frac, true) || '-',
      ppixDose: _.isNumber(data.dose_ppix_ss)
        ? round(Number(data.dose_ppix_ss) / ten_thousand, 1)
        : null,
      ppixDoseNoSunscreen: _.isNumber(data.dose_ppix)
        ? round(Number(data.dose_ppix) / ten_thousand, 1)
        : null,
      unsuitableReasons: data.colour_info ? _.flatten(data.colour_info) : [],
    }))
    .value();
  return results;
};

export const getCustomSessionDetails = (timeSlots: Slots, timezone: string) => {
  const ten_thousand = 10000;
  const results = _.map(timeSlots, (data) => {
    return {
      preStartTime: data.pretreatment_start
        ? moment(data.pretreatment_start).tz(timezone).format('HH:mm')
        : '',
      isPretreatmentOverdue: isTreatmentTimeOverdue(
        data.pretreatment_start,
        timezone
      ),
      forecastDuration: _.isNumber(data.tottime_ss)
        ? formatTime(data.tottime_ss)
        : t('pdt_unachievable'),
      forecastDurationNoSunscreen: _.isNumber(data.tottime)
        ? formatTime(data.tottime)
        : t('pdt_unachievable'),
      precipitation: _.isNumber(data.precipitation)
        ? convertToPercentage(data.precipitation, true)
        : '-',
      temperature: {
        min: data.temperature_min
          ? Number(data.temperature_min).toFixed(1) + '°C'
          : '-',
        max: data.temperature_max
          ? Number(data.temperature_max).toFixed(1) + '°C'
          : '-',
      },
      uvIndex: {
        min: data.uvindex_min ? Number(data.uvindex_min).toFixed(2) : '0',
        max: data.uvindex_max ? Number(data.uvindex_max).toFixed(2) : '0',
      },
      icon: getWeatherIcon(data?.icon) || '',
      erythemalDose: _.isNumber(data.dose_ery_ss)
        ? round(data.dose_ery_ss, 1) + ' J/m²'
        : null,
      erythemalDoseNoSunscreen: _.isNumber(data.dose_ery)
        ? round(data.dose_ery, 1) + ' J/m²'
        : null,
      erythemalDoseFraction:
        convertToPercentage(data.dose_ery_frac_ss, true) || '-',
      erythemalDoseFractionNoSunscreen:
        convertToPercentage(data.dose_ery_frac, true) || '-',
      ppixDose: _.isNumber(data.dose_ppix_ss)
        ? round(Number(data.dose_ppix_ss) / ten_thousand, 1)
        : null,
      ppixDoseNoSunscreen: _.isNumber(data.dose_ppix)
        ? round(Number(data.dose_ppix) / ten_thousand, 1)
        : null,
      unsuitableReasons: data.colour_info ? _.flatten(data.colour_info) : [],
    };
  });
  return results;
};

export const getSessionGraphData = (selectedDate: string, timeSlots: Slots) => {
  const ten_thousand = 10000;
  const results = _(timeSlots)
    .filter((_a, keys) => keys === selectedDate)
    .map((data) => ({
      ppix_sunscreen_percentage: _.isNumber(data.dose_ppix_frac_ss)
        ? convertToPercentage(data.dose_ppix_frac_ss)
        : 0,
      ppix_no_sunscreen_percentage: _.isNumber(data.dose_ppix_frac)
        ? convertToPercentage(data.dose_ppix_frac)
        : 0,
      erythermal_sunscreen_percentage: _.isNumber(data.dose_ery_frac_ss)
        ? convertToPercentage(data.dose_ery_frac_ss)
        : 0,
      erythermal_no_sunscreen_percentage: data.dose_ery_frac
        ? convertToPercentage(data.dose_ery_frac)
        : 0,
      ppix_sunscreen_label: _.isNumber(data.dose_ppix_ss)
        ? round(Number(data.dose_ppix_ss) / ten_thousand, 1)
        : 0,
      ppix_no_sunscreen_label: _.isNumber(data.dose_ppix)
        ? round(Number(data.dose_ppix) / ten_thousand, 1)
        : 0,
      erythermal_sunscreen_label: _.isNumber(data.dose_ery_ss)
        ? round(data.dose_ery_ss, 1)
        : 0,
      erythermal_no_sunscreen_label: _.isNumber(data.dose_ery)
        ? round(data.dose_ery, 1)
        : 0,
    }))
    .value();
  return results;
};

export const getCustomSessionGraphData = (timeSlots: Slots) => {
  const ten_thousand = 10000;
  const results = _.map(timeSlots, (data) => {
    return {
      ppix_sunscreen_percentage: _.isNumber(data.dose_ppix_frac_ss)
        ? convertToPercentage(data.dose_ppix_frac_ss)
        : 0,
      ppix_no_sunscreen_percentage: _.isNumber(data.dose_ppix_frac)
        ? convertToPercentage(data.dose_ppix_frac)
        : 0,
      erythermal_sunscreen_percentage: _.isNumber(data.dose_ery_frac_ss)
        ? convertToPercentage(data.dose_ery_frac_ss)
        : 0,
      erythermal_no_sunscreen_percentage: data.dose_ery_frac
        ? convertToPercentage(data.dose_ery_frac)
        : 0,
      ppix_sunscreen_label: _.isNumber(data.dose_ppix_ss)
        ? round(Number(data.dose_ppix_ss) / ten_thousand, 1)
        : 0,
      ppix_no_sunscreen_label: _.isNumber(data.dose_ppix)
        ? round(Number(data.dose_ppix) / ten_thousand, 1)
        : 0,
      erythermal_sunscreen_label: _.isNumber(data.dose_ery_ss)
        ? round(data.dose_ery_ss, 1)
        : 0,
      erythermal_no_sunscreen_label: _.isNumber(data.dose_ery)
        ? round(data.dose_ery, 1)
        : 0,
    };
  });
  return results;
};

export function getValue(percentage: number, total: number) {
  return round((percentage / 100) * total, 1);
}

export function getMaxPercent(value: string | number, maxPercentage = 150) {
  return Number(value) > maxPercentage ? maxPercentage : Number(value);
}

export const excludedCustomHour = ['00', '22', '23'];

const excludedTime = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '19',
  '20',
  '21',
  '22',
  '23',
];

const timezoneUnixOffset = (date: string, timezone: string) => {
  return (
    moment(parseInt(date) * 1000)
      .tz(timezone)
      .utcOffset() *
    60 *
    1000
  );
};

export const isTreatmentReadyToBegin = (date: number) =>
  moment().isSameOrAfter(moment.unix(date), 'day');
