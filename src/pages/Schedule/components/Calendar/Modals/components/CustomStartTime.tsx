import { TFunction } from 'react-i18next';
import TimeField from 'react-simple-timefield';
import SuitabilityTooltip from './SuitabilityTooltip';
import { getTimeSuitabilityBgColor } from 'utils/functions';
import {
  useEffect,
  useState,
  Dispatch,
  ChangeEvent,
  SetStateAction,
} from 'react';
import type { customSessionTimeDataType } from '../api/format.d';
import type { BookedEventType } from 'pages/Schedule/api/types/format';

type CustomStartTimePropTypes = {
  bookedCustomTime: string;
  disableHourlyTimes: boolean;
  hideWithoutSunscreen: boolean;
  t: TFunction<'translation', undefined>;
  sessionTimeData: customSessionTimeDataType;
  handleCustomStartTime: (
    time: string,
    isBookedEvent?: BookedEventType
  ) => void;
  setDisableHourlyTimes: Dispatch<SetStateAction<boolean>>;
};

export default function CustomStartTime({
  t,
  sessionTimeData,
  bookedCustomTime,
  disableHourlyTimes,
  hideWithoutSunscreen,
  handleCustomStartTime,
  setDisableHourlyTimes,
}: CustomStartTimePropTypes) {
  const [customTime, setCustomTime] = useState('00:00');

  useEffect(() => {
    setCustomTime(bookedCustomTime);
  }, [bookedCustomTime]);

  const onFocusHandler = () => {
    setDisableHourlyTimes(true);
  };

  const onBlurHandler = () => {
    handleCustomStartTime(customTime);
  };

  const onTimeChangeHandler = (
    _e: ChangeEvent<HTMLInputElement>,
    time: string
  ) => {
    setCustomTime(time);
  };

  const handleKeyDown = (e: any) => e.key === 'Enter' && e.target.blur();

  return (
    <div
      className={`containerShadow cursor-pointer p-4 pb-10 text-left text-xs xl:text-sm bg-white text-black
      ${disableHourlyTimes ? 'border-2 border-blue' : ''}
     `}
    >
      <h3 className='mb-6 text-sm font-semibold xl:text-base'>
        {t('Scheduled_custom_start_time_title')}
      </h3>
      <div className='gap-[4rem] flex'>
        <div>
          <p className='mb-1 font-medium whitespace-pre-wrap'>
            {t('Scheduled_session_modal.table_heading1')}
          </p>
          <TimeField
            value={customTime}
            onChange={onTimeChangeHandler}
            input={
              <input
                type='text'
                onBlur={onBlurHandler}
                onFocus={onFocusHandler}
                onKeyDown={handleKeyDown}
                className='max-w-[5rem] p-2 text-center border border-dashboard rounded focus:outline-blue'
              />
            }
          />
        </div>
        <table className='w-full xl:mr-14'>
          <thead>
            <tr className='whitespace-pre-wrap'>
              <th className='font-medium'>
                {t('Scheduled_session_modal.table_heading2')}
              </th>
              <th className='inline-block pt-5 font-medium whitespace-nowrap'>
                <span>{t('Scheduled_suitability')}</span>{' '}
                <SuitabilityTooltip
                  t={t}
                  left='left-9'
                  zIndex='z-[105]'
                  top='top-[-15rem]'
                  arrowTop='top-[15rem]'
                  arrowLeft='left-[-0.55rem]'
                  arrowRotate='rotate-[315deg]'
                />
              </th>
            </tr>
          </thead>
          <tbody className='font-light text-black-light'>
            <tr className='border-t-2 cursor-not-allowed border-dashboard'>
              <td className='py-2'>
                {hideWithoutSunscreen
                  ? sessionTimeData?.[0]?.estEndTime
                  : sessionTimeData?.[0]?.estEndTimeWithoutSunscreen}
              </td>
              <td>
                <span
                  className={`${
                    sessionTimeData?.[0]?.suitability
                      ? `py-1 px-2 text-white rounded text-xxs ${getTimeSuitabilityBgColor(
                          sessionTimeData?.[0]?.suitability
                        )}`
                      : ''
                  }`}
                >
                  {sessionTimeData?.[0]?.suitability || '-'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
