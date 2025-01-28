import { btnIcons } from 'utils/icons';
import { ReactComponent as BinIcon } from 'assets/images/ic_bin.svg';
import { ReactComponent as EditIcon } from 'assets/images/ic_edit.svg';
import { ReactComponent as LoaderIcon } from 'assets/images/ic_loader.svg';

type BasicButtonPropType = {
  text: string;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function NoIconButton(props: BasicButtonPropType) {
  return (
    <button
      type='button'
      onClick={props.onClick}
      className={`items-center flex gap-2 text-sm justify-center px-4 py-1.5 text-white bg-blue rounded hover:scale-y-105   
       ${props.className}  ${props.disabled && 'cursor-not-allowed'}`}
    >
      <span> {props.text}</span>
    </button>
  );
}

type ImageButtonPropType = BasicButtonPropType & {
  alt: string;
  icon?: string;
};

export function TickButton(props: ImageButtonPropType) {
  return (
    <button
      type='submit'
      onClick={props.onClick}
      className={`items-center flex gap-2 text-sm justify-center px-4 py-2 text-white bg-blue rounded hover:scale-y-105 ${props.className}`}
    >
      <span className='self-center scale-90'>
        <img src={btnIcons.tick} alt={props.alt} />
      </span>
      <span> {props.text}</span>
    </button>
  );
}

export function SaveButton(props: ImageButtonPropType) {
  return (
    <button
      type='submit'
      className={`items-center flex gap-2 text-sm justify-center px-4 py-1.5 text-white bg-blue rounded hover:scale-y-105 ${props.className}`}
    >
      <span className='self-center scale-75'>
        <img src={btnIcons.save} alt={props.alt} />
      </span>
      <span> {props.text}</span>
    </button>
  );
}

type CancelSessionPropType = ImageButtonPropType & {
  variant?: string;
};

export function CancelSession(props: CancelSessionPropType) {
  const isColorBlue = props.variant === 'blue';

  return (
    <button
      type='button'
      onClick={props.onClick}
      className={`
        ${props.className} ${props.disabled && 'cursor-not-allowed'}
        ${isColorBlue ? 'border-blue text-blue' : 'border-warning text-warning'}
        
        items-center flex gap-2 border-2 text-sm justify-center px-4 py-1.5 bg-white rounded hover:scale-y-105 
        `}
    >
      <span className='self-center scale-90'>
        <img
          src={isColorBlue ? btnIcons.cross_blue : btnIcons.cross_red}
          alt={props.alt}
        />
      </span>
      <span> {props.text}</span>
    </button>
  );
}

type RescheduleButtonPropType = ImageButtonPropType & {
  isRequestLoading?: boolean;
};

export function RescheduleButton(props: RescheduleButtonPropType) {
  return (
    <button
      type='button'
      onClick={props.onClick}
      disabled={props.disabled}
      className={`items-center flex gap-2 text-sm justify-center px-4 py-1.5 text-white bg-blue rounded hover:scale-y-105  ${
        props.disabled && 'cursor-not-allowed bg-gray-400/60'
      } ${props.className}`}
    >
      {props.isRequestLoading ? (
        <LoaderIcon className='w-24 animate-spin' />
      ) : (
        <>
          <span className='self-center scale-90'>
            <img alt={props.alt} src={props.icon || btnIcons.schedule} />
          </span>
          <span> {props.text}</span>
        </>
      )}
    </button>
  );
}

export function ScheduleButton(props: ImageButtonPropType) {
  return (
    <button
      type='submit'
      onClick={props.onClick}
      disabled={props.disabled}
      className={`items-center flex gap-2 text-sm justify-center px-4 py-1.5 text-white bg-blue rounded hover:scale-y-105 ${
        props.disabled && 'cursor-not-allowed bg-gray-400/60'
      } ${props.className}`}
    >
      <span className='self-center scale-75'>
        <img src={btnIcons.schedule} alt={props.alt} />
      </span>
      <span> {props.text}</span>
    </button>
  );
}

export function DiscardButton(props: ImageButtonPropType) {
  return (
    <button
      type='button'
      onClick={props.onClick}
      className={`items-center flex gap-2 border-2 border-blue text-sm justify-center px-4 py-1.5 text-blue bg-white rounded hover:scale-y-105 ${props.className}`}
    >
      <span className='self-center scale-75'>
        <img src={btnIcons.back} alt={props.alt} />
      </span>
      <span> {props.text}</span>
    </button>
  );
}

type EditButtonType = {
  text?: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  iconClassName?: string;
  svgStyles?: React.CSSProperties;
};

export function EditButton(props: EditButtonType) {
  return (
    <button
      type='button'
      onClick={props.onClick}
      className={`flex gap-1 items-center justify-center px-2 py-1.5 text-black-light hover:text-blue text-xs bg-transparent cursor-pointer ${props.className}`}
    >
      <span className={`self-center scale-90 ${props.iconClassName}`}>
        <EditIcon style={{ ...props.svgStyles }} />
      </span>
      {props.text && <span className='flex-shrink-0'> {props.text}</span>}
    </button>
  );
}

type NoEditButtonType = {
  alt: string;
  width: string;
  height: string;
} & EditButtonType;

export function NoEditButton(props: NoEditButtonType) {
  return (
    <button
      type='button'
      onClick={props.onClick}
      className={`flex gap-1 items-center justify-center px-2 py-1.5 text-black-light hover:text-blue text-xs bg-transparent cursor-pointer ${props.className}`}
    >
      <span className={`self-center ${props.iconClassName} `}>
        <img
          alt={props.alt}
          width={props.width}
          height={props.height}
          src={btnIcons.noEdit}
        />
      </span>
      {props.text && <span className='flex-shrink-0'> {props.text}</span>}
    </button>
  );
}

type DeleteButtonType = BasicButtonPropType & {
  svgStyles?: React.CSSProperties;
};

export function DeleteButton(props: DeleteButtonType) {
  return (
    <button
      type='button'
      onClick={props.onClick}
      disabled={props.disabled}
      className={`flex gap-1 items-center justify-center px-2 py-1.5 text-black-light text-xs bg-transparent hover:fill-current  ${
        props.disabled
          ? 'cursor-not-allowed hover:text-black-light'
          : 'hover:text-warning'
      } ${props.className}`}
    >
      <span
        className={`btn-icon-bin self-center scale-90 ${
          props.disabled ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        <BinIcon style={{ ...props.svgStyles }} />
      </span>
      <span
        className={
          props.disabled ? 'pointer-events-none' : 'pointer-events-auto'
        }
      >
        {props.text}
      </span>
    </button>
  );
}
