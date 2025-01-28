import { CalendarDataSlot, CalendarDataWeather } from './calendar';

export interface CustomStartCalendar {
  calendar: {
    ery100: number;
    lat: number;
    lon: number;
    ppix100: number;
    slots: Slots;
    timezone: string;
    weather: Weather;
  };
}

export interface Slots {
  [key: string]: CalendarDataSlot;
}

export interface Weather {
  [key: string]: CalendarDataWeather;
}
