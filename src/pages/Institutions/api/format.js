import { isNumber } from 'lodash';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export const defaultValues = {
  instName: '',
  postCode: '',
};

export function formatInstitutions(insts) {
  return insts.map((inst) => {
    return {
      id: isNumber(inst.id) ? inst.id : 0,
      name: inst.name ? inst.name : '-',
      postCode: inst.post_code ? inst.post_code : '-',
      lat: inst.lat ? inst.lat : 0,
      lon: inst.lon ? inst.lon : 0,
    };
  });
}

export async function formatPostInstitution(data) {
  const results = await geocodeByAddress(data.postCode);
  const latLng = await getLatLng(results[0]);

  return {
    name: data.instName ? data.instName : '-',
    post_code: data.postCode ? data.postCode : '-',
    lat: latLng ? latLng?.lat : 0,
    lon: latLng ? latLng?.lng : 0,
  };
}

export function formatUpdateInstitution(data) {
  return {
    inst_id: data.id ? data.id : 0,
    name: data.instName ? data.instName : '',
    post_code: data.postCode ? data.postCode : '',
  };
}
