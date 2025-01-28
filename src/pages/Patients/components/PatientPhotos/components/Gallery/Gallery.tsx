import Modal from 'components/Modals/Modal';
import toast from 'react-hot-toast';
import { AppProvider } from 'AppProvider';
import { defaultValues } from './api/format';
import { useQueryClient } from 'react-query';
import { ClipLoader } from 'components/Loader';
import GalleryModal from './components/GalleryModal';
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import { useGetPhotos, useDeletePhoto } from './api/query';
import { isEmpty, isArray, remove } from 'lodash';
import ImageCard from './components/ImageCard';
import { ReactComponent as GalleryIcon } from 'assets/images/ic_summary.svg';
import { DefaultPhotosValuesType } from './api/api';
import { ReactComponent as ErrorFaceIcon } from 'assets/images/no-data-icon.svg';
import { ImageListType, ImageType } from 'react-images-uploading';

type GalleryProps = {
  patientUid: string;
  patientUsername: string;
  uploadedImage: ImageType[];
  UploadButton: () => JSX.Element;
  setUploadedImage: Dispatch<SetStateAction<ImageListType>>;
};

export default function Gallery({
  patientUid,
  UploadButton,
  uploadedImage,
  patientUsername,
  setUploadedImage,
}: GalleryProps) {
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();
  const isGalleryPage = useRef(false);
  const deletePhoto = useDeletePhoto();
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const [getLoadPercentage, setLoadPercentage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageData, setSelectedImageData] =
    useState<DefaultPhotosValuesType>();

  const { isLoading, data } = useGetPhotos(
    user?.token,
    patientUid,
    setLoadPercentage
  );

  const patientPhotos: DefaultPhotosValuesType[] = useMemo(() => {
    if (!isLoading && (data?.code === 1005 || !data?.error)) {
      setErrMsg('');
      if (data?.code === 1005) {
        return [];
      }
      return data;
    }
    if (!isLoading && data?.error && data?.code !== 1005) {
      setErrMsg(t('Error_patient_photo_load'));
      return [];
    }
    return [];
  }, [t, data, isLoading]);

  useEffect(() => {
    isGalleryPage.current = true;
    if (!isEmpty(uploadedImage) && patientUid && isGalleryPage.current) {
      const image = uploadedImage[0]?.data_url?.split(',')[1];
      const imgFormat = uploadedImage[0]?.file?.type.split('/')[1];
      setSelectedImageData(() => ({
        ...defaultValues,
        image,
        patientUsername,
        format: imgFormat,
        submissionType: 4,
      }));
      setIsModalVisible(true);
    }
    return () => {
      isGalleryPage.current = false;
    };
  }, [uploadedImage, patientUid]);

  const handleDeletePhoto = (photoUid: string) => {
    deletePhoto.mutate(
      {
        token: user?.token,
        photoUid: photoUid,
      },
      {
        onSuccess: ({ data }) => {
          if (data.message) {
            queryClient.setQueriesData(
              'getPatientPhotos',
              (oldQueryData: unknown) => {
                if (oldQueryData && isArray(oldQueryData)) {
                  remove(oldQueryData, (item) => item.photoUid === photoUid);
                  return oldQueryData;
                }
              }
            );
          }
        },
        onError: (error) => {
          if (error?.response?.data.code === 1609) return;
          console.error(error);
          toast.error(t('Error.photo_delete'));
        },
        onSettled: () => {
          queryClient.invalidateQueries('getPatientPhotos');
        },
      }
    );
  };

  return (
    <>
      {isLoading && (
        <div className='flex items-center justify-center w-full h-full mx-auto'>
          <ClipLoader
            size={1.5}
            color='#1e477f'
            percentageLoad={getLoadPercentage}
          />
        </div>
      )}

      {!isLoading && errMsg && (
        <div className='flex flex-col items-center justify-center w-full h-full gap-4 mx-auto'>
          <ErrorFaceIcon width={100} style={{ fill: 'tomato' }} />
          <p className='text-warning'>{errMsg}</p>
        </div>
      )}

      {!isLoading && !errMsg && isEmpty(patientPhotos) && (
        <div className='flex flex-col items-center justify-center w-full h-full mx-auto space-y-5 text-black-light'>
          <GalleryIcon className='w-24 h-24' />
          <p className='text-base font-medium 4xl:text-lg'>
            {t('gallery_no_pictures.h1')}
          </p>
          <UploadButton />
        </div>
      )}

      {!isLoading && !errMsg && !isEmpty(patientPhotos) && (
        <div className='grid grid-cols-2 gap-5 text-black 3xl:grid-cols-4 xl:grid-cols-3'>
          {patientPhotos.map((data, index) => (
            <ImageCard
              t={t}
              data={data}
              isGalleryPage={isGalleryPage}
              key={`${data.photoUid}-${index}`}
              setIsModalVisible={setIsModalVisible}
              setSelectedImageData={setSelectedImageData}
              handleDeletePhoto={() => handleDeletePhoto(data.photoUid)}
            />
          ))}
        </div>
      )}

      <Modal
        overflow='visible'
        closeOnEsc={false}
        closeMaskOnClick={false}
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        modalContent={
          selectedImageData?.image ? (
            <GalleryModal
              t={t}
              token={user?.token}
              patientUid={patientUid}
              patientUsername={patientUsername}
              setUploadedImage={setUploadedImage}
              setGalleryModal={setIsModalVisible}
              selectedImageData={selectedImageData}
              setSelectedImageData={setSelectedImageData}
              isUploadedImage={!isEmpty(uploadedImage) ? true : false}
            />
          ) : (
            <div />
          )
        }
      />
    </>
  );
}
