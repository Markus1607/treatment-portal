import moment from 'moment-timezone';
import { TFunction } from 'react-i18next';
import AvgIcon from 'assets/images/ic_small_info.svg';
import type { BookedEventType } from 'pages/Schedule/api/types/format';
import { SessionStateEnums } from '~/pages/Patients/components/PatientSchedule/api/query.d';

type CalendarEventPropTypes = {
  timezone: string;
  event: BookedEventType;
  isLoadingCalendarResponse: boolean;
  t: TFunction<'translation', undefined>;
};

function CalendarEvent({
  t,
  event,
  timezone,
  isLoadingCalendarResponse,
}: CalendarEventPropTypes) {
  const day1 = event?.firstEventStartDate;
  const nextMonthFromNow = moment().add(1, 'month');
  //* Falls back to next month if the last event is undefined
  const day13 = event?.LastEventStartDate || nextMonthFromNow;

  //* Background weather events
  if (moment(event.start).isSameOrAfter(day1, 'day')) {
    if (event.isBackgroundEvent) {
      if (moment(event.start).isBetween(day1, day13, 'day', '[]')) {
        return event?.forecastIcon ? (
          <div
            className={`flex flex-col items-center w-full text-center text-xxs bg-gray-lightest border-none overflow-visible space-y-2 ${
              isLoadingCalendarResponse ? 'cursor-wait' : 'cursor-pointer'
            }`}
          >
            <img
              src={event.forecastIcon}
              alt='weather-forecast-icon'
              className='scale-[3.5] !m-2 3xl:!w-2.5 3xl:!h-2.5 w-2 h-2'
            />
            <span className='text-black-light'>{t('Forecast')}</span>
            <span
              className={`${event.color} rounded-lg px-0.5 w-[80%] text-[.5rem] 2xl:text-xxs text-white`}
            >
              {`${event.suitability}% ${t('Suitable')}`}
            </span>
          </div>
        ) : (
          <span />
        );
      }

      return event ? (
        moment(event.start).isAfter(moment(day13, 'YYYY-MM-DD')) ? (
          <div
            className={`3xl:mt-[15%] mt-[15%] flex flex-col items-center w-full text-center text-xxs bg-white border-none space-y-1 ${
              isLoadingCalendarResponse ? 'cursor-wait' : 'cursor-pointer'
            }`}
          >
            <div className='flex gap-1 text-center'>
              <span className='text-black-light'>{t('Average')}</span>
              <img
                src={AvgIcon}
                alt='avg-icon'
                className='scale-90 2xl:scale-100'
              />
            </div>
            <div className={`${event.color} py-[0.02rem] w-[70%] rounded-md`}>
              {t(`${event.text}`)}
            </div>
          </div>
        ) : null
      ) : (
        <span />
      );
    } else {
      //* Scheduled events
      const startTime = moment(event.start).tz(timezone).format('HH:mm');
      const endTime = moment(event.end).tz(timezone).format('HH:mm');

      return (
        <div
          key={event.id}
          className={`flex mb-auto flex-col items-center w-full text-center whitespace-pre-wrap border-none space-y-3
          ${isLoadingCalendarResponse ? 'cursor-wait' : 'cursor-pointer'}
          ${!event.forecastIcon ? 'mt-1 bg-white space-y-2.5' : 'mt-1'}
        `}
        >
          {event.forecastIcon && (
            <img
              src={event.forecastIcon}
              alt={`weather-icon-${event.id}`}
              className='scale-[3.8] 3xl:!w-2.5 3xl:!h-2.5 m-2 w-2 h-2'
            />
          )}
          {!event.forecastIcon && (
            <div className='flex gap-1 text-center'>
              <span className='text-black-light text-xxs'>{t('Average')}</span>
              <img
                src={AvgIcon}
                alt='avg-icon'
                className='scale-90 2xl:scale-100'
              />
            </div>
          )}
          {event.sessionState === SessionStateEnums.SCHEDULED &&
            !event.rescheduleRequired &&
            !event.isTreatmentDeclined && (
              <div className='py-[0.03rem] 3xl:py-[0.01rem] text-[.65rem] w-full text-center text-white 2xl:text-xxs bg-blue rounded'>
                {`${t('Session_start')}: ${startTime} \n${t(
                  'Session_end'
                )}: ${endTime}`}
              </div>
            )}
          {event.sessionState === SessionStateEnums.SCHEDULED &&
            (event.isTreatmentDeclined || event.rescheduleRequired) && (
              <div className='py-[0.02rem] 3xl:py-[0.01rem] text-[.65rem] w-full text-white 2xl:text-xxs bg-warning rounded'>
                {event.isTreatmentDeclined
                  ? t('reschedule_requested')
                  : t('Reschedule_session')}
              </div>
            )}
          {event.sessionState === SessionStateEnums.RUNNING && (
            <div className='py-[0.02rem] 3xl:py-[0.01rem] text-[.65rem] w-full text-white 2xl:text-xxs bg-SmartPDTorange rounded'>
              {t('Session_in_progress')}
            </div>
          )}
          {event.sessionState === SessionStateEnums.PAUSED && (
            <div className='py-[0.2rem] 3xl:py-[0.01rem] text-[.65rem] w-full text-white 2xl:text-xxs bg-SmartPDTorange rounded'>
              {t('Session_paused')}
            </div>
          )}
        </div>
      );
    }
  } else {
    return (
      <div
        className={`mt-[20%] mb-4 py-[0.03rem] 3xl:py-[0.01rem] w-full text-center whitespace-pre-wrap rounded 
        ${isLoadingCalendarResponse ? 'cursor-wait' : 'cursor-pointer'}
        ${
          event.isTreatmentDeclined || event.rescheduleRequired
            ? 'bg-warning'
            : 'bg-SmartPDTorange'
        }`}
      >
        <div className='text-white text-xxs'>
          {event.isTreatmentDeclined || event.rescheduleRequired
            ? t('Reschedule_session')
            : t('Session_in_progress')}
        </div>
      </div>
    );
  }
}

export default CalendarEvent;
