import { isNumber } from 'lodash';
import { AppProvider } from 'AppProvider';
import { ClipLoader } from 'components/Loader';
import warningIcon from 'assets/images/ic_warning.svg';
import { getLabelFromID, getTimeSuitabilityBgColor } from 'utils/functions';
import { SessionDetailsDataType } from '../api/format';

type SessionDetailsProps = {
  isLoadingData: boolean;
  data: SessionDetailsDataType;
};

export default function SessionDetails({
  data,
  isLoadingData,
}: SessionDetailsProps) {
  const { t, sunscreenList } = AppProvider.useContainer();

  /**
   * * Unsuitable reasons for low suitability time slot
   */
  const isForecastDurationUnsuitable =
    data?.unsuitableReasons?.some(
      (el) => el === 'min_time' || el === 'max_time'
    ) ||
    data?.forecastDuration === '' ||
    data?.forecastDurationNoSunscreen === '';

  const isPpiXDoseUnsuitable =
    data?.unsuitableReasons?.some(
      (el) => el === 'min_ppix_dose' || el === 'max_ppix_dose'
    ) ||
    data?.ppixDose === null ||
    data?.ppixDoseNoSunscreen === null;

  const isErythemaDoseUnsuitable =
    data?.unsuitableReasons?.includes('max_ery_dose');

  const isTemperatureUnsuitable = data?.unsuitableReasons?.some(
    (el) => el === 'min_temp' || el === 'max_temp'
  );

  const isPrecipitationUnsuitable = data?.unsuitableReasons?.some(
    (el) => el === 'max_precip' || el === 'amber_precip'
  );

  const isWeatherUnsuitable = data?.unsuitableReasons?.some(
    (el) => el === 'max_precip' || el === 'amber_precip'
  );

  return (
    <>
      <section className='p-4 pb-0 m-4 mb-5 font-medium bg-white border shadow-sm containerShadow'>
        <div className='relative flex justify-between mb-1'>
          <h1 className='text-base font-bold text-left 2xl:text-lg'>
            {t('Scheduled_session_modal.session_title')}
          </h1>

          {isLoadingData && (
            <div className='absolute right-0 -top-2'>
              <ClipLoader color='#1e477f' size={0.6} />
            </div>
          )}
        </div>

        <div className='w-full text-sm divide-y border-gray-light'>
          <div className='flex gap-10 items-center justify-between m-0 py-2.5 2xl:py-3.5 w-full'>
            <span>{t('Scheduled_suitability')}</span>
            <span
              className={`text-white text-xs py-0.5 xl:py-1 px-2 rounded-md ${getTimeSuitabilityBgColor(
                data?.suitability
              )}`}
            >
              {data?.suitability}
            </span>
          </div>
          <div className='flex gap-10 items-center justify-between m-0 py-2.5 2xl:py-3.5 w-full'>
            <span>{t('Dairy_list_start_time')}</span>
            <span className='font-light text-black-light'>
              {data?.startTime || '-'}
            </span>
          </div>
          <div className='flex gap-10 items-center justify-between m-0 py-2.5 2xl:py-3.5 w-full'>
            <span>{t('Dairy_list_estimated_end_time')}</span>
            <span className='font-light text-black-light'>
              {data?.estimatedEndTimeHour || '-'}
            </span>
          </div>
          <div className='flex gap-10 items-center justify-between m-0 py-2.5 2xl:py-3.5 w-full'>
            <p className='flex items-center gap-2 font-medium text-black'>
              <span>
                {t('Scheduled_session_modal.Forecasted_session_duration')}
              </span>
              {isForecastDurationUnsuitable && (
                <img src={warningIcon} alt='warning-icon' />
              )}
            </p>
            <span
              className={`font-light ${
                isForecastDurationUnsuitable
                  ? 'text-warning'
                  : 'text-black-light'
              }`}
            >
              {data?.forecastDuration || '-'}
            </span>
          </div>
          <p className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
            <span>{t('Scheduled_session_modal.sunscreen_applied')}</span>
            <span className='font-light text-black-light'>
              {getLabelFromID(data.sunscreen, sunscreenList)}
            </span>
          </p>
          <div className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
            <p className='flex items-center gap-2 font-medium text-black'>
              <span> {t('Scheduled_session_modal.PpIX-effective_dose')}</span>
              {isPpiXDoseUnsuitable && (
                <img src={warningIcon} alt='warning-icon' />
              )}
            </p>
            <span
              className={`font-light ${
                isPpiXDoseUnsuitable ? 'text-warning' : 'text-black-light'
              }`}
            >
              {data.ppixDose ? data.ppixDose + ' J/cm²' : '0.0 J/cm²'}
            </span>
          </div>
          <div className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
            <p className='flex items-center gap-2 font-medium text-black'>
              <span> {t('Scheduled_session_modal.Erythemal_dose')}</span>
              {isErythemaDoseUnsuitable && (
                <img src={warningIcon} alt='warning-icon' />
              )}
            </p>
            <span
              className={`font-light ${
                isErythemaDoseUnsuitable ? 'text-warning' : 'text-black-light'
              }`}
            >
              {data.erthemalDose ? data.erthemalDose + ' J/m²' : '0.0 J/m²'}
            </span>
          </div>
          <div className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
            <p className='flex items-center gap-2 font-medium text-black'>
              <span>
                {t('Scheduled_session_modal.Erythemal_dose_percentage')}
              </span>
              {isErythemaDoseUnsuitable && (
                <img src={warningIcon} alt='warning-icon' />
              )}
            </p>
            <span
              className={`font-light ${
                isErythemaDoseUnsuitable ? 'text-warning' : 'text-black-light'
              }`}
            >
              {isNumber(data.erythemalDosePercentage)
                ? data.erythemalDosePercentage + ' %'
                : '-'}
            </span>
          </div>
        </div>
      </section>

      {/**
       *  ================================== WEATHER DETAILS ==============================================
       */}
      <section className='p-4 pb-0 m-4 font-medium bg-white border shadow-sm containerShadow'>
        <header className='flex justify-between gap-10'>
          <h1 className='mb-4 text-base font-bold text-left 2xl:text-lg'>
            {t('Scheduled_session_modal.weather_conditions')}
          </h1>
        </header>
        <div className='w-full text-sm divide-y border-gray-light'>
          <div className='flex gap-10 items-center justify-between m-0 py-2.5 2xl:py-3.5 w-full'>
            <p className='flex items-center gap-2 font-medium text-black'>
              <span>
                {t('Scheduled_session_modal.Average_weather_conditions')}
              </span>
              {isWeatherUnsuitable && (
                <img src={warningIcon} alt='warning-icon' />
              )}
            </p>
            <span
              className={`font-light ${
                isWeatherUnsuitable ? 'text-warning' : 'text-black-light'
              }`}
            >
              {data.weatherCondition}
            </span>
          </div>
          <div className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
            <p className='flex items-center gap-2 font-medium text-black'>
              <span>{t('Scheduled_session_modal.temperature')}</span>
              {isTemperatureUnsuitable && (
                <img src={warningIcon} alt='warning-icon' />
              )}
            </p>
            <span
              className={`font-light ${
                isTemperatureUnsuitable ? 'text-warning' : 'text-black-light'
              }`}
            >
              {isNumber(data.temperature) ? `${data.temperature} °C` : '-'}
            </span>
          </div>
          <div className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
            <p className='flex items-center gap-2 font-medium text-black'>
              <span>{t('Scheduled_session_modal.Chance_of_rain')}</span>
              {isPrecipitationUnsuitable && (
                <img src={warningIcon} alt='warning-icon' />
              )}
            </p>
            <span
              className={`font-light ${
                isPrecipitationUnsuitable ? 'text-warning' : 'text-black-light'
              }`}
            >
              {data.chanceOfRain}
            </span>
          </div>
          <p className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
            <span>{t('Scheduled_session_modal.uv_index')}</span>
            <span className='font-light text-black-light'>
              {isNumber(data.uvIndex) ? data.uvIndex : '-'}
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
