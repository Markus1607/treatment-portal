import { lazyWithRetry } from 'utils/lazyWithRetry';
import { Suspense } from 'react';
import {
  // useLocation,
  // Link,
  Switch,
  Route,
} from 'react-router-dom';
// import { includes, uniqueId } from 'lodash';
import { AppProvider } from 'AppProvider';
import { ClipLoader } from 'components/Loader';
import { staffBilling } from 'routes';
import { useTitle } from 'utils/hooks';

//? Can the settings folder and commented out code be deleted. Seems unlikely the site logo feature will ever be possible/required due to GDPR.

export default function PatientFile() {
  // const location = useLocation();
  const { t } = AppProvider.useContainer();

  useTitle(t('Dashboard.Admin'));

  // const isSelectedPage = (pageName) => {
  //   return includes(location.pathname, pageName);
  // };

  // const navLinks = [
  //   {
  //     to: staffBilling,
  //     isSelected: isSelectedPage('billing'),
  //     text: t('Admin.billing'),
  //   },
  //   // {
  //   //   to: staffSettings,
  //   //   isSelected: isSelectedPage('settings'),
  //   //   text: t('Admin.settings'),
  //   // },
  // ];

  /**
|--------------------------------------------------
| Lazy loaded route components
|--------------------------------------------------
*/
  const Billing = lazyWithRetry(() => import('./Components/Billing/Billing'));
  // const Settings = lazyWithRetry(() => import('./Components/Settings/Settings'));

  return (
    <div className='flex w-full h-full max-h-screen overflow-hidden gap-2 bg-dashboard'>
      {/* <div className='flex flex-shrink-0 h-full px-6 pt-6 bg-white border-r border-gray-light'>
        <div className='min-w-[85px] 2xl:min-w-[105px] flex flex-col text-black space-y-4'>
          {navLinks.map((link, index) => {
            return (
              <Link
                to={link.to}
                key={uniqueId('admin-link-')}
                className={
                  link.isSelected ? 'underline' : 'font-normal hover:text-gray'
                }
              >
                <p>{link.text}</p>
              </Link>
            );
          })}
        </div>
      </div> */}
      <div className='w-full h-full overflow-auto'>
        <Suspense
          fallback={
            <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
              <ClipLoader color='#1e477f' size={1.5} />
            </div>
          }
        >
          <Switch>
            <Route exact path={staffBilling}>
              <Billing />
            </Route>
            {/* <Route exact path={staffSettings}>
              <Settings />
            </Route> */}
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}
