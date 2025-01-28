import apiServer from 'server/apiServer';
import { useMutation } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { PostTreatmentDataType } from './serverFormats';
import type { DeleteTreatmentResponse } from './query.d';
import {
  beginSessionEndpoint,
  amendSessionEndpoint,
  naturalPDTSchedulingEndpoint,
} from 'routes';
import { beginTreatmentDataType } from './format.d';
import { SessionDetailsResponseType } from '~/pages/Patients/components/PatientSchedule/api/query.d';

type PostTreatmentData = {
  token: string;
  data: PostTreatmentDataType;
};

export const usePostTreatment = (patientUid: string) => {
  return useMutation<
    AxiosResponse<SessionDetailsResponseType, any>,
    AxiosError,
    PostTreatmentData,
    unknown
  >(({ token, data }) =>
    apiServer.post<
      PostTreatmentDataType,
      AxiosResponse<SessionDetailsResponseType>
    >(
      `${naturalPDTSchedulingEndpoint(patientUid)}`,
      {
        ...data,
      },
      {
        headers: {
          'x-access-tokens': token,
        },
      }
    )
  );
};

type PutTreatmentData = {
  token: string;
  sessionId: string;
  data: {
    scheduled_start_time: number;
    expected_end_time: number;
  };
};

export const usePutTreatment = () => {
  return useMutation<
    AxiosResponse<SessionDetailsResponseType, any>,
    AxiosError,
    PutTreatmentData,
    unknown
  >(({ token, data, sessionId }) =>
    apiServer.put<PutTreatmentData, AxiosResponse<SessionDetailsResponseType>>(
      `${amendSessionEndpoint}/${sessionId}`,
      {
        ...data,
      },
      {
        headers: {
          'x-access-tokens': token,
        },
      }
    )
  );
};

type DeleteTreatmentData = {
  token: string;
  data: {
    sessionId: string;
  };
};

export const useCancelTreatment = () => {
  return useMutation<
    AxiosResponse<DeleteTreatmentResponse, any>,
    AxiosError,
    DeleteTreatmentData,
    unknown
  >(({ token, data }) =>
    apiServer.delete<
      { date_time_slot: number },
      AxiosResponse<DeleteTreatmentResponse>
    >(`${amendSessionEndpoint}/${data.sessionId}`, {
      headers: {
        'x-access-tokens': token,
      },
    })
  );
};

export const useBeginTreatment = () => {
  return useMutation(
    ({ token, data }: { token: string; data: beginTreatmentDataType }) =>
      apiServer.post(`${beginSessionEndpoint(data.session_id)}`, null, {
        headers: {
          'x-access-tokens': token,
        },
      })
  );
};
