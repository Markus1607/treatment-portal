import { useQuery } from 'react-query';
import apiServer from 'server/apiServer';

export const usePatientModel = (
  token: string,
  configNumber: number,
  lesionName: string
) => {
  return useQuery(
    ['patientModel', token, configNumber, lesionName],
    async ({ signal }) => {
      try {
        const { data } = await apiServer.get(
          `https://591f32c5-839f-4555-b394-4210c3423cc2.mock.pstmn.io/staff-member/patients/hzt2hw4p/sessions/visual-dose/artdypdt?lamp_config_number=${configNumber}&lesion_name=${lesionName}`,
          {
            signal,
            headers: {
              'x-access-tokens': token,
            },
          }
        );
        return data.avatar;
      } catch (err: any) {
        if (err.response?.data) {
          return err.response.data;
        }
        return { error: err.message };
      }
    },
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
};
