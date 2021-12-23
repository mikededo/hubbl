import { PersonDTOVariants } from '@gymman/shared/models/dto';
import { Gym } from '@gymman/shared/models/entities';

export type BasePersonFromJsonCallable<T> = (
  json: any,
  variant: PersonDTOVariants
) => Promise<T>;

export type BasePersonFromClassCallable<J, T> =
  | ((entity: J) => Promise<T>)
  | ((entity: J, gym: Gym) => Promise<T>);