import { PartialDeep } from 'type-fest';

import { ClientDTO, OwnerDTO, WorkerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';
import { AxiosRequestConfig } from 'axios';

export type SignUpType = {
  (type: 'owner', data: PartialDeep<OwnerDTO<Gym>>): Promise<{
    owner: OwnerDTO<Gym>;
    token: string;
  }>;
};

export type LoginResult = Promise<{ owner: OwnerDTO<Gym>; token: string }> &
  Promise<{ worker: WorkerDTO<Gym>; token: string }>;

export type LoginType = {
  (
    type: 'owner' | 'worker',
    data: { email: string; password: string }
  ): LoginResult;
};

export type UpdateType<
  T extends OwnerDTO<Gym> | WorkerDTO<Gym> | ClientDTO<Gym>
> = (data: T, config?: AxiosRequestConfig) => Promise<void>;

export type OwnerApi = {
  update: UpdateType<OwnerDTO<Gym>>;
};

export type WorkerApi = {
  update: UpdateType<WorkerDTO<Gym>>;
};

export type ClientApi = {
  update: UpdateType<ClientDTO<Gym>>;
};
