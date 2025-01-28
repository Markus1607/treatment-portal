import {
  formatBEPutPhoto,
  formatBEPostPhotos,
  formatResponseData,
} from './format';

export type PhotosResponseType = {
  photos: PhotoDetailsResponseType[];
};

export type PhotoDetailsResponseType = {
  akasi_area_extent: number | null;
  akasi_distribution: number | null;
  akasi_erythema: number | null;
  akasi_sub_score: number | null;
  akasi_thickness: number | null;
  body_site: number;
  date_taken: number;
  uid: string;
  image_data: string | null;
  lsr_crusting: number | null;
  lsr_erosion: number | null;
  lsr_erythema: number | null;
  lsr_image_score: number;
  lsr_scaling: number | null;
  lsr_swelling: number | null;
  lsr_vesiculation: number | null;
  patient_comments: string;
  ses_uid: null | string;
  staff_comments: string;
  upload_source: number;
  format: string;
  name: string;
};

export type PhotoEditDetailsResponseType = {
  photo: PhotoDetailsResponseType;
};

export type DefaultPhotosValuesType = {
  photoUid: string;
  image: string;
  bodySite: string | number;
  submissionType: string | number;
  dateTaken: Date | string;
  bodySiteText?: string;
  dateTakenText?: string;
  sessionId: string | number;
  patientComments: string;
  clinicalComments: string;
  akasiSubScore: number;
  lsrTotalScore: number;
  akasiAreaExtent: string;
  akasiDistribution: string;
  akasiErythema: string;
  akasiThickness: string;
  lsrErythema: string;
  lsrScaling: string;
  lsrCrusting: string;
  lsrSwelling: string;
  lsrVesiculation: string;
  lsrErosion: string;
  format?: string;
};

export type PostPhotosDataType = ReturnType<typeof formatBEPostPhotos>;

export type EditedPhotoDataType = ReturnType<typeof formatBEPutPhoto>;

export type FormattedPhotosType = ReturnType<typeof formatResponseData>;

export type PhotoDeleteResponse = {
  message: string;
  debug: Debug;
};

export type Debug = {
  uid: string;
};
