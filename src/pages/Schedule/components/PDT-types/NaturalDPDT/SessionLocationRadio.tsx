import {
  Control,
  Controller,
  UseFormReturn,
  UseControllerProps,
  InternalFieldErrors,
} from 'react-hook-form';
import { uniqueId } from 'lodash';
// import { btnIcons } from 'utils/icons';
import { TFunction } from 'react-i18next';
import Checkbox from 'components/Forms/Checkbox';
import { Dispatch, useEffect, useCallback, SetStateAction } from 'react';
import { expectedLocationOptions } from 'utils/options';
import { SchedulingAddressSearch } from 'components/SearchAddress';
import useInstitutionLocation from 'pages/Main/hooks/useInstitutionLocation';
import {
  ExpectedLocationEnums,
  ExpectedLocationOptions,
} from 'utils/options.d';
import { SessionTypeEnum } from '~/pages/Schedule/api/types/enums.d';

type LocationFieldsType = {
  lat: number | '';
  lng: number | '';
  address: string;
  otherAddress?: string;
  otherAddressLat?: number | '';
  otherAddressLng?: number | '';
  source: ExpectedLocationOptions;
};

type SessionLocationRadioPropType = {
  t: TFunction;
  name: string;
  label: string;
  disabled?: boolean;
  control: Control<any>;
  errors: InternalFieldErrors;
  sessionTypeFieldName: string;
  rules: UseControllerProps['rules'];
  setValue: UseFormReturn['setValue'];
  getValues: UseFormReturn['getValues'];
  locationFieldsNames: {
    lat: string;
    lng: string;
    address: string;
    source: string;
    otherAddress: string;
    otherAddressLat: string;
    otherAddressLng: string;
  };
  searchAddressError: string;
  setSearchAddressError: Dispatch<SetStateAction<string>>;
};

export default function SessionLocationRadio({
  t,
  name,
  label,
  rules,
  errors,
  control,
  disabled,
  setValue,
  getValues,
  searchAddressError,
  locationFieldsNames,
  sessionTypeFieldName,
  setSearchAddressError,
}: SessionLocationRadioPropType) {
  const lat = getValues(locationFieldsNames.lat);
  const { Clinic, Preferred, Custom } = ExpectedLocationEnums;
  const otherAddress = getValues(locationFieldsNames.otherAddress);
  const otherAddressLat = getValues(locationFieldsNames.otherAddressLat);
  const otherAddressLng = getValues(locationFieldsNames.otherAddressLng);
  const source = getValues(
    locationFieldsNames.source
  ) as ExpectedLocationOptions;
  const {
    lat: instLat,
    lng: instLng,
    address: instAddress,
  } = useInstitutionLocation();

  const setLocationFields = useCallback(
    ({
      lat,
      lng,
      source,
      address,
      otherAddress,
      otherAddressLat,
      otherAddressLng,
    }: LocationFieldsType) => {
      setValue(locationFieldsNames.lat, lat);
      setValue(locationFieldsNames.lng, lng);
      setValue(locationFieldsNames.source, source);
      setValue(locationFieldsNames.address, address);
      setValue(locationFieldsNames.otherAddress, otherAddress || '');
      setValue(locationFieldsNames.otherAddressLat, otherAddressLat);
      setValue(locationFieldsNames.otherAddressLng, otherAddressLng);
    },
    [
      setValue,
      locationFieldsNames.lat,
      locationFieldsNames.lng,
      locationFieldsNames.source,
      locationFieldsNames.address,
      locationFieldsNames.otherAddress,
      locationFieldsNames.otherAddressLat,
      locationFieldsNames.otherAddressLng,
    ]
  );

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      switch (source) {
        case Clinic:
          setValue(sessionTypeFieldName, SessionTypeEnum.FullyAssisted);
          setLocationFields({
            lat: otherAddressLat || instLat,
            lng: otherAddressLng || instLng,
            address: otherAddress || instAddress,
            source: Clinic,
            otherAddress,
            otherAddressLat,
            otherAddressLng,
          });
          setSearchAddressError('');
          return;
        case Preferred:
          setValue(sessionTypeFieldName, SessionTypeEnum.SelfApplied);
          setLocationFields({
            lat: otherAddressLat || instLat,
            lng: otherAddressLng || instLng,
            address: otherAddress || instAddress,
            source: Preferred,
            otherAddress,
            otherAddressLat,
            otherAddressLng,
          });
          setSearchAddressError('');
          return;
        case Custom:
          setValue(sessionTypeFieldName, SessionTypeEnum.Assisted);
          setLocationFields({
            lat: otherAddressLat || instLat,
            lng: otherAddressLng || instLng,
            address: otherAddress || instAddress,
            source: Custom,
            otherAddress,
            otherAddressLat,
            otherAddressLng,
          });
          return;
      }
    }
    return () => {
      mounted = false;
    };
  }, [
    source,
    instLng,
    instLat,
    Clinic,
    Custom,
    setValue,
    Preferred,
    instAddress,
    otherAddress,
    otherAddressLat,
    otherAddressLng,
    setLocationFields,
    sessionTypeFieldName,
    setSearchAddressError,
    locationFieldsNames.otherAddress,
  ]);

  return (
    <>
      <div className='flex flex-col space-y-3 text-sm text-gray'>
        <label
          htmlFor={name}
          className='block text-left text-black 4xl:text-sm text-cxs'
        >
          {label}
        </label>

        <Controller
          name={name}
          control={control}
          rules={{ ...rules }}
          render={({ field }) => (
            <div
              {...field}
              role='radiogroup'
              aria-label={name}
              className='sessionTypeRadioContainer'
            >
              {expectedLocationOptions().map((item, index) => {
                const isChecked = field.value === item.value;

                return (
                  <label
                    key={uniqueId('item-')}
                    className={`items ${
                      isChecked
                        ? 'border-2 border-blue bg-gray-lightest'
                        : 'bg-white border-2 border-border-gray-400'
                    } `}
                  >
                    <Checkbox
                      value={item.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      checked={disabled ? false : isChecked}
                    />
                    <div className='flex items-center justify-between'>
                      <img
                        src={item.icon}
                        className={`${
                          index === 1 ? 'scale-[2.5]' : ' scale-[2]'
                        } w-6 max-h-6 rounded-full mx-auto mt-1`}
                        alt={item.label + ' icon'}
                      />
                    </div>
                    <h3 className='font-normal text-center text-black text-cxs 4xl:text-sm'>
                      {item.label}
                    </h3>
                    <p className='text-xs 4xl:text-[0.8rem] text-black-light whitespace-pre-wrap font-light text-center'>
                      {item.description}
                    </p>
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors?.[name] && (
          <p className='font-normal errorMessage'>{errors?.[name]?.message}</p>
        )}
      </div>

      <SchedulingAddressSearch
        t={t}
        control={control}
        setValue={setValue}
        label={t('location_chosen')}
        errors={errors?.expectedLocation}
        searchAddressError={searchAddressError}
        name={locationFieldsNames.address}
        coordinatesKeys={{
          lat: locationFieldsNames.lat,
          lng: locationFieldsNames.lng,
        }}
        setSearchAddressError={setSearchAddressError}
        placeholder={t('Self_completing_Address.city')}
        rules={{
          required: t('Error.required.field'),
          validate: lat,
        }}
      />
    </>
  );
}
