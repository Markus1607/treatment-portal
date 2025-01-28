import {
  Control,
  Controller,
  UseControllerProps,
  InternalFieldErrors,
} from 'react-hook-form';
import Checkbox from './Checkbox';
import { uniqueId } from 'lodash';
import { btnIcons } from 'utils/icons';

type SessionTypeRadioPropType = {
  name: string;
  label: string;
  disabled?: boolean;
  control: Control<any>;
  isSunscreenQues?: boolean;
  errors: InternalFieldErrors;
  rules: UseControllerProps['rules'];
  options: {
    value: string | number;
    label: string;
    description: string;
    icon: string;
  }[];
};

export default function SessionTypeRadio({
  name,
  label,
  rules,
  errors,
  options,
  control,
  disabled,
  isSunscreenQues,
}: SessionTypeRadioPropType) {
  return (
    <div className='flex flex-col space-y-3 text-sm text-gray'>
      <label htmlFor={name} className='block text-left text-black'>
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        rules={{ ...rules }}
        render={({ field }) => (
          <div
            role='radiogroup'
            aria-label={name}
            className='sessionTypeRadioContainer'
          >
            {options.map((item) => {
              const isChecked =
                field.value !== null
                  ? String(field.value) === String(item.value)
                  : false;

              return (
                <label
                  key={uniqueId('item-')}
                  className={`items ${
                    isChecked
                      ? 'border-2 border-blue bg-gray-lightest'
                      : 'bg-white border-2 border-border-gray-400'
                  } `}
                >
                  <Checkbox
                    {...field}
                    value={item.value}
                    onChange={(e) => field.onChange(e)}
                    checked={disabled ? false : isChecked}
                  />
                  <div className='flex items-center justify-between'>
                    <img
                      src={item.icon}
                      alt={item.label + ' icon'}
                      className={isSunscreenQues ? 'w-4' : 'w-7'}
                    />
                    {isChecked && (
                      <img src={btnIcons.tick_blue} alt='blue tick icon' />
                    )}
                  </div>
                  <h3 className='font-normal text-black'>{item.label}</h3>
                  <p className='text-[0.8rem] text-black-light whitespace-pre-wrap font-light leading-4'>
                    {item.description}
                  </p>
                </label>
              );
            })}
          </div>
        )}
      />

      {errors?.[name] && (
        <p className='font-normal errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
}
