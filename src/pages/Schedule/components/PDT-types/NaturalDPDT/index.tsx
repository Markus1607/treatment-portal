import { isNumber } from 'lodash';
import toast from 'react-hot-toast';
import { AppProvider } from 'AppProvider';
import { useForm } from 'react-hook-form';
import {
  useCalendarData,
  useGetCalendarData,
  usePreviousCalendarData,
} from '../../../api/query';
import type { AxiosError, AxiosResponse } from 'axios';
import {
  formatGetCalendar,
  initialCalendarData,
  defaultNaturalDPDTValues,
} from '../../../api/format';
import type { defaultNaturalDPDTValuesType } from 'pages/Schedule/api/types/format';
import {
  NaturalDPDTCalendar,
  NaturalSessionFields,
  NaturalProtocolFields,
} from './NaturalPDTIndexComponents';
import {
  useEffect,
  useState,
  useMemo,
  Dispatch,
  useCallback,
  SetStateAction,
} from 'react';
import {
  NatPDTListType,
  NatPDTOptionType,
  setNatPDTProtocolDetails,
} from '../utils';
import type { CalendarData } from 'pages/Schedule/api/types/calendar';
import { useProtocolDetailsData } from '~/pages/Protocol/api/query';
import { ProtocolTypeEnums } from '~/pages/Protocol/api/api.d';
import {
  FormatGetTreatmentType,
  FormattedNatPDTSessionsType,
} from '~/pages/Patients/components/PatientSchedule/api/query';
import { DiseasesTypeOptions } from '~/utils/options.d';

type NaturalDPDTPropTypes = {
  patientUid: string;
  savedDataLoading?: boolean;
  selectedDiseaseType: DiseasesTypeOptions;
  bookedEvent?: FormatGetTreatmentType['eventData'] | null;
  naturalPDTList: NatPDTListType;
  setBookedEvent: Dispatch<
    SetStateAction<null | FormatGetTreatmentType['eventData']>
  >;
  savedData?: FormattedNatPDTSessionsType;
};

export function useNaturalDPDT({
  savedData,
  patientUid,
  bookedEvent,
  naturalPDTList,
  setBookedEvent,
  savedDataLoading,
  selectedDiseaseType,
}: NaturalDPDTPropTypes) {
  const getCalendarData = useCalendarData();
  const getPrevCalendarData = usePreviousCalendarData();
  const [calendarMonth, setCalendarMonth] = useState(0);
  const [overlayActive, setOverlayActive] = useState(false);
  const [isLoadingCalendar, setLoadingCalendar] = useState(false);
  const [searchAddressError, setSearchAddressError] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<
    NatPDTOptionType | undefined
  >(() => {
    const defaultProtocol = naturalPDTList.find(
      (protocol) => protocol.isDefault === true
    );
    return defaultProtocol || naturalPDTList[0];
  });
  const {
    t,
    sunscreenList,
    currentPatientUid,
    cookies: {
      user: { token },
    },
  } = AppProvider.useContainer();
  const [calendarData, setCalendarData] =
    useState<CalendarData>(initialCalendarData);

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<defaultNaturalDPDTValuesType>({
    mode: 'onChange',
    defaultValues: defaultNaturalDPDTValues,
  });

  const isDataValid =
    isValid && watch('expectedLocation.lat') && !searchAddressError.length
      ? true
      : false;

  const cachedData = useMemo(() => {
    if (calendarMonth === 0) {
      return calendarData || initialCalendarData;
    }
    return initialCalendarData;
  }, [calendarData, calendarMonth]);

  const updatedCalendarData = formatGetCalendar({
    ...getValues(),
    expectedLocation: {
      ...getValues().expectedLocation,
      lat: watch('expectedLocation.lat'),
      lng: watch('expectedLocation.lng'),
      source: watch('expectedLocation.source'),
      address: watch('expectedLocation.address'),
    },
    month: calendarMonth,
    patientID: watch('patientID'),
    sunscreenTypeUid: watch('sunscreenTypeUid'),
  });

  const { isLoading: isLoadingCalendarResponse, data: calendarResponse } =
    useGetCalendarData(
      token,
      currentPatientUid,
      updatedCalendarData,
      calendarMonth,
      isDataValid,
      cachedData
    );

  //* Updates the patient ID if it changes
  useEffect(() => {
    if (currentPatientUid) setValue('patientID', currentPatientUid);
  }, [currentPatientUid, setValue]);

  // //* Change the selected protocol based on the saved data
  useEffect(() => {
    if (!naturalPDTList.length) return;
    if (savedData?.protocolSelected) {
      setSelectedProtocol(
        naturalPDTList.find(
          (protocol) => protocol.id === savedData.protocolSelected
        )
      );
    } else {
      const defaultProtocol =
        naturalPDTList.find((protocol) => protocol.isDefault === true) ||
        naturalPDTList[0];
      if (defaultProtocol) {
        setSelectedProtocol(defaultProtocol);
      }
    }
  }, [naturalPDTList, savedData?.protocolSelected]);

  const { isLoading: isLoadingProtocolDetails, data: protocolDetails } =
    useProtocolDetailsData(token, selectedProtocol?.id || '');

  const selectedProtocolDetails =
    protocolDetails &&
    !isLoadingProtocolDetails &&
    !('error' in protocolDetails) &&
    protocolDetails.treatment_type === ProtocolTypeEnums.NATDYPDT &&
    setNatPDTProtocolDetails(protocolDetails);

  /**
   * * Fills forms with institution's default protocol settings when no booked session is present
   */
  useEffect(() => {
    if (savedData?.protocolDetails) {
      reset({
        ...getValues(),
        ...savedData,
        diseaseTypeUid: savedData.diseaseTypeUid,
      });
    } else {
      const details = {
        ...getValues(),
        ...selectedProtocolDetails,
        patientID: currentPatientUid,
        diseaseTypeUid: selectedDiseaseType,
        protocolSelected: selectedProtocol?.id,
      };
      reset(details);
    }
  }, [
    currentPatientUid,
    selectedDiseaseType,
    selectedProtocol?.id,
    savedData?.protocolDetails,
    selectedProtocolDetails && selectedProtocolDetails?.prodrug,
  ]);

  //* Resets the form every time new calendar data is fetched
  useEffect(() => {
    if (!isDirty && isLoadingCalendarResponse) return;
    if (isNumber(watch('expectedLocation.lat')) && !isLoadingCalendarResponse) {
      reset({ ...getValues() });
    }
  }, [reset, getValues, isLoadingCalendarResponse]); //eslint-disable-line

  //* This is to control the overlay when the calendar is loading
  useEffect(() => {
    if (!isDataValid || isDirty) {
      setOverlayActive(true);
      setLoadingCalendar(false);
    }

    if (isDataValid && isLoadingCalendarResponse) {
      setLoadingCalendar(true);
    }

    if (calendarResponse?.error && !isLoadingCalendarResponse) {
      setOverlayActive(true);
      setLoadingCalendar(false);
      if (!overlayActive) {
        toast.error(t('Error.server_down_error'));
      }
    }

    if (
      isDataValid &&
      isNumber(calendarMonth) &&
      !calendarResponse?.error &&
      !isLoadingCalendarResponse &&
      !searchAddressError
    ) {
      setOverlayActive(false);
      setLoadingCalendar(false);
      calendarResponse && setCalendarData(calendarResponse);
    }
  }, [
    t,
    isDirty,
    isDataValid,
    overlayActive,
    calendarMonth,
    calendarResponse,
    searchAddressError,
    isLoadingCalendarResponse,
  ]);

  /**
   * * Request calendar data on update button click
   */
  const onSubmit = (data: defaultNaturalDPDTValuesType) => {
    reset(data);
    setOverlayActive(true);
    setLoadingCalendar(true);
    const isValidData =
      isNumber(data?.expectedLocation.lat) &&
      isNumber(data?.expectedLocation?.lng);
    const currentMonth = calendarMonth === 1 ? 1 : calendarMonth;
    const getCalendarFunction =
      calendarMonth === 1 ? getPrevCalendarData : getCalendarData;

    isValidData &&
      getCalendarFunction.mutate(
        {
          token,
          data: formatGetCalendar({
            ...data,
            month: currentMonth,
          }),
          patientUid: currentPatientUid,
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        {
          onSuccess: (response: AxiosResponse) => {
            setOverlayActive(false);
            setLoadingCalendar(false);
            setCalendarData(
              calendarMonth === 1 ? response : response.data.calendar
            );
          },

          onError: (err: AxiosError) => {
            setLoadingCalendar(false);
            const errorCode = err?.response?.data?.code;
            const errorMessage =
              errorCode === 1003
                ? t('Error.patient.id.not.exist')
                : t('Error.server_down_error');
            toast.error(errorMessage);
            console.error(err?.response?.data?.error);
          },
        }
      );
  };

  const refreshCalendarOnSessionDelete = () => {
    setBookedEvent(null);
  };

  const handleProtocolSelect = useCallback((option: NatPDTOptionType) => {
    setSelectedProtocol(option);
  }, []);

  return {
    NaturalSessionFields: (
      <NaturalSessionFields
        t={t}
        watch={watch}
        errors={errors}
        control={control}
        setValue={setValue}
        getValues={getValues}
        bookedEvent={bookedEvent}
        sunscreenList={sunscreenList}
        naturalPDTList={naturalPDTList}
        searchAddressError={searchAddressError}
        handleProtocolSelect={handleProtocolSelect}
        setSearchAddressError={setSearchAddressError}
      />
    ),
    NaturalProtocolFields: (
      <NaturalProtocolFields
        t={t}
        watch={watch}
        errors={errors}
        control={control}
        isLoading={false}
        savedDataLoading={savedDataLoading}
      />
    ),
    NaturalDPDTCalendar: (
      <NaturalDPDTCalendar
        t={t}
        onSubmit={onSubmit}
        getValues={getValues}
        savedData={savedData}
        patientUid={patientUid}
        bookedEvent={bookedEvent}
        isDataValid={isDataValid}
        handleSubmit={handleSubmit}
        calendarData={calendarData}
        overlayActive={overlayActive}
        setCalendarMonth={setCalendarMonth}
        isLoadingCalendar={isLoadingCalendar}
        isLoadingCalendarResponse={isLoadingCalendarResponse}
        refreshCalendarOnSessionDelete={refreshCalendarOnSessionDelete}
      />
    ),
  };
}
