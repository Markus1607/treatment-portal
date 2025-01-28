import { useTitle } from 'utils/hooks';
import { toast } from 'react-hot-toast';
import { AppProvider } from 'AppProvider';
import { useRef, useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { ClipLoader } from 'components/Loader';
import { Success } from 'components/Flags/Flags';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  ProtocolTypeEnums,
  artificialDPDTDefaultValuesType,
} from '../api/api.d';
import { DiscardButton, TickButton } from 'components/Forms/Buttons';
import {
  useAddProtocol,
  useUpdateProtocol,
  useProtocolDetailsData,
} from '../api/query';
import {
  artificialDPDTDefaultValues,
  formatArtificialPDTProtocolDetails,
  formatBEArtificialDPDTProtocol,
} from '../api/format';
import Modal from 'components/Modals/Modal';
import { artificialLamps } from 'utils/options';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import ArtificialPDTFormFields from './FormFields/ArtificalPDTForm';
import { artificialKeyLampType, pdtLampImages } from '../makeData';

export default function ArtificialDPDTProtocol() {
  const history = useHistory();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const addNewProtocol = useAddProtocol();
  const updateProtocol = useUpdateProtocol();
  const [errMsg, setErrMsg] = useState('');
  const isNewProtocol = pathname.includes('new');
  const containerRef = useRef<HTMLDivElement>(null);
  const { id: protocolUid } = useParams<{ id: string }>();
  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLamp, setSelectedLamp] = useState({
    value: '',
    label: '',
  });
  const [isPredefinedProtocol, setIsPredefinedProtocol] = useState(false);
  const { isLoading, data } = useProtocolDetailsData(user.token, protocolUid);

  const {
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: artificialDPDTDefaultValues,
  });

  useTitle('Artificial DPDT Protocol');

  useEffect(() => {
    if (
      data &&
      !isLoading &&
      !('error' in data) &&
      data.treatment_type === ProtocolTypeEnums.ARTFLPDT
    ) {
      const protocol = formatArtificialPDTProtocolDetails(data, t);
      protocol.isPredefinedProtocol && setIsPredefinedProtocol(true);
      reset(protocol);
    }
  }, [t, isLoading, data]);

  const onSubmit: SubmitHandler<artificialDPDTDefaultValuesType> = (data) => {
    if (isNewProtocol) {
      addNewProtocol.mutate(
        {
          token: user.token,
          data: formatBEArtificialDPDTProtocol(data),
          type: ProtocolTypeEnums.ARTFLPDT,
        },
        {
          onSuccess: ({ status }) => {
            if (status === 200) {
              queryClient.invalidateQueries('allProtocolData');
              toast.success(t('Protocol-added-successfully'));
            }
          },
          onError: (response) => {
            console.error(response);
            toast.error(t('Error-occured-while-adding-protocol'));
          },
        }
      );
    } else {
      updateProtocol.mutate(
        {
          token: user.token,
          protocolId: data.id,
          data: formatBEArtificialDPDTProtocol(data),
        },
        {
          onSuccess: ({ status }) => {
            if (status === 200) {
              queryClient.invalidateQueries('allProtocolData');
            }
          },
          onError: (response) => {
            console.error(response);
            setErrMsg(t('Error.updating.protocol'));
            toast.error(t('Error.updating.protocol'));
          },
        }
      );
    }
  };

  return (
    <div className='childrenContainer' ref={containerRef}>
      <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <div className='p-4 grid xl:grid-cols-2'>
          <div className='container max-w-lg mx-auto text-sm 2xl:max-w-xl lg:ml-0'>
            <ArtificialPDTFormFields
              t={t}
              watch={watch}
              errors={errors}
              register={register}
              control={control}
              isDataLoading={false}
              isDisabled={isPredefinedProtocol === true}
            >
              <div className='flex items-center justify-between'>
                <DiscardButton
                  text={t('Button_back')}
                  alt={t('Button_back')}
                  onClick={() => history.goBack()}
                />

                {!errMsg && false && (
                  <div className='mr-[8rem]'>
                    <ClipLoader color='#1e477f' size={0.8} />
                  </div>
                )}

                {errMsg && (
                  <p className='mx-4 text-sm errorMessage'>{errMsg}</p>
                )}

                <div className='btn-with-flag'>
                  <Success
                    duration={0}
                    value={t('Success.protocol.saved')}
                    state={updateProtocol.isSuccess || addNewProtocol.isSuccess}
                  />

                  <TickButton
                    className={`${
                      isPredefinedProtocol ? 'hidden' : 'block'
                    } px-5`}
                    text={
                      isNewProtocol
                        ? t('add_protocol')
                        : t('Protocol.button_text2')
                    }
                    alt={
                      isNewProtocol
                        ? t('add_protocol')
                        : t('Protocol.button_text2')
                    }
                  />
                </div>
              </div>
            </ArtificialPDTFormFields>
          </div>
          <div className='container mx-auto text-sm'>
            <div className='p-4 mb-16 text-black bg-white containerShadow'>
              <h1 className='pb-4 text-base font-medium border-b border-gray-200 2xl:text-lg'>
                Know more about lamps
              </h1>
              <ul>
                {artificialLamps().map((lamp) => (
                  <li
                    key={lamp.value}
                    onClick={() => {
                      setSelectedLamp(lamp);
                      setIsModalVisible(true);
                    }}
                    className='flex items-center justify-between w-full py-4 pr-4 border-b border-gray-200 cursor-pointer hover:bg-dashboard'
                  >
                    <div className='flex items-center gap-4'>
                      <span className='w-2 h-2 rounded-full bg-blue-dark' />
                      <span>{lamp.label}</span>
                    </div>
                    <button
                      type='button'
                      className='self-end text-blue-300 cursor-pointer'
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
      <Modal
        overflow='visible'
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        modalContent={
          <div className='3xl:min-w-[100rem] 3xl:w-[100rem] z-[104] max-h-[100vh] md:min-w-[95vw] xl:min-w-[85rem] xl:w-[85rem] h-full bg-dashboard overflow-hidden overflow-y-scroll lg:w-full'>
            <header className='flex justify-between px-4 py-4 font-medium bg-white border gap-36'>
              <h2 className='hidden text-sm text-left 2xl:text-xl md:block lg:flex-shrink-0 xl:text-lg'>
                {selectedLamp.label}
              </h2>
              <DiscardButton
                alt={t('Button_Close')}
                text={t('Button_Close')}
                onClick={() => setIsModalVisible(false)}
              />
            </header>
            <main className='relative flex flex-col w-full h-full max-h-full p-4 mx-auto overflow-x-auto overflow-y-auto gap-2 3xl:max-h-full md:flex-row lg:gap-5 xl:max-w-full'>
              <div className='min-w-[25rem] lg:w-[40rem] flex flex-col gap-4 w-full h-full'>
                {selectedLamp?.value && (
                  <>
                    <div className='w-full'>
                      <img
                        alt='lamp'
                        src={
                          pdtLampImages.artificial[
                            selectedLamp?.value as artificialKeyLampType
                          ].lampImage
                        }
                      />
                    </div>
                    <div className='w-full'>
                      <img
                        alt='lamp specs'
                        src={
                          pdtLampImages.artificial[
                            selectedLamp?.value as artificialKeyLampType
                          ].lampSpecs
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <div className='flex flex-col flex-grow gap-4'>
                {selectedLamp?.value && (
                  <img
                    alt=''
                    src={
                      pdtLampImages.artificial[
                        selectedLamp?.value as artificialKeyLampType
                      ].lampTable
                    }
                  />
                )}
              </div>
            </main>
          </div>
        }
      />
    </div>
  );
}
