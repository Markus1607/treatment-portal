import { Option } from 'utils/options';
import { colors } from 'utils/constants';
import { TFunction } from 'react-i18next';
import { overview, patients } from 'routes';
import searchIcon from 'assets/images/ic_search.svg';
import { ChangeEventHandler, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ReactSelect, { StylesConfig, SingleValue } from 'react-select';

export type IsMulti = false;
export type LayoutPatientSearchPropType = {
  options: Option[];
  maxMenuHeight?: number;
  t: TFunction<'translation', undefined>;
};

export function LayoutPatientSearch({
  t,
  options,
  maxMenuHeight,
}: LayoutPatientSearchPropType) {
  const history = useHistory();
  const { pathname } = useLocation();
  const [selectedValue, setSelectedValue] = useState('');

  const customStyles: StylesConfig<string | Option, IsMulti> = {
    control: (base, { selectProps }) => ({
      ...base,
      borderTopLeftRadius: '0px',
      borderBottomRightRadius: selectProps.menuIsOpen ? '0px' : undefined,
      borderBottomLeftRadius: '0px',
      borderColor: colors.gray.light,
      width: window.matchMedia('(max-width: 768px)').matches ? '7rem' : '11rem',
      minHeight: '30px',
      boxShadow: 'none',
      overflow: 'hidden',
      '&:hover': {
        cursor: 'pointer',
      },
    }),
    input: (base) => ({
      ...base,
      color: colors.black.light,
      fontWeight: 300,
    }),
    menu: (base, { selectProps }) => ({
      ...base,
      zIndex: 50,
      width: '100%',
      marginTop: '-1px',
      borderTop: 'none',
      borderRadius: '5px',
      border: `1px solid ${colors.gray.light}`,
      boxShadow: 'none',
      borderTopLeftRadius: selectProps.menuIsOpen ? '0px' : undefined,
      borderTopRightRadius: selectProps.menuIsOpen ? '0px' : undefined,
    }),
    option: (base, { isFocused }) => {
      return {
        ...base,
        color: colors.black.light,
        '&:hover': {
          backgroundColor: isFocused ? colors.gray.light : '#fff',
          cursor: 'pointer',
          width: '100%',
        },
        '&:active': {
          backgroundColor: colors.gray.light,
        },
      };
    },
    clearIndicator: (base) => ({ ...base, padding: '5px 8px' }),
    placeholder: (base) => ({ ...base, color: colors.black.lighter }),
    singleValue: (base) => ({
      ...base,
      color: colors.black.light,
    }),
  };

  const handleSelectChange = (selectedOption: SingleValue<string | Option>) => {
    if (typeof selectedOption !== 'string') {
      if (!selectedOption?.value) return;
      const isPatientProfile = pathname.match(/patients\/\w+\/\w+/);
      const subPath = isPatientProfile ? pathname.split('/')[3] : overview;
      history.push(`${patients}/${selectedOption?.value}/${subPath}`);
      setSelectedValue('');
    }
  };

  return (
    <div className='container relative flex-col hidden md:flex'>
      <div className='flex text-sm font-light gap-0'>
        <div className='hidden m-0 pt-2 px-2.5 bg-blue rounded-bl-sm rounded-tl-sm overflow-visible xl:block'>
          <img
            src={searchIcon}
            alt='searchIcon'
            className='transform scale-110'
          />
        </div>
        <ReactSelect
          options={options}
          isClearable={true}
          isSearchable={true}
          value={selectedValue}
          styles={customStyles}
          escapeClearsValue={true}
          maxMenuHeight={maxMenuHeight}
          onChange={handleSelectChange}
          placeholder={t('Summary.text')}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          noOptionsMessage={() => t('Error.no.patient.found')}
        />
      </div>
    </div>
  );
}

export type SearchBarPropType = {
  searchTerm: string;
  placeholder?: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
};

export function PatientSearchBar({
  searchTerm,
  placeholder,
  handleChange,
}: SearchBarPropType) {
  return (
    <div className='flex flex-col w-full'>
      <div className='flex gap-0'>
        <div className='px-4 py-4 m-0 overflow-visible bg-blue rounded-bl-md rounded-tl-md'>
          <img
            src={searchIcon}
            alt='searchIcon'
            className='transform scale-110 2xl:scale-125'
          />
        </div>
        <input
          className='w-full min-h-full p-0 pl-2 m-0 text-xs font-light text-black border outline-none rounded-br-md rounded-tr-md shadow-sm lg:text-sm'
          type='text'
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export type RecordSearchBarPropType = {
  className?: string;
} & SearchBarPropType;

export function RecordSearchBar({
  searchTerm,
  handleChange,
  placeholder,
  className,
}: RecordSearchBarPropType) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className='flex gap-0'>
        <div className='m-0 px-2.5 py-2 bg-blue rounded-bl-sm rounded-tl-sm overflow-visible'>
          <img
            src={searchIcon}
            alt='searchIcon'
            className='transform scale-110'
          />
        </div>
        <input
          className='w-full min-h-full p-0 pl-2 m-0 text-xs font-light border rounded-tr-sm rounded-br-sm outline-none text-black-light shadow-sm lg:text-sm'
          type='text'
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
