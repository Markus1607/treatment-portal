import { Patient } from '../../../types';
import { getStringDateFormat, getTimeStampFromYear } from 'utils/functions';

export function formatPatientEditDetails(obj: Patient) {
  return {
    id: obj.id,
    gender: obj.gender,
    skinTone: String(obj.skin_colour),
    hairColor: String(obj.natural_eye_colour),
    eyeColor: String(obj.natural_eye_colour),
    freckleDensity: obj.freckle_density || '',
    sunburnFrequency: obj.sunburn_frequency || '',
    skinCancer: String(obj.previous_cancer) || 'false',
    skinCancerSpecify: obj.previous_cancer_text || '',
    tanFrequency: obj.tan_frequency,
    yearOfBirth: obj.year_of_birth
      ? getTimeStampFromYear(obj.year_of_birth)
      : null,
    immunosuppression: String(obj.previous_immunosuppression) || 'false',
    immunoSpecify: obj.previous_immunosuppression_name || '',
    MED: obj.med ? Math.round(obj.med) : '',
    priorAK: String(obj.prior_treatment) || 'false',
    priorTreatmentDate: obj.prior_treatment_date
      ? getStringDateFormat(obj.prior_treatment_date)
      : null,
    clinicalComments: obj.clinical_comments || '',
  };
}

export type formatPatientDataType = ReturnType<typeof formatPatientEditDetails>;
