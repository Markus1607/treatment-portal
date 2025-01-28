import { isNumber, isString } from 'lodash';
import {
  getDateFromUnix,
  getISODateFormat,
  getLabelFromKey,
  getStringDateFormat,
} from 'utils/functions';
import { bodySite } from 'utils/options';
import { DefaultPhotosValuesType, PhotoDetailsResponseType } from './api.d';

export const defaultValues: DefaultPhotosValuesType = {
  photoUid: '',
  image: '',
  bodySite: '',
  submissionType: '',
  dateTaken: new Date(),
  sessionId: '',
  patientComments: '',
  clinicalComments: '',
  akasiSubScore: 0,
  lsrTotalScore: 0,
  akasiAreaExtent: '',
  akasiDistribution: '',
  akasiErythema: '',
  akasiThickness: '',
  lsrErythema: '',
  lsrScaling: '',
  lsrCrusting: '',
  lsrSwelling: '',
  lsrVesiculation: '',
  lsrErosion: '',
};

export const formatPatientPhotos = (data: PhotoDetailsResponseType[]) => {
  return data.map((photo) => {
    return {
      photoUid: photo?.uid,
      bodySite: photo?.body_site,
      image: photo?.image_data || null,
      bodySiteText: getLabelFromKey(photo?.body_site, bodySite()),
      submissionType: photo?.upload_source,
      dateTaken: getStringDateFormat(photo?.date_taken),
      dateTakenText: getDateFromUnix(photo?.date_taken, 'DD/MM/YYYY'),
      sessionId: photo?.ses_uid || '',
      patientComments: photo?.patient_comments || '',
      clinicalComments: photo?.staff_comments || '',
      akasiSubScore: photo?.akasi_sub_score || 0,
      lsrTotalScore: photo?.lsr_image_score || 0,
      akasiAreaExtent: isNumber(photo.akasi_area_extent)
        ? photo.akasi_area_extent
        : '',
      akasiDistribution: isNumber(photo.akasi_distribution)
        ? photo.akasi_distribution
        : '',
      akasiErythema: isNumber(photo.akasi_erythema) ? photo.akasi_erythema : '',
      akasiThickness: isNumber(photo.akasi_thickness)
        ? photo.akasi_thickness
        : '',
      lsrErythema: isNumber(photo.lsr_erythema) ? photo.lsr_erythema : '',
      lsrScaling: isNumber(photo.lsr_scaling) ? photo.lsr_scaling : '',
      lsrCrusting: isNumber(photo.lsr_crusting) ? photo.lsr_crusting : '',
      lsrSwelling: isNumber(photo.lsr_swelling) ? photo.lsr_swelling : '',
      lsrVesiculation: isNumber(photo.lsr_vesiculation)
        ? photo.lsr_vesiculation
        : '',
      lsrErosion: isNumber(photo.lsr_erosion) ? photo.lsr_erosion : '',
    };
  });
};

export const formatBEPostPhotos = (
  data: DefaultPhotosValuesType,
  akasiScore: number,
  lsrScore: number
) => {
  return {
    photos: [
      {
        body_site: Number(data?.bodySite),
        date_taken:
          data?.dateTaken instanceof Date
            ? getISODateFormat(data?.dateTaken)
            : 0,
        patient_comments: data?.patientComments || '',
        staff_comments: data?.clinicalComments || '',
        format: data?.format || 'png',
        ...(data?.image && {
          image_data: data?.image,
        }),
        ...(isNumber(akasiScore) && {
          akasi_sub_score: parseFloat(akasiScore.toFixed(1)),
        }),
        ...(data?.akasiAreaExtent && {
          akasi_area_extent: Number(data?.akasiAreaExtent),
        }),
        ...(data?.akasiDistribution && {
          akasi_distribution: Number(data?.akasiDistribution),
        }),
        ...(data?.akasiErythema && {
          akasi_erythema: Number(data?.akasiErythema),
        }),
        ...(data?.akasiThickness && {
          akasi_thickness: Number(data?.akasiThickness),
        }),
        ...(data?.akasiThickness && {
          akasi_thickness: Number(data?.akasiThickness),
        }),
        ...(isNumber(lsrScore) && {
          lsr_image_score: lsrScore,
        }),
        ...(data?.lsrErythema && { lsr_erythema: Number(data?.lsrErythema) }),
        ...(data?.lsrScaling && { lsr_scaling: Number(data?.lsrScaling) }),
        ...(data?.lsrCrusting && { lsr_crusting: Number(data?.lsrCrusting) }),
        ...(data?.lsrSwelling && { lsr_swelling: Number(data?.lsrSwelling) }),
        ...(data?.lsrVesiculation && {
          lsr_vesiculation: Number(data?.lsrVesiculation),
        }),
        ...(data?.lsrErosion && { lsr_erosion: Number(data?.lsrErosion) }),
      },
    ],
  };
};

export const formatBEPutPhoto = (
  data: DefaultPhotosValuesType,
  akasiScore: number,
  lsrScore: number
) => {
  return {
    body_site: Number(data?.bodySite),
    date_taken:
      data?.dateTaken instanceof Date ? getISODateFormat(data?.dateTaken) : 0,
    patient_comments: data?.patientComments || '',
    staff_comments: data?.clinicalComments || '',
    ...(isString(data?.photoUid) === false && {
      image_data: data?.image,
    }),
    ...(isNumber(akasiScore) && {
      akasi_sub_score: parseFloat(akasiScore.toFixed(1)),
    }),
    ...(data?.akasiAreaExtent && {
      akasi_area_extent: Number(data?.akasiAreaExtent),
    }),
    ...(data?.akasiDistribution && {
      akasi_distribution: Number(data?.akasiDistribution),
    }),
    ...(data?.akasiErythema && {
      akasi_erythema: Number(data?.akasiErythema),
    }),
    ...(data?.akasiThickness && {
      akasi_thickness: Number(data?.akasiThickness),
    }),
    ...(data?.akasiThickness && {
      akasi_thickness: Number(data?.akasiThickness),
    }),
    ...(isNumber(lsrScore) && {
      lsr_image_score: lsrScore,
    }),
    ...(data?.lsrErythema && { lsr_erythema: Number(data?.lsrErythema) }),
    ...(data?.lsrScaling && { lsr_scaling: Number(data?.lsrScaling) }),
    ...(data?.lsrCrusting && { lsr_crusting: Number(data?.lsrCrusting) }),
    ...(data?.lsrSwelling && { lsr_swelling: Number(data?.lsrSwelling) }),
    ...(data?.lsrVesiculation && {
      lsr_vesiculation: Number(data?.lsrVesiculation),
    }),
    ...(data?.lsrErosion && { lsr_erosion: Number(data?.lsrErosion) }),
  };
};

export const formatResponseData = (
  data: PhotoDetailsResponseType,
  image: string
) => {
  return {
    image,
    photoUid: data?.uid,
    bodySite: data?.body_site,
    bodySiteText: getLabelFromKey(data?.body_site, bodySite()),
    submissionType: data?.upload_source,
    dateTaken: getStringDateFormat(data?.date_taken),
    dateTakenText: getDateFromUnix(data?.date_taken, 'DD/MM/YYYY'),
    sessionId: data?.ses_uid || '',
    patientComments: data?.patient_comments || '',
    clinicalComments: data?.staff_comments || '',
    akasiSubScore: data?.akasi_sub_score || 0,
    lsrTotalScore: data?.lsr_image_score || 0,
    akasiAreaExtent: isNumber(data.akasi_area_extent)
      ? data.akasi_area_extent
      : '',
    akasiDistribution: isNumber(data.akasi_distribution)
      ? data.akasi_distribution
      : '',
    akasiErythema: isNumber(data.akasi_erythema) ? data.akasi_erythema : '',
    akasiThickness: isNumber(data.akasi_thickness) ? data.akasi_thickness : '',
    lsrErythema: isNumber(data.lsr_erythema) ? data.lsr_erythema : '',
    lsrScaling: isNumber(data.lsr_scaling) ? data.lsr_scaling : '',
    lsrCrusting: isNumber(data.lsr_crusting) ? data.lsr_crusting : '',
    lsrSwelling: isNumber(data.lsr_swelling) ? data.lsr_swelling : '',
    lsrVesiculation: isNumber(data.lsr_vesiculation)
      ? data.lsr_vesiculation
      : '',
    lsrErosion: isNumber(data.lsr_erosion) ? data.lsr_erosion : '',
  };
};
