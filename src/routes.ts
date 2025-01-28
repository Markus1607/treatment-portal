/**
 * * ========== ROUTES CONSTANTS ==========
 */
export const photos = 'photos';
export const schedule = 'schedule';
export const overview = 'overview';
export const records = 'records';
export const details = 'details';
export const analysis = 'analysis';
export const gallery = 'gallery';
export const iframe = 'iframe';
export const treatments = 'treatments';
export const photoDefaultPage = 'photos/gallery';

/**
 * * =================== FRONTEND PAGE ROUTES ===================
 */
export const institutions = '/institutions';
export const resetPassword = '/resetpassword';
export const createPassword = '/createpassword';
export const forgotPassword = '/forgotpassword';
export const privacyPolicy = '/privacy-policy';
export const submitFeedback = '/feedback';
export const help = '/help';
export const aboutUs = '/about_us';
export const loginAdmin = '/admin';
export const loginStaff = '/staff';
export const dashboard = '/dashboard';
export const patients = '/patients';
export const monitoring = '/monitoring';
export const scheduling = '/scheduling';
export const weather = '/weather';
export const summary = '/summary';
export const protocol = '/protocol';
export const staff = '/staff-members';
export const admin = '/admin_user';
export const profile = '/profile';
export const portal = '/portal';

export const newSession = `${scheduling}/new-session`;

export const patientProfile = `${patients}/:id`;
export const patientRegister = `${patients}/register`;
export const iframeRoute = `${patients}/:id/${iframe}`;
export const patientPhotosUrl = `${patients}/:id/${photos}`;
export const patientOverviewUrl = `${patients}/:id/${overview}`;
export const patientScheduleUrl = `${patients}/:id/${schedule}`;
export const patientDetailsUrl = `${patients}/:id/${details}`;
export const patientTreatmentsUrl = `${patients}/:id/${treatments}`;
export const patientCertificateUrl = `${patients}/:id/certificate`;

export const photoGallery = `${patients}/:id/${photos}/${gallery}`;
export const photoAnalysis = `${patients}/:id/${photos}/${analysis}`;

export const staffBilling = `${admin}/billing`;
export const staffSettings = `${admin}/settings`;
export const staffRegister = `${staff}/register`;
export const staffEdit = `${staff}/edit`;

export const systemInfo = `/system-information`;
export const termOfUse = `/terms-of-use`;

//* Protocol routes
export const naturalDPDT = `${protocol}/natural-dpdt`;
export const artificialDPDT = `${protocol}/artificial-dpdt`;
export const conventionalDPDT = `${protocol}/conventional-pdt`;
export const combinedDPDT = `${protocol}/combined-pdt`;

export const diseaseNatDpdtProtocol = (diseaseName: string) =>
  `${naturalDPDT}/:${diseaseName}`;

export const naturalDPDTEdit = (diseaseName: string) =>
  `${naturalDPDT}/${diseaseName}/:id/edit`;
export const naturalDPDTIdEdit = (diseaseName: string) =>
  `${naturalDPDT}/${diseaseName}/:id`;
export const artificialDPDTEdit = `${artificialDPDT}/:id/edit`;
export const conventionalDPDTEdit = `${conventionalDPDT}/:id/edit`;
export const combinedDPDTEdit = `${combinedDPDT}/:id/edit`;

export const naturalDPDTNew = `${naturalDPDT}/new`;
export const artificialDPDTNew = `${artificialDPDT}/new`;
export const conventionalDPDTNew = `${conventionalDPDT}/new`;
export const combinedDPDTNew = `${combinedDPDT}/new`;

/**
 * *  ================== BACKEND API ROUTES ======================
 */
// * ================== ROUTES PREFIXES ======================
//* admins
export const systemAdmin = '/system/admin';

//* staff
export const staffMember = 'staff-member';
export const staffTreatment = '/staff/treatment';
export const treatmentStaff = '/treatment/staff';
export const signUpStaff = `/${staffMember}/staff-members`;
export const staffPatientRoute = `/${staffMember}/patients`;
export const portalStaffMember = `/portal/${staffMember}`;

// * ================== ROUTES PREFIXES ======================

//* admin login
export const getSaltAdminUrl = `${systemAdmin}/connect`;
export const adminLoginUrl = `${systemAdmin}/login`;

//* admin logout
export const adminLogoutUrl = `/admin/logout`;

//* staff login
export const getSaltStaffUrl = `${portalStaffMember}/connect`;
export const staffLoginUrl = `${portalStaffMember}/login`;

//* staff logout
export const staffLogoutUrl = `${staffMember}/logout`;

//* super admin route
export const adminInstitution = '/admin/institutions';

//* staff institution edits
export const staffInstitution = `${staffMember}/institution`;

//* staff administrations
export const staffOptionsUrl = (staffUid: string) =>
  `${signUpStaff}/${staffUid}`;

//* password resets
export const staffPasswordUrl = `${portalStaffMember}/reset-password`;
export const forgotPasswordUrl = (email: string) =>
  `${staffPasswordUrl}?login_id=${email}`;
export const patientPasswordReset = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/account/reset-password`;

//* staff questionnaire
export const postFeedback = `/${staffMember}/feedback`;

//* patient records
export const patientTreatmentHistory = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/treatment/history`;
export const treatmentReportFinished = '/treatment/report/finished';
export const treatmentSessionFeedbackStaff = `${staffTreatment}/feedback/staff`;
export const getCompletedTreatmentReport = (sessionUid: string) =>
  `${staffPatientRoute}/sessions/${sessionUid}/reports/complete`;

//* monitoring and begin treatment
export const treatmentReportOngoing = '/treatment/report/ongoing';
export const getAllTreatmentSessions = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/sessions`;
export const getTreatmentProgress = (sessionUid: string) =>
  `${staffPatientRoute}/sessions/${sessionUid}/progress`;
export const beginSessionEndpoint = (sessionUid: string) =>
  `${staffPatientRoute}/sessions/${sessionUid}/start`;
export const stopSessionEndpoint = (sessionUid: string) =>
  `${staffPatientRoute}/sessions/${sessionUid}/stop`;
export const pauseSessionEndpoint = (sessionUid: string) =>
  `${staffPatientRoute}/sessions/${sessionUid}/pause`;
export const getOngoingSessionReport = (sessionUid: string) =>
  `${staffPatientRoute}/sessions/${sessionUid}/reports/ongoing`;
export const updateSessionProgressEndpoint = (sessionUid: string) =>
  `${staffPatientRoute}/sessions/${sessionUid}/progress`;

//* patient photos
export const photosEndpoint = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/photos`;

export const photoEditEndpoint = (photoUid: string) =>
  `${staffPatientRoute}/photos/${photoUid}`;

//* protocol endpoints
export const protocolsEndpoint = `${staffMember}/protocols`;
export const protocolDetailsEndpoint = (protocolUid: string) =>
  `${staffMember}/protocols/${protocolUid}`;
export const postProtocolTypeEndpoint = (type: string) =>
  `${staffMember}/protocols/${type}`;

//* edit protocol endpoints
export const editProtocolEndpoint = (protocolUid: string) =>
  `${staffMember}/protocols/${protocolUid}`;
export const setDefaultProtocolEndpoint = (
  diseaseUid: string,
  protocolUid: string
) => `${staffMember}/protocols/${diseaseUid}/${protocolUid}/default`;
export const resetToDefaultProtocolEndpoint = (protocolUid: string) =>
  `${staffMember}/protocols/${protocolUid}/reset-default`;

//* get diseases list
export const diseasesEndpoint = `${staffMember}/diseases`;

//* Get patient sessions
export const sessionsEndpoint = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/sessions`;

//* scheduling endpoints
export const sunscreenEndpoint = `/${staffMember}/sunscreens`; //? GET sunscreen list
export const amendSessionEndpoint = `${staffPatientRoute}/sessions`; //? PUT & DELETE

//* get session details
export const sessionDetailsEndpoint = (sessionUid: string) =>
  `${staffPatientRoute}/sessions/${sessionUid}`;
export const naturalPDTCalendarApiUrl = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/calendars/natdypdt/slots`;

export const naturalPDTCalendarCustomTimeApiUrl = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/calendars/natdypdt/slot`;
export const naturalPDTSchedulingEndpoint = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/sessions/natdypdt`;
export const ArtificialSchedulingEndpoint = (patientUid: string) =>
  `${staffPatientRoute}/${patientUid}/sessions/artdypdt`;

//* patient certificate pdf
export const patientCertificate = (session_uid: string) =>
  `${staffPatientRoute}/sessions/${session_uid}/certificate`;

//* patient information pdf
export const treatmentInformation = (session_uid: string) =>
  `${staffPatientRoute}/sessions/${session_uid}/information`;
