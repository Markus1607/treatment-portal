import toast from 'react-hot-toast';
import { AppProvider } from 'AppProvider';
import { useTitle } from 'utils/hooks';
import { btnIcons } from 'utils/icons';
import Table, { Data } from './components/Table';
import Modal from 'components/Modals/Modal';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { staffEdit, staffRegister } from 'routes';
import { ChangeEvent, lazy, useMemo, useState } from 'react';
import { useDeleteStaffData, useStaffData } from './api/query';
import { PatientSearchBar as StaffSearchBar } from 'components/SearchBars';
import { StaffMemberType } from './api/format';
import { Column } from 'react-table';

export default function Staff() {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const { t, cookies } = AppProvider.useContainer();
  const [isStateError, setStateError] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMemberType>({
    uid: '',
    forename: '',
    surname: '',
    email: '',
  });
  const [deleteStaffModal, setDeleteStaffModal] = useState(false);
  const deleteStaffDetails = useDeleteStaffData(selectedStaff?.uid);
  const [tableStateText, setTableStateText] = useState<string>(
    t('No_data_available')
  );
  const { isLoading, data: staffData } = useStaffData(cookies.user.token);

  useTitle(t('Dashboard.Staff'));

  const staffListData = useMemo(() => {
    setStateError(false);
    if (!isLoading && staffData && Array.isArray(staffData)) {
      return staffData;
    }
    if (!isLoading && staffData && 'error' in staffData) {
      setStateError(true);
      setTableStateText(t('Error.staff.fetch'));
      return [];
    }
    return [];
  }, [t, staffData, isLoading]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchTerm(value);
  };

  const onRowClick = (staffData: StaffMemberType) => {
    setSelectedStaff(staffData);
    history.push({ pathname: staffEdit, state: staffData });
  };

  const columns: Column<Data>[] = useMemo(
    () => [
      {
        Header: t('Admin.question.74'),
        accessor: 'surname',
      },
      {
        Header: t('Admin_staff.forenames'),
        accessor: 'forename',
      },
      {
        Header: t('Admin.question'),
        accessor: 'email',
        width: 450,
      },
    ],
    [t]
  );

  const handleStaffDeletion = () => {
    deleteStaffDetails.mutate(
      {
        token: cookies.user.token,
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            setDeleteStaffModal(false);
            toast.success(t('Success.staff.deleted'));
            queryClient.invalidateQueries('staffData');
          }
        },
        onError: (response) => {
          console.error(response);
          setDeleteStaffModal(false);
          toast.error(t('Error.deleting.staff'));
        },
      }
    );
  };

  const DeleteStaffModal = lazy(() => import('./components/DeleteStaffModal'));

  return (
    <div className='childrenContainer'>
      <div className='flex flex-col w-full h-full max-w-screen bg-dashboard'>
        <div className='flex items-center w-full p-4 border-t border-b-2 gap-5 2xl:justify-between border-gray-light'>
          <StaffSearchBar
            searchTerm={searchTerm}
            handleChange={handleSearch}
            placeholder={t('Admin_staff.search_placeholder')}
          />
          <button
            onClick={() => history.push(staffRegister)}
            className='flex flex-shrink-0 gap-2 items-center px-11 2xl:py-3 py-3.5 text-white 2xl:text-base text-sm font-medium bg-blue rounded hover:scale-105 active:scale-95'
          >
            <span className='self-center scale-75 2xl:scale-90'>
              <img src={btnIcons.add} alt='add button' />
            </span>
            <span>{t('Admin_staff.Register_staff')}</span>
          </button>
        </div>
        <div className='w-full h-full overflow-x-auto overflow-y-hidden bg-white'>
          <Table
            t={t}
            cookies={cookies}
            columns={columns}
            filter={searchTerm}
            data={staffListData}
            onRowClick={onRowClick}
            isDataLoading={isLoading}
            isStateError={isStateError}
            tableStateText={tableStateText}
            setSelectedStaff={setSelectedStaff}
            setDeleteStaffModal={setDeleteStaffModal}
          />
        </div>
      </div>
      <Modal
        isVisible={deleteStaffModal}
        setVisible={setDeleteStaffModal}
        modalContent={
          <DeleteStaffModal
            t={t}
            onDeleteFunction={handleStaffDeletion}
            isDeleting={deleteStaffDetails.isLoading}
            setDeleteStaffModal={setDeleteStaffModal}
          />
        }
      />
    </div>
  );
}
