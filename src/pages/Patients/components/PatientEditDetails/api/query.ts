import { AxiosResponse } from 'axios';
import apiServer from 'server/apiServer';
import { staffPatientRoute } from 'routes';
import { useQuery, useMutation } from 'react-query';
import { formatPatientEditDetails } from './format';
import { PatientBEDataType } from '../../RegisterPatient/api/format';
import {
  DeletedPatientResponse,
  PatientDataResponseType,
} from 'pages/Patients/types';

export const usePatientDataPerID = (
  token: string,
  userID: string,
  patientUid: string
) => {
  return useQuery(
    ['patientDataPerIDEdit', token, userID, patientUid],
    async ({ signal }) => {
      return await apiServer
        .get<PatientDataResponseType>(`${staffPatientRoute}/${patientUid}`, {
          signal,
          headers: {
            user_id: userID,
            'x-access-tokens': token,
          },
        })
        .then(({ data }) => formatPatientEditDetails(data.patient))
        .catch((err) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    }
  );
};

export const useUpdatePatientDetails = (patientUid: string) => {
  return useMutation(
    ({ token, data }: { token: string; data: PatientBEDataType }) =>
      apiServer.put<PatientBEDataType, AxiosResponse<PatientDataResponseType>>(
        `${staffPatientRoute}/${patientUid}`,
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

export const useDeletePatientDetails = (patientUid: string) => {
  return useMutation(({ token }: { token: string }) =>
    apiServer.delete<
      { patient_id: number },
      AxiosResponse<DeletedPatientResponse>
    >(`${staffPatientRoute}/${patientUid}`, {
      headers: {
        'x-access-tokens': token,
      },
    })
  );
};
