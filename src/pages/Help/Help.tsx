import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import { HashLink as Link } from 'react-router-hash-link';
import { uniqueId } from 'lodash';
import mail from 'assets/images/Mail.svg';
import { TFunction } from 'react-i18next';

type SectionsPropType = {
  t: TFunction<'translation', undefined>;
};

const Sections = ({ t }: SectionsPropType) => {
  return (
    <div className='flex flex-col px-6 text-sm font-light mt-14 text-blue-lighter space-y-4'>
      <h1 className='mb-6 text-xl font-medium text-black 3xl:text-2xl'>
        {t('User_guide.Sections')}
      </h1>
      <Link smooth to='/help#header1' className='underline link'>
        <p>{t('User_guide.Registering_patients')}</p>
      </Link>
      <Link smooth to='/help#header2' className='underline link'>
        <p>{t('User_guide.Scheduling_treatment')}</p>
      </Link>
      <Link smooth to='/help#header3' className='underline link'>
        <p>{t('User_guide.Rescheduling_treatment')}</p>
      </Link>
      <Link smooth to='/help#header4' className='underline link'>
        <p>{t('User_guide.Finding_treatment_records')}</p>
      </Link>
      {/* <Link smooth to='/help#header5' className='underline link'>
        <p>{t('User_guide.Grading_treatments')}</p>
      </Link> */}
      <Link smooth to='/help#header5' className='underline link'>
        <p>{t('User_guide.Monitoring_ongoing_treatments')}</p>
      </Link>
      <Link smooth to='/help#header6' className='underline link'>
        <p>{t('User_guide.Editing_patient_details')}</p>
      </Link>
      <Link smooth to='/help#header7' className='underline link'>
        <p>{t('User_guide.Adding_new_staff_members')}</p>
      </Link>
      <Link smooth to='/help#header8' className='underline link'>
        <p>{t('User_guide.Editing_staff_details')}</p>
      </Link>
      <Link smooth to='/help#header9' className='underline link'>
        <p>{t('User_guide.Reseting_patient_passwords')}</p>
      </Link>
      <div
        style={{ backgroundImage: `url(${mail})` }}
        className='!mt-12 w-[15.5rem] flex flex-col p-4 pt-3 bg-dashboard bg-contain bg-no-repeat border border-blue-lighter rounded-md space-y-1'
      >
        <p className='text-2xl font-bold text-black'>{t('Still_unsure')}</p>
        <a
          className='underline'
          href='mailto:support@smartpdt.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('Contact_support')}
        </a>
      </div>
    </div>
  );
};

type StepsPropType = {
  index: number;
  stepCount: number;
  translationString: string;
  t: TFunction<'translation', undefined>;
};

const Steps = ({ t, translationString, stepCount, index }: StepsPropType) => {
  return (
    <div key={uniqueId('steps-')}>
      <h1
        id={'header' + index}
        className='pt-10 pb-2 mb-6 text-lg font-medium text-black'
      >
        {t(translationString)}
      </h1>
      <ol className='mb-8 ml-8 font-medium text-black list-decimal space-y-4'>
        {new Array(stepCount).fill(0).map((_, j) => (
          <li key={uniqueId('el-')}>
            <p className='ml-4 font-light text-black-light'>
              {t(translationString + (j + 1))}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

//*TODO: step 5 to be readded once session grading feature is fixed

export default function Help() {
  const { t } = AppProvider.useContainer();

  useTitle(t('Dashboard.Help'));

  const StepDetails = [
    { string: 'User_guide.Registering_patients', steps: 5 },
    { string: 'User_guide.Scheduling_treatment', steps: 6 },
    { string: 'User_guide.Rescheduling_treatment', steps: 3 },
    { string: 'User_guide.Finding_treatment_records', steps: 3 },
    { string: 'User_guide.Monitoring_ongoing_treatments', steps: 3 },
    // { string: 'User_guide.Grading_treatments', steps: 3 },
    { string: 'User_guide.Editing_patient_details', steps: 5 },
    { string: 'User_guide.Adding_new_staff_members', steps: 3 },
    { string: 'User_guide.Editing_staff_details', steps: 4 },
    { string: 'User_guide.Reseting_patient_passwords', steps: 4 },
  ];

  return (
    <div className='childrenContainer'>
      <div className='containerShadow xl:w-[80%] flex p-4 w-full bg-white overflow-auto xl:m-4 xl:mx-auto'>
        <div className='flex mt-10 divide-gray-light divide-x'>
          <Sections t={t} />
          <div className='flex flex-col p-8 pt-0 pb-0 divide-gray-light divide-y'>
            <h1 className='mb-6 text-3xl font-bold text-black'>
              {t('User_guide.Helpful_tips')}
            </h1>
            {StepDetails.map((step, index) => (
              <Steps
                t={t}
                index={index + 1}
                stepCount={step.steps}
                key={uniqueId('steps-details-')}
                translationString={step.string}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
