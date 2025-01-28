import Select from 'components/Forms/Select';
import { NumberInput } from 'components/Forms/Inputs';
import { emollient, yesNoBool } from 'utils/options';

const getLabel = (title, unit) => {
  return (
    <p className='flex items-center text-left gap-1'>
      <span>{title}</span> <span className='font-light'>{unit}</span>
    </p>
  );
};

export default function SessionProtocolFields({
  t,
  watch,
  errors,
  control,
  isPortalOnlySession,
}) {
  return (
    <div className='mb-8 text-sm text-black bg-white space-y-6'>
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
        name='accIndoorTime'
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
        name='minPpix'
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
        name='maxPpix'
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
          validate: (value) =>
            Number(value) >= Number(watch('minPpix'))
              ? true
              : t('Error.protocol.value_greater_minPpix'),
        }}
        label={getLabel(t('Protocol.Maximum_PpiX'), t('unit.ppix'))}
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

      {!isPortalOnlySession && (
        <>
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
        </>
      )}

      <Select
        errors={errors}
        control={control}
        options={emollient()}
        name='emollient'
        placeholder={t('Protocol.Please_select')}
        rules={{ required: t('Error.required.field') }}
        label={t('Protocol.Emollient_application')}
      />

      <Select
        name='alcohol'
        errors={errors}
        control={control}
        options={yesNoBool()}
        placeholder={t('Protocol.Please_select')}
        rules={{ required: t('Error.required.field') }}
        label={t('Protocol.Alcohol_application')}
      />
    </div>
  );
}
