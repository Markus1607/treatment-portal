import { PositionType } from '@types';
import { isEmpty, isNumber } from 'lodash';
import { useInstitutionInfo, useLocalStorage } from 'utils/hooks';
import { useEffect, useCallback } from 'react';
import {
  geocodeFetch,
  getUserLocation,
  PlacesResultsType,
} from 'utils/functions';

export default function useGetUserLocation() {
  const instData = useInstitutionInfo();
  const [location, setLocation] = useLocalStorage('location', '');
  const [coordinates, setCoordinates] = useLocalStorage('coordinates', {});
  const [institutionLatLon, setInstitutionLatLon] = useLocalStorage<
    PositionType | { lat: null; lon: null }
  >('institutionInfo', {
    lat: null,
    lon: null,
  });

  const geocodeLocation = useCallback(
    (position: PositionType) => {
      const { lat, lon } = position;
      if (isNumber(lon) && isNumber(lat)) {
        setCoordinates(position);
        geocodeFetch(lat, lon)
          .then((data: PlacesResultsType | unknown) => {
            if ((data as { status?: 'OK' | number })?.status !== 'OK') {
              return console.error(data);
            }
            const { address } = getUserLocation(data as PlacesResultsType);
            setLocation(address);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    [setLocation, setCoordinates]
  );

  //* Fetches the user's location if user allows it else defaults to institution's lat and lon
  useEffect(() => {
    let mounted = true;
    const geocodeInstLatLon = () => {
      if (!instData && 'lat' in instData) {
        const { lat, lon } = instData;
        geocodeLocation({ lat, lon });
        setInstitutionLatLon({ lat, lon });
      }
    };

    if (navigator.geolocation && mounted && isEmpty(coordinates)) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          geocodeLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => geocodeInstLatLon()
      );
    } else {
      geocodeInstLatLon();
    }
    return () => {
      mounted = false;
    };
  }, [instData, geocodeLocation, setInstitutionLatLon, coordinates]);

  return {
    location,
    coordinates,
    institutionLatLon,
  };
}
