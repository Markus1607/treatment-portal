import { AppProvider } from '~/AppProvider';
import { ReactComponent as NoTreatmentRecords } from 'assets/images/noActiveSessions.svg';

export const NoTreatmentAvailableCard = () => {
  const { t } = AppProvider.useContainer();
  return (
    <main className='flex flex-col items-center justify-center w-full h-full space-y-8 text-center'>
      <NoTreatmentRecords className='scale-95 bg-dashboard ' />
      <p className='w-[18rem]  text-xl 4xl:text-2xl font-bold'>
        {t('no_treatment_record')}
      </p>
      <p className='w-64 text-sm 4xl:text-base text-black-light'>
        {t('no_treatment_record_description')}
      </p>
    </main>
  );
};
