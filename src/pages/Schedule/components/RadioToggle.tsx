import { uniqueId } from 'lodash';
import { Dispatch, SetStateAction } from 'react';
import Checkbox from 'components/Forms/Checkbox';
import { AppProvider } from '~/AppProvider';

type Option = {
  label: string;
  icon?: string;
  value: number | string;
  isDisabled?: boolean;
  iconStyles?: string;
};

type ToggleRadioPropType = {
  name: string;
  label: string;
  options: Option[];
  selectedOptionType: any;
  setSelectedOptionType: Dispatch<SetStateAction<any>>;
  allOptionsDisabled?: boolean;
};

export const RadioToggle = ({
  name,
  label,
  options,
  allOptionsDisabled,
  selectedOptionType,
  setSelectedOptionType,
}: ToggleRadioPropType) => {
  const t = AppProvider.useContainer().t;
  return (
    <div>
      <label htmlFor={name} className='checkLabel'>
        {label}
      </label>

      <div
        aria-label={name}
        role='radiogroup'
        className='whitespace-pre-wrap pdtTypeRadioContainer'
      >
        {options.map((item) => {
          const isChecked = item.value === selectedOptionType;

          return (
            <label
              key={uniqueId('item-')}
              className={`items relative group ${
                isChecked
                  ? 'border-2 border-blue bg-gray-lightest'
                  : item.isDisabled || allOptionsDisabled
                  ? '!bg-gray-200 border-2 pointer-events-auto !cursor-not-allowed'
                  : 'bg-white border-2 border-border-gray-400'
              } `}
            >
              <Checkbox
                value={item.value}
                disabled={item.isDisabled || allOptionsDisabled}
                onChange={() => setSelectedOptionType(item.value)}
                checked={item.isDisabled ? false : isChecked}
              />

              {item.isDisabled && (
                <span className='absolute hidden mx-auto mt-4 text-center text-gray-100 -translate-x-1/2 translate-y-full bg-gray-800 rounded-md transition-display xl:text-xs text-xxs group-hover:block left-1/2'>
                  {t('coming_soon')}
                </span>
              )}

              <div className='flex items-center justify-between'>
                <img
                  alt='items'
                  src={item.icon}
                  className={`w-6 max-h-6 mx-auto rounded-full scale-[1.9] aspect-auto ${item.iconStyles}`}
                />
              </div>
              <h3 className='font-light text-center text-black 4xl:text-sm text-cxs'>
                {item.label}
              </h3>
            </label>
          );
        })}
      </div>
    </div>
  );
};
