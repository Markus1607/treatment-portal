import { useState } from 'react';
import { uniqueId } from 'lodash';
import { TFunction } from 'react-i18next';
import nextArrow from 'assets/images/nextArrow.svg';
import onboarding1Image from 'assets/images/onboarding1.png';
import onboarding2Image from 'assets/images/onboarding2.png';
import onboarding3Image from 'assets/images/onboarding3.png';
import onboarding4Image from 'assets/images/onboarding4.png';
import onboarding5Image from 'assets/images/onboarding5.png';
import onboarding6Image from 'assets/images/onboarding6.png';

const onboardingImages = {
  1: onboarding1Image,
  2: onboarding2Image,
  3: onboarding3Image,
  4: onboarding4Image,
  5: onboarding5Image,
  6: onboarding6Image,
};

export type onboardingImagesKeyType = keyof typeof onboardingImages;

type OnboardingModalProps = {
  t: TFunction;
  handleOnboardingClose: () => void;
  setOnboardingModal: (value: boolean) => void;
};

export default function OnboardingModal({
  t,
  setOnboardingModal,
  handleOnboardingClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const pageData = new Array(6).fill(0).map((_, index) => ({
    title: t(`onboarding_screens_${index + 1}.card_title`),
    content: t(`onboarding_screens_${index + 1}.card_body`),
    image: onboardingImages[(index + 1) as onboardingImagesKeyType],
  }));

  const nextClick = () => {
    if (step < pageData.length - 1) {
      setStep(step + 1);
    } else if (step === pageData.length - 1) {
      handleOnboardingClose();
    }
  };

  return (
    <div className='max-w-[44rem] flex text-black text-sm bg-dashboard rounded-lg lg:max-w-4xl lg:text-base xl:max-w-5xl'>
      {pageData[step] && (
        <div className='flex flex-col justify-between w-2/5 px-6 pt-16 lg:pt-24'>
          <div>
            <h1 className='lg:w-[80%] w-full text-2xl font-medium lg:text-3xl'>
              {pageData[step].title}
            </h1>
            <p className='text-[0.9rem] mt-8 font-light'>
              {pageData[step].content}
            </p>
          </div>

          <div className='flex my-6 lg:my-8'>
            <button
              onClick={() => nextClick()}
              className='flex items-center justify-center gap-2 px-4 py-2 text-base text-white rounded bg-blue hover:scale-y-105 xl:px-6'
            >
              <span> {t('onboarding_screens.button_text')}</span>
            </button>
            <div className='flex items-center pl-8 space-x-4 lg:space-x-6'>
              {pageData.map((dot, index) => (
                <div
                  data-step={dot}
                  key={uniqueId('page-data-')}
                  onClick={() => (index <= step ? setStep(index) : null)}
                  className={`${
                    index <= step
                      ? 'bg-blue hover: cursor-pointer'
                      : 'bg-gray-new'
                  } w-2.5 h-2.5 rounded-full scale-75`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className='relative'>
        <img
          className='z-50 aspect-square'
          src={pageData[step].image}
          alt={`screen-${step + 1}`}
        />
        <span
          onClick={() => {
            setOnboardingModal(false);
            handleOnboardingClose();
          }}
          className='absolute text-sm font-light text-white underline cursor-pointer right-5 top-2'
        >
          {t('onboarding_skip_text')}
        </span>
        <span
          onClick={() => nextClick()}
          className='nextArrow right-[-6.5rem] absolute top-1/2 cursor-pointer select-none transform -translate-x-1/2 -translate-y-1/2'
        >
          <img
            className='arrowBtn md:scale-75 lg:scale-90'
            src={nextArrow}
            alt='arrow'
          />
        </span>
      </div>
    </div>
  );
}
