import { photoEditEndpoint, photosEndpoint } from 'routes';
import apiServer from 'server/apiServer';
import { formatPatientPhotos } from './format';
import { useQuery, useMutation } from 'react-query';
import { Dispatch, SetStateAction } from 'react';
import {
  EditedPhotoDataType,
  PhotoDeleteResponse,
  PhotosResponseType,
  PostPhotosDataType,
  PhotoEditDetailsResponseType,
} from './api';
import { AxiosError, AxiosResponse } from 'axios';

const TIMEOUT = 5 * 1000 * 60; //* 5 mins

export const useGetPhotos = (
  token: string,
  patientUid: string,
  setLoadPercentage: Dispatch<SetStateAction<number>>
) => {
  return useQuery(
    ['getPatientPhotos', token, patientUid],
    async ({ signal }) => {
      return await apiServer
        .get<PhotosResponseType>(`${photosEndpoint(patientUid)}`, {
          signal,
          headers: {
            'x-access-tokens': token,
          },
          params: {
            include_image_data: true,
          },
          timeout: TIMEOUT,
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            return percentCompleted !== Infinity
              ? setLoadPercentage(percentCompleted)
              : null;
          },
        })
        .then(({ data }) => formatPatientPhotos(data.photos))
        .catch((err) => {
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

export const usePostPhoto = (patientUid: string) => {
  return useMutation<
    AxiosResponse<any, any>,
    AxiosError,
    {
      token: string;
      data: PostPhotosDataType;
    },
    unknown
  >(({ token, data }) =>
    apiServer.post(
      `${photosEndpoint(patientUid)}`,
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

export const useEditPhoto = (photoUid: string) => {
  return useMutation<
    AxiosResponse<PhotoEditDetailsResponseType>,
    AxiosError,
    {
      token: string;
      data: EditedPhotoDataType;
    },
    unknown
  >(({ token, data }) =>
    apiServer.put(
      `${photoEditEndpoint(photoUid)}`,
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

export const useDeletePhoto = () => {
  return useMutation<
    AxiosResponse<PhotoDeleteResponse>,
    AxiosError,
    {
      token: string;
      photoUid: string;
    },
    unknown
  >(({ token, photoUid }) =>
    apiServer.delete(`${photoEditEndpoint(photoUid)}`, {
      headers: {
        'x-access-tokens': token,
      },
    })
  );
};
