import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateOrReject
} from 'class-validator';

import { EventTemplate, EventType } from '@hubbl/shared/models/entities';
import {
  booleanError,
  maxError,
  minError,
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';

import DTO from '../Base';
import EventTypeDTO from '../EventType';
import { DTOGroups } from '../util';

export default class EventTemplateDTO implements DTO<EventTemplate> {
  @IsNumber({}, { message: numberError('id') })
  id!: number;

  @IsString({
    message: stringError('name'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
  })
  name!: string;

  @IsOptional()
  @IsString({ message: stringError('description') })
  description!: string;

  @IsNumber(
    {},
    {
      message: numberError('capacity'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  capacity!: number;

  @IsBoolean({
    message: booleanError('covidPassport'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE]
  })
  covidPassport!: boolean;

  @IsBoolean({
    message: booleanError('maskRequired'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE]
  })
  maskRequired!: boolean;

  @IsNumber(
    {},
    {
      message: numberError('difficulty'),
      groups: [DTOGroups.ALL, DTOGroups.UPDATE]
    }
  )
  @Min(1, { message: minError('difficulty', 1) })
  @Max(5, { message: maxError('difficulty', 5) })
  difficulty!: number;

  @IsNumber(
    {},
    {
      message: numberError('type'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  type!: number;

  @IsNumber(
    {},
    {
      message: numberError('gym'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  gym!: number;

  /* Non required validation fields */
  eventCount!: number;

  private static propMapper(from: EventTemplate | any): EventTemplateDTO {
    const result = new EventTemplateDTO();

    result.id = from.id;
    result.name = from.name;
    result.description = from.description;
    result.capacity = from.capacity;
    result.covidPassport = from.covidPassport;
    result.maskRequired = from.maskRequired;
    result.difficulty = from.difficulty;
    result.type =
      from.type instanceof EventType
        ? EventTypeDTO.fromClass(from.type)
        : from.type;
    result.gym = from.gym;

    result.eventCount = from.eventCount;

    return result;
  }

  /**
   * Parses the json passed to the DTO and validates it
   *
   * @param json Body of the request
   * @param variant Variant to validate for
   * @returns The parsed `EventTemplateDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups
  ): Promise<EventTemplateDTO> {
    const result = EventTemplateDTO.propMapper(json);

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
   * @param EventTemplate The fetched event template
   * @returns The dto to be send as a response
   */
  public static fromClass(EventTemplate: EventTemplate): EventTemplateDTO {
    const result = EventTemplateDTO.propMapper(EventTemplate);

    return result;
  }

  /**
   *
   * @returns The parsed event template from the DTO
   */
  public toClass(): EventTemplate {
    const result = new EventTemplate();

    result.id = this.id;
    result.name = this.name;
    result.description = this.description;
    result.capacity = this.capacity;
    result.covidPassport = this.covidPassport;
    result.maskRequired = this.maskRequired;
    result.difficulty = this.difficulty;
    result.type = this.type;
    result.gym = this.gym;

    return result;
  }
}
