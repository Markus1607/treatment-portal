export enum ProtocolDetails {
  scrapingLesions = 'protocolDetails.scrapingLesions',
  minDuration = 'protocolDetails.minDuration',
  maxDuration = 'protocolDetails.maxDuration',
  accIndoorTime = 'protocolDetails.accIndoorTime',
  ppixDose = 'protocolDetails.ppixDose',
  minTemp = 'protocolDetails.minTemp',
  maxTemp = 'protocolDetails.maxTemp',
  minDrugLight = 'protocolDetails.minDrugLight',
  maxDrugLight = 'protocolDetails.maxDrugLight',
  emollient = 'protocolDetails.emollient',
  alcohol = 'protocolDetails.alcohol',
}

export enum ExpectedLocation {
  lat = 'expectedLocation.lat',
  lng = 'expectedLocation.lng',
  source = 'expectedLocation.source',
  address = 'expectedLocation.address',
  otherAddress = 'expectedLocation.otherAddress',
  otherAddressLat = 'expectedLocation.otherAddressLat',
  otherAddressLng = 'expectedLocation.otherAddressLng',
}

export enum SessionParams {
  protocolSelected = 'protocolSelected',
  patientID = 'patientID',
  sessionType = 'sessionType',
  prodrug = 'prodrug',
  sunscreenRequired = 'sunscreenRequired',
  sunscreenTypeUid = 'sunscreenTypeUid',
  fractionalLaser = 'fractionalLaser',
  microNeeding = 'microNeeding',
}

export const NaturalPDTFields = {
  ...SessionParams,
  expectedLocation: ExpectedLocation,
  protocolDetails: ProtocolDetails,
};

export enum SessionTypeEnum {
  FullyAssisted = 'fully_assisted',
  Assisted = 'assisted',
  SelfApplied = 'self_applied',
}

export type SessionTypeUnions = `${SessionTypeEnum}`;

export enum LocationSourceEnums {
  Clinic = 'clinic',
  Preferred = 'preferred',
  Custom = 'custom',
}

export type LocationSourceUnions = `${LocationSourceEnums}`;
