import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { patients } from 'routes';
import Modal from 'components/Modals/Modal';
import { AppProvider } from 'AppProvider';
import { patientBEData } from '../RegisterPatient/api/format';
import { useQueryClient } from 'react-query';
import { ClipLoader } from 'components/Loader';
import { Error, Success } from 'components/Flags/Flags';
import DeletePatientModal from './DeletePatientModal';
import { useHistory } from 'react-router-dom';
import { defaultRegistrationFields } from '../api/format';
import { TickButton, DeleteButton } from 'components/Forms/Buttons';
import PatientDetailsForms from '../PatientDetailsForms/PatientDetailsForms';
import {
  usePatientDataPerID,
  useDeletePatientDetails,
  useUpdatePatientDetails,
} from './api/query';
import type { defaultRegistrationFieldsType } from '../api/format.d';

type PatientEditDetailsProps = {
  patientUid: string;
  setSubTitle: (value: string) => void;
};

export default function PatientEditDetails({
  patientUid,
  setSubTitle,
}: PatientEditDetailsProps) {
  const history = useHistory();
  const containerRef = useRef(null);
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const [patientDeleted, setPatientDeleted] = useState(false);
  const [searchAddressError, setSearchAddressError] = useState('');
  const deletePatientDetails = useDeletePatientDetails(patientUid);
  const updatePatientDetails = useUpdatePatientDetails(patientUid);
  const [deletePatientModal, setDeletePatientModal] = useState(false);
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();
  const { isLoading, data } = usePatientDataPerID(
    user.token,
    user.id,
    patientUid
  );
  const {
    reset,
    watch,
    control,
    setFocus,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<defaultRegistrationFieldsType>({
    defaultValues: defaultRegistrationFields,
  });

  useEffect(() => {
    setSubTitle(
      `${t('Patient_details.page_title')} > ${t(
        'Patient_details.page_title_edit'
      )}`
    );
  }, [t, setSubTitle]);

  useEffect(() => {
    if (!isLoading && !data?.error) {
      reset(data);
      setErrMsg('');
    }
    if (!isLoading && data?.error) {
      setErrMsg(t('Error.patient.details.fetch'));
    }
  }, [t, data, isLoading, reset]);

  const handlePatientDeletion = () => {
    setErrMsg('');
    deletePatientDetails.mutate(
      {
        token: user.token,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            setPatientDeleted(true);
            queryClient.invalidateQueries('patientDataPerID');
            queryClient.invalidateQueries('unformattedAllPatientData');
            setTimeout(() => history.push(patients), 1500);
          }
        },

        onError: (response) => {
          console.error(response);
          setDeletePatientModal(false);
          setErrMsg(t('Error.deleting.patient.details'));
        },
      }
    );
  };

  const handlePatientEdit = (data: defaultRegistrationFieldsType) => {
    setErrMsg('');
    updatePatientDetails.mutate(
      {
        token: user.token,
        data: patientBEData(data),
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            queryClient.invalidateQueries('patientDataPerID');
            queryClient.invalidateQueries('unformattedAllPatientData');
          }
        },

        onError: (response) => {
          console.error(response);
          setErrMsg(t('Error.updating.patient.details'));
        },
      }
    );
  };

  const requiredFieldsErrors = !isEmpty(errors);
  const isAnsweredTrue = (value: keyof defaultRegistrationFieldsType) =>
    watch(value) === 'true';

  return (
    <div ref={containerRef} className='childrenContainer'>
      <form
        className='flex flex-col'
        onSubmit={handleSubmit(handlePatientEdit)}
      >
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
          <div className='flex flex-col text-center space-y-3'>
            {errMsg && (
              <p className='flex mx-auto text-sm errorMessage'>{errMsg}</p>
            )}

            <Error
              duration={4000}
              containerClass='mx-auto'
              state={requiredFieldsErrors}
              value={t('Add_patients.Some_fields_missing')}
            />

            <div className='flex justify-between space-x-4'>
              <DeleteButton
                className='flex-shrink-0 gap-2.5 px-5 text-warning 2xl:text-base font-medium border-2 border-warning rounded hover:scale-y-105'
                text={t('Delete_patient.button_text')}
                onClick={() => setDeletePatientModal(true)}
              />

              {(isLoading || (!errMsg && updatePatientDetails.isLoading)) && (
                <ClipLoader color='#1e477f' size={1} />
              )}

              <div className='flex-shrink-0 btn-with-flag'>
                <Success
                  state={updatePatientDetails.isSuccess}
                  value={t('Add_patients.update_success')}
                />

                <TickButton
                  text={t('Button_save_changes')}
                  alt={t('Button_save_changes')}
                  className='2xl:px-6 2xl:text-base'
                />
              </div>
            </div>
          </div>
        </PatientDetailsForms>
      </form>
      <Modal
        isVisible={deletePatientModal}
        setVisible={setDeletePatientModal}
        modalContent={
          <DeletePatientModal
            t={t}
            patientDeleted={patientDeleted}
            onDeleteFunction={handlePatientDeletion}
            setDeletePatientModal={setDeletePatientModal}
            isDeleting={deletePatientDetails.isLoading}
          />
        }
      />
    </div>
  );
}
