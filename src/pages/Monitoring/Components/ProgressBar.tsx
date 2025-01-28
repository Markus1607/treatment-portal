import { isFinite } from 'lodash';

type ProgressBarProps = {
  text?: string | null;
  percentage?: number;
  time?: string | null;
  colour?: string;
};

export default function ProgressBar({
  text,
  time,
  colour,
  percentage,
}: ProgressBarProps) {
  return (
    <div className='flex items-center justify-between w-full p-4 px-2 text-sm font-medium text-black border-b 3xl:text-base border-gray-light'>
      <p className='w-full text-left'>{text}</p>
      <div className='flex'>
        <svg viewBox='0 0 100 5' className='w-48'>
          <line
            x1='5'
            y1='2.5'
            x2='95'
            y2='2.5'
            strokeWidth={4}
            stroke='black'
            strokeLinecap='round'
            className='stroke-current text-gray-light'
          ></line>
          <line
            x1='5'
            y1='2.5'
            x2={String(
              percentage && isFinite(percentage)
                ? 90 * Math.min(percentage, 1) + 5
                : 5
            )}
            y2='2.5'
            strokeWidth={4}
            strokeLinecap='round'
            className={
              'stroke-current ' +
              (percentage && percentage >= 1 ? colour : 'text-black-lighter')
            }
          ></line>
        </svg>
        <p className='w-16 whitespace-nowrap'>{time || '-'}</p>
      </div>
    </div>
  );
}
