import { truncate } from './utils';
import UserLogout from './components/UserLogout';
import { AppProvider } from 'AppProvider';
import { useHistory } from 'react-router-dom';
import { useInstitutionInfo, useOnClickOutside } from 'utils/hooks';
import CeMark from 'assets/images/ic_ce_mark.svg';
import DashboardLogo from 'assets/images/dashboardLogo.svg';
import { useState, useRef, useEffect } from 'react';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import {
  staff,
  protocol,
  patients,
  institutions,
  patientRegister,
  // monitoring,
} from 'routes';
import { btnIcons } from 'utils/icons';
import { useSunscreenList } from '../api/query';
import PatientsListNavigation from './components/PatientsListNavigation';
import { ReactComponent as TokenIcon } from 'assets/images/ic_tokens.svg';
// import { ReactComponent as MonitoringIcon } from 'assets/images/ic_monitoring.svg';
import { ReactComponent as ProtocolIcon } from 'assets/images/ic_protocol_icon.svg';
import { ReactComponent as StaffMembersIcon } from 'assets/images/ic_staff_icon.svg';
import { useAllPatientsDataUnformatted } from 'pages/Patients/components/PatientList/api/query';

type MainLayoutPropType = {
  children: JSX.Element | JSX.Element[];
};

export default function MainLayout({ children }: MainLayoutPropType) {
  const ref = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const [menuToggle, setToggle] = useState(false);
  const {
    t,
    SelectLang,
    selectedCountry,
    setSunscreenList,
    currentPatientUid,
    setCurrentPatientUid,
    currentPatientUsername,
    setCurrentPatientUsername,
    cookies: { user },
  } = AppProvider.useContainer();
  const instData = useInstitutionInfo();
  const isAdmin = user.staffType === 'ADMIN';

  const { isLoading: isLoadingSunscreenData, data: sunscreenData } =
    useSunscreenList({ token: user?.token });

  useOnClickOutside(ref, () => setToggle(false));

  const { data: unsortedPatientList } = useAllPatientsDataUnformatted(
    user?.token,
    user?.id
  );

  useEffect(() => {
    if (!isLoadingSunscreenData && !sunscreenData?.error) {
      setSunscreenList(sunscreenData);
    }
  }, [sunscreenData, setSunscreenList, isLoadingSunscreenData]);

  useEffect(() => {
    if (Array.isArray(unsortedPatientList) && unsortedPatientList?.length) {
      const firstPatientUid =
        Array.isArray(unsortedPatientList) && unsortedPatientList?.[0]?.uid;

      if (!currentPatientUid && firstPatientUid) {
        setCurrentPatientUid(firstPatientUid);
      }
    }
  }, [currentPatientUid, unsortedPatientList]);

  return (
    <div className='w-full max-h-full 3xl:mx-auto'>
      <div className='relative flex text-sm shadow 2xl:text-base'>
        <div
          ref={ref}
          className={`${
            menuToggle ? 'flex' : 'hidden'
          } absolute flex-col justify-between max-h-screen h-screen text-white bg-blue lg:relative lg:flex lg:min-w-0 z-50 overflow-y-auto flex-shrink-0`}
        >
          {/* Left navigation bar  */}
          <div className='logoNav'>
            <button
              onClick={() => history.push(isAdmin ? institutions : patients)}
              className='px-1 pt-2 pb-3 cursor-pointer bg-blue-dark md:px-3 xl:px-4'
            >
              <img
                width='200'
                height='45'
                src={DashboardLogo}
                className='dashboardLogo'
                alt={t('Dashboard.logo_alt')}
              />
            </button>

            <button
              onClick={() => history.push(patientRegister)}
              className={`flex gap-2 items-center mx-auto my-6  py-3  text-white 2xl:text-[0.92rem] text-sm font-medium bg-blue-dark border border-white rounded hover:scale-105 active:scale-95 ${
                selectedCountry === 'GB' ? 'px-10' : 'px-5'
              }`}
            >
              <span>{t('Patients.button_text')}</span>
              <span className='self-center scale-75 2xl:scale-90'>
                <img src={btnIcons.addPatient} alt={t('add-patient-btn')} />
              </span>
            </button>

            <PatientsListNavigation
              patientsList={
                Array.isArray(unsortedPatientList) ? unsortedPatientList : []
              }
              setCurrentPatientUid={setCurrentPatientUid}
              currentPatientUsername={currentPatientUsername}
              setCurrentPatientUsername={setCurrentPatientUsername}
            />
          </div>
          <div>
            <div className='flex items-center w-full gap-2 mx-auto mb-5 whitespace-pre-wrap pl-7 h-7'>
              <img src={CeMark} className='opacity-50' alt='CE-MARK' />
              <span className='text-xs font-light opacity-30'>
                {t('ce_mark_text')}
              </span>
            </div>
            <div className='flex flex-col bg-blue-dark'>
              <div className='flex items-center justify-between px-6 py-3 pl-7 bg-blue-navy'>
                <p>{truncate(user?.instName || 'siHealth Ltd', 25)}</p>
              </div>
            </div>
          </div>
        </div>

        {/*  Main navigation bar */}
        <div className='flex flex-col w-full h-screen max-h-screen'>
          <div className='flex items-center justify-between px-2 py-2 bg-white border border-l-0 border-r-0 border-gray-light lg:px-5'>
            <div className='flex items-center gap-3'>
              <button
                className='menuToggle lg:hidden'
                onClick={() => setToggle(!menuToggle)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <Breadcrumbs />
            </div>
            <div className='xl:gap-[1.1rem] flex gap-2 2xl:gap-8 items-center text-xs font-light lg:text-sm'>
              {!isAdmin && !!instData?.tokens && (
                <div className='flex items-center gap-2 font-light text-blue'>
                  <TokenIcon />
                  <p className='text-black-light whitespace-nowrap'>
                    {instData?.tokens} {t('tokens.label')}
                  </p>
                </div>
              )}
              {/* {!isAdmin && (
                <button
                  onClick={() => history.push(monitoring)}
                  className='items-center hidden gap-2 cursor-pointer text-blue xl:flex'
                >
                  <MonitoringIcon />
                  <p className='hover:text-black text-black-light'>
                    {t('Dashboard.Monitoring')}
                  </p>
                </button>
              )} */}

              {!isAdmin && (
                <button
                  onClick={() => history.push(staff)}
                  className='py-[0.3rem] rounded-[0.25rem] flex flex-shrink-0 items-center hover:text-black text-black-light font-light bg-white hover:cursor-pointer space-x-1 xl:space-x-1.5'
                >
                  <StaffMembersIcon width='1.6rem' />
                  <p>{t('staff-members')}</p>
                </button>
              )}

              {!isAdmin && (
                <button
                  onClick={() => history.push(protocol)}
                  className='py-[0.3rem] rounded-[0.25rem] flex flex-shrink-0 items-center hover:text-black text-black-light font-light bg-white hover:cursor-pointer space-x-1 xl:space-x-1.5'
                >
                  <ProtocolIcon width='1.5rem' />
                  <p>{t('treatment-protocols')}</p>
                </button>
              )}

              <SelectLang />

              <UserLogout />
            </div>
          </div>
          <div className='w-full h-full overflow-auto'>{children}</div>
        </div>
      </div>
    </div>
  );
}
