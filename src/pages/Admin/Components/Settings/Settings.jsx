import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import { SaveButton } from 'components/Forms/Buttons';

const FileUpload = ({ t }) => {
  return (
    <div className='text-center border-2 border-dashed rounded-md bg-gray-lightest border-blue-lighter'>
      <p className='pt-6 pb-2 text-base font-bold'>
        {t('Admin_settings.drop_images')}
        <a
          href='/admin_user/settings'
          /*target='_blank'*/ rel='noopener noreferrer'
          className='ml-1.5 text-blue-lighter underline'
        >
          {t('Admin_settings.browse')}
        </a>
      </p>
      <p className='pb-4 text-sm text-black-lighter'>{t('Admin.subtext')}</p>
    </div>
  );
};

const SiteLogo = ({ t }) => {
  return (
    <div className='w-full p-5 space-y-4 text-2xl text-left bg-white containerShadow'>
      <h1 className='mb-6 text-base font-medium text-black 2xl:text-lg'>
        {t('Admin_settings.site_logo')}
      </h1>
      <p className='text-base'>{t('Admin_settings.upload_logo')}</p>
      <FileUpload t={t} />
      <div className='flex justify-end'>
        <SaveButton text={t('Protocol.button_text.65')} />
      </div>
    </div>
  );
};

export default function Settings() {
  const { t } = AppProvider.useContainer();

  useTitle(t('Dashboard.Admin'));

  return (
    <div className='p-4 childrenContainer'>
      <div className='grid gap-4 mx-auto text-center text-black xl:gap-5 xl:grid-cols-forms'>
        <div className='container'>
          <SiteLogo t={t} />
        </div>
      </div>
    </div>
  );
}
