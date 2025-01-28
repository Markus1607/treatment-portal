import { loginAdmin } from 'routes';
import { TFunction } from 'react-i18next';
import { LoginResponseType } from './api';

export const setCookieData = (data: LoginResponseType) => {
  return {
    token: data.token,
    instId: data.institution?.uid || null,
    staffType: data?.admin ? 'ADMIN' : 'STAFF',
    ...(data.staff_member &&
      data.institution && {
        id: data.staff_member.uid,
        firstName: data.staff_member.forename,
        lastName: data.staff_member.surname,
        instName: data.institution.name,
        email: data.staff_member.email,
        termsOfUseAccepted: data.staff_member?.tou_accepted,
      }),
  };
};

export const updateCookieData = (
  prevData: LoginResponseType,
  staff_member: LoginResponseType['staff_member']
) => {
  return {
    ...prevData,
    ...(staff_member && {
      firstName: staff_member.forename,
      lastName: staff_member.surname,
      email: staff_member.email,
    }),
  };
};

export const getErrorMsg = (
  t: TFunction<'translation', undefined>,
  code: number,
  path: string,
  errorMsg: string
) => {
  const isAdmin = path === loginAdmin;
  if (!code) return t('Error.server_down_error');
  switch (code) {
    case 2001:
      return t('Error.email_password_incorrect');
    case 2002:
      return isAdmin
        ? t('Error.admin_not_registered')
        : t('Error.user_not_registered');
    default:
      return errorMsg;
  }
};

export const setInstitutionInfo = (data: LoginResponseType) => {
  localStorage.setItem(
    'institutionInfo',
    data.institution
      ? JSON.stringify({
          key: data.institution.key,
          uid: data.institution.uid,
          lat: data.institution.lat,
          lon: data.institution.lon,
          name: data.institution.name,
          email: data.institution.email,
          address: data.institution.address,
          tokens: data.institution.token_count,
          maxStaff: data.institution.max_staff,
          postCode: data.institution.post_code,
          subscription_type: data.institution.subscription_type,
          subscription_expiry: data.institution.subscription_expiry,
        })
      : JSON.stringify(null)
  );
};

export type InstitutionInfoType = {
  uid: string;
  lat: number;
  lon: number;
  name: string;
  email: string;
  tokens: number;
  address: string;
  maxStaff: number;
  postCode: string;
  key: string | null;
  subscription_type: number;
  subscription_expiry: number;
};

export type InstitutionResponseDataType = {
  institution: Institution;
};

export type Institution = {
  uid: string;
  key: string;
  name: string;
  post_code: string;
  lat: number;
  lon: number;
  address: string;
  email: string;
  subscription_expiry: number;
  token_count: number;
  max_staff: number;
  current_staff: number;
  treatment_types: string[];
};

export async function hash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}
