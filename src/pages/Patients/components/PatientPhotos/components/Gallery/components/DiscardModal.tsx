import { DiscardButton } from 'components/Forms/Buttons';
import { ReactComponent as BinIcon } from 'assets/images/ic_bin.svg';
import { TFunction } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';

type DiscardModalProps = {
  t: TFunction;
  resetModalOnClose: () => void;
  setDiscardModal: Dispatch<SetStateAction<boolean>>;
};

export default function DiscardModal({
  t,
  setDiscardModal,
  resetModalOnClose,
}: DiscardModalProps) {
  return (
    <div className='text-sm text-black'>
      <main className='px-16 mx-auto text-left whitespace-pre-wrap pb-14 pt-14 space-y-4'>
        <h1 className='text-base font-bold 3xl:text-3xl lg:text-lg xl:text-2xl'>
          {t('smartak.upload.discard.header')}
        </h1>
        <p className='text-black-light'>{t('smartak.upload.discard.body')}</p>
      </main>
      <footer className='flex justify-between px-4 py-3 bg-white border-t'>
        <DiscardButton
          alt={t('Button_Back')}
          text={t('Button_Back')}
          className='2xl:text-base'
          onClick={() => setDiscardModal(false)}
        />

        <button
          type='button'
          onClick={() => resetModalOnClose()}
          className='flex gap-2 items-center justify-center px-4 py-1.5 text-white text-sm bg-blue rounded hover:scale-y-105'
        >
          <span className='self-center scale-90'>
            <BinIcon />
          </span>
          <span>{t('Button_discard')}</span>
        </button>
      </footer>
    </div>
  );
}
