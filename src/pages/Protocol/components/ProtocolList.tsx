import { Column } from 'react-table';
import { useTitle } from 'utils/hooks';
import { btnIcons } from 'utils/icons';
import { colors } from 'utils/constants';
import { toast } from 'react-hot-toast';
import { TFunction } from 'react-i18next';
import { AppProvider } from 'AppProvider';
import Modal from 'components/Modals/Modal';
import { Tooltip } from 'react-tooltip';
import { useQueryClient } from 'react-query';
import ProtocolTable, { Data } from './ProtocolTable';
import { combinedDPDT, conventionalDPDT } from 'routes';
import { useHistory, useLocation } from 'react-router-dom';
import MakeDefaultButton from 'components/MakeDefaultButton';
import { ReactComponent as HelpIcon } from 'assets/images/ic_info.svg';
import { ChangeEvent, lazy, useEffect, useMemo, useState } from 'react';
import { useDeleteProtocol, useMakeDefaultProtocol } from '../api/query';
import { PatientSearchBar as ProtocolSearchBar } from 'components/SearchBars';

export type ProtocolListProps = {
  listData: Data[];
  isStateError: boolean;
  tableStateText: string;
  addProtocolUrl: string;
  selectedProtocol: { id: string; protocolName: string } | null;
  selectedDisease: { uid: string; diseaseName: string } | null;
  setSelectedProtocol: React.Dispatch<
    React.SetStateAction<{
      id: string;
      protocolName: string;
    } | null>
  >;
};

export default function ProtocolList({
  listData,
  isStateError,
  addProtocolUrl,
  tableStateText,
  selectedDisease,
  selectedProtocol,
  setSelectedProtocol,
}: ProtocolListProps) {
  const history = useHistory();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const deleteProtocol = useDeleteProtocol();
  const [searchTerm, setSearchTerm] = useState('');
  const { t, cookies } = AppProvider.useContainer();
  const makeDefaultProtocol = useMakeDefaultProtocol();
  const [deleteProtocolModal, setDeleteProtocolModal] = useState(false);
  const [defaultProtocol, setDefaultProtocol] = useState<string | null>(null);
  const isAddProtocolBtnDisabled = [combinedDPDT, conventionalDPDT].includes(
    pathname
  );

  useTitle(t('protocol-title'));

  useEffect(() => {
    const defaultedProtocolId =
      listData.find((protocol) => protocol.makeDefault)?.id ?? null;
    setDefaultProtocol(defaultedProtocolId);
  }, [listData]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const handleProtocolDelete = () => {
    if (!selectedProtocol) return;

    const performDeletion = () => {
      deleteProtocol.mutate(
        {
          token: cookies.user.token,
          protocolId: selectedProtocol.id,
        },
        {
          onSuccess: ({ status }) => {
            if (status === 200) {
              setDeleteProtocolModal(false);
              toast.success(t('successfully-deleted'));
              queryClient.invalidateQueries('allProtocolData');
            }
          },
          onError: (err: any) => {
            setDeleteProtocolModal(false);
            if (err?.response?.data?.code === 1051) {
              toast.error(t('Error.cant_delete_protocol'));
            } else {
              toast.error(t('failed-to-delete-protocol'));
            }
          },
        }
      );
    };

    performDeletion();
  };

  const handleMakeDefaultProtocol = (
    e: React.MouseEvent<HTMLButtonElement>,
    protocolUid: string
  ) => {
    e.stopPropagation();
    if (!protocolUid) return;
    makeDefaultProtocol.mutate(
      {
        token: cookies.user.token,
        data: { protocolUid, diseaseUid: selectedDisease?.uid || '' },
      },
      {
        onSuccess: ({ status }) => {
          if (status === 200) {
            setDefaultProtocol(protocolUid);
            toast.success(t('successfully-made-default'));
            queryClient.invalidateQueries('allProtocolData');
          }
        },
        onError: () => {
          toast.error(t('failed-to-make-default'));
        },
      }
    );
  };

  const columns: Column<Data>[] = useMemo(
    () => [
      {
        Header: `${selectedDisease?.diseaseName} ${t('protocols')}`,
        accessor: 'protocolName',
      },
      {
        Header: <MakeDefaultHeader t={t} />,
        accessor: 'makeDefault',
        Cell: ({ row: { original } }) => (
          <MakeDefaultButton
            isDefault={defaultProtocol === original.id}
            onClick={(e) => handleMakeDefaultProtocol(e, original.id)}
          />
        ),
      },
    ],
    // react-hooks/exhaustive-deps
    [t, defaultProtocol, selectedDisease]
  );

  const onRowClick = (protocolData: Data) => {
    const { id, protocolName } = protocolData;
    id &&
      setSelectedProtocol({
        id,
        protocolName,
      });
    history.push({
      pathname: `${pathname}/${id}/edit`,
    });
  };

  const DeleteProtocolModal = lazy(() => import('./DeleteProtocolModal'));

  return (
    <div className='childrenContainer'>
      <div className='flex flex-col w-full h-full max-w-screen bg-dashboard'>
        <div className='flex items-center w-full gap-5 p-4 2xl:justify-between border-gray-light'>
          <ProtocolSearchBar
            searchTerm={searchTerm}
            handleChange={handleSearch}
            placeholder={`${t('search')} ${selectedDisease?.diseaseName} ${t(
              'protocols'
            )}`}
          />
          <button
            disabled={isAddProtocolBtnDisabled}
            onClick={() => history.push(addProtocolUrl)}
            className={`flex flex-shrink-0 gap-2 items-center px-11 2xl:py-3 py-3.5 text-white 2xl:text-base text-sm font-medium rounded ${
              isAddProtocolBtnDisabled
                ? 'cursor-not-allowed bg-gray-300 '
                : 'bg-blue hover:scale-105 active:scale-95'
            }`}
          >
            <span className='self-center scale-75 2xl:scale-90'>
              <img src={btnIcons.add} alt={t('add_protocol')} />
            </span>
            <span>{t('add_protocol')}</span>
          </button>
        </div>
        <div className='w-full h-full overflow-x-auto overflow-y-hidden bg-white'>
          <ProtocolTable
            t={t}
            data={listData}
            columns={columns}
            filter={searchTerm}
            isDataLoading={false}
            onRowClick={onRowClick}
            isStateError={isStateError}
            tableStateText={tableStateText}
            setSelectedProtocol={setSelectedProtocol}
            setDeleteProtocolModal={setDeleteProtocolModal}
          />
        </div>
      </div>
      <Modal
        isVisible={deleteProtocolModal}
        setVisible={setDeleteProtocolModal}
        modalContent={
          <DeleteProtocolModal
            t={t}
            isDeleting={deleteProtocol.isLoading}
            onDeleteFunction={handleProtocolDelete}
            setDeleteProtocolModal={setDeleteProtocolModal}
            selectedProtocolName={selectedProtocol?.protocolName || ''}
          />
        }
      />
    </div>
  );
}

type MakeDefaultHeaderProps = {
  t: TFunction<'translation', undefined>;
};

const MakeDefaultHeader = ({ t }: MakeDefaultHeaderProps) => {
  return (
    <>
      <div className='flex items-center gap-2'>
        <p>{t('make-default-label')}</p>
        <HelpIcon
          data-tooltip-place='right'
          data-tooltip-id='make-default-id'
          style={{ scale: '0.8', color: colors.blue.dark, cursor: 'pointer' }}
        />
      </div>
      <Tooltip
        id='make-default-id'
        style={{
          zIndex: 10,
          color: 'white',
          fontWeight: 'normal',
          backgroundColor: colors.blue.DEFAULT,
        }}
        render={() => (
          <span className='whitespace-pre-wrap'>
            {t('make-default-info-text')}
          </span>
        )}
      />
    </>
  );
};
