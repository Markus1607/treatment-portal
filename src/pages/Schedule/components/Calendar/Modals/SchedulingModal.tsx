import moment from 'moment-timezone';
import toast from 'react-hot-toast';
import { isEmpty, includes } from 'lodash';
import InfoWarning from 'assets/images/ic_alert_red.svg';
import InfoIcon from 'assets/images/ic_alert_blue.svg';
import { Dispatch, useEffect, useMemo, useState, SetStateAction } from 'react';
import {
  CancelSession,
  DiscardButton,
  ScheduleButton,
  RescheduleButton,
  RescheduleButton as BeginTreatmentButton,
} from 'components/Forms/Buttons';
import { ClipLoader } from 'components/Loader';
import { getDateFromUnix } from 'utils/functions';
import SessionGraphs from './components/SessionGraphs';
import { formatPostTreatment } from './api/serverFormats';
import SessionInformation from './components/SessionInformation';
import WeatherConditions from './components/WeatherConditions';
import SelectSessionTime from './components/SelectSessionTime';
import CustomStartTime from './components/CustomStartTime';
import {
  usePutTreatment,
  usePostTreatment,
  useCancelTreatment,
} from './api/query';
import {
  getUnixTime,
  getCustomTimeUnix,
  excludedCustomHour,
  formatSessionTimes,
  getSessionDetails,
  getSessionGraphData,
  isTreatmentReadyToBegin,
  formatCustomSessionTime,
  getCustomSessionDetails,
  getCustomSessionGraphData,
} from './api/format';
import type {
  SelectedTimeDataType,
  beginTreatmentDataType,
  confirmationDetailsType,
  customTimeDataType,
} from './api/format.d';
import { TFunction } from 'react-i18next';
import { useCustomStartTime } from '../../../api/query';
import {
  SelectedDayInfoType,
  formatCustomStartTime,
} from '../../../api/format';
import type { AxiosError } from 'axios';
import { ModalTitle } from 'components/ModalTitle';
import { SessionTypeEnums } from 'utils/options.d';
import type { TreatmentType } from './api/serverFormats';
import SolarDoseToolTip from './components/SolarDoseToolTip';
import { BookedEventType } from 'pages/Schedule/api/types/format';
import beginTreatmentIcon from 'assets/images/ic_begin_btn.svg';
import { SessionStateEnums } from '~/pages/Patients/components/PatientSchedule/api/query.d';
import { FormattedNatPDTSessionsType } from '~/pages/Patients/components/PatientSchedule/api/query';
import { useHistory } from 'react-router-dom';
import { patients, treatments } from '~/routes';
import { AppProvider } from '~/AppProvider';

type SchedulingModalProps = {
  t: TFunction<'translation', undefined>;
  token: string;
  patientUid: string;
  afterDay13: boolean;
  bookingData: TreatmentType;
  timeZoneLabel: string;
  resetCalendarEvents: () => void;
  isBookedEvent: BookedEventType | null;
  bookedEventData: BookedEventType | undefined | null;
  selectedDayData: SelectedDayInfoType;
  setOnContinueFunc: Dispatch<
    SetStateAction<{
      onContinueFunc: () => void;
    }>
  >;
  savedData?: FormattedNatPDTSessionsType;
  setSchedulingModal: Dispatch<SetStateAction<boolean>>;
  firstEventStartDate: string;
  setBookedConfirmation: Dispatch<SetStateAction<boolean>>;
  setCancelSessionModal: Dispatch<SetStateAction<boolean>>;
  setOnCancelModalData: Dispatch<
    SetStateAction<{
      isCancelling: boolean;
      onCancelFunction: () => void;
      sessionCancelled: boolean;
    }>
  >;
  setConfirmationDetails: Dispatch<SetStateAction<confirmationDetailsType>>;
  hideWithoutSunscreen: boolean;
  setWeatherDetailsModal: Dispatch<SetStateAction<boolean>>;
  setHideWithoutSunscreen: Dispatch<SetStateAction<boolean>>;
  rescheduleRequiredEvent: Date | boolean;
  refreshCalendarOnSessionDelete: () => void;
  handleBeginTreatment: (data: beginTreatmentDataType) => void;
  beginTreatmentRequestLoading: boolean;
  disableHideWithoutSunscreenBtn: boolean;
};

const SchedulingModal = ({
  t,
  token,
  afterDay13,
  patientUid,
  bookingData,
  timeZoneLabel,
  isBookedEvent,
  bookedEventData,
  selectedDayData,
  setOnContinueFunc,
  setSchedulingModal,
  firstEventStartDate,
  handleBeginTreatment,
  resetCalendarEvents,
  setBookedConfirmation,
  setCancelSessionModal,
  setOnCancelModalData,
  setConfirmationDetails,
  hideWithoutSunscreen,
  setWeatherDetailsModal,
  setHideWithoutSunscreen,
  rescheduleRequiredEvent,
  refreshCalendarOnSessionDelete,
  beginTreatmentRequestLoading,
  disableHideWithoutSunscreenBtn,
}: SchedulingModalProps) => {
  const history = useHistory();
  const getCustomTime = useCustomStartTime();
  const cancelTreatment = useCancelTreatment();
  const rescheduleTreatment = usePutTreatment();
  const scheduleTreatment = usePostTreatment(patientUid);
  const [selectedTime, setSelectedTime] = useState<SelectedTimeDataType>({
    unix: '',
    unixStartTime: '',
    unixEndTime: '',
    suitability: '',
    startTime: '',
    preStartTime: '',
    estEndTime: '',
  });
  const { timeSlots, date, timezone } = selectedDayData;
  const {
    patientID,
    sessionType,
    sunscreenTypeUid,
    sunscreenRequired,
    protocolDetails: { ppixDose },
  } = bookingData;
  const { currentPatientUsername } = AppProvider.useContainer();
  const [disableHourlyTimes, setDisableHourlyTimes] = useState(false);
  const [showSessionDetailLink, setShowSessionDetailLink] = useState(false);
  const [customTimeData, setCustomTimeData] = useState<customTimeDataType>({
    sessionGraph: [],
    sessionDetails: [],
    sessionTimeData: [],
  });

  const isPortalOnly = sessionType === SessionTypeEnums.FullyAssisted;

  const sessionTimes = useMemo(
    () => formatSessionTimes(timeSlots, timezone, hideWithoutSunscreen) || [],
    [timeSlots, timezone]
  );

  const sessionDetails = useMemo(
    () => getSessionDetails(selectedTime?.unix, timeSlots, timezone) || [],
    [timeSlots, selectedTime?.unix, timezone]
  );

  const sessionGraphData = useMemo(
    () => getSessionGraphData(selectedTime?.unix, timeSlots) || [],
    [timeSlots, selectedTime?.unix]
  );

  const rescheduleEventDate =
    rescheduleRequiredEvent instanceof Date
      ? moment(rescheduleRequiredEvent).tz(timezone).format('Do MMM YYYY')
      : '';
  const rescheduleEventTime =
    rescheduleRequiredEvent instanceof Date
      ? moment(rescheduleRequiredEvent).tz(timezone).format('HH:mm')
      : '';

  const isSessionOngoingOrPaused =
    isBookedEvent?.sessionState === SessionStateEnums.PAUSED ||
    isBookedEvent?.sessionState === SessionStateEnums.RUNNING;

  useEffect(() => {
    if (isBookedEvent) {
      const bookedEventTime = moment
        .unix(isBookedEvent.scheduledStateTime)
        .tz(timezone)
        .format('HH:mm');
      const selected = sessionTimes.filter(
        (time) => time.startTime === bookedEventTime
      );
      if (selected[0]) {
        setSelectedTime(selected[0]);
      } else if (!isBookedEvent?.rescheduleRequired) {
        setDisableHourlyTimes(true);
        handleCustomStartTime(bookedEventTime, isBookedEvent);
      }
    }
    if (!isEmpty(sessionTimes) && !isBookedEvent) {
      const selected = sessionTimes.filter(
        (time) => time.suitability === t('Scheduling.modal.high')
      );
      setSelectedTime(selected[0] || sessionTimes[0]);
    }
    // eslint-disable-next-line
  }, [t, sessionTimes, isBookedEvent]);

  useEffect(() => {
    if (isBookedEvent && patientID) {
      setOnCancelModalData({
        isCancelling: cancelTreatment?.isLoading,
        onCancelFunction: handleCancelTreatment,
        sessionCancelled: cancelTreatment?.isSuccess,
      });
    }
    setOnContinueFunc({
      onContinueFunc: () => {
        handleOnCloseModal();
        setBookedConfirmation(false);
        history.push(`${patients}/${currentPatientUsername}/${treatments}`);
      },
    });
    // eslint-disable-next-line
  }, [
    patientID,
    isBookedEvent,
    setOnContinueFunc,
    setOnCancelModalData,
    cancelTreatment?.isLoading,
    cancelTreatment?.isSuccess,
  ]);

  useEffect(() => {
    if (sessionDetails?.[0]?.icon || customTimeData.sessionDetails?.[0]?.icon) {
      setShowSessionDetailLink(false);
    } else {
      setShowSessionDetailLink(true);
    }
  }, [sessionDetails, customTimeData]);

  const handleOnCloseModal = () => {
    setCustomTimeData({
      sessionGraph: [],
      sessionDetails: [],
      sessionTimeData: [],
    });
    setSchedulingModal(false);
    setCancelSessionModal(false);
    setDisableHourlyTimes(false);
  };

  const handleScheduleTreatment = () => {
    const customStartTime = customTimeData.sessionTimeData?.[0]?.startTime;
    const customEndTime = customTimeData.sessionTimeData?.[0]?.estEndTime;
    const customPreStartTime =
      customTimeData.sessionTimeData?.[0]?.preStartTime;

    scheduleTreatment.mutate(
      {
        token: token,
        data: formatPostTreatment({
          ...bookingData,
          preStartTime: getUnixTime(
            date,
            customPreStartTime || selectedTime?.preStartTime,
            timezone
          ),
          startTime: getUnixTime(
            date,
            customStartTime || selectedTime?.startTime,
            timezone
          ),
          endTime: getUnixTime(
            date,
            customEndTime || selectedTime?.estEndTime,
            timezone
          ),
        }),
      },
      {
        onSuccess: ({ data }) => {
          resetCalendarEvents();
          setSchedulingModal(false);
          setBookedConfirmation(true);
          setConfirmationDetails({
            patientID,
            rescheduled: false,
            unixDateTime: data.session.scheduled_start_time,
            location: bookingData?.expectedLocation.address,
            date: getDateFromUnix(
              data.session.scheduled_start_time,
              'dddd Do MMMM YYYY'
            ),
            preStartTime: customPreStartTime || selectedTime?.preStartTime,
            startTime: customStartTime || selectedTime?.startTime,
            endTime: customEndTime || selectedTime?.estEndTime,
            sessionType: bookingData?.sessionType || '-',
            beginTreatmentData: {
              lat: data.session.settings.lat,
              lon: data.session.settings.lon,
              sessionId: data.session.uid,
            },
          });
        },

        onError: (err: AxiosError) => {
          handleOnCloseModal();
          if (err?.response?.data) {
            if (err?.response?.data.code === 1301) {
              toast.error(t('Error.patient.has.booked.session'));
            } else if (err?.response?.data.code === 1052) {
              toast.error(t('Error.cant_schedule_for_start_time'), {
                duration: 5000,
              });
            } else {
              toast.error(t('Error.scheduling_treatment'));
            }
          } else {
            console.error(err.message);
            toast.error(t('Error.server_down_error'));
          }
        },
      }
    );
  };

  const handleRescheduleTreatment = () => {
    const customStartTime = customTimeData.sessionTimeData?.[0]?.startTime;
    const customEndTime = customTimeData.sessionTimeData?.[0]?.estEndTime;
    const customPreStartTime =
      customTimeData.sessionTimeData?.[0]?.preStartTime;

    const bookedSessionTime =
      isBookedEvent &&
      moment.unix(isBookedEvent?.scheduledStateTime).format('HH:mm');
    if (
      (customStartTime && bookedSessionTime !== customStartTime) ||
      (selectedTime?.startTime && bookedSessionTime !== selectedTime?.startTime)
    ) {
      bookedEventData &&
        rescheduleTreatment.mutate(
          {
            token: token,
            sessionId: bookedEventData?.sessionId,
            data: {
              scheduled_start_time: getUnixTime(
                date,
                customStartTime || selectedTime?.startTime,
                timezone
              ),
              expected_end_time: getUnixTime(
                date,
                customEndTime || selectedTime?.estEndTime,
                timezone
              ),
            },
          },
          {
            onSuccess: ({ data }) => {
              resetCalendarEvents();
              setSchedulingModal(false);
              setBookedConfirmation(true);
              setConfirmationDetails({
                patientID,
                rescheduled: true,
                unixDateTime: data.session.scheduled_start_time,
                location: bookingData?.expectedLocation.address,
                date: getDateFromUnix(
                  data.session.scheduled_start_time,
                  'dddd Do MMMM YYYY'
                ),
                preStartTime: customPreStartTime || selectedTime?.preStartTime,
                startTime: customStartTime || selectedTime?.startTime,
                endTime: customEndTime || selectedTime?.estEndTime,
                sessionType: bookingData?.sessionType || '-',
                beginTreatmentData: {
                  lat: data.session.settings.lat,
                  lon: data.session.settings.lon,
                  sessionId: data.session.uid,
                },
              });
            },

            onError: (err: AxiosError) => {
              handleOnCloseModal();
              if (err?.response?.data) {
                if (err?.response?.data.code === 1052) {
                  toast.error(t('Error.cant_schedule_for_start_time'), {
                    duration: 5000,
                  });
                } else {
                  console.error(err?.response?.data.error);
                  toast.error(t('Error.scheduling_treatment'));
                }
              } else {
                console.error(err.message);
                toast.error(t('Error.server_down_error'));
              }
            },
          }
        );
    } else {
      toast.error(t('Select_new_session_time'));
    }
  };

  const handleCancelTreatment = () => {
    bookedEventData &&
      cancelTreatment.mutate(
        {
          token: token,
          data: {
            sessionId: bookedEventData?.sessionId,
          },
        },
        {
          onSuccess: () => {
            handleOnCloseModal();
            resetCalendarEvents();
            cancelTreatment.reset();
            refreshCalendarOnSessionDelete();
          },

          onError: (err: AxiosError) => {
            handleOnCloseModal();
            cancelTreatment.reset();
            if (err?.response?.data) {
              console.error(err?.response?.data.error);
              toast.error(t('Error.cancelling.session'));
            } else {
              console.error(err.message);
              toast.error(t('Error.server_down_error'));
            }
          },
        }
      );
  };

  const customTimeReset = () => {
    setCustomTimeData({
      sessionGraph: [],
      sessionDetails: [],
      sessionTimeData: [],
    });
    setDisableHourlyTimes(false);
    const selected = sessionTimes.filter(
      (time) => time.suitability === t('Scheduling.modal.high')
    );
    !isEmpty(sessionTimes) && setSelectedTime(selected?.[0] || sessionTimes[0]);
  };

  const handleCustomStartTime = (
    customTime: string,
    isBookedEvent?: BookedEventType
  ) => {
    const customStartTime = getCustomTimeUnix(date, customTime, timezone);

    const isToday = moment
      .unix(customStartTime)
      .isBefore(moment().tz(timezone), 'hour');
    if (isToday && !isBookedEvent) {
      customTimeReset();
      return toast.error(t('Error.past.treatment.schedule'));
    }

    const customHour = moment.unix(customStartTime).format('HH');
    if (includes(excludedCustomHour, customHour) && !isBookedEvent) {
      customTimeReset();
      return toast.error(t('Error.treatment_night_schedule'));
    }

    getCustomTime.mutate(
      {
        token: token,
        data: formatCustomStartTime({
          ...bookingData,
          customTime: customStartTime,
        }),
        patientUid: patientID,
      },
      {
        onSuccess: ({ data }) => {
          setDisableHourlyTimes(true);
          const sessionTimeData = formatCustomSessionTime(
            data?.calendar.slots,
            timezone,
            hideWithoutSunscreen
          );
          const sessionDetails = getCustomSessionDetails(
            data?.calendar.slots,
            timezone
          );
          const sessionGraph = getCustomSessionGraphData(data?.calendar.slots);
          setCustomTimeData({
            sessionGraph,
            sessionDetails,
            sessionTimeData,
          });
        },
        onError: () => {
          customTimeReset();
          !isBookedEvent && toast.error(t('Error.treatment_no_suitable'));
        },
      }
    );
  };

  const modalTitle = `${t('Patient')} > ${t(
    'Dashboard_weather_modal_scheduling'
  )} > ${date} > ${t('Dashboard_weather_modal_time_slots')}`;

  const hasValidCustomTime = customTimeData.sessionTimeData?.[0]?.preStartTime;

  return (
    <div className='3xl:min-w-[100rem] 3xl:w-[100rem] z-[104] max-h-[100vh] md:min-w-[95vw] xl:min-w-[85rem] xl:w-[85rem] h-full bg-dashboard overflow-hidden overflow-y-scroll lg:w-full'>
      <header className='flex justify-between px-4 py-4 font-medium bg-white border gap-36'>
        <h2 className='hidden text-sm text-left 2xl:text-xl md:block lg:flex-shrink-0 xl:text-lg'>
          {ModalTitle(modalTitle)}
        </h2>
        <h2 className='flex-shrink-0 text-sm 2xl:text-xl xl:text-lg'>
          {timeZoneLabel}
        </h2>
      </header>

      {rescheduleRequiredEvent && (
        <div className='py-[0.4rem] flex gap-2 items-center mb-2 px-4 w-full text-xs bg-red-100 xl:text-sm'>
          <img src={InfoWarning} className='w-4 h-4' alt='info-warning' />
          <span className='w-full text-left text-bold text-warning'>
            {`${t('Reschedule_planned_for')} ${rescheduleEventDate} ${t(
              'at'
            )} ${rescheduleEventTime} ${
              isBookedEvent?.isTreatmentDeclined
                ? t('Patient_declined_treatment')
                : ''
            }`}
          </span>
        </div>
      )}

      {afterDay13 && (
        <div className='py-[0.4rem] bg-[#EDF5FC] flex gap-2 items-center mb-2 px-4 w-full text-blue-dark text-xs shadow-sm xl:text-sm'>
          <img
            src={InfoIcon}
            className='w-4 h-4 fill-current'
            alt='info-icon'
          />
          <span className='w-full text-left text-bold'>
            {t('averaged.treatment.message')}
          </span>
        </div>
      )}

      <main className='relative flex flex-col w-full h-full max-h-full gap-2 p-4 mx-auto overflow-x-auto overflow-y-auto 3xl:max-h-full lg:flex-row lg:gap-5 xl:max-w-full '>
        {/*Left Panel*/}
        <div className='min-w-[25rem] lg:w-[40rem] flex flex-col gap-4 w-full h-full'>
          <SelectSessionTime
            t={t}
            selectedDay={date}
            sessionTimes={sessionTimes}
            selectedTime={selectedTime}
            isBookedEvent={isBookedEvent}
            isDisabled={disableHourlyTimes}
            setSelectedTime={setSelectedTime}
            setCustomTimeData={setCustomTimeData}
            firstEventStartDate={firstEventStartDate}
            setDisableHourlyTimes={setDisableHourlyTimes}
          />

          <CustomStartTime
            t={t}
            disableHourlyTimes={disableHourlyTimes}
            hideWithoutSunscreen={hideWithoutSunscreen}
            handleCustomStartTime={handleCustomStartTime}
            setDisableHourlyTimes={setDisableHourlyTimes}
            sessionTimeData={customTimeData.sessionTimeData}
            bookedCustomTime={customTimeData.sessionTimeData?.[0]?.startTime}
          />
        </div>

        {(scheduleTreatment.isLoading ||
          rescheduleTreatment.isLoading ||
          getCustomTime.isLoading) && (
          <div className='absolute w-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'>
            <ClipLoader color='#1e477f' size={1.5} />
          </div>
        )}

        {/*Right Panel*/}
        <div className='flex flex-col flex-grow gap-4'>
          <SessionGraphs
            t={t}
            minPpix={Number(ppixDose)}
            data={
              !isEmpty(customTimeData.sessionGraph)
                ? customTimeData.sessionGraph
                : sessionGraphData
            }
            titleToolTip={<SolarDoseToolTip t={t} />}
            hideWithoutSunscreen={hideWithoutSunscreen}
            setHideWithoutSunscreen={setHideWithoutSunscreen}
            disableHideWithoutSunscreenBtn={disableHideWithoutSunscreenBtn}
          />
          <div className='flex gap-4 lg:w-full'>
            <SessionInformation
              detailedView={showSessionDetailLink}
              setWeatherDetailsModal={setWeatherDetailsModal}
              sessionDetails={
                !isEmpty(customTimeData.sessionDetails)
                  ? customTimeData.sessionDetails
                  : sessionDetails
              }
              SPFSelected={sunscreenRequired === 'no' ? null : sunscreenTypeUid}
            />
            {(customTimeData.sessionDetails?.[0]?.icon ||
              sessionDetails?.[0]?.icon) && (
              <WeatherConditions
                t={t}
                setWeatherDetailsModal={setWeatherDetailsModal}
                sessionDetails={
                  !isEmpty(customTimeData.sessionDetails)
                    ? customTimeData.sessionDetails
                    : sessionDetails
                }
              />
            )}
          </div>
        </div>
      </main>

      <footer className='flex justify-between px-4 py-3 bg-white border'>
        <DiscardButton
          alt={t('Button_Close')}
          text={t('Button_Close')}
          onClick={() => handleOnCloseModal()}
        />

        <div className='flex gap-5'>
          {!rescheduleRequiredEvent &&
            !bookedEventData &&
            !isBookedEvent?.scheduledStateTime &&
            (!isEmpty(sessionTimes) || hasValidCustomTime) && (
              <ScheduleButton
                alt={t('Patient_Scheduling.button_text')}
                text={t('Patient_Scheduling.button_text')}
                onClick={() => handleScheduleTreatment()}
              />
            )}
          {isBookedEvent?.scheduledStateTime && (
            <CancelSession
              className='2xl:px-6 2xl:text-base'
              text={t('Monitoring_-_report.text')}
              alt={t('Monitoring_-_report.text')}
              onClick={() => setCancelSessionModal(true)}
            />
          )}

          {!isBookedEvent?.isTreatmentInThePast &&
            (isBookedEvent?.scheduledStateTime || bookedEventData) &&
            !isSessionOngoingOrPaused &&
            (!isEmpty(sessionTimes) || hasValidCustomTime) && (
              <RescheduleButton
                alt={t('Reschedule_session_button')}
                text={t('Reschedule_session_button')}
                onClick={() => handleRescheduleTreatment()}
              />
            )}

          {isPortalOnly &&
            isBookedEvent?.scheduledStateTime &&
            isBookedEvent?.sessionState === SessionStateEnums.SCHEDULED &&
            isTreatmentReadyToBegin(isBookedEvent?.scheduledStateTime) && (
              <BeginTreatmentButton
                className='bg-orange'
                alt={t('button.begin_treatment')}
                text={t('button.begin_treatment')}
                onClick={() => {
                  handleBeginTreatment({
                    patient_id: patientID,
                    session_id: isBookedEvent.sessionId,
                  });
                }}
                icon={beginTreatmentIcon}
                isRequestLoading={beginTreatmentRequestLoading}
              />
            )}
        </div>
      </footer>
    </div>
  );
};

export default SchedulingModal;
