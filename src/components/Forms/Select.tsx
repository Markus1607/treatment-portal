import {
  Control,
  Controller,
  UseControllerProps,
  // InternalFieldErrors,
} from 'react-hook-form';
import { Option } from 'utils/options';
import { colors } from 'utils/constants';
import ReactSelect, { StylesConfig, SingleValue } from 'react-select';
import { TFunction } from 'react-i18next';

export type IsMulti = false;
export type SelectPropType = {
  name: string;
  label?: string;
  width?: string;
  options: Option[];
  placeholder: string;
  isDisabled?: boolean;
  control: Control<any>;
  maxMenuHeight?: number;
  containerClass?: string;
  isSunscreenSelect?: boolean;
  errors: any;
  onSelectFunc?: (value: any) => void;
  t?: TFunction<'translation', undefined>;
  rules: UseControllerProps['rules'];
};

export default function Select({
  name,
  label,
  rules,
  width,
  errors,
  control,
  options,
  isDisabled,
  placeholder,
  onSelectFunc,
  maxMenuHeight,
  containerClass,
  isSunscreenSelect,
}: SelectPropType) {
  const customStyles: StylesConfig<string | Option, IsMulti> = {
    control: (base, { isFocused, selectProps }) => ({
      ...base,
      borderBottomRightRadius: selectProps.menuIsOpen ? '0px' : undefined,
      borderBottomLeftRadius: selectProps.menuIsOpen ? '0px' : undefined,
      borderColor: colors.gray.light,
      width: width || '100%',
      boxShadow:
        isFocused && !selectProps.menuIsOpen
          ? `0px 0px 1px 1px ${colors.blue.dark}`
          : `0px 0px 1px 1px ${colors.gray.light}`,
      overflow: 'hidden',
      '&:hover': {
        cursor: 'pointer',
        borderColor: isFocused ? colors.gray.DEFAULT : colors.gray.light,
      },
    }),
    menu: (base, { selectProps }) => ({
      ...base,
      border: `1px solid ${colors.gray.light}`,
      borderTop: 'none',
      borderRadius: '5px',
      marginTop: '0px',
      width: width || '100%',
      zIndex: 4,
      boxShadow: `0px 0px 1px 1px ${colors.gray.light}`,
      borderTopLeftRadius: selectProps.menuIsOpen ? '0px' : undefined,
      borderTopRightRadius: selectProps.menuIsOpen ? '0px' : undefined,
    }),
    option: (base, { isFocused }) => {
      return {
        ...base,
        color: colors.black.light,
        backgroundColor: isFocused ? colors.gray.light : '#fff',
        '&:hover': {
          backgroundColor: colors.gray.light,
          cursor: 'pointer',
          width: '100%',
        },
        '&:active': {
          backgroundColor: '#fff',
        },
      };
    },
    placeholder: (base) => ({ ...base, color: colors.black.lighter }),
    singleValue: (base) => ({ ...base, color: colors.black.light }),
    dropdownIndicator: (base, { selectProps }) => {
      return {
        ...base,
        transform: selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
      };
    },
  };

  return (
    <div
      className={`flex flex-col text-left font-normal space-y-2 
      ${
        isDisabled ? 'cursor-not-allowed' : 'cursor-default'
      } ${containerClass} `}
    >
      {label && (
        <label className='text-black text-cxs 4xl:text-sm'>{label}</label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ ...rules }}
        render={({ field: { onChange, value, ref } }) => {
          const currentSelection = options.find((c) =>
            isSunscreenSelect
              ? c?.id === value
              : String(c.value) === String(value)
          );
          const handleSelectChange = (
            selectedOption: SingleValue<string | Option>
          ) => {
            if (typeof selectedOption !== 'string') {
              onChange(
                isSunscreenSelect ? selectedOption?.id : selectedOption?.value
              );
              onSelectFunc && selectedOption && onSelectFunc(selectedOption);
            }
          };
          return (
            <ReactSelect
              ref={ref}
              options={options}
              isSearchable={false}
              styles={customStyles}
              isDisabled={isDisabled}
              placeholder={placeholder}
              onChange={handleSelectChange}
              maxMenuHeight={maxMenuHeight}
              value={currentSelection || ''}
              components={{
                IndicatorSeparator: () => null,
              }}
            />
          );
        }}
      />
      {errors?.[name]?.message && (
        <p className='errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
}
