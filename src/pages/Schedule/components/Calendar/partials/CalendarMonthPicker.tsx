import moment from 'moment';
import 'utils/imports/date-picker-lang';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getStorageValue } from 'utils/functions';
import { useState, forwardRef, ForwardedRef } from 'react';

type CalendarMonthPickerProps = {
  date: Date;
  setDefaultDate: (date: Date) => void;
};

export default function CalendarMonthPicker({
  date,
  setDefaultDate,
}: CalendarMonthPickerProps) {
  const [startDate, setStartDate] = useState(date);

  const MonthLabel = forwardRef(function MonthLabelComponent(
    { value, onClick }: { value?: Date; onClick?: () => void },
    ref: ForwardedRef<HTMLSpanElement>
  ) {
    return (
      <span ref={ref} onClick={onClick} className='cursor-pointer 3xl:text-xl'>
        {moment(value, 'MM/YYYY').format('MMMM YYYY')}
      </span>
    );
  });

  const handleChange = (newDate: Date) => {
    setStartDate(newDate);
    setDefaultDate(newDate);
  };

  return (
    <ReactDatePicker
      className='z-50'
      selected={startDate}
      dateFormat='MM/yyyy'
      showMonthYearPicker
      customInput={<MonthLabel />}
      locale={getStorageValue('ctryCode', 'GB')}
      onChange={(newDate) => newDate && handleChange(newDate)}
    />
  );
}
