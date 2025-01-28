import i18next from 'i18next';
import assistedIcon from 'assets/images/ic_assisted.svg';
import ClinicIcon from 'assets/images/ic_clinic.jpeg';
import HybridIcon from 'assets/images/ic_hybrid.png';
import selfAppliedIcon from 'assets/images/ic_self_applied.svg';
import outOfClinicIcon from 'assets/images/ic_out_of_clinic.png';
import sunscreenNoneIcon from 'assets/images/ic_sunscreen_none.svg';
import sunscreenFullyIcon from 'assets/images/ic_sunscreen_fully.svg';
// import sunscreenPartialIcon from 'assets/images/ic_sunscreen_partial.svg';
import aktosisIcon from 'assets/images/ic_aktosis.jpeg';
import acheIcon from 'assets/images/ic_acne.jpeg';
import naturalPDTIcon from 'assets/images/ic_natdypdt.jpeg';
import conventionalPDTIcon from 'assets/images/ic_conventional.jpeg';
import artificialPDTIcon from 'assets/images/ic_artificial.jpeg';
import combinedPDTIcon from 'assets/images/ic_combined.png';
import skinAgeingIcon from 'assets/images/ic_skin_ageing.jpeg';
import bccIcon from 'assets/images/ic_bcc.jpeg';

import {
  ProdrugEnums,
  LampListEnums,
  EmollientEnums,
  SessionTypeEnums,
  DiseasesTypeEnums,
  FinishedReasonsEnums,
  ExpectedLocationEnums,
  SunscreenRequiredEnums,
} from './options.d';

const t = i18next?.t.bind(i18next);

export interface Option {
  label: string;
  id?: number | string;
  value: number | string | boolean;
}

export const staffType = [
  { value: 1, label: 'Doctor' },
  { value: 2, label: 'Nurse' },
  { value: 3, label: 'Technologist' },
  { value: 4, label: 'Medical Physicist' },
];

export const emollient = () => [
  { value: EmollientEnums.No, label: t('option.No_emollient') },
  { value: EmollientEnums.UreaCream, label: t('option.Urea_cream') },
  { value: EmollientEnums.Salycylic_Acid, label: t('option.Salicylic_acid') },
  { value: EmollientEnums.Vaseline, label: t('option.Vaseline') },
];

export const yesNo = () => [
  { value: 1, label: t('option.Yes') },
  { value: 0, label: t('option.No') },
];

export const yesNoBool = () => [
  { value: true, label: t('option.Yes') },
  { value: false, label: t('option.No') },
];

export const treatmentPreference = () => [
  { value: SessionTypeEnums.Assisted, label: t('treatment.assisted') },
  {
    value: SessionTypeEnums.FullyAssisted,
    label: t('treatment_fully_assisted'),
  },
  { value: SessionTypeEnums.SelfApplied, label: t('treatment.self_applied') },
];

export const sessionType = () => [
  {
    value: SessionTypeEnums.FullyAssisted,
    label: t('treatment_fully_assisted'),
    description: t('treatment.portal_only_info'),
    icon: HybridIcon,
  },
  {
    value: SessionTypeEnums.Assisted,
    label: t('treatment.assisted'),
    description: t('treatment.assisted_info'),
    icon: assistedIcon,
  },
  {
    value: SessionTypeEnums.SelfApplied,
    label: t('treatment.self_applied'),
    description: t('treatment.self_applied_info'),
    icon: selfAppliedIcon,
  },
];

export const sunscreenRequired = () => [
  {
    value: SunscreenRequiredEnums.Totally,
    label: t('yes-totally'),
    description: t('suncreen-applied-both-text'),
    icon: sunscreenFullyIcon,
  },
  // TODO: Currently not handled properly on the BE, so had to disable for now
  // {
  //   value: SunscreenRequiredEnums.Specifically,
  //   label: t('yes-partially'),
  //   description: t('suncreen-applied-on-sun-exposed-only'),
  //   icon: sunscreenPartialIcon,
  // },
  {
    value: SunscreenRequiredEnums.No,
    label: t('option.No'),
    description: t('suncreen-not-applied-at-all-text'),
    icon: sunscreenNoneIcon,
  },
];

export const diseasesTypes = () => [
  {
    value: DiseasesTypeEnums.AK,
    label: 'Actinic Keratosis',
    icon: aktosisIcon,
  },
  {
    value: DiseasesTypeEnums.Acne,
    label: 'Acne',
    icon: acheIcon,
  },
  {
    value: DiseasesTypeEnums.Bcc,
    label: 'Basal Cell Carcinoma (BCC)',
    icon: bccIcon,
    iconStyles: 'w-6 h-6',
  },
  {
    value: DiseasesTypeEnums.SkinAgeing,
    label: 'Skin Ageing',
    icon: skinAgeingIcon,
  },
];

export const diseaseProtocolsPredefined = () => [
  {
    value: DiseasesTypeEnums.AK,
    label: t('natural_dpt_protocol_for_ak'),
    description: t('natural_dpt_protocol_for_standard_description'),
  },
  {
    value: DiseasesTypeEnums.Acne,
    label: t('natural_dpt_protocol_for_acne'),
    description: t('natural_dpt_protocol_for_standard_description'),
  },
  {
    value: DiseasesTypeEnums.Bcc,
    label: t('natural_dpt_protocol_for_bcc'),
    description: t('natural_dpt_protocol_for_standard_description'),
  },
  {
    value: DiseasesTypeEnums.SkinAgeing,
    label: t('natural_dpt_protocol_for_skin_ageing'),
    description: t('natural_dpt_protocol_for_standard_description'),
  },
];

export const diseaseTypeTitle = () => [
  {
    value: DiseasesTypeEnums.AK,
    label: t('natural_pdt_session_for_ak'),
  },
  {
    value: DiseasesTypeEnums.Acne,
    label: t('natural_pdt_session_for_acne'),
  },
  {
    value: DiseasesTypeEnums.Bcc,
    label: t('natural_pdt_session_for_bcc'),
  },
  {
    value: DiseasesTypeEnums.SkinAgeing,
    label: t('natural_pdt_session_for_skin_ageing'),
  },
];

export const expectedLocationOptions = () => [
  {
    value: ExpectedLocationEnums.Clinic,
    label: t('option.Clinic'),
    description: t('pretreatment_and_exposure_in_clinic'),
    icon: ClinicIcon,
  },
  {
    value: ExpectedLocationEnums.Custom,
    label: t('option.Hybrid'),
    description: t('pretreatment_in_clinic'),
    icon: HybridIcon,
  },
  {
    value: ExpectedLocationEnums.Preferred,
    label: t('option.Out_of_clinic'),
    description: t('pretreatment_and_exposure_out_of_clinic'),
    icon: outOfClinicIcon,
  },
];

export const sessionTypeToLocationSource = () => [
  {
    value: SessionTypeEnums.FullyAssisted,
    label: t('option.Clinic'),
  },
  {
    value: SessionTypeEnums.Assisted,
    label: t('option.Hybrid'),
  },
  {
    value: SessionTypeEnums.SelfApplied,
    label: t('option.Out_of_clinic'),
  },
];

export const pdtTypes = () => [
  {
    value: 0,
    label: t('natural-daylight-pdt'),
    icon: naturalPDTIcon,
    isDisabled: false,
  },
  {
    value: 1,
    label: t('artificial-daylight-pdt'),
    icon: artificialPDTIcon,
    isDisabled: true,
  },
  {
    value: 2,
    label: t('conventional-pdt-title'),
    icon: conventionalPDTIcon,
    isDisabled: true,
  },
  {
    value: 3,
    label: t('combined_pdt_title'),
    icon: combinedPDTIcon,
    isDisabled: true,
    iconStyles: 'scale-[2.4]',
  },
];

export const artificialLamps = () => [
  {
    value: LampListEnums.Multilite,
    label: 'MultiLite (GME)',
  },
  {
    value: LampListEnums.Dermaris,
    label: 'Dermaris (Surgiris)',
  },
];

export const conventionalLamps = () => [
  {
    value: 1,
    label: 'MultiLite (GME)',
  },
  {
    value: 2,
    label: 'RhodoLED (Biofrontera)',
  },
  {
    value: 3,
    label: 'Aktilite (Galdema)',
  },
  {
    value: 4,
    label: 'Dermaris (Surgiris)',
  },
];

export const prodrug = () => [
  { value: ProdrugEnums.Photoxal8, label: 'Photoxal-8' },
  { value: ProdrugEnums.Metvix, label: 'Metvix® (MAL)' },
  { value: ProdrugEnums.Ameluz, label: 'Ameluz® (ALA)' },
  {
    value: ProdrugEnums.PPIX20Prodrug,
    label: '20% ALA PpIX prodrug (generic)',
  },
  {
    value: ProdrugEnums.PPIX10Prodrug,
    label: '10% ALA PpIX prodrug (generic)',
  },
];

export const quantityOfProdrug = () => [
  { value: 0.5, label: `0.5 ${t('option.unit')}` },
  { value: 1, label: `1 ${t('option.unit')}` },
  { value: 1.5, label: `1.5 ${t('option.units')}` },
  { value: 2, label: `2 ${t('option.units')}` },
];

export const gender = () => [
  { value: 1, label: t('option.Male') },
  { value: 2, label: t('option.Female') },
];

export const eyeColour = () => [
  { value: '0', color: '#97C8E4', label: t('option.Light_blue') },
  { value: '1', color: '#62979A', label: t('option.Blue_Green') },
  { value: '2', color: '#5A8B78', label: t('option.Green') },
  { value: '3', color: '#838B5A', label: t('option.Hazel') },
  { value: '4', color: '#5C3E29', label: t('option.Brown') },
  { value: '5', color: '#331A09', label: t('option.dark_brown') },
];

export const skinTone = () => [
  { value: '0', color: '#FADDCB', label: t('option.white') },
  { value: '1', color: '#EFC296', label: t('option.very_pale') },
  { value: '2', color: '#E2A87B', label: t('option.pale_tint') },
  { value: '3', color: '#D08B58', label: t('option.light_brown_or_olive') },
  { value: '4', color: '#8B5B3B', label: t('option.Brown') },
  { value: '5', color: '#5C3E29', label: t('option.dark_brown_or_black') },
];

export const hairColour = () => [
  { value: '0', color: '#BB551F', label: t('option.red') },
  { value: '1', color: '#F6D283', label: t('option.blonde') },
  { value: '2', color: '#B08657', label: t('option.light_brown') },
  { value: '3', color: '#8B5B3B', label: t('option.Brown') },
  { value: '4', color: '#5C3E29', label: t('option.dark_brown') },
  { value: '5', color: '#331A09', label: t('option.black') },
];

export const freckleDensity = () => [
  { value: 0, label: t('option.many') },
  { value: 1, label: t('option.several') },
  { value: 2, label: t('option.few') },
  { value: 3, label: t('option.None') },
];

export const tanFrequency = () => [
  { value: 0, label: t('option.never') },
  {
    value: 1,
    label: t('option.rarely'),
  },
  {
    value: 2,
    label: t('option.sometimes'),
  },
  {
    value: 3,
    label: t('option.often'),
  },
  {
    value: 4,
    label: t('option.always'),
  },
];

export const sunburnFrequency = () => [
  {
    value: 0,
    label: t('option.Always_sunburns'),
  },
  {
    value: 1,
    label: t('option.Sunburns_easily'),
  },
  { value: 2, label: t('option.Occasionally_sunburns') },
  { value: 3, label: t('option.Rarely_sunburns') },
  {
    value: 4,
    label: t('option.Very_rarely_sunburns'),
  },
  { value: 5, label: t('option.Never_burns') },
];

export const clinicalOutcome = () => [
  { value: null, label: t('option.outcome.pending') },
  { value: 0, label: t('option.outcome.no_response') },
  { value: 1, label: t('option.outcome.slight') },
  { value: 2, label: t('option.outcome.moderate') },
  { value: 3, label: t('option.outcome.good') },
  { value: 4, label: t('option.outcome.excellent') },
  { value: 5, label: t('option.outcome.clear') },
];

export const treatmentStatus = () => [
  { value: 1, label: t('treatment.booked') },
  { value: 2, label: t('Monitoring_.Ongoing') },
  { value: 3, label: t('Monitoring_.Complete') },
  { value: 4, label: t('treatment.interrupted') },
];

export const exposureType = () => [
  { value: 1, label: t('option.open') },
  { value: 2, label: t('option.shade') },
  { value: 3, label: t('option.conservatory') },
];

export const rescheduleReasons = () => [
  { value: 1, label: t('option.reschedule.overdue') },
  { value: 2, label: t('option.reschedule.session_under_30_minutes') },
  { value: 3, label: t('option.reschedule.requested_by_patient') },
  { value: 4, label: t('option.reschedule.weather_conditions') },
];

export const finishedReason = () => [
  {
    value: FinishedReasonsEnums.CancelledPatient,
    label: t('tag.cancelled_patient'),
  },
  {
    value: FinishedReasonsEnums.CancelledStaff,
    label: t('tag.cancelled_staff'),
  },
  { value: FinishedReasonsEnums.DeletedStaff, label: t('tag.cancelled_staff') },
  { value: FinishedReasonsEnums.CancelledExceededDli, label: t('tag.max_DLI') },
  { value: FinishedReasonsEnums.CancelledStaff, label: t('tag.overdue') },
  {
    value: FinishedReasonsEnums.CancelledWeather,
    label: t('tag.weather_conditions'),
  },
  { value: FinishedReasonsEnums.Complete, label: t('tag.complete') },
  {
    value: FinishedReasonsEnums.StoppedInsufficient,
    label: t('tag.cancelled_weather'),
  },
  {
    value: FinishedReasonsEnums.StoppedSunset,
    label: t('tag.cancelled_weather'),
  },
  {
    value: FinishedReasonsEnums.StoppedPatient,
    label: t('tag.cancelled_patient'),
  },
  {
    value: FinishedReasonsEnums.StoppedSunburn,
    label: t('tag.cancelled_sunburn'),
  },
];

export const subscriptionType = () => [
  { value: 0, label: t('subtype.Trial') },
  { value: 1, label: t('subtype.Full') },
  { value: 2, label: t('subtype.Galderma') },
];

export const bodySite = () => [
  { value: 1, label: t('area.scalp') },
  { value: 2, label: t('area.forehead') },
  { value: 3, label: t('area.left_cheek') },
  { value: 4, label: t('area.right_cheek') },
];

export const submissionType = () => [
  { value: 1, label: t('state.photo.patient_submitted') },
  { value: 2, label: t('state.photo.patient_submitted') },
  { value: 3, label: t('state.photo.patient_submitted') },
  { value: 4, label: t('state.photo.uploaded') },
];

export const areaExtent = () => [
  { value: 0, label: t('option.unaffected') },
  { value: 1, label: '1-9%' },
  { value: 2, label: '10-29%' },
  { value: 3, label: '30-49%' },
  { value: 4, label: '50-69%' },
  { value: 5, label: '70-89%' },
  { value: 6, label: '90-100%' },
];

export const akDistribution = () => [
  { value: 0, label: t('option.None') },
  { value: 1, label: t('option.isolated_scattered') },
  { value: 2, label: t('option.clustered') },
  { value: 3, label: t('option.clustered_confluent') },
  { value: 4, label: t('option.all_confluent') },
];

export const erythema = () => [
  { value: 0, label: t('option.None') },
  { value: 1, label: t('option.outcome.slight') },
  { value: 2, label: t('option.outcome.moderate') },
  { value: 3, label: t('option.intense') },
  { value: 4, label: t('option.very_intense') },
];

export const thickness = () => [
  { value: 0, label: t('option.no_palpability') },
  { value: 1, label: t('option.just_palpable') },
  { value: 2, label: t('option.clearly_palpable') },
  { value: 3, label: t('option.thickened') },
  { value: 4, label: t('option.very_thickened') },
];

export const lsrErythema = () => [
  { value: 0, label: t('option.not_present') },
  { value: 1, label: t('option.slightly_pink_less_50') },
  { value: 2, label: t('option.pink_more_50') },
  { value: 3, label: t('option.red_restricted') },
  { value: 4, label: t('option.red_extending') },
];
export const flaking = () => [
  { value: 0, label: t('option.not_present') },
  { value: 1, label: t('option.isolated_scale') },
  { value: 2, label: t('option.scale_less_50') },
  { value: 3, label: t('option.scale_more_50') },
  { value: 4, label: t('option.scale_extending') },
];
export const crusting = () => [
  { value: 0, label: t('option.not_present') },
  { value: 1, label: t('option.isolated_crusting') },
  { value: 2, label: t('option.crusting_less_50') },
  { value: 3, label: t('option.crusting_more_50') },
  { value: 4, label: t('option.crusting_extending') },
];
export const swelling = () => [
  { value: 0, label: t('option.not_present') },
  { value: 1, label: t('option.lesion_specific_oedema') },
  { value: 2, label: t('option.palpable_oedema') },
  { value: 3, label: t('option.confluent_visible') },
  { value: 4, label: t('option.marked_swelling') },
];
export const vesiculation = () => [
  { value: 0, label: t('option.not_present') },
  { value: 1, label: t('option.vesicles_only') },
  { value: 2, label: t('option.transudate_pustules') },
  { value: 3, label: t('option.transudate_pustules_50') },
  {
    value: 4,
    label: t('option.transudate_pustules_outside'),
  },
];
export const erosion = () => [
  { value: 0, label: t('option.not_present') },
  { value: 1, label: t('option.lesion_specific') },
  { value: 2, label: t('option.erosion_extending') },
  { value: 3, label: t('option.erosion_more_50') },
  { value: 4, label: t('option.black_eschar') },
];
