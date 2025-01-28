import DOMPurify from 'dompurify';
import { AppProvider } from 'AppProvider';
import { useInstitutionInfo, useTitle } from 'utils/hooks';
import { ReactComponent as InfoIcon } from 'assets/images/ic_info.svg';

const PlanDetails = ({
  t,
  planName,
  renewalDate,
  clinicName,
  clinicalStaffCount,
}) => {
  return (
    <div className='p-5 text-sm text-left bg-white containerShadow text-black-light space-y-4'>
      <h1 className='mb-6 text-base font-medium text-black 2xl:text-lg'>
        {t('Admin_billing.plan_details')}
      </h1>

      <p className='pt-4 text-sm text-black-light'>
        {t('Admin_billing.team_your_team')} <b>{clinicName}</b>{' '}
        {t('Admin_billing.plan_details_b')}{' '}
        <b>
          {planName} {t('Plan')}
        </b>
        {/* <a
          href='/admin_user/billing'
          rel='noopener noreferrer'
          className='underline text-blue-lighter md:ml-2'
        >
          {t('Admin_billing.change_plan')}
        </a> */}
      </p>

      <p className='text-sm text-black-light'>
        {t('Admin_billing.no_accounts_a')} <b>{clinicalStaffCount}</b>{' '}
        {t('Admin_billing.no_accounts_b')}
        {/* <a
          href='/admin_user/billing'
          rel='noopener noreferrer'
          className='underline text-blue-lighter md:ml-2'
        >
          {t('Admin_billing.change_accounts')}
        </a> */}
      </p>

      <p>
        {t('Admin_billing.renewal_a')} <b>{renewalDate}</b>
        {/* {t('Admin_billing.renewal_b')}
        <b>{chargeAmount}</b> */}
      </p>
    </div>
  );
};

// const BillingActions = ({ t, cardLastFour, billingEmail }) => {
//   return (
//     <div className='p-5 text-sm text-left bg-white containerShadow text-black-light space-y-4'>
//       <h1 className='mb-6 text-base font-medium text-black 2xl:text-lg'>
//         {t('Admin_billing.billing_actions')}
//       </h1>

//       <p>
//         {t('Admin_billing.future_charges')} <b>{'****' + cardLastFour}</b>{' '}
//         <a
//           href='/admin_user/billing'
//           /*target='_blank'*/ rel='noopener noreferrer'
//           className='underline text-blue-lighter xl:ml-2'
//         >
//           {t('Admin_billing.change_card')}
//         </a>
//       </p>

//       <p>
//         {t('Admin_billing.billing_email')} <b>{billingEmail}</b>{' '}
//         <a
//           href='/admin_user/billing'
//           /*target='_blank'*/ rel='noopener noreferrer'
//           className='underline text-blue-lighter md:ml-2'
//         >
//           {t('Admin_billing.change_team')}
//         </a>
//       </p>

//       <a
//         href='/admin_user/billing'
//         /*target='_blank'*/ rel='noopener noreferrer'
//         className='block underline text-blue-lighter'
//       >
//         {t('Admin_billing.cancel_sub')}
//       </a>
//     </div>
//   );
// };

const TherapySessions = ({ t, therapySessions }) => {
  return (
    <div className='p-5 text-sm text-left bg-white containerShadow text-black-light space-y-7'>
      <div className='flex gap-2'>
        <h1 className='text-base font-medium text-black 2xl:text-lg'>
          {t('Admin_billing.therapy')}
        </h1>
        <div className='mt-[0.05rem] relative'>
          <div className='absolute z-50 inline-block tooltip group top-1'>
            <InfoIcon className='inline-block w-4 h-4 mb-1 ml-2 text-blue' />
            <div className='tooltiptext w-[17.5rem] absolute -left-24 top-8 group-hover:block hidden p-4 text-black whitespace-pre-wrap text-sm bg-dashboard border border-blue-lighter rounded-md'>
              <div className='top-[-0.57rem] left-[6.5rem] absolute w-4 h-4 font-light bg-dashboard border-l border-t border-blue-lighter rounded-bl-none rounded-md rounded-tr-none transform rotate-45' />
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(t('Token_explainer.body')),
                }}
              ></p>
            </div>
          </div>
        </div>
      </div>

      <p className='flex items-end gap-2'>
        <span className='text-2xl font-bold leading-none text-black lg:text-4xl'>
          {therapySessions}
        </span>
        <span className='lg:pb-1'>{t('Admin_billing.therapy_sessions')}</span>
      </p>
      {/* <a
        href='/admin_user/billing'
        target='_blank' rel='noopener noreferrer'
        className='block underline text-blue-lighter'
      >
        {t('Admin_billing.purchase_therapy_sessions')}
      </a> */}
    </div>
  );
};

//* Commented out code is waiting for the backend to be ready

export default function Billing() {
  const data = useInstitutionInfo();
  const { t } = AppProvider.useContainer();

  useTitle(t('Dashboard.Admin'));

  return (
    <div className='p-4 childrenContainer'>
      <div className='pb-4 mx-auto text-center text-black grid gap-4 xl:gap-5 xl:grid-cols-billing'>
        <div className='container space-y-4'>
          <PlanDetails
            t={t}
            clinicName={data?.name}
            planName={data?.planName}
            renewalDate={data?.expiryDate}
            clinicalStaffCount={data?.clinicalStaffCount}
          />
          {/* <BillingActions
            t={t}
            cardLastFour='9999'
            billingEmail='janeDoe@gmail.com'
          /> */}
        </div>
        <div className='container'>
          <TherapySessions t={t} therapySessions={data?.tokens} />
        </div>
      </div>
    </div>
  );
}
