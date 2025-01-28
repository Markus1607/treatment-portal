import Crumb from './Crumb';
import * as route from 'routes';
import { BreadcrumbsRoute } from 'react-router-breadcrumbs-hoc';

export const config: BreadcrumbsRoute[] = [
  /**
   **  Excluded routes - a.k.a routes with no breabcrumbs
   */

  { path: '/' },

  /**
   **  Main navigation routes
   */
  {
    path: route.admin,
    title: '',
    breadcrumb: Crumb,
  },
  {
    path: route.patients,
    title: 'Patient_records_patient',
    breadcrumb: Crumb,
  },
  {
    path: route.protocol,
    title: 'Dashboard.Protocol',
    breadcrumb: Crumb,
  },
  {
    path: route.staff,
    title: 'Dashboard.Staff',
    breadcrumb: Crumb,
  },
  {
    path: route.staffEdit,
    title: 'Staff.Edit',
    breadcrumb: Crumb,
  },
  {
    path: route.staffBilling,
    title: 'Dashboard.Admin',
    breadcrumb: Crumb,
  },

  /**
   **  Patient profile nested page routes
   */
  {
    path: route.patientRegister,
    title: 'Add_patients.page_title',
    breadcrumb: Crumb,
  },
  {
    path: route.patientDetailsUrl,
    title: 'Patient_details.page_title',
    breadcrumb: Crumb,
  },
  {
    path: route.patientOverviewUrl,
    title: 'Patient_details.Overview',
    breadcrumb: Crumb,
  },
  {
    path: route.patientScheduleUrl,
    title: 'Patient_details.scheduling',
    breadcrumb: Crumb,
  },
  {
    path: route.patientPhotosUrl,
    title: 'Patient.Photos',
    breadcrumb: Crumb,
  },
  {
    path: route.photoGallery,
    title: 'option.gallery',
    breadcrumb: Crumb,
  },

  /**
   **  Scheduling sub routes
   */
  {
    path: route.newSession,
    title: 'New_session_title',
    breadcrumb: Crumb,
  },

  /**
   **  User profile menu
   */
  {
    path: route.profile,
    title: 'Dashboard.Profile',
    breadcrumb: Crumb,
  },
  {
    path: route.systemInfo,
    title: 'System_information.page_title',
    breadcrumb: Crumb,
  },
  {
    path: route.termOfUse,
    title: 'terms_of_use.header',
    breadcrumb: Crumb,
  },

  /**
   **  Instituition Protocols
   */

  {
    path: route.naturalDPDT,
    title: 'breadcrumb-natural-dpt',
    breadcrumb: Crumb,
  },
  {
    path: route.artificialDPDT,
    title: 'breadcrumb-artificial-dpt',
    breadcrumb: Crumb,
  },

  {
    path: route.conventionalDPDT,
    title: 'breadcrumb-conventional-dpt',
    breadcrumb: Crumb,
  },

  {
    path: route.naturalDPDTNew,
    title: 'breadcrumb-pdt-new',
    breadcrumb: Crumb,
  },
  {
    path: route.artificialDPDTNew,
    title: 'breadcrumb-pdt-new',
    breadcrumb: Crumb,
  },
  {
    path: route.conventionalDPDTNew,
    title: 'breadcrumb-pdt-new',
    breadcrumb: Crumb,
  },
  {
    path: route.diseaseNatDpdtProtocol(''),
    title: 'breadcrumb-pdt-edit',
    breadcrumb: Crumb,
  },
  {
    path: route.naturalDPDTEdit(''),
    title: 'breadcrumb-pdt-edit',
    breadcrumb: Crumb,
  },
  {
    path: route.artificialDPDTEdit,
    title: 'breadcrumb-pdt-edit',
    breadcrumb: Crumb,
  },
  {
    path: route.conventionalDPDTEdit,
    title: 'breadcrumb-pdt-edit',
    breadcrumb: Crumb,
  },
];
