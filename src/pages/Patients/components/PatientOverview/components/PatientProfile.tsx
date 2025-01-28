import { useState } from 'react';
import { btnIcons } from 'utils/icons';
import { AppProvider } from 'AppProvider';
import { details, patients } from 'routes';
import Modal from 'components/Modals/Modal';
import { Link, useParams } from 'react-router-dom';
import editIconBlue from 'assets/images/ic_edit_blue.svg';
import PasswordModal from '../../PasswordModal/PasswordModal';
import { PatientDataPerID, resetPatientPassword } from '../api/query';

type PatientProfileProps = {
  data: PatientDataPerID | undefined;
};

export default function PatientProfile({ data }: PatientProfileProps) {
  const [errMsg, setErrMsg] = useState('');
  const { id: patientID } = useParams<{ id: string }>();
  const [getNewPassword, setGetNewPassword] = useState(false);
  const patientDetails = data && 'id' in data ? data : undefined;
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [credentials, setCredentials] = useState<{
    patientID: number | string;
    password: string;
  }>({ patientID, password: '' });
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();

  const resetPassword = async () => {
    setErrMsg('');
    setGetNewPassword(true);
    const data =
      patientDetails?.uid &&
      (await resetPatientPassword(
        user.token,
        patientDetails?.uid,
        setGetNewPassword
      ));
    if (!getNewPassword && data && 'patientID' in data) {
      setCredentials(data);
      setResetPasswordModal(true);
    }
    if (!getNewPassword && data && 'error' in data) {
      setErrMsg(t('Error.resetting.patient.password'));
    }
  };

  return (
    <>
      <div className='flex flex-col p-4 space-y-6 font-medium text-left text-black bg-white containerShadow'>
        <div className='flex items-center justify-between'>
          <h2 className='text-base font-semibold 2xl:text-lg'>
            {t('Patient_details.card_title')}
          </h2>

          {errMsg && <p className='flex text-sm errorMessage'>{errMsg}</p>}

          <div className='flex items-center gap-6'>
            <button
              type='button'
              className='flex items-center flex-shrink-0 cursor-pointer'
              onClick={() => resetPassword()}
            >
              <img
                src={btnIcons.reset}
                alt={t('Patient_details.Reset_password')}
                className={`mr-1 ${
                  getNewPassword ? 'animate-reverse-spin' : undefined
                }`}
              />
              <span className='font-light underline text-blue-lighter'>
                {t('Patient_details.Reset_password')}
              </span>
            </button>
            <Link
              className='flex items-center'
              to={`${patients}/${patientDetails?.id}/${details}`}
            >
              <img src={editIconBlue} alt='edit icon blue' />
              <p className='ml-2 text-sm font-light underline text-blue-lighter'>
                {t('Admin.Edit_link')}
              </p>
            </Link>
          </div>
        </div>

        <div className='flex justify-between'>
          <p>{t('Patients.gender.title')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.gender || '-'}
          </p>
        </div>
        {/* <div className='flex justify-between'>
          <p>{t('Patients.birth.year.title')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.yearOfBirth || '-'}
          </p>
        </div> */}
        <div className='flex justify-between'>
          <p>{t('Patient_details.Previous_immunosuppression')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.prevImmunosuppression || '-'}
          </p>
        </div>
        <div className='flex justify-between'>
          <p>{t('Patient_details.Skin_tone')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.skinColour || '-'}
          </p>
        </div>
        <div className='flex justify-between'>
          <p>{t('Add_patients.Hair_colour')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.hairColour || '-'}
          </p>
        </div>
        <div className='flex justify-between'>
          <p>{t('Patient_details.Eye_colour')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.eyeColour || '-'}
          </p>
        </div>
        <div className='flex justify-between'>
          <p>{t('Feckle_density')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.freckleDensity || '-'}
          </p>
        </div>
        <div className='flex justify-between'>
          <p>{t('sunburn_frequency')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.sunburnFrequency || '-'}
          </p>
        </div>
        <div className='flex justify-between'>
          <p>{t('tan_frequency')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.tanFrequency || '-'}
          </p>
        </div>
        <div className='flex justify-between'>
          <p>{t('Patient_details.Minimal_Erythemal_Dose')}</p>
          <p className='font-light text-black-light'>
            {patientDetails?.MED ? patientDetails?.MED + ' J/m²' : '-'}
          </p>
        </div>
      </div>

      <Modal
        closeOnEsc={false}
        closeMaskOnClick={false}
        isVisible={resetPasswordModal}
        setVisible={setResetPasswordModal}
        modalContent={
          <PasswordModal
            t={t}
            data={{ ...credentials }}
            setPasswordModal={setResetPasswordModal}
          />
        }
      />
    </>
  );
}
