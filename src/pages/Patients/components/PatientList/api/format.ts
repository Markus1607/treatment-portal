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
import { AllPatientList, Patient } from '../../../types';
import { getLabelFromKey, getDateFromUnix } from 'utils/functions';

export function formatPatientData(patient: Patient) {
  return {
    id: patient.id,
    uid: patient.uid,
    gender: getLabelFromKey(patient.gender, gender()),
    yearOfBirth: patient.year_of_birth || '-',
    dateAdded: getDateFromUnix(patient.created_at, 'DD MMM YYYY'),
    skinColour: getLabelFromKey(String(patient.skin_colour), skinTone()),
    hairColour: getLabelFromKey(
      String(patient.natural_hair_colour),
      hairColour()
    ),
    eyeColour: getLabelFromKey(String(patient.natural_eye_colour), eyeColour()),
    freckleDensity: getLabelFromKey(patient.freckle_density, freckleDensity()),
    sunburnFrequency: getLabelFromKey(
      patient.sunburn_frequency,
      sunburnFrequency()
    ),
    tanFrequency: getLabelFromKey(patient.tan_frequency, tanFrequency()),
    prevImmunosuppression: getLabelFromKey(
      patient.previous_immunosuppression,
      yesNoBool()
    ),
    MED: patient.med ? Math.round(patient.med) : '-',
    priorTreatment: getLabelFromKey(patient.prior_treatment, yesNoBool()),
    priorTreatmentDate: patient.prior_treatment_date
      ? getDateFromUnix(patient.prior_treatment_date, 'DD/MM/YYYY')
      : '-',
    clinicalComments: patient.clinical_comments || '',
  };
}

export type FormattedPatientType = ReturnType<typeof formatPatientData>;

type AllPatientsListType = AllPatientList['patients'];

export function formatPatientsData(arr: AllPatientsListType) {
  const results = arr && arr.map((patient) => formatPatientData(patient));
  return results;
}

export const patientIdList = (data: AllPatientsListType) => {
  if (!Array.isArray(data)) return [];
  return data.map((patient) => ({
    uid: patient.uid,
    label: `ID: ${patient.id}`,
  }));
};
