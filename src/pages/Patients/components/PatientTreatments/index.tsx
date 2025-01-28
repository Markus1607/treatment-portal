import { AppProvider } from 'AppProvider';
import useResizeObserver from 'use-resize-observer';
import { Panel, Tabs } from '~/components/TabPanel';
import { useEffect, useRef, useState } from 'react';
import { FormatSessionCardInfoType } from './api/format';
import SessionProtocol from './components/SessionProtocol';
import { SessionStateEnums } from '../PatientSchedule/api/query.d';
import {
  useUpdateSessionProgress,
  useSelectedSessionDetails,
  useOngoingSessionReportData,
  useAllNatDytPatientTreatments,
  useCompletedTreatmentReportData,
} from './api/query';
import SessionReport from './components/SessionReport';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SessionCardInfo } from './components/SessionCardInfo';
import CertificatePreview from './components/CertificatePreview';
import ProtocolAdherence from './components/ProtocolAdherence';
import TreatmentDetailsFooter from './components/TreatmentDetailsFooter';
import CompletedSessionReport from './components/CompletedSessionReport';
import { FinishedReasonsEnums, SessionTypeEnums } from '~/utils/options.d';
import { NoTreatmentAvailableCard } from './components/NoTreatmentAvailableCard';
import CompletedTreatmentDetails from './components/CompletedTreatmentDetails';
import TreatmentInformationPDFPreview from './components/TreatmentInformationPDFPreview';

export type PatientTreatmentsProps = {
  patientUid: string;
  setSubTitle: (value: string) => void;
};

export default function PatientTreatments({
  patientUid,
  setSubTitle,
}: PatientTreatmentsProps) {
  const scrollPosition = useRef(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [isActive, setActive] = useState(false);
  const [pdfGenerationError, setPdfGenerationError] = useState(false);
  const containerStyle = isActive
    ? 'block xl:w-full'
    : 'hidden xl:w-[0px] xl:block';
  const { ref: containerRef, width: footerWidth } = useResizeObserver();

  const {
    t,
    cookies: { user },
  } = AppProvider.useContainer();
  const [selectedTreatmentData, setSelectedTreatmentData] =
    useState<FormatSessionCardInfoType | null>(null);

  //* Get all treatments
  const { isLoading: isLoadingAllNatDyTreatments, data: allNatDyTreatments } =
    useAllNatDytPatientTreatments({
      token: user.token,
      patientUid: patientUid,
    });

  //* Get selected treatment details
  const { data: selectedSessionDetails } = useSelectedSessionDetails(
    user.token,
    selectedTreatmentData?.sessionUid || ''
  );

  useEffect(
    () => setSubTitle(t('Patient_details.Treatments')),
    [t, setSubTitle]
  );

  //* Treatment state boolean flags
  const isScheduledTreatment =
    !!selectedTreatmentData &&
    selectedTreatmentData?.sessionState === SessionStateEnums.SCHEDULED;
  const isOngoingTreatment =
    !!selectedTreatmentData &&
    selectedTreatmentData?.sessionState === SessionStateEnums.RUNNING;
  const isPausedSession =
    !!selectedTreatmentData &&
    selectedTreatmentData?.sessionState === SessionStateEnums.PAUSED;
  const isCompletedTreatment =
    !!selectedTreatmentData &&
    selectedTreatmentData?.finishedReason === FinishedReasonsEnums.Complete;
  const isCancelledTreatment =
    !!selectedTreatmentData &&
    selectedTreatmentData.sessionState === SessionStateEnums.COMPLETED &&
    selectedTreatmentData?.finishedReason !== FinishedReasonsEnums.Complete;

  //* Fully assisted selected session
  const isFullyAssistedTreatment =
    !!selectedSessionDetails &&
    'sessionType' in selectedSessionDetails &&
    selectedSessionDetails?.sessionType === SessionTypeEnums.FullyAssisted;

  //* Get ongoing session report data
  const { data: ongoingSessionReportData } = useOngoingSessionReportData(
    user.token,
    selectedTreatmentData?.sessionUid || '',
    isOngoingTreatment || isPausedSession,
    selectedTreatmentData?.pauseStartTime || null
  );

  //* Get current ppix dose for ongoing treatment
  const ppixDosePercentage =
    ongoingSessionReportData && 'scientificReport' in ongoingSessionReportData
      ? ongoingSessionReportData?.scientificReport?.ppixPercent
      : null;

  // Get last update ongoing session time
  const lastUpdatedOngoingSessionTime =
    ongoingSessionReportData && 'lastUpdatedTime' in ongoingSessionReportData
      ? ongoingSessionReportData.lastUpdatedTime
      : selectedTreatmentData?.lastUpdateTime;

  //* Fetch and update fully assisted session progress
  useUpdateSessionProgress(
    user.token,
    selectedTreatmentData?.sessionUid || '',
    isOngoingTreatment && isFullyAssistedTreatment && isPausedSession === false
  );

  //* Get completed session report data
  const {
    isLoading: isLoadingCompletedSessionData,
    data: completedSessionData,
  } = useCompletedTreatmentReportData(
    user.token,
    selectedTreatmentData?.sessionUid || '',
    isCompletedTreatment
  );

  //* Check if treatment data is available
  const isTreatmentDataAvailable =
    !!allNatDyTreatments &&
    Array.isArray(allNatDyTreatments) &&
    allNatDyTreatments?.length > 0;

  //* Set active treatment data if available
  useEffect(() => {
    if (isTreatmentDataAvailable) {
      setTabIndex(0);
      setActive(true);
      const highlightedTreatment = allNatDyTreatments[0];
      setSelectedTreatmentData(highlightedTreatment);
    } else {
      setActive(false);
      setSelectedTreatmentData(null);
    }
  }, [isTreatmentDataAvailable, allNatDyTreatments]);

  return (
    <div className='h-full max-h-full mx-auto text-black xl:overflow-hidden'>
      <div className='flex flex-col w-full h-full gap-6 xl:flex-row xl:gap-0'>
        {/* Left hand side panel */}
        <section
          className={`${
            isActive ? 'min-w-[30rem] xl:w-4/5 w-full' : 'w-full'
          } h-full`}
        >
          {isLoadingAllNatDyTreatments && <LoadingSpinner />}

          {!isTreatmentDataAvailable && <NoTreatmentAvailableCard />}

          {!!isTreatmentDataAvailable && (
            <main className='h-[20rem] xl:h-full xl:max-h-full overflow-y-scroll w-full'>
              {allNatDyTreatments.map((treatment) => (
                <div
                  key={treatment.sessionUid}
                  onClick={() => {
                    setTabIndex(0);
                    setSelectedTreatmentData(treatment);
                  }}
                  className={`w-full transition-transform bg-white border-2 cursor-pointer active:scale-95 ${
                    treatment.sessionUid === selectedTreatmentData?.sessionUid
                      ? 'border-blue-800 bg-dashboard/10 sticky top-0 bottom-0'
                      : 'border-blue-dark/10 hover:bg-dashboard/10'
                  }`}
                >
                  <SessionCardInfo {...treatment} />
                </div>
              ))}
            </main>
          )}
        </section>

        {/* Right hand side panel */}
        <section
          ref={containerRef}
          className={`z-10 flex flex-col w-full h-full transition-width duration-100 ease-in ${containerStyle}`}
        >
          {isActive && (
            <>
              {isScheduledTreatment && (
                <Tabs
                  showPulse={false}
                  selected={tabIndex}
                  setSelected={setTabIndex}
                  onChange={() => (scrollPosition.current = 0)}
                  selectedTabClass='!border-blue text-black'
                  mainContainer='border-l-2 border-gray-light'
                  panelContainer='max-h-[70vh] 3xl:max-h-[81.5vh] border-t border-gray-light text-center'
                >
                  <Panel title={t('treatment_information')}>
                    <TreatmentInformationPDFPreview
                      isEnabled
                      key={selectedTreatmentData?.sessionUid}
                      selectedTreatmentData={selectedTreatmentData}
                    />
                  </Panel>

                  <Panel title={t('Monitoring_-_protocol_link_title')}>
                    <SessionProtocol
                      t={t}
                      data={
                        selectedSessionDetails &&
                        'protocolDetails' in selectedSessionDetails
                          ? selectedSessionDetails
                          : null
                      }
                      scrollPosition={scrollPosition}
                    />
                  </Panel>
                </Tabs>
              )}

              {(isOngoingTreatment || isPausedSession) &&
                !isFullyAssistedTreatment && (
                  <Tabs
                    showPulse
                    selected={tabIndex}
                    setSelected={setTabIndex}
                    selectedTabClass='!border-blue text-black'
                    mainContainer='border-l-2 border-gray-light'
                    onChange={() => (scrollPosition.current = 0)}
                    lastUpdatedTime={lastUpdatedOngoingSessionTime}
                    panelContainer='max-h-[70vh] 3xl:max-h-[81.5vh] border-t border-gray-light text-center'
                  >
                    <Panel title={t('Monitoring_-_report.link_title')}>
                      <SessionReport
                        t={t}
                        patientUid={patientUid}
                        scrollPosition={scrollPosition}
                        sessionInfo={selectedTreatmentData}
                        data={
                          ongoingSessionReportData &&
                          'scientificReport' in ongoingSessionReportData
                            ? ongoingSessionReportData?.scientificReport
                            : null
                        }
                      />
                    </Panel>

                    <Panel title={t('treatment_information')}>
                      <TreatmentInformationPDFPreview
                        isEnabled
                        key={selectedTreatmentData?.sessionUid}
                        selectedTreatmentData={selectedTreatmentData}
                      />
                    </Panel>

                    <Panel title={t('Monitoring_-_protocol_link_title')}>
                      <SessionProtocol
                        t={t}
                        data={
                          selectedSessionDetails &&
                          'protocolDetails' in selectedSessionDetails
                            ? selectedSessionDetails
                            : null
                        }
                        scrollPosition={scrollPosition}
                      />
                    </Panel>
                  </Tabs>
                )}

              {(isOngoingTreatment || isPausedSession) &&
                isFullyAssistedTreatment && (
                  <Tabs
                    showPulse
                    selected={tabIndex}
                    setSelected={setTabIndex}
                    selectedTabClass='!border-blue text-black'
                    mainContainer='border-l-2 border-gray-light'
                    onChange={() => (scrollPosition.current = 0)}
                    lastUpdatedTime={lastUpdatedOngoingSessionTime}
                    panelContainer='max-h-[70vh] 3xl:max-h-[81.5vh] border-t border-gray-light text-center'
                  >
                    <Panel title={t('Monitoring_-_report.link_title')}>
                      <SessionReport
                        t={t}
                        patientUid={patientUid}
                        scrollPosition={scrollPosition}
                        sessionInfo={selectedTreatmentData}
                        data={
                          ongoingSessionReportData &&
                          'scientificReport' in ongoingSessionReportData
                            ? ongoingSessionReportData?.scientificReport
                            : null
                        }
                      />
                    </Panel>

                    <Panel title={t('treatment_information')}>
                      <TreatmentInformationPDFPreview
                        isEnabled
                        key={selectedTreatmentData?.sessionUid}
                        selectedTreatmentData={selectedTreatmentData}
                      />
                    </Panel>

                    <Panel title={t('Monitoring_-_protocol_link_title')}>
                      <SessionProtocol
                        t={t}
                        data={
                          selectedSessionDetails &&
                          'protocolDetails' in selectedSessionDetails
                            ? selectedSessionDetails
                            : null
                        }
                        scrollPosition={scrollPosition}
                      />
                    </Panel>
                  </Tabs>
                )}

              {isCompletedTreatment && isFullyAssistedTreatment && (
                <Tabs
                  selected={tabIndex}
                  setSelected={setTabIndex}
                  onChange={() => (scrollPosition.current = 0)}
                  selectedTabClass='!border-blue text-black'
                  mainContainer='border-l-2 border-gray-light'
                  panelContainer='max-h-[70vh] 3xl:max-h-[81.5vh] border-t border-gray-light text-center'
                >
                  <Panel title={t('Monitoring_-_report.link_title')}>
                    <CompletedTreatmentDetails
                      sessionInfo={selectedTreatmentData}
                      data={
                        completedSessionData &&
                        'sessionInfo' in completedSessionData
                          ? completedSessionData?.sessionInfo
                          : null
                      }
                      isFullyAssistedTreatment={isFullyAssistedTreatment}
                    />

                    <CompletedSessionReport
                      t={t}
                      isLoading={isLoadingCompletedSessionData}
                      data={
                        completedSessionData &&
                        'scientificReport' in completedSessionData
                          ? completedSessionData?.scientificReport
                          : null
                      }
                    />
                  </Panel>

                  <Panel title={t('Patient_Records–protocol.adherence')}>
                    <ProtocolAdherence
                      t={t}
                      data={
                        completedSessionData &&
                        'protocolAdherenceData' in completedSessionData
                          ? completedSessionData?.protocolAdherenceData
                          : null
                      }
                      selectedTreatmentData={selectedTreatmentData}
                    />
                  </Panel>

                  <Panel title={t('Monitoring_-_protocol_link_title')}>
                    <SessionProtocol
                      t={t}
                      data={
                        selectedSessionDetails &&
                        'protocolDetails' in selectedSessionDetails
                          ? selectedSessionDetails
                          : null
                      }
                      scrollPosition={scrollPosition}
                    />
                  </Panel>

                  <Panel title={t('treatment_information')}>
                    <TreatmentInformationPDFPreview
                      isEnabled
                      key={selectedTreatmentData?.sessionUid}
                      selectedTreatmentData={selectedTreatmentData}
                    />
                  </Panel>

                  <Panel title={t('patient_certificate')}>
                    <CertificatePreview
                      isCompletedTreatment
                      pdfGenerationError={pdfGenerationError}
                      setPdfGenerationError={setPdfGenerationError}
                      selectedTreatmentData={selectedTreatmentData}
                    />
                  </Panel>
                </Tabs>
              )}

              {isCompletedTreatment && !isFullyAssistedTreatment && (
                <Tabs
                  selected={tabIndex}
                  setSelected={setTabIndex}
                  onChange={() => (scrollPosition.current = 0)}
                  selectedTabClass='!border-blue text-black'
                  mainContainer='border-l-2 border-gray-light max-w-full'
                  panelContainer='max-h-[70vh] 3xl:max-h-[81.5vh] border-t border-gray-light text-center'
                >
                  <Panel title={t('Monitoring_-_report.link_title')}>
                    <CompletedTreatmentDetails
                      sessionInfo={selectedTreatmentData}
                      data={
                        completedSessionData &&
                        'sessionInfo' in completedSessionData
                          ? completedSessionData?.sessionInfo
                          : null
                      }
                    />

                    <CompletedSessionReport
                      t={t}
                      isLoading={isLoadingCompletedSessionData}
                      data={
                        completedSessionData &&
                        'scientificReport' in completedSessionData
                          ? completedSessionData?.scientificReport
                          : null
                      }
                    />
                  </Panel>

                  <Panel title={t('Patient_Records–protocol.adherence')}>
                    <ProtocolAdherence
                      t={t}
                      data={
                        completedSessionData &&
                        'protocolAdherenceData' in completedSessionData
                          ? completedSessionData?.protocolAdherenceData
                          : null
                      }
                      selectedTreatmentData={selectedTreatmentData}
                    />
                  </Panel>

                  <Panel title={t('Monitoring_-_protocol_link_title')}>
                    <SessionProtocol
                      t={t}
                      data={
                        selectedSessionDetails &&
                        'protocolDetails' in selectedSessionDetails
                          ? selectedSessionDetails
                          : null
                      }
                      scrollPosition={scrollPosition}
                    />
                  </Panel>

                  <Panel title={t('treatment_information')}>
                    <TreatmentInformationPDFPreview
                      isEnabled
                      key={selectedTreatmentData?.sessionUid}
                      selectedTreatmentData={selectedTreatmentData}
                    />
                  </Panel>

                  <Panel title={t('patient_certificate')}>
                    <CertificatePreview
                      isCompletedTreatment
                      pdfGenerationError={pdfGenerationError}
                      setPdfGenerationError={setPdfGenerationError}
                      selectedTreatmentData={selectedTreatmentData}
                    />
                  </Panel>
                </Tabs>
              )}

              {isCancelledTreatment && (
                <Tabs
                  selected={tabIndex}
                  setSelected={setTabIndex}
                  onChange={() => (scrollPosition.current = 0)}
                  selectedTabClass='!border-blue text-black'
                  mainContainer='border-l-2 border-gray-light'
                  panelContainer='max-h-[70vh] 3xl:max-h-[81.5vh] border-t border-gray-light text-center'
                >
                  <Panel title={t('treatment_information')}>
                    <TreatmentInformationPDFPreview
                      isEnabled
                      key={selectedTreatmentData?.sessionUid}
                      selectedTreatmentData={selectedTreatmentData}
                    />
                  </Panel>

                  <Panel title={t('Monitoring_-_protocol_link_title')}>
                    <SessionProtocol
                      t={t}
                      data={
                        selectedSessionDetails &&
                        'protocolDetails' in selectedSessionDetails
                          ? selectedSessionDetails
                          : null
                      }
                      scrollPosition={scrollPosition}
                    />
                  </Panel>
                </Tabs>
              )}
            </>
          )}

          <TreatmentDetailsFooter
            tabIndex={tabIndex}
            footerWidth={footerWidth}
            ppixDosePercentage={ppixDosePercentage}
            pdfGenerationError={pdfGenerationError}
            isOngoingTreatment={isOngoingTreatment}
            isScheduledTreatment={isScheduledTreatment}
            selectedTreatmentData={selectedTreatmentData}
            isFullyAssistedTreatment={isFullyAssistedTreatment}
          />
        </section>
      </div>
    </div>
  );
}
