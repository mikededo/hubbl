import { IsBoolean, validateOrReject } from 'class-validator';

import { Client, Gym, Person } from '@gymman/shared/models/entities';
import { Gender } from '@gymman/shared/types';

import PersonDTO, { PersonDTOGroups } from '../Person';
import { booleanError, validationParser } from '../util';
import { genSalt, hash } from 'bcrypt';

export default class ClientDTO<T extends Gym | number> extends PersonDTO<T> {
  @IsBoolean({
    message: booleanError('covidPassport'),
    groups: [PersonDTOGroups.REGISTER]
  })
  covidPassport!: boolean;

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @param variant The variant of the DTO
   * @returns The parsed `ClientDTO`
   */
  public static async fromJson<T extends Gym | number>(
    json: any,
    variant: PersonDTOGroups
  ): Promise<ClientDTO<T>> {
    const result = new ClientDTO<T>();

    result.email = json.email;
    result.password = json.password;
    result.firstName = json.firstName;
    result.lastName = json.lastName;
    result.gym = json.gym;
    result.gender = json.gender;
    // Client props
    result.covidPassport = json.covidPassport;

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
   * @param client The fetched trainer
   * @param gym The gym to assign to the DTO
   * @returns The dto  to be send as a response
   */
  public static async fromClass(
    client: Client,
    gym: Gym
  ): Promise<ClientDTO<Gym>> {
    const result = new ClientDTO<Gym>();

    result.id = client.person.id;
    result.email = client.person.email;
    result.password = client.person.password;
    result.firstName = client.person.firstName;
    result.lastName = client.person.lastName;
    result.gym = gym;
    result.theme = client.person.theme;
    result.gender = client.person.gender as Gender;

    // Client props
    result.covidPassport = client.covidPassport;

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
   * @returns The parsed client from the DTO
   */
  public async toClass(): Promise<Client> {
    const client = new Client();
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

    // Set person into client
    client.person = person;

    // Set client props
    client.covidPassport = this.covidPassport;

    return client;
  }
}
