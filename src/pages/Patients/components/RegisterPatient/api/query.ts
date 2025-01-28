import { AxiosResponse } from 'axios';
import apiServer from 'server/apiServer';
import { staffPatientRoute } from 'routes';
import { PatientBEDataType } from './format';
import { useMutation } from 'react-query';
import { RegistedUserResponse } from '../../../types';

export const usePostPatientDetails = () => {
  return useMutation(
    ({ token, data }: { token: string; data: PatientBEDataType }) =>
      apiServer.post<PatientBEDataType, AxiosResponse<RegistedUserResponse>>(
        `${staffPatientRoute}`,
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
