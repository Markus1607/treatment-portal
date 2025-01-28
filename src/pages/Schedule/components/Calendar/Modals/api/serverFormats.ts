export type TreatmentType = {
  name?: string;
  instituionID?: number;
  preStartTime?: number;
  startTime?: number;
  endTime?: number;
  sessionUid: string;
  protocolSelected: string;
  patientID: string;
  sessionType: string | null;
  expectedLocation: {
    address: string;
    lat: string | number;
    lng: string | number;
    source: string;
  };
  prodrug: string;
  sunscreenRequired: string;
  sunscreenTypeUid: string;
  fractionalLaser: string;
  microNeeding: string;
  protocolDetails: {
    scrapingLesions: string;
    minDuration: string | number;
    maxDuration: string | number;
    accIndoorTime: string | number;
    ppixDose: string | number;
    minTemp: string | number;
    maxTemp: string | number;
    minDrugLight: string | number;
    maxDrugLight: string | number;
    emollient: string;
    alcohol: string;
  };
};

export const formatPostTreatment = (obj: TreatmentType) => {
  return {
    scheduled_start_time: Number(obj.startTime),
    expected_end_time: Number(obj.endTime),
    settings: {
      prodrug: obj.prodrug,
      micro_needing: obj.microNeeding === 'true',
      frac_laser: obj.fractionalLaser === 'true',
      alcohol: obj.protocolDetails.alcohol === 'true',
      emollient: obj.protocolDetails.emollient,
      skin_lesion_scraping: obj.protocolDetails.scrapingLesions === 'true',
      sunscreen_req: obj.sunscreenRequired,
      sunscreen_uid:
        obj.sunscreenTypeUid === 'no' ? null : obj.sunscreenTypeUid,
      min_dli: Number(obj.protocolDetails.minDrugLight)
        ? Number(obj.protocolDetails.minDrugLight) * 60
        : 0,
      max_dli: Number(obj.protocolDetails.maxDrugLight)
        ? Number(obj.protocolDetails.maxDrugLight) * 60
        : 0,
      min_temp: Number(obj.protocolDetails.minTemp)
        ? Number(obj.protocolDetails.minTemp)
        : 0,
      min_utci: 10,
      max_utci: 40,
      max_temp: Number(obj.protocolDetails.maxTemp)
        ? Number(obj.protocolDetails.maxTemp)
        : 0,
      min_ppix_dose:
        Number(obj.protocolDetails.ppixDose) > 0
          ? Number(obj.protocolDetails.ppixDose) * 10000
          : 0,
      min_exposure_time: Number(obj.protocolDetails.minDuration)
        ? Number(obj.protocolDetails.minDuration) * 60
        : 0,
      max_exposure_time: Number(obj.protocolDetails.maxDuration)
        ? Number(obj.protocolDetails.maxDuration) * 60
        : 0,
      indoor_time_allowed: Number(obj.protocolDetails.accIndoorTime)
        ? Number(obj.protocolDetails.accIndoorTime) * 60
        : 0,
      session_type: obj.sessionType,
      lat: parseFloat(`${obj.expectedLocation.lat}`),
      lon: parseFloat(`${obj.expectedLocation.lng}`),
      address: obj.expectedLocation.address,
      source: obj.expectedLocation.source || 'custom',
      prt_uid: obj.protocolSelected,
    },
  };
};

export type PostTreatmentDataType = ReturnType<typeof formatPostTreatment>;
