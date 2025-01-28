import {
  formatGraphData,
  getSessionDetails,
  getSessionGraphData,
  formatCustomSessionTime,
  getCustomSessionDetails,
  getCustomSessionGraphData,
} from './format';

export type SelectedTimeDataType = {
  unix: string;
  unixStartTime: number | '';
  unixEndTime: string | '';
  suitability: string;
  startTime: string;
  preStartTime: string;
  estEndTime: string;
};

export type customTimeDataType = {
  sessionGraph: ReturnType<typeof getCustomSessionGraphData>;
  sessionDetails: ReturnType<typeof getCustomSessionDetails>;
  sessionTimeData: ReturnType<typeof formatCustomSessionTime>;
};

export type sessionGraphDataType = ReturnType<typeof getSessionGraphData>;

export type sessionDetailsDataType = ReturnType<typeof getSessionDetails>;

export type customSessionTimeDataType = ReturnType<
  typeof formatCustomSessionTime
>;

export type GraphDataType = ReturnType<typeof formatGraphData>;

export type confirmationDetailsType = {
  unixDateTime: number;
  rescheduled: boolean;
  patientID: string;
  location: string;
  date: string;
  preStartTime: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  beginTreatmentData: {
    lat: number | null;
    lon: number | null;
    sessionId: string | null;
  };
};

export type beginTreatmentDataType = {
  session_id: string;
  patient_id?: string;
};
