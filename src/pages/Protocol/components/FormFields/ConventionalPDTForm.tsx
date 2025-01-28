import { TFunction } from 'react-i18next';
import Select from 'components/Forms/Select';
import { ClipLoader } from 'components/Loader';
import { NumberInput, TextInput } from 'components/Forms/Inputs';
import { Control, UseFormRegister, FieldErrorsImpl } from 'react-hook-form';
import TextArea from 'components/Forms/TextArea';
import { ToggleRadio } from 'components/Forms/Radios';
import {
  emollient,
  prodrug,
  yesNoBool,
  conventionalLamps,
} from 'utils/options';
import { conventionalDPDTDefaultValuesType } from 'pages/Protocol/api/api';

type ProtocolFormFieldsType = {
  children: JSX.Element;
  isDisabled?: boolean;
  isDataLoading?: boolean;
  t: TFunction<'translation', undefined>;
  control: Control<conventionalDPDTDefaultValuesType, any>;
  register: UseFormRegister<conventionalDPDTDefaultValuesType>;
  errors: Partial<FieldErrorsImpl<conventionalDPDTDefaultValuesType>>;
};

export default function ConventionalPDTFormFields({
  t,
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
            {t('treatment-protocol-for-conventional-pdt-title')}
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
        placeholder={t('enter-protocol-name')}
        register={{ ...register('protocolDescription', { required: true }) }}
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
        errors={errors}
        options={conventionalLamps()}
        width='w-full'
        control={control}
        name='lampType'
        label={t('select-the-cpdt-lamp-ques')}
        rules={{ required: t('Error.required.field') }}
        horizontalOptionClass='grid grid-cols-2 mt-2 gap-4 3xl:max-w-[30.5rem]'
      />

      <ToggleRadio
        errors={errors}
        options={prodrug()}
        width='w-full'
        control={control}
        name='prodrug'
        label={t('prodrug-applied_ques')}
        rules={{ required: t('Error.required.field') }}
        horizontalOptionClass='grid grid-cols-2 mt-2 gap-4 3xl:max-w-[30.5rem]'
      />

      <NumberInput
        errors={errors}
        control={control}
        name='prodrugDuration'
        rules={{
          required: t('Error.required.field'),
          min: {
            value: '1',
            message: t('Error.protocol.value1orabove'),
          },
        }}
        placeholder={t('Placeholder.numeric.value')}
        label={getLabel(t('prodrug-incubation-ques'), t('unit.minutes'))}
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

      <ToggleRadio
        width='w-28'
        errors={errors}
        control={control}
        options={yesNoBool()}
        name='photodynamicDiagnosis'
        label={t('photodynamic-diagnosis-ques')}
        rules={{ required: t('Error.required.field') }}
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
          t('pdt-lamp-radiation-dose-red-led-ques'),
          t('unit.ppix')
        )}
      />

      {children}
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
