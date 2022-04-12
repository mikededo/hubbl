import {
  IsBoolean,
  IsInstance,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateOrReject
} from 'class-validator';

import {
  CalendarDate,
  Event,
  EventAppointment,
  EventTemplate,
  EventType,
  Gym,
  Trainer
} from '@hubbl/shared/models/entities';
import {
  booleanError,
  instanceError,
  maxError,
  minError,
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';

import DTO from '../Base';
import CalendarDateDTO from '../CalendarDate';
import EventTypeDTO from '../EventType';
import TrainerDTO from '../Trainer';
import { DTOGroups } from '../util';
import EventTemplateDTO from '../EventTemplate';

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
  trainer!: number | TrainerDTO<number | Gym>;

  @IsNumber(
    {},
    {
      message: numberError('calendar'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  calendar!: number;

  @IsNumber(
    {},
    {
      message: numberError('gym'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  gym!: number | Gym;

  @IsOptional()
  template!: EventTemplateDTO | number;

  @IsNumber(
    {},
    {
      message: numberError('eventType'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  eventType!: EventTypeDTO | number;

  @IsInstance(CalendarDate, { message: instanceError('CalendarDate', 'date') })
  date!: CalendarDate;

  /* Non required validation fields */
  appointments!: EventAppointment[];

  appointmentCount!: number;

  private static propMapper(from: Event | any): EventDTO {
    const result = new EventDTO();

    result.id = from.id;
    result.name = from.name;
    result.description = from.description;
    result.capacity = from.capacity;
    result.covidPassport = from.covidPassport;
    result.maskRequired = from.maskRequired;
    result.difficulty = from.difficulty;
    result.startTime = from.startTime;
    result.endTime = from.endTime;
    result.trainer = from.trainer;
    result.calendar = from.calendar;
    result.gym = from.gym;
    result.template = from.template;
    result.eventType = from.eventType;

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
  public static fromClass(event: Event): EventDTO {
    const result = EventDTO.propMapper(event);

    // When from class, parse the trainer if is not a number
    if (event.trainer instanceof Trainer) {
      result.trainer = TrainerDTO.fromClass(event.trainer, 'info');
    }

    // When from class, parse the event type
    if (event.eventType instanceof EventType) {
      result.eventType = EventTypeDTO.fromClass(event.eventType);
    }

    // When from class, parse the event template
    if (event.template instanceof EventTemplate) {
      result.template = EventTemplateDTO.fromClass(event.template);
    }

    result.appointments = event.appointments;
    // When events are fetched, they return the amount of appointments
    result.appointmentCount = event.appointmentCount;

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
    result.difficulty = this.difficulty;
    result.startTime = this.startTime;
    result.endTime = this.endTime;
    result.calendar = this.calendar;
    result.gym = this.gym as number;
    result.trainer = this.trainer as number;
    result.template = this.template as number;
    result.eventType = this.eventType as number;
    result.date = this.date;

    return result;
  }
}
