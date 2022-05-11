import { IsEnum, IsInstance, validateOrReject } from 'class-validator';

import { CalendarDateDTO } from '@hubbl/shared/models/dto';
import { CalendarDate } from '@hubbl/shared/models/entities';
import {
  enumError,
  instanceError,
  validationParser
} from '@hubbl/shared/models/helpers';
import { GymZoneIntervals } from '@hubbl/shared/types';

export default class FetchAppointmentInterval {
  @IsInstance(CalendarDate, { message: instanceError('CalendarDate', 'date') })
  date!: CalendarDate;

  @IsEnum(GymZoneIntervals, {
    message: enumError('GymZoneIntervals', 'interval')
  })
  interval!: GymZoneIntervals;

  /**
   * Validates the body of the request
   */
  public static async validate(params: any): Promise<FetchAppointmentInterval> {
    const result = new FetchAppointmentInterval();
    const date = new CalendarDate();

    date.year = +params.year;
    date.month = +params.month;
    date.day = +params.day;

    result.date = date;
    result.interval = +params.interval;

    await validateOrReject(
      await CalendarDateDTO.fromJson({
        year: date.year,
        month: date.month,
        day: date.day
      }),
      { validationError: { target: false } }
    ).catch((errors) => {
      throw validationParser(errors, 'date');
    });

    await validateOrReject(result, {
      validationError: { target: false }
    }).catch((errors) => {
      throw validationParser(errors);
    });

    return result;
  }
}
