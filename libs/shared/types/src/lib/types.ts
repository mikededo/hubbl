import { PersonDTOGroups } from '@hubbl/shared/models/dto';

import { DTOGroups } from './enums';

export type BaseFromJsonCallable<T> = (
  json: any,
  group: DTOGroups
) => Promise<T>;

export type BasePersonFromJsonCallable<T> = (
  json: any,
  group: PersonDTOGroups
) => Promise<T>;

export type BaseFromClassCallable<J, T> = (entity: J) => Promise<T>;

export type ParsedToken = {
  id: number;
  email: string;
  exp: number;
};
