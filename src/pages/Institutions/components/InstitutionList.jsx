import toast from 'react-hot-toast';
import { truncate } from 'lodash';
import { AppProvider } from 'AppProvider';
import Modal from 'components/Modals/Modal';
import { useQueryClient } from 'react-query';
import { ClipLoader } from 'components/Loader';
import { RecordSearchBar } from 'components/SearchBars';
import InstitutionsListTable from './InstitutionsListTable';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { EditButton, DeleteButton } from 'components/Forms/Buttons';
import DeleteInstitutionModal from './DeleteInstitutionModal';
import { useDeleteInstitutionData, useInstitutionsData } from '../api/query';

export default function InstitutionsList({
  setIsEditing,
  selectedInstitution,
  setSelectedInstitution,
}) {
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { t, cookies } = AppProvider.useContainer();
  const deleteInstitutionData = useDeleteInstitutionData();
  const { data, isLoading } = useInstitutionsData(cookies.user.token);
  const [deleteInstitutionModal, setDeleteInstitutionModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !data?.error) {
      setErrMsg('');
    }
    if (!isLoading && data?.error) {
      setErrMsg(t('Error.fetching.institution'));
    }
  }, [t, data, isLoading]);

  const handleChange = (e) => {
    const value = e.currentTarget.value;
    setSearchTerm(value);
  };

  const onRowClick = useCallback(
    (data) => {
      setIsEditing(true);
      setSelectedInstitution(data);
    },
    [setIsEditing, setSelectedInstitution]
  );

  const handleDeleteInstitution = (id) => {
    deleteInstitutionData.mutate(
      {
        instID: id,
        token: cookies.user.token,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            toast.success(t('Institutions.deleted'));
            setDeleteInstitutionModal(false);
            queryClient.invalidateQueries('institutionsData');
          }
        },
        onError: (response) => {
          console.error(response);
          toast.error(t('Error.deleting.institution'));
        },
      }
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: t('Institutions.name'),
        accessor: 'name',
        width: 120,
        Cell: ({ value }) => (
          <p className='font-medium text-black'>
            {truncate(value, { length: 40 })}
          </p>
        ),
      },
      {
        Header: t('Institutions.Post_Code'),
        accessor: 'postCode',
        Cell: ({ value, row }) => {
          return (
            <div className='flex items-center justify-between w-full p-0 m-0'>
              <p>{value}</p>
              <div className='flex items-center pr-5 gap-14'>
                <EditButton
                  onClick={onRowClick}
                  text={t('Institutions.edit')}
                  alt={t('Institutions.edit')}
                />
                <DeleteButton
                  text={t('Institutions.delete')}
                  alt={t('Institutions.delete')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteInstitutionModal(true);
                    setSelectedInstitution(row.original);
                  }}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [t, onRowClick, setSelectedInstitution]
  );

  return (
    <div className='h-full px-3 py-4 overflow-y-hidden text-sm text-left bg-white containerShadow'>
      <div className='flex items-center justify-between mb-6 gap-5'>
        <h1 className='text-base font-medium 2xl:text-lg'>
          {t('Institution_list')}
        </h1>
        <RecordSearchBar
          className='w-[40%]'
          searchTerm={searchTerm}
          handleChange={handleChange}
          placeholder={t('Institutions.search_for_institution')}
        />
      </div>
      {isLoading && (
        <div className='mt-[10rem] flex items-center justify-center'>
          <ClipLoader color='#1e477f' size={1} />
        </div>
      )}
      {!isLoading && errMsg && (
        <div className='mt-[10rem] flex items-center justify-center'>
          <p className='text-sm errorMessage'>{errMsg}</p>
        </div>
      )}
      {!isLoading && !data.error && !errMsg && (
        <InstitutionsListTable
          showHeader
          data={data}
          columns={columns}
          filter={searchTerm}
          onRowClick={onRowClick}
        />
      )}
      <Modal
        isVisible={deleteInstitutionModal}
        setVisible={setDeleteInstitutionModal}
        modalContent={
          <DeleteInstitutionModal
            t={t}
            isDeleting={deleteInstitutionData.isLoading}
            setDeleteStaffModal={setDeleteInstitutionModal}
            onDeleteFunction={() =>
              handleDeleteInstitution(selectedInstitution.id)
            }
          />
        }
      />
    </div>
  );
}
