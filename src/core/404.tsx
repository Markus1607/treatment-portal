import { TFunction } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const NoMatch = ({ t }: { t: TFunction }) => {
  const history = useHistory();
  return (
    <div className='text-center bg-gray-light'>
      <div className='flex flex-col justify-center min-h-screen mx-auto my-auto'>
        <h1 className='text-2xl font-bold 2xl:text-4xl xl:text-3xl'>404</h1>
        <p className='mt-4 text-bold'>{t('page-not-found')}</p>
        <div
          className='px-16 py-3 mx-auto mt-5 text-white cursor-pointer bg-blue rounded-md'
          onClick={() => history.replace('/')}
        >
          <p className='py-1'>{t('Button_go_back')}</p>
        </div>
      </div>
    </div>
  );
};
