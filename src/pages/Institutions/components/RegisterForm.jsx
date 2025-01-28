import { useForm } from 'react-hook-form';
import { TextInput } from 'components/Forms/Inputs';
import { ClipLoader } from 'components/Loader';
import { TickButton } from 'components/Forms/Buttons';
import { Success } from 'components/Flags/Flags';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { usePostInstitution } from '../api/query';
import { AppProvider } from 'AppProvider';
import { defaultValues, formatPostInstitution } from '../api/format';

export default function RegisterForm() {
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const postInstitution = usePostInstitution();
  const { t, cookies } = AppProvider.useContainer();
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  const handleRegisterInstitution = (data) => {
    setErrMsg('');
    postInstitution.mutate(
      {
        token: cookies.user.token,
        data,
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            reset(defaultValues);
            queryClient.invalidateQueries('institutionsData');
          }
        },

        onError: (response) => {
          console.error(response);
          setErrMsg(t('Error.registering.institution'));
        },
      }
    );
  };

  const onSubmit = (data) => {
    formatPostInstitution(data)
      .then((res) => handleRegisterInstitution(res))
      .catch(() => setErrMsg(t('Error.invalid.postcode')));
  };

  return (
    <div className='px-3 py-4 text-sm font-medium text-left bg-white containerShadow'>
      <h1 className='mb-5 text-base 2xl:text-lg'>
        {t('Institution_registered.card_title')}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col space-y-5'
      >
        <TextInput
          name='instName'
          label={t('Institutions_–_edit.question')}
          placeholder={t('Institutions_–_edit.placeholder')}
          validations={{ ...register('instName', { required: true }) }}
        />

        <TextInput
          name='postCode'
          label={t('Institutions.question')}
          placeholder={t('Institutions.palceholder')}
          validations={{ ...register('postCode', { required: true }) }}
        />
        <div className='flex items-center justify-end'>
          {errMsg && (
            <p className='mr-4 text-sm font-light errorMessage'>{errMsg}</p>
          )}

          {!errMsg && postInstitution.isLoading && (
            <ClipLoader color='#1e477f' size={1} />
          )}
          <div className='btn-with-flag'>
            <Success
              state={postInstitution.isSuccess}
              value={t('Institutions.saved')}
            />
            <TickButton
              text={t('Institution_registered.card_title')}
              className='ml-auto mr-0'
              alt={t('Institution_registered.card_title')}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
