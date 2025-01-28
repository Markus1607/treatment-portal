type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div
      role='alert'
      className='w-full min-h-screen grid place-content-center bg-dashboard'
    >
      <h1 className='m-auto text-base text-center text-black'>
        Something went wrong, please try refreshing the page
      </h1>
      <pre>{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className='max-w-sm px-4 py-2 mx-auto mt-4 text-sm text-white rounded shadow-lg bg-blue hover:cursor-pointer hover:scale-y-105'
      >
        Refresh
      </button>
    </div>
  );
}
