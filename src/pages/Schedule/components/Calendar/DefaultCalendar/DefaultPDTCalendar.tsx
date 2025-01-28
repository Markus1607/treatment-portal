import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'assets/styles/calendar.css';
import DefaultCalendarToolbar from './DefaultToolbar';
import { useCallback, useState } from 'react';
import { getInitialCalendarDate } from '../../../api/format';
import { getUserLanguage, getWidth } from 'utils/functions';
import { Tooltip } from 'react-tooltip';
import DefaultCalendarTimeSlotPicker from './DefaultCalendarTimeSlotPicker';
import {
  eventDataType,
  BookedArtificialPDTSessionType,
  BookedConventionalPDTSessionType,
} from 'pages/Schedule/api/types/format';
import { TFunction } from 'react-i18next';

type DefaultPDTCalendarProps = {
  t: TFunction;
  timeSlotInterval: number | undefined;
  bookedSessions: (
    | BookedArtificialPDTSessionType
    | BookedConventionalPDTSessionType
  )[];
  handleSchedule: (data: eventDataType) => void;
};

export default function DefaultPDTCalendar({
  t,
  bookedSessions,
  handleSchedule,
  timeSlotInterval,
}: DefaultPDTCalendarProps) {
  const lang = getUserLanguage();
  const localizer = momentLocalizer(moment);
  const [defaultDate, setDefaultDate] = useState(() =>
    getInitialCalendarDate(false)
  );

  moment.updateLocale(lang, {
    week: {
      dow: 1, //* Makes Monday the start of the week.
    },
  });

  const onNavigate = useCallback(
    (newDate: Date) => setDefaultDate(newDate),
    [setDefaultDate]
  );

  const isTodaysDateOrFuture = useCallback(
    (date: Date) => moment(date).isSameOrAfter(new Date(), 'day'),
    []
  );

  const getTimeFromDate = useCallback(
    (date: Date | undefined) => moment(date).format('HH:mm'),
    []
  );

  return (
    <>
      <div className='items-center h-full px-8 pt-8 text-2xl text-black'>
        <div className='mx-auto text-center schedule rounded-md'>
          <Calendar
            culture={lang}
            date={defaultDate}
            localizer={localizer}
            events={bookedSessions}
            views={{ month: true }}
            onNavigate={onNavigate}
            eventPropGetter={() => ({ className: 'calendar-events' })}
            components={{
              event: ({ event }) => (
                <div className='py-[0.03rem] 3xl:py-[0.01rem] text-[.65rem] my-auto w-full text-center text-white whitespace-pre-wrap 2xl:text-xxs bg-blue rounded'>
                  {`${t('Session_start')}: ${getTimeFromDate(
                    event?.start
                  )} \n${t('Session_end')}: ${getTimeFromDate(event?.end)}`}
                </div>
              ),
              dateCellWrapper: (props) =>
                isTodaysDateOrFuture(props.value) ? (
                  <div
                    {...props}
                    data-tooltip-place='top'
                    data-tooltip-id='day-tooltip'
                    data-tooltip-content={moment(props.value).format(
                      'DD/MM/YYYY'
                    )}
                    data-tooltip-offset={-40}
                    className='w-full h-full bg-white border-r border-gray-200 hover:bg-dashboard last:border-r-0 hover:cursor-pointer'
                  />
                ) : (
                  <div
                    {...props}
                    className='w-full h-full bg-gray-100 border-r border-gray-200 last:border-r-0'
                  />
                ),
              toolbar: (props) => (
                <DefaultCalendarToolbar
                  {...props}
                  setDefaultDate={setDefaultDate}
                  isLoadingCalendarResponse={false}
                />
              ),
            }}
            style={{
              height: '85vh',
              maxHeight: '54rem',
              minHeight: getWidth() <= 1440 ? '40rem' : '42rem',
            }}
          />
        </div>
      </div>
      <Tooltip
        id='day-tooltip'
        clickable
        className='default-pdt-container-tooltip'
        render={({ content }) => (
          <DefaultCalendarTimeSlotPicker
            dateString={content || ''}
            handleSchedule={handleSchedule}
            timeSlotInterval={timeSlotInterval}
          />
        )}
      />
    </>
  );
}
