import { uniqueId } from 'lodash';
import { navIcons } from 'utils/icons';
import { overview, patients } from 'routes';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Patient } from 'pages/Patients/types';
import { Link, useLocation } from 'react-router-dom';
import { useScrollIntoViewOnSelect } from 'utils/hooks';
import { formatPatientData } from 'pages/Patients/components/PatientList/api/format';
import { AppProvider } from '~/AppProvider';
import { TFunction } from 'react-i18next';

type PatientsListNavigationType = {
  patientsList: Patient[];
  currentPatientUsername: string;
  setCurrentPatientUid: Dispatch<SetStateAction<string>>;
  setCurrentPatientUsername: Dispatch<SetStateAction<string>>;
};

export default function PatientsListNavigation({
  patientsList,
  setCurrentPatientUid,
  currentPatientUsername,
  setCurrentPatientUsername,
}: PatientsListNavigationType) {
  const { pathname } = useLocation();
  const { t } = AppProvider.useContainer();
  const isPatientProfile = pathname.match(/patients\/\w+\/\w+/);
  const subPath = isPatientProfile ? pathname.split('/')[3] : overview;
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const patientUsernameFromUrl = isPatientProfile
    ? pathname.split('/')[2]
    : null;

  useEffect(() => {
    if (!patientsList.length) return;
    if (patientUsernameFromUrl) {
      setSelectedPatient(patientUsernameFromUrl);
      setCurrentPatientUsername(patientUsernameFromUrl);
    }

    //* find patient data from patient list with patient username from url
    const patientData = patientsList.find(
      (patient) => patient.username === currentPatientUsername
    );
    patientData && setCurrentPatientUid(patientData.uid);
  }, [
    patientsList,
    isPatientProfile,
    currentPatientUsername,
    patientUsernameFromUrl,
  ]);

  return (
    <div className='max-h-[35rem] flex flex-col mt-4 overflow-auto'>
      {patientsList.map((patient) => (
        <NavButton
          t={t}
          patientData={patient}
          username={patient.username}
          key={uniqueId('patient-page-')}
          isSelected={
            patient.username === selectedPatient && !!isPatientProfile
          }
          to={`${patients}/${patient.username}/${subPath}`}
          onClick={() => {
            setCurrentPatientUid(patient.uid);
            setSelectedPatient(patient.username);
            setCurrentPatientUsername(patient.username);
          }}
        />
      ))}
    </div>
  );
}

type NavButtonPropType = {
  to: string;
  username: string;
  isSelected: boolean;
  onClick: () => void;
  patientData?: Patient;
  t: TFunction<'translation', undefined>;
};

const NavButton = ({
  t,
  to,
  onClick,
  username,
  isSelected,
  patientData,
}: NavButtonPropType) => {
  const linkRef = useScrollIntoViewOnSelect(isSelected);

  return (
    <Link
      to={{
        pathname: to,
        state: { patientData: patientData && formatPatientData(patientData) },
      }}
      ref={linkRef}
      onClick={onClick}
      className={
        isSelected
          ? 'border-l-4 border-orange bg-blue-dark font-normal'
          : 'border-none hover:bg-blue-dark font-light opacity-[0.85]'
      }
    >
      <div
        className={`text-left flex py-4 items-center gap-5 min-w-min ${
          isSelected ? 'ml-5 2xl:ml-6' : 'ml-6 2xl:ml-7'
        }`}
      >
        <img src={navIcons.ic_patient} alt='Patient Icon' />
        <div className='max-w-[10rem] flex'>
          <span className='text-sm 4xl:text-[0.91rem]'>
            {t('Dashboard.Patients')}: {username}
          </span>
        </div>
      </div>
    </Link>
  );
};
