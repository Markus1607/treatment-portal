import { TFunction } from 'react-i18next';
import { ReactComponent as InfoIcon } from 'assets/images/ic_info.svg';

type SolarDoseToolTipPropTypes = {
  top?: string;
  left?: string;
  arrowLeft?: string;
  arrowTop?: string;
  t: TFunction<'translation', undefined>;
};

export default function SolarDoseToolTip({
  t,
  top = 'top-8',
  left = '-left-0.5',
  arrowLeft = 'left-[0.5rem]',
  arrowTop = 'top-[-0.57rem]',
}: SolarDoseToolTipPropTypes) {
  return (
    <div className='absolute z-10 inline-block tooltip group'>
      <InfoIcon className='inline-block mb-1 ml-2 w-3.5 h-3.5 text-blue' />
      <div
        className={`${left} ${top} tooltiptext w-[21rem] absolute p-4 text-black whitespace-pre-wrap text-sm bg-dashboard border border-blue-lighter rounded-md hidden group-hover:block`}
      >
        <div
          className={`rotate-45 ${arrowLeft} ${arrowTop} absolute w-4 h-4 font-light bg-dashboard border-l border-t border-blue-lighter rounded-bl-none rounded-md rounded-tr-none transform`}
        />
        <p className='text-sm font-normal text-left'>
          {t('scheduling.sunscreen.dose')}
        </p>
      </div>
    </div>
  );
}
