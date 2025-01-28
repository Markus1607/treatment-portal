import moment from 'moment';
import { AppProvider } from 'AppProvider';
import { navigationIcons } from 'utils/icons';
import { ClipLoader } from 'components/Loader';
import type { ToolbarProps } from 'react-big-calendar';
import CalendarMonthPicker from './CalendarMonthPicker';
import { Dispatch, useEffect, SetStateAction } from 'react';
// import { ReactComponent as BeginBtnIcon } from 'assets/images/ic_begin_btn.svg';

type CalendarToolbarProps = {
  date: Date;
  timeZoneLabel: string;
  hasBookedEvent: boolean;
  showHasTreatmentBanner?: boolean;
  isLoadingCalendarResponse: boolean;
  sessionType: string | null;
  handleGetSessionDetails: () => void;
  onNavigate: ToolbarProps['onNavigate'];
  setDefaultDate: Dispatch<SetStateAction<Date>>;
  setCalendarMonth: Dispatch<SetStateAction<number>>;
};

const CalendarToolbar = ({
  date,
  onNavigate,
  // sessionType,
  timeZoneLabel,
  setDefaultDate,
  // hasBookedEvent,
  setCalendarMonth,
  // showHasTreatmentBanner,
  // handleGetSessionDetails,
  isLoadingCalendarResponse,
}: CalendarToolbarProps) => {
  const { t } = AppProvider.useContainer();

  useEffect(() => {
    /**
     * * This useEffect calculates the right calendar month number from the date picker tool or whatever value is given to the date prop.
     * * This is needed to fetch the right amount of calendar data to fill the calendar month view.
     */
    const dateWithTodaysDay = moment(date).date(moment().date());
    const selectedMonth = moment(dateWithTodaysDay).diff(
      moment(),
      'months',
      true
    );
    if (selectedMonth < 0) return;
    setCalendarMonth(Math.round(selectedMonth));
  }, [date, setCalendarMonth]);

  // const showBeginBtn =
  //   !showHasTreatmentBanner && !hasBookedEvent && sessionType !== 'self_applied'
  //     ? true
  //     : false;

  return (
    <div className='flex items-center justify-between mb-6 text-base 2xl:text-lg'>
      <div className='flex items-center text-left text-black-light'>
        <button
          className='py-2 mx-2 2xl:mx-4'
          onClick={() => onNavigate('PREV')}
        >
          <img className='scale-[2]' src={navigationIcons.prev} alt='prev' />
        </button>
        <button
          onClick={() => {
            onNavigate('TODAY');
            setCalendarMonth(0);
          }}
          className='px-2 py-1 mx-2 text-white rounded 2xl:mr-3 bg-blue'
        >
          {t('Diary_-_day_-_all_slots.day_label')}
        </button>
        <CalendarMonthPicker date={date} setDefaultDate={setDefaultDate} />
        <button className='mx-2 my-2' onClick={() => onNavigate('NEXT')}>
          <img className='scale-[2]' src={navigationIcons.next} alt='next' />
        </button>
      </div>

      {isLoadingCalendarResponse && <ClipLoader color='#1e477f' size={0.65} />}

      {timeZoneLabel && (
        <div className='text-sm text-black-light 2xl:text-base'>
          {timeZoneLabel}
        </div>
      )}

      {/* {showBeginBtn ? (
        <button
          onClick={() => handleGetSessionDetails()}
          className='flex gap-2 items-center justify-center px-3 py-1.5 text-white text-sm bg-SmartPDTorange rounded hover:scale-y-105'
        >
          <BeginBtnIcon className='self-center scale-75' />
          <span>{t('button.begin_treatment_now')}</span>
        </button>
      ) : (
        <div className='text-sm text-black-light 2xl:text-base'>
          {timeZoneLabel}
        </div>
      )} */}
    </div>
  );
};

export default CalendarToolbar;
