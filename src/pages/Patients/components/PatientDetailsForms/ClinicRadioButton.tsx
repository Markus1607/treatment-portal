import { btnIcons } from 'utils/icons';
import { TFunction } from 'react-i18next';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { FieldValues, UseFormSetValue } from 'react-hook-form';
import useInstitutionLocation from 'pages/Main/hooks/useInstitutionLocation';

type ClinicRadioButtonProps = {
  useClinicAddress: boolean;
  t: TFunction<'translation', undefined>;
  setValue: UseFormSetValue<FieldValues>;
  setUseClinicAddress: Dispatch<SetStateAction<boolean>>;
};

export default function ClinicRadioButton({
  t,
  setValue,
  useClinicAddress,
  setUseClinicAddress,
}: ClinicRadioButtonProps) {
  const toggleClinicAddress = () => {
    setUseClinicAddress(!useClinicAddress);
  };

  const {
    lat: instLat,
    lng: instLng,
    address: instAddress,
  } = useInstitutionLocation();

  const setTreatmentLocation = useCallback(
    ({ lat, lng, address }: locationType) => {
      setValue('treatmentLocation.lat', lat);
      setValue('treatmentLocation.lng', lng);
      setValue('treatmentLocation.address', address);
    },
    [setValue]
  );

  useEffect(() => {
    let mounted = true;
    if (useClinicAddress && mounted) {
      setTreatmentLocation({
        lat: instLat,
        lng: instLng,
        address: instAddress,
      });
    } else {
      setTreatmentLocation({ lat: '', lng: '', address: '' });
    }
    return () => {
      mounted = false;
    };
  }, [setTreatmentLocation, useClinicAddress, instLat, instLng, instAddress]);

  return (
    <label
      className={`flex p-2 border-2 border-gray-light rounded-md justify-between relative w-48 self-start ${
        useClinicAddress ? 'border-blue-dark bg-gray-lightest' : ''
      }`}
    >
      <input
        type='radio'
        name='treatmentLocation.address'
        className='absolute inline-block opacity-0'
        checked={useClinicAddress}
        onChange={toggleClinicAddress}
        onClick={toggleClinicAddress}
      />
      <div className='flex items-center justify-between w-full'>
        <p className='font-light'>At the Clinic</p>
        {useClinicAddress ? (
          <img src={btnIcons.tick_blue} alt={t('Tick_Icon_Blue_alt')} />
        ) : null}
      </div>
    </label>
  );
}

type locationType = {
  lat: number | '';
  lng: number | '';
  address: string;
};
