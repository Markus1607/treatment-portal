import { useLayoutEffect, useState } from 'react';

type ScoreDisplayProps = {
  text: string;
  score: number;
  outOf: string;
  textColour: string;
  formatScore: number | string;
};

export default function ScoreDisplay({
  text,
  score,
  outOf,
  textColour,
  formatScore,
}: ScoreDisplayProps) {
  const [length, setLength] = useState(0);

  useLayoutEffect(() => {
    const length = (document.getElementById('calc') as any)?.getTotalLength();
    setLength(length);
  }, []);

  return (
    <div className='flex p-4 pb-2 text-sm text-left bg-white containerShadow w-max'>
      <div className='xl:min-w-[5rem] flex flex-col mr-4'>
        <p className='xl:text-[0.82rem] mb-1.5 font-medium'>{text}</p>
        <p className='text-black-light'>
          <span className={'text-lg lg:text-2xl font-bold ' + textColour}>
            {formatScore}
          </span>
          /{outOf}
        </p>
      </div>
      <svg className='w-22 h-[3.2rem]' viewBox='0 0 101 70'>
        <line
          x1='3.6'
          y1='71'
          x2='24'
          y2='62.5'
          strokeWidth={2}
          stroke='black'
          className='stroke-current text-gray-light'
        ></line>
        <line
          x1='97.3'
          y1='69.6'
          x2='77'
          y2='61.8'
          strokeWidth={2}
          stroke='black'
          className='stroke-current text-gray-light'
        ></line>
        <path
          d='M 14 67 A 39.5 39.5 0 1 1 87 66 '
          fill='transparent'
          strokeWidth={22}
          className='stroke-current text-gray-light'
        ></path>

        <path
          d='M 14 67 A 39.5 39.5 0 1 1 87 66 '
          fill='transparent'
          strokeWidth={20}
          className='stroke-current text-gray-lightest'
        ></path>
        <path
          id='calc'
          d='M 14 67 A 39.5 39.5 0 1 1 87 66 '
          fill='transparent'
          strokeWidth={20}
          strokeDasharray={length}
          strokeDashoffset={`${Math.max(
            length - (score / Number.parseFloat(outOf)) * length,
            0
          )}`}
          className={'stroke-current ' + textColour}
        ></path>
        <text
          x='50%'
          y='70%'
          dominantBaseline='central'
          textAnchor='middle'
          className='text-lg fill-current text-gray'
        >
          {formatScore}
        </text>
      </svg>
    </div>
  );
}
