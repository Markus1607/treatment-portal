import { includes } from 'lodash';
import { useQuery } from 'react-query';
import apiServer from 'server/apiServer';
import { TFunction } from 'react-i18next';
import { RemoveCookieType } from 'AppProvider';
import { userLogoutCleanUp } from 'utils/functions';
import {
  SunscreenListResponseType,
  formatInstData,
  formatSunscreenData,
} from './format';
import { adminInstitution, sunscreenEndpoint, treatmentStaff } from 'routes';
import { BookedAndOngoingTreatments } from '~/pages/Schedule/api/types/treatments';

type useValidateUserTokenArgType = {
  token: string;
  isUserLoggedIn: boolean;
  removeCookie: RemoveCookieType;
  t: TFunction<'translation', undefined>;
};

export const useValidateUserToken = ({
  t,
  token,
  removeCookie,
  isUserLoggedIn,
}: useValidateUserTokenArgType) => {
  return useQuery(
    ['protocolDataLogin', t, token, removeCookie, isUserLoggedIn],
    async ({ signal }) => {
      return await apiServer
        .get(`${adminInstitution}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(({ data }) => {
          localStorage.setItem(
            'institutionLatLon',
            JSON.stringify({
              lat: data.insts.lat,
              lon: data.insts.lon,
            })
          );
          return formatInstData(data?.insts);
        })
        .catch((err) => {
          if (err.response?.data?.code) {
            const { code } = err.response?.data as { code: number };
            code === 2006 && alert(t('Error.invalid.login.token'));
            code === 2002 && alert(t('Error.user.account.deleted'));
            if (includes([2006, 2002], code)) {
              userLogoutCleanUp(removeCookie);
            }
          }
          console.error({ error: err.message });
        });
    },
    {
      enabled: isUserLoggedIn,
    }
  );
};

type useSunscreenListArgType = {
  token: string;
};

export const useSunscreenList = ({ token }: useSunscreenListArgType) => {
  return useQuery(
    ['sunscreenList', token],
    async ({ signal }) => {
      return await apiServer
        .get<SunscreenListResponseType>(`${sunscreenEndpoint}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(({ data }) => formatSunscreenData(data.sunscreens))
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

export async function getBookedAndOngoingTreatments(
  token: string,
  signal: AbortSignal | undefined
) {
  return await apiServer.get<BookedAndOngoingTreatments>(`${treatmentStaff}`, {
    signal,
    headers: {
      'x-access-tokens': token,
    },
  });
}
