import { AppProvider } from 'AppProvider';
import { useForm } from 'react-hook-form';
import ArtificialPDTSessionFields from './ArtificialPDTSessionFields';
import { defaultArtificialDPDTValues } from 'pages/Schedule/api/format';
import DefaultPDTCalendar from '../../Calendar/DefaultCalendar/DefaultPDTCalendar';
import {
  eventDataType,
  BookedArtificialPDTSessionType,
  defaultArtificialDPDTValuesType,
} from 'pages/Schedule/api/types/format';
import { getTimeInterval } from '../utils';
import { useCallback, useState } from 'react';
import { TFunction } from 'react-i18next';

export function useArtificialDPDT({
  patientID,
  isCombinedSelected,
}: {
  patientID: number;
  isCombinedSelected: boolean;
}) {
  const { t } = AppProvider.useContainer();
  const {
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<defaultArtificialDPDTValuesType>({
    mode: 'onChange',
    defaultValues: defaultArtificialDPDTValues,
  });

  const timeSlotInterval = getTimeInterval(
    Number(watch('lampProtocol')),
    Number(watch('timeCalculated'))
  );

  const [bookedSessions, setBookedSessions] = useState<
    BookedArtificialPDTSessionType[]
  >([]);

  const handleSchedule = useCallback(
    ({ start, end, title }: eventDataType) => {
      handleSubmit((data) => {
        setBookedSessions((prev: any) => [
          ...prev,
          { ...data, start, end, title, patientID, sessionType: '2' },
        ]);
      })();
    },
    [setBookedSessions, handleSubmit, patientID]
  );

  return {
    ArtificialSessionFields: (
      <ArtificialPDTSessionFields
        t={t}
        watch={watch}
        errors={errors}
        control={control}
        setValue={setValue}
        getValues={getValues}
        isCombinedSelected={isCombinedSelected}
      />
    ),
    ArtificialProtocolFields: <ArtificialProtocolFields />,
    ArtificialDPDTCalendar: (
      <ArtificialDPDTCalendar
        t={t}
        bookedSessions={bookedSessions}
        handleSchedule={handleSchedule}
        timeSlotInterval={timeSlotInterval}
      />
    ),
  };
}

const ArtificialProtocolFields = () => {
  return <div>ArtificialProtocolFields</div>;
};

const ArtificialDPDTCalendar = ({
  t,
  handleSchedule,
  bookedSessions,
  timeSlotInterval,
}: {
  t: TFunction;
  timeSlotInterval: number | undefined;
  bookedSessions: BookedArtificialPDTSessionType[];
  handleSchedule: (data: eventDataType) => void;
}) => {
  return (
    <DefaultPDTCalendar
      t={t}
      bookedSessions={bookedSessions}
      handleSchedule={handleSchedule}
      timeSlotInterval={timeSlotInterval}
    />
  );
};
