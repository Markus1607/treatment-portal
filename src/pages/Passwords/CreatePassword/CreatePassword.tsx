import apiServer from 'server/apiServer';
import { useForm } from 'react-hook-form';
import { AppProvider } from 'AppProvider';
import { ClipLoader } from 'components/Loader';
import { hash } from '~/pages/Login/api/utils';
import ShowIcon from 'assets/images/ic_show.svg';
import HideIcon from 'assets/images/ic_hide.svg';
import { useHistory, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { loginStaff, staffPasswordUrl, forgotPassword } from 'routes';
import LoginLayout from 'components/Layouts/LoginLayout/LoginLayout';

export default function CreatePassword() {
  const history = useHistory();
  const { search } = useLocation();
  const [errMsg, setErrMsg] = useState('');
  const { t } = AppProvider.useContainer();
  const [submit, setSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRedirectMsg, setRedirectMsg] = useState(false);
  const [createToken, setCreateToken] = useState<string | null>(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const redirect = useCallback(() => {
    history.push(loginStaff);
  }, [history]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const urlParams = new URLSearchParams(search);
      const token = urlParams.get('token');
      setCreateToken(token);
    }
    return () => {
      mounted = false;
    };
  }, [search]);

  useEffect(() => {
    showRedirectMsg && setTimeout(() => redirect(), 3000);
  }, [showRedirectMsg, redirect]);

  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (createToken) {
      setErrMsg('');
      setSubmit(true);
      const { confirmPassword } = data;
      const hashedPassword = await hash(confirmPassword);
      apiServer
        .post(`${staffPasswordUrl}`, {
          reset_token: createToken,
          password_hash: hashedPassword,
        })
        .then(({ data }) => {
          setSubmit(false);
          if (data) setRedirectMsg(true);
        })
        .catch((err) => {
          setSubmit(false);
          if (
            err?.response?.data?.code === 2010 ||
            err?.response?.data?.code === 2006
          ) {
            history.push(forgotPassword, 'createPasswordExpired');
          }
          console.error(err.response.data.error);
          setErrMsg(t('Error.server_down_error'));
        });
    } else {
      setErrMsg(t('Error.no_create_token_provided'));
    }
  };

  return (
    <LoginLayout>
      <div className='flex flex-col pb-5 text-center bg-white md:px-14 md:py-10 lg:px-20 xl:px-24'>
        <h1 className='mt-8 text-2xl font-medium whitespace-pre-line 2xl:mt-2 text-blue-dark 2xl:text-3xl'>
          {t('Create_password.heading')}
        </h1>

        {!showRedirectMsg && (
          <form
            className='min-w-full mt-10 mb-14 space-y-5 md:mt-10'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='relative'>
              <label htmlFor='password' className='formLabel'>
                {t('Reset_password.create_password_heading')}
              </label>
              <input
                className='formInput'
                type={showPassword ? 'text' : 'password'}
                placeholder={t('Reset_password.password_input')}
                {...register('newPassword', {
                  required: true,
                  minLength: {
                    value: 6,
                    message: t('Reset_password.error_message'),
                  },
                })}
              />
              <button
                type='button'
                className='safari-password-reveal 3xl:w-4.5 3xl:h-4.5 absolute inset-y-10 2xl:inset-y-12 right-4 w-4 h-4'
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  alt='show-hide-icon'
                  src={showPassword ? HideIcon : ShowIcon}
                />
              </button>
            </div>

            {errors.newPassword && (
              <p className='errorMessage !mt-2'>{errors.newPassword.message}</p>
            )}

            {/* password input box */}
            <div className='relative'>
              <label htmlFor='confirmPassword' className='formLabel'>
                {t('Reset_password.confirm_password')}
              </label>
              <input
                className='formInput'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('Reset_password.confirm_password_input')}
                {...register('confirmPassword', {
                  required: true,
                  validate: (value) =>
                    value === watch('newPassword') ||
                    t('Reset_password.error_message2'),
                })}
              />
              <button
                type='button'
                className='safari-password-reveal 3xl:w-4.5 3xl:h-4.5 absolute inset-y-10 2xl:inset-y-12 right-4 w-4 h-4'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img
                  alt='show-hide-icon'
                  src={showConfirmPassword ? HideIcon : ShowIcon}
                />
              </button>
            </div>

            {/* error message */}
            {errors.confirmPassword && (
              <p className='!mt-1 errorMessage'>
                {errors.confirmPassword.message}
              </p>
            )}

            {submit ? (
              <div className='p-0 py-1.5 2xl:py-2 w-full text-white bg-blue border rounded-md'>
                <ClipLoader />
              </div>
            ) : (
              <input
                type='submit'
                value={t('Create_password.button_text')}
                className='text-bold !mt-5 py-3 2xl:py-4 w-full text-white bg-blue border rounded-md cursor-pointer active:scale-95 md:text-base'
              />
            )}

            {errMsg && (
              <p className='mt-1 text-center errorMessage'>{errMsg}</p>
            )}
          </form>
        )}

        {showRedirectMsg && (
          <div className='min-w-full my-16'>
            <div className='w-9/12 mx-auto mt-0 mb-10 text-xs font-light text-black 2xl:w-7/12 md:mb-24 md:mt-2 md:text-base'>
              <p className='w-full whitespace-pre-line'>
                {t('Password_create_confirm.message')}
              </p>
            </div>
            <input
              type='button'
              value={t('Password_reset_confirm.button_text')}
              onClick={() => redirect()}
              className='w-full py-3 text-sm text-white border cursor-pointer text-bold 2xl:py-4 bg-blue rounded-md active:scale-95 md:text-base'
            />
          </div>
        )}

        <div className='p-0 mt-4 text-xs font-light text-gray'>
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
    </LoginLayout>
  );
}
