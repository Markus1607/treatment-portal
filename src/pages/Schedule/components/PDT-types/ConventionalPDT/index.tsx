import { AppProvider } from 'AppProvider';
import { useForm } from 'react-hook-form';
import { defaultConventionalPDTValues } from 'pages/Schedule/api/format';
import DefaultPDTCalendar from '../../Calendar/DefaultCalendar/DefaultPDTCalendar';
import {
  BookedConventionalPDTSessionType,
  defaultConventionalPDTValueType,
  eventDataType,
} from 'pages/Schedule/api/types/format';
import ConventionalSessionFields from './ConventionalPDTSessionFields';
import { useCallback, useState } from 'react';
import { TFunction } from 'react-i18next';

// eslint-disable-next-line react-refresh/only-export-components
export function useConventionalPDT({ patientID }: { patientID: number }) {
  const { t } = AppProvider.useContainer();
  const {
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<defaultConventionalPDTValueType>({
    mode: 'onChange',
    defaultValues: defaultConventionalPDTValues,
  });

  const timeSlotInterval = Number(watch('timeCalculated'));

  const [bookedSessions, setBookedSessions] = useState<
    BookedConventionalPDTSessionType[]
  >([]);

  const handleSchedule = useCallback(
    ({ start, end, title }: eventDataType) => {
      handleSubmit((data) => {
        setBookedSessions((prev: any) => [
          ...prev,
          { ...data, start, end, title, patientID, sessionType: '3' },
        ]);
      })();
    },
    [setBookedSessions, handleSubmit, patientID]
  );

  return {
    ConventionalSessionFields: (
      <ConventionalSessionFields
        t={t}
        watch={watch}
        errors={errors}
        control={control}
        setValue={setValue}
      />
    ),
    ConventionalProtocolFields: <ConventionalProtocolFields />,
    ConventionalDPDTCalendar: (
      <ConventionalDPDTCalendar
        t={t}
        bookedSessions={bookedSessions}
        handleSchedule={handleSchedule}
        timeSlotInterval={timeSlotInterval}
      />
    ),
  };
}

export const ConventionalProtocolFields = () => {
  return <div>ConventionalProtocolFields</div>;
};

export const ConventionalDPDTCalendar = ({
  t,
  bookedSessions,
  handleSchedule,
  timeSlotInterval,
}: {
  t: TFunction;
  timeSlotInterval: number | undefined;
  handleSchedule: (data: eventDataType) => void;
  bookedSessions: BookedConventionalPDTSessionType[];
}) => {
  return (
    <DefaultPDTCalendar
      t={t}
      bookedSessions={bookedSessions}
      timeSlotInterval={timeSlotInterval}
      handleSchedule={handleSchedule}
    />
  );
};
