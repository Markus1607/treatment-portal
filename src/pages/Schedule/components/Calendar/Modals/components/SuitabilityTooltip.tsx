import { TFunction } from 'react-i18next';
import { ReactComponent as InfoIcon } from 'assets/images/ic_info.svg';

type SuitabilityTooltipPropTypes = {
  zIndex: string;
  top?: string;
  left?: string;
  arrowLeft?: string;
  arrowTop?: string;
  arrowRotate?: string;
  t: TFunction<'translation', undefined>;
};

export default function SuitabilityTooltip({
  t,
  zIndex,
  top = 'top-8',
  left = '-left-9',
  arrowLeft = 'left-10',
  arrowRotate = 'rotate-45',
  arrowTop = 'top-[-0.57rem]',
}: SuitabilityTooltipPropTypes) {
  return (
    <div className={`tooltip group absolute ${zIndex} inline-block`}>
      <InfoIcon className='inline-block mb-1 ml-2 w-3.5 h-3.5 text-blue' />
      <div
        className={`${left} ${top} tooltiptext w-[21rem] absolute p-4 text-black whitespace-pre-wrap text-sm bg-dashboard border border-blue-lighter rounded-md hidden group-hover:block`}
      >
        <div
          className={`${arrowRotate} ${arrowLeft} ${arrowTop} absolute w-4 h-4 font-light bg-dashboard border-l border-t border-blue-lighter rounded-bl-none rounded-md rounded-tr-none transform`}
        />
        <p className='font-normal'>{t('treatment_time.body_1')}</p>
        <div className='py-4 space-y-6'>
          <div className='flex justify-between w-full space-x-4'>
            <span className='mb-auto px-2 py-0.5 text-white text-xxs bg-green-forecast rounded-full'>
              {t('Scheduling.modal.high')}
            </span>
            <span className='w-3/4 font-normal'>
              {t('treatment_time.tooltip.likely')}
            </span>
          </div>
          <div className='flex justify-between w-full space-x-4'>
            <span className='mb-auto px-2 py-0.5 text-white text-xxs bg-SmartPDTorange rounded-full'>
              {t('Scheduling.modal.medium')}
            </span>
            <span className='w-3/4 font-normal'>
              {t('treatment_time.tooltip.possible')}
            </span>
          </div>
          <div className='flex justify-between w-full space-x-4'>
            <span className='mb-auto px-2 py-0.5 text-white text-xxs bg-warning rounded-full'>
              {t('Scheduling.modal.low')}
            </span>
            <span className='w-3/4 font-normal'>
              {t('treatment_time.tooltip.Not_advised')}
            </span>
          </div>
        </div>
        <p className='italic font-light text-black-light'>
          {t('treatment_time.body_2')}
        </p>
      </div>
    </div>
  );
}
