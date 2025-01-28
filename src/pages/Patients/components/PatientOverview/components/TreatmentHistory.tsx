import { Link } from 'react-router-dom';
import { details, patients } from 'routes';
import editIconBlue from 'assets/images/ic_edit_blue.svg';
import { TFunction } from 'react-i18next';
import { PatientDataPerID } from '../api/query';

type TreatmentHistoryProps = {
  t: TFunction<'translation', undefined>;
  data: PatientDataPerID | undefined;
};

export default function TreatmentHistory({ t, data }: TreatmentHistoryProps) {
  const patientDetails = data && 'id' in data ? data : undefined;

  return (
    <div className='flex flex-col p-4 text-left bg-white containerShadow space-y-6'>
      <div className='flex justify-between'>
        <h2 className='text-base font-semibold 2xl:text-lg'>
          {t('Add_patients.card_treatment_history')}
        </h2>
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
      <div className='flex justify-between'>
        <p>
          {t('Patient_details.Has_there_been_any_prior_treatment_of_the_AK?')}
        </p>
        <p className='font-light text-black-light'>
          {patientDetails?.priorTreatment || '-'}
        </p>
      </div>
      <div className='flex justify-between'>
        <p>
          {t('Patient_details.Date_of_last_session_of_prior_treatment_of_AK')}
        </p>
        <p className='font-light text-black-light'>
          {patientDetails?.priorTreatmentDate || '-'}
        </p>
      </div>
      <div className='flex flex-col'>
        <p className='pb-4'>{t('Add_patients.question.comments')}</p>
        <p className='min-h-[5rem] p-4 text-black-light font-light bg-gray-lightest border border-gray-light rounded-md'>
          {patientDetails?.clinicalComments}
        </p>
      </div>
    </div>
  );
}
