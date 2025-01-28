export type AllPatientList = {
  patients: Patient[];
};

export type PatientDataResponseType = {
  patient: Patient;
};

export type Patient = {
  alias: null | string;
  clinical_comments: null | string;
  created_at: number;
  fitzpatrick_phototype: number | null;
  freckle_density: number;
  gender: number;
  id: number;
  ins_uid: string;
  med: number;
  med_generated: boolean;
  natural_eye_colour: number;
  natural_hair_colour: number;
  pp_accepted: boolean;
  previous_cancer: number;
  previous_cancer_text: string;
  previous_immunosuppression: boolean;
  previous_immunosuppression_name: string;
  prior_treatment: boolean;
  prior_treatment_date: number;
  skin_colour: number;
  stm_uid: string;
  sunburn_frequency: number;
  tan_frequency: number;
  tou_accepted: number;
  uid: string;
  username: string;
  year_of_birth: number | null;
};

export type UserPasswordResetResponse = {
  credentials: {
    username: string;
    password: string;
  };
};

export type DeletedPatientResponse = {
  debug: Patient;
  message: string;
};

export type RegistedUserResponse = {
  patient: Patient;
  credentials: UserPasswordResetResponse['credentials'];
};
