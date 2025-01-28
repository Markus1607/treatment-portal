import type {
  Control,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { SunscreenList } from '@types';
import { TFunction } from 'react-i18next';
import { SessionTypeEnums } from 'utils/options.d';
import type { Dispatch, SetStateAction } from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';
import InfoIcon from 'assets/images/ic_small_info.svg';
import NaturalPDTSessionFields from './NaturalPDTSessionFields';
import NaturalPDTProtocolFields from './NaturalPDTProtocolFields';
import NaturalPDTCalendar from '../../Calendar/NaturalPDTCalendar';
import type { CalendarData } from 'pages/Schedule/api/types/calendar';
import { ReactComponent as LoaderIcon } from 'assets/images/ic_loader.svg';
import { NatPDTListType, NatPDTOptionType } from '../utils';
import type { defaultNaturalDPDTValuesType } from 'pages/Schedule/api/types/format';
import {
  FormatGetTreatmentType,
  FormattedNatPDTSessionsType,
} from '~/pages/Patients/components/PatientSchedule/api/query';

//* ================================ SESSION DETAILS UI ============================

type NaturalSessionFieldsProps = {
  searchAddressError: string;
  sunscreenList: SunscreenList;
  naturalPDTList: NatPDTListType;
  t: TFunction<'translation', undefined>;
  watch: UseFormWatch<defaultNaturalDPDTValuesType>;
  errors: FieldErrors<defaultNaturalDPDTValuesType>;
  control: Control<defaultNaturalDPDTValuesType, any>;
  setValue: UseFormSetValue<defaultNaturalDPDTValuesType>;
  handleProtocolSelect: (option: NatPDTOptionType) => void;
  getValues: UseFormGetValues<defaultNaturalDPDTValuesType>;
  setSearchAddressError: Dispatch<SetStateAction<string>>;
  bookedEvent: FormatGetTreatmentType['eventData'] | null | undefined;
};

export const NaturalSessionFields = ({
  t,
  watch,
  errors,
  control,
  setValue,
  getValues,
  sunscreenList,
  naturalPDTList,
  searchAddressError,
  handleProtocolSelect,
  setSearchAddressError,
}: NaturalSessionFieldsProps) => (
  <NaturalPDTSessionFields
    t={t}
    watch={watch}
    errors={errors}
    control={control}
    setValue={setValue}
    getValues={getValues}
    sunscreenList={sunscreenList}
    naturalPDTList={naturalPDTList}
    searchAddressError={searchAddressError}
    handleProtocolSelect={handleProtocolSelect}
    setSearchAddressError={setSearchAddressError}
  />
);

//* ================================ PROTOCOL UI =====================================

type NaturalProtocolFieldsProps = {
  isLoading: boolean;
  savedDataLoading?: boolean;
  t: TFunction<'translation', undefined>;
  watch: UseFormWatch<defaultNaturalDPDTValuesType>;
  errors: FieldErrors<defaultNaturalDPDTValuesType>;
  control: Control<defaultNaturalDPDTValuesType, any>;
};

export const NaturalProtocolFields = ({
  t,
  watch,
  errors,
  control,
  isLoading,
  savedDataLoading,
}: NaturalProtocolFieldsProps) => (
  <NaturalPDTProtocolFields
    t={t}
    watch={watch}
    errors={errors}
    control={control}
    isDataLoading={isLoading || savedDataLoading}
    isPortalOnlySession={
      watch('sessionType') === SessionTypeEnums.FullyAssisted
    }
  />
);

//* ================================ CALENDAR UI =========================================

type NaturalDPDTCalendarProps = {
  patientUid: string;
  isDataValid: boolean;
  overlayActive: boolean;
  isLoadingCalendar: boolean;
  calendarData: CalendarData;
  isLoadingCalendarResponse: boolean;
  t: TFunction<'translation', undefined>;
  refreshCalendarOnSessionDelete: () => void;
  savedData?: FormattedNatPDTSessionsType;
  setCalendarMonth: Dispatch<SetStateAction<number>>;
  onSubmit: (data: defaultNaturalDPDTValuesType) => void;
  getValues: UseFormGetValues<defaultNaturalDPDTValuesType>;
  handleSubmit: UseFormHandleSubmit<defaultNaturalDPDTValuesType>;
  bookedEvent: FormatGetTreatmentType['eventData'] | null | undefined;
};

export const NaturalDPDTCalendar = ({
  t,
  onSubmit,
  getValues,
  savedData,
  patientUid,
  bookedEvent,
  isDataValid,
  handleSubmit,
  calendarData,
  overlayActive,
  setCalendarMonth,
  isLoadingCalendar,
  isLoadingCalendarResponse,
  refreshCalendarOnSessionDelete,
}: NaturalDPDTCalendarProps) => {
  return (
    <>
      <div
        style={{
          display: overlayActive ? 'flex' : 'none',
        }}
        className='absolute z-50 flex flex-col items-center w-full font-medium text-center text-white transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'
      >
        {!isLoadingCalendar && (
          <p className='text-[0.9rem] mb-5 w-full font-normal'>
            {isDataValid
              ? t('Update.calendar_to_see_slots')
              : t('Provide_all_fields')}
          </p>
        )}
        <button
          type='button'
          disabled={isLoadingCalendar}
          onClick={handleSubmit(onSubmit)}
          className={`flex gap-2 items-center justify-center px-10 py-3.5 text-center bg-SmartPDTorange rounded-md  active:scale-95 ${
            isLoadingCalendar ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <LoaderIcon
            className={`${
              isLoadingCalendar ? 'animate-spin w-24' : 'scale-95'
            }`}
          />
          <span className={`${isLoadingCalendar ? 'hidden' : 'visible'}`}>
            {t('Update.calendar')}
          </span>
        </button>
      </div>
      <LoadingOverlay
        active={overlayActive}
        styles={{
          content: (base) => ({
            ...base,
          }),
          wrapper: (base) => ({
            ...base,
          }),
          spinner: () => null,
          overlay: (state) => ({
            ...state,
            zIndex: 40,
            opacity: 0.8,
            borderRadius: '0.6px',
            background: '#61727F',
          }),
        }}
      >
        <div className='items-center h-full p-4 text-2xl text-black 3xl:p-8 xl:px-2'>
          <div className='mx-auto text-center rounded-md schedule'>
            <NaturalPDTCalendar
              savedData={savedData}
              patientUid={patientUid}
              bookedEvent={bookedEvent}
              calendarData={calendarData}
              bookingData={{ ...getValues() }}
              setCalendarMonth={setCalendarMonth}
              isLoadingCalendarResponse={isLoadingCalendarResponse}
              refreshCalendarOnSessionDelete={refreshCalendarOnSessionDelete}
            />
            <div className='bg-[#FEF4E7] flex gap-2 items-center mb-2 mt-4 3xl:mt-6 px-4 w-full rounded'>
              <img src={InfoIcon} className='w-4 h-4' alt='Info-icon' />
              <p className='w-full py-2 text-xs font-light text-left text-black'>
                {t('average.description')}
              </p>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </>
  );
};
