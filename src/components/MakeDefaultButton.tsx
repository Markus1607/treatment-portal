import { MouseEvent } from 'react';

type MakeDefaultButtonProps = {
  isDefault: boolean;
  style?: React.CSSProperties;
  onClick: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
};

export default function MakeDefaultButton({
  style,
  onClick,
  isDefault,
}: MakeDefaultButtonProps) {
  return (
    <button
      style={style}
      onClick={(e) => onClick(e)}
      className='flex items-center justify-center p-2.5 w-3.5 h-3.5 bg-white border-2 border-blue-200 rounded-full shadow-sm cursor-pointer'
    >
      {isDefault ? <div className='p-1.5 bg-blue-dark rounded-full' /> : null}
    </button>
  );
}
