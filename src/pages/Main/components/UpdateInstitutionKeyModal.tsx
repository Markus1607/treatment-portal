import apiServer from 'server/apiServer';
import { staffInstitution } from '~/routes';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AppProvider } from '~/AppProvider';
import toast from 'react-hot-toast';

type FormInput = {
  instPrefix: string;
};

export default function UpdateInstitutionKeyModal({
  token,
  setUpdateInstKeyModal,
}: {
  token: string;
  setUpdateInstKeyModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();
  const { t } = AppProvider.useContainer();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    if (data) {
      apiServer
        .post(
          staffInstitution,
          {
            key: data.instPrefix,
          },
          {
            headers: {
              'x-access-tokens': token,
            },
          }
        )
        .then(() => {
          setUpdateInstKeyModal(false);
        })
        .catch((err) => {
          alert(err.response.error.message);
          toast.error(t('Error_submit a unique_key'));
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col max-w-lg gap-3 p-4 text-left'
    >
      <p>{t('set_institution_key')}</p>
      <div className='flex items-center gap-2'>
        <input
          className='px-2 py-1 border rounded-sm border-blue-dark'
          placeholder=' e.g GHS'
          {...register('instPrefix', {
            required: t('Error.required.field'),
            minLength: {
              value: 2,
              message: t('Error_min_two_characters'),
            },
            maxLength: {
              value: 4,
              message: t('Error_max_characters_4'),
            },
          })}
        />
      </div>
      {errors?.instPrefix && (
        <p className='text-sm text-red-400'>{errors.instPrefix.message}</p>
      )}
      <input
        type='submit'
        value='Save'
        className='text-left bg-blue-dark text-white px-4 py-0.5 rounded-sm cursor-pointer mr-auto'
      />
    </form>
  );
}
