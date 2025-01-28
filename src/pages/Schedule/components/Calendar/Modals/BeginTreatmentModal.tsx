import { TFunction } from 'react-i18next';
import { ClipLoader } from 'components/Loader';
import { Dispatch, SetStateAction } from 'react';
import { DiscardButton } from 'components/Forms/Buttons';
import { ReactComponent as BeginBtnIcon } from 'assets/images/ic_begin_btn.svg';
import AssistedCaseInfo from 'pages/Patients/components/RegisterPatient/RegisterModal/components/AssistedCaseInfo';
import SessionDetails from 'pages/Patients/components/RegisterPatient/RegisterModal/components/SessionDetails';
import { SessionCalendarDataType } from 'pages/Patients/components/RegisterPatient/RegisterModal/api/format';

type BeginTreatmentModalPropTypes = {
  errMsg: string;
  isUpdating: boolean;
  isPortalOnly: boolean;
  isLoadingSessionData: boolean;
  t: TFunction<'translation', undefined>;
  handleQuickScheduleBooking: () => void;
  setBeginTreatmentModal: Dispatch<SetStateAction<boolean>>;
  sessionDetailsData: SessionCalendarDataType & {
    startTime: string;
  };
};

export default function BeginTreatmentModal({
  t,
  errMsg,
  isUpdating,
  isPortalOnly,
  sessionDetailsData,
  isLoadingSessionData,
  setBeginTreatmentModal,
  handleQuickScheduleBooking,
}: BeginTreatmentModalPropTypes) {
  return (
    <div className='max-w-2xl text-sm text-black bg-dashboard'>
      <header className='min-w-[40rem] flex items-center justify-between px-4 py-2 font-medium bg-white border'>
        <h2 className='flex-shrink-0 text-lg'>{t('treatment_details')}</h2>

        {isUpdating && (
          <div>
            <ClipLoader color='#1e477f' size={0.65} />
          </div>
        )}
      </header>

      <main className='max-h-[80vh] overflow-y-auto'>
        {!isPortalOnly && <AssistedCaseInfo t={t} isSchedulingPage />}

        <SessionDetails
          data={sessionDetailsData}
          isLoadingData={isLoadingSessionData}
        />
      </main>

      <footer className='flex items-center justify-between px-4 py-2 bg-white border'>
        <DiscardButton
          alt={t('Button_Back')}
          text={t('Button_Back')}
          onClick={() => setBeginTreatmentModal(false)}
        />

        {errMsg && <p className='text-sm text-warning'>{errMsg}</p>}

        <button
          disabled={isUpdating}
          onClick={() => handleQuickScheduleBooking()}
          className='flex items-center justify-center gap-2 px-4 py-2 text-sm text-white rounded bg-SmartPDTorange hover:scale-y-105'
        >
          <BeginBtnIcon className='self-center scale-75' />
          <span>
            {isPortalOnly ? t('button.begin_treatment') : t('button.finish')}
          </span>
        </button>
      </footer>
    </div>
  );
}
