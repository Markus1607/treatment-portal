import { AppProvider } from 'AppProvider';
import { navigationIcons } from 'utils/icons';
import { ClipLoader } from 'components/Loader';
import type { ToolbarProps } from 'react-big-calendar';
import { Dispatch, SetStateAction } from 'react';
import CalendarMonthPicker from '../partials/CalendarMonthPicker';

type DefaultCalendarToolbarProps = {
  date: Date;
  isLoadingCalendarResponse: boolean;
  onNavigate: ToolbarProps['onNavigate'];
  setDefaultDate: Dispatch<SetStateAction<Date>>;
};

const DefaultCalendarToolbar = ({
  date,
  onNavigate,
  setDefaultDate,
  isLoadingCalendarResponse,
}: DefaultCalendarToolbarProps) => {
  const { t } = AppProvider.useContainer();

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
          onClick={() => onNavigate('TODAY')}
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
    </div>
  );
};

export default DefaultCalendarToolbar;
