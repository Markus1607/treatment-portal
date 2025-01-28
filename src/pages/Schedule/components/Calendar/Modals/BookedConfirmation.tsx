import { TFunction } from 'react-i18next';
import type {
  beginTreatmentDataType,
  confirmationDetailsType,
} from './api/format.d';
import { isTreatmentReadyToBegin } from './api/format';
import { ReactComponent as LoaderIcon } from 'assets/images/ic_loader.svg';
import { AppProvider } from '~/AppProvider';
import { getLabelFromKey } from '~/utils/functions';
import { sessionTypeToLocationSource } from '~/utils/options';

type BookedConfirmationPropTypes = {
  isPortalOnly: boolean;
  onContinueFunc: () => void;
  isRequestLoading: boolean;
  t: TFunction<'translation', undefined>;
  confirmationDetails: confirmationDetailsType;
  handleBeginTreatment: (data: beginTreatmentDataType) => void;
};

export default function BookedConfirmation({
  t,
  isPortalOnly,
  onContinueFunc,
  isRequestLoading,
  confirmationDetails,
  handleBeginTreatment,
}: BookedConfirmationPropTypes) {
  const { currentPatientUsername } = AppProvider.useContainer();
  const isReadyToBegin = isTreatmentReadyToBegin(
    confirmationDetails.unixDateTime
  );
  const { sessionId } = confirmationDetails.beginTreatmentData;

  return (
    <div className='z-[102] max-w-xl text-left text-black text-sm bg-dashboard'>
      <div className='py-0.5 mb-2 bg-white' />
      <main className='max-h-[80vh] m-4 p-4 bg-white border rounded-md shadow-md overflow-y-auto space-y-6'>
        <h2 className='text-base font-medium'>
          {confirmationDetails.rescheduled
            ? t('booking_confirmation.heading.2')
            : t('booking_confirmation.heading')}
        </h2>
        <p className='text-sm font-light text-black-light'>
          {t('booking_confirmation.body')}
        </p>
        <div className='w-full leading-5 text-cxs border-gray-lightest'>
          <p className='flex items-center justify-between py-3 border-b'>
            <span className='font-medium'>{t('patient_id')}</span>
            <span className='font-light text-black-light'>
              {currentPatientUsername}
            </span>
          </p>
          <p className='flex items-center justify-between py-3 border-b'>
            <span className='font-medium'>{t('treatment_date')}</span>
            <span className='font-light text-black-light'>
              {confirmationDetails.date}
            </span>
          </p>
          <p className='flex items-center justify-between py-3 border-b'>
            <span className='font-medium'>{t('treatment_address')}</span>
            <span className='font-light text-black-light'>
              {confirmationDetails.location}
            </span>
          </p>
          <p className='flex items-center justify-between py-3 border-b'>
            <span className='font-medium'>{t('location_source')}</span>
            <span className='font-light text-black-light'>
              {getLabelFromKey(
                confirmationDetails.sessionType,
                sessionTypeToLocationSource()
              )}
            </span>
          </p>
          <p className='flex items-center justify-between py-3 border-b'>
            <span className='font-medium'>{t('pre-treatment_start_time')}</span>
            <span className='font-light text-black-light'>
              {confirmationDetails.preStartTime}
            </span>
          </p>
          <p className='flex items-center justify-between py-3 border-b'>
            <span className='font-medium'>{t('treatment_start_time')}</span>
            <span className='font-light text-black-light'>
              {confirmationDetails.startTime}
            </span>
          </p>
          <p className='flex items-center justify-between py-3 border-none'>
            <span className='font-medium'>{t('treatment_end_time')}</span>
            <span className='font-light text-black-light'>
              {confirmationDetails.endTime}
            </span>
          </p>
        </div>
      </main>
      <footer className='flex flex-row-reverse gap-2 px-4 py-2 bg-white border-t'>
        <button
          type='button'
          onClick={() => onContinueFunc()}
          className='flex items-center px-4 py-2 text-sm text-white rounded bg-blue hover:scale-y-105'
        >
          {t('Button_continue')}
        </button>

        {isPortalOnly && isReadyToBegin && (
          <button
            onClick={() => {
              handleBeginTreatment({
                session_id: sessionId || '',
                patient_id: confirmationDetails.patientID,
              });
            }}
            className='flex items-center px-4 py-2 text-sm text-white rounded bg-SmartPDTorange hover:scale-y-105'
          >
            {isRequestLoading ? (
              <LoaderIcon className='w-24 animate-spin' />
            ) : (
              t('button.begin_treatment')
            )}
          </button>
        )}
      </footer>
    </div>
  );
}
