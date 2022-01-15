import { genSalt, hash } from 'bcrypt';
import { IsNotEmpty, validateOrReject } from 'class-validator';

import { Gym, Owner, Person } from '@hubbl/shared/models/entities';
import { validationParser } from '@hubbl/shared/models/helpers';
import { Gender } from '@hubbl/shared/types';

import DTO from '../Base';
import GymDTO from '../Gym';
import PersonDTO, { PersonDTOGroups } from '../Person';
import { DTOGroups } from '../util';

export default class OwnerDTO<T extends Gym | number>
  extends PersonDTO<T>
  implements DTO<Owner>
{
  // Override the gym groups
  @IsNotEmpty({ groups: [PersonDTOGroups.REGISTER] })
  gym!: T;

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @returns The parsed `OwnerDTO`
   */
  public static async fromJson<T extends Gym | number>(
    json: any,
    variant: DTOGroups | PersonDTOGroups
  ): Promise<OwnerDTO<T>> {
    const result = new OwnerDTO<T>();

    result.id = json.id;
    result.email = json.email;
    result.password = json.password;
    result.firstName = json.firstName;
    result.lastName = json.lastName;
    result.theme = json.theme;
    result.gym = json.gym;
    result.gender = json.gender;

    if (variant === PersonDTOGroups.REGISTER) {
      // Validate the gym
      await GymDTO.fromJson(json.gym || {}, variant);
    }

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
    result.theme = owner.person.theme;
    result.gender = owner.person.gender as Gender;

    // Parse the gym to a dto and after to a class
    const gymDto = await GymDTO.fromClass(owner.person.gym as Gym);
    result.gym = gymDto.toClass();

    await validateOrReject(result, {
      validationError: { target: false },
      groups: [DTOGroups.ALL]
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
    person.id = this.id;
    person.firstName = this.firstName;
    person.lastName = this.lastName;
    person.email = this.email;

    // Encrypt password
    const salt = await genSalt(10);
    person.password = await hash(this.password, salt);

    person.theme = this.theme;
    person.gender = this.gender;
    person.gym = this.gym;

    // Set person into owner
    owner.person = person;

    return owner;
  }
}
