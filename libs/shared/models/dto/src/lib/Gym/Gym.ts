import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  validateOrReject
} from 'class-validator';

import { EventType, Gym, VirtualGym } from '@gymman/shared/models/entities';
import { ThemeColor } from '@gymman/shared/types';

import DTO from '../Base';
import { PersonDTOGroups } from '../Person';
import {
  DTOGroups,
  emailError,
  enumError,
  numberError,
  stringError,
  validationParser
} from '../util';

export default class GymDTO implements DTO<Gym> {
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
  id!: number;

  @IsString({
    message: stringError('name'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE, PersonDTOGroups.REGISTER]
  })
  name!: string;

  @IsEmail(
    {},
    {
      message: emailError(),
      groups: [DTOGroups.ALL, DTOGroups.UPDATE, PersonDTOGroups.REGISTER]
    }
  )
  email!: string;

  @IsString({ message: stringError('phone'), groups: [] })
  phone!: string;

  @IsEnum({}, { message: enumError('ThemeColor', 'color') })
  color!: ThemeColor;

  /* Non required validation fields */
  eventTypes!: EventType[];

  virtualGyms!: VirtualGym[];

  /**
   * Parses the json passed to the DTO and it validates
   *
   * @param json Body of the request
   * @returns The parsed `GymDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups | PersonDTOGroups
  ): Promise<GymDTO> {
    const result = new GymDTO();

    result.id = json.id;
    result.name = json.name;
    result.email = json.email;
    result.phone = json.phone;
    result.color = json.color;

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
   * @param gym The fetched gym
   * @returns The dto to be send as a response
   */
  public static async fromClass(gym: Gym): Promise<GymDTO> {
    const result = new GymDTO();

    result.id = gym.id;
    result.name = gym.name;
    result.email = gym.email;
    result.phone = gym.phone;
    result.color = gym.color;
    result.eventTypes = gym.eventTypes;
    result.virtualGyms = gym.virtualGyms;

    await validateOrReject(result, {
      validationError: { target: false },
      groups: [DTOGroups.ALL]
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  public toClass(): Gym {
    const result = new Gym();

    result.id = this.id;
    result.name = this.name;
    result.email = this.email;
    result.phone = this.phone;
    result.color = this.color;
    result.eventTypes = this.eventTypes || [];
    result.virtualGyms = this.virtualGyms || [];

    return result;
  }
}
