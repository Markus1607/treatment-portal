import { useQuery } from 'react-query';
import apiServer from 'server/apiServer';
import _ from 'lodash';

const formatAKGraphData = (data: any) => {
  const results: any = [];
  _.map(data, (value: any, key: any) => {
    results.push({
      name: key,
      value: Math.round(value.dose) / 10,
      percentage: value.dose_percent,
      unit: 'J/cm²',
    });
  });
  return results;
};

export const useAkLesionGraphData = (token: string, configNumber: number) => {
  return useQuery(
    ['akLesionGraphData', token, configNumber],
    async ({ signal }) => {
      try {
        const { data } = await apiServer.post(
          `https://591f32c5-839f-4555-b394-4210c3423cc2.mock.pstmn.io/staff-member/patients/hzt2hw4p/sessions/predicted-dose/artdypdt?lamp_config_number=${configNumber}`,
          null,
          {
            signal,
            headers: {
              'x-access-tokens': token,
            },
          }
        );
        return formatAKGraphData(data.lesion_doses);
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
