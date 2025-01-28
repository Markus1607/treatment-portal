import apiServer from 'server/apiServer';
import moment from 'moment';
import {
  getTreatmentProgress,
  treatmentReportOngoing,
  getAllTreatmentSessions,
  stopSessionEndpoint,
} from 'routes';
import { useQuery, useMutation } from 'react-query';
import {
  formatReport,
  formatSessionInfo,
  formatMonitoringData,
  FormattedOngoingSessionDataType,
} from './format';
import { SunscreenList } from '@types';
import { SessionTypeEnums } from 'utils/options.d';
import type {
  AllOngoingSessionsDataType,
  OngoingSessionReportType,
} from './api.d';

//* 1 minute
const intervalMs = 60000;

export type OngoingTreatmentSessionsType =
  | FormattedOngoingSessionDataType
  | { error: string | object };

export const useOngoingTreatmentSessions = (
  token: string,
  sunscreenList: SunscreenList
) => {
  return useQuery<OngoingTreatmentSessionsType>(
    ['ongoingTreatmentSessions', token],
    async ({ signal }) => {
      return await apiServer
        .get<AllOngoingSessionsDataType>(`${getAllTreatmentSessions}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
          params: {
            subsection: 'ongoing',
          },
        })
        .then(async ({ data }) => {
          const formattedData: FormattedOngoingSessionDataType[] =
            formatMonitoringData(data, sunscreenList).filter(
              (session) => session.treatmentStatus === 2
            );
          //* This has to be done to tell the backend to update the treatment
          for (let i = 0; i < formattedData.length; i++) {
            if (
              formattedData[i].sessionType === SessionTypeEnums.FullyAssisted
            ) {
              await apiServer.get(
                `${getTreatmentProgress(formattedData[i].sessionID)}`,
                {
                  signal,
                  headers: {
                    'x-access-tokens': token,
                  },
                  params: {
                    session_id: formattedData[i].sessionID,
                    patient_id: formattedData[i].patientID,
                  },
                }
              );
            }
          }
          await Promise.all(
            //* get treatment report for each session
            formattedData.map((session) =>
              apiServer.get<OngoingSessionReportType>(
                `${treatmentReportOngoing}`,
                {
                  signal,
                  headers: { 'x-access-tokens': token },
                  params: {
                    session_id: session.sessionID ? session.sessionID : -1,
                  },
                }
              )
            )
          ).then((data) => {
            data.forEach((item, index) => {
              if (!item) {
                formattedData[index].report = null;
                formattedData[index].sessionInfo = null;
              } else {
                formattedData[index].report = formatReport(
                  item.data?.scientific_report
                );
                formattedData[index].sessionInfo = formatSessionInfo(
                  item.data?.session_steps,
                  sunscreenList
                );
                formattedData[index].lastUpdated = moment().format('HH:mm');
              }
            });
          });
          return formattedData;
        })
        .catch((err) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    },
    { refetchInterval: intervalMs }
  );
};

export const useEndPortalTreatment = () => {
  return useMutation(
    ({
      token,
      data,
    }: {
      token: string;
      data: {
        session_id: string;
      };
    }) =>
      apiServer.post(`${stopSessionEndpoint(data.session_id)}`, null, {
        headers: {
          'x-access-tokens': token,
        },
      })
  );
};
