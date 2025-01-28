import { loginStaff } from '~/routes';
import { AppProvider } from '~/AppProvider';
import { useHistory } from 'react-router-dom';
import { userLogoutCleanUp } from '~/utils/functions';

export default function ExpiredTokenModal() {
  const history = useHistory();
  const { t, removeCookie } = AppProvider.useContainer();

  return (
    <div className='flex flex-col max-w-lg gap-3 p-4 text-left'>
      <h2>{t('login_token_expired')}</h2>
      <button
        className='px-2 py-1 mr-auto text-sm text-white rounded-sm bg-blue-dark hover:cursor-pointer hover:scale-105 active:scale-100'
        onClick={() => {
          history.push(loginStaff);
          userLogoutCleanUp(removeCookie);
        }}
      >
        {t('login')}
      </button>
    </div>
  );
}
