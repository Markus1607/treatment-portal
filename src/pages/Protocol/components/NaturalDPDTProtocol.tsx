import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Success } from 'components/Flags/Flags';
import { ClipLoader } from 'components/Loader';
import { useRef, useState, useEffect } from 'react';
import { DiscardButton, TickButton } from 'components/Forms/Buttons';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  ProtocolTypeEnums,
  type naturalDPDTDefaultValuesType,
} from '../api/api.d';
import {
  naturalDPDTDefaultValues,
  formatBENaturalDPDTProtocol,
  formatNaturalPDTProtocolDetails,
} from '../api/format';
import NaturalPDTFormFields from './FormFields/NaturalPDTForm';
import {
  useAddProtocol,
  useUpdateProtocol,
  useProtocolDetailsData,
} from '../api/query';
import { omit } from 'lodash';
import { naturalDPDT } from '~/routes';

export type NaturalPDTProtocolType = {
  selectedDiseaseTypeUid: string;
};

export default function NaturalDPDTProtocol({
  selectedDiseaseTypeUid,
}: NaturalPDTProtocolType) {
  const history = useHistory();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const [errMsg, setErrMsg] = useState('');
  const addNewProtocol = useAddProtocol();
  const updateProtocol = useUpdateProtocol();
  const isNewProtocol = pathname.includes('new');
  const isEditProtocolPage = !isNewProtocol;
  const { id: protocolUid } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    t,
    sunscreenList,
    cookies: { user },
  } = AppProvider.useContainer();
  const [isPredefinedProtocol, setIsPredefinedProtocol] = useState(false);
  const { isLoading, data } = useProtocolDetailsData(user.token, protocolUid);
  const [selectedDiseaseUid, setSelectedDiseaseUid] = useState<string>(
    selectedDiseaseTypeUid
  );

  const {
    reset,
    watch,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<naturalDPDTDefaultValuesType>({
    defaultValues: naturalDPDTDefaultValues,
  });

  useTitle(t('natural-dpdt-protocol'));

  useEffect(() => {
    if (
      data &&
      !isLoading &&
      !('error' in data) &&
      data.treatment_type === ProtocolTypeEnums.NATDYPDT
    ) {
      const protocol = formatNaturalPDTProtocolDetails(data);
      protocol.isPredefinedProtocol && setIsPredefinedProtocol(true);
      reset(protocol);
    }
  }, [t, isLoading, data]);

  useEffect(() => {
    setValue('diseaseTypeUid', selectedDiseaseUid);
  }, [selectedDiseaseUid]);

  const onSubmit: SubmitHandler<naturalDPDTDefaultValuesType> = (data) => {
    if (isNewProtocol) {
      addNewProtocol.mutate(
        {
          token: user.token,
          data: formatBENaturalDPDTProtocol(data),
          type: ProtocolTypeEnums.NATDYPDT,
        },
        {
          onSuccess: ({ status, data: results }) => {
            if (status === 200) {
              toast.success(t('Protocol-added-successfully'));
              queryClient.invalidateQueries('allProtocolData');
              history.push(
                `${naturalDPDT}/${results?.protocol?.disease?.name}`
              );
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
          data: omit(formatBENaturalDPDTProtocol(data), ['disease_uid']),
          protocolId: data.id,
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
        <div className='grid p-4 xl:grid-cols-2'>
          <div className='container max-w-lg mx-auto text-sm 2xl:max-w-xl lg:ml-0'>
            <NaturalPDTFormFields
              t={t}
              watch={watch}
              errors={errors}
              control={control}
              register={register}
              isDataLoading={false}
              sunscreenList={sunscreenList}
              isEditProtocolPage={isEditProtocolPage}
              selectedDiseaseUid={selectedDiseaseUid}
              isDisabled={isPredefinedProtocol === true}
              setSelectedDiseaseUid={setSelectedDiseaseUid}
            >
              <div className='flex items-center justify-between'>
                <DiscardButton
                  text={t('Button_back')}
                  alt={t('Button_back')}
                  onClick={() => history.goBack()}
                />

                {!errMsg && updateProtocol.isLoading && (
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
                    value={
                      addNewProtocol.isSuccess
                        ? t('Success.protocol.added')
                        : t('Success.protocol.saved')
                    }
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
            </NaturalPDTFormFields>
          </div>
        </div>
      </form>
    </div>
  );
}
