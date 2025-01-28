import apiServer from 'server/apiServer';
import { DiseasesTypeEnums } from 'utils/options.d';
import {
  diseasesEndpoint,
  protocolsEndpoint,
  protocolDetailsEndpoint,
  postProtocolTypeEndpoint,
  setDefaultProtocolEndpoint,
} from 'routes';
import {
  naturalDPDTProtocolBEDataType,
  artificialDPDTProtocolBEDataType,
  naturalDPDTProtocolBEDataPutType,
} from './format';
import { useQuery, useMutation } from 'react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import {
  type ArtflPDT,
  type NatDyPDT,
  ProtocolTypeEnums,
  type NATDYPDTSettings,
  type ARTFLPDTSettings,
  type ProtocolTypeOptions,
  type AllProtocolsResponseType,
  type DiseaseListResponseType,
} from './api.d';

export const useAllProtocolsData = (token: string) => {
  return useQuery<
    | {
        naturalPDTList: NatDyPDT[];
        artificialPDTList: ArtflPDT[];
      }
    | { error: string }
  >(
    ['allProtocolData', token],
    async ({ signal }) => {
      return await apiServer
        .get<AllProtocolsResponseType>(`${protocolsEndpoint}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(({ data }) => {
          const naturalPDTList = data.protocols.filter(
            (protocol) => protocol.treatment_type === ProtocolTypeEnums.NATDYPDT
          ) as NatDyPDT[];

          const artificialPDTList = data.protocols.filter(
            (protocol) => protocol.treatment_type === ProtocolTypeEnums.ARTFLPDT
          ) as ArtflPDT[];
          return {
            naturalPDTList,
            artificialPDTList,
          };
        })
        .catch((err: AxiosError) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    },
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useProtocolDetailsData = (
  token: string,
  protocolId: string | null
) => {
  return useQuery<NATDYPDTSettings | ARTFLPDTSettings | { error: string }>(
    ['protocolDetailsData', token, protocolId],
    async ({ signal }) => {
      return await apiServer
        .get<{
          protocol: NATDYPDTSettings | ARTFLPDTSettings;
        }>(`${protocolDetailsEndpoint(protocolId as string)}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(({ data }) => data.protocol)
        .catch((err: AxiosError) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    },
    {
      enabled: !!protocolId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useAddProtocol = () => {
  return useMutation(
    ({
      token,
      data,
      type,
    }: {
      token: string;
      type: ProtocolTypeOptions;
      data: naturalDPDTProtocolBEDataType | artificialDPDTProtocolBEDataType;
    }) =>
      apiServer.post(
        `${postProtocolTypeEndpoint(type)}`,
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

export const useUpdateProtocol = () => {
  return useMutation(
    ({
      token,
      data,
      protocolId,
    }: {
      token: string;
      protocolId: string;
      data: naturalDPDTProtocolBEDataPutType | artificialDPDTProtocolBEDataType;
    }) =>
      apiServer.put<NatDyPDT | ArtflPDT>(
        `${protocolDetailsEndpoint(protocolId)}`,
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

export const useDeleteProtocol = () => {
  return useMutation(
    ({ token, protocolId }: { token: string; protocolId: string }) =>
      apiServer.delete<
        any,
        AxiosResponse<
          any,
          {
            debug: {
              uid: string;
            };
            message: string;
          }
        >,
        any
      >(`${protocolDetailsEndpoint(protocolId)}`, {
        headers: {
          'x-access-tokens': token,
        },
      })
  );
};

export const useMakeDefaultProtocol = () => {
  return useMutation(
    ({
      token,
      data,
    }: {
      token: string;
      data: { diseaseUid: string; protocolUid: string };
    }) =>
      apiServer.post(
        `${setDefaultProtocolEndpoint(data.diseaseUid, data.protocolUid)}`,
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

export const useGetDiseaseList = (token: string) => {
  return useQuery<DiseaseListResponseType | { error: string }>(
    ['diseaseList', token],
    async ({ signal }) => {
      return await apiServer
        .get<DiseaseListResponseType>(`${diseasesEndpoint}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(({ data }) => reOrderDiseaseList(data))
        .catch((err: AxiosError) => {
          if (err.response?.data) {
            return err.response.data;
          }
          return { error: err.message };
        });
    },
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
};

export function reOrderDiseaseList(data: {
  diseases: { name: string; uid: string }[];
}): { diseases: { name: string; uid: string }[] } {
  const diseaseOrderMap: { [key: string]: number } = {
    [`${DiseasesTypeEnums.AK}`]: 0,
    [`${DiseasesTypeEnums.Acne}`]: 1,
    [`${DiseasesTypeEnums.Bcc}`]: 2,
    [`${DiseasesTypeEnums.SkinAgeing}`]: 3,
  };

  return {
    diseases: data.diseases.sort((a, b) => {
      const orderA = diseaseOrderMap[a.uid] ?? 4; // Unknown uid goes to the end
      const orderB = diseaseOrderMap[b.uid] ?? 4;
      return orderA - orderB;
    }),
  };
}
