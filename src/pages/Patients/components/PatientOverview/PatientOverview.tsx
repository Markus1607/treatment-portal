import { AppProvider } from 'AppProvider';
import { useLocation } from 'react-router-dom';
import { PatientDataPerID, usePatientDataPerID } from './api/query';
import { useEffect, useState, useMemo } from 'react';
import PatientProfile from './components/PatientProfile';
import TreatmentHistory from './components/TreatmentHistory';

type PatientOverviewProps = {
  patientUid: string;
  setSubTitle: (value: string) => void;
};

export default function PatientOverview({
  patientUid,
  setSubTitle,
}: PatientOverviewProps) {
  const { state } = useLocation<{ patientData: PatientDataPerID }>();
  const [patientData, setPatientData] = useState<PatientDataPerID>();
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();

  const { isLoading, data } = usePatientDataPerID(
    user.token,
    user.id,
    patientUid
  );

  useEffect(() => {
    setSubTitle(t('Patient_details.Overview'));
  }, [setSubTitle, t]);

  useMemo(() => {
    const fetchedData =
      !isLoading && data && 'id' in data ? data : state?.patientData;
    const patientDetails = state?.patientData ? state.patientData : fetchedData;
    setPatientData(patientDetails);
  }, [data, state, isLoading]);

  return (
    <div className='childrenContainer'>
      <div className='grid gap-4 m-4 text-sm font-medium text-center text-black xl:gap-5 xl:grid-cols-forms'>
        <div className='container space-y-4'>
          <PatientProfile data={patientData} />
          <TreatmentHistory t={t} data={patientData} />
        </div>
      </div>
    </div>
  );
}
