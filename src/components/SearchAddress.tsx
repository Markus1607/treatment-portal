import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  Suggestion,
} from 'react-places-autocomplete';
import getLocation from 'assets/images/ic_get_location.svg';
import searchIcon from 'assets/images/ic_search.svg';
import {
  Controller,
  Control,
  UseFormReturn,
  UseControllerProps,
} from 'react-hook-form';
import { formatPredictions } from 'utils/dataFormats';
import {
  useEffect,
  useMemo,
  useState,
  useRef,
  SetStateAction,
  Dispatch,
} from 'react';
import { getUserAddressLanguage, getUserLocationText } from 'utils/functions';
import { TFunction } from 'react-i18next';

type AddressSearchPropType = {
  errors: any;
  name: string;
  label?: string;
  placeholder: string;
  searchAddressError: string;
  control: Control<any>;
  rules: UseControllerProps['rules'];
  setValue: UseFormReturn['setValue'];
  t: TFunction<'translation', undefined>;
  coordinatesKeys: {
    lat: string;
    lng: string;
  };
  setSearchAddressError: Dispatch<SetStateAction<string>>;
};

export const SchedulingAddressSearch = ({
  t,
  name,
  label,
  rules,
  errors,
  control,
  setValue,
  placeholder,
  coordinatesKeys,
  searchAddressError,
  setSearchAddressError,
}: AddressSearchPropType) => {
  const isFirstRender = useRef(true);
  const { lat, lng } = coordinatesKeys;
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictedLocations, setPredictedLocations] = useState<Suggestion[]>(
    []
  );
  const errMsg = errors?.otherAddress?.message || searchAddressError;

  useEffect(() => {
    if (window.google?.maps?.places) {
      const autocomplete = new window.google.maps.places.AutocompleteService();
      autocomplete.getPlacePredictions(
        {
          input: getUserLocationText(),
          language: getUserAddressLanguage(),
        },
        (predictions) =>
          predictions &&
          isFirstRender.current &&
          setPredictedLocations(formatPredictions(predictions))
      );
    }
    return () => {
      isFirstRender.current = false;
    };
  }, []);

  return (
    <div className='container space-y-2 font-normal border-gray'>
      {label && (
        <label className='block text-black 4xl:text-sm text-cxs'>{label}</label>
      )}
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={({ field: { onChange, value, ref } }) => {
          return window.google?.maps?.places ? (
            <PlacesAutocomplete
              debounce={300}
              value={value || ''}
              onChange={(value) => {
                onChange(value);
                setShowPredictions(value?.length ? false : true);
                setSearchAddressError(
                  value.length < 1
                    ? t('Error.please.enter.a.valid.address')
                    : t('Error.address.with.no.coordinates')
                );
              }}
              onSelect={async (address, placeId) => {
                onChange(address);
                if (!placeId) {
                  setSearchAddressError(t('Error.address.with.no.coordinates'));
                  return false;
                } else {
                  setSearchAddressError('');
                  setShowPredictions(false);
                  const results = await geocodeByAddress(address);
                  const latLng = await getLatLng(results[0]);
                  if (latLng.lat && latLng.lng) {
                    setValue(lat, latLng.lat, {
                      shouldValidate: true,
                    });
                    setValue(lng, latLng.lng, {
                      shouldValidate: true,
                    });
                  }
                }
              }}
              highlightFirstSuggestion={true}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                const results = showPredictions
                  ? predictedLocations
                  : suggestions;
                return (
                  <div className='relative flex flex-col h-full text-sm font-light'>
                    <input
                      ref={ref}
                      {...getInputProps({
                        placeholder,
                        onBlur: () => setShowPredictions(false),
                        onFocus: () =>
                          setShowPredictions(value?.length ? false : true),
                        className:
                          'm-0 px-2 w-full text-black-light py-2 4xl:text-sm text-cxs border border-br-0 border-bl-0 rounded-md outline-none focus-visible:border-blue ring-1 ring-gray-light',
                      })}
                    />
                    <div className='top-[2.35rem] absolute w-full bg-white rounded-bl-md rounded-br-md cursor-pointer'>
                      {results?.map((suggestion, index) => {
                        const lastChild = suggestions.length - 1;
                        const style = {
                          color: '#303c45',
                          backgroundColor: suggestion.active
                            ? '#f4f8fb'
                            : '#fff',
                          borderLeft: '1px solid #c1cad1',
                          borderRight: '1px solid #c1cad1',
                        };
                        return (
                          <div
                            className={`relative p-2 z-50 border-b border-gray ${
                              index === lastChild
                                ? 'rounded-br-md rounded-bl-md'
                                : ''
                            }`}
                            {...getSuggestionItemProps(suggestion, {
                              style,
                            })}
                            key={suggestion.description}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                    {errMsg && (
                      <p className='relative mt-1 font-normal errorMessage'>
                        {errMsg}
                      </p>
                    )}
                  </div>
                );
              }}
            </PlacesAutocomplete>
          ) : (
            <input
              disabled
              placeholder={t('Placeholder_search_initialising')}
              className='w-full px-2 py-2 m-0 border rounded-md outline-none cursor-not-allowed border-br-0 border-bl-0 text-black-light focus-visible:border-blue ring-1 ring-gray-light'
            />
          );
        }}
      />
    </div>
  );
};

type QuickScheduleSearchAddressPropType = {
  isDisabled?: boolean;
  coordinatesKeys: {
    lat: string;
    lng: string;
  };
  handleUserLocation: () => void;
} & AddressSearchPropType;

export const QuickScheduleSearchAddress = ({
  t,
  name,
  label,
  rules,
  errors,
  control,
  setValue,
  isDisabled,
  placeholder,
  coordinatesKeys,
  handleUserLocation,
  searchAddressError,
  setSearchAddressError,
}: QuickScheduleSearchAddressPropType) => {
  const { lat, lng } = coordinatesKeys;

  useMemo(() => {
    if (searchAddressError !== '') {
      setValue(lat, '');
    }
  }, [lat, searchAddressError, setValue]);

  return (
    <div className='container space-y-2 font-normal border-gray'>
      {label && <label className='block text-black'>{label}</label>}
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={({ field: { onChange, value, ref } }) => {
          return window.google?.maps?.places ? (
            <PlacesAutocomplete
              debounce={300}
              value={isDisabled ? '' : value}
              onChange={(value) => {
                onChange(value);
                setSearchAddressError(t('Error.address.with.no.coordinates'));
              }}
              onSelect={async (address, placeId) => {
                onChange(address);
                if (!placeId) {
                  setSearchAddressError(
                    t('Error.please.enter.a.valid.address')
                  );
                  return false;
                } else {
                  setSearchAddressError('');
                  const results = await geocodeByAddress(address);
                  const latLng = await getLatLng(results[0]);
                  if (latLng.lat && latLng.lng) {
                    setValue(lat, latLng.lat, {
                      shouldValidate: true,
                    });
                    setValue(lng, latLng.lng, {
                      shouldValidate: true,
                    });
                  }
                }
              }}
              highlightFirstSuggestion={true}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                <div className='relative flex flex-col h-full text-sm font-light'>
                  <div className='flex'>
                    <div
                      onClick={() => handleUserLocation && handleUserLocation()}
                      className='m-0 px-2.5 py-2 bg-blue rounded-bl-sm rounded-tl-sm cursor-pointer overflow-visible'
                    >
                      <img
                        src={getLocation}
                        alt='get-location-icon'
                        className='transform scale-110'
                      />
                    </div>
                    <input
                      ref={ref}
                      {...getInputProps({
                        placeholder,
                        className:
                          'm-0 px-2 w-full text-black-light py-2 border border-l-0 border-br-0 rounded-tr-sm rounded-br-sm outline-none focus-visible:border-blue ring-1 ring-gray-light',
                      })}
                      disabled={isDisabled}
                    />
                  </div>
                  <div className='top-[2.40rem] absolute z-50 w-full bg-white rounded-bl-md rounded-br-md cursor-pointer'>
                    {suggestions.map((suggestion, index) => {
                      const lastChild = suggestions.length - 1;
                      const style = {
                        color: '#303c45',
                        backgroundColor: suggestion.active ? '#f4f8fb' : '#fff',
                        borderLeft: '1px solid #c1cad1',
                        borderRight: '1px solid #c1cad1',
                      };
                      return (
                        <div
                          className={`relative p-2 z-50 border-gray ${
                            index === lastChild
                              ? 'border-b rounded-br-md rounded-bl-md'
                              : 'border-b'
                          }`}
                          {...getSuggestionItemProps(suggestion, {
                            style,
                          })}
                          key={suggestion.description}
                        >
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                  {!isDisabled && errors?.[name]?.message && (
                    <p className='relative mt-1 font-normal errorMessage'>
                      {errors?.[name]?.message}
                    </p>
                  )}
                  {!isDisabled && searchAddressError && value && (
                    <p className='relative mt-1 font-normal errorMessage'>
                      {searchAddressError}
                    </p>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
          ) : (
            <div className='flex w-full'>
              <div className='m-0 px-2.5 py-2 bg-blue rounded-bl-sm rounded-tl-sm cursor-not-allowed overflow-visible'>
                <img
                  src={getLocation}
                  alt='get-location-icon'
                  className='transform scale-110'
                />
              </div>
              <input
                disabled
                placeholder={t('Placeholder_search_initialising')}
                className='w-full px-2 py-2 m-0 border border-l-0 outline-none border-br-0 text-black-light focus-visible:border-blue rounded-br-md rounded-tr-md ring-1 ring-gray-light'
              />
            </div>
          );
        }}
      />
    </div>
  );
};

type WeatherAddressSearchPropType = {
  address: string;
  placeholder: string;
  t: TFunction<'translation', undefined>;
  handleAddressChange: (value: string) => void;
  handleAddressSelect: (address: string, placeID: string) => void;
};

export const WeatherAddressSearch = ({
  t,
  address,
  placeholder,
  handleAddressChange,
  handleAddressSelect,
}: WeatherAddressSearchPropType) => {
  return window.google?.maps?.places ? (
    <div className='w-full my-auto font-normal'>
      <PlacesAutocomplete
        value={address}
        onSelect={handleAddressSelect}
        onChange={handleAddressChange}
        highlightFirstSuggestion={true}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div className='relative flex flex-col h-full text-base font-light text-black'>
            <div className='flex max-w-full gap-0'>
              <div className='p-4 m-0 overflow-visible bg-blue rounded-bl-md rounded-tl-md'>
                <img
                  src={searchIcon}
                  alt='searchIcon'
                  className='transform scale-110'
                />
              </div>
              <input
                {...getInputProps({
                  placeholder,
                  className:
                    'm-0 px-4 w-full min-h-full border rounded-br-md rounded-tr-md outline-none',
                })}
              />
            </div>
            <div className='top-[3.2rem] w-[calc(100%-3rem)] absolute z-50 ml-12 bg-white rounded-bl-md rounded-br-md cursor-pointer'>
              {suggestions.map((suggestion, index) => {
                const lastChild = suggestions.length - 1;
                const style = {
                  backgroundColor: suggestion.active ? '#f4f8fb' : '#fff',
                  borderLeft: '1px solid #d9E4ee',
                  borderRight: '1px solid #d9E4ee',
                };
                return (
                  <div
                    className={`relative px-2 pl-4 py-3 z-50 border-gray-light w-full ${
                      index === lastChild
                        ? 'border-b rounded-br-md rounded-bl-md'
                        : 'border-b'
                    }`}
                    {...getSuggestionItemProps(suggestion, {
                      style,
                    })}
                    key={suggestion.description}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  ) : (
    <div className='flex max-w-full gap-0'>
      <div className='p-4 m-0 overflow-visible bg-blue rounded-bl-md rounded-tl-md'>
        <img
          src={searchIcon}
          alt='searchIcon'
          className='transform scale-110'
        />
      </div>
      <input
        disabled
        placeholder={t('Placeholder_search_initialising')}
        className='w-full min-h-full px-4 m-0 border outline-none cursor-not-allowed rounded-br-md rounded-tr-md'
      />
    </div>
  );
};
