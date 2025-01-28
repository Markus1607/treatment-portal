import SessionTable from './SessionTable';
import { Column } from 'react-table';
import { TFunction } from 'react-i18next';
import { getWidth } from 'utils/functions';
import HideIcon from 'assets/images/ic_hide.svg';
import ShowIcon from 'assets/images/ic_show.svg';
import { getTimeSuitabilityBgColor } from 'utils/functions';
import { BookedEventType } from 'pages/Schedule/api/types/format';
import { SelectedTimeDataType, customTimeDataType } from '../api/format.d';
import { useMemo, useState, useEffect, Dispatch, SetStateAction } from 'react';

type SelectSessionTimeProps = {
  isDisabled: boolean;
  selectedDay: string;
  firstEventStartDate?: string;
  selectedTime: SelectedTimeDataType;
  sessionTimes: SelectedTimeDataType[];
  isBookedEvent: BookedEventType | null;
  t: TFunction<'translation', undefined>;
  setDisableHourlyTimes: Dispatch<SetStateAction<boolean>>;
  setSelectedTime: Dispatch<SetStateAction<SelectedTimeDataType>>;
  setCustomTimeData: Dispatch<SetStateAction<customTimeDataType>>;
};

const SelectSessionTime = ({
  t,
  isDisabled,
  selectedDay,
  sessionTimes,
  selectedTime,
  isBookedEvent,
  setSelectedTime,
  setCustomTimeData,
  firstEventStartDate,
  setDisableHourlyTimes,
}: SelectSessionTimeProps) => {
  const browserWidth = getWidth();
  const [hideLowSlots, setHideLowSlots] = useState(true);
  const filterData = sessionTimes.filter(
    (row) => row && row.suitability === t('Scheduling.modal.high')
  );

  const isSelectedTimeSuitabilityLow = useMemo(() => {
    return (
      isBookedEvent && selectedTime?.suitability === t('Scheduling.modal.low')
    );
  }, [t, selectedTime?.suitability, isBookedEvent]);

  useEffect(() => {
    if (isSelectedTimeSuitabilityLow || filterData.length === 0) {
      setHideLowSlots(false);
    }
  }, [isSelectedTimeSuitabilityLow]); //eslint-disable-line

  const onRowClick = (data: SelectedTimeDataType) => setSelectedTime(data);

  const columns: Column<SelectedTimeDataType>[] = useMemo(
    () => [
      {
        Header: t('Scheduled_session_modal.table_heading1'),
        accessor: 'startTime',
        width: browserWidth <= 1440 ? 80 : 120,
      },
      {
        Header: t('Scheduled_session_modal.table_heading2'),
        accessor: 'estEndTime',
        width: browserWidth <= 1440 ? 100 : 140,
      },
      {
        Header: t('Scheduled_session_modal.table_heading3'),
        accessor: 'suitability',
        width: browserWidth <= 1440 ? 120 : 150,
        Cell: ({ value }) => {
          return (
            <span
              className={`text-white text-xxs py-0.5 xl:py-1 px-2 rounded-md ${getTimeSuitabilityBgColor(
                value
              )}`}
            >
              {value}
            </span>
          );
        },
      },
    ],
    [t, browserWidth]
  );

  return (
    <div
      onClick={() => {
        setCustomTimeData({
          sessionGraph: [],
          sessionDetails: [],
          sessionTimeData: [],
        });
        setDisableHourlyTimes(false);
      }}
      className={`containerShadow p-5 pb-2 text-left text-black-light text-xs xl:text-sm font-light bg-white w-full ${
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-sm font-semibold text-black xl:text-base'>
          {t('Scheduled_session_modal.Select_session_time')}
        </h1>
        <button
          onClick={() => setHideLowSlots(!hideLowSlots)}
          className='xl:text-cxs flex items-center text-blue-lighter underline text-xxs font-light space-x-2'
        >
          <img alt='show-hide-icon' src={hideLowSlots ? ShowIcon : HideIcon} />
          <p>
            {hideLowSlots
              ? t('Scheduled_session_modal.Show_unsuitable_slots')
              : t('Scheduled_session_modal.Hide_unsuitable_slots')}
          </p>
        </button>
      </div>
      <div className='w-full h-auto max-w-full sessionTable'>
        <SessionTable
          t={t}
          columns={columns}
          isDisabled={isDisabled}
          onRowClick={onRowClick}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
          isBookedEvent={isBookedEvent}
          firstEventStartDate={firstEventStartDate}
          data={hideLowSlots ? filterData : sessionTimes}
        />
      </div>
    </div>
  );
};

export default SelectSessionTime;
