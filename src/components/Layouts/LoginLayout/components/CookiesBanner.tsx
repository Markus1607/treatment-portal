import { Link } from 'react-router-dom';
import { privacyPolicy } from 'routes';
import type { TFunction } from 'react-i18next';

type CookiesBannerProps = {
  t: TFunction<'translation', undefined>;
  handleAccept: () => void;
  acceptedCookies: boolean;
  handlePrivacyPolicy: () => void;
};

export default function CookiesBanner({
  t,
  handleAccept,
  acceptedCookies,
  handlePrivacyPolicy,
}: CookiesBannerProps) {
  return (
    <footer
      className={
        'fixed bottom-0 z-[110] w-full 3xl:py-4 py-3 text-xs 3xl:text-sm bg-white border border-gray space-x-4 transition-all duration-700 ' +
        (acceptedCookies ? '-bottom-32' : 'bottom-0')
      }
    >
      <div className='3xl:max-w-[70rem] xl:max-w-[62rem] flex gap-8 items-center justify-between mx-auto px-4 max-w-full'>
        <p className='text-black-light'>
          {t('cookies_notice1')}
          <Link to={privacyPolicy}>
            <span className='underline text-blue-lighter'>
              {t('cookies_notice2')}
            </span>
          </Link>
          {t('cookies_notice3')}
        </p>
        <button
          onClick={() => handlePrivacyPolicy()}
          className='p-2 px-4 font-medium bg-white border-2 text-blue whitespace-nowrap border-blue rounded-md hover:shadow-md hover:scale-105'
        >
          {t('Login.Privacy_policy')}
        </button>
        <button
          onClick={() => handleAccept()}
          className='p-2 px-4 font-medium text-white border bg-blue border-blue rounded-md hover:shadow-md hover:scale-105'
        >
          {t('terms_of_use.modal.accept')}
        </button>
      </div>
    </footer>
  );
}
