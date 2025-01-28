import { UIEvent, useState } from 'react';
import TermsOfUse from 'components/TermsOfUse';
import { TFunction } from 'react-i18next';

type TermsOfUseModalProps = {
  t: TFunction;
  handleAccept: () => void;
  handleDecline: () => Promise<void>;
};
export default function TermsOfUseModal({
  t,
  handleDecline,
  handleAccept,
}: TermsOfUseModalProps) {
  const [fullyScrolled, setFullyScrolled] = useState(false);

  const handleScroll = (e: UIEvent<HTMLDivElement, globalThis.UIEvent>) => {
    if (!fullyScrolled) {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const bottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 200;
      setFullyScrolled(bottom);
    }
  };

  return (
    <div className='flex flex-col max-w-xl p-4 px-20 text-sm text-black bg-white border-t-8 rounded-lg border-blue'>
      <h1 className='p-4 mt-1 text-3xl font-bold text-center text-blue-dark lg:mt-4'>
        {t('Login.terms_and_conditions1')}
      </h1>
      <div
        onScroll={(e) => handleScroll(e)}
        className='mb-4 overflow-y-scroll break-words border monitoringScrollBar h-72 border-gray-light rounded-md'
      >
        <TermsOfUse isModalTermsOfUse />
      </div>
      <div className='flex w-full space-x-4'>
        <button
          onClick={() => handleDecline()}
          className='w-full p-4 font-medium border cursor-pointer text-blue bg-gray-lightest border-blue rounded-md hover:shadow-md hover:scale-105'
        >
          {t('terms_of_use.modal.decline')}
        </button>
        <button
          disabled={!fullyScrolled}
          onClick={() => handleAccept()}
          className={
            'p-4 w-full text-white font-medium  border rounded-md  ' +
            (fullyScrolled
              ? 'hover:shadow-md hover:scale-105 bg-blue cursor-pointer'
              : 'cursor-not-allowed bg-black-lighter')
          }
        >
          {t('terms_of_use.modal.accept')}
        </button>
      </div>
      <div className='p-0 my-5 text-xs text-center text-gray xl:my-8'>
        <a
          href='https://www.sihealth.co.uk/our-technology/happysun/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <p>{t('Forgot_password.copyright')}</p>
          <p>{t('Reset_password.happysun_text')}</p>
        </a>
      </div>
    </div>
  );
}
