type StringNumber = string | number;

export type defaultRegistrationFieldsType = {
  id: number | null;
  gender: StringNumber;
  yearOfBirth: string | Date;
  MED: StringNumber;
  name: string;
  treatmentLocation: {
    address: string;
    lat: StringNumber;
    lng: StringNumber;
  };
  immunosuppression: StringNumber;
  immunoSpecify: string;
  skinCancer: string;
  skinCancerSpecify: string;
  priorAK: string;
  priorTreatmentDate: string | Date;
  clinicalComments: string;
  eyeColor: StringNumber;
  hairColor: StringNumber;
  skinTone: StringNumber;
  freckleDensity: StringNumber;
  sunburnFrequency: StringNumber;
  tanFrequency: StringNumber;
  // photosensitizingMedication: string;
  // photosensitizingMedicationSpecify: string;
};
