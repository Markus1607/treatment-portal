import { signUpStaff } from 'routes';
import apiServer from 'server/apiServer';
import { useMutation } from 'react-query';
import { StaffPostData } from './format';
import { AxiosError, AxiosResponse } from 'axios';

export type StaffPostResponseType = {
  staff_member: {
    email: string;
    forename: string;
    ins_uid: string;
    surname: string;
    tou_accepted: boolean;
    uid: string;
    username: string;
  };
};

export const usePostStaff = () => {
  return useMutation<
    AxiosResponse<StaffPostResponseType, any>,
    AxiosError,
    {
      token: string;
      data: StaffPostData;
    },
    unknown
  >(({ token, data }) =>
    apiServer.post(
      `${signUpStaff}`,
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
