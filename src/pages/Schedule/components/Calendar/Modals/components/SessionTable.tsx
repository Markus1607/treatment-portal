import moment from 'moment';
import { isEmpty } from 'lodash';
import { TFunction } from 'react-i18next';
import { FixedSizeList } from 'react-window';
import { CSSProperties, useCallback } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import SuitabilityTooltip from './SuitabilityTooltip';
import type { SelectedTimeDataType } from '../api/format.d';
import { useTable, useFlexLayout, Column } from 'react-table';
import { BookedEventType } from 'pages/Schedule/api/types/format';

type SessionTableProps = {
  itemSize?: number;
  className?: string;
  isDisabled?: boolean;
  selectedDay: string;
  data: SelectedTimeDataType[];
  firstEventStartDate?: string;
  isBookedEvent?: BookedEventType | null;
  selectedTime: SelectedTimeDataType | undefined;
  t: TFunction<'translation', undefined>;
  columns: Column<SelectedTimeDataType>[];
  onRowClick: (row: SelectedTimeDataType) => void;
};

const SessionTable = ({
  t,
  data,
  columns,
  itemSize,
  className,
  isDisabled,
  onRowClick,
  selectedDay,
  selectedTime,
  isBookedEvent,
  firstEventStartDate,
}: SessionTableProps) => {
  const showTimeSlots =
    !isEmpty(data) &&
    (isEmpty(isBookedEvent) ||
      moment(isBookedEvent.start).isSameOrAfter(firstEventStartDate, 'day'));

  const noAvailableSlots =
    isEmpty(data) &&
    moment(selectedDay, 'DD/MM/YYYY').isSameOrAfter(firstEventStartDate, 'day');
  const isBookedDateInPast =
    !isEmpty(isBookedEvent) &&
    moment(isBookedEvent.start).isBefore(moment(), 'day');

  const { rows, prepareRow, headerGroups, getTableProps, getTableBodyProps } =
    useTable(
      {
        columns,
        data,
      },
      useFlexLayout
    );

  const RenderRow = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          onClick={() => onRowClick(row.original)}
          className={`tr list-item ${
            row.original.startTime === selectedTime?.startTime
              ? 'bg-dashboard !border-l-blue-lighter border-l-4 font-medium'
              : 'font-light'
          }`}
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} key={cell.column.id} className='td'>
                {cell.render('Cell')}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows, onRowClick, selectedTime?.startTime]
  );

  return (
    <div className='table mx-auto' {...getTableProps()}>
      <div style={{ width: `calc(100%)` }}>
        {headerGroups.map((headerGroup, index) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            key={`suitability-${index + 4}}`}
            className='tr'
          >
            {headerGroup.headers.map((column, index) => {
              if (column.id === 'suitability') {
                return (
                  <div
                    {...column.getHeaderProps()}
                    key={`suitability-${column.id}-${index}}`}
                    className='inline-block font-medium text-black th'
                  >
                    <span>{column.render('Header')}</span>
                    <SuitabilityTooltip t={t} zIndex='z-[106]' />
                  </div>
                );
              }

              return (
                <div
                  {...column.getHeaderProps()}
                  key={`suitability-${column.id}-${index + 2}}`}
                  className='font-medium text-black whitespace-pre-wrap th'
                >
                  {column.render('Header')}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div
        {...getTableBodyProps()}
        className={`${showTimeSlots ? 'h-[12.5rem]' : 'h-auto'}  
          ${
            isDisabled
              ? 'opacity-70 pointer-events-none'
              : 'opacity-100 pointer-events-auto'
          }
          w-full max-w-full ${className}`}
      >
        {isBookedDateInPast && (
          <p className='my-2 text-sm text-center'>
            {t('No_suitable_slots_for_date')}
          </p>
        )}

        {noAvailableSlots && (
          <p className='my-2 text-sm text-center'>
            {t(
              'Patient_Scheduling_–_time_slots_–no_slots.no_slots_between_time_mod'
            )}
          </p>
        )}

        {showTimeSlots && (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                width={width || 10}
                height={height || 10}
                itemCount={rows.length}
                itemSize={itemSize || 40}
                style={{ overflowX: 'auto' }}
                className={rows.length >= 6 ? 'scrollBar' : ''}
              >
                {RenderRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
};

export default SessionTable;
