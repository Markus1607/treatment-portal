import { useQuery } from 'react-query';
import apiServer from 'server/apiServer';
import { formatPatientData } from './format';
import { Dispatch, SetStateAction } from 'react';
import { staffPatientRoute, patientPasswordReset } from 'routes';
import {
  PatientDataResponseType,
  UserPasswordResetResponse,
} from 'pages/Patients/types';

export type PatientDataPerID =
  | ReturnType<typeof formatPatientData>
  | { error: string };

export const usePatientDataPerID = (
  token: string,
  userID: string,
  patientUid: string
) => {
  return useQuery<PatientDataPerID | { error: string }>(
    ['patientDataPerID', token, userID, patientUid],
    async ({ signal }) => {
      return await apiServer
        .get<PatientDataResponseType>(`${staffPatientRoute}/${patientUid}`, {
          signal,
          headers: {
            user_id: userID,
            'x-access-tokens': token,
          },
        })
        .then(({ data }) => formatPatientData(data.patient))
        .catch((err) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    },
    {
      enabled: !!patientUid,
    }
  );
};

export type CredentialsDataType = {
  patientID: number | null;
  password: string;
};

export const resetPatientPassword = (
  token: string,
  patientUid: string,
  setGetNewPassword: Dispatch<SetStateAction<boolean>>
): Promise<{ patientID: number; password: string } | { error: string }> => {
  const controller = new AbortController();
  return apiServer
    .put<UserPasswordResetResponse>(
      `${patientPasswordReset(patientUid)}`,
      null,
      {
        signal: controller.signal,
        headers: {
          'x-access-tokens': token,
        },
      }
    )
    .then(({ data }) => {
      setGetNewPassword(false);
      return {
        patientID: data.credentials.username,
        password: data.credentials.password,
      };
    })
    .catch((err) => {
      setGetNewPassword(false);
      if (err.response?.data) {
        return err.response.data;
      }
      return { error: err.message };
    });
};
