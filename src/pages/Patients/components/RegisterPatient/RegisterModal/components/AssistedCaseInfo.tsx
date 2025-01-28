import { TFunction } from 'react-i18next';

export default function AssistedCaseInfo({
  t,
  isSchedulingPage,
}: {
  t: TFunction;
  isSchedulingPage: boolean;
}) {
  return (
    <div className='p-4 pb-0 m-4 mb-5 text-sm text-left bg-white border containerShadow shadow-sm'>
      <h1 className='mb-4 text-base font-bold'>
        {t('assisted_case_information.heading')}
      </h1>

      <ul className='text-[0.8rem] mb-4 px-4 text-black-light list-decimal space-y-3'>
        <li>{t('assisted_case_information.pre_treatment')}</li>
        <li>
          {isSchedulingPage
            ? t('assisted_case_information.log_in_scheduling_page')
            : t('assisted_case_information.log_in')}
        </li>
        <li>{t('assisted_case_information.go_outside')}</li>
        <li>{t('assisted_case_information.patient_progress')}</li>
      </ul>
    </div>
  );
}
