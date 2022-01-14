import {
  IsBoolean,
  IsInstance,
  IsNumber,
  IsOptional,
  IsString,
  validateOrReject
} from 'class-validator';

import {
  CalendarDate,
  Event,
  EventAppointment
} from '@hubbl/shared/models/entities';
import {
  booleanError,
  instanceError,
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';

import DTO from '../Base';
import CalendarDateDTO from '../CalendarDate';
import { DTOGroups } from '../util';

export default class EventDTO implements DTO<Event> {
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
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

  @IsString({
    message: stringError('startTime'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
  })
  startTime!: string;

  @IsString({
    message: stringError('endTime'),
    groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
  })
  endTime!: string;

  @IsNumber(
    {},
    {
      message: numberError('trainer'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  trainer!: number;

  @IsNumber(
    {},
    {
      message: numberError('calendar'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  calendar!: number;

  @IsOptional()
  template!: number;

  @IsInstance(CalendarDate, { message: instanceError('CalendarDate', 'date') })
  date!: CalendarDate;

  /* Non required validation fields */
  appointments!: EventAppointment[];

  private static propMapper(from: Event | any): EventDTO {
    const result = new EventDTO();

    result.id = from.id;
    result.name = from.name;
    result.description = from.description;
    result.capacity = from.capacity;
    result.covidPassport = from.covidPassport;
    result.maskRequired = from.maskRequired;
    result.startTime = from.startTime;
    result.endTime = from.endTime;
    result.trainer = from.trainer;
    result.calendar = from.calendar;
    result.template = from.template;

    result.date = new CalendarDate();
    result.date.year = from.date.year;
    result.date.month = from.date.month;
    result.date.day = from.date.day;

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
  ): Promise<EventDTO> {
    const result = EventDTO.propMapper(json);

    await validateOrReject(await CalendarDateDTO.fromJson(json.date), {
      validationError: { target: false }
    }).catch((errors) => {
      throw validationParser(errors, 'date');
    });

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
  public static async fromClass(event: Event): Promise<EventDTO> {
    const result = EventDTO.propMapper(event);

    result.appointments = event.appointments;

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
  public toClass(): Event {
    const result = new Event();

    result.id = this.id;
    result.name = this.name;
    result.description = this.description;
    result.capacity = this.capacity;
    result.covidPassport = this.covidPassport;
    result.maskRequired = this.maskRequired;
    result.startTime = this.startTime;
    result.endTime = this.endTime;
    result.trainer = this.trainer;
    result.calendar = this.calendar;
    result.template = this.template;
    result.date = this.date;

    return result;
  }
}
