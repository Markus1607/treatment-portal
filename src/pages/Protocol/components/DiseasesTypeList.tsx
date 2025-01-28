import { Column } from 'react-table';
import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import DiseaseTable, { Data } from './DiseasesTypeTable';
import { useHistory, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export type DiseasesListProps = {
  listData: Data[];
  isStateError: boolean;
  tableStateText: string;
  isDataLoading: boolean;
  selectedDisease: { uid: string; diseaseName: string } | null;
  setSelectedDisease: React.Dispatch<
    React.SetStateAction<{ uid: string; diseaseName: string } | null>
  >;
};

export default function DiseaseTypeList({
  listData,
  isStateError,
  tableStateText,
  isDataLoading,
  setSelectedDisease,
}: DiseasesListProps) {
  const history = useHistory();
  const { pathname } = useLocation();
  const { t } = AppProvider.useContainer();

  useTitle(t('protocol-title'));

  const columns: Column<Data>[] = useMemo(
    () => [
      {
        Header: t('disease_name_label'),
        accessor: 'diseaseName',
      },
    ],
    [t]
  );

  const onRowClick = (protocolData: Data) => {
    const { uid, diseaseName } = protocolData;
    if (uid && diseaseName) {
      setSelectedDisease({
        uid,
        diseaseName,
      });

      history.push({
        pathname: `${pathname}/${diseaseName}`,
      });
    }
  };

  return (
    <div className='childrenContainer'>
      <div className='flex flex-col w-full h-full max-w-screen bg-dashboard'>
        <div className='w-full h-full overflow-x-auto overflow-y-hidden bg-white'>
          <DiseaseTable
            t={t}
            data={listData}
            columns={columns}
            onRowClick={onRowClick}
            isStateError={isStateError}
            isDataLoading={isDataLoading}
            tableStateText={tableStateText}
          />
        </div>
      </div>
    </div>
  );
}
