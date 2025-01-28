import moment from 'moment';
import Select from 'components/Forms/Select';
import TextArea from 'components/Forms/TextArea';
import DatePicker from 'components/Forms/DatePicker';
import { NumberInput } from 'components/Forms/Inputs';
import { ToggleRadio, ColorToggleRadio } from 'components/Forms/Radios';
import {
  gender,
  skinTone,
  yesNoBool,
  eyeColour,
  hairColour,
  tanFrequency,
  freckleDensity,
  sunburnFrequency,
} from 'utils/options';
import { TFunction } from 'react-i18next';
import { defaultRegistrationFieldsType } from '../api/format.d';
import {
  Control,
  UseFormRegister,
  UseFormSetFocus,
  UseFormSetValue,
  UseFormGetValues,
} from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';

type PatientDetailsFormsPropTypes = {
  t: TFunction;
  children: React.ReactNode;
  searchAddressError: string;
  errors: Record<string, any>;
  control: Control<defaultRegistrationFieldsType, any>;
  register: UseFormRegister<defaultRegistrationFieldsType>;
  setFocus: UseFormSetFocus<defaultRegistrationFieldsType>;
  setValue: UseFormSetValue<defaultRegistrationFieldsType>;
  getValues: UseFormGetValues<defaultRegistrationFieldsType>;
  setSearchAddressError: Dispatch<SetStateAction<string>>;
  isAnsweredTrue: (value: keyof defaultRegistrationFieldsType) => boolean;
};

export default function PatientDetailsForms({
  t,
  errors,
  control,
  children,
  register,
  setFocus,
  isAnsweredTrue,
}: PatientDetailsFormsPropTypes) {
  return (
    <div className='md:w-[38rem] xl:w-[40rem] flex flex-col m-4 mx-auto'>
      {/* Additional information */}
      <div className='container'>
        <div className='p-3 pb-6 mb-4 text-sm text-black bg-white containerShadow space-y-7'>
          <header className='flex flex-col gap-2'>
            <h1 className='text-base font-medium 2xl:text-lg'>
              {t('skin-sensitivity-to-radiation-title')}
            </h1>
            <p className='text-sm font-light text-black-lighter'>
              {t('patient-registration-sub-title')}
            </p>
          </header>

          <ColorToggleRadio
            width='w-44'
            errors={errors}
            name='skinTone'
            control={control}
            options={skinTone()}
            subText={t('Add_patients.non-exposed_areas')}
            label={t('Patient_details.Skin_tone')}
            rules={{ required: t('Error.required.field') }}
          />

          <ColorToggleRadio
            errors={errors}
            name='hairColor'
            width='w-44'
            control={control}
            options={hairColour()}
            label={t('Add_patients.Hair_colour')}
            rules={{ required: t('Error.required.field') }}
          />

          <ColorToggleRadio
            errors={errors}
            name='eyeColor'
            width='w-44'
            control={control}
            options={eyeColour()}
            label={t('Patient_details.Eye_colour')}
            rules={{ required: t('Error.required.field') }}
          />

          <ToggleRadio
            width='w-28'
            errors={errors}
            control={control}
            name='freckleDensity'
            options={freckleDensity()}
            label={t('Add_patients.freckles')}
            rules={{ required: t('Error.required.field') }}
          />

          <Select
            width='18em'
            errors={errors}
            control={control}
            name='sunburnFrequency'
            options={sunburnFrequency()}
            label={t('Add_patients.Reaction_prolonged_sun')}
            placeholder={t('Add_patients.Please_select')}
            rules={{ required: t('Error.required.field') }}
          />

          <Select
            width='18em'
            errors={errors}
            control={control}
            name='tanFrequency'
            options={tanFrequency()}
            label={t('Add_patients.Tan_frequency')}
            placeholder={t('Add_patients.Please_select')}
            rules={{ required: t('Error.required.field') }}
          />
        </div>
      </div>

      {/* Patient  information */}
      <div className='container mb-5 text-sm text-black'>
        <div className='p-3 pb-4 mb-5 space-y-5 bg-white containerShadow'>
          <h1 className='text-base font-medium 2xl:text-lg'>
            {t('Add_patients.card_title')} {t('optional')}
          </h1>

          <ToggleRadio
            width='w-40'
            name='gender'
            control={control}
            errors={errors}
            options={gender()}
            label={t('Add_patients.Gender')}
            rules={{ required: false }}
          />

          <DatePicker
            format='yyyy'
            errors={errors}
            control={control}
            name='yearOfBirth'
            setFocus={setFocus}
            label={t('Patients.birth.year.title')}
            maxDate={moment().subtract(18, 'years').toDate()}
            rules={{ required: false }}
            placeholder={t('Patients.birth.year.placeholder')}
            labelStyle='!text-black'
          />

          <NumberInput
            name='MED'
            width={12.5}
            errors={errors}
            control={control}
            label={t('Add_patients.med.title')}
            placeholder={t('Placeholder.numeric.value')}
            rules={{
              min: { value: '100', message: t('Error.med.range') },
              max: { value: '2000', message: t('Error.med.range') },
            }}
          />
        </div>

        {/* Treatment history */}
        <div className='p-3 pb-4 space-y-5 bg-white containerShadow'>
          <h1 className='!mb-4 text-base 2xl:text-lg font-medium'>
            {t('Add_patients.card_treatment_history')} {t('optional')}
          </h1>

          <ToggleRadio
            errors={errors}
            width='w-28'
            control={control}
            options={yesNoBool()}
            name='immunosuppression'
            subText={t('If_yes_specify')}
            label={t('Add_patients.question.29')}
            rules={{ required: false }}
          />

          {isAnsweredTrue('immunosuppression') && (
            <TextArea
              height='3em'
              errors={errors}
              name='immunoSpecify'
              labelStyle='text-black-lighter font-light'
              label={t('Add_patients.Previous_immunosuppresants')}
              placeholder={t('Add_patients.input_placeholder.12.58')}
              disabled={!isAnsweredTrue('immunosuppression')}
              register={{
                ...register('immunoSpecify', {
                  required:
                    isAnsweredTrue('immunosuppression') &&
                    t('Error.required.field'),
                }),
              }}
            />
          )}

          <ToggleRadio
            errors={errors}
            width='w-28'
            control={control}
            name='skinCancer'
            options={yesNoBool()}
            rules={{ required: false }}
            subText={t('If_yes_specify')}
            label={t('Add_patients.question.48')}
          />

          {isAnsweredTrue('skinCancer') && (
            <TextArea
              height='3em'
              errors={errors}
              name='skinCancerSpecify'
              labelStyle='text-black-lighter font-light'
              label={t('Add_patients.Non-melanoma_skin_cancer_history')}
              placeholder={t('Add_patients.melanoma_placeholder')}
              disabled={!isAnsweredTrue('skinCancer')}
              register={{
                ...register('skinCancerSpecify', {
                  required:
                    isAnsweredTrue('skinCancer') && t('Error.required.field'),
                }),
              }}
            />
          )}

          <ToggleRadio
            width='w-28'
            name='priorAK'
            errors={errors}
            control={control}
            options={yesNoBool()}
            rules={{ required: false }}
            subText={t('If_yes_specify')}
            label={t('Add_patients.question.87')}
          />

          <DatePicker
            errors={errors}
            control={control}
            setFocus={setFocus}
            maxDate={new Date()}
            labelStyle='font-light'
            className='!max-w-[230px]'
            name='priorTreatmentDate'
            disabled={!isAnsweredTrue('priorAK')}
            label={t('Add_patients.prior.treatment.date')}
            placeholder={t('Add_patients.prior.treatment.placeholder')}
            rules={{
              required: isAnsweredTrue('priorAK') && t('Error.required.field'),
            }}
          />

          <TextArea
            errors={errors}
            name='clinicalComments'
            placeholder={t('Add_patients.Add_comments')}
            label={t('Add_patients.question.comments')}
            register={{ ...register('clinicalComments') }}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
