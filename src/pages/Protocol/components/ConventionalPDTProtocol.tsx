import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import { useRef, useState, useEffect } from 'react';
// import { useQueryClient } from 'react-query';
import {
  useHistory,
  // useLocation
} from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { Success } from 'components/Flags/Flags';
import { ClipLoader } from 'components/Loader';
import {
  DiscardButton,
  // TickButton
} from 'components/Forms/Buttons';
// import { useProtocolData, useUpdateProtocol } from '../api/query';
import { conventionalDPDTDefaultValues } from '../api/format';
import { conventionalDPDTDefaultValuesType } from '../api/api';
import ConventionalPDTFormFields from './FormFields/ConventionalPDTForm';
import { conventionalLamps } from 'utils/options';
import Modal from 'components/Modals/Modal';
import { conventionalKeyLampType, pdtLampImages } from '../makeData';

export default function ConventionalPDTProtocol() {
  //   const queryClient = useQueryClient();
  const history = useHistory();
  const [errMsg] = useState('');
  // const { pathname } = useLocation();
  const { t } = AppProvider.useContainer();
  //   const updateProtocol = useUpdateProtocol();
  const containerRef = useRef<HTMLDivElement>(null);
  //   const protocolData = useProtocolData(cookies.user.token);
  // const isNewProtocol = pathname.includes('new');
  const [selectedLamp, setSelectedLamp] = useState({
    value: 0,
    label: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: conventionalDPDTDefaultValues,
  });

  useTitle('Conventional DPDT Protocol');

  useEffect(() => {
    if (history.location.state) {
      reset(history.location.state as conventionalDPDTDefaultValuesType);
    }
  }, [t, reset, history.location.state]);

  const onSubmit: SubmitHandler<conventionalDPDTDefaultValuesType> = (data) => {
    console.info(data);
    //   updateProtocol.mutate(
    //     { token: cookies.user.token, data: formatProtocolPostData(data) },
    //     {
    //       onSuccess: ({ status }) => {
    //         if (status === 200) {
    //           queryClient.invalidateQueries('protocolData');
    //         }
    //       },
    //       onError: (response) => {
    //         console.error(response);
    //         setErrMsg(t('Error.updating.protocol'));
    //       },
    //     }
    //   );
  };

  return (
    <div className='childrenContainer' ref={containerRef}>
      <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <div className='p-4 grid xl:grid-cols-2'>
          <div className='container max-w-lg mx-auto text-sm 2xl:max-w-xl lg:ml-0'>
            <ConventionalPDTFormFields
              t={t}
              errors={errors}
              register={register}
              control={control}
              isDataLoading={false}
              isDisabled={true}
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
                {/* 
                <div className='btn-with-flag'>
                  <Success
                    duration={0}
                    value={t('Success.protocol.saved')}
                    state={false}
                  />

                  <TickButton
                    className='px-5'
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
                </div> */}
              </div>
            </ConventionalPDTFormFields>
          </div>
          <div className='container mx-auto text-sm'>
            <div className='p-4 mb-16 text-black bg-white containerShadow'>
              <h1 className='pb-4 text-base font-medium border-b border-gray-200 2xl:text-lg'>
                Know more about lamps
              </h1>
              <ul>
                {conventionalLamps().map((lamp) => (
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
                          pdtLampImages.conventional[
                            selectedLamp?.value as conventionalKeyLampType
                          ].lampImage
                        }
                      />
                    </div>
                    <div className='w-full'>
                      <img
                        alt='lamp specs'
                        src={
                          pdtLampImages.conventional[
                            selectedLamp?.value as conventionalKeyLampType
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
                      pdtLampImages.conventional[
                        selectedLamp?.value as conventionalKeyLampType
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
