import { TFunction } from 'react-i18next';
import { patients, records } from 'routes';
import { useHistory } from 'react-router-dom';
import { TickButton } from 'components/Forms/Buttons';

type TreatmentFinishedModalProps = {
  t: TFunction;
  selectedPatientID: number;
  history: ReturnType<typeof useHistory>;
};

export default function TreatmentFinishedModal({
  t,
  history,
  selectedPatientID,
}: TreatmentFinishedModalProps) {
  return (
    <div className='px-24 text-base font-medium text-left text-black whitespace-pre-wrap py-14'>
      <p className='text-2xl'>{t('treatment_finished.heading_1')}</p>
      <p className='max-w-md py-5 font-normal'>
        {t('treatment_finished.body_1')}
      </p>
      <TickButton
        alt='tick'
        className='w-full text-base'
        text={t('button.view_treatment_report')}
        onClick={() => {
          history.push(`${patients}/${selectedPatientID}/${records}`);
        }}
      />
    </div>
  );
}
