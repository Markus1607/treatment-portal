import apiServer from 'server/apiServer';
import { useQuery, useMutation } from 'react-query';
import { adminInstitution } from 'routes';
import { formatInstitutions } from './format';

export const useInstitutionsData = (token) => {
  return useQuery(['institutionsData', token], async ({ signal }) => {
    return await apiServer
      .get(`${adminInstitution}`, {
        signal,
        headers: {
          'x-access-tokens': token,
        },
      })
      .then(({ data }) => formatInstitutions(data.insts))
      .catch((err) => {
        if (err.response?.data) {
          return err.response.data;
        }
        return { error: err.message };
      });
  });
};

export const usePostInstitution = () => {
  return useMutation(({ token, data }) =>
    apiServer.post(
      `${adminInstitution}`,
      {
        ...data,
      },
      {
        headers: {
          'x-access-tokens': token,
        },
      }
    )
  );
};

export const useDeleteInstitutionData = () => {
  return useMutation(({ token, instID }) =>
    apiServer.delete(`${adminInstitution}`, {
      headers: {
        'x-access-tokens': token,
      },
      params: {
        inst_id: instID,
      },
    })
  );
};

export const useUpdateInstitution = () => {
  return useMutation(({ token, data }) =>
    apiServer.put(
      `${adminInstitution}`,
      {
        ...data,
      },
      {
        headers: {
          'x-access-tokens': token,
        },
      }
    )
  );
};
