import { DTOGroups, PersonDTOGroups, DTO } from '@hubbl/shared/models/dto';

export type BaseFromJsonCallable<T> = (
  json: any,
  group: DTOGroups
) => Promise<T>;

export type BasePersonFromJsonCallable<T> = (
  json: any,
  group: PersonDTOGroups
) => Promise<T>;

export type BaseFromClassCallable<J, T extends DTO<J>> = (
  entity: J
) => Promise<T>;

export type ParsedToken = {
  id: number;
  email: string;
  exp: number;
};
