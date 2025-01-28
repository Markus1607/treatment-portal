import { useEffect, useState, useCallback } from 'react';
import { patients, schedule } from 'routes';
import { useLocalStorage } from 'utils/hooks';
import SessionProtocolFields from './SessionProtocolFields';
import SessionDetailsFormFields from './SessionDetailsFormFields';
import { ReactComponent as DropIcon } from 'assets/images/ic_dropdown.svg';
import { ReactComponent as BeginTreatmentIcon } from 'assets/images/ic_begin_treatment.svg';
import { ReactComponent as ScheduleTreatmentIcon } from 'assets/images/ic_schedule_treatment.svg';
import { isEmpty, isNumber } from 'lodash';
import { extractUserAddress, getUserLanguage } from 'utils/functions';
import { SessionTypeEnums } from 'utils/options.d';

export default function SchedulingForms({
  t,
  watch,
  errors,
  control,
  history,
  setValue,
  getValues,
  patientID,
  beginTreatment,
  setBeginTreatment,
}) {
  const [address] = useLocalStorage('location', '');
  const [localCoordinates] = useLocalStorage('coordinates', {});
  const [searchAddressError, setSearchAddressError] = useState('');
  const [isProtocolVisible, setIsProtocolVisible] = useState(false);

  useEffect(() => {
    if (!beginTreatment) {
      setIsProtocolVisible(false);
    }
    return () => null;
  }, [beginTreatment]);

  const handleUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      setValue('expectedLocation', t('Dashboard.Loading'));
      navigator.geolocation.getCurrentPosition(successCallback, () => {
        setValue('expectedLocation', t('Dashboard.location_search_text')); //error callback
      });
    } else {
      setSearchAddressError(t('Dashboard.geolocation_not_supported'));
    }
  }, [t]); //eslint-disable-line

  const successCallback = async (position) => {
    const geocode = await import('geocoder');
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    setValue('lat', lat);
    setValue('lng', lon);
    if (isNumber(lat) && isNumber(lon)) {
      await geocode.reverseGeocode(
        lat,
        lon,
        (err, data) => {
          if (err || data?.status !== 'OK') {
            setSearchAddressError(t('Dashboard.error_fetching_location'));
          } else if (data) {
            const address = extractUserAddress(data);
            setValue('expectedLocation', address, {
              shouldValidate: true,
            });
          }
        },
        {
          language: getUserLanguage(),
          key: import.meta.env.REACT_APP_ADDRESS_API,
        }
      );
    } else {
      setSearchAddressError(t('Dashboard.error_fetching_location'));
    }
  };

  //* Get location from user
  useEffect(() => {
    if (!isNumber(localCoordinates?.lat) && !isNumber(localCoordinates?.lng)) {
      handleUserLocation();
    }
    if (isNumber(localCoordinates?.lat) && isNumber(localCoordinates?.lng)) {
      setValue('expectedLocation', address);
      setValue('lat', localCoordinates?.lat);
      setValue('lng', localCoordinates?.lng);
    }
    return () => null;
  }, [localCoordinates, handleUserLocation, setValue, address]);

  return (
    <>
      <section className='p-4 pb-0 m-4 font-bold bg-white border containerShadow shadow-sm'>
        <h1 className='mb-4 text-base font-bold text-left 2xl:text-lg'>
          {t('choice.card_title')}
        </h1>
        <div className='flex justify-between mb-6 2xl:text-base space-x-4'>
          <button
            onClick={() => setBeginTreatment(!beginTreatment)}
            className={`p-4 w-full font-bold border border-gray rounded-md ${
              beginTreatment && 'bg-dashboard border-2 border-blue'
            }`}
          >
            <div className='flex items-center text-left space-x-4'>
              <BeginTreatmentIcon />
              <p>{t('choice.quick_start.heading')}</p>
            </div>
            <p className='mt-4 text-sm font-normal text-left text-black-light'>
              {t('choice.quick_start.body')}
            </p>
          </button>
          <button
            onClick={() => history.push(`${patients}/${patientID}/${schedule}`)}
            className='w-full p-4 font-bold border active:bg-dashboard active:border-2 active:border-blue border-gray rounded-md'
          >
            <div className='flex items-center text-left space-x-4'>
              <ScheduleTreatmentIcon />
              <p>{t('choice.future_session.heading')}</p>
            </div>
            <p className='mt-4 text-sm font-normal text-left text-black-light'>
              {t('choice.future_session.body')}
            </p>
          </button>
        </div>
      </section>

      {beginTreatment && (
        <form>
          <section className='p-4 pb-6 m-4 text-sm bg-white border containerShadow shadow-sm space-y-6'>
            <h1 className='mb-4 text-base font-bold text-left 2xl:text-lg'>
              {t('Scheduling.card_session_details')}
            </h1>

            <SessionDetailsFormFields
              errors={errors}
              control={control}
              setValue={setValue}
              getValues={getValues}
              handleUserLocation={handleUserLocation}
              searchAddressError={searchAddressError}
              setSearchAddressError={setSearchAddressError}
            />
          </section>

          <section className='p-4 pb-0 m-4 font-bold bg-white border containerShadow shadow-sm'>
            <details
              open={isProtocolVisible || !isEmpty(errors)}
              onToggle={() =>
                setIsProtocolVisible((isProtocolVisible) => !isProtocolVisible)
              }
            >
              <summary className='flex items-center justify-between mb-4 font-bold text-left list-none cursor-pointer 2xl:text-lg'>
                <span> {t('Protocol.card_title')}</span>
                <span className='text-black/70'>
                  {isProtocolVisible ? (
                    <DropIcon className='transform rotate-180 scale-75' />
                  ) : (
                    <DropIcon className='scale-75' />
                  )}
                </span>
              </summary>

              <SessionProtocolFields
                t={t}
                watch={watch}
                errors={errors}
                control={control}
                isPortalOnlySession={
                  watch('sessionType') === SessionTypeEnums.FullyAssisted
                }
              />
            </details>
          </section>
        </form>
      )}
    </>
  );
}
