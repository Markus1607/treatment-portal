import blueTick from 'assets/images/ic_tick_blue2.svg';
import { TFunction } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';

type PasswordModalProps = {
  data: {
    patientID: number | string;
    password: string;
  };
  modalTitle?: string;
  tickButtonText?: string;
  onCloseFunction?: () => void;
  t: TFunction<'translation', undefined>;
  setPasswordModal: Dispatch<SetStateAction<boolean>>;
};

export default function PasswordModal({
  t,
  data,
  modalTitle,
  tickButtonText,
  onCloseFunction,
  setPasswordModal,
}: PasswordModalProps) {
  return (
    <div className='px-24 text-base font-medium text-left text-black whitespace-pre-wrap py-14'>
      <h1 className='text-2xl'>{modalTitle || t('patient_password_reset')}</h1>
      <p className='my-6 font-light text-black-light'>
        {t('Password_reset.body')}
      </p>
      <p className='max-w-xs my-6 mt-10 space-x-2'>
        <span>{t('Password_reset.Patient_ID')}</span>
        <span className='text-blue'>{data?.patientID}</span>
      </p>
      <p className='max-w-xs my-6 mb-10 space-x-2 whitespace-nowrap'>
        <span>{t('Password_reset.Generated_password')}</span>
        <span className='text-blue'>{data?.password}</span>
      </p>

      <div className='flex space-x-2'>
        <button
          className='flex gap-2 items-center justify-center px-4 py-1.5 text-blue text-base font-medium bg-white border-2 border-blue rounded hover:scale-y-105'
          onClick={() => {
            setPasswordModal(false);
            onCloseFunction && onCloseFunction();
          }}
        >
          <span className='self-center'>
            <img src={blueTick} alt='blue tick' />
          </span>
          <span> {tickButtonText || t('Password_reset.button_text')}</span>
        </button>
      </div>
    </div>
  );
}
