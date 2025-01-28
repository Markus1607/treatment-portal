import { isEmpty } from 'lodash';
import { SunscreenList } from '@types';
import Select from 'components/Forms/Select';
import { TFunction } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { defaultNaturalDPDTValuesType } from 'pages/Schedule/api/types/format';
import {
  Control,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
} from 'react-hook-form';
import SessionLocationRadio from './SessionLocationRadio';
import { NatPDTListType, NatPDTOptionType } from '../utils';
import { NaturalPDTFields as Fields } from 'pages/Schedule/api/types/enums.d';

export type SessionDetailsFieldsType = {
  errors: Record<string, any>;
  searchAddressError: string;
  sunscreenList: SunscreenList;
  setValue: UseFormSetValue<any>;
  naturalPDTList: NatPDTListType;
  getValues: UseFormGetValues<any>;
  t: TFunction<'translation', undefined>;
  watch: UseFormWatch<defaultNaturalDPDTValuesType>;
  control: Control<defaultNaturalDPDTValuesType, any>;
  handleProtocolSelect: (option: NatPDTOptionType) => void;
  setSearchAddressError: Dispatch<SetStateAction<string>>;
};

export default function NaturalPDTSessionFields({
  t,
  errors,
  control,
  setValue,
  getValues,
  naturalPDTList,
  searchAddressError,
  handleProtocolSelect,
  setSearchAddressError,
}: SessionDetailsFieldsType) {
  return (
    <div className='space-y-6'>
      <Select
        errors={errors}
        control={control}
        options={naturalPDTList || []}
        name={Fields.protocolSelected}
        placeholder={t('Protocol.Please_select')}
        rules={{ required: t('Error.required.field') }}
        onSelectFunc={handleProtocolSelect}
        label={t('treatment-protocol-title')}
      />

      <SessionLocationRadio
        t={t}
        errors={errors}
        control={control}
        setValue={setValue}
        getValues={getValues}
        label={t('Protocol.expected.location')}
        name={Fields.expectedLocation.source}
        searchAddressError={searchAddressError}
        sessionTypeFieldName={Fields.sessionType}
        setSearchAddressError={setSearchAddressError}
        locationFieldsNames={{
          lat: Fields.expectedLocation.lat,
          lng: Fields.expectedLocation.lng,
          source: Fields.expectedLocation.source,
          address: Fields.expectedLocation.address,
          otherAddress: Fields.expectedLocation.otherAddress,
          otherAddressLat: Fields.expectedLocation.otherAddressLat,
          otherAddressLng: Fields.expectedLocation.otherAddressLng,
        }}
        rules={{
          required: t('Error.required.field'),
          validate: () => isEmpty(getValues(Fields.expectedLocation.lat)),
        }}
      />
    </div>
  );
}
