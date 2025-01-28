import { useLocalStorage } from 'utils/hooks';

export default function useInstitutionLocation() {
  const [instData] = useLocalStorage('institutionInfo', {});

  const instAddressInfo = {
    address: instData && 'address' in instData ? instData?.address : '',
    lat: instData && 'lat' in instData ? instData?.lat : null,
    lng: instData && 'lon' in instData ? instData?.lon : null,
  };

  return instAddressInfo;
}
