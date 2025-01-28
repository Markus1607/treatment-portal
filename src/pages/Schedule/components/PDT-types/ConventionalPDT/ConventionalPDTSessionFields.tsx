import { useEffect } from 'react';
import { TFunction } from 'react-i18next';
import Select from 'components/Forms/Select';
import { NumberInput } from 'components/Forms/Inputs';
import { ToggleRadio } from 'components/Forms/Radios';
import { conventionalLamps, prodrug, yesNoBool } from 'utils/options';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { defaultConventionalPDTValueType } from 'pages/Schedule/api/types/format';

type ConventionalSessionFieldsProps = {
  errors: Record<string, any>;
  setValue: UseFormSetValue<any>;
  t: TFunction<'translation', undefined>;
  watch: UseFormWatch<defaultConventionalPDTValueType>;
  control: Control<defaultConventionalPDTValueType, any>;
};

export default function ConventionalSessionFields({
  t,
  watch,
  errors,
  control,
  setValue,
}: ConventionalSessionFieldsProps) {
  const timeCalculated = Math.round(Number(watch('treatmentDose')) / 3);

  useEffect(() => {
    setValue('timeCalculated', timeCalculated);
  }, [timeCalculated, setValue]);

  return (
    <div className='space-y-6'>
      <Select
        isDisabled={true}
        errors={errors}
        name='protocolSelected'
        control={control}
        options={[
          {
            value: 1,
            label: t(
              'european-dermatologist-forum-guidelines-for-conventional-pdt'
            ),
          },
        ]}
        placeholder={t('Protocol.Please_select')}
        rules={{ required: t('Error.required.field') }}
        label={t('treatment-protocol-title')}
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

      <ToggleRadio
        errors={errors}
        width='w-28'
        control={control}
        name='microNeeding'
        options={yesNoBool()}
        label={t('micro-needing-ques')}
        rules={{ required: t('Error.required.field') }}
      />

      <ToggleRadio
        errors={errors}
        width='w-28'
        control={control}
        options={yesNoBool()}
        name='fractionalLaser'
        label={t('fractional-laser-ques')}
        rules={{ required: t('Error.required.field') }}
      />

      <ToggleRadio
        errors={errors}
        options={conventionalLamps()}
        width='w-[15rem]'
        control={control}
        name='lampType'
        label={t('select-the-lamp-used-for-treatment')}
        rules={{ required: t('Error.required.field') }}
        horizontalOptionClass='grid grid-cols-2 mt-2 gap-4 3xl:max-w-[30.5rem]'
      />

      <NumberInput
        width={15}
        errors={errors}
        control={control}
        name='treatmentDose'
        placeholder={t('Placeholder.numeric.value')}
        rules={{ required: t('Error.required.field') }}
        label={getLabel(t('enter-the-treatment-dose'), t('unit.ppix'))}
      />

      <NumberInput
        width={15}
        isDisabled
        errors={errors}
        control={control}
        name='timeCalculated'
        rules={{ required: false }}
        placeholder=''
        label={getLabel(t('exposure-time-calculated'), t('unit.minutes'))}
      />
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
