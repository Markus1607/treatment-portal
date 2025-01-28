import { sortIcons } from 'utils/icons';

type SortArrowProps = {
  text: string;
  handleClick: () => void;
};

export default function SortArrow({ text, handleClick }: SortArrowProps) {
  return (
    <div
      onClick={() => handleClick()}
      className='flex gap-0.5 items-center p-2 px-3 font-normal hover:bg-dashboard rounded cursor-pointer'
    >
      <span className='scale-[.6] text-gray'>
        <img src={sortIcons.up} alt='sort-up-icon' />
        <img
          className='mt-1 transform rotate-180'
          src={sortIcons.down}
          alt='sort-down-icon'
        />
      </span>
      <p>{text}</p>
    </div>
  );
}
