export interface CalendarData {
  days: { [key: string]: Day };
  ery100: number | null;
  fortnights: Fortnight[];
  lat: number | null;
  lon: number | null;
  ppix100: number | null;
  slots: { [key: string]: CalendarDataSlot };
  timezone: string;
  weather: { [key: string]: CalendarDataWeather };
}

export type FutureCalendarData = Omit<CalendarData, 'days'>;

export interface Day {
  colour: Colour;
  icon: Icon;
  local_date: Date;
  suitability_index: number;
}

export type Colour = 'red' | 'amber' | 'green';

export type Icon = 'cloud_sun' | 'sun' | 'cloud' | 'rain';

export interface Fortnight {
  data: Data;
  end_date: Date;
  ref_date: Date;
  start_date: Date;
}

export interface Data {
  days: { [key: string]: Day };
  slots: { [key: string]: DataSlot };
  weather: { [key: string]: DataWeather };
}

export interface DataSlot {
  colour: Colour;
  colour_info: Array<Array<number | ColourInfoType>>;
  dose_ery: number;
  dose_ery_default: number;
  dose_ery_frac: number;
  dose_ery_frac_default: number;
  dose_ery_frac_ss: number;
  dose_ery_frac_ss_default: number;
  dose_ery_ss: number;
  dose_ery_ss_default: number;
  dose_ppix: number;
  dose_ppix_default: number;
  dose_ppix_frac: number;
  dose_ppix_frac_default: number;
  dose_ppix_frac_ss: number;
  dose_ppix_frac_ss_default: number;
  dose_ppix_ss: number;
  dose_ppix_ss_default: number;
  end: string;
  end_ss: string;
  icon: Icon;
  irr_ery: number;
  irr_ery_ss: number;
  irr_ppix: number;
  irr_ppix_ss: number;
  local_hour: number;
  precipitation: number;
  pretreatment_start: string;
  temperature_max: number;
  temperature_min: number;
  tottime: number | '';
  tottime_ss: number | '';
  uvindex_max: number;
  uvindex_min: number;
}

export type ColourInfoType =
  | 'min_ppix_dose'
  | 'min_time'
  | 'max_time'
  | 'min_temp'
  | 'max_temp'
  | 'amber_precip'
  | 'max_precip'
  | 'min_precip'
  | 'max_ery_dose'
  | 'max_ppix_dose';

export interface DataWeather {
  irr_ery: number;
  irr_ery_ss: number;
  irr_ppix: number;
  irr_ppix_ss: number;
  local_hour: number;
  Precipitation: number;
  Temperature: number;
}

export interface CalendarDataSlot {
  colour: Colour;
  colour_info: Array<Array<number | ColourInfoType>>;
  dose_ery: number;
  dose_ery_default: number;
  dose_ery_frac: number;
  dose_ery_frac_default: number;
  dose_ery_frac_ss: number;
  dose_ery_frac_ss_default: number;
  dose_ery_ss: number;
  dose_ery_ss_default: number;
  dose_ppix: number;
  dose_ppix_default: number;
  dose_ppix_frac: number;
  dose_ppix_frac_default: number;
  dose_ppix_frac_ss: number;
  dose_ppix_frac_ss_default: number;
  dose_ppix_ss: number;
  dose_ppix_ss_default: number;
  end: string;
  end_ss: string;
  icon: Icon;
  irr_ery: number;
  irr_ery_ss: number;
  irr_ppix: number;
  irr_ppix_ss: number;
  precipitation: number;
  pretreatment_start: string;
  temperature_max: number;
  temperature_min: number;
  tottime: number | '';
  tottime_ss: number | '';
  uvindex_max: number;
  uvindex_min: number;
}

export interface CalendarDataWeather {
  cloud: number;
  icon: Icon;
  irr_ery: number;
  irr_ery_ss: number;
  irr_ppix: number;
  irr_ppix_ss: number;
  precipitation: number;
  temperature: number;
}
