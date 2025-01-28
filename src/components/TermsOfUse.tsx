import { useEffect } from 'react';
import { privacyPolicy } from 'routes';
import { AppProvider } from 'AppProvider';
import { Link } from 'react-router-dom';
import { useInstitutionInfo } from 'utils/hooks';

type TermsOfUsePropType = {
  contained?: boolean;
  isModalTermsOfUse?: boolean;
};

export default function TermsOfUse({
  contained,
  isModalTermsOfUse,
}: TermsOfUsePropType) {
  const data = useInstitutionInfo();
  const { t } = AppProvider.useContainer();

  /**
   ** useTitle hook is not used here because it was overriding document.title in dashboard on modal mount
   */
  useEffect(() => {
    if (!isModalTermsOfUse) {
      document.title = t('terms_of_use.header');
    }
  }, [t, isModalTermsOfUse]);

  return (
    <div
      className={
        'p-4 break-words text-black-light text-sm font-normal bg-white space-y-4 ' +
        (contained &&
          'containerShadow 2xl:w-[60%] xl:w-[80%] container mx-auto')
      }
    >
      {contained && (
        <h1 className='mb-8 text-lg font-bold text-black'>
          {t('terms_of_use.header')}
        </h1>
      )}
      <h1 className='text-base font-bold text-black'>
        {t('terms_of_use.modal.overview')}
      </h1>
      <p>
        {t('terms_of_use.p1a')}
        {data?.name}
        {t('terms_of_use.p1b')}
        {data?.address}
        {t('terms_of_use.p1c')}
        <a
          href='https://www.sihealth.co.uk'
          target='_blank'
          rel='noopener noreferrer'
          className='underline text-blue-lighter'
        >
          www.sihealth.co.uk
        </a>
        ).
      </p>
      <p>
        {t('terms_of_use.p2a')}
        <a
          href='https://www.flyby.it'
          target='_blank'
          rel='noopener noreferrer'
          className='underline text-blue-lighter'
        >
          www.flyby.it
        </a>
        {t('terms_of_use.p2b')}
      </p>
      <p>
        {t('terms_of_use.p3a')}
        <a
          href='https://www.sihealthphotonics.it'
          target='_blank'
          rel='noopener noreferrer'
          className='underline text-blue-lighter'
        >
          www.sihealthphotonics.it
        </a>
        {t('terms_of_use.p3b')}
      </p>
      <p>{t('terms_of_use.p4')}</p>
      <p>{t('terms_of_use.p5')}</p>
      <p>{t('terms_of_use.p6')}</p>
      <p>{t('terms_of_use.p7')}</p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h1')}</h1>
      <p>{t('terms_of_use.p8')}</p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h2')}</h1>
      <p>{t('terms_of_use.p9')}</p>
      <p>{t('terms_of_use.p10')}</p>
      <p>{t('terms_of_use.p11')}</p>
      <p>{t('terms_of_use.p12')}</p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h3')}</h1>
      <p>{t('terms_of_use.p13')}</p>
      <ul className='ml-4 list-disc space-y-2'>
        <li>{t('terms_of_use.p14')}</li>
        <li>{t('terms_of_use.p15')}</li>
      </ul>
      <p>{t('terms_of_use.p16')}</p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h4')}</h1>
      <p>{t('terms_of_use.p17')}</p>
      <p>{t('terms_of_use.p18')}</p>
      <p>{t('terms_of_use.p19')}</p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h5')}</h1>
      <p>{t('terms_of_use.p20')}</p>
      <p>{t('terms_of_use.p21')}</p>
      <p>{t('terms_of_use.p22')}</p>
      <p>{t('terms_of_use.p23')}</p>
      <p>{t('terms_of_use.p24')}</p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h6')}</h1>
      <p>{t('terms_of_use.p25')}</p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h7')}</h1>
      <p className='whitespace-pre-line'>
        {t('terms_of_use.p26a')}
        <Link
          to={privacyPolicy}
          rel='noopener noreferrer'
          className='underline text-blue-lighter'
          target={isModalTermsOfUse ? '_blank' : '_self'}
        >
          www.smartpdt.com/privacy-policy
        </Link>
        .
      </p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h8')}</h1>
      <p>{t('terms_of_use.p27')}</p>
      <h1 className='text-base font-bold text-black'>{t('terms_of_use.h9')}</h1>
      <p>{t('terms_of_use.p28')}</p>
      <h1 className='text-base font-bold text-black'>
        {t('terms_of_use.h10')}
      </h1>
      <p>{t('terms_of_use.p29')}</p>
      <h1 className='text-base font-bold text-black'>
        {t('terms_of_use.h11')}
      </h1>
      <p>{t('terms_of_use.p30')}</p>
      <h1 className='text-base font-bold text-black'>
        {t('terms_of_use.h12')}
      </h1>
      <p>{t('terms_of_use.p31')}</p>
      <ul className='ml-4 list-disc space-y-2'>
        <li>
          {t('terms_of_use.p32a')}{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='mailto:info@siHealth.co.uk'
            className='underline text-blue-lighter'
          >
            info@siHealth.co.uk
          </a>
        </li>
        <li>{t('terms_of_use.p33')}</li>
      </ul>
    </div>
  );
}
