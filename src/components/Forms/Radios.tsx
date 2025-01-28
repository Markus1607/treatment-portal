import {
  Control,
  Controller,
  UseControllerProps,
  InternalFieldErrors,
} from 'react-hook-form';
import Checkbox from './Checkbox';
import { btnIcons } from 'utils/icons';
import { uniqueId } from 'lodash';
import { AppProvider } from 'AppProvider';
import { ChangeEventHandler } from 'react';

type Option = {
  label: string;
  id?: number | string;
  isDisabled?: boolean;
  value: string | number | boolean;
};

type RadioPropType = {
  name: string;
  label: string;
  subText?: string;
  disabled?: boolean;
  control: Control<any>;
  noTranslate?: boolean;
  errors: InternalFieldErrors;
  horizontalOptionClass?: string;
  rules?: UseControllerProps['rules'];
  options: Option[];
};

export const Radio = ({
  name,
  label,
  rules,
  errors,
  options,
  control,
  subText,
  disabled,
  noTranslate,
  horizontalOptionClass,
}: RadioPropType) => {
  const t = AppProvider.useContainer().t;
  return (
    <div className='radioButtons'>
      <div className='labelWrapper'>
        <label htmlFor={name} className='checkLabel'>
          {label}
        </label>
        {subText && <span className='subClass'>- {subText}</span>}
      </div>

      <Controller
        name={name}
        control={control}
        rules={{ ...rules }}
        render={({ field }) => (
          <div
            role='radiogroup'
            aria-label={name}
            className={`radioBoxContainer ${horizontalOptionClass}`}
          >
            {options.map((item) => (
              <label key={uniqueId('item-')} className='items'>
                <Checkbox
                  value={String(item.value)}
                  onChange={(e) => field.onChange(e)}
                  checked={disabled ? false : field.value === item.value}
                />
                <p className='font-normal text-black-light'>
                  {noTranslate ? item.label : t(item.label)}
                </p>
              </label>
            ))}
          </div>
        )}
      />

      {errors?.[name] && (
        <p className='errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
};

type ToggleRadioPropType = {
  width: string;
} & RadioPropType;

export const ToggleRadio = ({
  name,
  width,
  label,
  rules,
  errors,
  options,
  control,
  subText,
  disabled,
  horizontalOptionClass,
}: ToggleRadioPropType) => {
  const t = AppProvider.useContainer().t;
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
          const selectedOption = (item: Option) =>
            String(field.value) === String(item.value);

          return (
            <div
              role='radiogroup'
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
                    selectedOption(item)
                      ? 'border-blue-dark bg-gray-lightest'
                      : 'border-gray-light'
                  }
                    ${item.isDisabled ? 'cursor-not-allowed bg-[#f5f5f5]' : ''}
                  
                    `}
                >
                  <input
                    {...field}
                    type='radio'
                    disabled={disabled || item.isDisabled}
                    className={`absolute inline-block opacity-0 ${
                      item.isDisabled
                        ? 'pointer-events-none'
                        : 'pointer-events-auto'
                    }`}
                    value={String(item.value)}
                    onClick={() => {
                      if (selectedOption(item)) {
                        field.onChange('');
                      }
                    }}
                    checked={
                      disabled || item.isDisabled ? false : selectedOption(item)
                    }
                  />
                  <div className='flex items-center justify-between w-full'>
                    <p className='font-light'>{item.label}</p>
                    {selectedOption(item) ? (
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
      {errors?.[name] && (
        <p className='mt-1 errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
};

type ScoreToggleRadioPropType = ToggleRadioPropType & {
  bgColour: string;
  borderColour: string;
  customFirstIcon?: JSX.Element;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const ScoreToggleRadio = ({
  name,
  width,
  label,
  rules,
  errors,
  options,
  control,
  disabled,
  bgColour,
  onChange,
  borderColour,
  customFirstIcon,
  horizontalOptionClass,
}: ScoreToggleRadioPropType) => {
  return (
    <div key={label} className='w-full group'>
      <Controller
        control={control}
        name={name}
        rules={{ ...rules }}
        render={({ field }) => (
          <div
            role='radiogroup'
            aria-label={name}
            className={`flex flex-col space-y-3 mt-3 p-2 ${horizontalOptionClass}`}
          >
            <p className='pb-2 -mr-4 font-medium text-left border-b group-last:mr-0 border-gray-light'>
              {label}
            </p>
            {options.map((item, index) => (
              <label
                key={uniqueId('item-')}
                id={item.label + bgColour}
                className={`relative flex items-center p-2 px-1 border-2 cursor-pointer bg-white rounded-md space-x-2 ${
                  disabled && 'opacity-50'
                } ${width} ${
                  parseInt(field.value) === item.value
                    ? !disabled && `${borderColour} border-b-[3.5px]`
                    : !disabled && 'hover:border-blue-lighter border-gray-light'
                }`}
              >
                <input
                  {...field}
                  type='radio'
                  className='absolute inline-block opacity-0'
                  value={String(item.value)}
                  onChange={(e) => {
                    field.onChange(e);
                    onChange(e);
                  }}
                  checked={
                    disabled ? true : parseInt(field.value) === item.value
                  }
                />
                {customFirstIcon && index === 0 ? (
                  customFirstIcon
                ) : (
                  <>
                    <p className='w-4 text-xl text-black-light'>{item.value}</p>
                    <div className={`${bgColour} h-6 w-0.5 rounded-md`}></div>
                  </>
                )}

                <p className='w-full py-1 font-light text-left'>{item.label}</p>
              </label>
            ))}
          </div>
        )}
      />
      {errors?.[name] && (
        <p className='mt-1 errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
};

type ColorToggleRadioPropType = {
  name: string;
  label: string;
  width: string;
  subText?: string;
  disabled?: boolean;
  control: Control<any>;
  horizontalOptionClass?: string;
  rules: UseControllerProps['rules'];
  errors: Record<string, { message: string }>;
  options: {
    value: string | number;
    label: string;
    color: string;
  }[];
};

export const ColorToggleRadio = ({
  name,
  width,
  label,
  rules,
  errors,
  options,
  control,
  subText,
  disabled,
}: ColorToggleRadioPropType) => {
  return (
    <div className=''>
      <div className=''>
        <label htmlFor={name} className='text-base'>
          {label}
        </label>
        {subText && (
          <span className='font-light text-black-lighter'> {subText}</span>
        )}
      </div>

      <Controller
        name={name}
        control={control}
        rules={{ ...rules }}
        render={({ field }) => (
          <div
            role='radiogroup'
            aria-label={name}
            className='flex flex-wrap gap-3 mt-2'
          >
            {options.map((item) => (
              <label
                key={uniqueId('item-')}
                className={`flex p-2  border-2 rounded-md items-center relative ${width} ${
                  field.value === item.value
                    ? 'border-blue-dark bg-gray-lightest'
                    : 'border-gray-light'
                }`}
              >
                <input
                  {...field}
                  type='radio'
                  className='absolute inline-block opacity-0'
                  value={String(item.value)}
                  onClick={() => {
                    if (field.value === item.value) {
                      field.onChange(null);
                    }
                  }}
                  onChange={(e) => field.onChange(e)}
                  checked={disabled ? false : field.value === item.value}
                />
                <div
                  className='flex-shrink-0 w-4 h-4 mr-3 rounded-full'
                  style={{ backgroundColor: `${item.color}` }}
                ></div>
                <p className='font-light'>{item.label}</p>
              </label>
            ))}
          </div>
        )}
      />

      {errors?.[name] && (
        <p className='mt-1 errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
};

export const ColorRadio = ({
  name,
  rules,
  label,
  errors,
  subText,
  control,
  options,
}: ColorToggleRadioPropType) => {
  return (
    <div className='radioButtons'>
      <div className='labelWrapper'>
        <label htmlFor={name} className='checkLabel'>
          {label}
        </label>
        {subText && <span className='subClass'>{subText}</span>}
      </div>

      <Controller
        name={name}
        control={control}
        rules={{ ...rules }}
        render={({ field }) => (
          <div
            role='radiogroup'
            aria-label={name}
            className='colorCheckButtons'
          >
            {options.map((item) => (
              <label className='items' key={uniqueId('option-')}>
                <Checkbox
                  value={String(item.value)}
                  onChange={(e) => field.onChange(e)}
                  checked={field.value === item.value}
                />
                <div className='checkBorder'>
                  <div
                    className='checkOption'
                    style={{ backgroundColor: `${item.color}` }}
                  />
                </div>
                <p className='radLabel'>{item.label}</p>
              </label>
            ))}
          </div>
        )}
      />

      {errors?.[name] && (
        <p className='mt-1 errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
};
