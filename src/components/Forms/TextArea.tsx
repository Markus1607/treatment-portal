import { FieldValues, InternalFieldErrors } from 'react-hook-form';

type TextAreaPropType = {
  name: string;
  label: string;
  width?: string;
  height?: string;
  subText?: string;
  disabled?: boolean;
  labelStyle?: string;
  placeholder: string;
  register: FieldValues;
  containerStyles?: string;
  errors?: InternalFieldErrors;
};

export default function TextArea({
  name,
  label,
  width,
  height,
  errors,
  subText,
  disabled,
  register,
  labelStyle,
  placeholder,
  containerStyles,
}: TextAreaPropType) {
  return (
    <div className={`text-left space-y-2 ${containerStyles}`}>
      <div className='flex items-center justify-start font-normal'>
        {label && (
          <label
            className={`block text-black text-sm flex-shrink-0 ${labelStyle}`}
          >
            {label}
          </label>
        )}
        {subText && (
          <span className='block w-full p-0 pl-2 m-0 text-xs font-light text-black-lighter'>
            - {subText}
          </span>
        )}
      </div>
      <textarea
        rows={8}
        cols={30}
        disabled={disabled}
        placeholder={placeholder}
        style={{ height: height || '5em', width: width || '100%' }}
        className='w-full p-2 overflow-auto font-light border-2 rounded outline-none resize-none text-black-light border-gray-light'
        {...register}
      />
      {errors?.[name]?.message && (
        <p className='errorMessage !mt-0'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
}
