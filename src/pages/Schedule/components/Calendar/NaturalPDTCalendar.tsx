import 'utils/imports/moment-lang';
import moment from 'moment-timezone';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import { AppProvider } from 'AppProvider';
import { getUserLanguage, getWidth } from 'utils/functions';
import {
  Calendar,
  ToolbarProps,
  momentLocalizer,
  EventWrapperProps,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'assets/styles/calendar.css';
import Modal from 'components/Modals/Modal';
import CalendarEvent from './partials/CalendarEvent';
import CalendarToolbar from './partials/CalendarToolbar';
import {
  useRef,
  useMemo,
  useState,
  Dispatch,
  useEffect,
  useCallback,
  SetStateAction,
} from 'react';
import {
  formatEvents,
  SelectedDayInfoType,
  formatSelectedDayInfo,
  formatCustomStartTime,
  getInitialCalendarDate,
  setCalendarDateWithBookedEvent,
} from '../../api/format';
import WeatherDetailsModal from 'components/Modals/WeatherDetailsModal';
import SchedulingModal from './Modals/SchedulingModal';
import BookedConfirmation from './Modals/BookedConfirmation';
import CancelSessionModal from './Modals/CancelSessionModal';
import AverageWeatherModal from './Modals/AverageWeatherModal';
import { confirmDetailsInitState, formatGraphData } from './Modals/api/format';
import { useHistory } from 'react-router-dom';
import { patients, treatments } from 'routes';
import { usePostTreatment } from './Modals/api/query';
import BeginTreatmentModal from './Modals/BeginTreatmentModal';
import { TreatmentType, formatPostTreatment } from './Modals/api/serverFormats';
import SolarDoseToolTip from './Modals/components/SolarDoseToolTip';
import {
  SessionDetailsDataType,
  sessionDetailsDefaultValues,
  formatSessionCalendarResponse,
} from 'pages/Patients/components/RegisterPatient/RegisterModal/api/format';
import { useBeginTreatment } from './Modals/api/query';
import { useSessionCalendarData } from 'pages/Patients/components/RegisterPatient/RegisterModal/api/query';
import { FormatCalendarResponseType } from '../../api/query';
import { BookedEventType } from '../../api/types/format';
import type {
  beginTreatmentDataType,
  confirmationDetailsType,
} from './Modals/api/format.d';
import { SessionTypeEnums } from 'utils/options.d';
import EventsTimeSlotPicker from './partials/EventsTimeSlotPicker';
import { useQueryClient } from 'react-query';
import {
  FormattedNatPDTSessionsType,
  FormatGetTreatmentType,
} from '~/pages/Patients/components/PatientSchedule/api/query';
import { SessionStateEnums } from '~/pages/Patients/components/PatientSchedule/api/query.d';

type NaturalPDTCalendarProps = {
  patientUid: string;
  bookingData: TreatmentType;
  isLoadingCalendarResponse: boolean;
  calendarData: FormatCalendarResponseType;
  refreshCalendarOnSessionDelete: () => void;
  savedData?: FormattedNatPDTSessionsType;
  setCalendarMonth: Dispatch<SetStateAction<number>>;
  bookedEvent: FormatGetTreatmentType['eventData'] | null | undefined;
};

const NaturalPDTCalendar = ({
  savedData,
  patientUid,
  bookedEvent,
  bookingData,
  calendarData,
  setCalendarMonth,
  isLoadingCalendarResponse,
  refreshCalendarOnSessionDelete,
}: NaturalPDTCalendarProps) => {
  const {
    t,
    cookies: { user },
    currentPatientUsername,
  } = AppProvider.useContainer();
  const history = useHistory();
  const lang = getUserLanguage();
  const currentlyHoveredEvent = useRef<{
    event: BookedEventType;
    eventDayData: SelectedDayInfoType | undefined;
  }>();
  const queryClient = useQueryClient();
  const [afterDay13, setAfterDay13] = useState(false);
  const { days, fortnights, timezone } = calendarData;
  const hasBookedEvent = bookedEvent ? true : false;
  const [defaultDate, setDefaultDate] = useState(() =>
    getInitialCalendarDate(hasBookedEvent)
  );
  const {
    protocolDetails: { ppixDose },
    patientID,
    sessionType,
  } = bookingData;
  const { Assisted, FullyAssisted } = SessionTypeEnums;
  const [isBookedEvent, setIsBookedEvent] = useState<BookedEventType | null>(
    null
  );
  const [schedulingModal, setSchedulingModal] = useState(false);
  const [bookedConfirmation, setBookedConfirmation] = useState(false);
  const [confirmationDetails, setConfirmationDetails] =
    useState<confirmationDetailsType>(confirmDetailsInitState);
  const [cancelSessionModal, setCancelSessionModal] = useState(false);
  const [weatherDetailsModal, setWeatherDetailsModal] = useState(false);
  const [rescheduleRequiredEvent, setRescheduleRequiredEvent] = useState<
    boolean | Date
  >(false);

  const isPortalOnly =
    sessionType && sessionType === SessionTypeEnums.FullyAssisted
      ? true
      : false;
  const [hideWithoutSunscreen, setHideWithoutSunscreen] = useState(true);
  const [disableHideWithoutSunscreenBtn, setDisableHideWithoutSunscreenBtn] =
    useState(false);
  const timeZone = timezone || moment.tz.guess();
  const allDays = days ? Object.keys(days) : [];
  const firstEventStartDate =
    allDays?.[0] &&
    moment.unix(Number(allDays[0])).tz(timezone).format('YYYY-MM-DD');
  const lastEventEndDate =
    allDays?.[allDays.length - 1] &&
    moment
      .unix(Number(allDays[allDays.length - 1]))
      .tz(timezone)
      .format('YYYY-MM-DD');
  const timeZoneLabel = `${t('Scheduled_timezone')} (UTC ${moment()
    .tz(timeZone)
    .format('Z')}) ${timeZone}`;
  const [selectedDayData, setSelectedDayData] = useState<SelectedDayInfoType>({
    date: '',
    timezone: '',
    ery100: null,
    ppix100: null,
    timeSlots: {},
    weatherInfo: {},
  });

  const [onContinueFunc, setOnContinueFunc] = useState({
    onContinueFunc: () => {},
  });

  const [onCancelModalData, setOnCancelModalData] = useState({
    isCancelling: false,
    onCancelFunction: () => {},
    sessionCancelled: false,
  });

  const graphIDs = {
    solarRadiation: 'calendarsolarradiationchart',
    solar: 'calendarsolarchart',
    temp: 'calendartempchart',
    precipitation: 'calendarprecipitationchart',
  };

  const resetCalendarEvents = () => {
    queryClient.invalidateQueries('bookedTreatment');
    queryClient.invalidateQueries('OngoingTreatments');
    queryClient.invalidateQueries('unformattedAllPatientData');
  };

  //* Quick scheduling states
  const [errMsg, setErrMsg] = useState('');
  const [beginTreatmentModal, setBeginTreatmentModal] = useState(false);
  const [sessionDetailsData, setSessionDetailsData] =
    useState<SessionDetailsDataType>(sessionDetailsDefaultValues);
  const [bookingTime, setBookingTime] = useState({
    startTime: 0,
    endTime: 0,
    preStartTime: 0,
  });

  useEffect(() => {
    if (
      bookingData.sunscreenRequired === 'no' ||
      savedData?.sunscreenRequired === 'no'
    ) {
      setHideWithoutSunscreen(false);
      setDisableHideWithoutSunscreenBtn(true);
    } else {
      setHideWithoutSunscreen(true);
      setDisableHideWithoutSunscreenBtn(false);
    }
  }, [bookingData.sunscreenRequired, savedData?.sunscreenRequired]);

  useEffect(() => {
    if (!bookedEvent?.start) return;
    const initialCalendarDate = getInitialCalendarDate(true);
    const bookedDate = setCalendarDateWithBookedEvent(
      bookedEvent?.start,
      initialCalendarDate
    );
    bookedDate && setDefaultDate(bookedDate);
  }, [bookedEvent?.start]);

  const events = useMemo(
    () => formatEvents(days, fortnights, timeZone, bookedEvent),
    [days, fortnights, bookedEvent, timeZone]
  );

  const isInProgressTreatment =
    !!bookedEvent &&
    (bookedEvent?.sessionState === SessionStateEnums.RUNNING ||
      bookedEvent?.sessionState === SessionStateEnums.PAUSED);

  const handleEventClick = useCallback(
    (event: BookedEventType) => {
      if (isLoadingCalendarResponse) return;

      //* When a forecast event is clicked on
      if (bookedEvent && !event.scheduledStateTime) {
        if (bookedEvent?.sessionState === SessionStateEnums.RUNNING) {
          toast.error(t('Error.treatment_session_in_progress'), {
            id: 'session-in-progress-error',
          });
          return setSchedulingModal(false);
        }
      }

      //* When a booked event is clicked on
      if (isInProgressTreatment) {
        setSchedulingModal(false);
        history.push(`${patients}/${currentPatientUsername}/${treatments}`);
      }

      //* For booked and reschedule required sessions
      setSchedulingModal(true);
      event.isTreatmentDeclined || event?.rescheduleRequired
        ? setRescheduleRequiredEvent(event.start)
        : setRescheduleRequiredEvent(false);
      const nextMonthFromNow = moment().add(1, 'month');
      const selectedDay = moment.tz(event.start, timeZone);
      const day13 = event?.LastEventStartDate || nextMonthFromNow;
      selectedDay.isAfter(day13) ? setAfterDay13(true) : setAfterDay13(false);
      const selectedDayInfo = formatSelectedDayInfo(event.start, calendarData);
      selectedDayInfo && setSelectedDayData(selectedDayInfo);
      event.scheduledStateTime
        ? setIsBookedEvent(event)
        : setIsBookedEvent(null);
    },
    [
      t,
      history,
      timeZone,
      patientID,
      bookedEvent,
      calendarData,
      setAfterDay13,
      setIsBookedEvent,
      setSchedulingModal,
      setSelectedDayData,
      isInProgressTreatment,
      isLoadingCalendarResponse,
      setRescheduleRequiredEvent,
    ]
  );

  const localizer = momentLocalizer(moment);
  moment.updateLocale(lang, {
    week: {
      dow: 1, //* Makes Monday the start of the week.
    },
  });

  const onNavigate = useCallback(
    (newDate: Date) => setDefaultDate(newDate),
    [setDefaultDate]
  );

  const customDayPropGetter = useCallback(
    (date: Date) => {
      if (
        moment(date).isBetween(
          firstEventStartDate,
          lastEventEndDate,
          'day',
          '[]'
        )
      ) {
        return {
          className: 'forecast-day',
        };
      }
      return {
        className: 'other-day',
      };
    },
    [firstEventStartDate, lastEventEndDate]
  );

  //* Quick scheduling mutations
  const beginPortalOnlySession = useBeginTreatment();
  const quickSchedule = usePostTreatment(patientUid);
  const fetchSessionCalendarData = useSessionCalendarData();

  const handleGetSessionDetails = useCallback(() => {
    setErrMsg('');
    setBeginTreatmentModal(true);
    const sunscreen = bookingData?.sunscreenTypeUid;
    const getTime = moment().add(5, 'm').valueOf();
    const customTime = Math.round(getTime / 1000);
    const predictedEndTime = Math.round(moment().add(35, 'm').valueOf() / 1000);
    const assistedStartTime = Math.round(
      moment().add(30, 'm').valueOf() / 1000
    );

    fetchSessionCalendarData.mutate(
      {
        patientUid,
        token: user.token,
        data: formatCustomStartTime({ ...bookingData, customTime }),
      },
      {
        onSuccess: ({ data }) => {
          const slotTime = Object.keys(data?.calendar.slots)[0];
          const responseData = data?.calendar.slots[slotTime];
          const sessionDetails = formatSessionCalendarResponse(
            responseData,
            sunscreen
          );
          setSessionDetailsData({
            ...sessionDetails,
            startTime: isPortalOnly
              ? moment().format('HH:mm')
              : moment.unix(assistedStartTime).format('HH:mm'),
          });
          setBookingTime({
            endTime: moment(sessionDetails?.estimatedEndTime).valueOf() / 1000,
            preStartTime: moment(sessionDetails?.preStartTime).valueOf() / 1000,
            startTime: isPortalOnly ? customTime : assistedStartTime,
          });
        },

        onError: (response) => {
          console.error(response);
          setBookingTime({
            endTime: predictedEndTime,
            preStartTime: customTime,
            startTime: isPortalOnly ? customTime : assistedStartTime,
          });
          setErrMsg(t('Error.fetching.session.details'));
        },
      }
    );
  }, [
    t,
    setErrMsg,
    user.token,
    patientUid,
    bookingData,
    isPortalOnly,
    setBookingTime,
    setSessionDetailsData,
    setBeginTreatmentModal,
    fetchSessionCalendarData,
  ]);

  const handleBeginTreatment = (data: beginTreatmentDataType) => {
    if (!beginPortalOnlySession?.isLoading) {
      beginPortalOnlySession.mutate(
        {
          token: user.token,
          data,
        },
        {
          onSuccess: () => {
            setBeginTreatmentModal(false);
            toast.success(t('treatment_started.heading'));
            queryClient.invalidateQueries('unformattedAllPatientData');
            history.push(`${patients}/${currentPatientUsername}/${treatments}`);
          },

          onError: (response) => {
            console.error(response);
            toast.error(t('Error.treatment_start_failed'));
          },
        }
      );
    }
  };

  const handleQuickScheduleBooking = () => {
    quickSchedule.mutate(
      {
        token: user.token,
        data: formatPostTreatment({
          ...bookingData,
          ...bookingTime,
        }),
      },
      {
        onSuccess: ({ data }) => {
          if (data.session.settings.session_type === FullyAssisted) {
            handleBeginTreatment({
              patient_id: patientUid,
              session_id: data.session.uid,
            });
          } else if (data.session.settings.session_type === Assisted) {
            setBeginTreatmentModal(false);
            toast.success(t('Treatment_session_booked'));
            history.push(patients);
          }
        },

        onError: (err) => {
          if (err?.response?.data) {
            if (err?.response?.data.code === 1301) {
              toast.error(t('Error.patient.has.booked.session'));
            } else {
              console.error(err?.response?.data.error);
              toast.error(t('Error.scheduling_treatment'));
            }
          } else {
            toast.error(t('Error.scheduling_treatment'));
          }
        },
      }
    );
  };

  const isTodaysDateOrFuture = useCallback(
    (date: Date) => moment(date).isSameOrAfter(new Date(), 'day'),
    []
  );

  const calendarComponents = useMemo(
    () => ({
      eventWrapper: (props: EventWrapperProps<BookedEventType>) =>
        isTodaysDateOrFuture(props.event.start) ? (
          <div
            data-tooltip-place='top'
            data-tooltip-id='event-tooltip'
            className='calendar-event-wrapper'
            onClick={() => handleEventClick(props.event)}
            onMouseEnter={() => {
              currentlyHoveredEvent.current = {
                event: props.event,
                eventDayData: formatSelectedDayInfo(
                  props.event.start,
                  calendarData
                ),
              };
            }}
          >
            <CalendarEvent
              t={t}
              {...props}
              timezone={timeZone}
              isLoadingCalendarResponse={isLoadingCalendarResponse}
            />
          </div>
        ) : (
          <div
            className='calendar-event-wrapper'
            onClick={() => handleEventClick(props.event)}
          >
            <CalendarEvent
              t={t}
              {...props}
              timezone={timeZone}
              isLoadingCalendarResponse={isLoadingCalendarResponse}
            />
          </div>
        ),

      toolbar: (props: ToolbarProps<BookedEventType, object>) => (
        <CalendarToolbar
          {...props}
          sessionType={sessionType}
          timeZoneLabel={timeZoneLabel}
          setDefaultDate={setDefaultDate}
          setCalendarMonth={setCalendarMonth}
          hasBookedEvent={bookedEvent ? true : false}
          handleGetSessionDetails={handleGetSessionDetails}
          isLoadingCalendarResponse={isLoadingCalendarResponse}
        />
      ),
    }),
    [
      t,
      timeZone,
      bookedEvent,
      sessionType,
      calendarData,
      timeZoneLabel,
      handleEventClick,
      setCalendarMonth,
      isTodaysDateOrFuture,
      handleGetSessionDetails,
      isLoadingCalendarResponse,
    ]
  );

  return (
    <>
      <Calendar
        culture={lang}
        events={events}
        date={defaultDate}
        localizer={localizer}
        views={{ month: true }}
        onNavigate={onNavigate}
        components={calendarComponents}
        dayPropGetter={customDayPropGetter}
        eventPropGetter={() => ({ className: 'calendar-events' })}
        style={{
          height: '82vh',
          maxHeight: '50rem',
          minHeight: getWidth() <= 1440 ? '40rem' : '42rem',
        }}
      />
      <Modal
        overflow='visible'
        closeOnEsc={false}
        closeMaskOnClick={false}
        isVisible={schedulingModal}
        setVisible={setSchedulingModal}
        modalContent={
          <SchedulingModal
            t={t}
            token={user.token}
            savedData={savedData}
            afterDay13={afterDay13}
            patientUid={patientUid}
            bookingData={bookingData}
            bookedEventData={bookedEvent}
            timeZoneLabel={timeZoneLabel}
            isBookedEvent={isBookedEvent}
            key={`${selectedDayData.date}`}
            selectedDayData={selectedDayData}
            setOnContinueFunc={setOnContinueFunc}
            setSchedulingModal={setSchedulingModal}
            firstEventStartDate={firstEventStartDate}
            setOnCancelModalData={setOnCancelModalData}
            resetCalendarEvents={resetCalendarEvents}
            handleBeginTreatment={handleBeginTreatment}
            setBookedConfirmation={setBookedConfirmation}
            hideWithoutSunscreen={hideWithoutSunscreen}
            setCancelSessionModal={setCancelSessionModal}
            setConfirmationDetails={setConfirmationDetails}
            setWeatherDetailsModal={setWeatherDetailsModal}
            setHideWithoutSunscreen={setHideWithoutSunscreen}
            rescheduleRequiredEvent={rescheduleRequiredEvent}
            disableHideWithoutSunscreenBtn={disableHideWithoutSunscreenBtn}
            refreshCalendarOnSessionDelete={refreshCalendarOnSessionDelete}
            beginTreatmentRequestLoading={beginPortalOnlySession?.isLoading}
          />
        }
      />
      <Modal
        isVisible={cancelSessionModal}
        setVisible={setCancelSessionModal}
        modalContent={
          <CancelSessionModal
            t={t}
            isInProgressTreatment={isInProgressTreatment}
            setCancelSessionModal={setCancelSessionModal}
            isCancelling={onCancelModalData.isCancelling}
            onCancelFunction={onCancelModalData.onCancelFunction}
            sessionCancelled={onCancelModalData.sessionCancelled}
          />
        }
      />
      <Modal
        isVisible={weatherDetailsModal}
        setVisible={setWeatherDetailsModal}
        modalContent={
          afterDay13 ? (
            <AverageWeatherModal
              t={t}
              graphIDs={graphIDs}
              minPpix={Number(ppixDose)}
              timeZoneLabel={timeZoneLabel}
              titleToolTip={<SolarDoseToolTip t={t} />}
              setSessionSummaryModal={setSchedulingModal}
              hideWithoutSunscreen={hideWithoutSunscreen}
              setWeatherDetailsModal={setWeatherDetailsModal}
              setHideWithoutSunscreen={setHideWithoutSunscreen}
              disableHideWithoutSunscreenBtn={disableHideWithoutSunscreenBtn}
              selectedDayData={formatGraphData(
                selectedDayData,
                timeZone,
                hideWithoutSunscreen
              )}
            />
          ) : (
            <WeatherDetailsModal
              t={t}
              graphIDs={graphIDs}
              minPpix={Number(ppixDose)}
              timeZoneLabel={timeZoneLabel}
              titleToolTip={<SolarDoseToolTip t={t} />}
              setSessionSummaryModal={setSchedulingModal}
              hideWithoutSunscreen={hideWithoutSunscreen}
              setWeatherDetailsModal={setWeatherDetailsModal}
              setHideWithoutSunscreen={setHideWithoutSunscreen}
              disableHideWithoutSunscreenBtn={disableHideWithoutSunscreenBtn}
              selectedDayData={formatGraphData(
                selectedDayData,
                timeZone,
                hideWithoutSunscreen
              )}
            />
          )
        }
      />
      <Modal
        closeOnEsc={false}
        closeMaskOnClick={false}
        isVisible={bookedConfirmation}
        setVisible={setBookedConfirmation}
        modalContent={
          <BookedConfirmation
            t={t}
            isPortalOnly={isPortalOnly}
            confirmationDetails={confirmationDetails}
            handleBeginTreatment={handleBeginTreatment}
            onContinueFunc={onContinueFunc.onContinueFunc}
            isRequestLoading={beginPortalOnlySession?.isLoading}
          />
        }
      />
      <Modal
        isVisible={beginTreatmentModal}
        setVisible={setBeginTreatmentModal}
        modalContent={
          <BeginTreatmentModal
            t={t}
            errMsg={errMsg}
            isPortalOnly={isPortalOnly}
            sessionDetailsData={sessionDetailsData}
            setBeginTreatmentModal={setBeginTreatmentModal}
            handleQuickScheduleBooking={handleQuickScheduleBooking}
            isLoadingSessionData={fetchSessionCalendarData?.isLoading}
            isUpdating={
              quickSchedule?.isLoading || beginPortalOnlySession?.isLoading
            }
          />
        }
      />

      {((bookedEvent &&
        bookedEvent.sessionState !== SessionStateEnums.RUNNING) ||
        !bookedEvent) && (
        <Tooltip
          clickable
          id='event-tooltip'
          className='event-container-tooltip'
          render={() => (
            <EventsTimeSlotPicker
              timeZone={timeZone}
              patientUid={patientUid}
              bookingData={bookingData}
              bookedEventData={bookedEvent}
              eventInfo={currentlyHoveredEvent}
              handleEventClick={handleEventClick}
              resetCalendarEvents={resetCalendarEvents}
              setBookedConfirmation={setBookedConfirmation}
              hideWithoutSunscreen={hideWithoutSunscreen}
              setConfirmationDetails={setConfirmationDetails}
            />
          )}
        />
      )}
    </>
  );
};

export default NaturalPDTCalendar;
