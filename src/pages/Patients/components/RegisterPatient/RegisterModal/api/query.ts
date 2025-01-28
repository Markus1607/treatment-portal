import apiServer from 'server/apiServer';
import { useMutation } from 'react-query';
import type { AxiosResponse } from 'axios';
import { naturalPDTCalendarCustomTimeApiUrl } from 'routes';
import { PutCustomCalendarDataType } from 'pages/Schedule/api/format';
import { CustomStartCalendar } from 'pages/Schedule/api/types/custom-start-time';

export const useSessionCalendarData = () => {
  const { signal } = new AbortController();
  return useMutation(
    ({
      token,
      data,
      patientUid,
    }: {
      token: string;
      patientUid: string;
      data: PutCustomCalendarDataType;
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
          signal,
          headers: {
            'x-access-tokens': token,
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
  );
};
