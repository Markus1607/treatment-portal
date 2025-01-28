export enum SessionTypeEnums {
  Assisted = 'assisted',
  SelfApplied = 'self_applied',
  FullyAssisted = 'fully_assisted',
}

export type SessionTypeOptions = `${SessionTypeEnums}`;

export enum SunscreenRequiredEnums {
  Totally = 'totally',
  Specifically = 'specifically',
  No = 'no',
}

export enum DiseasesTypeEnums {
  AK = 'actinick',
  Acne = 'acnespdt',
  Bcc = 'basalcca',
  SkinAgeing = 'skinagei',
}

export type DiseasesTypeOptions = `${DiseasesTypeEnums}`;

export type SunscreenRequiredOptions = `${SunscreenRequiredEnums}`;

export enum ExpectedLocationEnums {
  Clinic = 'clinic',
  Preferred = 'preferred',
  Custom = 'custom',
}

export type ExpectedLocationOptions = `${ExpectedLocationEnums}`;

export enum EmollientEnums {
  No = 'no',
  UreaCream = 'urea_cream',
  Salycylic_Acid = 'salycylic_acid',
  Vaseline = 'vaseline',
}

export type EmollientOptions = `${EmollientEnums}`;

export enum ProdrugEnums {
  Metvix = 'metvix',
  Ameluz = 'ameluz',
  Photoxal8 = 'photoxal_8',
  PPIX20Prodrug = 'ppix_prodrug_20',
  PPIX10Prodrug = 'ppix_prodrug_10',
}

export type ProdrugOptions = `${ProdrugEnums}`;

export enum LampListEnums {
  Multilite = 'multilite',
  Dermaris = 'dermaris',
}

export type LampListOptions = `${LampListEnums}`;

export enum FinishedReasonsEnums {
  CancelledPatient = 'cancelled_patient',
  CancelledStaff = 'cancelled_staff_member',
  DeletedStaff = 'deleted_staff_member',
  CancelledExceededDli = 'cancelled_exceeded_dli',
  CancelledOverdue = 'cancelled_overdue',
  CancelledWeather = 'cancelled_weather',
  Complete = 'complete',
  StoppedInsufficient = 'stopped_insufficient',
  StoppedSunset = 'stopped_sunset',
  StoppedPatient = 'stopped_patient',
  StoppedSunburn = 'stopped_sunburn',
}

export type FinishedReasonsOptions = `${FinishedReasonsEnums}`;
