import { forgotPassword } from 'routes';
import { AppProvider } from 'AppProvider';
import { useHistory } from 'react-router-dom';
import { useHandleUserLogout, useTitle } from 'utils/hooks';
import { TFunction } from 'react-i18next';
import { UserType } from '@types';

export default function Profile() {
  const history = useHistory();
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();

  useTitle(t('Dashboard.Profile'));

  const logoutSuccess = () => history.push(forgotPassword);
  const handleLogout = useHandleUserLogout(logoutSuccess);

  return (
    <div className='childrenContainer'>
      <div className='p-4 mx-auto text-center text-black grid gap-4 xl:grid-cols-2'>
        <div className='container'>
          <UserInfo t={t} user={user} />
        </div>
        <div className='container space-y-4'>
          <Security t={t} handleLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
}

type UserInfoType = {
  user: UserType;
  t: TFunction<'translation', undefined>;
};

const UserInfo = ({ t, user }: UserInfoType) => {
  return (
    <div className='p-5 pb-2 text-sm font-light text-left bg-white containerShadow text-black-light'>
      <h1 className='mb-5 text-base font-semibold text-black'>
        {t('my_info.card_title')}
      </h1>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>{t('my_info.Forename(s)')}</p>
        <p className='text-right'>{user.firstName}</p>
      </div>
      <div className='flex justify-between py-3 border-b border-gray-light'>
        <p className='font-medium text-black'>{t('my_info.Surname')}</p>
        <p className='text-right'> {user.lastName}</p>
      </div>
      <div className='flex justify-between py-3'>
        <p className='font-medium text-black'>{t('my_info.Email_address')}</p>
        <p className='text-right'> {user.email}</p>
      </div>
      {/* TODO: User language preference component */}
    </div>
  );
};

type SecurityType = {
  handleLogout: () => void;
  t: TFunction<'translation', undefined>;
};

const Security = ({ t, handleLogout }: SecurityType) => {
  return (
    <div className='p-5 pb-2 text-sm font-light text-left bg-white containerShadow text-black-light'>
      <h1 className='mb-4 text-base font-semibold text-black'>
        {t('my_info.card_title2')}
      </h1>
      <p className='py-3 font-medium text-black border-b border-gray-light'>
        {t('my_info.Change_password')}
      </p>
      <button onClick={() => handleLogout()}>
        <p className='py-3 font-normal underline text-blue-lighter'>
          {t('my_info.Reset_password')}
        </p>
      </button>
    </div>
  );
};
