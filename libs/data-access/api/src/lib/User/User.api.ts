import { AxiosResponse } from 'axios';

import { Gender } from '@hubbl/shared/types';

import { axios } from '../Base';
import {
  ClientApi,
  LoginType,
  LogOutType,
  OwnerApi,
  SignUpType,
  WorkerApi
} from './types';

/* GENERICS */

export const signup: SignUpType = async (type, data) => {
  const response: AxiosResponse = await axios.post(
    `/persons/register/${type}`,
    // Set gender by default
    { ...data, gender: Gender.OTHER },
    { withCredentials: true }
  );

  return response.data;
};

export const login: LoginType = async (type, data) => {
  const response: AxiosResponse = await axios.post(
    `/persons/login/${type}`,
    data,
    { withCredentials: true }
  );

  return response.data;
};

export const logout: LogOutType = async () => {
  await axios.post('/persons/logout', undefined, {
    withCredentials: true
  });
};

/* SPECIFICS */

export const owner: OwnerApi = {
  update: async (data, config) => {
    await axios.put('/persons/owner', data, config);
  }
};

export const worker: WorkerApi = {
  update: async (data, config) => {
    await axios.put('/persons/worker', data, config);
  }
};

export const client: ClientApi = {
  update: async (data, config) => {
    await axios.put('/persons/client', data, config);
  }
};
