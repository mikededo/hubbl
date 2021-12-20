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

export type PersonDTOVariants = 'register' | 'login';

export default abstract class PersonDTO<T extends Gym | number> {
  @IsNumber({}, { message: numberError('id'), groups: ['all'] })
  id!: number;

  @IsEmail({}, { message: emailError(), groups: ['all', 'register'] })
  @IsString({
    message: stringError('email'),
    groups: ['all', 'register', 'login']
  })
  email!: string;

  @IsString({
    message: stringError('password'),
    groups: ['all', 'register', 'login']
  })
  @Length(8, undefined, {
    message: lengthError('password', 8),
    groups: ['all', 'register']
  })
  password!: string;

  @IsString({
    message: stringError('firstName'),
    groups: ['all', 'register']
  })
  firstName!: string;

  @IsString({
    message: stringError('lastName'),
    groups: ['all', 'register']
  })
  lastName!: string;

  @IsOptional()
  gym!: T;

  @IsEnum(Gender, {
    message: enumError('Gender', 'gender'),
    groups: ['all', 'register']
  })
  gender!: Gender;

  @IsEnum(AppTheme, {
    message: enumError('AppTheme', 'theme'),
    groups: ['all']
  })
  theme!: AppTheme;
}
