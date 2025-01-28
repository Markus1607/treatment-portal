import { TFunction } from 'react-i18next';
import { ClipLoader } from 'components/Loader';
import { Dispatch, SetStateAction } from 'react';
import { DiscardButton, CancelSession } from 'components/Forms/Buttons';

type CancelSessionModalProps = {
  t: TFunction;
  isLoading: boolean;
  isPortalOnly: boolean;
  sessionCancelled: boolean;
  handleCancelSession: () => void;
  setCancelSessionModal: Dispatch<SetStateAction<boolean>>;
};

export default function CancelSessionModal({
  t,
  isLoading,
  isPortalOnly,
  sessionCancelled,
  handleCancelSession,
  setCancelSessionModal,
}: CancelSessionModalProps) {
  return (
    <div>
      {sessionCancelled ? (
        <div className='text-center p-14'>
          <h1 className='text-2xl font-medium text-black 3xl:text-3xl'>
            {t('Cancel_session_confirm.heading')}
          </h1>
          <p className='max-w-xs my-6 font-light whitespace-pre-wrap text-black-light'>
            {t('Cancel_session_confirm.body')}
          </p>
          <ClipLoader color='#1e477f' size={1.5} />
        </div>
      ) : (
        <div>
          <main className='px-24 p-14'>
            <h1 className='text-2xl font-medium text-black 3xl:text-3xl'>
              {t('Cancel_session.heading')}
            </h1>
            <p className='max-w-sm mt-6 font-light whitespace-pre-wrap text-black-light'>
              {isPortalOnly
                ? t('Cancel_session.body.3')
                : t('Cancel_session.body')}
            </p>
          </main>
          <footer className='flex items-center justify-between px-4 py-3 bg-white border'>
            <DiscardButton
              alt={t('Cancel_session.button_text')}
              text={t('Cancel_session.button_text')}
              onClick={() => {
                setCancelSessionModal(false);
              }}
            />

            {isLoading && <ClipLoader color='#1e477f' size={0.8} />}

            <span className='flex gap-4'>
              <CancelSession
                onClick={handleCancelSession}
                alt={t('Button_cancel_session')}
                text={t('Button_cancel_session')}
              />
            </span>
          </footer>
        </div>
      )}
    </div>
  );
}
