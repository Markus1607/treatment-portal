import { isNumber } from 'lodash';
import { monitoring } from 'routes';
import toast from 'react-hot-toast';
import { useTitle } from 'utils/hooks';
import { AppProvider } from 'AppProvider';
import SortArrow from './Components/SortArrow';
import useResizeObserver from 'use-resize-observer';
import { Tabs, Panel } from 'components/TabPanel';
import { useEffect, useRef, useState, useMemo, lazy } from 'react';
import { extractUserAddress, geocodeFetch } from 'utils/functions';
import ActiveTreatmentList from './Components/ActiveTreatmentList';
import { ReactComponent as PushRight } from 'assets/images/ic_pushright.svg';
import ResumeIcon from 'assets/images/ic_resume.svg';
import PauseIcon from 'assets/images/ic_pause.svg';
import {
  CancelSession,
  RescheduleButton as PauseButton,
  RescheduleButton as ResumeButton,
  NoIconButton as EndSessionButton,
} from 'components/Forms/Buttons';
import Modal from 'components/Modals/Modal';
import { useHistory } from 'react-router-dom';
import CancelSessionModal from './Components/CancelSessionModal';
import {
  useEndPortalTreatment,
  useOngoingTreatmentSessions,
} from './api/query';
import { useQueryClient } from 'react-query';
import { AddressDatatype } from './api/api.d';
import { ClipLoader } from 'components/Loader';
import { SessionTypeEnums } from 'utils/options.d';
import TreatmentFinishedModal from './Components/TreatmentFinishedModal';
import { ReactComponent as NoActiveSessions } from 'assets/images/noActiveSessions.svg';
import {
  MonitoringDataType,
  FormattedOngoingSessionDataType,
} from './api/format';

export default function Monitoring() {
  const history = useHistory();
  const scrollPosition = useRef(0);
  const [errMsg, setErrMsg] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [isActive, setActive] = useState(false);
  const containerStyle = isActive
    ? 'block xl:w-full'
    : 'hidden xl:w-[0px] xl:block';
  const queryClient = useQueryClient();
  const treatmentListScrollRef = useRef<HTMLElement>(null);
  const [sessionCancelled, setSessionCancelled] = useState(false);
  const { ref: containerRef, width: footerWidth } = useResizeObserver();
  const [selectedPatientID, setSelectedPatientID] = useState<number | null>(
    null
  );
  const { t, cookies, sunscreenList } = AppProvider.useContainer();
  const { isLoading, data } = useOngoingTreatmentSessions(
    cookies.user.token,
    sunscreenList
  );
  const [ascending, setAscending] = useState(false);
  const endPortalTreatment = useEndPortalTreatment();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [endTreatmentModal, setEndTreatmentModal] = useState(false);
  const [cancelSessionModal, setCancelSessionModal] = useState(false);
  const [sortedData, setSortedData] = useState<
    FormattedOngoingSessionDataType[]
  >([]);
  const [treatmentReportPatientID, setTreatmentReportPatientID] = useState(0);

  useTitle(t('Dashboard.Monitoring'));

  // Lazy loaded tab component pages
  const SessionSteps = lazy(() => import('./Components/SessionSteps'));
  const SessionReport = lazy(() => import('./Components/SessionReport'));
  const SessionProtocol = lazy(() => import('./Components/SessionProtocol'));

  const monitoringData = useMemo(() => {
    if (!isLoading && data && 'error' in data) {
      setErrMsg(t('Error.active.sessions.fetch'));
      return [];
    }

    if (!isLoading && data && Array.isArray(data)) {
      setErrMsg('');
      // //* open the panel if there is a history.location.state and that ID is in the data (used when coming from dashboard with linked treatment)
      if (
        isFirstLoad &&
        history.location.state &&
        data.some((session) => session.patientID === history.location.state)
      ) {
        setActive(true);
        setIsFirstLoad(false);
        setSelectedPatientID(history.location.state as number);
      }
      setSortedData(data);
      return data;
    }

    return [];
  }, [t, data, isLoading, isFirstLoad, history.location.state]);

  //* For treatments that have just started (under 1 min in duration) calls the endpoint to update the every 15 seconds, rather than usual refetch of 1 min. Creates better UX for the user.
  useEffect(() => {
    if (
      !monitoringData.some((session) => session.patientID === selectedPatientID)
    ) {
      setActive(false);
      setSelectedPatientID(null);
    }
    monitoringData.forEach((session) => {
      if (session.report?.treatmentDuration < 1) {
        setTimeout(
          () => queryClient.invalidateQueries('ongoingTreatmentSessions'),
          15000
        );
      }
    });
  }, [queryClient, monitoringData, selectedPatientID]);

  const compareFunction = (a: MonitoringDataType, b: MonitoringDataType) => {
    if (a.pdt_end_time === -2) return 1;
    if (b.pdt_end_time === -2) return -1;
    return a.pdt_end_time - b.pdt_end_time;
  };

  const handleSort = () => {
    const ascendingData: FormattedOngoingSessionDataType[] = [
      ...monitoringData,
    ].sort((a, b) => compareFunction(a, b));
    if (!sortedData) {
      setAscending(true);
      setSortedData(ascendingData);
    } else if (ascending) {
      setAscending(false);
      setSortedData(ascendingData.reverse());
    } else {
      setAscending(true);
      setSortedData(ascendingData);
    }
  };

  const [addressArray, setAddressArray] = useState<AddressDatatype[]>([]);

  //* Backend does not provide address only lat long, so we have to reverse geocode to get the actual address
  useEffect(() => {
    for (const [index, session] of monitoringData.entries()) {
      const { lat, lon, sessionType, location, patientID } = session ?? {};

      if (
        !isNumber(lat) ||
        !isNumber(lon) ||
        sessionType === SessionTypeEnums.FullyAssisted
      ) {
        setAddressArray((arr) => {
          const newArr = [...arr];
          newArr[index] = {
            address: location,
            id: patientID,
          };
          return newArr;
        });
        continue;
      }

      geocodeFetch(lat, lon)
        .then((data) => {
          if (data instanceof Error) {
            console.error(data);
            throw new Error('Received non-OK status');
          }

          const address = 'results' in data && extractUserAddress(data);
          if (!address) return { address: location, id: patientID };

          return { address, id: patientID };
        })
        .catch(() => ({ address: location, id: patientID }))
        .then((addressObject) => {
          setAddressArray((arr) => {
            const newArr = [...arr];
            newArr[index] = addressObject;
            return newArr;
          });
        });
    }
  }, [monitoringData, setAddressArray]);

  const selectedSession: FormattedOngoingSessionDataType = monitoringData.find(
    (session) => session?.patientID === selectedPatientID
  );

  const isPaused = selectedSession?.paused;
  const isPortalOnly =
    selectedSession?.sessionType === SessionTypeEnums.FullyAssisted;

  const handleCancelSession = () => {
    endPortalTreatment.mutate(
      {
        token: cookies.user.token,
        data: {
          // finished: 1002,
          // patient_id: selectedSession.patientID,
          session_id: selectedSession.sessionID,
        },
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            setAddressArray((arr) =>
              arr.filter((address) => address.id !== selectedPatientID)
            );
            queryClient.setQueriesData(
              'ongoingTreatmentSessions',
              (oldQueryData) => {
                const endedSession = (
                  oldQueryData as FormattedOngoingSessionDataType[]
                ).find(
                  (session) => session.patientID === selectedSession.patientID
                );
                const index = endedSession
                  ? (oldQueryData as FormattedOngoingSessionDataType[]).indexOf(
                      endedSession
                    )
                  : -1;
                (oldQueryData as FormattedOngoingSessionDataType[]).splice(
                  index,
                  1
                );
                return oldQueryData;
              }
            );
            setSessionCancelled(true);
            setCancelSessionModal(false);
            history.push(monitoring);
            if (!monitoringData.length) setSelectedPatientID(null);
            queryClient.invalidateQueries('ongoingTreatmentSessions');
            queryClient.invalidateQueries('unformattedAllPatientData');
          }
        },
        onError: () => {
          setSessionCancelled(false);
          setCancelSessionModal(false);
          toast.error(t('Error.monitoring_cancel_session'), {
            position: 'top-center',
          });
        },
      }
    );
  };

  const handleEndSession = (patientID?: number, sessionID?: string) => {
    if (!endPortalTreatment?.isLoading) {
      endPortalTreatment.mutate(
        {
          token: cookies.user.token,
          data: {
            // finished: 3001,
            // patient_id: patientID ? patientID : selectedSession.patientID,
            session_id: sessionID ? sessionID : selectedSession?.sessionID,
          },
        },
        {
          onSuccess: (response) => {
            if (response.status === 200) {
              setAddressArray((arr) =>
                arr.filter(
                  (address) =>
                    address.id !== (patientID ? patientID : selectedPatientID)
                )
              );
              queryClient.setQueriesData(
                'ongoingTreatmentSessions',
                (oldQueryData) => {
                  const endedSession = (
                    oldQueryData as FormattedOngoingSessionDataType[]
                  ).find(
                    (session) =>
                      session.patientID ===
                      (patientID ? patientID : selectedSession.patientID)
                  );
                  const index = endedSession
                    ? (
                        oldQueryData as FormattedOngoingSessionDataType[]
                      ).indexOf(endedSession)
                    : -1;
                  (oldQueryData as FormattedOngoingSessionDataType[]).splice(
                    index,
                    1
                  );
                  return oldQueryData;
                }
              );
              queryClient.invalidateQueries('ongoingTreatmentSessions');
              queryClient.invalidateQueries('unformattedAllPatientData');
              setActive(false);
              setSelectedPatientID(null);
              if (!monitoringData.length) setSelectedPatientID(null);
              setTreatmentReportPatientID(
                patientID || selectedSession.patientID
              );
              setEndTreatmentModal(
                patientID || selectedSession.patientID ? true : false
              );
            }
          },
          onError: () => {
            toast.error(t('Error.monitoring_end_session'), {
              id: 'end-session-error',
              position: 'bottom-right',
              style: {
                marginBottom: '5rem',
              },
            });
          },
        }
      );
    }
  };

  const updateOngoingTreatment = (patientID: number, paused: boolean) => {
    if (isLoading) {
      setTimeout(() => updateOngoingTreatment(patientID, paused), 100);
      return;
    }
    queryClient.setQueriesData('ongoingTreatmentSessions', (oldQueryData) => {
      const pausedSession = (
        oldQueryData as FormattedOngoingSessionDataType[]
      ).find((session) => session.patientID === patientID);
      if (pausedSession) pausedSession.paused = paused;
      return oldQueryData;
    });
  };

  const handlePauseSession = () => {
    endPortalTreatment.mutate(
      {
        token: cookies.user.token,
        data: {
          // paused: 1,
          // patient_id: selectedSession.patientID,
          session_id: selectedSession.sessionID,
        },
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            updateOngoingTreatment(selectedSession.patientID, true);
          }
        },
        onError: () => {
          toast.error(t('Error.monitoring_pause_session'), {
            id: 'pause-session-error',
            position: 'bottom-right',
            style: {
              marginBottom: '5rem',
            },
          });
        },
        onSettled: () => {
          setTimeout(
            () => queryClient.invalidateQueries('ongoingTreatmentSessions'),
            15000
          );
        },
      }
    );
  };

  const handleResumeSession = () => {
    endPortalTreatment.mutate(
      {
        token: cookies.user.token,
        data: {
          // paused: 0,
          // patient_id: selectedSession.patientID,
          session_id: selectedSession.sessionID,
        },
      },
      {
        onSuccess: (response) => {
          if (response.status === 200) {
            updateOngoingTreatment(selectedSession.patientID, false);
          }
        },
        onError: () => {
          toast.error(t('Error.monitoring_resume_session'), {
            id: 'resume-session-error',
            position: 'bottom-right',
            style: {
              marginBottom: '5rem',
            },
          });
        },
        onSettled: () => {
          setTimeout(
            () => queryClient.invalidateQueries('ongoingTreatmentSessions'),
            15000
          );
        },
      }
    );
  };

  return (
    <div className='h-full max-h-full mx-auto text-black bg-dashboard xl:overflow-hidden'>
      <div className='flex flex-col w-full h-full xl:flex-row'>
        {/* ====================================== LEFT HAND PANEL ===================================================== */}
        <div
          className={`h-full ${isActive ? 'xl:w-[85%] 3xl:w-full' : 'w-full'}`}
        >
          <header className='flex items-center justify-between px-4 py-2.5 font-medium bg-white border border-gray-light box-border'>
            <h1 className='text-base 2xl:text-lg'>
              {t('Monitoring_–_no_side_menu.title')}
            </h1>
            <SortArrow
              handleClick={() => handleSort()}
              text={t('Monitoring_–_no_side_menu.sort_text')}
            />
          </header>
          <main
            ref={treatmentListScrollRef}
            className='h-full pb-16 pr-4 overflow-y-auto text-center monitoringScrollBar xl:pr-0'
          >
            {isLoading && (
              <div className='mt-[10%] flex items-center justify-center mx-auto p-40 px-52 w-full bg-dashboard'>
                <ClipLoader color='#1e477f' size={1.5} />
              </div>
            )}
            {!isLoading && errMsg && (
              <p className='pl-4 mt-5 text-base errorMessage'>{errMsg}</p>
            )}
            {!errMsg &&
              !isLoading &&
              (monitoringData?.length > 0 ? (
                <ActiveTreatmentList
                  t={t}
                  setActive={setActive}
                  addressArray={addressArray}
                  scrollPosition={scrollPosition}
                  handleEndSession={handleEndSession}
                  selectedPatientID={selectedPatientID}
                  setSelectedPatientID={setSelectedPatientID}
                  data={sortedData ? sortedData : monitoringData}
                  treatmentListScrollRef={treatmentListScrollRef}
                />
              ) : (
                <div className='flex flex-col items-center justify-center w-full h-full space-y-8'>
                  <NoActiveSessions className='bg-dashboard' />
                  <p className='w-64 text-2xl font-bold'>
                    {t('monitoring_dashboard.no_active_sessions')}
                  </p>
                  <p className='w-64 text-black-light'>
                    {t('monitoring_dashboard.no_active_sessions_body')}
                  </p>
                </div>
              ))}
          </main>
        </div>
        {/* ====================================== RIGHT HAND PANEL ===================================================== */}
        <div
          ref={containerRef}
          className={`z-10 flex flex-col w-full h-full transition-width duration-150 ease-in ${containerStyle}`}
        >
          <header className='flex justify-between px-4 py-4 font-medium border bg-dashboard border-gray-light xl:py-4'>
            <h1 className='p-0 m-0 text-base 2xl:text-xl'>
              {t('Dashboard.patient_id')}: {selectedPatientID}
            </h1>
            <PushRight
              className='hidden cursor-pointer xl:block'
              onClick={() => {
                setActive(false);
                setSelectedPatientID(null);
              }}
            />
          </header>
          {isActive && isPortalOnly && (
            <Tabs
              showPulse
              setSelected={setTabIndex}
              selected={Math.min(1, tabIndex)}
              onChange={() => (scrollPosition.current = 0)}
              selectedTabClass='!border-blue text-black'
              mainContainer='border-l-2 border-gray-light'
              lastUpdatedTime={`${t('last_updated_time')} ${monitoringData[0]
                ?.lastUpdated}`}
              panelContainer='max-h-[70vh] 3xl:max-h-[74.4vh] border-t border-gray-light text-center'
            >
              <Panel title={t('Monitoring_-_report.link_title')}>
                <SessionReport
                  scrollPosition={scrollPosition}
                  t={t}
                  data={selectedSession}
                  address={
                    addressArray[
                      monitoringData.findIndex(
                        (session) => session.patientID === selectedPatientID
                      )
                    ]?.address
                  }
                />
              </Panel>
              <Panel title={t('Monitoring_-_protocol_link_title')}>
                <SessionProtocol
                  t={t}
                  scrollPosition={scrollPosition}
                  data={selectedSession?.sessionInfo}
                />
              </Panel>
            </Tabs>
          )}{' '}
          {isActive && !isPortalOnly && (
            <Tabs
              selected={tabIndex}
              setSelected={setTabIndex}
              onChange={() => (scrollPosition.current = 0)}
              selectedTabClass='!border-blue text-black'
              mainContainer='border-l-2 border-gray-light'
              panelContainer='max-h-[70vh] 3xl:max-h-[74.4vh] border-t border-gray-light text-center'
            >
              <Panel title={t('Monitoring_-_report.link_title')}>
                <SessionReport
                  t={t}
                  data={selectedSession}
                  scrollPosition={scrollPosition}
                  address={
                    addressArray[
                      monitoringData.findIndex(
                        (session) => session.patientID === selectedPatientID
                      )
                    ]?.address
                  }
                />
              </Panel>
              <Panel title={t('Monitoring_-_report.link_title.session_steps')}>
                <SessionSteps
                  t={t}
                  isPaused={isPaused ? 1 : 0}
                  scrollPosition={scrollPosition}
                  data={selectedSession?.sessionInfo}
                />
              </Panel>
              <Panel title={t('Monitoring_-_protocol_link_title')}>
                <SessionProtocol
                  t={t}
                  scrollPosition={scrollPosition}
                  data={selectedSession?.sessionInfo}
                />
              </Panel>
            </Tabs>
          )}
          <footer
            className='fixed z-20 bottom-0.5 px-3 text-sm bg-dashboard border-l-2 border-t-2 border-gray-light overflow-x-hidden'
            style={{ width: `${footerWidth}px` }}
          >
            {isPortalOnly && (
              <div className='flex items-center justify-end w-full py-2 space-x-4 2xl:py-3'>
                {endPortalTreatment?.isLoading && (
                  <ClipLoader color='#1e477f' size={1} />
                )}
                {isPaused ? (
                  <ResumeButton
                    alt={t('Resume_Session')}
                    text={t('Resume_Session')}
                    onClick={() => handleResumeSession()}
                    disabled={endPortalTreatment?.isLoading}
                    className='border-2 2xl:text-base bg-blue border-blue'
                    icon={ResumeIcon}
                  />
                ) : (
                  <PauseButton
                    alt={t('Pause_Session')}
                    text={t('Pause_Session')}
                    onClick={() => handlePauseSession()}
                    disabled={endPortalTreatment?.isLoading}
                    className='border-2 2xl:text-base bg-blue border-blue'
                    icon={PauseIcon}
                  />
                )}

                <CancelSession
                  onClick={() => setCancelSessionModal(true)}
                  className='2xl:text-base'
                  text={t('Monitoring_-_report.text')}
                  disabled={endPortalTreatment?.isLoading}
                  alt={t('Monitoring_-_report.text')}
                  variant='blue'
                />
                {selectedSession?.ppixPercent >= 100 && (
                  <EndSessionButton
                    text={t('End_Session')}
                    onClick={() => handleEndSession()}
                    disabled={endPortalTreatment?.isLoading}
                    className='border-2 2xl:text-base bg-orange border-SmartPDTorange'
                  />
                )}
              </div>
            )}
            {!isPortalOnly && (
              <div className='flex items-center justify-end w-full h-12 py-2 space-x-4 2xl:py-3'>
                {endPortalTreatment?.isLoading && (
                  <ClipLoader color='#1e477f' size={1} />
                )}
                {
                  //*TODO: TO be re-added once cancelling sessions works with apps
                }
                {/* <CancelSession
                  onClick={() => setCancelSessionModal(true)}
                  className='2xl:text-base'
                  text={t('Monitoring_-_report.text')}
                  disabled={endPortalTreatment?.isLoading}
                  alt={t('Monitoring_-_report.text')}
                  variant='blue'
                /> */}
              </div>
            )}
          </footer>
        </div>
      </div>
      <Modal
        overflow='visible'
        isVisible={cancelSessionModal}
        setVisible={setCancelSessionModal}
        modalContent={
          <CancelSessionModal
            t={t}
            isPortalOnly={isPortalOnly}
            sessionCancelled={sessionCancelled}
            isLoading={endPortalTreatment?.isLoading}
            handleCancelSession={handleCancelSession}
            setCancelSessionModal={setCancelSessionModal}
          />
        }
      />
      <Modal
        overflow='visible'
        isVisible={endTreatmentModal}
        setVisible={setEndTreatmentModal}
        modalContent={
          <TreatmentFinishedModal
            t={t}
            history={history}
            selectedPatientID={treatmentReportPatientID}
          />
        }
      />
    </div>
  );
}
