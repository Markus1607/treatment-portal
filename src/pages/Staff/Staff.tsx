import { Suspense, Fragment } from 'react';
import { lazyWithRetry } from 'utils/lazyWithRetry';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ClipLoader } from 'components/Loader';
import * as routes from 'routes';

export default function Patients() {
  const StaffList = lazyWithRetry(
    () => import('./components/StaffList/StaffList')
  );
  const EditStaff = lazyWithRetry(
    () => import('./components/EditStaff/EditStaff')
  );
  const RegisterStaff = lazyWithRetry(
    () => import('./components/RegisterStaff/RegisterStaff')
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
          <Route exact path={routes.staff}>
            <StaffList />
          </Route>
          <Route exact path={routes.staffEdit}>
            <EditStaff />
          </Route>
          <Route exact path={routes.staffRegister}>
            <RegisterStaff />
          </Route>
          <Route path='*' render={() => <Redirect push to={routes.staff} />} />
        </Switch>
      </Suspense>
    </Fragment>
  );
}
