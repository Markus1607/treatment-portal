import { useState } from 'react';
import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import InstitutionsList from './components/InstitutionList';
import RegisterForm from './components/RegisterForm';
import EditForm from './components/EditForm';

export default function Institutions() {
  const { t } = AppProvider.useContainer();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useTitle(t('Dashboard.Institutions'));

  return (
    <div className='childrenContainer'>
      <div className='flex flex-col h-full p-4 mx-auto text-center text-black gap-4 xl:grid xl:grid-cols-forms'>
        {!isEditing && (
          <>
            <div className='container'>
              <RegisterForm />
            </div>
            <InstitutionsList
              setIsEditing={setIsEditing}
              setSelectedInstitution={setSelectedInstitution}
              selectedInstitution={selectedInstitution}
            />
          </>
        )}
        {isEditing && (
          <div className='container'>
            <EditForm
              setIsEditing={setIsEditing}
              selectedInstitution={selectedInstitution}
            />
          </div>
        )}
      </div>
    </div>
  );
}
