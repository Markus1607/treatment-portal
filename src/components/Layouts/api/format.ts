import { isNumber } from 'lodash';
import { subscriptionType } from 'utils/options';
import { InstitutionInfoType } from 'pages/Login/api/utils';
import { getDateFromUnix, getLabelFromKey } from 'utils/functions';

export function formatInstData(data: InstitutionInfoType) {
  return {
    key: data?.key,
    uid: data?.uid,
    lat: data?.lat,
    lon: data?.lon,
    tokens: data.tokens,
    name: data.name ? data.name : '-',
    address: data.address ? data.address : '-',
    expiryDate: getDateFromUnix(data.subscription_expiry),
    planName: getLabelFromKey(data.subscription_type, subscriptionType()),
    clinicalStaffCount: isNumber(data.maxStaff) ? data.maxStaff : '-',
  };
}

export type SunscreenListResponseType = {
  sunscreens: Sunscreen[];
};

export type Sunscreen = {
  name: string;
  sd_meas: number;
  spf: number;
  uid: string;
};

export function formatSunscreenData(
  list: SunscreenListResponseType['sunscreens']
) {
  return list
    .filter((sunscreen) => sunscreen?.uid !== 'none')
    .map((sunscreen) => ({
      id: sunscreen.uid,
      value: sunscreen.uid,
      label: sunscreen.name,
    }));
}
