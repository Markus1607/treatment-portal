import { CSSProperties, useCallback } from 'react';
import { useTable, useFlexLayout, useGlobalFilter, Column } from 'react-table';
import { FixedSizeList } from 'react-window';
// import { fuzzyTextFilterFn } from 'utils/functions';
import AutoSizer from 'react-virtualized-auto-sizer';

type InstDataType = {
  name: string;
  postCode: string;
}[];

type RecordsTablePropType = {
  data: InstDataType;
  filterValue: string;
  showHeader: boolean;
  columns: readonly Column<object>[];
  onRowClick: (data: object) => void;
};

export default function InstitutionsListTable({
  data,
  columns,
  onRowClick,
  showHeader, // filterValue,
}: RecordsTablePropType) {
  // const filterTypes: UseFiltersOptions['filterTypes'] = useMemo(
  //   () => ({
  //     // Add a new fuzzyTextFilterFn filter type.
  //     fuzzyText: fuzzyTextFilterFn,
  //     // Or, override the default text filter to use
  //     // "startWith"
  //     text: (rows, id, filterValue) => {
  //       return rows.filter((row) => {
  //         const rowValue = row.values[id];
  //         return rowValue !== undefined
  //           ? String(rowValue)
  //               .toLowerCase()
  //               .startsWith(String(filterValue).toLowerCase())
  //           : true;
  //       });
  //     },
  //   }),
  //   []
  // );

  const { rows, prepareRow, headerGroups, getTableProps, getTableBodyProps } =
    useTable(
      {
        columns,
        data,
      },
      useFlexLayout,
      useGlobalFilter
    );

  const RenderRow = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        // eslint-disable-next-line
        <div
          className='tr list-item'
          onClick={() => onRowClick(row.original)}
          {...row.getRowProps({
            style,
          })}
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
    [prepareRow, rows, onRowClick]
  );

  // useEffect(() => {
  //   setGlobalFilter(filterValue); // Set the Global Filter to the filter prop.
  // }, [filterValue, setGlobalFilter]);

  return (
    <div className='table recordsTable' {...getTableProps()}>
      {showHeader && (
        <div className='w-full'>
          {headerGroups.map((headerGroup) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.headers[0].id}
              className='tr'
            >
              {headerGroup.headers.map((column) => (
                <div
                  {...column.getHeaderProps()}
                  key={column.id}
                  className='th'
                >
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div
        {...getTableBodyProps()}
        className='max-h-[70vh] 3xl:max-h-[75vh] w-full max-w-full h-full'
      >
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              itemSize={45}
              width={width || 10}
              height={height || 10}
              itemCount={rows.length}
              style={{ overflowY: 'auto' }}
            >
              {RenderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
