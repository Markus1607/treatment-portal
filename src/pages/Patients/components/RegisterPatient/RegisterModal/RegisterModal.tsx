import { AppProvider } from 'AppProvider';
import { details, patients } from 'routes';
import { useHistory } from 'react-router-dom';

type RegisterModalProps = {
  data: {
    username: string;
    password: string;
    patientID: string | number;
  };
};

export default function RegisterModal({ data }: RegisterModalProps) {
  const history = useHistory();
  const { t } = AppProvider.useContainer();

  return (
    <div className='max-w-2xl text-sm text-black bg-dashboard'>
      <header className='flex items-center px-4 py-2 font-medium text-center bg-white border'>
        <h2 className='flex-shrink-0 text-lg'>
          {t('Patient_details_registered_title')}
        </h2>
      </header>

      <main className='max-h-[80vh] overflow-y-auto'>
        <section className='flex flex-col p-4 m-4 mb-5 space-y-4 font-medium bg-white border shadow-sm containerShadow'>
          <h1 className='text-base font-bold text-left 2xl:text-lg'>
            {t('patient_information.heading')}
          </h1>
          <p className='text-sm font-normal text-black-light'>
            {t('patient_information.body')}
          </p>
          <p className='max-w-xs space-x-2'>
            <span>{t('Password_reset.Patient_ID')}</span>
            <span className='text-blue'>{data?.username}</span>
          </p>
          <p className='max-w-xs space-x-2 whitespace-nowrap'>
            <span>{t('Password_reset.Generated_password')}</span>
            <span className='text-blue'>{data?.password}</span>
          </p>
        </section>
      </main>

      <footer className='flex items-center justify-end px-4 py-2 bg-white border'>
        <p
          onClick={() =>
            history.push(`${patients}/${data?.patientID}/${details}`)
          }
          className='py-4 mr-6 text-sm text-right underline text-blue-lighter hover:cursor-pointer'
        >
          {/* {t('patient.registered.close')} */}
          {t('Button_Close')}
        </p>
      </footer>
    </div>
  );
}
