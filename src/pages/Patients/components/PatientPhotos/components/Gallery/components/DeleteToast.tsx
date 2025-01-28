import {
  Dispatch,
  useEffect,
  useState,
  SetStateAction,
  MutableRefObject,
} from 'react';
import { galleryIcons } from 'utils/icons';
import toast, { Toast } from 'react-hot-toast';
import { TFunction } from 'react-i18next';

type DeleteToastProps = {
  t: TFunction;
  currentToast: Toast;
  photoUid: string | undefined | null;
  isGalleryPage: MutableRefObject<boolean>;
  handleDeletePhoto: (photoUid: string) => void;
  setIsImageDeleted: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteToast({
  t,
  photoUid,
  currentToast,
  isGalleryPage,
  setIsImageDeleted,
  handleDeletePhoto,
}: DeleteToastProps) {
  const [triggerDeleteFunc, setTriggerDeleteFunc] = useState(true);

  useEffect(() => {
    return () => {
      if (!currentToast.visible && triggerDeleteFunc && photoUid) {
        return handleDeletePhoto(photoUid);
      }
    };
  }, [
    photoUid,
    currentToast,
    triggerDeleteFunc,
    handleDeletePhoto,
    setTriggerDeleteFunc,
  ]);

  return (
    <div
      className={`${
        currentToast.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-md pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className='bg-[#fbe7ce] flex-1 w-0 rounded-l-md'>
        <div className='flex items-center'>
          <div className='px-2'>
            <img alt='warning' src={galleryIcons.warning} />
          </div>
          <div className='flex-1 p-4 bg-white'>
            <p className='text-sm font-medium text-gray-900'>
              {t('photos.photo_deleted')}
            </p>
            <p className='flex gap-1 mt-1 text-sm text-gray-500'>
              <span>{t('photos.toast.photo_deleted.body')}</span>
              <span
                onClick={() => {
                  if (isGalleryPage.current) {
                    setIsImageDeleted(false);
                  }
                  setTriggerDeleteFunc(false);
                  toast.dismiss(currentToast.id);
                }}
                className='text-blue-500 underline cursor-pointer'
              >
                {t('link.undo')}
              </span>{' '}
            </p>
          </div>
        </div>
      </div>
      <div className='flex self-start pt-4'>
        <button
          onClick={() => toast.dismiss(currentToast.id)}
          className='flex items-center justify-center p-4 pt-0.5 w-full rounded-none rounded-r-lg focus:outline-none'
        >
          <img src={galleryIcons.cross} alt='close' />
        </button>
      </div>
    </div>
  );
}
