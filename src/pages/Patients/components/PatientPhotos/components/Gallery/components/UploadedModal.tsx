import { useEffect } from 'react';
import { TFunction } from 'react-i18next';
import { ClipLoader } from 'components/Loader';

type UploadedModalProps = {
  t: TFunction;
  uploadedModal: boolean;
  resetModalOnClose: () => void;
};

export default function UploadedModal({
  t,
  uploadedModal,
  resetModalOnClose,
}: UploadedModalProps) {
  useEffect(() => {
    uploadedModal &&
      setTimeout(() => {
        resetModalOnClose();
      }, 1500);
  }, [resetModalOnClose, uploadedModal]);

  return (
    <div className='px-10 py-8 text-sm text-center text-black space-y-6'>
      <h1 className='text-base font-bold lg:text-xl'>
        {t('smartak.upload.header')}
      </h1>
      <p className='text-black-light'>{t('smartak.changes.saved.body')}</p>
      <div className='w-full py-2 mx-auto'>
        <ClipLoader color='#1e477f' size={1} />
      </div>
    </div>
  );
}
