import { DiscardButton } from 'components/Forms/Buttons';
import { ReactComponent as BinIcon } from 'assets/images/ic_bin.svg';
import { ClipLoader } from 'components/Loader';

export default function DeleteInstitutionModal({
  t,
  isDeleting,
  onDeleteFunction,
  setDeleteStaffModal,
}) {
  return (
    <div>
      <main className='p-14'>
        <h1 className='text-xl font-medium text-black 2xl:text-2xl'>
          {t('delete_institution.tite')}
        </h1>
        <p className='text-[0.95rem] mt-6 text-black-light font-light'>
          {t('delete_institution.description')}
        </p>
      </main>
      <footer className='flex justify-between px-4 py-3 bg-white border'>
        <DiscardButton
          alt={t('Delete_staff_member.text.17')}
          text={t('Delete_staff_member.text.17')}
          onClick={() => setDeleteStaffModal(false)}
        />

        {isDeleting && <ClipLoader color='#1e477f' size={0.95} />}

        <button
          type='button'
          onClick={() => onDeleteFunction && onDeleteFunction()}
          className='flex gap-2 items-center justify-center px-4 py-1.5 text-white text-sm bg-blue rounded hover:scale-y-105'
        >
          <span className='self-center scale-75'>
            <BinIcon />
          </span>
          <span> {t('delete_institution.tite')} </span>
        </button>
      </footer>
    </div>
  );
}
