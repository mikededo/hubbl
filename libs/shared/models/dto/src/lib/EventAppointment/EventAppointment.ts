import {
  IsBoolean,
  IsNumber,
  IsString,
  validateOrReject
} from 'class-validator';

import { EventAppointment } from '@hubbl/shared/models/entities';

import DTO from '../Base';
import {
  booleanError,
  DTOGroups,
  numberError,
  stringError,
  validationParser
} from '../util';

export default class EventAppointmentDTO implements DTO<EventAppointment> {
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
  id!: number;

  @IsString({ message: stringError('startTime'), groups: [DTOGroups.ALL] })
  startTime!: string;

  @IsString({ message: stringError('endTime'), groups: [DTOGroups.ALL] })
  endTime!: string;

  @IsBoolean({
    message: booleanError('cancelled'),
    groups: [DTOGroups.ALL, DTOGroups.UPDATE]
  })
  cancelled!: boolean;

  @IsNumber(
    {},
    {
      message: numberError('client'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  client!: number;

  @IsNumber(
    {},
    {
      message: numberError('event'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  event!: number;

  private static propMapper(from: EventAppointment | any): EventAppointmentDTO {
    const result = new EventAppointmentDTO();

    result.id = from.id;
    result.startTime = from.startTime;
    result.endTime = from.endTime;
    result.cancelled = from.cancelled;
    result.client = from.client;
    result.event = from.event;

    return result;
  }

  /**
   * Parses the json passed to the DTO and validates it
   *
   * @param json Body of the request
   * @param variant Variant to validate for
   * @returns The parsed `EventDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups
  ): Promise<EventAppointmentDTO> {
    const result = EventAppointmentDTO.propMapper(json);

    await validateOrReject(result, {
      validationError: { target: false },
      groups: [variant]
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }

  /**
   * Parses the original class to the DTO and validates it
   *
   * @param event The fetched event
   * @returns The parsed `EventDTO`
   */
  public static async fromClass(
    event: EventAppointment
  ): Promise<EventAppointmentDTO> {
    const result = EventAppointmentDTO.propMapper(event);

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
   * @returns The parsed event from the DTO
   */
  public toClass(): EventAppointment {
    const result = new EventAppointment();

    result.id = this.id;
    result.startTime = this.startTime;
    result.endTime = this.endTime;
    result.cancelled = this.cancelled;
    result.client = this.client;
    result.event = this.event;

    return result;
  }
}
