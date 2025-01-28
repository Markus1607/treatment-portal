import { btnIcons } from 'utils/icons';
import { AppProvider } from 'AppProvider';
import { usePostTreatment, usePutTreatment } from '../Modals/api/query';
import { formatStringDate, getDateFromUnix } from 'utils/functions';
import { ScheduleButton } from 'components/Forms/Buttons';
import { formatSessionTimes, getUnixTime } from '../Modals/api/format';
import {
  useMemo,
  Dispatch,
  useState,
  SetStateAction,
  MutableRefObject,
  useCallback,
} from 'react';
import type { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import {
  TreatmentType,
  formatPostTreatment,
} from '../Modals/api/serverFormats';
import { SelectedDayInfoType } from 'pages/Schedule/api/format';
import type { confirmationDetailsType } from '../Modals/api/format.d';
import { ReactComponent as HelpIcon } from 'assets/images/ic_info.svg';
import { BookedEventType } from 'pages/Schedule/api/types/format';

type EventsTimeSlotPickerProps = {
  patientUid: string;
  eventInfo: MutableRefObject<
    | {
        event: BookedEventType;
        eventDayData: SelectedDayInfoType | undefined;
      }
    | undefined
  >;
  timeZone: string;
  bookingData: TreatmentType;
  hideWithoutSunscreen: boolean;
  resetCalendarEvents: () => void;
  bookedEventData: BookedEventType | undefined | null;
  handleEventClick: (event: BookedEventType) => void;
  setBookedConfirmation: Dispatch<SetStateAction<boolean>>;
  setConfirmationDetails: Dispatch<SetStateAction<confirmationDetailsType>>;
};

export default function EventsTimeSlotPicker({
  timeZone,
  eventInfo,
  patientUid,
  bookingData,
  bookedEventData,
  handleEventClick,
  setBookedConfirmation,
  hideWithoutSunscreen,
  resetCalendarEvents,
  setConfirmationDetails,
}: EventsTimeSlotPickerProps) {
  const rescheduleTreatment = usePutTreatment();
  const scheduleTreatment = usePostTreatment(patientUid);
  const [selectedTime, setSelectedTime] = useState<{
    unix: string;
    unixStartTime: number;
    unixEndTime: string;
    suitability: string;
    startTime: string;
    preStartTime: string;
    estEndTime: string;
  }>();

  const {
    t,
    cookies: {
      user: { token },
    },
  } = AppProvider.useContainer();
  const date = eventInfo.current?.eventDayData?.date;
  const isTimeSelected = selectedTime?.unix ? true : false;
  const timeSlots = eventInfo.current?.eventDayData?.timeSlots;
  const bookedEventDate = eventInfo.current?.event?.scheduledStateTime;

  const sessionTimes = useMemo(
    () =>
      timeSlots
        ? formatSessionTimes(timeSlots, timeZone, hideWithoutSunscreen).filter(
            (value) =>
              value.suitability === t('Scheduling.modal.high') &&
              value.unixStartTime !== bookedEventDate
          )
        : [],
    [t, timeSlots, timeZone, hideWithoutSunscreen, bookedEventDate]
  );

  const handleSchedule = () => {
    if (date && selectedTime && bookingData.patientID) {
      scheduleTreatment.mutate(
        {
          token: token,
          data: formatPostTreatment({
            ...bookingData,
            preStartTime: getUnixTime(
              date,
              selectedTime?.preStartTime,
              timeZone
            ),
            startTime: getUnixTime(date, selectedTime?.startTime, timeZone),
            endTime: getUnixTime(date, selectedTime?.estEndTime, timeZone),
          }),
        },
        {
          onSuccess: ({ data }) => {
            resetCalendarEvents();
            setBookedConfirmation(true);
            setConfirmationDetails({
              patientID: bookingData.patientID,
              rescheduled: false,
              unixDateTime: data.session.scheduled_start_time,
              location: bookingData?.expectedLocation.address,
              date: getDateFromUnix(
                data.session.scheduled_start_time,
                'dddd Do MMMM YYYY'
              ),
              preStartTime: selectedTime?.preStartTime,
              startTime: selectedTime?.startTime,
              endTime: selectedTime?.estEndTime,
              sessionType: bookingData?.sessionType || '-',
              beginTreatmentData: {
                lat: data.session.settings.lat,
                lon: data.session.settings.lon,
                sessionId: data.session.uid,
              },
            });
          },

          onError: (err: AxiosError) => {
            if (err?.response?.data) {
              if (err?.response?.data.code === 1301) {
                toast.error(t('Error.patient.has.booked.session'));
              } else {
                console.error(err?.response?.data.error);
                toast.error(t('Error.scheduling_treatment'));
              }
            } else {
              console.error(err.message);
              toast.error(t('Error.server_down_error'));
            }
          },
        }
      );
    }
  };

  const handleReschedule = useCallback(() => {
    if (bookedEventData && selectedTime && date) {
      rescheduleTreatment.mutate(
        {
          token: token,
          sessionId: bookedEventData.sessionId,
          data: {
            scheduled_start_time: getUnixTime(
              date,
              selectedTime?.startTime,
              timeZone
            ),
            expected_end_time: getUnixTime(
              date,
              selectedTime?.estEndTime,
              timeZone
            ),
          },
        },
        {
          onSuccess: ({ data }) => {
            resetCalendarEvents();
            setBookedConfirmation(true);
            setConfirmationDetails({
              rescheduled: true,
              patientID: bookingData.patientID,
              unixDateTime: data.session.scheduled_start_time,
              location: bookingData?.expectedLocation.address,
              date: getDateFromUnix(
                data.session.scheduled_start_time,
                'dddd Do MMMM YYYY'
              ),
              preStartTime: selectedTime?.preStartTime,
              startTime: selectedTime?.startTime,
              endTime: selectedTime?.estEndTime,
              sessionType: bookingData?.sessionType || '-',
              beginTreatmentData: {
                lat: data.session.settings.lat,
                lon: data.session.settings.lon,
                sessionId: data.session.uid,
              },
            });
          },

          onError: (err: AxiosError) => {
            if (err?.response?.data) {
              console.error(err?.response?.data.error);
              toast.error(t('Error.rescheduling_treatment'));
            } else {
              console.error(err.message);
              toast.error(t('Error.server_down_error'));
            }
          },
        }
      );
    }
  }, [
    date,
    token,
    timeZone,
    selectedTime,
    bookedEventData,
    rescheduleTreatment,
    resetCalendarEvents,
    setBookedConfirmation,
    setConfirmationDetails,
    bookingData.patientID,
    bookingData?.sessionType,
    bookingData?.expectedLocation,
  ]);

  return (
    <div className='px-1 py-2 text-sm'>
      <div className='flex flex-col space-y-3 text-black'>
        <h1 className='py-2 font-medium border-t border-b border-blue-100 text-blue'>
          {t('suitable-slots-for')}{' '}
          {date && formatStringDate(date, 'DD/MM/YYYY', 'Do MMMM YYYY')}
        </h1>
        <main
          className={`max-h-[10rem] scrollBar  py-2 bg-white overflow-y-scroll space-y-3 ${
            sessionTimes.length > 0 ? 'pr-8' : 'px-2'
          }`}
        >
          {sessionTimes.length > 0 ? (
            sessionTimes.map((value) => (
              <button
                key={value.unix}
                onClick={() => setSelectedTime(value)}
                className={`flex items-center justify-between px-3 py-2 w-full text-black-light text-sm bg-white border rounded shadow-md ${
                  value.unix === selectedTime?.unix
                    ? 'border-blue-dark'
                    : 'border-blue-200'
                }`}
              >
                <p>
                  {value.startTime} - {value.estEndTime}
                </p>
                {value.unix === selectedTime?.unix && (
                  <img src={btnIcons.tick_blue} alt='tick_blue' />
                )}
              </button>
            ))
          ) : (
            <p className='mx-auto text-center whitespace-pre-wrap text-black-light'>
              {t('no_suitable_slots_available')}
            </p>
          )}
        </main>
        <div className='flex items-center w-full gap-2 p-2 text-xs rounded-md text-blue-dark bg-blue-50'>
          <HelpIcon style={{ width: '1rem', height: '1rem' }} />
          <p>{t('the-end-times-are-only-estimates')}</p>
        </div>
        <div className='flex items-center justify-between gap-5'>
          <div
            onClick={() =>
              eventInfo.current?.event &&
              handleEventClick(eventInfo.current?.event)
            }
            className='text-xs font-normal underline cursor-pointer text-blue-dark'
          >
            {t('expand-view')}
          </div>
          <ScheduleButton
            disabled={!isTimeSelected}
            alt={t('Patient_Scheduling.button_text')}
            text={bookedEventData ? t('Button_Reschedule') : t('schedule')}
            onClick={() =>
              bookedEventData ? handleReschedule() : handleSchedule()
            }
          />
        </div>
      </div>
    </div>
  );
}
