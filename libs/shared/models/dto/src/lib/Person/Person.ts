import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

import { Gym } from '@hubbl/shared/models/entities';
import { AppTheme, Gender } from '@hubbl/shared/types';

import {
  DTOGroups,
  emailError,
  enumError,
  lengthError,
  numberError,
  stringError
} from '../util';

export enum PersonDTOGroups {
  REGISTER = 'register',
  LOGIN = 'login'
}

export default abstract class PersonDTO<T extends Gym | number> {
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
  id!: number;

  @IsEmail(
    {},
    {
      message: emailError(),
      groups: [DTOGroups.ALL, PersonDTOGroups.REGISTER]
    }
  )
  @IsString({
    message: stringError('email'),
    groups: [DTOGroups.ALL, PersonDTOGroups.REGISTER, PersonDTOGroups.LOGIN]
  })
  email!: string;

  @IsString({
    message: stringError('password'),
    groups: [DTOGroups.ALL, PersonDTOGroups.REGISTER, PersonDTOGroups.LOGIN]
  })
  @Length(8, undefined, {
    message: lengthError('password', 8),
    groups: [DTOGroups.ALL, PersonDTOGroups.REGISTER]
  })
  password!: string;

  @IsString({
    message: stringError('firstName'),
    groups: [DTOGroups.ALL, PersonDTOGroups.REGISTER]
  })
  firstName!: string;

  @IsString({
    message: stringError('lastName'),
    groups: [DTOGroups.ALL, PersonDTOGroups.REGISTER]
  })
  lastName!: string;

  @IsOptional()
  gym!: T;

  @IsEnum(Gender, {
    message: enumError('Gender', 'gender'),
    groups: [DTOGroups.ALL, PersonDTOGroups.REGISTER]
  })
  gender!: Gender;

  @IsEnum(AppTheme, {
    message: enumError('AppTheme', 'theme'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE]
  })
  theme!: AppTheme;
}
