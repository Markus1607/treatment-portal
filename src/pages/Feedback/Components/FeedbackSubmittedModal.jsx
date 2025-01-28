import { ClipLoader } from 'components/Loader';

export default function FeedbackSubmittedModal({ t }) {
  return (
    <div className='text-center p-14'>
      <h1 className='text-xl font-medium text-black 2xl:text-2xl'>
        {t('feedback_submitted.heading')}
      </h1>
      <p className='text-[0.95rem] my-6 max-w-xs text-black-light whitespace-pre-wrap font-light'>
        {t('feedback_submitted.body')}
      </p>
      <ClipLoader color='#1e477f' size={1} />
    </div>
  );
}
