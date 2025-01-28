import * as routes from 'routes';
import { Suspense, lazy, useEffect, useState } from 'react';
import { AppProvider } from 'AppProvider';
import Patients from 'pages/Patients/Patients';
import { ClipLoader } from 'components/Loader';
import { lazyWithRetry } from 'utils/lazyWithRetry';
import { Switch, Route, Redirect } from 'react-router-dom';
import MainLayout from 'components/Layouts/MainLayout/MainLayout';
import UpdateInstitutionKeyModal from './components/UpdateInstitutionKeyModal';
import Modal from '~/components/Modals/Modal';
import { useFetchInstitutionDetails } from 'utils/hooks';
import ExpiredTokenModal from './components/ExpiredTokenModal';

export default function Main() {
  const {
    cookies: { user },
  } = AppProvider.useContainer();
  const isAdmin = user?.staffType === 'ADMIN';
  const { isLoading, data } = useFetchInstitutionDetails(user.token);
  const [isUserTokenExpired, setIsUserTokenExpired] = useState(false);
  const [showUpdateInstKeyModal, setUpdateInstKeyModal] = useState(false);

  useEffect(() => {
    if (!isLoading && data && 'key' in data && data.key === null) {
      setUpdateInstKeyModal(true);
    }
    if (!isLoading && data && 'code' in data) {
      if (data?.code === 2006) {
        setIsUserTokenExpired(true);
      }
    }
  }, [isLoading, data]);

  /**
   * * Lazy loaded page components
   */
  const Staff = lazyWithRetry(() => import('pages/Staff/Staff'));
  const Profile = lazyWithRetry(() => import('pages/Profile/Profile'));
  const TermsOfUse = lazy(() => import('components/TermsOfUse'));
  const ProtocolIndexPage = lazyWithRetry(() => import('pages/Protocol/index'));
  const Institutions = lazyWithRetry(
    () => import('pages/Institutions/Institutions')
  );
  const SystemInformation = lazyWithRetry(
    () => import('components/SystemInformation')
  );

  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
            <ClipLoader color='#1e477f' size={1} />
          </div>
        }
      >
        <Switch>
          {isAdmin ? (
            <>
              <Route exact path={routes.institutions}>
                <Institutions />
              </Route>
              <Route
                path='*'
                render={() => <Redirect push to={routes.institutions} />}
              />
            </>
          ) : (
            <>
              <Route path={routes.patients}>
                <Patients />
              </Route>
              <Route path={routes.protocol}>
                <ProtocolIndexPage />
              </Route>
              <Route path={routes.staff}>
                <Staff />
              </Route>
              <Route exact path={routes.systemInfo}>
                <SystemInformation />
              </Route>
              <Route exact path={routes.termOfUse}>
                <div className='p-4 childrenContainer'>
                  <TermsOfUse contained />
                </div>
              </Route>
              <Route exact path={routes.profile}>
                <Profile />
              </Route>
              <Modal
                closeOnEsc={false}
                closeMaskOnClick={false}
                isVisible={showUpdateInstKeyModal}
                setVisible={setUpdateInstKeyModal}
                modalContent={
                  <UpdateInstitutionKeyModal
                    token={user.token}
                    setUpdateInstKeyModal={setUpdateInstKeyModal}
                  />
                }
              />
              <Modal
                closeOnEsc={false}
                closeMaskOnClick={false}
                isVisible={isUserTokenExpired}
                setVisible={setIsUserTokenExpired}
                modalContent={<ExpiredTokenModal />}
              />
            </>
          )}
        </Switch>
      </Suspense>
    </MainLayout>
  );
}
