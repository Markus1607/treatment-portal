import { prodrug, sessionType, quantityOfProdrug } from 'utils/options';
import { AppProvider } from 'AppProvider';
import Select from 'components/Forms/Select';
import SessionTypeRadio from 'components/Forms/SessionTypeRadio';
import { QuickScheduleSearchAddress } from 'components/SearchAddress';

export default function SessionDetailsFormFields({
  errors,
  control,
  setValue,
  getValues,
  handleUserLocation,
  searchAddressError,
  setSearchAddressError,
}) {
  const { t, sunscreenList } = AppProvider.useContainer();
  return (
    <>
      <SessionTypeRadio
        errors={errors}
        control={control}
        name='sessionType'
        label={t('Protocol.session.type')}
        rules={{ required: t('Error.required.field') }}
        options={sessionType().filter(
          (option) => option.value !== 'self_applied'
        )}
      />

      <QuickScheduleSearchAddress
        t={t}
        errors={errors}
        control={control}
        setValue={setValue}
        name='expectedLocation'
        label={t('Protocol.expected.location')}
        coordinatesKeys={{
          lat: 'lat',
          lng: 'lng',
        }}
        handleUserLocation={handleUserLocation}
        searchAddressError={searchAddressError}
        setSearchAddressError={setSearchAddressError}
        placeholder={t('Self_completing_Address.city')}
        rules={{
          required: t('Error.required.field'),
          validate: () => getValues('lat') && getValues('lng'),
        }}
      />

      <div className='flex w-full space-x-6'>
        <Select
          name='prodrug'
          errors={errors}
          control={control}
          options={prodrug()}
          maxMenuHeight={80}
          label={t('Protocol.Prodrug')}
          placeholder={t('Select.an.option')}
          rules={{ required: t('Error.required.field') }}
          containerClass='w-full'
        />

        <Select
          errors={errors}
          control={control}
          maxMenuHeight={80}
          name='quantityOfProdrug'
          options={quantityOfProdrug()}
          placeholder={t('Select.an.option')}
          rules={{ required: t('Error.required.field') }}
          label={t('Protocol.Quantity_of_prodrug_to_be_applied')}
          containerClass='w-full'
        />
      </div>

      <Select
        errors={errors}
        name='sunscreen'
        control={control}
        maxMenuHeight={90}
        options={sunscreenList}
        isSunscreenSelect={true}
        placeholder={t('Protocol.Please_select')}
        rules={{ required: t('Error.required.field') }}
        label={t('Protocol.Sunscreen_application')}
      />
    </>
  );
}
