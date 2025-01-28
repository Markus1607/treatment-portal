import { privacyPolicy } from 'routes';
import { useRef } from 'react';
import { AppProvider } from 'AppProvider';
import { Link } from 'react-router-dom';
import LoginLayout from 'components/Layouts/LoginLayout/LoginLayout';
import { ReactComponent as DropIcon } from 'assets/images/ic_dropdown.svg';
import { useTitle } from 'utils/hooks';

export default function PrivacyPolicy() {
  const { t } = AppProvider.useContainer();
  const scrollRef = useRef<HTMLDivElement>(null);

  useTitle(t('Privacy_policy.Page_title'));

  return (
    <LoginLayout isPolicyPage={true}>
      <div ref={scrollRef} className='p-4 pb-16 childrenContainer'>
        <div className='flex text-left whitespace-pre-line text-black-light'>
          <div className='2xl:w-[60%] containerShadow xl:w-[80%] container mx-auto p-4 text-sm bg-white'>
            <Link
              rel='noopener noreferrer'
              className='flex items-center gap-1 py-1 pr-4 mb-4 text-black group w-max'
              target='_self'
              to='/'
            >
              <DropIcon className='transform scale-90 rotate-90 text-dark' />
              <span className='text-base text-blue-lighter group-hover:underline'>
                {t('Button_Back')}
              </span>
            </Link>
            <div>
              <h2 className='text-lg font-bold text-black'>
                {t('my_info.link_text.15')}
              </h2>
              <p className='py-4'>
                {t('Privacy_policy.privacy_policy1a')}
                <a
                  href='https://www.sihealth.co.uk'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  www.sihealth.co.uk
                </a>
                {t('Privacy_policy.privacy_policy1b')}
                <a
                  href='https://www.flyby.it'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  www.flyby.it
                </a>
                {t('Privacy_policy.privacy_policy1c')}
                <a
                  href='https://www.sihealthphotonics.it'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  www.sihealthphotonics.it
                </a>{' '}
                .{t('Privacy_policy.privacy_policy1d')}
                <Link
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                  target='_self'
                  to={privacyPolicy}
                >
                  www.smartpdt.com/privacy-policy
                </Link>
                .
              </p>
            </div>

            <div className='py-4'>
              <h2 className='text-lg font-bold text-black'>
                {t('Privacy_policy.sub_heading1')}
              </h2>
              <p className='pt-4'>{t('Privacy_policy.update_1')}</p>
              <p className='pt-4'>{t('Privacy_policy.update_2')}</p>
              <p className='pt-4'>{t('Privacy_policy.privacy_policy2a')}</p>
              <ul className='py-6 pb-4 ml-4 space-y-2 list-disc'>
                <li>{t('Privacy_policy.privacy_list1_a')}</li>
                <li>{t('Privacy_policy.privacy_list1_b')}</li>
                <li>{t('Privacy_policy.privacy_list1_c')}</li>
                <li>{t('Privacy_policy.privacy_list1_d')}</li>
                <li>{t('Privacy_policy.update_4')}</li>
                <li>{t('Privacy_policy.privacy_list1_e')}</li>
              </ul>
              <p className='pt-2'>{t('Privacy_policy.privacy_policy2b')}</p>
            </div>

            <div className='py-4'>
              <h2 className='text-lg font-bold text-black'>
                {t('Privacy_policy.sub_heading2')}
              </h2>
              <p className='py-4'>
                {t('Privacy_policy.privacy_policy3a')}
                <Link
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                  target='_self'
                  to='/'
                >
                  www.smartpdt.com
                </Link>
                {t('Privacy_policy.privacy_policy3b')}
              </p>
              <table className='w-full mt-2 border border-collapse border-gray-light'>
                <thead>
                  <tr className='text-black whitespace-nowrap bg-gray-lightest divide-gray-light'>
                    <th className='px-2 py-1 border border-gray-light'>
                      {t('Privacy_policy.Cookie_provider')}
                    </th>
                    <th className='px-2 border border-gray-light'>
                      {t('Privacy_policy.Cookie_name')}
                    </th>
                    <th className='px-2 border border-gray-light'>
                      {t('Privacy_policy.Purpose_of_the_Cookie')}
                    </th>
                    <th className='px-2 border border-gray-light'>
                      {t('Privacy_policy.Duration')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='whitespace-pre-wrap'>
                    <td className='px-2 py-4 border border-gray-light'>
                      siHealth Ltd
                    </td>
                    <td className='px-2 border border-gray-light'>user</td>
                    <td className='px-2 border border-gray-light'>
                      {t('privacy_policy_cookies_purpose_text')}
                    </td>
                    <td className='max-w-sm px-2 border border-gray-light'>
                      {t('privacy_policy_cookies_duration_text')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='py-4'>
              <h2 className='text-lg font-bold text-black'>
                {t('Privacy_policy.sub_heading3')}
              </h2>
              <p className='pt-4'>{t('Privacy_policy.privacy_policy4a')}</p>

              <ul className='py-6 pb-2 ml-4 space-y-2 list-disc'>
                <li>{t('Privacy_policy.privacy_list2_a')}</li>
                <li>{t('Privacy_policy.privacy_list2_b')}</li>
                <li>{t('Privacy_policy.privacy_list2_c')}</li>
                <li>{t('Privacy_policy.privacy_list2_d')}</li>
                <li>{t('Privacy_policy.privacy_list2_e')}</li>
                <li>{t('Privacy_policy.privacy_list2_f')}</li>
                <li>{t('Privacy_policy.privacy_list2_g')}</li>
              </ul>

              <p className='pt-4'>{t('Privacy_policy.privacy_policy4b')}</p>
            </div>

            <div className='pt-4'>
              <h2 className='text-lg font-bold text-black'>
                {t('Privacy_policy.sub_heading4')}
              </h2>
              <p className='pt-4'>{t('Privacy_policy.privacy_policy5')}</p>
              <ul className='py-6 ml-4 space-y-2 list-disc'>
                <li>{t('Privacy_policy.uk')}</li>
                <li>{t('Privacy_policy.eu')}</li>
                <li>{t('Privacy_policy.us')}</li>
                <li>{t('Privacy_policy.sk')}</li>
                <li>{t('Privacy_policy.sa')}</li>
                <li>{t('Privacy_policy.br')}</li>
                <li>{t('Privacy_policy.au')}</li>
              </ul>
            </div>

            <div className='py-4'>
              <h2 className='text-lg font-bold text-black'>
                {t('Privacy_policy.sub_heading5')}
              </h2>
              <p className='pt-4'>{t('Privacy_policy.privacy_policy6a')} </p>
            </div>

            <div className='py-4'>
              <h2 className='text-lg font-bold text-black'>
                {t('Privacy_policy.update_5')}
              </h2>
              <p className='pt-4'>
                {t('Privacy_policy.update_6a')}
                <a
                  href='https://www.flyby.it'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  www.flyby.it
                </a>
                {t('Privacy_policy.update_6b')}
                <a
                  href='mailto:dpo@sihealth.co.uk'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  dpo@sihealth.co.uk
                </a>{' '}
                .
              </p>
            </div>

            <div className='py-4'>
              <h2 className='text-lg font-bold text-black'>
                {t('Privacy_policy.sub_heading6')}
              </h2>
              <ul className='py-4 ml-4 space-y-2 list-disc'>
                <li>{t('Privacy_policy.privacy_policy7a')}</li>
                <li>{t('Privacy_policy.privacy_policy7b')}</li>
                <li>{t('Privacy_policy.update_7')}</li>
                <li>{t('Privacy_policy.privacy_policy7c')}</li>
              </ul>
            </div>

            <div className='py-4'>
              <h2 className='text-lg font-bold text-black'>
                {t('Privacy_policy.sub_heading7')}
              </h2>
              <p className='pt-4'>
                {t('Privacy_policy.privacy_policy8')}{' '}
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='mailto:privacy@sihealth.co.uk'
                  className='underline text-blue-lighter'
                >
                  privacy@sihealth.co.uk
                </a>
              </p>
              <p className='pt-4'>{t('Privacy_policy.update_9')}</p>
              <ul className='py-4 ml-4 space-y-2 list-disc'>
                <li>{t('Privacy_policy.address_1')}</li>
                <li>{t('Privacy_policy.phone_1')}</li>
                <li>
                  {t('Privacy_policy.email_1a')}
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='mailto:info@sihealthphotonics.it'
                    className='underline text-blue-lighter'
                  >
                    info@sihealthphotonics.it
                  </a>{' '}
                </li>
              </ul>
            </div>
            <p className='font-light text-right'>
              {t('Privacy_policy.last_update')}
            </p>
            <button
              onClick={() =>
                scrollRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })
              }
              className='group flex gap-1.5 items-center pr-4 py-1 text-black'
            >
              <DropIcon className='transform scale-90 rotate-180' />
              <span className='text-base text-blue-lighter group-hover:underline'>
                {t('Back_to_top')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
}
