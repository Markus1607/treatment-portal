import { makePatientFeedback } from 'api/data';
import { useMemo, useState } from 'react';
import Modal from 'components/Modals/Modal';
import { lazyWithRetry } from 'utils/lazyWithRetry';

export default function Feedback({ t }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const data = useMemo(() => makePatientFeedback(2), []);
  const [selectedContent, setSelectedContent] = useState({
    id: '',
    type: 'akQues',
    date: '',
    title: '',
    answers: {
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
      8: '',
      9: '',
      10: '',
      11: '',
      12: '',
    },
  });

  //Lazy loaded feedback modal
  const FeedbackModal = lazyWithRetry(() => import('./FeedbackModal'));

  const handleModalClick = (content) => {
    setModalVisible(true);
    setSelectedContent(content);
  };

  return (
    <div className='p-4 text-sm text-left bg-white containerShadow divide-gray-light divide-solid divide-y'>
      <h2 className='pb-6 text-base font-bold 2xl:text-lg'>
        {t('Patient_details.card_title.87')}
      </h2>
      {/* TODO: To be refactored into react-virtualized table */}
      <div className='3xl:max-h-[17.5rem] max-h-[13rem] w-full divide-gray-light divide-y overflow-y-auto'>
        {data.map((ques) => (
          <div
            key={ques.id}
            onClick={() => handleModalClick(ques)}
            className='flex justify-between py-4 cursor-pointer hover:bg-gray-lightest'
          >
            <div className='flex items-center'>
              <span className='block mr-4 w-2.5 h-2.5 bg-blue rounded-full' />
              <div>
                <p>{t(`${ques.title}`)}</p>
                <p className='font-light text-black-light'>
                  354 days after the last dPDT session
                </p>
              </div>
            </div>
            <p className='mr-2 font-light text-black-light'>{ques.date}</p>
          </div>
        ))}
      </div>

      <Modal
        isVisible={isModalVisible}
        setVisible={setModalVisible}
        modalContent={
          <FeedbackModal
            t={t}
            data={selectedContent}
            setModalVisible={setModalVisible}
          />
        }
      />
    </div>
  );
}
