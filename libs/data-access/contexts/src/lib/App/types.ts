import { AxiosResponse } from 'axios';
import { PartialDeep } from 'type-fest';

import {
  ClientDTO,
  GymDTO,
  OwnerDTO,
  PersonDTO,
  WorkerDTO
} from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';
import { ParsedToken } from '@hubbl/shared/types';

export type TokenType = {
  value: string | null;
  parsed: ParsedToken | null;
};

export type UserType =
  | Omit<OwnerDTO<Gym>, 'toClass'>
  | Omit<WorkerDTO<Gym>, 'toClass'>
  | Omit<ClientDTO<Gym>, 'toClass'>;

export type UserUpdatableFields = Partial<Omit<PersonDTO<Gym>, 'id' | 'gym'>>;

export type GymUpdatableFields = Partial<
  Omit<GymDTO, 'id' | 'virtualGyms' | 'code'>
>;

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

/**
 * Api functions to work with the gym. Should only be used when the
 * user type is an owner
 */
export type GymApiType = {
  update: (data: GymUpdatableFields) => void;
};

export type AppContextValue = {
  token: TokenType | null;
  user: UserType | null;
  API: {
    loading: boolean;
    signup: SignUpType;
    login: LogInType;
    fetcher: FetcherType;
    user: UserApiType;
    gym: GymApiType;
  };
};
