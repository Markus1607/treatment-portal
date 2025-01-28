import apiServer from 'server/apiServer';
import {
  naturalPDTCalendarApiUrl,
  naturalPDTCalendarCustomTimeApiUrl,
} from 'routes';
import { uniqBy, isNumber, isEmpty } from 'lodash';
import { useMutation, useQuery } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { CustomStartCalendar } from './types/custom-start-time';
import { CalendarData, FutureCalendarData } from './types/calendar';
import { PutCalendarDataType, PutCustomCalendarDataType } from './format';

type CalendarMutateType = {
  token: string;
  patientUid: string;
  data: PutCalendarDataType;
};

const getData = ({ token, data, patientUid }: CalendarMutateType) => {
  const { signal } = new AbortController();
  return getMonth(signal, token, data, patientUid);
};

export const useCalendarData = () =>
  useMutation<
    AxiosResponse<{ calendar: CalendarData }, any>,
    AxiosError,
    any,
    unknown
  >(({ token, data, patientUid }) => getData({ token, data, patientUid }));

export const useGetCalendarData = (
  token: string,
  patientUid: string,
  data: PutCalendarDataType,
  calendarMonth: number,
  isDataValid: boolean,
  cachedData: CalendarData
) => {
  const isEnabled =
    isDataValid && isNumber(calendarMonth) && patientUid ? true : false;

  return useQuery(
    ['calendarData', token, data, calendarMonth, isDataValid],
    ({ signal }) => {
      if (!signal) return;
      if (calendarMonth === 1 && patientUid) {
        return getNextMonthCalendarData(
          signal,
          token,
          data,
          cachedData,
          patientUid
        );
      } else {
        return getMonth(signal, token, data, patientUid)
          .then(({ data }) => data.calendar)
          .catch((err) => {
            if (err.response?.data) {
              return err.response.data;
            }
            return { error: err.message };
          });
      }
    },
    {
      enabled: isEnabled,
      cacheTime: 20 * 60 * 1000,
    }
  );
};

/**
 * * Fetches both calendar month 0 and 1 data
 */

export const usePreviousCalendarData = () => {
  return useMutation<
    AxiosResponse<FormatCalendarResponseType, any>,
    AxiosError,
    any,
    unknown
  >({
    onMutate({
      token,
      data,
      patientUid,
    }: {
      token: string;
      data: PutCalendarDataType;
      patientUid: string;
    }) {
      const { signal } = new AbortController();
      return axios
        .all([
          getMonthOne(signal, token, data, patientUid),
          getMonthTwo(signal, token, data, patientUid),
        ])
        .then(
          axios.spread((...responses) => {
            const monthOne = responses[0]?.data.calendar as CalendarData;
            const monthTwo = responses[1]?.data.calendar;
            return formatCalendarResponse(monthOne, monthTwo);
          })
        )
        .catch((error) => {
          console.error(error);
          return { error };
        });
    },
  });
};

export const useCustomStartTime = () => {
  return useMutation<
    AxiosResponse<CustomStartCalendar, any>,
    AxiosError,
    any,
    unknown
  >(
    ({
      token,
      data,
      patientUid,
    }: {
      token: string;
      data: PutCustomCalendarDataType;
      patientUid: string;
    }) =>
      apiServer.post<
        PutCustomCalendarDataType,
        AxiosResponse<CustomStartCalendar>
      >(
        `${naturalPDTCalendarCustomTimeApiUrl(patientUid)}`,
        {
          ...data,
        },
        {
          headers: {
            'x-access-tokens': token,
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
  );
};

/**
 * * Use cached month 0 data if available, if not fetch both data at once
 */

const getNextMonthCalendarData = (
  signal: AbortSignal,
  token: string,
  data: PutCalendarDataType,
  cachedData: CalendarData,
  patientUid: string
): Promise<FormatCalendarResponseType | { error: string }> => {
  if (!isEmpty(cachedData?.fortnights)) {
    return getMonthTwo(signal, token, data, patientUid)
      .then(({ data }) => {
        const monthOne = cachedData;
        const monthTwo = data.calendar;
        return formatCalendarResponse(monthOne, monthTwo);
      })
      .catch((err: AxiosError) => {
        if (err.response?.data) {
          return err.response.data;
        }
        return { error: err.message };
      });
  } else {
    return axios
      .all([
        getMonthOne(signal, token, data, patientUid),
        getMonthTwo(signal, token, data, patientUid),
      ])
      .then(
        axios.spread((...responses) => {
          const monthOne = responses[0]?.data.calendar as CalendarData;
          const monthTwo = responses[1]?.data.calendar;
          return formatCalendarResponse(monthOne, monthTwo);
        })
      )
      .catch((error: AxiosError) => {
        console.error(error);
        return { error: error.message };
      });
  }
};

/**
 * * Get calendar data for a given month
 */

const getMonth = (
  signal: AbortSignal,
  token: string,
  data: PutCalendarDataType,
  patientUid: string
) => {
  return apiServer.post<
    PutCalendarDataType,
    AxiosResponse<{
      calendar: CalendarData;
    }>
  >(
    `${naturalPDTCalendarApiUrl(patientUid)}`,
    {
      ...data,
    },
    {
      signal,
      headers: {
        'x-access-tokens': token,
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

/**
 * * Month 0 and month 1 PUT calls definitions
 */

const getMonthOne = (
  signal: AbortSignal,
  token: string,
  data: PutCalendarDataType,
  patientUid: string
) =>
  apiServer.post<
    PutCalendarDataType,
    AxiosResponse<{ calendar: CalendarData }>
  >(
    `${naturalPDTCalendarApiUrl(patientUid)}`,
    {
      ...data,
      months: 0,
    },
    {
      signal,
      headers: {
        'x-access-tokens': token,
        'Access-Control-Allow-Origin': '*',
      },
    }
  );

const getMonthTwo = (
  signal: AbortSignal,
  token: string,
  data: PutCalendarDataType,
  patientUid: string
) =>
  apiServer.post<
    PutCalendarDataType,
    AxiosResponse<{ calendar: FutureCalendarData }>
  >(
    `${naturalPDTCalendarApiUrl(patientUid)}`,
    {
      ...data,
      months: 1,
    },
    {
      signal,
      headers: {
        'x-access-tokens': token,
        'Access-Control-Allow-Origin': '*',
      },
    }
  );

/**
 * * Global response format for calendar data 0 and 1
 */

const formatCalendarResponse = (
  monthOne: CalendarData,
  monthTwo: FutureCalendarData
) => {
  return {
    days: {
      ...monthOne?.days,
    },
    ...monthTwo,
    slots: {
      ...monthOne?.slots,
    },
    fortnights: uniqBy(
      [...monthOne.fortnights, ...monthTwo.fortnights],
      'end_date'
    ),
    weather: {
      ...monthOne?.weather,
    },
  };
};

export type FormatCalendarResponseType = ReturnType<
  typeof formatCalendarResponse
>;
