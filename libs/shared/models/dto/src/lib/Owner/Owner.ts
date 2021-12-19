import { genSalt, hash } from 'bcrypt';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  validateOrReject
} from 'class-validator';

import { Gym, Owner, Person } from '@gymman/shared/models/entities';
import { AppTheme, Gender } from '@gymman/shared/types';

import {
  emailError,
  enumError,
  lengthError,
  numberError,
  stringError,
  validationParser
} from '../util';

export type DTOVariants = 'register' | 'login';

export default class OwnerDTO<T extends Gym | number> {
  @IsNumber({}, { message: numberError(OwnerDTO, 'id'), groups: ['all'] })
  id!: number;

  @IsEmail({}, { message: emailError(OwnerDTO), groups: ['all', 'register'] })
  @IsString({
    message: stringError(OwnerDTO, 'email'),
    groups: ['all', 'register', 'login']
  })
  email!: string;

  @IsString({
    message: stringError(OwnerDTO, 'password'),
    groups: ['all', 'register', 'login']
  })
  @Length(8, undefined, {
    message: lengthError(OwnerDTO, 'password', 8),
    groups: ['all', 'register']
  })
  password!: string;

  @IsString({
    message: stringError(OwnerDTO, 'firstName'),
    groups: ['all', 'register']
  })
  firstName!: string;

  @IsString({
    message: stringError(OwnerDTO, 'lastName'),
    groups: ['all', 'register']
  })
  lastName!: string;

  @IsOptional()
  gym!: T;

  @IsEnum(Gender, {
    message: enumError(OwnerDTO, 'Gender', 'gender'),
    groups: ['all', 'register']
  })
  gender!: Gender;

  @IsEnum(AppTheme, {
    message: enumError(OwnerDTO, 'AppTheme', 'theme'),
    groups: ['all']
  })
  theme!: AppTheme;

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @returns The parsed `OwnerDTO`
   */
  public static async fromJson<T extends Gym | number>(
    json: any,
    variant: DTOVariants
  ): Promise<OwnerDTO<T>> {
    const result = new OwnerDTO<T>();

    result.email = json.email;
    result.password = json.password;
    result.firstName = json.firstName;
    result.lastName = json.lastName;
    result.gym = json.gym;
    result.gender = json.gender;

    await validateOrReject(result, {
      validationError: { target: false },
      groups: [variant]
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   * Parses the original class to the DTO
   *
   * @param owner The fetched owner
   * @returns The dto  to be send as a response
   */
  public static async fromClass(owner: Owner): Promise<OwnerDTO<Gym>> {
    const result = new OwnerDTO<Gym>();

    result.id = owner.person.id;
    result.email = owner.person.email;
    result.password = owner.person.password;
    result.firstName = owner.person.firstName;
    result.lastName = owner.person.lastName;
    result.gym = owner.gym;
    result.theme = owner.person.theme;
    result.gender = owner.person.gender as Gender;

    await validateOrReject(result, {
      validationError: { target: false },
      groups: ['all']
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   *
   * @returns The parsed owner from the DTO
   */
  public async toClass(): Promise<Owner> {
    const owner = new Owner();
    const person = new Person();

    // Set person fields
    person.firstName = this.firstName;
    person.lastName = this.lastName;
    person.email = this.email;

    // Encrypt password
    const salt = await genSalt(10);
    person.password = await hash(this.password, salt);

    person.gender = this.gender;
    person.gym = this.gym;

    // Set person into owner
    owner.person = person;

    return owner;
  }
}
