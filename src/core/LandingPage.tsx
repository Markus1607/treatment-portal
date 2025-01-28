import {
  Suspense,
  useState,
  useEffect,
  ReactNode,
  useLayoutEffect,
} from 'react';
import { getUserLanguage } from 'utils/functions';
import { ClipLoader } from 'components/Loader';
import { AppProvider } from 'AppProvider';
import Login from 'pages/Login/Login';
import * as routes from 'routes';
import { NoMatch } from './404';
import {
  Switch,
  Route,
  Redirect,
  RouteProps,
  BrowserRouter as Router,
} from 'react-router-dom';
import { lazyWithRetry } from 'utils/lazyWithRetry';
import { authRoutes } from 'utils/constants';

interface IPrivateRoute extends RouteProps {
  children: ReactNode;
  isUserLoggedIn: boolean;
}

function PrivateRoute({ children, isUserLoggedIn, ...props }: IPrivateRoute) {
  return (
    <Route
      {...props}
      render={() =>
        isUserLoggedIn ? children : <Redirect to={routes.loginStaff} />
      }
    />
  );
}

//Lazy loaded components
const Main = lazyWithRetry(() => import('pages/Main/Main'));
const ForgotPassword = lazyWithRetry(
  () => import('pages/Passwords/ForgotPassword/ForgotPassword')
);
const ResetPassword = lazyWithRetry(
  () => import('pages/Passwords/ResetPassword/ResetPassword')
);
const CreatePassword = lazyWithRetry(
  () => import('pages/Passwords/CreatePassword/CreatePassword')
);
const PrivacyPolicy = lazyWithRetry(() => import('components/PrivacyPolicy'));

export default function LandingPage() {
  const lang = getUserLanguage();
  const [, setUserInitialLang] = useState(lang);
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();
  const isUserLoggedIn = user?.token ? true : false;

  useLayoutEffect(() => setUserInitialLang(lang), []); //eslint-disable-line

  useEffect(() => {
    document
      .querySelectorAll('script[src^="https://maps.googleapis.com"]')
      .forEach((script) => script.remove());
    const googleMapScript = document.createElement('script');
    // @ts-expect-error //This bypass is necessary to prevent multiple google map namespaces declared on the window object.
    if (window.google) delete window.google.maps;
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.REACT_APP_ADDRESS_API
    }&libraries=places&language=${lang}&loading=async&callback=initGoogleMaps`;
    document.querySelector('head')?.appendChild(googleMapScript);
  }, [lang]);

  return (
    <Router>
      <Suspense
        fallback={
          <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
            <ClipLoader color='#1e477f' size={1.5} />
          </div>
        }
      >
        <Switch>
          <Route
            exact
            path='/'
            render={() => {
              return !isUserLoggedIn ? (
                <Redirect push to={routes.loginStaff} />
              ) : (
                <Redirect push to={routes.patients} />
              );
            }}
          />
          <Route path={[routes.loginAdmin, routes.loginStaff]}>
            <Login />
          </Route>
          <Route exact path={routes.forgotPassword}>
            <ForgotPassword />
          </Route>
          <Route path={routes.resetPassword}>
            <ResetPassword />
          </Route>
          <Route path={routes.createPassword}>
            <CreatePassword />
          </Route>
          <Route exact path={routes.privacyPolicy}>
            <PrivacyPolicy />
          </Route>
          <PrivateRoute path={authRoutes} isUserLoggedIn={isUserLoggedIn}>
            <Main />
          </PrivateRoute>
          <Route path='*'>
            <NoMatch t={t} />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}
