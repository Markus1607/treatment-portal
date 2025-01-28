import { Radio } from 'components/Forms/Radios';
import MultiCheckbox from 'components/Forms/MultiCheckbox';
import { ToggleRadio } from 'components/Forms/Radios';
import TextArea from 'components/Forms/TextArea';
import { yesNo } from 'utils/options';
import Slider from 'components/Forms/Slider';

export default function FeedbackFormFields({
  t,
  errors,
  control,
  setValue,
  register,
  children,
}) {
  return (
    <div className='p-4 mb-16 font-medium text-black whitespace-pre-wrap bg-white containerShadow space-y-6'>
      <h1 className='!mb-4 text-base 2xl:text-lg font-medium'>
        {t('Submit_feedback.card_title')}
      </h1>

      <MultiCheckbox
        errors={errors}
        disabled={false}
        control={control}
        setValue={setValue}
        name='otherTreatments'
        label={t('Submit_feedback.question.10')}
        subText={t('Submit_feedback.information')}
        options={[
          { value: '1', label: t('Submit_feedback.answer') },
          { value: '2', label: t('Submit_feedback.answer.100') },
          { value: '3', label: t('Submit_feedback.answer.13') },
          { value: '4', label: t('Submit_feedback.answer.23') },
          { value: '5', label: t('Submit_feedback.answer.97') },
          { value: '6', label: t('Submit_feedback.answer.86') },
          { value: '7', label: t('Submit_feedback.answer.3') },
          { value: '8', label: t('Submit_feedback.answer.26') },
          { value: '9', label: t('Submit_feedback.answer.55') },
          { value: '10', label: t('Submit_feedback.answer.34') },
        ]}
      />

      <div>
        <p className='mb-2'>{t('Submit_feedback.How_was_the_session')}</p>
        <Radio
          errors={errors}
          options={[
            { value: '1', label: t('Submit_feedback.Worse') },
            { value: '2', label: t('Submit_feedback.Similar') },
            { value: '3', label: t('Submit_feedback.Better') },
          ]}
          control={control}
          noTranslate={true}
          name='sessionComparison'
        />
      </div>

      <MultiCheckbox
        name='usefulFeatures'
        label={t('Submit_feedback.question.51')}
        errors={errors}
        subText={t('Submit_feedback.information')}
        control={control}
        options={[
          { value: '1', label: t('Submit_feedback.answer.51') },
          { value: '2', label: t('Submit_feedback.answer.21') },
          { value: '3', label: t('Submit_feedback.answer.89') },
          { value: '4', label: t('Submit_feedback.answer.78') },
          { value: '5', label: t('Submit_feedback.answer.80') },
          { value: '6', label: t('Submit_feedback.answer.11') },
          { value: '7', label: t('Submit_feedback.answer.98') },
        ]}
        setValue={setValue}
        disabled={false}
      />

      <ToggleRadio
        name='recommend'
        options={yesNo()}
        control={control}
        label={t('Submit_feedback.question.25')}
        errors={errors}
        width='w-28'
      />
      <div>
        <p className='mt-6'>{t('Submit_feedback.question')}</p>
        <p className='text-sm font-normal text-black-lighter'>
          {t('Submit_feedback.information.6')}
        </p>
        <TextArea
          errors={errors}
          name='clinicalComments'
          placeholder={t('Submit_feedback.Start_typing_here…')}
          register={{ ...register('clinicalComments') }}
        />
      </div>

      <h1 className='pb-1 text-base font-medium border-b border-gray-light'>
        {t('Submit_feedback.subheading')}
      </h1>

      <Slider
        value={5}
        control={control}
        name='confidence'
        label={t('Submit_feedback.question.39')}
        text1={t('Submit_feedback.label_left')}
        text2={t('Submit_feedback.label_right')}
      />

      <Slider
        value={5}
        control={control}
        name='useFrequently'
        label={t('Submit_feedback.question.14')}
        text1={t('Submit_feedback.label_left')}
        text2={t('Submit_feedback.label_right')}
      />

      <Slider
        value={5}
        control={control}
        name='learnALot'
        label={t('Submit_feedback.question.23')}
        text1={t('Submit_feedback.label_left')}
        text2={t('Submit_feedback.label_right')}
      />

      <Slider
        value={5}
        control={control}
        name='complex'
        label={t('Submit_feedback.question.28')}
        text1={t('Submit_feedback.label_left')}
        text2={t('Submit_feedback.label_right')}
      />

      <ToggleRadio
        width='w-28'
        name='coverNeeds'
        options={yesNo()}
        control={control}
        label={t('Submit_feedback.question.81')}
        errors={errors}
      />

      <TextArea
        errors={errors}
        name='enjoyComments'
        labelStyle='font-medium'
        placeholder={t('Submit_feedback.Start_typing_here…')}
        label={t('Submit_feedback.question.49')}
        register={{ ...register('enjoyComments') }}
      />
      {children}
    </div>
  );
}
