import { v4 as uuidv4 } from 'uuid';
import { useTitle } from 'utils/hooks';
import type { AxiosError } from 'axios';
import apiServer from 'server/apiServer';
import { AppProvider } from 'AppProvider';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'components/Loader';
import LoginLayout from 'components/Layouts/LoginLayout/LoginLayout';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import {
  patients,
  loginAdmin,
  staffLoginUrl,
  adminLoginUrl,
  forgotPassword,
  getSaltStaffUrl,
  getSaltAdminUrl,
} from 'routes';
import ShowIcon from 'assets/images/ic_show.svg';
import HideIcon from 'assets/images/ic_hide.svg';
import type { GetSaltResponseType, LoginResponseType } from './api/api.d';
import {
  hash,
  getErrorMsg,
  setCookieData,
  setInstitutionInfo,
} from './api/utils';

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [errMsg, setErrMsg] = useState('');
  const [submit, setSubmitting] = useState(false);
  const errMsgRef = useRef<HTMLParagraphElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { t, setCookies, acceptedCookies } = AppProvider.useContainer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const scrollToError = () =>
    errMsgRef?.current?.scrollIntoView({ behavior: 'smooth' });

  useTitle('SmartPDT');

  const onSubmit = (data: LoginFormData) => {
    if (!acceptedCookies) {
      scrollToError();
      setErrMsg(t('error.no_cookies'));
      return;
    }
    setErrMsg('');
    setSubmitting(true);
    const uuid = uuidv4();
    const { email, password } = data;
    const isAdminPath = path === loginAdmin;

    apiServer
      .get<GetSaltResponseType>(
        `${isAdminPath ? getSaltAdminUrl : getSaltStaffUrl}?uuid=${uuid}`
      )
      .then(async ({ data }) => {
        const { salt } = data;
        const hashInput = await hash(password);
        return await hash(hashInput + salt);
      })
      .then((hashedPassword) => {
        apiServer
          .post<LoginResponseType>(
            `${isAdminPath ? adminLoginUrl : staffLoginUrl}`,
            {
              uuid: uuid,
              username: email,
              password_hash: hashedPassword,
            }
          )
          .then(({ data }) => {
            setSubmitting(false);
            if (!navigator.cookieEnabled) {
              alert(t('Error.browser_cookie_settings'));
              return;
            }
            setInstitutionInfo(data);
            setCookies('user', setCookieData(data), { path: '/' });
            history.push(patients);
          })
          .catch((err: AxiosError) => handleServerError(err));
      })
      .catch((err: AxiosError) => handleServerError(err));
  };

  const handleServerError = (err: AxiosError) => {
    setSubmitting(false);
    if (err.message === 'Network Error') {
      scrollToError();
      setErrMsg(t('Error.network_error'));
    } else {
      scrollToError();
      const code = err?.response?.data?.code;
      const errorMsg = err?.response?.data?.error;
      setErrMsg(getErrorMsg(t, code, path, errorMsg));
    }
  };

  return (
    <LoginLayout>
      <div className='flex flex-col pb-5 text-center bg-white md:px-14 md:py-10 lg:px-24'>
        <h1 className='block mt-8 text-lg font-medium whitespace-pre-line 2xl:mt-2 text-blue-dark 3xl:text-3xl md:mt-2'>
          {t('Login.heading')}
        </h1>

        <form
          className='min-w-full mt-10 mb-0 space-y-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor='email' className='formLabel'>
              {t('Login.email_address')}
            </label>
            <input
              className='formInput'
              autoComplete='email'
              aria-label='email-input'
              type='email'
              placeholder={t('Forgot_password.enter_email')}
              {...register('email', {
                required: t('Forgot_password.email_required'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('Error.invalid.email'),
                },
              })}
            />
          </div>
          {errors.email && (
            <p className='errorMessage !mt-1'>{errors.email.message}</p>
          )}

          {/* password input box */}
          <div className='relative'>
            <div className='flex items-center justify-between w-full'>
              <label htmlFor='password' className='formLabel'>
                {t('Login.password')}
              </label>
              <p className='text-xs text-right'>
                <Link
                  to={forgotPassword}
                  className='font-light underline text-blue-lighter'
                >
                  {t('Login.trouble_logging_in_link')}
                </Link>
              </p>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              aria-label='password-input'
              className='-mb-2 formInput'
              autoComplete='current-password'
              placeholder={t('Login.Enter_Password')}
              {...register('password', {
                required: t('Forgot_password.password_required'),
              })}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='safari-password-reveal 3xl:w-4.5 3xl:h-4.5 absolute inset-y-10 2xl:inset-y-12 right-4 w-4 h-4'
            >
              <img
                alt='show-hide-icon'
                src={showPassword ? HideIcon : ShowIcon}
              />
            </button>
          </div>
          {errors.password && (
            <p className='mt-1 errorMessage'>{errors.password.message}</p>
          )}

          <label className='rm-checkbox !mt-6'>
            <input type='checkbox' />
            <span className='checkmark'></span>
            <span className='ml-1.5 my-auto text-black-light text-xs leading-3'>
              {t('Login.remember_me')}
            </span>
          </label>

          {submit ? (
            <div className='!mt-6 p-0 py-1.5 2xl:py-2 w-full text-white bg-blue border rounded-md'>
              <ClipLoader />
            </div>
          ) : (
            <button
              className='text-bold !mt-6 py-3 2xl:py-4 w-full text-white bg-blue border rounded-md cursor-pointer active:scale-95 md:text-base'
              type='submit'
            >
              {t('Login.button_text')}
            </button>
          )}

          {errMsg && (
            <p ref={errMsgRef} className='mt-1 text-center errorMessage'>
              {errMsg}
            </p>
          )}
        </form>

        <div className='mt-4 text-xs font-light'>
          <div className='p-0 mt-5 text-gray'>
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
      </div>
    </LoginLayout>
  );
}
