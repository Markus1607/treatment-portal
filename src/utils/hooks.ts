import { useQuery } from 'react-query';
import apiServer from 'server/apiServer';
import { toast } from 'react-hot-toast';
import { AppProvider } from 'AppProvider';
import { useHistory } from 'react-router-dom';
import { InstitutionInfoType } from 'pages/Login/api/utils';
import { useState, useEffect, RefObject, useRef } from 'react';
import { formatInstData } from 'components/Layouts/api/format';
import { getStorageValue, userLogoutCleanUp } from './functions';
import {
  loginStaff,
  loginAdmin,
  staffLogoutUrl,
  adminLogoutUrl,
  staffInstitution,
} from 'routes';
import { AxiosResponse, AxiosError } from 'axios';
import { Institution } from 'pages/Login/api/api';

export function useTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    return () => {
      document.title = prevTitle;
    };
  });
}

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }, [key, value]);

  return [value, setValue];
};

export const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
};

export const useHandleUserLogout = (successFn?: () => void) => {
  const {
    t,
    removeCookie,
    cookies: { user },
  } = AppProvider.useContainer();

  const history = useHistory();
  const isAdmin = user.staffType === 'ADMIN';
  const logoutPath = isAdmin ? loginAdmin : loginStaff;

  const logoutUser = () =>
    apiServer
      .post(isAdmin ? adminLogoutUrl : staffLogoutUrl, null, {
        headers: {
          'x-access-tokens': user.token,
        },
      })
      .then(({ status }) => {
        if (status === 200) {
          userLogoutCleanUp(removeCookie);
          successFn ? successFn() : history.push(logoutPath);
        }
      })
      .catch((error) => {
        console.error(error.message);
        toast.error(t('Error.logging_out'));
      });

  return logoutUser;
};

export const useScrollIntoViewOnSelect = (isSelected: boolean) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isSelected && linkRef.current) {
      linkRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSelected]);

  return linkRef;
};

export function useInstitutionInfo() {
  const [instData] = useLocalStorage<InstitutionInfoType>('institutionInfo', {
    key: null,
    uid: '',
    lat: 0,
    lon: 0,
    name: '',
    email: '',
    tokens: 0,
    address: '',
    maxStaff: 0,
    postCode: '',
    subscription_type: 0,
    subscription_expiry: 0,
  });
  return formatInstData(instData as InstitutionInfoType);
}

export function useFetchInstitutionDetails(token: string) {
  return useQuery<
    any,
    AxiosError,
    Institution | { code: number; error: string } | { error: string },
    string[]
  >(
    ['institutionData', token],
    async ({ signal }) => {
      try {
        const { data } = await apiServer.get<
          Institution,
          AxiosResponse<
            {
              institution: Institution;
            },
            any
          >,
          any
        >(staffInstitution, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
        });

        return data.institution;
      } catch (err: AxiosError<any> | any) {
        if (err?.response?.data) {
          return err.response?.data;
        }
        return { error: err.message };
      }
    },
    {
      staleTime: 1000 * 60 * 2,
    }
  );
}
