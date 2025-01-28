import { useCallback, Suspense, useRef, lazy } from 'react';
import { Link, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { includes, uniqueId } from 'lodash';
import { AppProvider } from 'AppProvider';
import { ClipLoader } from 'components/Loader';
import {
  photos,
  gallery,
  schedule,
  patients,
  details,
  overview,
  treatments,
  photoGallery,
  photoAnalysis,
  patientPhotosUrl,
  patientDetailsUrl,
  patientScheduleUrl,
  patientOverviewUrl,
  patientTreatmentsUrl,
} from 'routes';

export default function PatientFile() {
  const subPage = useRef('');
  const location = useLocation();
  const {
    t,
    currentPatientUid,
    currentPatientUsername: patientUsername,
  } = AppProvider.useContainer();

  const setSubTitle = useCallback(
    (value: string) => {
      subPage.current = value;
      document.title = `${t(
        'Patient_records_patient'
      )} > ${patientUsername} > ${subPage.current}`;
    },
    [t, subPage, patientUsername]
  );

  const isSelectedPage = (pageName: string) => {
    return includes(location.pathname, pageName);
  };

  const navLinks = [
    {
      to: `${patients}/${patientUsername}/${overview}`,
      isSelected: isSelectedPage(overview) || isSelectedPage(details),
      text: t('Patient_details.Overview'),
    },
    {
      to: `${patients}/${patientUsername}/${schedule}`,
      isSelected: isSelectedPage(schedule),
      text: t('Summary.Scheduling'),
    },
    {
      to: `${patients}/${patientUsername}/${treatments}`,
      isSelected: isSelectedPage(treatments),
      text: t('Patient_details.Treatments'),
    },
    {
      to: `${patients}/${patientUsername}/${photos}/${gallery}`,
      isSelected: isSelectedPage(photos),
      text: t('Patient.Photos'),
    },
  ];

  /**
|--------------------------------------------------
| Lazy loaded route components
|--------------------------------------------------
*/
  const PatientPhotos = lazy(() => import('./PatientPhotos/PatientPhotos'));
  const PatientOverview = lazy(
    () => import('./PatientOverview/PatientOverview')
  );
  const PatientSchedule = lazy(
    () => import('./PatientSchedule/PatientSchedule')
  );
  const PatientEditDetails = lazy(
    () => import('./PatientEditDetails/PatientEditDetails')
  );

  const PatientTreatments = lazy(() => import('./PatientTreatments/index'));

  return (
    <div className='flex w-full h-full max-h-screen overflow-hidden bg-dashboard'>
      <div className='flex flex-shrink-0 h-full px-5 pt-6 bg-white'>
        <div className='min-w-[85px] 2xl:min-w-[90px] flex flex-col text-black space-y-4 text-[0.94rem]'>
          {navLinks.map((link, index) => {
            return isSelectedPage(details) && index === 0 ? (
              <Link
                to={link.to}
                key={uniqueId('records-link-')}
                className={
                  link.isSelected ? 'font-bold' : 'font-normal hover:text-gray'
                }
              >
                <div className='flex flex-col gap-2'>
                  <p>{link.text}</p>
                  <div className='text-[#B5BDC3] flex gap-1 items-center -mt-4 mx-2 text-xs font-normal'>
                    <span className='border-[#B5BDC3] p-1.5 border-b border-l'></span>
                    <span className='mt-3.5'>
                      {t('Patient_details_-_Edit.Editing')}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                to={link.to}
                key={uniqueId('records-link-')}
                className={
                  link.isSelected ? 'font-bold' : 'font-normal hover:text-gray'
                }
              >
                <p>{link.text}</p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className='w-full h-full overflow-auto'>
        <Suspense
          fallback={
            <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
              <ClipLoader color='#1e477f' size={1.5} />
            </div>
          }
        >
          <Switch>
            <Route path={patientOverviewUrl}>
              <PatientOverview
                setSubTitle={setSubTitle}
                patientUid={currentPatientUid}
              />
            </Route>
            <Route exact path={patientScheduleUrl}>
              <PatientSchedule
                key={currentPatientUid}
                setSubTitle={setSubTitle}
                patientUid={currentPatientUid}
              />
            </Route>
            <Route exact path={patientTreatmentsUrl}>
              <PatientTreatments
                setSubTitle={setSubTitle}
                patientUid={currentPatientUid}
              />
            </Route>
            <Route exact path={patientDetailsUrl}>
              <PatientEditDetails
                setSubTitle={setSubTitle}
                patientUid={currentPatientUid}
              />
            </Route>
            <Route path={[patientPhotosUrl, photoAnalysis, photoGallery]}>
              <PatientPhotos
                t={t}
                setSubTitle={setSubTitle}
                patientUsername={patientUsername}
                patientUid={currentPatientUid}
              />
            </Route>
            <Route exact path='*'>
              <Redirect
                push
                to={`${patients}/${patientUsername}/${overview}`}
              />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}
