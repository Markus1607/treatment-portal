import { useCallback, CSSProperties } from 'react';
import {
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
import AutoSizer from 'react-virtualized-auto-sizer';
import { ReactComponent as ErrorFaceIcon } from 'assets/images/no-data-icon.svg';

export type Data = {
  uid: string;
  diseaseName: string;
};

export type DiseasesTypeTableProps = {
  data: Data[];
  isStateError?: boolean;
  isDataLoading: boolean;
  tableStateText: string;
  columns: Column<Data>[];
  onRowClick: (data: Data) => void;
  t: TFunction<'translation', undefined>;
};

const DiseaseTable = ({
  t,
  data,
  columns,
  onRowClick,
  isStateError,
  isDataLoading,
  tableStateText,
}: DiseasesTypeTableProps) => {
  const { rows, headerGroups, prepareRow, getTableProps, getTableBodyProps } =
    useTable<Data>(
      {
        columns,
        data,
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
          className='tr list-item-cursor-normal'
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map((cell, index) => {
            const lastItem = row.cells.length - 1;
            return index === lastItem ? (
              <div
                className='td'
                {...cell.getCellProps()}
                onClick={() => onRowClick(row.original)}
              >
                <div className='flex items-center gap-10 text-left items-left'>
                  <div className='max-w-[50%] min-w-[20rem]'>
                    {cell.render('Cell')}
                  </div>
                  <div className='flex gap-2 font-light text-left items-left text-blue-lighter'>
                    <button
                      type='button'
                      onClick={() => onRowClick(row.original)}
                      className='flex gap-1 items-center underline justify-center px-2 py-1.5  hover:text-blue text-xs 4xl:text-sm bg-transparent cursor-pointer'
                    >
                      {t('view_protocols')}
                    </button>
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
    [t, rows, prepareRow, onRowClick]
  );

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

export default DiseaseTable;
