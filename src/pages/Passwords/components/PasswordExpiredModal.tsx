import { TFunction } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router-dom';

type PasswordExpiredModalType = {
  heading: string;
  subText: string;
  t: TFunction<'translation', undefined>;
  history: ReturnType<typeof useHistory>;
  setPasswordExpiredModal: Dispatch<SetStateAction<boolean>>;
};

export default function PasswordExpiredModal({
  t,
  history,
  heading,
  subText,
  setPasswordExpiredModal,
}: PasswordExpiredModalType) {
  return (
    <div className='px-24 text-base font-medium text-center text-black whitespace-pre-wrap py-14'>
      <h1 className='text-2xl'>{heading}</h1>
      <p className='max-w-sm my-8 font-normal text-black'>{subText}</p>
      <p className='max-w-sm my-6 font-light text-black-light'>
        {t('login_old_reset_link-b2')}
      </p>

      <button
        onClick={() => {
          setPasswordExpiredModal(false);
          history.replace({ state: {} });
        }}
        className='flex items-center justify-center w-full px-4 py-2 my-4 text-base text-white rounded gap-2 bg-blue hover:scale-y-105'
      >
        {t('Button_dismiss')}
      </button>
    </div>
  );
}
