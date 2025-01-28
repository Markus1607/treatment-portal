import {
  Control,
  Controller,
  RegisterOptions,
  UseFormSetFocus,
  InternalFieldErrors,
} from 'react-hook-form';
import 'utils/imports/date-picker-lang';
import ReactDatePicker from 'react-datepicker';
import { getStorageValue } from 'utils/functions';
import 'react-datepicker/dist/react-datepicker.css';
import DateIcon from 'assets/images/date_icon.svg';

type DatePickerPropType = {
  name: string;
  label: string;
  minDate?: Date;
  maxDate: Date;
  disabled?: boolean;
  className?: string;
  labelStyle?: string;
  placeholder?: string;
  setFocus: UseFormSetFocus<any>;
  errors: InternalFieldErrors;
  format?: 'dd/MM/yyyy' | '\tDD/MM/YY' | '\tDD-MM-YY' | 'yyyy';
  control: Control<any>;
  rules: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
};

export default function DatePicker({
  name,
  rules,
  label,
  format,
  errors,
  minDate,
  maxDate,
  control,
  disabled,
  setFocus,
  className,
  labelStyle,
  placeholder,
}: DatePickerPropType) {
  return (
    <div className={`datePicker ${disabled ? 'hidden' : 'block'}`}>
      {label && <label className={labelStyle}>{label}</label>}
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={({ field }) => {
          return (
            <div className={`dateIconWrapper ${className}`}>
              <div
                onClick={() => setFocus(name)}
                className='cursor-pointer dateIcon'
              >
                <img src={DateIcon} alt='datePicker' />
              </div>
              <ReactDatePicker
                className='input'
                disabled={disabled}
                placeholderText={placeholder}
                onChange={(e) => field.onChange(e)}
                minDate={minDate ? minDate : null}
                maxDate={maxDate ? maxDate : null}
                showYearPicker={format ? true : false}
                locale={getStorageValue('ctryCode', 'GB')}
                dateFormat={format ? format : 'dd/MM/yyyy'}
                ref={(elem: any) => elem && field.ref(elem.input)}
                selected={Date.parse(field.value) as unknown as Date}
              />
            </div>
          );
        }}
      />
      {errors?.[name]?.message && (
        <p className='mt-2 errorMessage'>{errors?.[name]?.message}</p>
      )}
    </div>
  );
}
