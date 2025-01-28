import {
  CancelSession,
  RescheduleButton,
  NoIconButton as EndSessionButton,
  RescheduleButton as PauseResumeButton,
  RescheduleButton as BeginTreatmentButton,
} from '~/components/Forms/Buttons';
import toast from 'react-hot-toast';
import { ReactComponent as RegenerateIcon } from 'assets/images/ic_regenerate.svg';
import ResumeIcon from 'assets/images/ic_resume.svg';
import PauseIcon from 'assets/images/ic_pause.svg';
import { AppProvider } from '~/AppProvider';
import beginTreatmentIcon from 'assets/images/ic_begin_btn.svg';
import { FormatSessionCardInfoType } from '../api/format';
import { AxiosError } from 'axios';
import {
  useBeginTreatment,
  useCancelTreatment,
} from '~/pages/Schedule/components/Calendar/Modals/api/query';
import CancelSessionModal from '~/pages/Schedule/components/Calendar/Modals/CancelSessionModal';
import { useEffect, useState } from 'react';
import Modal from '~/components/Modals/Modal';
import { useQueryClient } from 'react-query';
import {
  pauseOngoingSession,
  useEndPortalTreatment,
  generateTreatmentCertificate,
  useStaffCancelOngoingSession,
} from '../api/query';
import { SessionStateEnums } from '../../PatientSchedule/api/query.d';
import { ClipLoader } from '~/components/Loader';
import { isNumber } from 'lodash';
import { patients, schedule } from '~/routes';
import { useHistory } from 'react-router-dom';
import { beginTreatmentDataType } from '~/pages/Schedule/components/Calendar/Modals/api/format.d';
import { FinishedReasonsEnums } from '~/utils/options.d';
import { getUserLanguage } from '~/utils/functions';

export type TreatmentFooterProps = {
  tabIndex: number;
  isOngoingTreatment: boolean;
  isScheduledTreatment: boolean;
  footerWidth: number | undefined;
  pdfGenerationError: boolean;
  ppixDosePercentage: number | null;
  isFullyAssistedTreatment: boolean;
  selectedTreatmentData: FormatSessionCardInfoType | null;
};

export default function TreatmentDetailsFooter({
  tabIndex,
  footerWidth,
  isOngoingTreatment,
  pdfGenerationError,
  ppixDosePercentage,
  isScheduledTreatment,
  selectedTreatmentData,
  isFullyAssistedTreatment,
}: TreatmentFooterProps) {
  const history = useHistory();
  const lang = getUserLanguage();
  const queryClient = useQueryClient();
  const cancelTreatment = useCancelTreatment();
  const endOngoingSession = useEndPortalTreatment();
  const beginPortalOnlySession = useBeginTreatment();
  const cancelOngoingSession = useStaffCancelOngoingSession();

  const [showPauseBtn, setShowPauseBtn] = useState(true);
  const [cancelSessionModal, setCancelSessionModal] = useState(false);

  const isSessionPaused =
    selectedTreatmentData?.sessionState === SessionStateEnums.PAUSED;

  //* Only show end session button if session ppix dose percentage is 100 or above
  const showEndSessionBtn =
    isOngoingTreatment && ppixDosePercentage && isNumber(ppixDosePercentage)
      ? ppixDosePercentage >= 100
      : false;

  const isCompletedSession =
    selectedTreatmentData &&
    selectedTreatmentData.sessionState === SessionStateEnums.COMPLETED;

  const isSuccessfullyCompletedTreatment =
    !!selectedTreatmentData &&
    selectedTreatmentData?.finishedReason === FinishedReasonsEnums.Complete;

  const {
    t,
    cookies: { user },
    currentPatientUsername,
  } = AppProvider.useContainer();

  useEffect(() => {
    if (isSessionPaused) setShowPauseBtn(false);
  }, [isSessionPaused]);

  const handleCancelTreatment = () => {
    if (!selectedTreatmentData) return;

    cancelTreatment.mutate(
      {
        token: user.token,
        data: {
          sessionId: selectedTreatmentData.sessionUid,
        },
      },
      {
        onSuccess: () => {
          setCancelSessionModal(false);
          queryClient.invalidateQueries('all-patient-treatments');
        },

        onError: (err: AxiosError) => {
          cancelTreatment.reset();
          setCancelSessionModal(false);
          if (err?.response?.data) {
            console.error(err?.response?.data.error);
            toast.error(t('Error_unknown'));
          } else {
            console.error(err.message);
            toast.error(t('Error.server_down_error'));
          }
        },
      }
    );
  };

  //* Thi endpoint can be called to both pause and resume the treatment
  const handlePauseResumeSession = async () => {
    if (!selectedTreatmentData) return;

    const pauseOrResumeSession = await pauseOngoingSession(
      user.token,
      selectedTreatmentData.sessionUid
    );

    if ('success' in pauseOrResumeSession && pauseOrResumeSession.success) {
      setShowPauseBtn(!showPauseBtn);
      toast.success(t('success'), {
        position: 'bottom-right',
        style: {
          marginRight: '2rem',
          marginBottom: '3.2rem',
        },
      });
      queryClient.invalidateQueries('all-patient-treatments');
      queryClient.invalidateQueries('selected-session-report-data');
    } else {
      setShowPauseBtn(!showPauseBtn);
      toast.error(t('Error_unknown'), {
        position: 'bottom-right',
        style: {
          marginRight: '2rem',
          marginBottom: '3.2rem',
        },
      });
      console.error(pauseOrResumeSession);
    }
  };

  const handleEndOngoingSession = () => {
    if (!selectedTreatmentData) return;

    endOngoingSession.mutate(
      {
        token: user.token,
        data: {
          sessionId: selectedTreatmentData.sessionUid,
        },
      },
      {
        onSuccess: () => {
          setCancelSessionModal(false);
          queryClient.invalidateQueries('all-patient-treatments');
        },
        onError: (err: AxiosError) => {
          setCancelSessionModal(false);
          endOngoingSession.reset();
          if (err?.response?.data) {
            console.error(err?.response?.data.error);
            toast.error(t('Error_unknown'));
          } else {
            console.error(err.message);
            toast.error(t('Error.server_down_error'));
          }
        },
      }
    );
  };

  const handleStaffCancelOngoingSession = () => {
    if (!selectedTreatmentData) return;

    cancelOngoingSession.mutate(
      {
        token: user.token,
        data: {
          sessionId: selectedTreatmentData.sessionUid,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('success'), {
            duration: 2500,
            position: 'bottom-center',
            style: {
              marginBottom: '2rem',
            },
          });
          setCancelSessionModal(false);
          queryClient.invalidateQueries('all-patient-treatments');
        },
        onError: (err: AxiosError) => {
          cancelOngoingSession.reset();
          setCancelSessionModal(false);
          if (err?.response?.data) {
            console.error(err?.response?.data.error);
            toast.error(t('Error_unknown'));
          } else {
            console.error(err.message);
            toast.error(t('Error.server_down_error'));
          }
        },
      }
    );
  };

  const handleBeginTreatment = (data: beginTreatmentDataType) => {
    if (!beginPortalOnlySession?.isLoading) {
      beginPortalOnlySession.mutate(
        {
          token: user.token,
          data,
        },
        {
          onSuccess: () => {
            toast.success(t('treatment_started.heading'));
            queryClient.invalidateQueries('all-patient-treatments');
          },

          onError: (response) => {
            console.error(response);
            toast.error(t('Error.treatment_start_failed'));
          },
        }
      );
    }
  };

  return (
    <>
      {!isCompletedSession && (
        <footer
          className='fixed z-20 bottom-0.5 px-3 text-sm bg-dashboard border-l-2 border-t-2 border-gray-light overflow-x-hidden'
          style={{ width: `${footerWidth}px` }}
        >
          <div
            className={`items-center w-full ${
              footerWidth && footerWidth > 10 ? 'flex' : 'hidden'
            }`}
          >
            <div className='flex items-center'>
              {(endOngoingSession?.isLoading ||
                cancelTreatment?.isLoading ||
                beginPortalOnlySession?.isLoading) && (
                <ClipLoader color='#1e477f' size={0.5} />
              )}
            </div>

            <div
              className={`items-center justify-end w-full py-2 space-x-4 2xl:py-3 ${
                footerWidth && footerWidth > 10 ? 'flex' : 'hidden'
              }`}
            >
              <CancelSession
                onClick={() => setCancelSessionModal(true)}
                className='2xl:text-base active:scale-95'
                text={t('Monitoring_-_report.text')}
                alt={t('Monitoring_-_report.text')}
              />

              {isScheduledTreatment && (
                <RescheduleButton
                  alt={t('Reschedule_session_button')}
                  text={t('Reschedule_session_button')}
                  className='2xl:text-base active:scale-95'
                  onClick={() =>
                    history.push(
                      `${patients}/${currentPatientUsername}/${schedule}`
                    )
                  }
                />
              )}

              {isScheduledTreatment &&
                isFullyAssistedTreatment &&
                selectedTreatmentData?.isTreatmentReadyToBegin &&
                !selectedTreatmentData?.isTreatmentOverdue && (
                  <BeginTreatmentButton
                    className='bg-orange'
                    alt={t('button.begin_treatment')}
                    text={t('button.begin_treatment')}
                    isRequestLoading={beginPortalOnlySession?.isLoading}
                    disabled={beginPortalOnlySession?.isLoading}
                    onClick={() => {
                      handleBeginTreatment({
                        session_id: selectedTreatmentData.sessionUid,
                      });
                    }}
                    icon={beginTreatmentIcon}
                  />
                )}

              {(isOngoingTreatment || !showPauseBtn) &&
                isFullyAssistedTreatment && (
                  <PauseResumeButton
                    icon={showPauseBtn ? PauseIcon : ResumeIcon}
                    alt={
                      showPauseBtn ? t('Pause_Session') : t('Resume_Session')
                    }
                    text={
                      showPauseBtn ? t('Pause_Session') : t('Resume_Session')
                    }
                    onClick={() => handlePauseResumeSession()}
                    // disabled={pauseOngoingSession?.isLoading}
                    className={`border-2 2xl:text-base ${
                      showPauseBtn
                        ? 'bg-blue border-blue'
                        : 'bg-orange border-SmartPDTorange'
                    } active:scale-95`}
                  />
                )}

              {showEndSessionBtn && (
                <EndSessionButton
                  text={t('End_Session')}
                  disabled={endOngoingSession?.isLoading}
                  onClick={() => handleEndOngoingSession()}
                  className='border-2 2xl:text-base bg-orange border-SmartPDTorange active:scale-95'
                />
              )}
            </div>
          </div>
        </footer>
      )}

      {isSuccessfullyCompletedTreatment &&
        !pdfGenerationError &&
        tabIndex === 4 && (
          <footer
            className='fixed bottom-0 z-20 px-3 overflow-x-hidden text-sm border-t-2 border-l-2 bg-dashboard border-gray-light'
            style={{ width: `${footerWidth}px` }}
          >
            <div
              className={`items-center w-full h-full py-3 ${
                footerWidth && footerWidth > 10
                  ? 'flex flex-row-reverse'
                  : 'hidden'
              }`}
            >
              <button
                type='button'
                onClick={() => {
                  generateTreatmentCertificate(
                    user.token,
                    selectedTreatmentData?.sessionUid || '',
                    lang
                  )
                    .then(() => {
                      queryClient.invalidateQueries(
                        'get-treatment-certificate'
                      );
                      setTimeout(() => {
                        queryClient.invalidateQueries(
                          'get-treatment-certificate'
                        );
                      }, 4000);
                    })
                    .catch((err) => {
                      console.error(err);
                      queryClient.invalidateQueries(
                        'get-treatment-certificate'
                      );
                    });
                }}
                className='flex gap-1 items-center justify-center px-2 4xl:px-2.5 py-1.5 4xl:py-2 text-white text-xs 4xl:text-[0.95rem] hover:bg-blue-dark/90 bg-blue-dark cursor-pointer rounded-md  active:scale-95'
              >
                <span className='self-center scale-90'>
                  <RegenerateIcon />
                </span>
                <span className='flex-shrink-0'>
                  {t('regenerate_certificate')}
                </span>
              </button>
            </div>
          </footer>
        )}
      <Modal
        isVisible={cancelSessionModal}
        setVisible={setCancelSessionModal}
        modalContent={
          <CancelSessionModal
            t={t}
            isCancelling={
              cancelTreatment?.isLoading || cancelOngoingSession?.isLoading
            }
            sessionCancelled={
              cancelTreatment?.isSuccess || cancelOngoingSession?.isSuccess
            }
            setCancelSessionModal={setCancelSessionModal}
            onCancelFunction={
              isSessionPaused || isOngoingTreatment
                ? handleStaffCancelOngoingSession
                : handleCancelTreatment
            }
            isInProgressTreatment={isSessionPaused || isOngoingTreatment}
          />
        }
      />
    </>
  );
}
