import { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { btnIcons } from 'utils/icons';
import { useTitle } from 'utils/hooks';
import type { AxiosError } from 'axios';
import { isEmpty, isArray } from 'lodash';
import { AppProvider } from 'AppProvider';
import { useHistory } from 'react-router-dom';
import { ClipLoader } from 'components/Loader';
import type { Patient } from 'pages/Patients/types';
import { useAllPatientsDataUnformatted } from './api/query';
import { overview, patientRegister, patients } from 'routes';
import { ReactComponent as ErrorFaceIcon } from 'assets/images/no-data-icon.svg';
import { ReactComponent as AddPatientPlaceholder } from 'assets/images/add_patient_placeholder.svg';

export type PatientListDataType = Patient[] | undefined | { error: AxiosError };

export default function PatientsList() {
  const history = useHistory();
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();

  const { isLoading, data: unsortedPatientList } =
    useAllPatientsDataUnformatted(user?.token, user?.id);

  useTitle(t('Dashboard.Patients'));

  useEffect(() => {
    const firstPatientUsername =
      isArray(unsortedPatientList) && !isEmpty(unsortedPatientList)
        ? unsortedPatientList[0].username
        : null;

    if (firstPatientUsername) {
      history.push(`${patients}/${firstPatientUsername}/${overview}`);
    }
  }, [history, unsortedPatientList]);

  return (
    <div className='flex flex-col w-full h-full max-w-screen bg-dashboard'>
      {isLoading && (
        <div className='mt-[30vh] flex justify-center mx-auto w-full'>
          <ClipLoader color='#1e477f' size={1.5} />
        </div>
      )}

      {!isLoading &&
        isArray(unsortedPatientList) &&
        isEmpty(unsortedPatientList) && (
          <div className='flex flex-col items-center gap-4 my-auto'>
            <AddPatientPlaceholder width='15rem' />

            <p className='font-light text-black-light'>
              <Trans i18nKey='add_first_patient_title' />
            </p>

            <button
              onClick={() => history.push(patientRegister)}
              className='flex gap-2 items-center px-11 2xl:py-3 py-3.5 text-white 2xl:text-base text-sm font-medium bg-blue rounded hover:scale-105 active:scale-95'
            >
              <span className='self-center scale-75 2xl:scale-90'>
                <img src={btnIcons.add} alt={t('add-button')} />
              </span>
              <span>{t('Patients.button_text')}</span>
            </button>
          </div>
        )}

      {!isLoading && unsortedPatientList && 'error' in unsortedPatientList && (
        <div className='mt-[30vh] flex flex-col gap-4 items-center mx-auto w-full h-full text-center'>
          <ErrorFaceIcon width={100} style={{ fill: 'tomato' }} />

          <h3 className='mt-2 text-base text-red-400'>
            {t('Error.fetching.patients.data')}
          </h3>
        </div>
      )}
    </div>
  );
}
