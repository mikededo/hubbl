import { PartialDeep } from 'type-fest';

import { ClientDTO, OwnerDTO, WorkerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';
import { AxiosRequestConfig } from 'axios';

export type OwnerSignUpResponse = {
  owner: OwnerDTO<Gym>;
  token: string;
};

export type ClientSignUpResponse = {
  client: ClientDTO<Gym>;
  token: string;
};

export type SignUpType = {
  (
    type: 'owner' | 'client',
    data: PartialDeep<OwnerDTO<Gym> | ClientDTO<Gym>>
  ): Promise<OwnerSignUpResponse | ClientSignUpResponse>;
};

export type LoginResult = Promise<{ owner: OwnerDTO<Gym>; token: string }> &
  Promise<{ worker: WorkerDTO<Gym>; token: string }>;

export type LoginType = {
  (
    type: 'owner' | 'worker',
    data: { email: string; password: string }
  ): LoginResult;
};

export type LogOutType = () => Promise<void>;

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
