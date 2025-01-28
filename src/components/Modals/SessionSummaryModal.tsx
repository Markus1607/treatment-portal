import {
  DiscardButton,
  CancelSession,
  RescheduleButton,
  RescheduleButton as BeginTreatmentButton,
} from 'components/Forms/Buttons';
import { isNumber } from 'lodash';
import { AppProvider } from 'AppProvider';
import { patients, schedule } from 'routes';
import { useHistory } from 'react-router-dom';
import { ClipLoader } from 'components/Loader';
import { ModalTitle } from 'components/ModalTitle';
import { SessionTypeEnums } from 'utils/options.d';
import { SessionSummaryModalDataType } from '@types';
import warningIcon from 'assets/images/ic_warning.svg';
import { useState, Dispatch, SetStateAction } from 'react';
import beginTreatmentIcon from 'assets/images/ic_begin_treatment.svg';
import { getLabelFromID, getTimeSuitabilityBgColor } from 'utils/functions';
import type { beginTreatmentDataType } from 'pages/Schedule/components/Calendar/Modals/api/format.d';

type SessionSummaryModalPropType = {
  data: SessionSummaryModalDataType;
  isLoadingAdditionalData: boolean;
  setSessionSummaryModal: Dispatch<SetStateAction<boolean>>;
  handleBeginTreatment: (data: beginTreatmentDataType) => void;
  handleCancelTreatment: (data: SessionSummaryModalDataType) => void;
};

const SessionSummaryModal = ({
  data,
  handleBeginTreatment,
  handleCancelTreatment,
  setSessionSummaryModal,
  isLoadingAdditionalData,
}: SessionSummaryModalPropType) => {
  const history = useHistory();
  const { FullyAssisted } = SessionTypeEnums;
  const { t, sunscreenList } = AppProvider.useContainer();
  const [cancelSession, setCancelSession] = useState(false);
  const modalTitle = `${`ID: ${data.patientID} > ${data.treatmentModalTitleDate} > ${data.treatmentTime}`}`;

  return (
    <div className='text-base text-black bg-dashboard'>
      {cancelSession ? (
        <main className='px-24 bg-white p-14'>
          <h1 className='text-2xl font-medium text-black 3xl:text-3xl'>
            {t('Cancel_session.heading')}
          </h1>
          <p className='max-w-sm mt-6 font-light whitespace-pre-wrap text-black-light'>
            {t('Cancel_session.body.3')}
          </p>
        </main>
      ) : (
        <>
          <header className='min-w-[40rem] flex items-center justify-between px-4 py-2 font-medium bg-white border'>
            <h2 className='flex-shrink-0 text-lg'>{ModalTitle(modalTitle)}</h2>

            {data.sessionType === FullyAssisted && !data.rescheduleRequired && (
              <CancelSession
                alt={t('Button_cancel_session')}
                text={t('Button_cancel_session')}
                onClick={() => {
                  if (!cancelSession) {
                    setCancelSession(true);
                  } else {
                    handleCancelTreatment(data);
                  }
                }}
              />
            )}
          </header>

          <main className='max-h-[80vh] overflow-y-auto'>
            <section className='p-4 pb-0 m-4 mb-5 font-medium bg-white border shadow-sm containerShadow'>
              <div className='relative flex justify-between mb-4'>
                <h1 className='font-bold text-left 2xl:text-lg'>
                  {t('Scheduled_session_modal.session_title')}
                </h1>

                {isLoadingAdditionalData && (
                  <div className='absolute right-0 -top-2'>
                    {' '}
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
                  <span className='flex items-center gap-2 font-medium text-black'>
                    <span>
                      {t('Scheduled_session_modal.Forecasted_session_duration')}
                    </span>
                    {data?.unsuitableReasons?.some(
                      (el) => el === 'min_time' || el === 'max_time'
                    ) && <img src={warningIcon} alt='warning-icon' />}
                  </span>
                  <span
                    className={`font-light ${
                      data?.unsuitableReasons?.some(
                        (el) => el === 'min_time' || el === 'max_time'
                      )
                        ? 'text-warning'
                        : 'text-black-light'
                    }`}
                  >
                    {data.forecastDuration}
                  </span>
                </div>
                <p className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
                  <span>{t('Scheduled_session_modal.sunscreen_applied')}</span>
                  <span className='font-light text-black-light'>
                    {getLabelFromID(data.sunscreen, sunscreenList)}
                  </span>
                </p>
                <p className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
                  <span className='flex items-center gap-2 font-medium text-black'>
                    <span>
                      {t('Scheduled_session_modal.PpIX-effective_dose')}
                    </span>
                    {data?.unsuitableReasons?.some(
                      (el) => el === 'min_ppix_dose' || el === 'max_ppix_dose'
                    ) && <img src={warningIcon} alt='warning-icon' />}
                  </span>
                  <span
                    className={`font-light ${
                      data?.unsuitableReasons?.some(
                        (el) => el === 'min_ppix_dose' || el === 'max_ppix_dose'
                      )
                        ? 'text-warning'
                        : 'text-black-light'
                    }`}
                  >
                    {data.ppixDose ? data.ppixDose + ' J/cm²' : '-'}
                  </span>
                </p>
                <p className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
                  <span className='flex items-center gap-2 font-medium text-black'>
                    <span>{t('Scheduled_session_modal.Erythemal_dose')}</span>
                    {data?.unsuitableReasons?.includes('max_ery_dose') && (
                      <img src={warningIcon} alt='warning-icon' />
                    )}
                  </span>
                  <span
                    className={`font-light ${
                      data?.unsuitableReasons?.includes('max_ery_dose')
                        ? 'text-warning'
                        : 'text-black-light'
                    }`}
                  >
                    {data.erthemalDose ? data.erthemalDose + ' J/m²' : '-'}
                  </span>
                </p>
                <p className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
                  <span className='flex items-center gap-2 font-medium text-black'>
                    <span>
                      {t('Scheduled_session_modal.Erythemal_dose_percentage')}
                    </span>
                    {data?.unsuitableReasons?.includes('max_ery_dose') && (
                      <img src={warningIcon} alt='warning-icon' />
                    )}
                  </span>
                  <span
                    className={`font-light ${
                      data?.unsuitableReasons?.includes('max_ery_dose')
                        ? 'text-warning'
                        : 'text-black-light'
                    }`}
                  >
                    {isNumber(data.erythemalDosePercentage)
                      ? data.erythemalDosePercentage + ' %'
                      : '-'}
                  </span>
                </p>
              </div>
            </section>

            {data?.weatherCondition !== '-' && (
              <section className='p-4 pb-0 m-4 font-medium bg-white border shadow-sm containerShadow'>
                <header className='flex justify-between gap-10'>
                  <h1 className='mb-4 font-bold text-left 2xl:text-lg'>
                    {t('Scheduled_session_modal.weather_conditions')}
                  </h1>
                </header>
                <div className='w-full text-sm divide-y border-gray-light'>
                  <div className='flex gap-10 items-center justify-between m-0 py-2.5 2xl:py-3.5 w-full'>
                    <span className='flex items-center gap-2 font-medium text-black'>
                      <span>
                        {t(
                          'Scheduled_session_modal.Average_weather_conditions'
                        )}
                      </span>
                      {data?.unsuitableReasons?.some(
                        (el) => el === 'max_precip' || el === 'amber_precip'
                      ) && <img src={warningIcon} alt='warning-icon' />}
                    </span>
                    <span
                      className={`font-light ${
                        data?.unsuitableReasons?.some(
                          (el) => el === 'max_precip' || el === 'amber_precip'
                        )
                          ? 'text-warning'
                          : 'text-black-light'
                      }`}
                    >
                      {data.weatherCondition}
                    </span>
                  </div>
                  <p className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
                    <span className='flex items-center gap-2 font-medium text-black'>
                      <span>{t('Scheduled_session_modal.temperature')}</span>
                      {data?.unsuitableReasons?.some(
                        (el) => el === 'min_temp' || el === 'max_temp'
                      ) && <img src={warningIcon} alt='warning-icon' />}
                    </span>
                    <span
                      className={`font-light ${
                        data?.unsuitableReasons?.some(
                          (el) => el === 'min_temp' || el === 'max_temp'
                        )
                          ? 'text-warning'
                          : 'text-black-light'
                      }`}
                    >
                      {data.temperature ? `${data.temperature} °C` : '-'}
                    </span>
                  </p>
                  <div className='flex gap-10 items-center justify-between py-2.5 2xl:py-3.5 w-full'>
                    <span className='flex items-center gap-2 font-medium text-black'>
                      <span>{t('Scheduled_session_modal.Chance_of_rain')}</span>
                      {data?.unsuitableReasons?.some(
                        (el) => el === 'max_precip' || el === 'amber_precip'
                      ) && <img src={warningIcon} alt='warning-icon' />}
                    </span>
                    <span
                      className={`font-light ${
                        data?.unsuitableReasons?.some(
                          (el) => el === 'max_precip' || el === 'amber_precip'
                        )
                          ? 'text-warning'
                          : 'text-black-light'
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
            )}
          </main>
        </>
      )}

      <footer className='flex justify-between px-4 py-3 bg-white border'>
        <DiscardButton
          alt={t('Button_Close')}
          text={t('Button_Close')}
          onClick={() => {
            if (cancelSession) {
              setCancelSession(false);
            } else {
              setSessionSummaryModal(false);
            }
          }}
        />

        <div className='flex gap-5'>
          {(data.sessionType !== FullyAssisted ||
            (data.sessionType === FullyAssisted && cancelSession)) && (
            <CancelSession
              alt={t('Button_cancel_session')}
              text={t('Button_cancel_session')}
              onClick={() => {
                if (!cancelSession) {
                  setCancelSession(true);
                } else {
                  handleCancelTreatment(data);
                }
              }}
            />
          )}

          {data.sessionType === FullyAssisted && !cancelSession && (
            <RescheduleButton
              alt={t('Button_Reschedule')}
              text={t('Button_Reschedule')}
              onClick={() =>
                history.push(`${patients}/${data.patientID}/${schedule}`)
              }
            />
          )}

          {data.sessionType !== FullyAssisted && (
            <RescheduleButton
              alt={t('Button_Reschedule')}
              text={t('Button_Reschedule')}
              onClick={() =>
                history.push(`${patients}/${data.patientID}/${schedule}`)
              }
            />
          )}

          {!data.rescheduleRequired && data.isTreatmentReadyToBegin && (
            <BeginTreatmentButton
              className='bg-orange'
              alt={t('button.begin_treatment')}
              text={t('button.begin_treatment')}
              onClick={() => {
                handleBeginTreatment({
                  session_id: data.sessionID,
                  patient_id: data.patientID,
                });
              }}
              icon={beginTreatmentIcon}
            />
          )}
        </div>
      </footer>
    </div>
  );
};

export default SessionSummaryModal;
