import { getYearFromDate, getISODateFormat } from 'utils/functions';
import { defaultRegistrationFieldsType } from '../../api/format.d';

export function patientBEData(obj: defaultRegistrationFieldsType) {
  const data = {
    ...(obj.yearOfBirth instanceof Date && {
      year_of_birth: getYearFromDate(obj.yearOfBirth),
    }),
    gender: Number(obj.gender),
    skin_colour: Number(obj.skinTone),
    natural_hair_colour: Number(obj.hairColor),
    natural_eye_colour: Number(obj.eyeColor),
    freckle_density: Number(obj.freckleDensity),
    fitzpatrick_phototype: 1, //TODO: To be remove from the backend
    sunburn_frequency: Number(obj.sunburnFrequency),
    tan_frequency: Number(obj.tanFrequency),
    previous_immunosuppression: obj.immunosuppression === 'true',
    ...(obj.immunosuppression === 'true' &&
      obj.immunoSpecify && {
        previous_immunosuppression_name: obj.immunoSpecify,
      }),
    previous_cancer: obj.skinCancer === 'true',
    previous_cancer_text:
      obj.skinCancer === 'false' ? '' : obj.skinCancerSpecify,
    prior_treatment: obj.priorAK === 'true',
    ...(obj.priorAK === 'false' && {
      prior_treatment_date: 0,
    }),
    ...(obj.priorTreatmentDate instanceof Date && {
      prior_treatment_date: getISODateFormat(obj.priorTreatmentDate),
    }),
    ...(obj.MED && {
      med: Number(parseFloat(`${obj.MED}`).toFixed(1)),
    }),
    ...(obj.clinicalComments && {
      clinical_comments: obj.clinicalComments,
    }),
  };
  return data;
}

export type PatientBEDataType = ReturnType<typeof patientBEData>;
