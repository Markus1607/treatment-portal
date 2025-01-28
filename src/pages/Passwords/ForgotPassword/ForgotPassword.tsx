import { useState } from 'react';
import { forgotPasswordUrl, loginStaff } from 'routes';
import { AppProvider } from 'AppProvider';
import { ClipLoader } from 'components/Loader';
import { useForm } from 'react-hook-form';
import Modal from 'components/Modals/Modal';
import apiServer from 'server/apiServer';
import { Link, useHistory } from 'react-router-dom';
import PasswordExpiredModal from '../components/PasswordExpiredModal';
import LoginLayout from 'components/Layouts/LoginLayout/LoginLayout';

export default function ForgotPassword() {
  const history = useHistory();
  const { t } = AppProvider.useContainer();
  const [errMsg, setErrMsg] = useState('');
  const [submit, submitting] = useState(false);
  const [showEmailMsg, setEmailMsg] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });
  const [passwordExpiredModal, setPasswordExpiredModal] = useState(
    history?.location?.state === 'resetPasswordExpired' ||
      history?.location?.state === 'createPasswordExpired'
  );

  const onSubmit = (data: { email: string }) => {
    setErrMsg('');
    submitting(true);
    const { email } = data;
    apiServer
      .get(forgotPasswordUrl(email))
      .then(({ data }) => {
        if (data) {
          submitting(false);
          setEmailMsg(true);
        }
      })
      .catch((err) => {
        submitting(false);
        console.error(err.message);
        if (err?.response?.data?.code === 1002) {
          setErrMsg(t('Error.user_not_registered'));
          return;
        }
        setErrMsg(t('Error.server_down_error'));
      });
  };

  return (
    <LoginLayout>
      <div className='flex flex-col pb-5 text-center bg-white md:px-14 md:py-10 lg:px-24'>
        <h1 className='mt-8 text-2xl font-medium 2xl:mt-2 text-blue-dark 2xl:text-3xl'>
          {t('Forgot_password.heading')}
        </h1>
        {!showEmailMsg && (
          <form
            className='min-w-full mt-10 mb-32 space-y-4 md:mt-20'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label htmlFor='email' className='formLabel'>
                {t('Forgot_password.email_address')}
              </label>
              <input
                className='-mb-2 formInput'
                autoComplete='email'
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
              <p className='mt-3 errorMessage'>{errors.email.message}</p>
            )}

            <p className='text-xs text-right'>
              <Link
                to={loginStaff}
                className='font-light underline text-blue-lighter'
              >
                {t('Forgot_password.trouble_logging_in_link')}
              </Link>
            </p>

            {submit ? (
              <div className='p-0 py-1.5 2xl:py-2 w-full text-white bg-blue border rounded-md'>
                <ClipLoader />
              </div>
            ) : (
              <input
                className='w-full py-3 text-white border rounded-md cursor-pointer text-bold 2xl:py-4 bg-blue active:scale-95 md:text-base'
                type='submit'
                value={t('Forgot_password.password_reset')}
              />
            )}

            {errMsg && (
              <p className='mt-1 text-center errorMessage'>{errMsg}</p>
            )}
          </form>
        )}
        {showEmailMsg && (
          <div className='w-9/12 mx-auto my-20 text-xs font-light text-black 2xl:w-7/12 md:my-32 md:text-base'>
            <p className='w-full'>{t('Forgot_password_email_sent.message')}</p>
          </div>
        )}
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
      <Modal
        closeOnEsc={false}
        closeMaskOnClick={false}
        isVisible={passwordExpiredModal}
        setVisible={setPasswordExpiredModal}
        modalContent={
          <PasswordExpiredModal
            t={t}
            history={history}
            setPasswordExpiredModal={setPasswordExpiredModal}
            heading={
              history?.location?.state === 'resetPasswordExpired'
                ? t('login_old_reset_link-h1')
                : t('login_old_reset_link-h2')
            }
            subText={
              history?.location?.state === 'resetPasswordExpired'
                ? t('login_old_reset_link-b1')
                : t('login_old_reset_link-b1a')
            }
          />
        }
      />
    </LoginLayout>
  );
}
