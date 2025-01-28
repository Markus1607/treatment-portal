import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import ceMark1Image from 'assets/images/ce_mark1.png';
import ceMark2Image from 'assets/images/ce_mark2.png';
import ceMark3Image from 'assets/images/ce_mark3.png';

const privacyImages = {
  ce_mark1: ceMark1Image,
  ce_mark2: ceMark2Image,
  ce_mark3: ceMark3Image,
};

export default function SystemInformation() {
  const { t } = AppProvider.useContainer();

  useTitle(t('System_information.page_title'));

  return (
    <div className='p-4 childrenContainer'>
      <div className='flex justify-start text-left text-black whitespace-pre-line'>
        <div className='containerShadow 2xl:w-[60%] xl:w-[80%] container mx-auto p-4 w-full text-lg bg-white divide-black-light divide-solid divide-y'>
          <div className='pb-6'>
            <h2 className='pb-6 font-bold'>
              {t('System_information.card_title')}
            </h2>
            <h2 className='font-bold'>{t('System_information.header.17')}</h2>
            <p className='pt-4 text-sm text-black-light'>
              {t('System_information.body.15')}
            </p>
          </div>

          <div className='py-6'>
            <h2 className='font-bold'>{t('System_information.header.7')}</h2>
            <p className='pt-4 text-sm text-black-light'>
              {t('System_information.body.36a')}
              <a
                href='https://www.sihealth.co.uk/'
                target='_blank'
                rel='noopener noreferrer'
                className='underline text-blue-lighter'
              >
                www.siHealth.co.uk
              </a>
              {t('System_information.body.36b')}
            </p>
          </div>

          <div className='py-6 text-sm'>
            <h2 className='text-lg font-bold'>
              {t('System_information.header.20')}
            </h2>

            <p className='pt-4 pb-4 font-bold'>siHealth Ltd. </p>

            <div className='flex'>
              <p className='mr-2 font-bold text-black'>
                {t('System_information.header.7.67')}
              </p>
              <p className='mr-2 text-black-light'>
                {t('System_information.body.63')}
              </p>
            </div>

            <p className='pt-2 text-black-light'>
              <b className='mr-2 text-black'>
                {t('System_information.header.48')}
              </b>
              <a
                href='https://www.sihealth.co.uk/'
                target='_blank'
                rel='noopener noreferrer'
                className='underline text-blue-lighter'
              >
                www.siHealth.co.uk
              </a>
            </p>

            <p className='pt-4 text-black-light'>
              <b className='mr-2 text-black'>
                {t('System_information.header.100')}
              </b>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='mailto:info@siHealth.co.uk'
                className='underline text-blue-lighter'
              >
                info@siHealth.co.uk
              </a>
            </p>

            <p className='pt-4 text-black-light'>
              <b className='mr-2 text-black'>
                {t('System_information.header.2')}
              </b>
              {t('System_information.body.13')}
            </p>
          </div>

          <div className='py-6'>
            <h2 className='font-bold'>{t('System_information.header.63')}</h2>
            <p className='pt-4 text-sm text-black-light'>
              {t('System_information.ce_marked')}
            </p>
            <p className='pt-4 text-sm text-black-light'>
              <b className='mr-2 text-black'>
                {t('System_information.header.79')}
              </b>
              SmartPDT®
            </p>
            <p className='pt-4 text-sm text-black-light'>
              <b className='mr-2 text-black'>
                {t('System_information.header.81')}
              </b>
              SmartPDT®-D Web-Portal
            </p>
            <p className='pt-4 text-sm text-black-light'>
              <b className='mr-2 text-black'>
                {t('System_information.header.16')}
              </b>
              1.0
            </p>
            <div className='flex'>
              <img
                className='object-none mr-3 scale-90'
                alt='privacy-image3'
                src={privacyImages.ce_mark2}
              />
              <p className='pt-4 text-sm text-black-light'>
                <b className='mr-2 text-black'>
                  {t('System_information.header.14')}
                </b>
                {'\n'}
                {t('System_information.body.11')}
              </p>
            </div>

            <p className='pt-4 text-sm text-black-light'>
              <b className='mr-2 text-black'>
                {t('System_information.header.20.80')}
              </b>
              (01)05060861070005(8012)1.0
            </p>
            <p className='pt-4 pb-8 text-sm text-black-light'>
              <b className='mr-2 text-black'>
                {t('System_information.risk_class')}
              </b>
              Class I
            </p>

            <div className='flex items-start text-sm'>
              <img
                className='object-none scale-90'
                alt='privacy-image3'
                src={privacyImages.ce_mark3}
              />
              <div className='flex flex-col pt-2 pb-4 ml-6'>
                <p className='font-bold text-black'>
                  {t('System_information.header.99')}
                </p>
                <p className=''>{t('System_information.body.43')}</p>
                <p className='pt-2 text-black-light'>
                  <b className='mr-2 text-black'>
                    {t('System_information.header.48')}
                  </b>
                  <a
                    href='https://www.sihealth.co.uk/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline text-blue-lighter'
                  >
                    www.siHealth.co.uk
                  </a>
                </p>

                <p className='pt-2 text-black-light'>
                  <b className='mr-2 text-black'>
                    {t('System_information.header.100')}
                  </b>
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='mailto:info@siHealth.co.uk'
                    className='underline text-blue-lighter'
                  >
                    info@siHealth.co.uk
                  </a>
                </p>
                <p className='pt-2 text-black-light'>
                  <b className='mr-2 text-black'>
                    {t('System_information.header.2')}
                  </b>
                  {t('System_information.body.13')}
                </p>
              </div>
            </div>
            <div className='flex items-start text-sm'>
              <div className='flex flex-col pt-2 pb-4 ml-1'>
                <p className='font-bold text-black'>
                  {t('System_information.eu_address_title')}
                </p>
                <p className=''>
                  {
                    'siHealth Photonics S.r.l\nVia Lampredi 45, Livorno, 57121, Italy'
                  }
                </p>
                <p className='pt-2 text-black-light'>
                  <b className='mr-2 text-black'>
                    {t('System_information.header.48')}
                  </b>
                  <a
                    href='https://www.siHealthPhotonics.it'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline text-blue-lighter'
                  >
                    www.siHealthPhotonics.it
                  </a>
                </p>

                <p className='pt-2 text-black-light'>
                  <b className='mr-2 text-black'>
                    {t('System_information.header.100')}
                  </b>
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='mailto:info@siHealthPhotonics.it'
                    className='underline text-blue-lighter'
                  >
                    info@siHealthPhotonics.it
                  </a>
                </p>

                <p className='pt-2 text-black-light'>
                  <b className='mr-2 text-black'>
                    {t('System_information.header.2')}
                  </b>
                  (+39) 0586 097801
                </p>
              </div>
            </div>
            <div className='flex items-end text-sm'>
              <img
                className='object-none scale-90'
                alt='privacy-icon1'
                src={privacyImages.ce_mark1}
              />
              <p className='pb-2'>
                {t('System_information.Medical_device_class')}
              </p>
            </div>
          </div>

          <div className='py-6'>
            <h2 className='font-bold'>{t('System_information.header')}</h2>
            <p className='pt-4 text-sm text-black-light'>
              {t('System_information.gdpr1')}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='mailto:privacy@sihealth.co.uk'
                className='underline text-blue-lighter'
              >
                privacy@sihealth.co.uk
              </a>
              {'. '}
              {t('System_information.gdpr2')}
              {' ('}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='mailto:privacy@sihealthphotonics.it'
                className='underline text-blue-lighter'
              >
                privacy@sihealthphotonics.it
              </a>
              {t('System_information.gdpr3')}
            </p>
          </div>

          <div className='py-6'>
            <h2 className='font-bold'>{t('System_information.header.80')}</h2>
            <div className='pt-4 space-y-4 text-sm text-black-light'>
              <p>
                {t('System_information.science_tested.p1a')}
                <a
                  href='https://www.sihealth.co.uk/our-technology/happysun/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  HappySun® technology
                </a>
                {t('System_information.science_tested.p1b')}
              </p>
              <p>{t('System_information.science_tested.p2')}</p>
              <p>{t('System_information.science_tested.p3')}</p>
              <p>
                {t('System_information.science_paper1a')}
                <a
                  href='https://doi.org/10.1016/j.pdpdt.2020.101914'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  https://doi.org/10.1016/j.pdpdt.2020.101914
                </a>
              </p>
              <p>
                {t('System_information.science_paper4a')}
                <a
                  href='https://doi.org/10.1016/j.jastp.2020.105529'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  https://doi.org/10.1016/j.jastp.2020.105529
                </a>
              </p>
              <p>
                {t('System_information.science_paper2a')}
                <a
                  href='https://doi.org/10.1039/c6pp00129g'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  https://doi.org/10.1039/c6pp00129g
                </a>
              </p>
              <p>{t('System_information.science_tested.p4')}</p>
              <p>
                {t('System_information.science_paper3a')}
                <a
                  href='https://doi.org/10.1111/jdv.16044'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-blue-lighter'
                >
                  https://doi.org/10.1111/jdv.16044
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
