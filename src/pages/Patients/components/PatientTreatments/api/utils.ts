import { SessionTypeEnums } from '~/utils/options.d';
import { SessionStateEnums } from '../../PatientSchedule/api/query.d';
import { AllNatDypdTreatments, Session } from './api.types';
import { useEffect, useState } from 'react';
import { getUserLanguage } from '~/utils/functions';
import { geocode, RequestType, OutputFormat } from 'react-geocode';
import { truncate } from 'lodash';

export function sortNatDypdTreatments(
  data: AllNatDypdTreatments
): AllNatDypdTreatments {
  const sessions = data.sessions.sort((a: Session, b: Session) => {
    // Prioritize ongoing and paused states
    if (
      a.state === SessionStateEnums.RUNNING ||
      a.state === SessionStateEnums.PAUSED
    ) {
      return -1;
    } else if (
      b.state === SessionStateEnums.RUNNING ||
      b.state === SessionStateEnums.PAUSED
    ) {
      return 1;
    }

    // Then scheduled
    if (a.state === SessionStateEnums.SCHEDULED) {
      return -1;
    } else if (b.state === SessionStateEnums.SCHEDULED) {
      return 1;
    }

    // Sort finished by start_time (latest first)
    if (
      a.state === SessionStateEnums.COMPLETED &&
      b.state === SessionStateEnums.COMPLETED
    ) {
      return b.start_time! - a.start_time!; // Use ! for non-null assertion
    }

    // Finished comes last
    return 1;
  });

  return { sessions };
}

export const createObjectURL = (blob: Blob): string => {
  if (window.URL) {
    return window.URL.createObjectURL(blob);
  } else if (window.webkitURL) {
    // For older browsers
    return window.webkitURL.createObjectURL(blob);
  }
  return '';
};

export type GetAppAddressType = {
  coordinates: {
    lat: number;
    lng: number;
  };
  sessionType: string;
};

export const useGetAppAddress = ({
  coordinates,
  sessionType,
}: GetAppAddressType) => {
  const [appAddress, setAppAddress] = useState('');
  const isFullyAssisted = sessionType === SessionTypeEnums.FullyAssisted;

  useEffect(() => {
    if (!coordinates || isFullyAssisted) return;
    getAddressFromLatLng(coordinates).then((address) => {
      setAppAddress(address);
    });
  }, [coordinates, isFullyAssisted]);

  return {
    fullAppAddress: appAddress,
    appAddress: truncate(appAddress, { length: 30 }),
  };
};

export async function getAddressFromLatLng({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const lang = getUserLanguage();
  const data = await geocode(RequestType.LATLNG, `${lat},${lng}`, {
    language: lang,
    outputFormat: OutputFormat.JSON,
    key: import.meta.env.REACT_APP_ADDRESS_API,
  });
  return data?.results?.[0]?.formatted_address || '';
}
