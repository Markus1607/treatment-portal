import { useQuery } from 'react-query';
import type { AxiosError } from 'axios';
import apiServer from 'server/apiServer';
import { staffPatientRoute } from 'routes';
import { AllPatientList } from '../../../types';

export const useAllPatientsDataUnformatted = (
  token: string,
  staffId: string
) => {
  return useQuery<AllPatientList['patients'] | { error: string }>(
    ['unformattedAllPatientData', token, staffId],
    async ({ signal }) => {
      return getAllPatientsList(token, staffId, signal)
        .then(async ({ data }) => {
          return data['patients'];
        })
        .catch((err: AxiosError) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    },
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
};

export async function getAllPatientsList(
  token: string,
  staffId: string,
  signal: AbortSignal | undefined
) {
  return await apiServer.get<AllPatientList>(`${staffPatientRoute}`, {
    signal,
    headers: {
      user_id: staffId,
      'x-access-tokens': token,
    },
  });
}
