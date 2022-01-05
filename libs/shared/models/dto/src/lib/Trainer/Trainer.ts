import { genSalt, hash } from 'bcrypt';
import { IsArray, IsNumber, IsString, validateOrReject } from 'class-validator';

import { Event, Gym, Person, Trainer } from '@hubbl/shared/models/entities';
import { Gender } from '@hubbl/shared/types';

import DTO from '../Base';
import PersonDTO, { PersonDTOGroups } from '../Person';
import {
  arrayError,
  DTOGroups,
  numberError,
  stringError,
  validationParser
} from '../util';

export default class TrainerDTO<T extends Gym | number>
  extends PersonDTO<T>
  implements DTO<Trainer>
{
  // Override the gym prop in order to validate it on register
  @IsNumber(
    {},
    { message: numberError('gym'), groups: [PersonDTOGroups.REGISTER] }
  )
  gym!: T;

  @IsNumber(
    {},
    { message: numberError('managerId'), groups: [PersonDTOGroups.REGISTER] }
  )
  managerId!: number;

  @IsString({ message: stringError('workerCode') })
  workerCode!: string;

  // As of now, it should not be validated
  @IsArray({ message: arrayError('events'), groups: [] })
  events!: Event[];

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @param variant The variant of the DTO
   * @returns The parsed `TrainerDTO`
   */
  public static async fromJson<T extends Gym | number>(
    json: any,
    variant: DTOGroups | PersonDTOGroups
  ): Promise<TrainerDTO<T>> {
    const result = new TrainerDTO<T>();

    result.id = json.id;
    result.email = json.email;
    result.password = json.password;
    result.firstName = json.firstName;
    result.lastName = json.lastName;
    result.theme = json.theme;
    result.gym = json.gym;
    result.gender = json.gender;
    // Trainer props
    result.managerId = json.managerId;
    result.workerCode = json.workerCode;
    result.events = json.events;

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
   * @param trainer The fetched trainer
   * @param gym The gym to assign to the DTO
   * @returns The dto to be send as a response
   */
  public static async fromClass(trainer: Trainer): Promise<TrainerDTO<Gym>> {
    const result = new TrainerDTO<Gym>();

    // Person props
    result.id = trainer.person.id;
    result.email = trainer.person.email;
    result.password = trainer.person.password;
    result.firstName = trainer.person.firstName;
    result.lastName = trainer.person.lastName;
    result.gym = trainer.person.gym as Gym;
    result.theme = trainer.person.theme;
    result.gender = trainer.person.gender as Gender;

    // Trainer props
    result.managerId = trainer.managerId;
    result.workerCode = trainer.workerCode;
    result.events = trainer.events;

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
   * @returns The parsed trainer from the DTO
   */
  public async toClass(): Promise<Trainer> {
    const trainer = new Trainer();
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

    // Set person into trainer
    trainer.person = person;

    // Set trainer props
    trainer.managerId = this.managerId;
    trainer.workerCode = this.workerCode;
    trainer.events = this.events;

    return trainer;
  }
}
