import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTitle } from 'utils/hooks';
import { TextInput, CredentialsInput } from 'components/Forms/Inputs';
import { TickButton, DiscardButton } from 'components/Forms/Buttons';
import { StaffData, defaultValues, formatStaffPostData } from './api/format';
import { useQueryClient } from 'react-query';
import { AppProvider } from 'AppProvider';
import { useHistory } from 'react-router-dom';
import { usePostStaff } from './api/query';
import { ClipLoader } from 'components/Loader';
import { Success } from 'components/Flags/Flags';
import { ReactComponent as InfoIcon } from 'assets/images/ic_info_orange.svg';

export default function RegisterStaff() {
  const history = useHistory();
  const registerStaff = usePostStaff();
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const [isStaffLimitErr, setIsStaffLimitErr] = useState(false);
  const { t, cookies } = AppProvider.useContainer();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useTitle(t('Dashboard.Staff') + ' > ' + t('Staff.Register'));

  const onSubmit = (data: StaffData) => {
    setErrMsg('');
    setIsStaffLimitErr(false);
    registerStaff.mutate(
      {
        token: cookies.user.token,
        data: formatStaffPostData(data),
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            reset(defaultValues);
            queryClient.invalidateQueries('staffData');
          }
        },
        onError: ({ response }) => {
          if (response?.data) {
            if (response?.data.code === 1601) {
              setErrMsg(t('Error.Email_already_in_use'));
            }
            if (response?.data.code === 1704) {
              setIsStaffLimitErr(true);
              setErrMsg(t('maximum_members.admin'));
            }
          } else {
            setErrMsg(t('Error.registering.team.member'));
          }
        },
      }
    );
  };

  return (
    <div className='childrenContainer'>
      <div className='xl:w-[50%] container p-4 3xl:w-2/5 w-full'>
        <div className='px-3 py-4 text-sm font-medium text-left bg-white containerShadow'>
          <h1 className='mb-5 text-base text-black 2xl:text-lg'>
            {t('Admin.register_team_member')}
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col space-y-5'
          >
            <TextInput
              errors={errors as Record<string, any>}
              name='forename'
              label={t('Admin.question.72')}
              placeholder={t('Admin.input_placeholder')}
              validations={{
                ...register('forename', {
                  required: t('Error.required.field'),
                }),
              }}
            />

            <TextInput
              errors={errors as Record<string, any>}
              name='surname'
              label={t('Admin.question.74')}
              placeholder={t('Admin.input_placeholder.86')}
              validations={{
                ...register('surname', { required: t('Error.required.field') }),
              }}
            />

            <CredentialsInput
              errors={errors as Record<string, any>}
              name='email'
              type='email'
              label={t('Admin.question')}
              placeholder={t('Admin.input_placeholder.11')}
              validations={{
                ...register('email', {
                  required: t('Error.required.field'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('Error.invalid.email'),
                  },
                }),
              }}
            />

            {errMsg && !isStaffLimitErr && (
              <p className='mx-auto text-sm errorMessage'>{errMsg}</p>
            )}

            {errMsg && isStaffLimitErr && (
              <div className='flex w-full p-3 m-2 mx-auto text-sm font-normal bg-orange-lighter rounded-md'>
                <InfoIcon className='w-6 h-6 mr-2' />
                <p>
                  {errMsg}{' '}
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline text-blue-lighter'
                    href='https://store.smartpdt.com/product/staff-accounts-package/'
                  >
                    {t('here')}
                  </a>
                </p>
              </div>
            )}

            <Success
              containerClass='mx-auto'
              state={registerStaff.isSuccess}
              value={t('Success.staff.registered')}
            />

            <div className='flex justify-between'>
              <DiscardButton
                text={t('Button_go_back')}
                alt={t('Button_go_back')}
                onClick={() => history.goBack()}
              />
              {!errMsg && registerStaff.isLoading && (
                <ClipLoader color='#1e477f' size={0.95} />
              )}
              <TickButton
                text={t('Admin.register_team_member')}
                className='ml-auto mr-0'
                alt='submit'
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
