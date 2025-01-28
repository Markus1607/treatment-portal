import { TFunction } from 'react-i18next';
import Select from 'components/Forms/Select';
import { ClipLoader } from 'components/Loader';
import { NumberInput, TextInput } from 'components/Forms/Inputs';
import {
  Control,
  UseFormWatch,
  UseFormRegister,
  FieldErrorsImpl,
} from 'react-hook-form';
import TextArea from 'components/Forms/TextArea';
import { ToggleRadio } from 'components/Forms/Radios';
import { prodrug, emollient, yesNoBool, artificialLamps } from 'utils/options';
import { artificialDPDTDefaultValuesType } from 'pages/Protocol/api/api';

type ProtocolFormFieldsType = {
  children: JSX.Element;
  isDisabled?: boolean;
  isDataLoading?: boolean;
  t: TFunction<'translation', undefined>;
  watch: UseFormWatch<artificialDPDTDefaultValuesType>;
  control: Control<artificialDPDTDefaultValuesType, any>;
  register: UseFormRegister<artificialDPDTDefaultValuesType>;
  errors: Partial<FieldErrorsImpl<artificialDPDTDefaultValuesType>>;
};

export default function ArtificialPDTFormFields({
  t,
  watch,
  errors,
  control,
  register,
  children,
  isDisabled,
  isDataLoading,
}: ProtocolFormFieldsType) {
  return (
    <div
      className={`containerShadow mb-16 p-4 text-black bg-white space-y-6
      ${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'}`}
    >
      <header className='!mb-4 whitespace-pre-line'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-base font-medium 2xl:text-lg'>
            {t('treatment-protocol-for-artificial-pdt-title')}
          </h1>

          {isDataLoading && (
            <div className='-mt-2'>
              <ClipLoader color='#1e477f' size={0.65} />
            </div>
          )}
        </div>
      </header>

      <TextInput
        name='protocolName'
        label={t('protocol-name-label')}
        placeholder={t('enter-protocol-name')}
        validations={{ ...register('protocolName', { required: true }) }}
      />

      <TextArea
        height='5em'
        errors={errors}
        name='protocolDescription'
        labelStyle='font-normal'
        label={t('protocol-description')}
        placeholder={t('enter-protocol-description-placeholder')}
        register={{ ...register('protocolDescription') }}
      />

      <ToggleRadio
        errors={errors}
        options={yesNoBool()}
        width='w-28'
        control={control}
        name='alcohol'
        label={t('Protocol.Alcohol_application')}
        rules={{ required: t('Error.required.field') }}
      />

      <ToggleRadio
        errors={errors}
        options={yesNoBool()}
        width='w-28'
        control={control}
        name='microNeeding'
        label={t('micro-needing-ques')}
        rules={{ required: t('Error.required.field') }}
      />

      <ToggleRadio
        errors={errors}
        options={yesNoBool()}
        width='w-28'
        control={control}
        name='fractionalLaser'
        label={t('fractional-laser-ques')}
        rules={{ required: t('Error.required.field') }}
      />

      <ToggleRadio
        errors={errors}
        options={yesNoBool()}
        width='w-28'
        control={control}
        name='scrapingLesions'
        label={t('scraping-lesions-ques')}
        rules={{ required: t('Error.required.field') }}
      />

      <ToggleRadio
        name='lampType'
        errors={errors}
        width='w-[15rem]'
        control={control}
        options={artificialLamps()}
        label={t('select-the-adl-pdt-lamp-ques')}
        rules={{ required: t('Error.required.field') }}
      />

      <ToggleRadio
        errors={errors}
        options={prodrug()}
        width='ww-full'
        control={control}
        name='prodrug'
        label={t('prodrug-applied_ques')}
        rules={{ required: t('Error.required.field') }}
        horizontalOptionClass='grid grid-cols-2 mt-2 gap-4 3xl:max-w-[30.5rem]'
      />

      <Select
        errors={errors}
        control={control}
        name='emollient'
        options={emollient()}
        placeholder={t('Protocol.Please_select')}
        rules={{ required: t('Error.required.field') }}
        label={t('Protocol.Emollient_application')}
      />

      <NumberInput
        errors={errors}
        control={control}
        name='minDrugLight'
        placeholder={t('Placeholder.numeric.value')}
        rules={{ required: t('Error.required.field') }}
        label={getLabel(t('Protocol.Minimum_DLI'), t('unit.minutes'))}
      />

      <NumberInput
        errors={errors}
        control={control}
        name='maxDrugLight'
        placeholder={t('Placeholder.numeric.value')}
        rules={{
          required: t('Error.required.field'),
          validate: (value) =>
            Number(value) >= Number(watch('minDrugLight'))
              ? true
              : t('Error.protocol.value_greater_minDLI'),
        }}
        label={getLabel(t('Protocol.Maximum_DLI'), t('unit.minutes'))}
      />

      <NumberInput
        errors={errors}
        control={control}
        name='ppixDose'
        placeholder={t('Placeholder.numeric.value')}
        rules={{
          required: t('Error.required.field'),
          min: {
            value: '3',
            message: t('Error.protocol.value3orabove'),
          },
          max: {
            value: '100',
            message: t('Error.protocol.value100orbelow'),
          },
        }}
        label={getLabel(
          t('ppix-effective-light-radiation-dose-label'),
          t('unit.ppix')
        )}
      />
      <div className='pointer-events-auto'>{children}</div>
    </div>
  );
}

const getLabel = (title: string, unit: string) => {
  return (
    <p className='flex items-center text-left gap-1'>
      <span>{title}</span> <span className='font-light'>{unit}</span>
    </p>
  );
};
