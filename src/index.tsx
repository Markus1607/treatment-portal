import 'i18n';
import 'index.css';
import App from 'App';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import reportWebVitals from './reportWebVitals';
import { ErrorFallback } from 'core/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from 'react-query';

declare module 'react-query/types/react/QueryClientProvider' {
  interface QueryClientProviderProps {
    children?: React.ReactNode;
  }
}

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => window.location.reload()}
  >
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
