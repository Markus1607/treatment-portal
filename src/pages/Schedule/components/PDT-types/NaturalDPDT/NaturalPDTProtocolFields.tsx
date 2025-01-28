import { useState } from 'react';
import { TFunction } from 'react-i18next';
import Select from 'components/Forms/Select';
import { ClipLoader } from 'components/Loader';
import { emollient, yesNoBool } from 'utils/options';
import { NumberInput } from 'components/Forms/Inputs';
import { Control, UseFormWatch } from 'react-hook-form';
import { ReactComponent as DropIcon } from 'assets/images/ic_dropdown.svg';
import { NaturalPDTFields as Fields } from 'pages/Schedule/api/types/enums.d';
import { defaultNaturalDPDTValuesType } from 'pages/Schedule/api/types/format';

const getLabel = (title: string, unit: string) => {
  return (
    <p className='flex items-center text-left gap-1'>
      <span>{title}</span> <span className='font-light'>{unit}</span>
    </p>
  );
};

type ProtocolFormFieldsType = {
  isDataLoading?: boolean;
  errors: Record<string, any>;
  isPortalOnlySession?: boolean;
  t: TFunction<'translation', undefined>;
  watch: UseFormWatch<defaultNaturalDPDTValuesType>;
  control: Control<defaultNaturalDPDTValuesType, any>;
};

export default function NaturalPDTProtocolFields({
  t,
  watch,
  errors,
  control,
  isDataLoading,
  isPortalOnlySession,
}: ProtocolFormFieldsType) {
  const isEditable = false;
  const { protocolDetails } = Fields;
  const [isProtocolVisible, setIsProtocolVisible] = useState(false);

  return (
    <section className='p-4 pb-0 font-bold bg-white border containerShadow shadow-sm'>
      <details
        open={isProtocolVisible}
        onToggle={() =>
          setIsProtocolVisible((isProtocolVisible) => !isProtocolVisible)
        }
      >
        <summary className='flex items-center justify-between mb-4 font-bold text-left list-none cursor-pointer 2xl:text-lg'>
          <span> {t('Protocol.card_title')}</span>

          {isDataLoading && (
            <div className='self-end -mt-2'>
              <ClipLoader color='#1e477f' size={0.65} />
            </div>
          )}

          {!isDataLoading && (
            <span className='text-black/70'>
              {isProtocolVisible ? (
                <DropIcon className='transform rotate-180 scale-75' />
              ) : (
                <DropIcon className='scale-75' />
              )}
            </span>
          )}
        </summary>

        <div className='mb-8 text-sm text-black bg-white pointer-events-none space-y-6'>
          <NumberInput
            errors={errors}
            control={control}
            name={protocolDetails.minDuration}
            rules={{
              required: t('Error.required.field'),
              min: {
                value: '1',
                message: t('Error.protocol.value1orabove'),
              },
            }}
            isDisabled={!isEditable}
            placeholder={t('Placeholder.numeric.value')}
            label={getLabel(t('Protocol.Minimum_duration'), t('unit.minutes'))}
          />

          <NumberInput
            errors={errors}
            control={control}
            isDisabled={!isEditable}
            name={protocolDetails.maxDuration}
            placeholder={t('Placeholder.numeric.value')}
            rules={{
              required: t('Error.required.field'),
              min: {
                value: '1',
                message: t('Error.protocol.value1orabove'),
              },
              validate: (value) =>
                Number(value) >= Number(watch(protocolDetails.minDuration))
                  ? true
                  : t('Error.protocol.value_greater_minDuration'),
            }}
            label={getLabel(t('Protocol.Maximum_duration'), t('unit.minutes'))}
          />

          <NumberInput
            errors={errors}
            control={control}
            isDisabled={!isEditable}
            name={protocolDetails.accIndoorTime}
            placeholder={t('Placeholder.numeric.value')}
            rules={{ required: t('Error.required.field') }}
            label={getLabel(
              t('Protocol.Accumulated_indoor_time_allowed'),
              t('unit.minutes')
            )}
          />

          <NumberInput
            errors={errors}
            control={control}
            isDisabled={!isEditable}
            name={protocolDetails.ppixDose}
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
            label={getLabel(t('Protocol.Minimum_PpiX'), t('unit.ppix'))}
          />

          <NumberInput
            errors={errors}
            control={control}
            name={protocolDetails.minTemp}
            isDisabled={!isEditable}
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
            name={protocolDetails.maxTemp}
            isDisabled={!isEditable}
            placeholder={t('Placeholder.numeric.value')}
            rules={{
              required: t('Error.required.field'),
              min: '0',
              validate: (value) =>
                Number(value) >= Number(watch(protocolDetails.minTemp))
                  ? true
                  : t('Error.protocol.value_greater_minTemp'),
            }}
            label={getLabel(t('Protocol.max.air.temperature'), t('unit.temp'))}
          />

          {!isPortalOnlySession && (
            <>
              <NumberInput
                errors={errors}
                control={control}
                isDisabled={!isEditable}
                name={protocolDetails.minDrugLight}
                placeholder={t('Placeholder.numeric.value')}
                rules={{ required: t('Error.required.field') }}
                label={getLabel(t('Protocol.Minimum_DLI'), t('unit.minutes'))}
              />

              <NumberInput
                errors={errors}
                control={control}
                isDisabled={!isEditable}
                name={protocolDetails.maxDrugLight}
                placeholder={t('Placeholder.numeric.value')}
                rules={{
                  required: t('Error.required.field'),
                  validate: (value) =>
                    Number(value) >= Number(watch(protocolDetails.minDrugLight))
                      ? true
                      : t('Error.protocol.value_greater_minDLI'),
                }}
                label={getLabel(t('Protocol.Maximum_DLI'), t('unit.minutes'))}
              />
            </>
          )}

          <Select
            errors={errors}
            control={control}
            options={emollient()}
            isDisabled={!isEditable}
            name={protocolDetails.emollient}
            placeholder={t('Protocol.Please_select')}
            rules={{ required: t('Error.required.field') }}
            label={t('Protocol.Emollient_application')}
          />

          <Select
            errors={errors}
            control={control}
            options={yesNoBool()}
            isDisabled={!isEditable}
            name={protocolDetails.alcohol}
            placeholder={t('Protocol.Please_select')}
            rules={{ required: t('Error.required.field') }}
            label={t('Protocol.Alcohol_application')}
          />
        </div>
      </details>
    </section>
  );
}
