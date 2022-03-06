import { AxiosResponse } from 'axios';
import { PartialDeep } from 'type-fest';

import {
  OwnerDTO,
  WorkerDTO,
  PersonDTO,
  ClientDTO
} from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

export type UserType =
  | Omit<OwnerDTO<Gym>, 'toClass'>
  | Omit<WorkerDTO<Gym>, 'toClass'>
  | Omit<ClientDTO<Gym>, 'toClass'>;

export type UserUpdatableFields = Partial<Omit<PersonDTO<Gym>, 'id' | 'gym'>>;

/**
 * Function type to signup an Owner
 */
export type SignUpType = {
  (type: 'owner', data: PartialDeep<OwnerDTO<Gym>>): void;
};

/**
 * Function type to log in both an owner and a user
 */
export type LogInType = {
  (type: 'owner' | 'worker', data: { email: string; password: string }): void;
};

/**
 * Function type that defines the fetcher of the application
 */
export type FetcherType = { (url: string): Promise<AxiosResponse> };

export type UserApiType = {
  update: (data: UserUpdatableFields) => void;
};

export type AppContextValue = {
  token: string | null;
  user: UserType | null;
  API: {
    loading: boolean;
    signup: SignUpType;
    login: LogInType;
    fetcher: FetcherType;
    user: UserApiType;
  };
};
