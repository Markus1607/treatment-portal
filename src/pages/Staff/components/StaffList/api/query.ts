import apiServer from 'server/apiServer';
import { useQuery, useMutation } from 'react-query';
import {
  formatStaff,
  StaffListDataType,
  StaffListResponseType,
} from './format';
import { signUpStaff, staffOptionsUrl } from 'routes';

export const useStaffData = (token: string) => {
  return useQuery<StaffListDataType | { error: string }>(
    ['staffData', token],
    async ({ signal }) => {
      return await apiServer
        .get<StaffListResponseType>(`${signUpStaff}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(({ data }) => formatStaff(data.staff_members))
        .catch((err) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    },
    {
      cacheTime: Infinity,
    }
  );
};

export const useDeleteStaffData = (patientUid: string) => {
  return useMutation(({ token }: { token: string }) =>
    apiServer.delete(`${staffOptionsUrl(patientUid)}`, {
      headers: {
        'x-access-tokens': token,
      },
    })
  );
};
