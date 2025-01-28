import moment from 'moment';
import toast from 'react-hot-toast';
import Modal from 'components/Modals/Modal';
import ImageModal from './ImageModal';
import ScoreDisplay from './ScoreDisplay';
import { galleryIcons } from 'utils/icons';
import { useForm } from 'react-hook-form';
import DatePicker from 'components/Forms/DatePicker';
import { ScoreToggleRadio } from 'components/Forms/Radios';
import {
  useState,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from 'react';
import { usePostPhoto, useEditPhoto } from '../api/query';
import { useQueryClient } from 'react-query';
import {
  areaExtent,
  crusting,
  erosion,
  erythema,
  flaking,
  swelling,
  thickness,
  bodySite,
  lsrErythema,
  vesiculation,
  akDistribution,
} from 'utils/options';
import { Link } from 'react-router-dom';
import DiscardModal from './DiscardModal';
import { patients, treatments } from 'routes';
import UploadedModal from './UploadedModal';
import Select from 'components/Forms/Select';
import TextArea from 'components/Forms/TextArea';
import {
  formatBEPostPhotos,
  formatBEPutPhoto,
  formatResponseData,
} from '../api/format';
import { DiscardButton, TickButton } from 'components/Forms/Buttons';
import { ReactComponent as ExpandIcon } from 'assets/images/ic_expand.svg';
import unaffectedIcon from 'assets/images/ic_unaffected.svg';
import unaffectedIcon2 from 'assets/images/ic_unaffected2.svg';
import { ClipLoader } from 'components/Loader';
import { ModalTitle } from 'components/ModalTitle';
import { TFunction } from 'react-i18next';
import { DefaultPhotosValuesType } from '../api/api.d';

type GalleryModalProps = {
  t: TFunction;
  token: string;
  patientUid: string;
  patientUsername: string;
  isUploadedImage: boolean;
  setUploadedImage: (value: any) => void;
  selectedImageData: DefaultPhotosValuesType;
  setGalleryModal: Dispatch<SetStateAction<boolean>>;
  setSelectedImageData: (value?: DefaultPhotosValuesType) => void;
};

export default function GalleryModal({
  t,
  token,
  patientUid,
  setGalleryModal,
  patientUsername,
  isUploadedImage,
  setUploadedImage,
  selectedImageData,
  setSelectedImageData,
}: GalleryModalProps) {
  const {
    image,
    photoUid,
    sessionId,
    akasiSubScore,
    lsrTotalScore,
    submissionType,
    patientComments,
  } = selectedImageData;
  const queryClient = useQueryClient();
  const editPhoto = useEditPhoto(photoUid);
  const postPhoto = usePostPhoto(patientUid);
  const [imageModal, setImageModal] = useState(false);
  const { patient_upload, staff_upload } = galleryIcons;
  const [discardModal, setDiscardModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('AKASI');
  const [uploadedModal, setUploadedModal] = useState(false);
  const {
    watch,
    control,
    register,
    setFocus,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<DefaultPhotosValuesType>({
    defaultValues: {
      ...selectedImageData,
    },
  });

  const [lsrScore, setLsrScore] = useState(lsrTotalScore || 0);
  const [akasiScore, setAkasiScore] = useState(akasiSubScore || 0);
  const isUnaffected = parseInt(watch('akasiAreaExtent')) === 0;
  const calculateAkasiScore = useCallback(() => {
    const values = getValues();
    const bodySiteMultiplier = watch('bodySite') === 1 ? 0.4 : 0.2;
    if (
      !isNaN(parseInt(values.akasiAreaExtent)) &&
      !isNaN(parseInt(values.akasiDistribution)) &&
      !isNaN(parseInt(values.akasiErythema)) &&
      !isNaN(parseInt(values.akasiThickness)) &&
      parseInt(values.akasiAreaExtent) !== 0
    ) {
      const akasiScore =
        (parseInt(values.akasiAreaExtent) +
          parseInt(values.akasiDistribution) +
          parseInt(values.akasiErythema) +
          parseInt(values.akasiThickness)) *
        bodySiteMultiplier;
      setAkasiScore(akasiScore);
    } else {
      setAkasiScore(0);
    }
  }, [getValues, watch]);

  const calculateLsrScore = useCallback(() => {
    const values = getValues();
    if (
      !isNaN(parseInt(values.lsrErythema)) &&
      !isNaN(parseInt(values.lsrScaling)) &&
      !isNaN(parseInt(values.lsrCrusting)) &&
      !isNaN(parseInt(values.lsrSwelling)) &&
      !isNaN(parseInt(values.lsrVesiculation)) &&
      !isNaN(parseInt(values.lsrErosion))
    ) {
      const lsrScore =
        parseInt(values.lsrErythema) +
        parseInt(values.lsrScaling) +
        parseInt(values.lsrCrusting) +
        parseInt(values.lsrSwelling) +
        parseInt(values.lsrVesiculation) +
        parseInt(values.lsrErosion);
      setLsrScore(lsrScore);
    } else {
      setLsrScore(0);
    }
  }, [getValues]);

  useEffect(() => {
    if (watch('bodySite')) {
      calculateAkasiScore();
    }
    calculateLsrScore();
  }, [calculateAkasiScore, calculateLsrScore, watch]);

  const resetModalOnClose = useCallback(() => {
    setLsrScore(0);
    setAkasiScore(0);
    setImageModal(false);
    setSelectedTab('AKASI');
    setDiscardModal(false);
    setGalleryModal(false);
    setUploadedImage(null);
    setUploadedModal(false);
    setSelectedImageData();
  }, [setGalleryModal, setSelectedImageData, setUploadedImage]);

  const modalTitle = `${t(
    'Patient_records_patient'
  )} > ${patientUsername} > SmartAK > ${t('option.gallery')} > IMG${
    selectedImageData?.photoUid || ''
  }`;

  const onSubmit = (data: DefaultPhotosValuesType) => {
    const results = formatBEPostPhotos(data, akasiScore, lsrScore);
    const editedPhoto = formatBEPutPhoto(data, akasiScore, lsrScore);
    if (isUploadedImage) {
      postPhoto.mutate(
        {
          token: token,
          data: results,
        },
        {
          onSuccess: ({ data }) => {
            queryClient.setQueriesData('getPatientPhotos', (oldQueryData) => {
              setUploadedModal(true);
              if (Array.isArray(oldQueryData)) {
                const newQueryData = formatResponseData(data, image);
                return [...oldQueryData, newQueryData];
              }
              return oldQueryData;
            });
          },
          onError: (error) => {
            if (error?.message) {
              toast.error(t('Error.photo_upload'));
            }
            resetModalOnClose();
            console.error(error);
          },
          onSettled: () => {
            queryClient.invalidateQueries('getPatientPhotos');
          },
        }
      );
    } else {
      isDirty
        ? editPhoto.mutate(
            {
              token: token,
              data: editedPhoto,
            },
            {
              onSuccess: ({ data }) => {
                queryClient.setQueriesData(
                  'getPatientPhotos',
                  (oldQueryData) => {
                    setUploadedModal(true);
                    if (Array.isArray(oldQueryData)) {
                      const objIndex = oldQueryData.findIndex(
                        (obj) => obj.photoUid === data.photo.uid
                      );
                      oldQueryData[objIndex] = formatResponseData(
                        data.photo,
                        image
                      );
                      return oldQueryData;
                    }
                    return oldQueryData;
                  }
                );
              },
              onError: (error) => {
                if (error?.message) {
                  toast.error(t('Error.photo_edit'));
                  console.error(error);
                }
                resetModalOnClose();
              },
            }
          )
        : resetModalOnClose();
    }
  };

  return (
    <>
      <div className='3xl:min-w-[50rem] 3xl:w-[80rem] max-w-[98vw] md:min-w-[95vw] xl:max-w-[95vw] xl:min-w-[70rem] xl:w-[75rem] w-full text-center text-black text-base bg-dashboard overflow-hidden'>
        <header className='flex items-center justify-between px-4 py-4 font-medium bg-white border gap-36'>
          <h2 className='flex-shrink-0 text-lg'>{ModalTitle(modalTitle)}</h2>
          {sessionId && (
            <Link
              to={`${patients}/${patientUsername}/${treatments}/${sessionId}`}
              className='flex-shrink-0 text-sm font-light underline text-blue-lighter'
            >
              {t('Link_view_treatment_record')}
            </Link>
          )}
        </header>

        <main className='max-h-[76vh] 3xl:max-h-[90vh] grid-cols-[1fr,2.5fr] xl:max-h-[76vh] grid gap-4 m-4 mx-auto px-4 w-full max-w-full text-sm overflow-x-auto overflow-y-auto'>
          {/* Left Panel */}
          <div className='min-w-[13rem] flex flex-col gap-3 pb-4 w-full h-full max-h-full text-sm bg-white border border-blue-100 rounded-md shadow-sm xl:mr-auto'>
            <div className='flex flex-col justify-between'>
              <div
                onClick={() => setImageModal(true)}
                className='relative cursor-pointer'
              >
                <button className='bg-black/80 absolute right-2 top-2 flex items-center px-2 py-1.5 text-white rounded-md'>
                  <ExpandIcon className='mr-2 scale-90' /> {t('Button_Expand')}
                </button>
                {image && (
                  <img
                    width='400'
                    height='400'
                    alt='patient-images'
                    src={`data:image/png;base64,${image}`}
                    className='max-h-[350px] mx-auto w-full h-full rounded-tl-md rounded-tr-md object-contain'
                  />
                )}
              </div>

              <div className='flex flex-col justify-between gap-5 px-4 pt-2'>
                <div className='w-full pb-2 border-b-2 border-gray-100'>
                  <div className='flex gap-0.5 items-center justify-end text-black-light text-xs font-light'>
                    <img
                      alt='patient-img'
                      className='scale-95'
                      src={submissionType === 4 ? staff_upload : patient_upload}
                    />
                    <span>
                      {submissionType === 4
                        ? t('state.photo.uploaded')
                        : t('state.photo.patient_submitted')}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col gap-1.5 text-left'>
                  <h2 className='font-medium'>
                    {t('Patient_Images.Patient_comments')}
                  </h2>
                  <textarea
                    rows={8}
                    cols={30}
                    disabled
                    value={patientComments}
                    className='h-[7rem] p-2 w-full text-black-light font-light border-2 border-gray-light rounded outline-none cursor-not-allowed overflow-auto resize-none'
                  />
                </div>
                <div className='flex flex-col gap-1.5 text-left'>
                  <TextArea
                    height='7rem'
                    name='clinicalComments'
                    labelStyle='font-medium text-black'
                    placeholder={t('Add_patients.Add_comments')}
                    label={t('Add_patients.question.comments')}
                    errors={errors as Record<string, any>}
                    register={{ ...register('clinicalComments') }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className='max-h-[48rem] flex flex-col gap-6 mr-7 w-full h-full text-center rounded'>
            <div className='flex items-start w-full space-x-2 rounded xl:justify-between xl:space-x-4'>
              <div className='flex space-x-2 xl:space-x-4'>
                <div className='px-4 pb-1 bg-white containerShadow'>
                  <DatePicker
                    errors={errors as Record<string, any>}
                    control={control}
                    name='dateTaken'
                    setFocus={setFocus}
                    label={t('date_taken')}
                    maxDate={moment().toDate()}
                    rules={{ required: t('Error.required.field') }}
                    labelStyle='!text-black font-medium !mt-3 !mb-2.5 !text-xs xl:!text-sm'
                    className='w-[8.5rem] mb-2'
                  />
                </div>
                <div className='flex flex-col px-4 pb-2 bg-white containerShadow'>
                  <p className='mt-3 mb-1 text-xs font-medium text-left text-black xl:text-sm'>
                    {t('body_site')}
                  </p>
                  <Select
                    width='9em'
                    name='bodySite'
                    errors={errors as Record<string, any>}
                    control={control}
                    options={bodySite()}
                    placeholder={t('Select')}
                    containerClass='space-y-1'
                    rules={{ required: t('Error.required.field') }}
                  />
                </div>
              </div>
              <div className='flex h-full space-x-2 xl:space-x-4'>
                <ScoreDisplay
                  score={akasiScore || 0}
                  textColour='text-SmartPDTorange'
                  text={t('score.akasi.sub_score')}
                  outOf={watch('bodySite') === 1 ? '7.2' : '3.6'}
                  formatScore={akasiScore === 0 ? '0.0' : akasiScore.toFixed(1)}
                />
                <ScoreDisplay
                  outOf='24'
                  text={t('score.lsr')}
                  score={lsrScore || 0}
                  formatScore={lsrScore || 0}
                  textColour='text-blue-lighter'
                />
              </div>
            </div>
            <div className='flex flex-col justify-between w-full h-full max-h-full overflow-hidden border rounded containerShadow border-gray-light'>
              <div className='flex w-full gap-4 pl-4 bg-white border-b border-gray-light'>
                <button
                  className={`px-4 py-3 text-center hover:text-black text-black-light text-base font-medium border-b-4 transition-all duration-200 ease-in xl:text-left ${
                    selectedTab === 'AKASI' &&
                    'border-b-4  border-orange text-black'
                  }`}
                  onClick={() => setSelectedTab('AKASI')}
                >
                  AKASI
                </button>
                <button
                  className={`px-4 py-3 text-center hover:text-black text-black-light text-base font-medium border-b-4 transition-all duration-200 ease-in xl:text-left ${
                    selectedTab === 'LSR' &&
                    'border-b-4  border-blue-lighter text-black'
                  }`}
                  onClick={() => setSelectedTab('LSR')}
                >
                  LSR
                </button>
              </div>
              <div className='max-h-full overflow-y-auto scrollBar bg-dashboard'>
                {selectedTab === 'AKASI' && (
                  <div className='flex flex-col h-full'>
                    <div className='flex w-full px-2'>
                      <ScoreToggleRadio
                        name='akasiAreaExtent'
                        options={areaExtent()}
                        control={control}
                        onChange={calculateAkasiScore}
                        label={t('option.area_extent')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        borderColour='border-SmartPDTorange'
                        bgColour='bg-[#FFA324]'
                        customFirstIcon={
                          isUnaffected ? (
                            <img
                              src={unaffectedIcon}
                              alt='unaffected'
                              className='h-5'
                            />
                          ) : (
                            <div className='relative'>
                              <img
                                src={unaffectedIcon2}
                                alt='unaffected'
                                className='h-6'
                              />
                              <span className='inset-[-2.5px] absolute text-black-lighter text-xl font-bold'>
                                -
                              </span>
                            </div>
                          )
                        }
                      />
                      <ScoreToggleRadio
                        name='akasiDistribution'
                        options={akDistribution()}
                        control={control}
                        onChange={calculateAkasiScore}
                        label={t('option.ak_distribution')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        disabled={isUnaffected}
                        borderColour='border-SmartPDTorange'
                        bgColour='bg-[#FFA324]'
                      />
                      <ScoreToggleRadio
                        name='akasiErythema'
                        options={erythema()}
                        control={control}
                        onChange={calculateAkasiScore}
                        label={t('erythema')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        disabled={isUnaffected}
                        borderColour='border-SmartPDTorange'
                        bgColour='bg-[#FFA324]'
                      />
                      <ScoreToggleRadio
                        name='akasiThickness'
                        options={thickness()}
                        control={control}
                        onChange={calculateAkasiScore}
                        label={t('option.thickness')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        disabled={isUnaffected}
                        borderColour='border-SmartPDTorange'
                        bgColour='bg-[#FFA324]'
                      />
                    </div>
                  </div>
                )}
                {selectedTab === 'LSR' && (
                  <div className='flex flex-col h-full'>
                    <div className='flex w-full px-2'>
                      <ScoreToggleRadio
                        name='lsrErythema'
                        options={lsrErythema()}
                        control={control}
                        onChange={calculateLsrScore}
                        label={t('erythema')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        borderColour='border-blue-lighter'
                        bgColour='bg-[#7DB5E5]'
                      />
                      <ScoreToggleRadio
                        name='lsrScaling'
                        options={flaking()}
                        control={control}
                        onChange={calculateLsrScore}
                        label={t('option.flaking_scaling')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        borderColour='border-blue-lighter'
                        bgColour='bg-[#7DB5E5]'
                      />
                      <ScoreToggleRadio
                        name='lsrCrusting'
                        options={crusting()}
                        onChange={calculateLsrScore}
                        control={control}
                        label={t('option.crusting')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        borderColour='border-blue-lighter'
                        bgColour='bg-[#7DB5E5]'
                      />
                    </div>
                    <div className='flex w-full px-2'>
                      <ScoreToggleRadio
                        name='lsrSwelling'
                        options={swelling()}
                        onChange={calculateLsrScore}
                        control={control}
                        label={t('option.swelling')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        borderColour='border-blue-lighter'
                        bgColour='bg-[#7DB5E5]'
                      />
                      <ScoreToggleRadio
                        name='lsrVesiculation'
                        options={vesiculation()}
                        control={control}
                        onChange={calculateLsrScore}
                        label={t('option.vesiculation')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        borderColour='border-blue-lighter'
                        bgColour='bg-[#7DB5E5]'
                      />
                      <ScoreToggleRadio
                        name='lsrErosion'
                        options={erosion()}
                        control={control}
                        onChange={calculateLsrScore}
                        label={t('option.erosion')}
                        errors={errors as Record<string, any>}
                        width='w-full'
                        borderColour='border-blue-lighter'
                        bgColour='bg-[#7DB5E5]'
                      />
                    </div>
                  </div>
                )}
              </div>
              <footer className='w-full py-2 pr-4 bg-white border-t border-gray-light'>
                {selectedTab === 'AKASI' && (
                  <p className='font-bold text-right'>
                    {t('score.akasi.sub_score')}{' '}
                    <span className='text-xl text-SmartPDTorange'>
                      {(akasiScore || 0).toFixed(1)}
                    </span>
                    <span className='font-normal text-black-light'>
                      /{watch('bodySite') === 1 ? '7.2' : '3.6'}
                    </span>
                  </p>
                )}
                {selectedTab === 'LSR' && (
                  <p className='font-bold text-right'>
                    {t('option.lsr_total')}{' '}
                    <span className='text-xl text-blue-lighter'>
                      {lsrScore}
                    </span>
                    <span className='font-normal text-black-light'>/24</span>
                  </p>
                )}
              </footer>
            </div>
          </div>
        </main>

        <footer className='flex justify-between px-4 py-3 bg-white border'>
          <DiscardButton
            onClick={() => {
              if (isUploadedImage) {
                setDiscardModal(true);
              } else {
                resetModalOnClose();
              }
            }}
            alt={t('Button_Back')}
            text={isUploadedImage ? t('Button_discard') : t('Button_Back')}
          />

          {postPhoto.isLoading && <ClipLoader color='#1e477f' size={0.8} />}

          <TickButton
            alt={t('Button_save_image')}
            className='px-5'
            onClick={handleSubmit(onSubmit)}
            text={
              isUploadedImage
                ? t('Button_save_image')
                : t('Button_save_changes')
            }
          />
        </footer>
      </div>
      <Modal
        marginTop='auto'
        overflow='visible'
        closeOnEsc={true}
        closeMaskOnClick={true}
        isVisible={imageModal}
        setVisible={setImageModal}
        modalContent={
          <ImageModal
            t={t}
            setImageModal={setImageModal}
            image={selectedImageData.image}
          />
        }
      />
      <Modal
        closeOnEsc={false}
        closeMaskOnClick={false}
        isVisible={discardModal}
        setVisible={setDiscardModal}
        modalContent={
          <DiscardModal
            t={t}
            setDiscardModal={setDiscardModal}
            resetModalOnClose={resetModalOnClose}
          />
        }
      />
      <Modal
        closeOnEsc={false}
        closeMaskOnClick={false}
        isVisible={uploadedModal}
        setVisible={setUploadedModal}
        modalContent={
          <UploadedModal
            t={t}
            uploadedModal={uploadedModal}
            resetModalOnClose={resetModalOnClose}
          />
        }
      />
    </>
  );
}
