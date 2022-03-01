import { AxiosResponse } from 'axios';
import { PartialDeep } from 'type-fest';

import { OwnerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import { axios } from '../Base';
import { Gender } from '@hubbl/shared/types';

type SignUpType = {
  (type: 'owner', data: PartialDeep<OwnerDTO<Gym>>): Promise<OwnerDTO<Gym>>;
};

export const signup: SignUpType = async (type, data) => {
  const response: AxiosResponse = await axios.post(
    `/persons/register/${type}`,
    // Set gender by default
    { ...data, gender: Gender.OTHER },
    { withCredentials: false }
  );

  return response.data;
};

type LoginType = {
  (type: 'owner', data: { email: string; password: string }): Promise<
    OwnerDTO<Gym>
  >;
};

export const login: LoginType = async (type, data) => {
  const response: AxiosResponse = await axios.post(
    `/persons/login/${type}`,
    data,
    { withCredentials: false }
  );

  return response.data;
};
