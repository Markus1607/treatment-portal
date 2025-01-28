import * as routes from 'routes';
import { Suspense, Fragment } from 'react';
import { ClipLoader } from 'components/Loader';
import PatientFile from './components/PatientFile';
import { lazyWithRetry } from 'utils/lazyWithRetry';
import { Switch, Route, Redirect } from 'react-router-dom';

export default function Patients() {
  const RegisterPatient = lazyWithRetry(
    () => import('./components/RegisterPatient/RegisterPatient')
  );
  const PatientList = lazyWithRetry(
    () => import('./components/PatientList/PatientsList')
  );

  return (
    <Fragment>
      <Suspense
        fallback={
          <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
            <ClipLoader color='#1e477f' size={1.5} />
          </div>
        }
      >
        <Switch>
          <Route exact path={routes.patients}>
            <PatientList />
          </Route>
          <Route exact path={routes.patientRegister}>
            <RegisterPatient />
          </Route>
          <Route
            path={[
              routes.photoGallery,
              routes.patientProfile,
              routes.photoAnalysis,
              routes.patientPhotosUrl,
              routes.patientOverviewUrl,
              routes.patientScheduleUrl,
              routes.patientDetailsUrl,
              routes.patientTreatmentsUrl,
            ]}
          >
            <PatientFile />
          </Route>
          <Route
            path='*'
            render={() => <Redirect push to={routes.patients} />}
          />
        </Switch>
      </Suspense>
    </Fragment>
  );
}
