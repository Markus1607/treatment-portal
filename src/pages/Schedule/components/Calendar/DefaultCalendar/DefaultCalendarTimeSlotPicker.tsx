import { useState } from 'react';
import { btnIcons } from 'utils/icons';
import { AppProvider } from 'AppProvider';
import { formatStringDate } from 'utils/functions';
import { formatSessionDate, generateTimeSlots } from '../../PDT-types/utils';
import { ScheduleButton } from 'components/Forms/Buttons';
import { ReactComponent as HelpIcon } from 'assets/images/ic_info.svg';
import { toast } from 'react-hot-toast';
import { eventDataType } from 'pages/Schedule/api/types/format';

type DefaultCalendarTimeSlotPickerProps = {
  dateString: string;
  timeSlotInterval: number | undefined;
  handleSchedule: (data: eventDataType) => void;
};

export default function DefaultCalendarTimeSlotPicker({
  dateString,
  handleSchedule,
  timeSlotInterval,
}: DefaultCalendarTimeSlotPickerProps) {
  const { t } = AppProvider.useContainer();
  const [selectedTime, setSelectedTime] = useState<{
    start: string;
    end: string;
  }>();

  const sessionTimes = generateTimeSlots({
    date: dateString,
    interval: timeSlotInterval,
  });

  const isTimeSelected = selectedTime?.start ? true : false;

  const bookedEventData = false;

  const handleBooking = () => {
    const startTime =
      selectedTime?.start && formatSessionDate(dateString, selectedTime?.start);
    const endTime =
      selectedTime?.end && formatSessionDate(dateString, selectedTime?.end);
    if (startTime && endTime) {
      handleSchedule({
        start: startTime,
        end: endTime,
        title: `${selectedTime?.start} - ${selectedTime?.end}`,
      });
      toast.success('Session booked successfully');
    }
  };

  return (
    <div className='px-1 py-2 text-sm'>
      <div className='flex flex-col text-black space-y-3'>
        <h1 className='py-2 font-medium border-t border-b border-blue-100 text-blue'>
          {t('suitable-slots-for')}{' '}
          {formatStringDate(dateString, 'DD/MM/YYYY', 'Do MMMM YYYY')}
        </h1>
        <main
          className={`max-h-[10rem] scrollBar  py-2 bg-white overflow-y-scroll space-y-3 ${
            sessionTimes.length > 0 ? 'pr-8' : 'px-2'
          }`}
        >
          {sessionTimes.length > 0 ? (
            sessionTimes.map((value) => (
              <button
                key={value.start}
                onClick={() => setSelectedTime(value)}
                className={`flex items-center justify-between px-3 py-2 w-full text-black-light text-sm bg-white border rounded shadow-md ${
                  value.start === selectedTime?.start
                    ? 'border-blue-dark'
                    : 'border-blue-200'
                }`}
              >
                <p>
                  {value.start} - {value.end}
                </p>
                {value.start === selectedTime?.start && (
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
        <div className='flex items-center w-full p-2 text-xs gap-2 text-blue-dark bg-blue-50 rounded-md'>
          <HelpIcon style={{ width: '1rem', height: '1rem' }} />
          <p>{t('the-end-times-are-only-estimates')}</p>
        </div>
        <div className='flex items-center justify-between gap-5'>
          <div />
          <ScheduleButton
            disabled={!isTimeSelected}
            alt={t('Patient_Scheduling.button_text')}
            text={bookedEventData ? t('Button_Reschedule') : t('schedule')}
            onClick={() => (bookedEventData ? null : handleBooking())}
          />
        </div>
      </div>
    </div>
  );
}
