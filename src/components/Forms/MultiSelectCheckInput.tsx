import { AppProvider } from 'AppProvider';
import { isEmpty, uniqueId } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Control,
  Controller,
  UseFormReturn,
  UseControllerProps,
  InternalFieldErrors,
} from 'react-hook-form';
import { btnIcons } from 'utils/icons';

type Option = {
  value: string | number;
  label: string;
};

type MultiSelectCheckInputType = {
  width: string;
  name: string;
  label: string;
  subText?: string;
  disabled?: boolean;
  control: Control<any>;
  options: Option[];
  initialValues: number[];
  noTranslate?: boolean;
  errors: InternalFieldErrors;
  horizontalOptionClass?: string;
  rules: UseControllerProps['rules'];
  setValue: UseFormReturn['setValue'];
};

export const MultiSelectCheckInput = ({
  name,
  width,
  label,
  rules,
  errors,
  options,
  control,
  subText,
  setValue,
  disabled,
  initialValues,
  horizontalOptionClass,
}: MultiSelectCheckInputType) => {
  const t = AppProvider.useContainer().t;

  const [checkedValues, setCheckedValues] = useState<number[]>(initialValues);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () => {
      const result: Record<string, boolean> = {};
      initialValues.forEach((i) => {
        result[i] = true;
      });
      return result;
    }
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.value]: e.target.checked,
    });
  };

  useEffect(() => {
    const keys = Object.keys(checkedItems);
    const values = keys.filter((a) => checkedItems[a]).map((i) => Number(i));
    isEmpty(values) ? setValue(name, '') : setValue(name, values);
    setCheckedValues(values);
  }, [checkedItems, name, setValue]);

  return (
    <div>
      <div className='labelWrapper'>
        <label htmlFor={name} className='checkLabel'>
          {label}
        </label>
        {subText && (
          <span className='text-[0.82rem] text-gray-400 font-light'>
            {' '}
            - {subText}
          </span>
        )}
      </div>

      <Controller
        name={name}
        control={control}
        rules={{ ...rules }}
        render={({ field }) => {
          return (
            <div
              role='group'
              aria-label={name}
              className={
                horizontalOptionClass
                  ? horizontalOptionClass
                  : `flex space-x-3 mt-3`
              }
            >
              {options.map((item) => (
                <label
                  key={uniqueId('item-')}
                  className={`flex p-2 border-2 rounded-md justify-between relative ${width} ${
                    checkedItems[item.value]
                      ? 'border-blue-dark bg-gray-lightest'
                      : 'border-gray-light'
                  }`}
                >
                  <input
                    {...field}
                    type='checkbox'
                    className='absolute inline-block opacity-0'
                    value={item.value}
                    onClick={() => {
                      if (checkedItems[item.value]) {
                        field.onChange('');
                      }
                    }}
                    onChange={(e) => handleChange(e)}
                    checked={disabled ? false : checkedItems[item.value]}
                  />
                  <div className='flex items-center justify-between w-full'>
                    <p className='font-light'>{item.label}</p>
                    {checkedItems[item.value] ? (
                      <img
                        src={btnIcons.tick_blue}
                        alt={t('Tick_Icon_Blue_alt')}
                      />
                    ) : null}
                  </div>
                </label>
              ))}
            </div>
          );
        }}
      />
      {errors?.[name]?.message && isEmpty(checkedValues) && (
        <p className='mt-2 errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
};
