import toast, { Toast } from 'react-hot-toast';
import type { TFunction } from 'react-i18next';
import CrossIcon from 'assets/images/ic_cross.svg';
import InfoWarning from 'assets/images/ic_alert_circle.svg';

type MaintenanceToastProps = {
  t: TFunction<'translation', undefined>;
  currentToast: Toast;
};

export default function MaintenanceToast({
  t,
  currentToast,
}: MaintenanceToastProps) {
  return (
    <div className='3xl:mb-[6rem] flex mb-16 bg-white rounded shadow-lg overflow-hidden'>
      <div className='flex items-center px-1 bg-SmartPDTorange/40'>
        <img src={InfoWarning} alt='info-warning' className='w-4 h-4 my-auto' />
      </div>
      <div className='flex flex-col px-4 py-3'>
        <header className='flex items-center justify-between'>
          <h1 className='text-[0.95rem] text-black font-medium'>
            {t('maintenance_header')}
          </h1>
          <button
            className='px-2 font-light text-black-lighter'
            onClick={() => toast.dismiss(currentToast.id)}
          >
            <img src={CrossIcon} alt='close-button' className='my-auto' />
          </button>
        </header>
        <main>
          <p className='max-w-md text-sm font-light text-black-light'>
            {t('maintenance_notification')}
          </p>
        </main>
      </div>
    </div>
  );
}
