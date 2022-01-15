import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateOrReject
} from 'class-validator';

import { EventType } from '@hubbl/shared/models/entities';
import {
  enumError,
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';
import { AppPalette } from '@hubbl/shared/types';

import DTO from '../Base';
import { DTOGroups } from '../util';

export default class EventTypeDTO implements DTO<EventType> {
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

  @IsEnum(AppPalette, {
    message: enumError('AppPalette', 'color'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE]
  })
  labelColor!: AppPalette;

  @IsNumber(
    {},
    {
      message: numberError('gym'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  gym!: number;

  private static propMapper(from: EventType | any): EventTypeDTO {
    const result = new EventTypeDTO();

    result.id = from.id;
    result.name = from.name;
    result.description = from.description;
    result.labelColor = from.labelColor;
    result.gym = from.gym;

    return result;
  }

  /**
   * Parses the json passed to the DTO and validates it
   *
   * @param json Body of the request
   * @param variant Variant to validate for
   * @returns The parsed `EventTypeDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups
  ): Promise<EventTypeDTO> {
    const result = EventTypeDTO.propMapper(json);

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
   * @param eventType The fetched event type
   * @returns The dto to be send as a response
   */
  public static async fromClass(eventType: EventType): Promise<EventTypeDTO> {
    const result = EventTypeDTO.propMapper(eventType);

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
   * @returns The parsed event type from the DTO
   */
  public toClass(): EventType {
    const result = new EventType();

    result.id = this.id;
    result.name = this.name;
    result.description = this.description;
    result.labelColor = this.labelColor;
    result.gym = this.gym;

    return result;
  }
}
