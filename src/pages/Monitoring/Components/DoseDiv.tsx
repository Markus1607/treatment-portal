import { ReactComponent as InfoIcon } from 'assets/images/ic_info.svg';
import DOMPurify from 'dompurify';

type DoseDivProps = {
  name: string;
  time: string;
  percent: number;
  bgColour: string;
  timeText: string;
  textColour: string;
  tooltipText?: string;
  textColourDark: string;
};

export default function DoseDiv({
  name,
  time,
  percent,
  bgColour,
  timeText,
  textColour,
  tooltipText,
  textColourDark,
}: DoseDivProps) {
  return (
    <div className='flex flex-col justify-between w-full px-6 py-6 border border-gray-light'>
      <div className='flex w-full space-x-2'>
        <p className='pb-4 text-base font-bold text-left bg-white'>{name}</p>
        {tooltipText && (
          <div className='relative inline text-left tooltip group'>
            <InfoIcon className='w-4 h-4 my-1 text-blue-lighter' />
            <div className='tooltiptext w-[17.5rem] absolute z-50 -left-48 top-8 group-hover:block hidden p-4 text-black whitespace-pre-wrap text-sm bg-dashboard border border-blue-lighter rounded-md'>
              <div className='top-[-0.57rem] absolute left-48 w-4 h-4 font-light bg-dashboard border-l border-t border-blue-lighter rounded-bl-none rounded-md rounded-tr-none transform rotate-45' />
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(tooltipText),
                }}
              ></p>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center justify-between w-full'>
        <svg width={120} height={120} className='flex-none mr-10 2xl:mr-16'>
          <g transform='rotate(-90 60 60)'>
            <circle
              r='56.5'
              cx='60'
              cy='60'
              fill='transparent'
              strokeWidth='0.15rem'
              strokeDasharray='4 4'
              strokeDashoffset='0'
              className={`stroke-current ${textColour}`}
            ></circle>
            <circle
              r='56.5'
              cx='60'
              cy='60'
              fill='transparent'
              strokeWidth='0.45rem'
              strokeDasharray='355'
              strokeLinecap='round'
              strokeDashoffset={
                percent < 100
                  ? 355 - (355 * percent) / 100
                  : 355 - (355 * 100) / 100
              }
              className={`stroke-current ${textColour}`}
            ></circle>
            {percent > 100 && (
              <circle
                r='56.5'
                cx='60'
                cy='60'
                fill='transparent'
                stroke='url(#linear2)'
                strokeWidth='0.45rem'
                strokeDasharray='355'
                strokeLinecap='round'
                strokeDashoffset={355 - (355 * (percent - 100)) / 100}
                className={`stroke-current ${textColourDark}`}
              ></circle>
            )}
          </g>
          <text
            x='50%'
            y='50%'
            textAnchor='middle'
            dominantBaseline='central'
            className={` fill-current ${textColour} text-3xl font-bold`}
          >
            {percent + '%'}
          </text>
        </svg>
        <div className='flex w-full text-left'>
          <div
            className={`mr-2 my-1 w-1.5 bg-clip-border rounded-lg ${bgColour}`}
          ></div>
          <div className='flex-col w-full 3xl:w-32'>
            <p className='text-lg font-bold'>{time} </p>
            <p className='mt-1 text-xs font-light text-black-lighter 2xl:text-sm'>
              {timeText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
