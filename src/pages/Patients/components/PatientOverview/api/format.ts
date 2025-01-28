import { getLabelFromKey, getDateFromUnix } from 'utils/functions';
import {
  gender,
  skinTone,
  yesNoBool,
  hairColour,
  eyeColour,
  tanFrequency,
  freckleDensity,
  sunburnFrequency,
} from 'utils/options';
import { Patient } from '../../../types';

export function formatPatientData(obj: Patient) {
  return {
    id: obj.id,
    uid: obj.uid,
    alias: obj.alias || '-',
    gender: getLabelFromKey(obj.gender, gender()),
    yearOfBirth: obj.year_of_birth || '-',
    createdAt: getDateFromUnix(obj.created_at, 'DD/MM/YYYY'),
    skinColour: getLabelFromKey(String(obj.skin_colour), skinTone()),
    hairColour: getLabelFromKey(String(obj.natural_hair_colour), hairColour()),
    eyeColour: getLabelFromKey(String(obj.natural_eye_colour), eyeColour()),
    freckleDensity: getLabelFromKey(obj.freckle_density, freckleDensity()),
    sunburnFrequency: getLabelFromKey(
      obj.sunburn_frequency,
      sunburnFrequency()
    ),
    tanFrequency: getLabelFromKey(obj.tan_frequency, tanFrequency()),
    prevImmunosuppression: getLabelFromKey(
      obj.previous_immunosuppression,
      yesNoBool()
    ),
    MED: obj.med ? Math.round(obj.med) : '-',
    priorTreatment: getLabelFromKey(obj.prior_treatment, yesNoBool()),
    priorTreatmentDate: obj.prior_treatment_date
      ? getDateFromUnix(obj.prior_treatment_date)
      : '-',
    clinicalComments: obj.clinical_comments || '',
  };
}
