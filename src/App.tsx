import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { withCookies } from 'react-cookie';
import { ClipLoader } from 'components/Loader';
import { AppProvider } from 'AppProvider';
import LandingPage from './core/LandingPage';

function App() {
  return (
    <Suspense fallback={<ClipLoader />}>
      <div className='max-h-full overflow-hidden bg-white'>
        <AppProvider.Provider>
          <LandingPage />
          <Toaster
            toastOptions={{
              // Define default options
              className: 'text-sm',
              error: {
                duration: 3000,
              },
            }}
          />
        </AppProvider.Provider>
      </div>
    </Suspense>
  );
}

export default withCookies(App);
