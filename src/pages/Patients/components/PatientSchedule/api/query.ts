import { useQuery } from 'react-query';
import apiServer from 'server/apiServer';
import { AllTreatments, SessionDetailsResponseType } from './query.d';
import { sessionDetailsEndpoint, sessionsEndpoint } from 'routes';
import { formatGetTreatment, formatNatPDTSessionDetails } from './format';

export type FormatGetTreatmentType = ReturnType<typeof formatGetTreatment>;
export type FormattedNatPDTSessionsType = ReturnType<
  typeof formatNatPDTSessionDetails
>;

export type LastBookedTreatmentType = {
  lastSession: FormatGetTreatmentType | { error: string };
  sessionDetails: FormattedNatPDTSessionsType | null;
};

export const useGetTreatment = (token: string, patientUid: string) => {
  return useQuery<LastBookedTreatmentType>(
    ['bookedTreatment', token, patientUid],
    async ({ signal }) => {
      return await apiServer
        .get<AllTreatments>(`${sessionsEndpoint(patientUid)}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(async ({ data }) => {
          let sessionDetails = null;
          const lastSession = formatGetTreatment(data.sessions);

          //*fetch session details if lastSession session id exist
          if (
            lastSession &&
            lastSession.eventData &&
            lastSession.eventData.sessionId
          ) {
            sessionDetails = await fetchEventSessionDetails(
              token,
              lastSession.eventData.sessionId
            );
          }

          return {
            lastSession,
            sessionDetails: sessionDetails,
          };
        })
        .catch((err) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    }
  );
};

export const fetchEventSessionDetails = async (
  token: string,
  sessionUid: string
): Promise<FormattedNatPDTSessionsType | { error: string }> => {
  const signal = new AbortController().signal;
  return await apiServer
    .get<SessionDetailsResponseType>(`${sessionDetailsEndpoint(sessionUid)}`, {
      signal,
      headers: {
        'x-access-tokens': token,
      },
    })
    .then(({ data }) => {
      return formatNatPDTSessionDetails(data.session);
    })
    .catch((err) => {
      if (err.response?.data) {
        return err.response.data;
      }
      return { error: err.message };
    });
};
