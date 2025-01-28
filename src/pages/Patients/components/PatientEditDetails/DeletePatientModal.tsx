import { DiscardButton, DeleteButton } from 'components/Forms/Buttons';
import { ClipLoader } from 'components/Loader';
import { Dispatch, SetStateAction } from 'react';
import { TFunction } from 'react-i18next';

type DeletePatientModalProps = {
  t: TFunction;
  isDeleting: boolean;
  patientDeleted: boolean;
  onDeleteFunction: () => void;
  setDeletePatientModal: Dispatch<SetStateAction<boolean>>;
};

export default function DeletePatientModal({
  t,
  isDeleting,
  patientDeleted,
  onDeleteFunction,
  setDeletePatientModal,
}: DeletePatientModalProps) {
  return (
    <div>
      {patientDeleted ? (
        <div className='text-center p-14'>
          <h1 className='text-xl font-medium text-black 2xl:text-2xl'>
            {t('Patient_details.Patient_deleted.heading')}
          </h1>
          <p className='max-w-xs my-6 font-light whitespace-pre-wrap text-black-light'>
            {t('Patient_details.Patient_deleted.body')}
          </p>
          <ClipLoader color='#1e477f' size={1.5} />
        </div>
      ) : (
        <div>
          <main className='p-14'>
            <h1
              className={`text-black text-xl 2xl:text-2xl font-medium ${
                isDeleting ? 'text-center' : 'text-left'
              }`}
            >
              {isDeleting
                ? t('Patient_details.Deleting_patient')
                : t('Patient_details.Delete_patient.heading')}
            </h1>
            {isDeleting ? (
              <div className='mx-40 mt-10'>
                <ClipLoader color='#1e477f' size={1.5} />
              </div>
            ) : (
              <p className='max-w-lg mt-6 font-light whitespace-pre-wrap text-black-light'>
                {t('Patient_details.Delete_patient.body')}
              </p>
            )}
          </main>
          {!isDeleting && (
            <footer className='flex justify-between px-4 py-3 bg-white border'>
              <DiscardButton
                className='2xl:text-base'
                alt={t('Cancel_session.button_text')}
                text={t('Cancel_session.button_text')}
                onClick={() => {
                  setDeletePatientModal(false);
                }}
              />
              <DeleteButton
                className='gap-2.5 2xl:px-5 px-5 text-warning 2xl:text-base font-medium border-2 border-warning hover:border-warning rounded hover:scale-y-105'
                text={t('Delete_patient.button_text')}
                onClick={() => {
                  onDeleteFunction && onDeleteFunction();
                }}
              />
            </footer>
          )}
        </div>
      )}
    </div>
  );
}
