import { AxiosResponse } from 'axios';
import { staffOptionsUrl } from 'routes';
import apiServer from 'server/apiServer';
import { useMutation } from 'react-query';
import { StaffPostData } from '../../RegisterStaff/api/format';
import { StaffPostResponseType } from '../../RegisterStaff/api/query';

export const useUpdateStaff = (patientUid: string) => {
  return useMutation(
    ({ token, data }: { token: string; data: StaffPostData }) =>
      apiServer.put<StaffPostData, AxiosResponse<StaffPostResponseType>>(
        `${staffOptionsUrl(patientUid)}`,
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
