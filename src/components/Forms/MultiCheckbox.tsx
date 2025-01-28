import Checkbox from './Checkbox';
import { isEmpty, uniqueId } from 'lodash';
import { useState, useEffect, ChangeEvent } from 'react';
import {
  Controller,
  UseFormReturn,
  UseControllerProps,
  InternalFieldErrors,
  Control,
  FieldValues,
} from 'react-hook-form';

type MultiCheckboxPropType = {
  name: string;
  label: string;
  subText?: string;
  disabled?: boolean;
  rules: UseControllerProps['rules'];
  setValue: UseFormReturn['setValue'];
  control: Control<FieldValues>;
  errors?: InternalFieldErrors;
  options: {
    value: string;
    label: string;
  }[];
};

export default function MultiCheckbox({
  name,
  rules,
  label,
  errors,
  subText,
  control,
  options,
  setValue,
  disabled,
}: MultiCheckboxPropType) {
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.value]: e.target.checked,
    });
  };

  useEffect(() => {
    const keys = Object.keys(checkedItems);
    const values = keys.filter((a) => checkedItems[a]).map((i) => Number(i));
    setValue(name, values);
    setCheckedValues(values);
  }, [checkedItems, name, setValue]);

  return (
    <div className='flex flex-col w-full'>
      {label && <p className='mt-0 text-black'>{label}</p>}
      {subText && (
        <span className='text-sm font-light text-left font-italic text-black-lighter'>
          {subText}
        </span>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ ...rules }}
        render={({ field }) => (
          <div
            {...field}
            role='group'
            aria-label={name}
            className='mt-2 multiCheckOptionContainer space-y-2'
          >
            {options.map((item) => (
              <label
                key={uniqueId('item-')}
                className='fon flex content-center items-center my-0.5 text-black-light hover:cursor-pointer'
              >
                <Checkbox
                  type='checkbox'
                  value={item.value}
                  onChange={(e) => handleChange(e)}
                  checked={disabled ? false : checkedItems[item.value]}
                />
                <span className='checkmark' />
                <span className='text-sm font-light text-black-light'>
                  {' '}
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        )}
      />

      {errors?.[name]?.message && isEmpty(checkedValues) && (
        <p className='errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
}
