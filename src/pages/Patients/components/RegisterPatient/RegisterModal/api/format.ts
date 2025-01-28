import i18next from 'i18next';
import { isNumber, flatten, isEmpty } from 'lodash';
import { CalendarDataSlot } from 'pages/Schedule/api/types/calendar';
import {
  round,
  formatTime,
  getWeatherIcon,
  calculateAverage,
  getTimeSuitability,
  convertToPercentage,
  getDateFromIsoDateFormat,
} from 'utils/functions';

const t = i18next?.t.bind(i18next);

export const formatSessionCalendarResponse = (
  data: CalendarDataSlot,
  sunscreen: string
) => {
  const ten_thousand = 10000;
  //* BE error mapping for sunscreen: 0 means Yes and 1 means No
  const isSunscreenApplied = sunscreen ? false : true;
  return {
    sunscreen,
    forecastDuration: isSunscreenApplied
      ? isNumber(data.tottime_ss)
        ? formatTime(data.tottime_ss)
        : t('pdt_unachievable')
      : isNumber(data.tottime)
      ? formatTime(data.tottime)
      : t('pdt_unachievable'),
    ppixDose: isSunscreenApplied
      ? round(Number(data.dose_ppix_ss) / ten_thousand, 1)
      : round(Number(data.dose_ppix) / ten_thousand, 1),
    erthemalDose: isSunscreenApplied
      ? round(data.dose_ery_ss, 1)
      : round(data.dose_ery, 1),
    erythemalDosePercentage: isSunscreenApplied
      ? convertToPercentage(data.dose_ery_frac_ss)
      : convertToPercentage(data.dose_ery_frac),
    weatherCondition: getWeatherIcon(data?.icon) || '-',
    suitability: getTimeSuitability(data.colour),
    temperature:
      isNumber(data.temperature_min) && isNumber(data.temperature_max)
        ? calculateAverage(data.temperature_min, data.temperature_max)
        : '',
    chanceOfRain: isNumber(data.precipitation)
      ? convertToPercentage(data.precipitation) + ' %'
      : '-',
    uvIndex:
      isNumber(data.uvindex_min) && isNumber(data.uvindex_max)
        ? calculateAverage(data.uvindex_min, data.uvindex_max)
        : '',
    preStartTime: data.pretreatment_start,
    estimatedEndTime: isSunscreenApplied ? data.end_ss : data.end,
    estimatedEndTimeHour: isSunscreenApplied
      ? getDateFromIsoDateFormat(data.end_ss, 'HH:mm')
      : getDateFromIsoDateFormat(data.end, 'HH:mm'),
    unsuitableReasons: !isEmpty(data.colour_info)
      ? flatten(data.colour_info)
      : [],
  };
};

export type SessionCalendarDataType = ReturnType<
  typeof formatSessionCalendarResponse
>;

export type SessionDetailsDataType = SessionCalendarDataType & {
  startTime: string;
  ppixDoseNoSunscreen?: string;
  forecastDurationNoSunscreen?: string;
};

export const sessionDetailsDefaultValues = {
  sunscreen: '',
  forecastDuration: '',
  ppixDose: '',
  erthemalDose: '',
  erythemalDosePercentage: 0,
  weatherCondition: '-',
  suitability: '',
  temperature: '',
  chanceOfRain: '',
  uvIndex: '',
  preStartTime: '',
  estimatedEndTime: '',
  estimatedEndTimeHour: '',
  unsuitableReasons: [],
  startTime: '',
};
