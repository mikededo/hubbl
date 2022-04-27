import { Fetcher } from 'swr';
import { PartialDeep } from 'type-fest';

import {
  ClientDTO,
  EventDTO,
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
  (
    type: 'owner' | 'client',
    data: PartialDeep<OwnerDTO<Gym>> | PartialDeep<ClientDTO<Gym>>
  ): void;
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
export type FetcherType = Fetcher<never, string>;

/**
 * Function type that defines the poster of the application
 */
export type PosterType = <T>(url: string, data: unknown) => Promise<T>;

/**
 * Function type that defines the putter of the application
 */
export type PutterType = <T>(url: string, data: unknown) => Promise<T>;

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

/**
 * Api functions (helpers) that allow the modification of
 * today events of the app state
 */
export type TodayEventsApiType = {
  /**
   * Revalidates the list of today's events by refetching
   * such list
   */
  revalidate: () => void;
};

export type AppContextValue = {
  token: TokenType | null;
  user: UserType | null;
  todayEvents: EventDTO[];
  API: {
    loading: boolean;
    signup: SignUpType;
    login: LogInType;
    fetcher: FetcherType;
    poster: PosterType;
    putter: PutterType;
    user: UserApiType;
    gym: GymApiType;
    todayEvents: TodayEventsApiType;
  };
};
