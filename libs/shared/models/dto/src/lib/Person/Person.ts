import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

import { Gym } from '@gymman/shared/models/entities';
import { AppTheme, Gender } from '@gymman/shared/types';

import {
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
  @IsNumber({}, { message: numberError('id'), groups: ['all'] })
  id!: number;

  @IsEmail(
    {},
    { message: emailError(), groups: ['all', PersonDTOGroups.REGISTER] }
  )
  @IsString({
    message: stringError('email'),
    groups: ['all', PersonDTOGroups.REGISTER, 'login']
  })
  email!: string;

  @IsString({
    message: stringError('password'),
    groups: ['all', PersonDTOGroups.REGISTER, 'login']
  })
  @Length(8, undefined, {
    message: lengthError('password', 8),
    groups: ['all', PersonDTOGroups.REGISTER]
  })
  password!: string;

  @IsString({
    message: stringError('firstName'),
    groups: ['all', PersonDTOGroups.REGISTER]
  })
  firstName!: string;

  @IsString({
    message: stringError('lastName'),
    groups: ['all', PersonDTOGroups.REGISTER]
  })
  lastName!: string;

  @IsOptional()
  gym!: T;

  @IsEnum(Gender, {
    message: enumError('Gender', 'gender'),
    groups: ['all', PersonDTOGroups.REGISTER]
  })
  gender!: Gender;

  @IsEnum(AppTheme, {
    message: enumError('AppTheme', 'theme'),
    groups: ['all']
  })
  theme!: AppTheme;
}
