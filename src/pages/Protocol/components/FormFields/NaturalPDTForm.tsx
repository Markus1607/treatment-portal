import { SunscreenList } from '@types';
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
import SessionTypeRadio from 'components/Forms/SessionTypeRadio';
import { naturalDPDTDefaultValuesType } from 'pages/Protocol/api/api';
import {
  prodrug,
  yesNoBool,
  emollient,
  sunscreenRequired,
  diseasesTypes,
} from 'utils/options';
import { RadioToggle } from '~/pages/Schedule/components/RadioToggle';
import { Dispatch, SetStateAction } from 'react';
import { getLabelFromKey } from '~/utils/functions';

type ProtocolFormFieldsType = {
  children: JSX.Element;
  isDisabled?: boolean;
  isDataLoading?: boolean;
  sunscreenList: SunscreenList;
  selectedDiseaseUid: string;
  t: TFunction<'translation', undefined>;
  watch: UseFormWatch<naturalDPDTDefaultValuesType>;
  control: Control<naturalDPDTDefaultValuesType, any>;
  register: UseFormRegister<naturalDPDTDefaultValuesType>;
  errors: Partial<FieldErrorsImpl<naturalDPDTDefaultValuesType>>;
  setSelectedDiseaseUid: Dispatch<SetStateAction<string>>;
  isEditProtocolPage?: boolean;
};

export default function NaturalPDTFormFields({
  t,
  watch,
  errors,
  control,
  register,
  children,
  isDisabled,
  isDataLoading,
  sunscreenList,
  isEditProtocolPage,
  selectedDiseaseUid,
  setSelectedDiseaseUid,
}: ProtocolFormFieldsType) {
  return (
    <div
      className={`containerShadow mb-16 p-4 text-black bg-white space-y-6
      ${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'}`}
    >
      <header className='!mb-4 whitespace-pre-line'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-base font-medium 2xl:text-lg'>
            {t('natural_daylight_protocol_title')}
            {getLabelFromKey(selectedDiseaseUid, diseasesTypes())}
          </h1>

          {isDataLoading && (
            <div className='-mt-2'>
              <ClipLoader color='#1e477f' size={0.65} />
            </div>
          )}
        </div>
      </header>

      <RadioToggle
        name='diseaseTypeUid'
        options={diseasesTypes()}
        label={t('selected_diesease protocol')}
        selectedOptionType={selectedDiseaseUid}
        setSelectedOptionType={setSelectedDiseaseUid}
        allOptionsDisabled={isEditProtocolPage}
      />

      <TextInput
        errors={errors}
        name='protocolName'
        label={t('protocol-name')}
        placeholder={t('enter-protocol-name')}
        validations={{
          ...register('protocolName', { required: t('Error.required.field') }),
        }}
      />

      <TextArea
        height='5em'
        errors={errors}
        name='protocolDescription'
        labelStyle='font-normal'
        label={t('protocol-description')}
        placeholder={t('enter-protocol-description')}
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
        width='w-28'
        errors={errors}
        control={control}
        name='microNeeding'
        options={yesNoBool()}
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

      <SessionTypeRadio
        isSunscreenQues
        errors={errors}
        control={control}
        options={sunscreenRequired()}
        name='sunscreenRequired'
        label={t('sunscreen_required_ques')}
        rules={{ required: t('Error.required.field') }}
      />

      {watch('sunscreenRequired') === 'totally' && (
        <Select
          errors={errors}
          control={control}
          name='sunscreenType'
          options={sunscreenList}
          placeholder={t('Protocol.Please_select')}
          label={t('Protocol.Sunscreen_application')}
          rules={{ required: t('Error.required.field') }}
        />
      )}

      <ToggleRadio
        errors={errors}
        options={yesNoBool()}
        width='w-28'
        control={control}
        name='scrapingLesions'
        label={t('scraping-lesions-ques')}
        rules={{ required: t('Error.required.field') }}
      />

      <Select
        errors={errors}
        options={prodrug()}
        control={control}
        name='prodrug'
        placeholder={t('Protocol.Please_select')}
        label={t('prodrug-applied_ques')}
        rules={{ required: t('Error.required.field') }}
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
        name='minDuration'
        rules={{
          required: t('Error.required.field'),
          min: {
            value: '1',
            message: t('Error.protocol.value1orabove'),
          },
        }}
        placeholder={t('Placeholder.numeric.value')}
        label={getLabel(t('Protocol.Minimum_duration'), t('unit.minutes'))}
      />

      <NumberInput
        errors={errors}
        control={control}
        name='maxDuration'
        placeholder={t('Placeholder.numeric.value')}
        rules={{
          required: t('Error.required.field'),
          min: {
            value: '1',
            message: t('Error.protocol.value1orabove'),
          },
          validate: (value) =>
            Number(value) >= Number(watch('minDuration'))
              ? true
              : t('Error.protocol.value_greater_minDuration'),
        }}
        label={getLabel(t('Protocol.Maximum_duration'), t('unit.minutes'))}
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
        label={getLabel(t('ppix-dose-ques'), t('unit.ppix'))}
      />

      <NumberInput
        errors={errors}
        control={control}
        name='minTemp'
        placeholder={t('Placeholder.numeric.value')}
        rules={{
          required: t('Error.required.field'),
          min: '0',
        }}
        label={getLabel(t('Protocol.min.air.temperature'), t('unit.temp'))}
      />

      <NumberInput
        errors={errors}
        control={control}
        name='maxTemp'
        placeholder={t('Placeholder.numeric.value')}
        rules={{
          required: t('Error.required.field'),
          min: '0',
          validate: (value) =>
            Number(value) >= Number(watch('minTemp'))
              ? true
              : t('Error.protocol.value_greater_minTemp'),
        }}
        label={getLabel(t('Protocol.max.air.temperature'), t('unit.temp'))}
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
          validate: (value: string) =>
            Number(value) >= Number(watch('minDrugLight'))
              ? true
              : t('Error.protocol.value_greater_minDLI'),
        }}
        label={getLabel(t('Protocol.Maximum_DLI'), t('unit.minutes'))}
      />
      <NumberInput
        errors={errors}
        control={control}
        name='accIndoorTime'
        placeholder={t('Placeholder.numeric.value')}
        rules={{ required: t('Error.required.field') }}
        label={getLabel(
          t('Protocol.Accumulated_indoor_time_allowed'),
          t('unit.minutes')
        )}
      />

      <div className='pointer-events-auto'>{children}</div>
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
