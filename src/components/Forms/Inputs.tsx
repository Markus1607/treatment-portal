import { HTMLInputTypeAttribute } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseControllerProps,
  InternalFieldErrors,
} from 'react-hook-form';

type InputPropType = {
  name: string;
  label: string;
  width?: string;
  disabled?: boolean;
  placeholder: string;
  validations: FieldValues;
  errors?: InternalFieldErrors;
  type?: HTMLInputTypeAttribute | undefined;
};

export function TextInput({
  name,
  label,
  width,
  errors,
  disabled,
  placeholder,
  validations,
}: InputPropType) {
  return (
    <div className={`flex flex-col text-black font-normal space-y-2 ${width}`}>
      <label htmlFor={name}>{label}</label>
      <input
        type='text'
        disabled={disabled ? disabled : false}
        className='px-2 py-1.5 text-black-light border focus-visible:border-blue rounded outline-none ring-1 ring-gray-light'
        placeholder={placeholder}
        {...validations}
      />
      {errors?.[name] && (
        <p className='errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
}

export function CredentialsInput({
  type,
  name,
  label,
  errors,
  placeholder,
  validations,
}: InputPropType) {
  return (
    <div className='flex flex-col font-normal text-black space-y-2'>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        className='px-2 py-1.5 text-black-light border focus-visible:border-blue rounded outline-none ring-1 ring-gray-light'
        placeholder={placeholder}
        {...validations}
      />
      {errors?.[name] && (
        <p className='errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
}

type NumberInputPropType = {
  name: string;
  width?: number;
  placeholder?: string;
  isDisabled?: boolean;
  control: Control<any>;
  errors: InternalFieldErrors;
  label: string | JSX.Element;
  rules: UseControllerProps['rules'];
};

export function NumberInput({
  name,
  rules,
  width,
  label,
  errors,
  control,
  isDisabled,
  placeholder,
}: NumberInputPropType) {
  return (
    <div className='flex flex-col font-normal text-black space-y-2'>
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={{ ...rules }}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            disabled={isDisabled}
            placeholder={placeholder}
            value={String(field.value) || ''}
            style={{ width: `${width}rem` }}
            onChange={(e) => field.onChange(e.target.value.replace(/\D/, ''))}
            className={`px-2 py-1.5 text-black-light border focus-visible:border-blue rounded outline-none ring-1 ring-gray-light ${
              isDisabled ? 'cursor-not-allowed bg-[#f5f5f5]' : 'cursor-default'
            }`}
          />
        )}
      />
      {errors?.[name] && (
        <p className='errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
}
