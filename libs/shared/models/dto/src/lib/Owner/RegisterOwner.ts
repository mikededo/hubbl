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

import { Owner, Person } from '@gymman/shared/models/entities';
import { Gender } from '@gymman/shared/types';

import {
  emailError,
  enumError,
  lengthError,
  numberError,
  stringError,
  validationParser
} from '../util';

export default class RegisterOwnerDTO {
  @IsEmail({}, { message: emailError(RegisterOwnerDTO) })
  @IsString({
    message: stringError(RegisterOwnerDTO, 'email')
  })
  email!: string;

  @IsString({
    message: stringError(RegisterOwnerDTO, 'password')
  })
  @Length(8, undefined, {
    message: lengthError(RegisterOwnerDTO, 'password', 8)
  })
  password!: string;

  @IsString({
    message: stringError(RegisterOwnerDTO, 'firstName')
  })
  firstName!: string;

  @IsString({
    message: stringError(RegisterOwnerDTO, 'lastName')
  })
  lastName!: string;

  @IsNumber(undefined, {
    message: numberError(RegisterOwnerDTO, 'gymId')
  })
  @IsOptional()
  gymId!: number;

  @IsEnum(Gender, {
    message: enumError(RegisterOwnerDTO, 'Gender', 'gender')
  })
  gender!: Gender;

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @returns The parsed `RegisterOwnerDTO`
   */
  public static async fromJson(json: any): Promise<RegisterOwnerDTO> {
    const result = new RegisterOwnerDTO();

    result.email = json.email;
    result.password = json.password;
    result.firstName = json.firstName;
    result.lastName = json.lastName;
    result.gymId = json.gymId;
    result.gender = json.gender;

    await validateOrReject(result, {
      validationError: { target: false }
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
    person.gym = this.gymId;

    // Set person into owner
    owner.person = person;

    return owner;
  }
}
