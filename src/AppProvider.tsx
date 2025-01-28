import { useCookies } from 'react-cookie';
import { useLocalStorage } from 'utils/hooks';
import { useTranslation } from 'react-i18next';
import { createContainer } from 'unstated-next';
import ReactFlagsSelect from 'react-flags-select';
import { CookieSetOptions } from 'universal-cookie';
import { useState, useCallback } from 'react';
import { getUserLanguage } from 'utils/functions';
import { UserType, SunscreenList, selectedCountryType } from '@types';
import {
  isDevEnv,
  customCtryLabels,
  supportedCtryCodes,
} from 'utils/constants';
import { InstitutionInfoType } from './pages/Login/api/utils';

function useAppProvider() {
  const lang = getUserLanguage();
  const { t, i18n } = useTranslation();
  const acceptCookiesInitState = isDevEnv ? true : false;
  const [cookies, setCookies, removeCookie] = useCookies<
    'user',
    { user: UserType }
  >(['user']);
  const [currentPatientUid, setCurrentPatientUid] = useState('');
  const [currentPatientUsername, setCurrentPatientUsername] = useState('');
  const [sunscreenList, setSunscreenList] = useState<SunscreenList>([]);
  const [selectedCountry, setCountry] = useLocalStorage<selectedCountryType>(
    'ctryCode',
    lang === 'en' ? 'GB' : (lang.toUpperCase() as selectedCountryType) || 'GB'
  );
  const [acceptedCookies, setAcceptedCookies] = useLocalStorage(
    'acceptedCookies',
    acceptCookiesInitState
  );
  const [institutionInfo] = useLocalStorage<InstitutionInfoType | null>(
    'institutionInfo',
    null
  );

  const changeLanguage = useCallback(
    (ctryCode: string) => {
      setCountry(ctryCode);
      const lang = ctryCode === 'GB' ? 'en' : ctryCode.toLowerCase();
      i18n.changeLanguage(lang);
    },
    [setCountry, i18n]
  );

  const SelectLang = () => {
    return (
      <ReactFlagsSelect
        optionsSize={14}
        selectedSize={14}
        className='menu-flags'
        onSelect={changeLanguage}
        selected={selectedCountry}
        countries={supportedCtryCodes}
        customLabels={customCtryLabels}
        placeholder={t('Select.language.placeholder')}
        selectButtonClassName='menu-flags-button'
      />
    );
  };

  return {
    t,
    cookies,
    setCookies,
    SelectLang,
    removeCookie,
    sunscreenList,
    institutionInfo,
    acceptedCookies,
    selectedCountry,
    setSunscreenList,
    currentPatientUid,
    setAcceptedCookies,
    setCurrentPatientUid,
    currentPatientUsername,
    setCurrentPatientUsername,
  };
}

export const AppProvider = createContainer(useAppProvider);

export type RemoveCookieType = (
  name: 'user',
  options?: CookieSetOptions
) => void;
