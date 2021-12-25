import { PersonDTOGroups } from '@gymman/shared/models/dto';
import { Gym } from '@gymman/shared/models/entities';

export type BaseFromJsonCallable<T> = (json: any) => Promise<T>;

export type BasePersonFromJsonCallable<T> = (
  json: any,
  variant: PersonDTOGroups
) => Promise<T>;

export type BaseFromClassCallable<J, T> = (entity: J) => Promise<T>;

export type BasePersonFromClassCallable<J, T> =
  | ((entity: J) => Promise<T>)
  | ((entity: J, gym: Gym) => Promise<T>);
