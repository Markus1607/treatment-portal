import { DiscardButton } from 'components/Forms/Buttons';
import { isArray, uniqueId } from 'lodash';

export default function FeedbackModal({ t, data, setModalVisible }) {
  return (
    <div className='text-base text-black bg-dashboard'>
      <header className='flex justify-between px-4 py-4 font-medium bg-white border gap-36'>
        <h2 className='flex-shrink-0 3xl:text-2xl xl:text-xl'>ID: {data.id}</h2>
        <h2 className='flex-shrink-0 3xl:text-2xl xl:text-xl'>
          Monday 11th March 2021 at 11:00
        </h2>
      </header>
      <main className='max-h-[35rem] m-4 3xl:max-h-full text-sm overflow-auto'>
        {data.type === 'akQues' ? (
          <AKQuestionContent t={t} data={data} />
        ) : (
          <SatisfactionContent t={t} data={data} />
        )}
      </main>
      <footer className='flex flex-row-reverse justify-between px-4 py-3 bg-white border'>
        <DiscardButton
          alt={t('Button_Close')}
          text={t('Button_Close')}
          onClick={() => setModalVisible(false)}
        />
      </footer>
    </div>
  );
}

const AKQuestionContent = ({ t, data }) => {
  const renderQuestions = () => {
    const results = [];
    for (let i = 1; i < 10; i++) {
      results.push(
        <div
          key={uniqueId('akques-')}
          className='flex items-center justify-between py-3 pl-4 pr-2 font-medium border-b gap-32 border-gray-light'
        >
          <p>
            {`${i}.`}
            {'\u00A0\u00A0'}
            {t(`Actinic_Keratosis_Quality_of_Life_${i}`)}
          </p>
          <span className='font-light text-black-light'>
            {data?.answers[i]}
          </span>
        </div>
      );
    }
    return results;
  };
  return (
    <div className='p-4 bg-white containerShadow'>
      <h2 className='mb-4 text-lg font-bold'>{t(`${data.title}`)}</h2>
      {renderQuestions()}
    </div>
  );
};

const SatisfactionContent = ({ t, data }) => {
  const renderQuestions = () => {
    const results = [];
    for (let i = 1; i < 12; i++) {
      results.push(
        <div
          key={uniqueId('satisques-')}
          className='flex items-center justify-between py-3 pl-4 pr-2 font-medium border-b gap-36 border-gray-light'
        >
          <p>
            {`${i}.`} {'\u00A0'}
            {t(`Patient_Satisfaction_Questionnaire.${i}`)}
          </p>
          <span className='font-light text-black-light'>
            {i !== 4 && data?.answers[i]}
            {'\u00A0'}
            {i === 4 &&
              isArray(data?.answers[4]) &&
              data?.answers[4].map((answer, index) => (
                <span key={uniqueId('feedback-list-')} className='block'>
                  {`${index + 1}. ${answer}`}
                </span>
              ))}
          </span>
        </div>
      );
    }
    return results;
  };
  return (
    <div className='p-4 bg-white containerShadow'>
      <h2 className='mb-4 text-lg font-bold'>{t(`${data.title}`)}</h2>
      {renderQuestions()}
      <div className='flex justify-between py-3 pl-4 pr-2'>
        <span>12. {t('Patient_Satisfaction_Questionnaire.12')}</span>
        <textarea
          rows='8'
          cols='30'
          disabled={true}
          name='patientComment'
          value={data?.answers[12]}
          className='h-[4.5rem] w-[80%] p-2 text-black-light font-rubik font-light bg-white border border-gray-light rounded cursor-not-allowed resize-none'
        />
      </div>
    </div>
  );
};
