import { AppProvider } from 'AppProvider';
import { getLabelFromID } from 'utils/functions';
import { Dispatch, SetStateAction } from 'react';
import warningIcon from 'assets/images/ic_warning.svg';
import type { sessionDetailsDataType } from '../api/format.d';
import { ReactComponent as AlertIcon } from 'assets/images/ic_warning_orange.svg';

type SessionInformationProps = {
  detailedView: boolean;
  SPFSelected: string | null;
  sessionDetails: sessionDetailsDataType;
  setWeatherDetailsModal: Dispatch<SetStateAction<boolean>>;
};

const SessionInformation = ({
  SPFSelected,
  detailedView,
  sessionDetails,
  setWeatherDetailsModal,
}: SessionInformationProps) => {
  const data = sessionDetails?.[0];
  const { t, sunscreenList } = AppProvider.useContainer();

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

  return (
    <div className='w-full p-4 pb-2 text-xs font-light text-left bg-white containerShadow text-black-lighter xl:p-5 xl:text-sm'>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-sm font-bold text-black xl:text-base'>
          {t('Scheduled_session_modal.session_title')}
        </h1>
        {detailedView && (
          <button
            onClick={() => setWeatherDetailsModal(true)}
            className='font-light underline text-blue-lighter text-xxs xl:text-xs'
          >
            {t('Scheduled_session_modal.detail_view')}
          </button>
        )}
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light lg:gap-5'>
        <p className='flex items-center gap-2 font-medium text-black'>
          <span>{t('pre-treatment_start_time')}</span>
          {data?.isPretreatmentOverdue && <AlertIcon />}
        </p>
        <p
          className={`text-right text-black-light whitespace-nowrap first-letter
        ${
          data?.isPretreatmentOverdue
            ? 'text-SmartPDTorange'
            : 'text-black-light'
        }`}
        >
          {data?.preStartTime || '-'}
        </p>
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light lg:gap-5'>
        <p className='flex items-center gap-2 font-medium text-black'>
          <span>
            {t('Scheduled_session_modal.Forecasted_session_duration')}
          </span>
          {isForecastDurationUnsuitable && (
            <img src={warningIcon} alt='warning-icon' />
          )}
        </p>
        <p
          className={
            'whitespace-nowrap text-right ' +
            (isForecastDurationUnsuitable ? 'text-warning' : 'text-black-light')
          }
        >
          {SPFSelected
            ? data?.forecastDuration || 'N/A'
            : data?.forecastDurationNoSunscreen || 'N/A'}
        </p>
      </div>
      <div className='flex items-center justify-between gap-2 py-3 border-b border-gray-light lg:gap-5'>
        <p className='w-1/2 font-medium text-black xl:whitespace-nowrap'>
          {t('Scheduled_session_modal.sunscreen_applied')}
        </p>
        <p className='text-right text-black-light'>
          {SPFSelected ? getLabelFromID(SPFSelected, sunscreenList) : t('None')}
        </p>
      </div>
      <div className='flex justify-between gap-2 py-3 border-b border-gray-light lg:gap-5'>
        <p className='flex items-center gap-2 font-medium text-black'>
          <span> {t('Scheduled_session_modal.PpIX-effective_dose')}</span>
          {isPpiXDoseUnsuitable && <img src={warningIcon} alt='warning-icon' />}
        </p>
        <p
          className={
            'text-right whitespace-nowrap ' +
            (isPpiXDoseUnsuitable ? 'text-warning' : 'text-black-light')
          }
        >
          {SPFSelected
            ? data?.ppixDose
              ? `${data?.ppixDose} J/cm²`
              : '0.0 J/cm²'
            : data?.ppixDoseNoSunscreen
            ? `${data?.ppixDoseNoSunscreen} J/cm²`
            : '0.0 J/cm²'}
        </p>
      </div>
      <div className='flex justify-between gap-2 py-3 border-b border-gray-light lg:gap-5'>
        <p className='flex items-center gap-2 font-medium text-black'>
          <span> {t('Scheduled_session_modal.Erythemal_dose')}</span>
          {isErythemaDoseUnsuitable && (
            <img src={warningIcon} alt='warning-icon' />
          )}
        </p>
        <p
          className={
            'text-right whitespace-nowrap ' +
            (isErythemaDoseUnsuitable ? 'text-warning' : 'text-black-light')
          }
        >
          {SPFSelected
            ? data?.erythemalDose || '0.0 J/m²'
            : data?.erythemalDoseNoSunscreen || '0.0 J/m²'}
        </p>
      </div>
      <div className='flex justify-between gap-2 py-3 lg:gap-5'>
        <p className='flex items-center gap-2 font-medium text-black'>
          <span> {t('Scheduled_session_modal.Erythemal_dose_percentage')}</span>
          {isErythemaDoseUnsuitable && (
            <img src={warningIcon} alt='warning-icon' />
          )}
        </p>
        <p
          className={
            'text-right whitespace-nowrap ' +
            (isErythemaDoseUnsuitable ? 'text-warning' : 'text-black-light')
          }
        >
          {SPFSelected
            ? data?.erythemalDoseFraction || 'N/A'
            : data?.erythemalDoseFractionNoSunscreen || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default SessionInformation;
