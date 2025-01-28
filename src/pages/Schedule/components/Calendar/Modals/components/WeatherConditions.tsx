import { TFunction } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import warningIcon from 'assets/images/ic_warning.svg';
import type { sessionDetailsDataType } from '../api/format.d';

type WeatherConditionsProps = {
  t: TFunction<'translation', undefined>;
  sessionDetails: sessionDetailsDataType;
  setWeatherDetailsModal: Dispatch<SetStateAction<boolean>>;
};

const WeatherConditions = ({
  t,
  sessionDetails,
  setWeatherDetailsModal,
}: WeatherConditionsProps) => {
  const data = sessionDetails?.[0];

  return (
    <div className='w-full p-4 pb-2 text-xs font-light text-left bg-white containerShadow text-black-light xl:p-5 xl:text-sm'>
      <div className='flex items-center justify-between gap-2 mb-5'>
        <h1 className='text-sm font-bold text-black xl:text-base'>
          {t('Scheduled_session_modal.weather_conditions')}
        </h1>
        <button
          onClick={() => setWeatherDetailsModal(true)}
          className='font-light underline text-blue-lighter text-xxs lg:whitespace-nowrap xl:text-xs'
        >
          {t('Scheduled_session_modal.detail_view')}
        </button>
      </div>

      <div className='flex justify-between gap-2 py-3 border-b border-gray-light lg:gap-5'>
        <p className='flex items-center gap-2 font-medium text-black'>
          <span>{t('Scheduled_session_modal.Average_weather_conditions')}</span>
          {data?.unsuitableReasons?.some(
            (el) => el === 'max_precip' || el === 'amber_precip'
          ) && <img src={warningIcon} alt='warning-icon' />}
        </p>
        <p
          className={`font-light ${
            data?.unsuitableReasons?.some(
              (el) => el === 'max_precip' || el === 'amber_precip'
            )
              ? 'text-warning'
              : 'text-black-light'
          }`}
        >
          {data?.icon}
        </p>
      </div>
      <div className='flex justify-between gap-2 py-3 border-b border-gray-light lg:gap-5'>
        <p className='flex items-center gap-2 font-medium text-black'>
          <span> {t('Scheduled_session_modal.temperature')}</span>
          {data?.unsuitableReasons?.some(
            (el) => el === 'min_temp' || el === 'max_temp'
          ) && <img src={warningIcon} alt='warning-icon' />}
        </p>
        <p
          className={
            'text-right ' +
            (data?.unsuitableReasons?.some(
              (el) => el === 'min_temp' || el === 'max_temp'
            )
              ? 'text-warning'
              : 'text-black-light')
          }
        >{`${
          data?.temperature.min !== data?.temperature.max
            ? `${data?.temperature.min} - ${data?.temperature.max}`
            : `${data?.temperature.min}`
        }`}</p>
      </div>
      <div className='flex justify-between gap-2 py-3 border-b border-gray-light lg:gap-5'>
        <p className='flex items-center gap-2 font-medium text-black'>
          <span> {t('Scheduled_session_modal.Chance_of_rain')}</span>
          {data?.unsuitableReasons?.some(
            (el) => el === 'max_precip' || el === 'amber_precip'
          ) && <img src={warningIcon} alt='warning-icon' />}
        </p>
        <p
          className={
            'text-right ' +
            (data?.unsuitableReasons?.some(
              (el) => el === 'max_precip' || el === 'amber_precip'
            )
              ? 'text-warning'
              : 'text-black-light')
          }
        >
          {data?.precipitation}
        </p>
      </div>
      <div className='flex justify-between gap-2 py-3 lg:gap-5'>
        <p className='font-medium text-black'>
          {t('Scheduled_session_modal.uv_index')}
        </p>
        <p className='text-right text-black-light'>{`${
          data?.uvIndex.min !== data?.uvIndex.max
            ? `${data?.uvIndex.min} - ${data?.uvIndex.max}`
            : `${data?.uvIndex.min}`
        }`}</p>
      </div>
    </div>
  );
};

export default WeatherConditions;
