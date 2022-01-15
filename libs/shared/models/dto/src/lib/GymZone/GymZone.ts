import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateOrReject
} from 'class-validator';

import { Calendar, GymZone, VirtualGym } from '@hubbl/shared/models/entities';
import {
  booleanError,
  enumError,
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';
import { GymZoneIntervals } from '@hubbl/shared/types';

import DTO from '../Base';
import { DTOGroups } from '../util';

export default class GymZoneDTO implements DTO<GymZone> {
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
  id!: number;

  @IsString({
    message: stringError('name'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE]
  })
  name!: string;

  @IsOptional()
  @IsString({ message: stringError('description') })
  description!: string;

  @IsBoolean({
    message: booleanError('isClassType'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
  })
  isClassType!: boolean;

  @IsNumber(
    {},
    {
      message: numberError('capacity'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  capacity!: number;

  @IsBoolean({
    message: booleanError('maskRequired'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
  })
  maskRequired!: boolean;

  @IsBoolean({
    message: booleanError('covidPassport'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
  })
  covidPassport!: boolean;

  @IsString({
    message: stringError('openTime'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE, DTOGroups.CREATE]
  })
  openTime!: string;

  @IsString({
    message: stringError('closeTime'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE, DTOGroups.CREATE]
  })
  closeTime!: string;

  @IsEnum(GymZoneIntervals, {
    message: enumError('GymZoneIntervals', 'timeIntervals'),
    each: true,
    groups: [DTOGroups.ALL, DTOGroups.UPDATE]
  })
  timeIntervals!: GymZoneIntervals[];

  @IsNumber(
    {},
    {
      message: numberError('virtualGym'),
      groups: [DTOGroups.ALL, DTOGroups.UPDATE, DTOGroups.CREATE]
    }
  )
  virtualGym!: number;

  @IsNumber(
    {},
    {
      message: numberError('calendar'),
      groups: [DTOGroups.ALL, DTOGroups.UPDATE]
    }
  )
  calendar!: number;

  private static propMapper(from: GymZone | any): GymZoneDTO {
    const result = new GymZoneDTO();

    result.id = from.id;
    result.name = from.name;
    result.description = from.description;
    result.isClassType = from.isClassType;
    result.capacity = from.capacity;
    result.maskRequired = from.maskRequired;
    result.covidPassport = from.covidPassport;
    result.openTime = from.openTime;
    result.closeTime = from.closeTime;
    result.timeIntervals = from.timeIntervals;

    result.virtualGym =
      from.virtualGym instanceof VirtualGym
        ? from.virtualGym.id
        : from.virtualGym;

    result.calendar =
      from.calendar instanceof Calendar ? from.calendar.id : from.calendar;

    return result;
  }

  /**
   * Parses the json passed to the DTO and validates it
   * @param json Body of the request
   * @param variant Variant to validate for
   * @returns The parsed `GymZoneDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups
  ): Promise<GymZoneDTO> {
    const result = GymZoneDTO.propMapper(json);

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
   * @param gymZone The fetched gym zone
   * @returns The dto to be send as a response
   */
  public static async fromClass(gymZone: GymZone): Promise<GymZoneDTO> {
    const result = GymZoneDTO.propMapper(gymZone);

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
   * @returns The parsed gym zone from the DTO
   */
  public toClass(): GymZone {
    const result = new GymZone();

    result.id = this.id;
    result.name = this.name;
    result.description = this.description;
    result.isClassType = this.isClassType;
    result.capacity = this.capacity;
    result.maskRequired = this.maskRequired;
    result.covidPassport = this.covidPassport;
    result.openTime = this.openTime;
    result.closeTime = this.closeTime;
    result.timeIntervals = this.timeIntervals;
    result.virtualGym = this.virtualGym;

    result.calendar = this.calendar ?? new Calendar();

    return result;
  }
}
