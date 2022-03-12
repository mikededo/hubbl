import { AxiosRequestConfig } from 'axios';
import { PartialDeep } from 'type-fest';

import { GymDTO } from '@hubbl/shared/models/dto';

import { axios } from '../Base';

type GymUpdateType = (
  data: PartialDeep<GymDTO>,
  config: AxiosRequestConfig
) => Promise<void>;

export const update: GymUpdateType = async (data, config) => {
  await axios.put(`/gyms`, data, config);
};
