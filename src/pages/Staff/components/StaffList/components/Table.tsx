import {
  useMemo,
  Dispatch,
  useEffect,
  useCallback,
  CSSProperties,
  SetStateAction,
} from 'react';
import { isEmpty } from 'lodash';
import {
  Row,
  useTable,
  useSortBy,
  useFlexLayout,
  useGlobalFilter,
  Column,
} from 'react-table';
import { FixedSizeList } from 'react-window';
import { ClipLoader } from 'components/Loader';
import { fuzzyTextFilterFn } from 'utils/functions';
import AutoSizer from 'react-virtualized-auto-sizer';
import { EditButton, DeleteButton } from 'components/Forms/Buttons';
import { ReactComponent as ErrorFaceIcon } from 'assets/images/no-data-icon.svg';
import { TFunction } from 'react-i18next';
import { UserType } from '~/@types';

export type Data = {
  uid: string;
  forename: string;
  surname: string;
  email: string;
};

export type TableProps = {
  t: TFunction;
  data: Data[];
  filter: string;
  isStateError: boolean;
  isDataLoading: boolean;
  tableStateText: string;
  columns: Column<Data>[];
  cookies: { user: UserType };
  onRowClick: (data: Data) => void;
  setSelectedStaff: Dispatch<SetStateAction<Data>>;
  setDeleteStaffModal: Dispatch<SetStateAction<boolean>>;
};

const Table = ({
  t,
  data,
  filter,
  columns,
  cookies,
  onRowClick,
  isStateError,
  isDataLoading,
  tableStateText,
  setSelectedStaff,
  setDeleteStaffModal,
}: TableProps) => {
  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: Row<Data>[], _id: string[], filterValue: string) => {
        return rows.filter((row) => {
          const rowValue = row.values.id[0];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(filterValue.toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    rows,
    headerGroups,
    prepareRow,
    getTableProps,
    getTableBodyProps,
    setGlobalFilter,
  } = useTable<Data>(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        sortBy: [
          {
            id: 'surname',
            desc: false,
          },
        ],
      },
    },
    useFlexLayout,
    useGlobalFilter,
    useSortBy
  );

  const RenderRow = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          className='tr list-item'
          onClick={() => onRowClick(row.original)}
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map((cell, index) => {
            const lastItem = row.cells.length - 1;
            return index === lastItem ? (
              <div {...cell.getCellProps()} className='td'>
                <div className='flex items-center justify-between gap-10'>
                  <div className='max-w-[50%]'>{cell.render('Cell')}</div>
                  <div className='max-w-[50%] flex gap-2 2xl:gap-20 items-center justify-between mr-2 2xl:mr-8 text-blue-lighter font-light xl:gap-10 xl:max-w-full'>
                    <EditButton
                      onClick={() => onRowClick}
                      text={t('Admin_staff.View_details')}
                    />
                    <DeleteButton
                      text={t('Admin.delete_link')}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteStaffModal(true);
                        setSelectedStaff(row.original);
                      }}
                      disabled={row.original.uid === cookies.user.id}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div {...cell.getCellProps()} className='td'>
                {cell.render('Cell')}
              </div>
            );
          })}
        </div>
      );
    },
    [
      t,
      rows,
      prepareRow,
      onRowClick,
      setSelectedStaff,
      cookies?.user?.id,
      setDeleteStaffModal,
    ]
  );

  useEffect(() => {
    setGlobalFilter(filter); // Set the Global Filter to the filter prop.
  }, [filter, setGlobalFilter]);

  return (
    <div
      className='2xl:text-[0.95rem] listTable table pl-4 text-sm xl:mx-auto'
      {...getTableProps()}
    >
      <div style={{ width: `calc(100% - 12px)` }}>
        {headerGroups.map((headerGroup, index) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            key={index}
            className='tr'
          >
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={column.id}
                className='th'
              >
                {column.render('Header')}
                <span className='text-black'>
                  {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        {...getTableBodyProps()}
        className='w-full max-w-full max-h-full min-h-full fire-height'
      >
        {isDataLoading && (
          <div className='mt-[30vh] flex justify-center mx-auto w-full'>
            <ClipLoader color='#1e477f' size={1.5} />
          </div>
        )}

        {!isDataLoading && !isEmpty(data) && (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                itemSize={45}
                itemCount={rows.length}
                width={width ? width : 10}
                height={height ? height - 50 : 10}
                className='fixedListScrollBar'
                style={{ overflowY: 'scroll' }}
              >
                {RenderRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        )}

        {!isDataLoading && isEmpty(data) && (
          <div
            className={`flex flex-col gap-4 items-center mx-auto w-full h-full text-center !mt-[20vh] ${
              isStateError ? 'text-warning' : 'text-black'
            }`}
          >
            {isStateError && (
              <ErrorFaceIcon width={100} style={{ fill: 'tomato' }} />
            )}
            <h3 className='mt-2 text-base'>{tableStateText}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
