import moment from 'moment';
import { useMutation, useQuery } from 'react-query';
import { ProtocolTypeEnums } from '~/pages/Protocol/api/api.d';
import {
  stopSessionEndpoint,
  sessionDetailsEndpoint,
  getOngoingSessionReport,
  getAllTreatmentSessions,
  updateSessionProgressEndpoint,
  getCompletedTreatmentReport,
  pauseSessionEndpoint,
  patientCertificate,
  treatmentInformation,
} from '~/routes';
import apiServer from '~/server/apiServer';
import {
  OngoingSessionReport,
  AllNatDypdTreatments,
  ProgressReportDataType,
  CompletedTreatmentReportType,
  GenerateCertificatePostResponse,
  GetCertificateResponse,
} from './api.types';
import {
  SessionStepsDataType,
  formatSessionCardInfo,
  formatSessionStepsInfo,
  FormatSessionCardInfoType,
  formatOngoingSessionReport,
  OngoingSessionReportDataType,
  formatCompletedSessionReport,
  CompletedSessionReportDataType,
  formatCompletedProtocolAdherence,
  CompletedProtocolAdherenceDataType,
  formatCompletedSessionInfo,
  CompletedSessionInfoDataType,
} from './format';
import { SessionDetailsResponseType } from '../../PatientSchedule/api/query.d';
import {
  NatPDTSessionDetailsType,
  formatNatPDTSessionDetails,
} from '../../PatientSchedule/api/format';
import { sortNatDypdTreatments } from './utils';
import { AxiosError, AxiosResponse } from 'axios';
import { FinishedReasonsEnums } from '~/utils/options.d';

//* Update progress interval in milliseconds
const UPDATE_PROGRESS_INTERVAL_MS = 5000;

export type GetPatientTreatmentsType = {
  token: string;
  patientUid: string;
  signal?: AbortSignal;
};

//* All patient treatments query
export const useAllNatDytPatientTreatments = ({
  token,
  patientUid,
}: GetPatientTreatmentsType) => {
  return useQuery<Array<FormatSessionCardInfoType> | { error: string }>(
    ['all-patient-treatments', token, patientUid],
    async ({ signal }) =>
      await fetchAllNatDytPatientTreatments({ token, patientUid, signal }),
    {
      refetchOnWindowFocus: false,
    }
  );
};

//* Fetch all nat-dypdt patient treatments
export const fetchAllNatDytPatientTreatments = ({
  token,
  signal,
  patientUid,
}: GetPatientTreatmentsType) => {
  return apiServer
    .get<AllNatDypdTreatments>(`${getAllTreatmentSessions(patientUid)}`, {
      signal,
      headers: {
        'x-access-tokens': token,
      },
      params: {
        treatment_type: ProtocolTypeEnums.NATDYPDT,
      },
    })
    .then(({ data }) => {
      //sort sessions based on state
      const sortedData = sortNatDypdTreatments(data);
      return sortedData.sessions.map((session) =>
        formatSessionCardInfo(session)
      );
    })
    .catch((err) => {
      if (err.response?.data) {
        return err.response.data;
      }
      return { error: err.message };
    });
};

//* Update fully assisted session progress query
export const useUpdateSessionProgress = (
  token: string,
  sessionUid: string,
  isEnabled: boolean
) => {
  return useQuery<ProgressReportDataType | { error: string }>(
    ['update-session-progress', token, sessionUid, isEnabled],
    async ({ signal }) =>
      await updateOngoingSessionProgress(token, sessionUid, signal),
    {
      enabled: !!sessionUid && isEnabled,
      refetchInterval: UPDATE_PROGRESS_INTERVAL_MS,
    }
  );
};

//* Update treatment progress fetch call
export const updateOngoingSessionProgress = async (
  token: string,
  sessionUid: string,
  signal?: AbortSignal
): Promise<ProgressReportDataType | { error: string }> =>
  await apiServer
    .get(`${updateSessionProgressEndpoint(sessionUid)}`, {
      signal,
      headers: {
        'x-access-tokens': token,
      },
    })
    .then(({ data }) => data)
    .catch((err) => {
      if (err.response?.data) {
        return err.response.data;
      }
      return { error: err.message };
    });

//* Pause / Resume ongoing treatment session - progress api needs to be invoked first
export const pauseOngoingSession = async (
  token: string,
  sessionUid: string
): Promise<{ success: boolean } | { error: string }> => {
  const { signal } = new AbortController();
  return await apiServer
    .get<ProgressReportDataType>(
      `${updateSessionProgressEndpoint(sessionUid)}`,
      {
        signal,
        headers: {
          'x-access-tokens': token,
        },
      }
    )
    .then(async () => {
      return await apiServer
        .post(`${pauseSessionEndpoint(sessionUid)}`, null, {
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(() => ({ success: true }))
        .catch((err) => {
          console.error(err);
          return { success: false };
        });
    })
    .catch((err) => {
      if (err.response?.data) {
        return err.response.data;
      }
      return { error: err.message };
    });
};

//* Selected session details query
export const useSelectedSessionDetails = (
  token: string,
  sessionUid: string
) => {
  return useQuery<NatPDTSessionDetailsType | { error: string }>(
    ['selected-session-details', token, sessionUid],
    async ({ signal }) => {
      return await fetchSelectedSessionDetails(token, sessionUid, signal);
    },
    {
      enabled: !!sessionUid,
    }
  );
};

//* Fetch selected session details
export const fetchSelectedSessionDetails = async (
  token: string,
  sessionUid: string,
  signal?: AbortSignal
): Promise<NatPDTSessionDetailsType | { error: string }> => {
  return await apiServer
    .get<SessionDetailsResponseType>(`${sessionDetailsEndpoint(sessionUid)}`, {
      signal,
      headers: {
        'x-access-tokens': token,
      },
    })
    .then(({ data }) => formatNatPDTSessionDetails(data.session))
    .catch((err) => {
      if (err.response?.data) {
        return err.response.data;
      }
      return { error: err.message };
    });
};

type OngoingSessionReportQueryReturnType =
  | {
      lastUpdatedTime: string;
      stepsData: SessionStepsDataType;
      scientificReport: OngoingSessionReportDataType;
    }
  | { error: string };

//* Ongoing session report data query
export const useOngoingSessionReportData = (
  token: string,
  sessionUid: string,
  isEnabled: boolean,
  pauseStartTime: number | null
) => {
  return useQuery<OngoingSessionReportQueryReturnType>(
    [
      'selected-session-report-data',
      token,
      isEnabled,
      sessionUid,
      pauseStartTime,
    ],
    async ({ signal }) => {
      return await fetchOngoingSessionReportData(
        token,
        sessionUid,
        pauseStartTime,
        signal
      );
    },
    {
      enabled: !!sessionUid && isEnabled,
      refetchInterval: UPDATE_PROGRESS_INTERVAL_MS,
    }
  );
};

//* Fetch ongoing session report data
export const fetchOngoingSessionReportData = async (
  token: string,
  sessionUid: string,
  pauseStartTime: number | null,
  signal?: AbortSignal
): Promise<OngoingSessionReportQueryReturnType> => {
  return await apiServer
    .post<OngoingSessionReport>(
      `${getOngoingSessionReport(sessionUid)}`,
      null,
      {
        signal,
        headers: {
          'x-access-tokens': token,
        },
      }
    )
    .then(({ data }) => {
      return {
        lastUpdatedTime: moment().format('HH:mm'),
        stepsData: formatSessionStepsInfo(data.report.steps),
        scientificReport: formatOngoingSessionReport(
          data.report.scientific_report,
          pauseStartTime
        ),
      };
    })
    .catch((err) => {
      if (err.response?.data) {
        return err.response.data;
      }
      return { error: err.message };
    });
};

export type EndPortalTreatmentType = {
  token: string;
  data: {
    sessionId: string;
  };
};

//* End ongoing treatment session
export const useEndPortalTreatment = () => {
  return useMutation<
    AxiosResponse<any, any>,
    AxiosError,
    EndPortalTreatmentType,
    unknown
  >(
    ({
      token,
      data,
    }: {
      token: string;
      data: {
        sessionId: string;
      };
    }) =>
      apiServer.post(
        `${stopSessionEndpoint(data.sessionId)}`,
        {
          finished_reason: FinishedReasonsEnums.Complete,
        },
        {
          headers: {
            'x-access-tokens': token,
          },
        }
      )
  );
};

//* Staff cancel ongoing treatment session
export const useStaffCancelOngoingSession = () => {
  return useMutation<
    AxiosResponse<any, any>,
    AxiosError,
    EndPortalTreatmentType,
    unknown
  >(({ token, data }: { token: string; data: { sessionId: string } }) =>
    apiServer.post(
      `${stopSessionEndpoint(data.sessionId)}`,
      {
        finished_reason: FinishedReasonsEnums.CancelledStaff,
      },
      {
        headers: {
          'x-access-tokens': token,
        },
      }
    )
  );
};

//* Use query for completed treatment report data
export const useCompletedTreatmentReportData = (
  token: string,
  sessionUid: string,
  isEnabled: boolean
) => {
  return useQuery<
    | {
        stepsData: SessionStepsDataType;
        sessionInfo: CompletedSessionInfoDataType;
        scientificReport: CompletedSessionReportDataType;
        protocolAdherenceData: CompletedProtocolAdherenceDataType;
      }
    | { error: string }
  >(
    ['completed-treatment-report', token, sessionUid],
    async ({ signal }) => {
      return await fetchCompletedTreatmentsReports(token, sessionUid, signal);
    },
    {
      enabled: !!sessionUid && isEnabled,
    }
  );
};

//* Completed treatments fetch call
export const fetchCompletedTreatmentsReports = async (
  token: string,
  sessionUid: string,
  signal?: AbortSignal
): Promise<
  | {
      stepsData: SessionStepsDataType;
      sessionInfo: CompletedSessionInfoDataType;
      scientificReport: CompletedSessionReportDataType;
      protocolAdherenceData: CompletedProtocolAdherenceDataType;
    }
  | { error: string }
> => {
  return await apiServer
    .post<CompletedTreatmentReportType>(
      `${getCompletedTreatmentReport(sessionUid)}`,
      null,
      {
        signal,
        headers: {
          'x-access-tokens': token,
        },
      }
    )
    .then(({ data }) => ({
      stepsData: formatSessionStepsInfo(data.report.steps),
      sessionInfo: formatCompletedSessionInfo(data.report.session),
      protocolAdherenceData: formatCompletedProtocolAdherence(
        data.report.protocol_adherence
      ),
      scientificReport: formatCompletedSessionReport({
        ...data.report.scientific_report,
        ...data.report.session,
      }),
    }))
    .catch((err) => {
      if (err.response?.data) {
        return err.response.data;
      }
      return { error: err.message };
    });
};

//* Generate treatment certificate
export const generateTreatmentCertificate = async (
  token: string,
  sessionUid: string,
  userLang: string
) => {
  return await apiServer
    .post<GenerateCertificatePostResponse>(
      `${patientCertificate(sessionUid)}`,
      null,
      {
        headers: {
          'x-access-tokens': token,
        },
        params: {
          language_code: userLang,
        },
      }
    )
    .then(({ data }) => data)
    .catch(async (err) => {
      if (err) {
        const error = JSON.parse(await err.response.data.text());
        return error;
      }
      return { error: err.message };
    });
};

//* Get treatment certificate
export const getTreatmentCertificate = async (
  token: string,
  sessionUid: string,
  signal?: AbortSignal
) => {
  return await apiServer
    .get<
      GetCertificateResponse | { error: { message: string; code?: number } }
    >(`${patientCertificate(sessionUid)}`, {
      signal,
      headers: {
        'x-access-tokens': token,
      },
      responseType: 'blob',
    })
    .then(({ data }) => data)
    .catch(async (err) => {
      const results = await err.response.data.text();
      const error = JSON.parse(results);
      return {
        error: {
          message: error.error,
          code: error.code,
        },
      };
    });
};

//* Use Get treatment certificate hook
export const useGetTreatmentCertificate = (
  token: string,
  sessionUid: string,
  isEnabled: boolean
) => {
  return useQuery<any | { error: { message: string; code?: number } }>(
    ['get-treatment-certificate', token, sessionUid, isEnabled],
    async ({ signal }) => {
      return await getTreatmentCertificate(token, sessionUid, signal);
    },
    {
      enabled: !!sessionUid && isEnabled,
    }
  );
};

//* use Get treatment information after scheduling
export const useGetTreatmentInfoPdf = (
  token: string,
  sessionUid: string,
  isEnabled: boolean
) => {
  return useQuery<any | { error: { message: string; code?: number } }>(
    ['get-treatment-info-pdf', sessionUid, isEnabled],
    async ({ signal }) => {
      return await getTreatmentInfoPdf(token, sessionUid, signal);
    },
    {
      enabled: !!sessionUid && isEnabled,
    }
  );
};

const getTreatmentInfoPdf = async (
  token: string,
  sessionUid: string,
  signal?: AbortSignal
) => {
  return await apiServer
    .get(`${treatmentInformation(sessionUid)}`, {
      signal,
      headers: {
        'x-access-tokens': token,
      },
      responseType: 'blob',
    })
    .then(({ data }) => data)
    .catch(async (err) => {
      const results = await err.response.data.text();
      const error = JSON.parse(results);
      return {
        error: {
          message: error.error,
          code: error.code,
        },
      };
    });
};
