import { ReactNode } from 'react';
import { AppProvider } from 'AppProvider';
import { useHistory } from 'react-router-dom';
import LoginLogo from 'assets/images/loginLogo.svg';
import CookiesBanner from './components/CookiesBanner';
import { patients, loginStaff, privacyPolicy } from 'routes';

type LoginLayoutProps = {
  children: ReactNode;
  isPolicyPage?: boolean;
};

export default function LoginLayout({
  children,
  isPolicyPage,
}: LoginLayoutProps) {
  const history = useHistory();
  const {
    t,
    SelectLang,
    acceptedCookies,
    cookies: { user },
    setAcceptedCookies,
  } = AppProvider.useContainer();
  const isUserLoggedIn = user?.token ? true : false;

  const handleAccept = () => setAcceptedCookies(true);
  const handlePrivacyPolicy = () => history.push(privacyPolicy);

  return (
    <div className='w-full 3xl:mx-auto bg-gray-lightest'>
      <div className='flex flex-col max-h-screen min-h-screen overflow-y-auto shadow'>
        <div className='flex items-center content-center justify-between py-4 bg-white shadow-md max-h-20 md:px-8'>
          <button
            className='w-32 cursor-pointer md:w-40 lg:w-56'
            onClick={() =>
              isUserLoggedIn ? history.push(patients) : history.push(loginStaff)
            }
          >
            <img
              height='77'
              width='288.835'
              src={LoginLogo}
              className='my-2'
              alt={t('Login.logo_alt')}
            />
          </button>
          <SelectLang />
        </div>
        <div
          className={
            isPolicyPage
              ? 'h-[88vh] 3xl:h-[90vh] mt-1 mx-auto w-full bg-dashboard'
              : '3xl:w-[35%] max-w-[45rem] justify-center 3xl:mt-20 mx-auto my-16 pt-2 3xl:pt-3 w-full bg-blue border-none md:w-8/12 md:rounded-md md:shadow-md lg:w-7/12 lg:border lg:border-gray-light xl:w-5/12'
          }
        >
          {children}
        </div>

        {!acceptedCookies && (
          <CookiesBanner
            t={t}
            handleAccept={handleAccept}
            acceptedCookies={acceptedCookies}
            handlePrivacyPolicy={handlePrivacyPolicy}
          />
        )}
      </div>
    </div>
  );
}
