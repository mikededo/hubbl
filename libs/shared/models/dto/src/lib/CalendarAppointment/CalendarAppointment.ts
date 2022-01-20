import {
  IsBoolean,
  IsInstance,
  IsNumber,
  IsString,
  validateOrReject
} from 'class-validator';

import {
  CalendarAppointment,
  CalendarDate
} from '@hubbl/shared/models/entities';
import {
  booleanError,
  numberError,
  stringError,
  validationParser
} from '@hubbl/shared/models/helpers';

import DTO from '../Base';
import CalendarDateDTO from '../CalendarDate';
import { DTOGroups } from '../util';

export default class CalendarAppointmentDTO
  implements DTO<CalendarAppointment>
{
  @IsNumber(
    {},
    { message: numberError('id'), groups: [DTOGroups.ALL, DTOGroups.UPDATE] }
  )
  id!: number;

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
      message: numberError('calendar'),
      groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
    }
  )
  calendar!: number;

  @IsInstance(CalendarDate, {
    message: 'date',
    groups: [DTOGroups.ALL, DTOGroups.CREATE, DTOGroups.UPDATE]
  })
  date!: CalendarDate;

  private static propMapper(
    from: CalendarAppointment | any
  ): CalendarAppointmentDTO {
    const result = new CalendarAppointmentDTO();

    result.id = from.id;
    result.startTime = from.startTime;
    result.endTime = from.endTime;
    result.cancelled = from.cancelled;
    result.client = from.client;
    result.calendar = from.calendar;

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
   * @returns The parsed `CalendarAppointmenDTO`
   */
  public static async fromJson(
    json: any,
    variant: DTOGroups
  ): Promise<CalendarAppointmentDTO> {
    const result = CalendarAppointmentDTO.propMapper(json);

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
   * @returns The parsed `CalendarAppointmenDTO`
   */
  public static fromClass(
    calendarAppointment: CalendarAppointment
  ): CalendarAppointmentDTO {
    const result = CalendarAppointmentDTO.propMapper(calendarAppointment);

    return result;
  }

  /**
   *
   * @returns The parsed event from the DTO
   */
  public toClass(): CalendarAppointment {
    const appointment = new CalendarAppointment();

    appointment.id = this.id;
    appointment.startTime = this.startTime;
    appointment.endTime = this.endTime;
    appointment.cancelled = this.cancelled;
    appointment.client = this.client;
    appointment.calendar = this.calendar;
    appointment.date = this.date;

    return appointment;
  }
}
