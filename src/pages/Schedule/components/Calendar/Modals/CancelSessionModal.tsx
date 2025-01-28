import { TFunction } from 'react-i18next';
import { ClipLoader } from 'components/Loader';
import { Dispatch, SetStateAction } from 'react';
import { DiscardButton, CancelSession } from 'components/Forms/Buttons';

type CancelSessionModalPropTypes = {
  isCancelling: boolean;
  sessionCancelled: boolean;
  onCancelFunction: () => void;
  isInProgressTreatment?: boolean;
  t: TFunction<'translation', undefined>;
  setCancelSessionModal: Dispatch<SetStateAction<boolean>>;
};

export default function CancelSessionModal({
  t,
  isCancelling,
  onCancelFunction,
  sessionCancelled,
  setCancelSessionModal,
  isInProgressTreatment,
}: CancelSessionModalPropTypes) {
  return (
    <div className='z-[102]'>
      {sessionCancelled ? (
        <div className='text-center p-14'>
          <h1 className='text-xl font-medium text-black 2xl:text-2xl'>
            {t('Cancel_session.heading')}
          </h1>
          <p className='max-w-xs my-6 text-base font-light whitespace-pre-wrap text-black-light'>
            {t('Cancel_session.cancelled')}
          </p>
          <div className='mx-40 mt-5'>
            <ClipLoader color='#1e477f' size={1.2} />
          </div>
        </div>
      ) : (
        <div>
          <main className='p-14'>
            <h1
              className={`text-black text-xl 2xl:text-2xl font-medium ${
                isCancelling ? 'text-center' : 'text-left'
              }`}
            >
              {isCancelling
                ? t('Cancel_session.cancelling')
                : isInProgressTreatment
                ? t('Cancel_in_progress_session.heading')
                : t('Cancel_session.heading')}
            </h1>
            {isCancelling ? (
              <div className='mx-40 mt-10'>
                <ClipLoader color='#1e477f' size={1.5} />
              </div>
            ) : (
              <p className='max-w-lg mt-6 text-sm font-light text-left whitespace-pre-wrap text-black-light'>
                {isInProgressTreatment
                  ? t('inprogress_cancel_warning')
                  : t('Cancel_session.body.3')}
              </p>
            )}
          </main>
          {!isCancelling && (
            <footer className='flex justify-between px-4 py-3 bg-white border'>
              <DiscardButton
                className='2xl:text-base'
                alt={t('Button_Close')}
                text={t('Button_Close')}
                onClick={() => {
                  setCancelSessionModal(false);
                }}
              />

              <CancelSession
                className='2xl:px-6 2xl:text-base'
                text={t('Monitoring_-_report.text')}
                alt={t('Monitoring_-_report.text')}
                onClick={() => {
                  onCancelFunction && onCancelFunction();
                }}
              />
            </footer>
          )}
        </div>
      )}
    </div>
  );
}
