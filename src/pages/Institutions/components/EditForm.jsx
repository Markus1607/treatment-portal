import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { TextInput } from 'components/Forms/Inputs';
import { DiscardButton, SaveButton } from 'components/Forms/Buttons';
import { ClipLoader } from 'components/Loader';
import { Success } from 'components/Flags/Flags';
import { AppProvider } from 'AppProvider';
import { useQueryClient } from 'react-query';
import { useUpdateInstitution } from '../api/query';
import { defaultValues, formatUpdateInstitution } from '../api/format';

export default function EditForm({ setIsEditing, selectedInstitution }) {
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const updateInstitution = useUpdateInstitution();
  const { t, cookies } = AppProvider.useContainer();
  const { register, reset, handleSubmit } = useForm({ defaultValues });

  const handleUpdateInstitution = (data) => {
    setErrMsg('');
    updateInstitution.mutate(
      {
        token: cookies.user.token,
        data: data,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries('institutionsData');
          }
        },
        onError: (response) => {
          console.error(response);
          setErrMsg(t('Error.updating.institution'));
        },
      }
    );
  };

  useEffect(() => {
    reset({
      id: selectedInstitution.id,
      instName: selectedInstitution?.name || '',
      postCode: selectedInstitution?.postCode || '',
    });
  }, [reset, selectedInstitution]);

  const onSubmit = (data) => {
    setErrMsg('');
    handleUpdateInstitution(formatUpdateInstitution(data));
  };

  return (
    <div className='px-3 py-4 text-sm font-medium text-left bg-white containerShadow'>
      <h1 className='mb-5 text-base 2xl:text-lg'>
        {t('Institutions_–_edit.card_title')}
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

        <div className='flex items-center justify-between'>
          <DiscardButton
            text='Back'
            alt='Back'
            onClick={() => setIsEditing(false)}
          />
          {errMsg && (
            <p className='text-sm font-light errorMessage'>{errMsg}</p>
          )}

          {!errMsg && updateInstitution.isLoading && (
            <ClipLoader color='#1e477f' size={1} />
          )}

          <div className='btn-with-flag'>
            <Success
              state={updateInstitution.isSuccess}
              value={t('Institutions.saved')}
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
  );
}
