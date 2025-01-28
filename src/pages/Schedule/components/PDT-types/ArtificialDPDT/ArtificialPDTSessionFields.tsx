import { NumberInput } from 'components/Forms/Inputs';
import { MultiSelectCheckInput } from 'components/Forms/MultiSelectCheckInput';
import { ToggleRadio } from 'components/Forms/Radios';
import Select from 'components/Forms/Select';
import { defaultArtificialDPDTValuesType } from 'pages/Schedule/api/types/format';
import { useEffect } from 'react';
import {
  Control,
  UseFormWatch,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { TFunction } from 'react-i18next';
import { artificialLamps, prodrug, yesNoBool } from 'utils/options';
import { calcGMETreatmentMinutes, lightColorType } from '../utils';

export type ArtificialPDTSessionFieldsProps = {
  errors: Record<string, any>;
  isCombinedSelected: boolean;
  setValue: UseFormSetValue<any>;
  t: TFunction<'translation', undefined>;
  watch: UseFormWatch<defaultArtificialDPDTValuesType>;
  control: Control<defaultArtificialDPDTValuesType, any>;
  getValues: UseFormGetValues<defaultArtificialDPDTValuesType>;
};

export default function ArtificialPDTSessionFields({
  t,
  errors,
  watch,
  control,
  setValue,
  getValues,
  isCombinedSelected,
}: ArtificialPDTSessionFieldsProps) {
  const treatmentDose = Number(watch('treatmentDose'));
  const lightColourValue = watch('lightColour').toString();
  const isProtocolLamp35mins = watch('lampProtocol') === '2';
  const lightIntensityValue = Number(watch('lightIntensity'));

  const calculatedTreatmentTime = calcGMETreatmentMinutes(
    lightColourValue as lightColorType,
    lightIntensityValue,
    treatmentDose
  );

  useEffect(() => {
    setValue('incubationTime', isProtocolLamp35mins ? 60 : 30);
    setValue('exposureTime', isProtocolLamp35mins ? 35 : 80);
    setValue('blueLightExposureTime', isProtocolLamp35mins ? 26 : 67);
    setValue('yellowLightExposureTime', isProtocolLamp35mins ? 6 : 9);
    setValue('redLightExposureTime', isProtocolLamp35mins ? 3 : 4);
  }, [isProtocolLamp35mins, setValue]);

  useEffect(() => {
    setValue('timeCalculated', calculatedTreatmentTime);
  }, [calculatedTreatmentTime, setValue]);

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
            label: isCombinedSelected
              ? t('european-dermatologist-forum-guidelines-for-combined-pdt')
              : t('european-dermatologist-forum-guidelines-for-artficial-pdt'),
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
        name='lampType'
        errors={errors}
        width='w-full'
        control={control}
        options={artificialLamps()}
        label={t('select-the-adl-pdt-lamp-ques')}
        rules={{ required: t('Error.required.field') }}
      />

      <ToggleRadio
        errors={errors}
        options={[
          {
            value: 1,
            label: t('manual'),
          },
          {
            value: 2,
            label: 'IDL PDT 35 MIN',
          },
          {
            value: 3,
            label: 'IDL PDT 80 MIN',
          },
        ]}
        width='w-full'
        control={control}
        name='lampProtocol'
        label={t('select-the-protocol-set-in-the-lamp')}
        rules={{ required: t('Error.required.field') }}
        horizontalOptionClass='grid grid-cols-2 mt-2 gap-4 3xl:max-w-[30.5rem]'
      />

      {watch('lampProtocol') === '1' && (
        <>
          <MultiSelectCheckInput
            setValue={setValue}
            name='lightColour'
            errors={errors}
            width='w-[10rem]'
            control={control}
            initialValues={getValues('lightColour')}
            options={[
              {
                value: 1,
                label: t('blue_text'),
              },
              {
                value: 2,
                label: t('yellow_text'),
              },
              {
                value: 3,
                label: t('option.red'),
              },
            ]}
            label={t('select-light-colour-ques')}
            rules={{ required: t('Error.required.field') }}
          />

          <ToggleRadio
            errors={errors}
            options={[
              {
                value: 0,
                label: t('level-1'),
              },
              {
                value: 1,
                label: t('level-2'),
              },
              {
                value: 2,
                label: t('level-3'),
              },
              {
                value: 3,
                label: t('level-4'),
              },
              {
                value: 4,
                label: t('level-5'),
              },
            ]}
            width='w-full'
            control={control}
            name='lightIntensity'
            label={t('select-light-intensity-level-eus')}
            rules={{ required: t('Error.required.field') }}
            horizontalOptionClass='grid grid-cols-3 mt-2 gap-4 3xl:max-w-[32rem]'
          />

          <ToggleRadio
            errors={errors}
            options={[
              {
                value: 1,
                label: t('continuous-wave'),
              },
              {
                value: 2,
                label: t('pulsed-mode'),
              },
            ]}
            width='w-[15rem]'
            control={control}
            name='treatmentMode'
            label={t('select-the-treatment-mode')}
            rules={{ required: t('Error.required.field') }}
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
            label={getLabel(t('treatment-time-calculated'), t('unit.minutes'))}
          />
        </>
      )}

      {watch('lampProtocol') >= '2' && (
        <>
          <NumberInput
            width={15}
            isDisabled
            errors={errors}
            control={control}
            name='incubationTime'
            rules={{ required: false }}
            placeholder=''
            label={getLabel(t('incubation-time-ques'), t('unit.minutes'))}
          />

          <NumberInput
            width={15}
            isDisabled
            errors={errors}
            control={control}
            name='exposureTime'
            rules={{ required: false }}
            placeholder=''
            label={getLabel(t('exposure-time-ques'), t('unit.minutes'))}
          />

          <NumberInput
            width={15}
            isDisabled
            errors={errors}
            control={control}
            name='blueLightExposureTime'
            rules={{ required: false }}
            placeholder=''
            label={getLabel(
              t('blue-light-exposure-time-ques'),
              t('unit.minutes')
            )}
          />

          <NumberInput
            width={15}
            isDisabled
            errors={errors}
            control={control}
            rules={{ required: false }}
            name='yellowLightExposureTime'
            placeholder=''
            label={getLabel(t('yellow-light-exposure-ques'), t('unit.minutes'))}
          />

          <NumberInput
            width={15}
            isDisabled
            errors={errors}
            control={control}
            name='redLightExposureTime'
            rules={{ required: false }}
            placeholder=''
            label={getLabel(
              t('red-light-exposure-time-ques'),
              t('unit.minutes')
            )}
          />
        </>
      )}
    </div>
  );
}

const getLabel = (title: string, unit: string) => {
  return (
    <p className='flex items-center gap-1 text-left'>
      <span>{title}</span> <span className='font-light'>{unit}</span>
    </p>
  );
};
