import { isEmpty } from 'lodash';
import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'components/Modals/Modal';
import { patientBEData } from './api/format';
import { useQueryClient } from 'react-query';
import { Error } from 'components/Flags/Flags';
import { ClipLoader } from 'components/Loader';
import { usePostPatientDetails } from './api/query';
import { TickButton } from 'components/Forms/Buttons';
import RegisterModal from './RegisterModal/RegisterModal';
import { defaultRegistrationFields } from '../api/format';
import { defaultRegistrationFieldsType } from '../api/format.d';
import PatientDetailsForms from '../PatientDetailsForms/PatientDetailsForms';

export default function RegisterPatient() {
  const containerRef = useRef(null);
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const registerPatient = usePostPatientDetails();
  const { t, cookies } = AppProvider.useContainer();
  const [passwordModal, setPasswordModal] = useState(false);
  const [searchAddressError, setSearchAddressError] = useState('');
  const [patientCredentials, setPatientCredentials] = useState<{
    patientID: string | number;
    password: string;
    username: string;
  }>({
    patientID: '',
    password: '',
    username: '',
  });

  const {
    watch,
    control,
    register,
    setFocus,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultRegistrationFields,
  });

  useTitle(`${t('Add_patients.Patients')} > ${t('Add_patients.page_title')}`);

  const onSubmit = (data: defaultRegistrationFieldsType) => {
    setErrMsg('');
    const { token } = cookies.user;
    registerPatient.mutate(
      { token, data: patientBEData(data) },
      {
        onSuccess: ({ data }) => {
          if (data) {
            setPasswordModal(true);
            setPatientCredentials({
              patientID: data.patient.id,
              username: data.credentials.username,
              password: data.credentials.password,
            });
            queryClient.invalidateQueries('unformattedAllPatientData');
          }
        },

        onError: (response) => {
          console.error(response);
          setErrMsg(t('Error.registering.patient'));
        },
      }
    );
  };

  const requiredFieldsErrors = !isEmpty(errors);
  const isAnsweredTrue = (value: keyof defaultRegistrationFieldsType) =>
    watch(value) === 'true';

  return (
    <div ref={containerRef} className='childrenContainer'>
      <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <PatientDetailsForms
          t={t}
          errors={errors}
          control={control}
          setValue={setValue}
          setFocus={setFocus}
          register={register}
          getValues={getValues}
          isAnsweredTrue={isAnsweredTrue}
          searchAddressError={searchAddressError}
          setSearchAddressError={setSearchAddressError}
        >
          <div className='flex justify-start space-x-4'>
            <div className='btn-with-flag'>
              <TickButton
                text={t('Add_patients.page_btn')}
                alt={t('Add_patients.page_btn')}
                className='2xl:px-6 2xl:text-base'
              />
              <Error
                duration={4000}
                state={requiredFieldsErrors}
                value={t('Add_patients.Some_fields_missing')}
              />
            </div>
            {errMsg && <p className='text-sm errorMessage'>{errMsg}</p>}

            {registerPatient.isLoading && (
              <ClipLoader color='#1e477f' size={1} />
            )}
          </div>
        </PatientDetailsForms>
      </form>
      <Modal
        closeOnEsc={false}
        closeMaskOnClick={false}
        isVisible={passwordModal}
        setVisible={setPasswordModal}
        modalContent={<RegisterModal data={patientCredentials} />}
      />
    </div>
  );
}
