import { useForm } from 'react-hook-form';
import { AppProvider } from 'AppProvider';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUpdateStaff } from './api/query';
import { formatStaffPutData } from './api/format';
import { useQueryClient } from 'react-query';
import { Success } from 'components/Flags/Flags';
import { TextInput, CredentialsInput } from 'components/Forms/Inputs';
import { SaveButton, DiscardButton } from 'components/Forms/Buttons';
import { ClipLoader } from 'components/Loader';
import { updateCookieData } from 'pages/Login/api/utils';
import toast from 'react-hot-toast';
import { useTitle } from 'utils/hooks';
import { StaffData, defaultValues } from '../RegisterStaff/api/format';

export default function EditStaff() {
  const history = useHistory<{
    uid: string;
    forename: string;
    surname: string;
    email: string;
  }>();
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const { t, cookies, setCookies } = AppProvider.useContainer();
  const updateStaff = useUpdateStaff(history.location.state?.uid);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useTitle(t('Dashboard.Staff') + ' > ' + t('Staff.Edit'));

  useEffect(() => {
    // * This is to sync logged in user's edit details when app container gets updated via setCookies
    if (cookies.user.id === history.location.state?.uid) {
      reset({
        forename: cookies.user.firstName,
        surname: cookies.user.lastName,
        email: cookies.user.email,
      });
    } else {
      reset({
        forename: history.location.state?.forename,
        surname: history.location.state?.surname,
        email: history.location.state?.email,
      });
    }
  }, [history.location.state, reset, cookies]);

  const onSubmit = (data: StaffData) => {
    setErrMsg('');
    updateStaff.mutate(
      {
        token: cookies.user.token,
        data: formatStaffPutData(data),
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            if (cookies.user.id === response?.data?.staff_member?.uid) {
              setCookies(
                'user',
                updateCookieData(cookies.user, response.data.staff_member),
                { path: '/' }
              );
              toast.success(t('Success.staff.saved'));
            }
            queryClient.invalidateQueries('staffData');
          }
        },
        onError: (response) => {
          console.error(response);
          setErrMsg(t('Error.updating.staff.details'));
        },
      }
    );
  };

  return (
    <div className='childrenContainer'>
      <div className='xl:w-[50%] container p-4 2xl:w-2/5 w-full'>
        <div className='px-3 py-4 text-sm font-medium text-left bg-white containerShadow'>
          <h1 className='mb-5 text-base text-black 2xl:text-lg'>
            {t('Admin_-_Edit_staff.card_title')}
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col space-y-5'
          >
            <TextInput
              name='forename'
              label={t('Admin.question.72')}
              placeholder={t('Admin.input_placeholder')}
              validations={{
                ...register('forename', {
                  required: t('Error.required.field'),
                }),
              }}
              errors={errors as Record<string, any>}
            />

            <TextInput
              name='surname'
              label={t('Admin.question.74')}
              placeholder={t('Admin.input_placeholder.86')}
              validations={{
                ...register('surname', { required: t('Error.required.field') }),
              }}
              errors={errors as Record<string, any>}
            />

            <CredentialsInput
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
              errors={errors as Record<string, any>}
            />

            <div className='flex items-center justify-between'>
              <DiscardButton
                text={t('Button_go_back')}
                alt={t('Button_go_back')}
                onClick={() => history.goBack()}
              />

              {errMsg && <p className='text-sm errorMessage'>{errMsg}</p>}

              {!errMsg && updateStaff.isLoading && (
                <ClipLoader color='#1e477f' size={0.95} />
              )}

              <div className='btn-with-flag'>
                <Success
                  state={updateStaff.isSuccess}
                  value={t('Success.staff.saved')}
                />
                <SaveButton
                  text={t('Button_save_changes')}
                  className=''
                  alt={t('Button_save_changes')}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
