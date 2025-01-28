import { ReactComponent as BinIcon } from 'assets/images/ic_bin.svg';
import DeleteToast from './DeleteToast';
import LazyLoad from 'react-lazyload';
import { galleryIcons } from 'utils/icons';
import { uniqueId } from 'lodash';
import toast from 'react-hot-toast';
import {
  useState,
  MutableRefObject,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { TFunction } from 'react-i18next';
import { DefaultPhotosValuesType } from '../api/api';

type ImageCardProps = {
  t: TFunction;
  data: DefaultPhotosValuesType | undefined;
  isGalleryPage: MutableRefObject<boolean>;
  handleDeletePhoto: (photoUid: string) => void;
  setIsModalVisible: (value: boolean) => void;
  setSelectedImageData: Dispatch<
    SetStateAction<DefaultPhotosValuesType | undefined>
  >;
};

export default function ImageCard({
  t,
  data,
  isGalleryPage,
  handleDeletePhoto,
  setIsModalVisible,
  setSelectedImageData,
}: ImageCardProps) {
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const handleDeleteOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsImageDeleted(() => {
      toast.custom(
        (currentToast) => (
          <DeleteToast
            t={t}
            photoUid={data?.photoUid}
            currentToast={currentToast}
            isGalleryPage={isGalleryPage}
            setIsImageDeleted={setIsImageDeleted}
            handleDeletePhoto={handleDeletePhoto}
          />
        ),
        {
          duration: 5000,
          position: 'bottom-right',
        }
      );
      return true;
    });
  };

  return (
    <div
      key={uniqueId('image-')}
      onClick={() => {
        new Promise((resolve) => {
          resolve(setSelectedImageData(data));
        }).then(() => {
          setIsModalVisible(true);
        });
      }}
      className={`${
        isImageDeleted ? 'hidden' : 'flex'
      } flex-col items-center justify-center w-full h-full text-black-light text-sm font-light bg-white border border-gray-100 rounded-md shadow-sm cursor-pointer overflow-hidden`}
    >
      <div className='relative w-full h-full cursor-pointer group'>
        <button
          onClick={(e) => handleDeleteOnClick(e)}
          className='bg-black/80 text-medium absolute left-2 top-3 group-hover:flex hidden gap-1 items-center px-2.5 text-white text-sm rounded-md'
        >
          <BinIcon className='scale-[.85]' />
          <span className='pt-1.5 py-1'>{t('Button_delete')}</span>
        </button>
        {data?.image && (
          <LazyLoad
            once
            overflow
            height={350}
            throttle={100}
            className='bg-gray-100'
          >
            <img
              width='400'
              height='400'
              alt='patient-img'
              src={`data:image/png;base64,${data?.image}`}
              className='max-h-[21rem] min-h-[21rem] 3xl:max-h-[22rem] 3xl:min-h-[22rem] mx-auto w-full h-full rounded-tl-md rounded-tr-md object-contain'
            />
          </LazyLoad>
        )}
      </div>

      <div className='w-full px-2'>
        <div className='flex flex-col gap-0.5 pb-2 pt-4 px-2 w-full bg-white border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <h3 className='text-[0.95rem] text-black font-medium'>
              {data?.bodySiteText}
            </h3>
            <span className='text-black-lighter'>{data?.dateTakenText}</span>
          </div>
          <div className='text-[0.8rem] flex gap-1.5 items-center text-black-lighter'>
            <img
              alt='upload-icon-type'
              src={
                data?.submissionType === 4
                  ? galleryIcons.staff_upload
                  : galleryIcons.patient_upload
              }
            />
            <span>
              {data?.submissionType === 4
                ? t('state.photo.uploaded')
                : t('state.photo.patient_submitted')}
            </span>
          </div>
        </div>
        <div className='text-[0.8rem] flex gap-10 px-2 py-2.5 w-full bg-white'>
          <span>
            {t('score.akasi.sub_score')}{' '}
            <span className='text-[0.9rem] ml-0.5 text-SmartPDTorange font-normal'>
              {data?.akasiSubScore || '-'}
            </span>
          </span>
          <span>
            LSR{' '}
            <span className='text-[0.9rem] ml-0.5 text-blue-400 font-normal'>
              {data?.lsrTotalScore || '-'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
