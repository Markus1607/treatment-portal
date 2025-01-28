import { Option } from 'utils/options';
import { colors } from 'utils/constants';
import { Controller } from 'react-hook-form';
import { IsMulti, SelectPropType } from './Select';
import ReactSelect, { StylesConfig, SingleValue } from 'react-select';

export default function SearchSelect({
  t,
  name,
  label,
  rules,
  width,
  errors,
  control,
  options,
  placeholder,
  maxMenuHeight,
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
    clearIndicator: (base) => ({ ...base, padding: '5px 8px' }),
    placeholder: (base) => ({ ...base, color: colors.black.lighter }),
    singleValue: (base) => ({ ...base, color: colors.black.light }),
  };

  return (
    <div className='flex flex-col font-normal text-left space-y-2'>
      <label className='text-black'>{label}</label>
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={({ field: { onChange, value, ref } }) => {
          const currentSelection = options.find((c) => c.value === value);
          const handleSelectChange = (
            selectedOption: SingleValue<string | Option>
          ) => {
            if (typeof selectedOption !== 'string') {
              onChange(selectedOption?.value);
            }
          };
          return (
            <ReactSelect
              ref={ref}
              options={options}
              isClearable={true}
              isSearchable={true}
              styles={customStyles}
              escapeClearsValue={true}
              placeholder={placeholder}
              maxMenuHeight={maxMenuHeight}
              onChange={handleSelectChange}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              value={currentSelection || ''}
              noOptionsMessage={() => t && t('Error.no.patient.found')}
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
