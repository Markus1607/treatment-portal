import DOMPurify from 'dompurify';
import { TFunction } from 'react-i18next';
import { NoIconButton } from 'components/Forms/Buttons';

type TreatmentStartedModalPropType = {
  handleViewTreatment: () => void;
  t: TFunction<'translation', undefined>;
};

export default function TreatmentStartedModal({
  t,
  handleViewTreatment,
}: TreatmentStartedModalPropType) {
  return (
    <div className='max-w-lg text-left whitespace-pre-wrap p-14 text-black-light space-y-6'>
      <h1 className='text-lg font-medium text-black 3xl:text-xl'>
        {t('treatment_started.heading')}
      </h1>

      <main className='font-light space-y-3'>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(t('treatment_started.body_1')),
          }}
        />

        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(t('treatment_started.body_2')),
          }}
        />
      </main>

      <NoIconButton
        onClick={handleViewTreatment}
        text={t('button.view_treatment')}
        className='py-[0.5rem] rounded-[0.25rem] flex-shrink-0 px-3.5 hover:cursor-pointer active:scale-100 hover:scale-105'
      />
    </div>
  );
}
