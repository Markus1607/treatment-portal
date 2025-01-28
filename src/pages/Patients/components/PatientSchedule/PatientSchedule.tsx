import Scheduling from 'pages/Schedule';
import { AppProvider } from 'AppProvider';
import { useEffect, useState } from 'react';
import {
  useGetTreatment,
  FormatGetTreatmentType,
  FormattedNatPDTSessionsType,
} from './api/query';

type PatientScheduleProps = {
  patientUid: string;
  setSubTitle: (value: string) => void;
};

export default function PatientSchedule({
  patientUid,
  setSubTitle,
}: PatientScheduleProps) {
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();

  const { isLoading, data: bookedTreatment } = useGetTreatment(
    user.token,
    patientUid
  );
  const [bookedEvent, setBookedEvent] = useState<
    FormatGetTreatmentType['eventData'] | null | undefined
  >(null);
  const [savedData, setSavedData] = useState<FormattedNatPDTSessionsType>();

  useEffect(() => {
    setSubTitle(t('Patient_details.scheduling'));
  }, [setSubTitle, t]);

  useEffect(() => {
    //* set booked event
    if (
      !isLoading &&
      bookedTreatment &&
      'lastSession' in bookedTreatment &&
      !('error' in bookedTreatment.lastSession)
    ) {
      const { lastSession } = bookedTreatment;
      setBookedEvent(lastSession.eventData);
    } else {
      setBookedEvent(null);
    }

    //* set saved data
    if (
      !isLoading &&
      bookedTreatment &&
      'sessionDetails' in bookedTreatment &&
      bookedTreatment.sessionDetails &&
      !('error' in bookedTreatment.sessionDetails)
    ) {
      const { sessionDetails } = bookedTreatment;
      sessionDetails && setSavedData(sessionDetails);
    } else {
      setSavedData(undefined);
    }
  }, [
    isLoading,
    bookedTreatment?.lastSession,
    bookedTreatment?.sessionDetails,
  ]);

  return (
    <Scheduling
      key={patientUid}
      savedData={savedData}
      patientUid={patientUid}
      bookedEvent={bookedEvent}
      savedDataLoading={isLoading}
      setBookedEvent={setBookedEvent}
    />
  );
}
