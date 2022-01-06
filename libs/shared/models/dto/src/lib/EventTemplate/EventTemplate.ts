import {
  IsNumber,
  IsOptional,
  IsString,
  validateOrReject
} from 'class-validator';

import { EventTemplate, EventType } from '@hubbl/shared/models/entities';

import DTO from '../Base';
import { DTOGroups, numberError, stringError, validationParser } from '../util';

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
    result.type = from.type instanceof EventType ? from.type.id : from.type;
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
  public static async fromClass(
    EventTemplate: EventTemplate
  ): Promise<EventTemplateDTO> {
    const result = EventTemplateDTO.propMapper(EventTemplate);

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
   * @returns The parsed event template from the DTO
   */
  public toClass(): EventTemplate {
    const result = new EventTemplate();

    result.id = this.id;
    result.name = this.name;
    result.description = this.description;
    result.type = this.type;
    result.gym = this.gym;

    return result;
  }
}
