import { defaultRegistrationFieldsType } from './format.d';

export const defaultRegistrationFields: defaultRegistrationFieldsType = {
  id: null,
  gender: '',
  yearOfBirth: '',
  MED: '',
  name: '',
  treatmentLocation: {
    address: '',
    lat: '',
    lng: '',
  },
  immunosuppression: 'false',
  immunoSpecify: '',
  skinCancer: 'false',
  skinCancerSpecify: '',
  priorAK: 'false',
  priorTreatmentDate: '',
  clinicalComments: '',
  eyeColor: '',
  hairColor: '',
  skinTone: '',
  freckleDensity: '',
  sunburnFrequency: '',
  tanFrequency: '',
  // photosensitizingMedication: 'false',
  // photosensitizingMedicationSpecify: '',
};
