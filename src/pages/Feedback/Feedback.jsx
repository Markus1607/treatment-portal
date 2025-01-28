import { useTitle } from 'utils/hooks';
import { useRef, useState } from 'react';
import { AppProvider } from 'AppProvider';
import { useForm } from 'react-hook-form';
import apiServer from 'server/apiServer';
import { TickButton } from 'components/Forms/Buttons';
import { useHistory } from 'react-router-dom';
import FeedbackFormFields from './Components/FeedbackFormFields';
import FeedbackSubmittedModal from './Components/FeedbackSubmittedModal';
import Modal from 'components/Modals/Modal';
import { patients, postFeedback } from 'routes';
import { formatFeedbackData, defaultValues } from './api/format';
import { ClipLoader } from 'components/Loader';

export default function Feedback() {
  const history = useHistory();
  const containerRef = useRef(null);
  const [errMsg, setErrMsg] = useState('');
  const { t, cookies } = AppProvider.useContainer();
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });
  const [submittingFeedback, setFeedbackSubmit] = useState(false);
  const [feedbackSubmittedModal, setFeedbackSubmittedModal] = useState(false);

  useTitle(t('Dashboard.Submit_feedback'));

  const onSubmit = (data) => {
    setErrMsg('');
    setFeedbackSubmit(true);
    apiServer
      .post(
        `${postFeedback}`,
        { ...formatFeedbackData(data) },
        {
          headers: {
            'x-access-tokens': cookies.user.token,
          },
        }
      )
      .then(() => {
        setFeedbackSubmit(false);
        setFeedbackSubmittedModal(true);
        setTimeout(() => history.push(patients), 2000);
      })
      .catch((error) => {
        setFeedbackSubmit(false);
        setFeedbackSubmittedModal(false);
        setErrMsg(t('Error.feedback'));
        console.error(error.message);
      });
  };

  return (
    <div ref={containerRef} className='childrenContainer'>
      <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <div className='p-4 mx-auto xl:grid xl:grid-cols-2 xl:mx-0'>
          <div className='container mx-auto text-sm 2xl:max-w-xl lg:ml-0'>
            <FeedbackFormFields
              t={t}
              errors={errors}
              control={control}
              setValue={setValue}
              register={register}
            >
              <div className='flex justify-end space-x-4'>
                {errMsg && <p className='text-sm errorMessage'>{errMsg}</p>}

                {!errMsg && submittingFeedback && (
                  <div className='mr-[8rem]'>
                    <ClipLoader color='#1e477f' size={0.8} />
                  </div>
                )}

                <TickButton
                  text={t('Submit_feedback.Submit_feedback')}
                  alt={t('Submit_feedback.Submit_feedback')}
                  className='px-5'
                />
              </div>
            </FeedbackFormFields>
          </div>
        </div>
      </form>
      <Modal
        overflow='visible'
        isVisible={feedbackSubmittedModal}
        setVisible={setFeedbackSubmittedModal}
        modalContent={<FeedbackSubmittedModal t={t} />}
      />
    </div>
  );
}
