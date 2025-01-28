import {
  useMemo,
  useEffect,
  Dispatch,
  useCallback,
  CSSProperties,
  SetStateAction,
} from 'react';
import {
  Row,
  Column,
  useTable,
  useSortBy,
  useFlexLayout,
  useGlobalFilter,
} from 'react-table';
import { isEmpty } from 'lodash';
import { TFunction } from 'react-i18next';
import { FixedSizeList } from 'react-window';
import { ClipLoader } from 'components/Loader';
import { fuzzyTextFilterFn } from 'utils/functions';
import AutoSizer from 'react-virtualized-auto-sizer';
import { EditButton, DeleteButton } from 'components/Forms/Buttons';
import { ReactComponent as ErrorFaceIcon } from 'assets/images/no-data-icon.svg';

export type Data = {
  id: string;
  protocolName: string;
  makeDefault: boolean;
  isPredefinedProtocol: boolean;
};

export type ProtocolTableProps = {
  data: Data[];
  filter: string;
  isStateError?: boolean;
  isDataLoading: boolean;
  tableStateText: string;
  columns: Column<Data>[];
  onRowClick: (data: Data) => void;
  t: TFunction<'translation', undefined>;
  setDeleteProtocolModal: Dispatch<SetStateAction<boolean>>;
  setSelectedProtocol: React.Dispatch<
    React.SetStateAction<{
      id: string;
      protocolName: string;
    } | null>
  >;
};

const ProtocolTable = ({
  t,
  data,
  filter,
  columns,
  onRowClick,
  isStateError,
  isDataLoading,
  tableStateText,
  setSelectedProtocol,
  setDeleteProtocolModal,
}: ProtocolTableProps) => {
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
    },
    useFlexLayout,
    useGlobalFilter,
    useSortBy
  );

  const RenderRow = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const row = rows[index];
      const showDeleteBtn = row.original.isPredefinedProtocol === false;

      prepareRow(row);
      return (
        <div
          className='tr list-item-cursor-normal'
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
                      text={t('Admin_staff.View_details')}
                      className='text-blue-300'
                      svgStyles={{ color: 'rgb(147, 197, 253)' }}
                      onClick={() =>
                        row.original.protocolName.includes('Combined')
                          ? null
                          : onRowClick(row.original)
                      }
                    />
                    {showDeleteBtn ? (
                      <DeleteButton
                        text={t('Admin.delete_link')}
                        className='text-red-400'
                        svgStyles={{ color: 'tomato' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteProtocolModal(true);
                          setSelectedProtocol({
                            id: row.original.id,
                            protocolName: row.original.protocolName,
                          });
                        }}
                      />
                    ) : (
                      <span className='w-[4.6rem]' />
                    )}
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
      setSelectedProtocol,
      setDeleteProtocolModal,
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
        {headerGroups.map((headerGroup) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            key={headerGroup.headers[0].id}
            className='tr'
          >
            {headerGroup.headers.map((column) => (
              <div {...column.getHeaderProps()} key={column.id} className='th'>
                {column.render('Header')}
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
          <div className='mt-[25vh] flex justify-center mx-auto w-full'>
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
                className='fixedListScrollBar'
                style={{ overflowY: 'scroll' }}
                height={height ? height - 50 : 10}
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

export default ProtocolTable;
