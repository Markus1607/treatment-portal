import { ClipLoader } from '~/components/Loader';

export const LoadingSpinner = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen mx-auto bg-white'>
      <ClipLoader color='#1e477f' size={1.5} />
    </div>
  );
};
